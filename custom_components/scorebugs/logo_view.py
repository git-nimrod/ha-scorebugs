"""GET /scorebugs/logo?k=<name>&s=<server>&p=<path>&w=<px>: logos served by Home Assistant itself.

Two sources, in this order:
1. A team's own logo, only when the person chose one for it (Configure > Use your own logo uploads it to /config/scorebugs/logos/
   as <league>/<team id>.png|webp|jpg; the team's sensor then names it as `k`). ESPN's logo is the default; nothing is looked up
   in this folder unless the person picked their own picture.
2. A cache of the image named by `s` (espn, wiki-upload or wiki-thumb), `p` (its path) and `w` (ESPN's size), built back into an
   address on ESPN's or Wikimedia's image servers only (no address is ever passed whole: Home Assistant's security filter refuses those), fetched the first time a display draws it and kept in
   Home Assistant's cache folder (/config/.cache/scorebugs/logos, not in backups). Refetched after 30 days; an old copy is served
   while ESPN is down. At most 100 MB: the oldest files go first.

So a display asks only its own Home Assistant for logos; ESPN and Wikimedia see Home Assistant once per logo a month instead of every
screen on every draw. No login, like the frontend files: the answer is a public logo or a file the person chose to show, and the
address list keeps it from being used to fetch anything else. Anything wrong is a 404 and the browser loads the logo directly as before.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
import os
import re
import time
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)

URL = "/scorebugs/logo"
KEEP = 30 * 24 * 3600
RETRY_FAILED = 3600
MAX_FILE = 2 * 1024 * 1024
MAX_TOTAL = 100 * 1024 * 1024
PRUNE_EVERY = 25  # writes between size checks
FETCHES_AT_ONCE = 4

# the image addresses that may be cached (kit.js has the same list)
_PATH = r"/(?:i/teamlogos|i/leaguelogos|i/headshots|i/flags|guid)/[A-Za-z0-9/_.-]+\.png"
CACHEABLE = (
    re.compile(r"^https://a\.espncdn\.com/combiner/i\?img=" + _PATH + r"&w=\d{1,4}&h=\d{1,4}$"),
    re.compile(r"^https://a\.espncdn\.com" + _PATH + r"$"),
    re.compile(r"^https://(?:upload|thumb)\.wikimedia\.org/wikipedia/(?:en|commons)/[A-Za-z0-9/_.%(),~-]+\.(?:png|jpe?g|webp)$"),
)
KEY_RE = re.compile(r"^[a-z0-9-]{1,20}/[a-z0-9-]{1,60}$")
OWN_TYPES = {".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}


SERVERS = {"espn": "https://a.espncdn.com/", "wiki-upload": "https://upload.wikimedia.org/", "wiki-thumb": "https://thumb.wikimedia.org/"}


def source_url(server: str | None, path: str | None, width: str | None) -> str | None:
    """The image address from the request's parts, or None when it is not one Home Assistant may fetch."""
    base = SERVERS.get(server or "")
    if not base or not path or path.startswith("/"):
        return None
    if server == "espn" and width:
        if not width.isdigit() or not 0 < int(width) <= 2048:
            return None
        url = f"{base}combiner/i?img=/{path}&w={width}&h={width}"
    else:
        url = base + path
    return url if cacheable(url) else None


def cacheable(url: str | None) -> bool:
    return isinstance(url, str) and ".." not in url and any(r.match(url) for r in CACHEABLE)


def sniff(head: bytes) -> str | None:
    """The image type from a file's first bytes (never from what a server says): PNG, JPEG, WebP or GIF; anything else is refused."""
    if head.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if head.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "image/webp"
    if head[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    return None


def own_folder(hass: HomeAssistant) -> Path:
    return Path(hass.config.path("scorebugs", "logos"))


MARK = "marks/network"   # the person's own mark for the network's spot on a bug (Configure > Your own mark)


def own_name(league: str, team_id: str) -> str:
    """A followed team's own-logo name: "nfl/12" (league code, ESPN team id)."""
    return f"{str(league).lower()}/{str(team_id).lower()}"


def whole(body: bytes) -> bool:
    """True when a picture's end is there too (a download cut short is never kept): PNG ends with its IEND chunk, JPEG with its
    end marker, WebP is as long as its header says, GIF ends with its trailer."""
    kind = sniff(body[:16])
    if kind == "image/png":
        return body.endswith(b"IEND\xaeB`\x82")
    if kind == "image/jpeg":
        return b"\xff\xd9" in body[-64:]
    if kind == "image/webp":
        return len(body) >= 12 and int.from_bytes(body[4:8], "little") + 8 == len(body)
    if kind == "image/gif":
        return body.rstrip(b"\0").endswith(b"\x3b")
    return False


def find_own(folder: Path, key: str) -> Path | None:
    """The person's own file for this name, never anything outside the folder."""
    if not KEY_RE.match(key or ""):
        return None
    root = folder.resolve() if folder.is_dir() else None
    if root is None:
        return None
    for ext in OWN_TYPES:
        target = (root / (key + ext)).resolve()
        if root in target.parents and target.is_file():
            return target
    return None


def save_own(folder: Path, key: str, source: Path) -> bool:
    """Keep an uploaded picture as this team's own logo. False when it is not a PNG, WebP or JPG of at most 2 MB. Runs off the loop."""
    if not KEY_RE.match(key or ""):
        return False
    body = source.read_bytes()[: MAX_FILE + 1]
    kind = sniff(body[:16])
    if len(body) > MAX_FILE or kind not in ("image/png", "image/webp", "image/jpeg"):
        return False
    ext = {"image/png": ".png", "image/webp": ".webp", "image/jpeg": ".jpg"}[kind]
    target = folder / (key + ext)
    target.parent.mkdir(parents=True, exist_ok=True)
    if folder.resolve() not in target.resolve().parents:
        return False
    remove_own(folder, key)
    target.write_bytes(body)
    return True


def remove_own(folder: Path, key: str) -> None:
    """Delete a team's own logo (every type), if there is one. Runs off the loop."""
    while (found := find_own(folder, key)) is not None:
        found.unlink()


class LogoView(HomeAssistantView):
    url = URL
    name = "scorebugs:logo"
    requires_auth = False

    def __init__(self, hass: HomeAssistant, own: Path | None = None, cache: Path | None = None) -> None:
        self._hass = hass
        self._own = own or own_folder(hass)
        self._cache = cache or Path(hass.config.cache_path("scorebugs", "logos"))
        self._busy: dict[str, asyncio.Task] = {}
        self._failed: dict[str, float] = {}
        self._gate = asyncio.Semaphore(FETCHES_AT_ONCE)
        self._writes = 0

    async def get(self, request: web.Request) -> web.StreamResponse:
        q = request.query
        key, url = q.get("k"), source_url(q.get("s"), q.get("p"), q.get("w"))
        if key:
            own = await self._hass.async_add_executor_job(find_own, self._own, key)
            if own is not None:
                return web.FileResponse(own, headers={"Content-Type": OWN_TYPES[own.suffix.lower()], "Cache-Control": "no-cache",
                                                      "X-Content-Type-Options": "nosniff"})
        if url is None:
            raise web.HTTPNotFound()
        found = await self._cached(url)
        if found is None:
            raise web.HTTPNotFound()
        body, kind = found
        return web.Response(body=body, content_type=kind, headers={"Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff"})

    # ---- the cache

    def _file(self, url: str) -> Path:
        return self._cache / (hashlib.sha256(url.encode()).hexdigest()[:40] + ".img")

    def _read(self, path: Path) -> tuple[bytes, float] | None:
        try:
            return path.read_bytes(), path.stat().st_mtime
        except OSError:
            return None

    def _write(self, path: Path, body: bytes) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_suffix(".part")
        tmp.write_bytes(body)
        os.replace(tmp, path)

    def _prune(self) -> None:
        """Keep the cache under MAX_TOTAL: the files fetched longest ago go first."""
        try:
            files = sorted((p.stat().st_mtime, p.stat().st_size, p) for p in self._cache.glob("*.img"))
        except OSError:
            return
        total = sum(s for _, s, _ in files)
        for _, size, path in files:
            if total <= MAX_TOTAL:
                break
            try:
                path.unlink()
                total -= size
            except OSError:
                pass

    async def _cached(self, url: str) -> tuple[bytes, str] | None:
        path = self._file(url)
        have = await self._hass.async_add_executor_job(self._read, path)
        if have and time.time() - have[1] < KEEP and whole(have[0]):
            return have[0], sniff(have[0][:16])
        if time.time() - self._failed.get(url, 0) < RETRY_FAILED:
            return (have[0], sniff(have[0][:16])) if have and sniff(have[0][:16]) else None
        if url not in self._busy:
            self._busy[url] = self._hass.async_create_task(self._fetch(url, path), "scorebugs logo")
        try:
            body = await asyncio.shield(self._busy[url])
        finally:
            if url in self._busy and self._busy[url].done():
                self._busy.pop(url, None)
        if body is None:
            self._failed[url] = time.time()
            if len(self._failed) > 2000:
                self._failed.clear()
            return (have[0], sniff(have[0][:16])) if have and sniff(have[0][:16]) else None  # an old copy beats nothing
        self._failed.pop(url, None)
        return body, sniff(body[:16])  # type: ignore[return-value]

    async def _fetch(self, url: str, path: Path) -> bytes | None:
        async with self._gate:
            try:
                async with asyncio.timeout(15):
                    resp = await async_get_clientsession(self._hass).get(url, allow_redirects=False)
                    if resp.status != 200:
                        _LOGGER.debug("Logo %s: answer %s", url, resp.status)
                        return None
                    body = b""
                    async for chunk in resp.content.iter_chunked(65536):  # read(n) gives only what has arrived so far
                        body += chunk
                        if len(body) > MAX_FILE:
                            break
            except Exception as err:  # noqa: BLE001
                _LOGGER.debug("Logo %s not reachable: %s", url, err)
                return None
        if len(body) > MAX_FILE or not whole(body):
            _LOGGER.debug("Logo %s refused: not a whole picture, or too big", url)
            return None
        try:
            await self._hass.async_add_executor_job(self._write, path, body)
            self._writes += 1
            if self._writes % PRUNE_EVERY == 1:
                await self._hass.async_add_executor_job(self._prune)
        except OSError as err:
            _LOGGER.debug("Logo %s not saved: %s", url, err)
        return body
