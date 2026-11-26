"""Look-ups at ESPN's public site API that a browser cannot make itself (the API sends no CORS header).

Today: the logo versions of a team (primary, dark, secondary, white, black ...). Asked for only by a scorebug that is being drawn,
cached in Home Assistant's storage for 30 days (a failed look-up for an hour), so a team is looked up about once a month.

ESPN's site API is public but undocumented and can change; every parser here takes what it finds and ignores the rest.
"""

from __future__ import annotations

import asyncio
import logging
import re
import time
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.storage import Store

_LOGGER = logging.getLogger(__name__)

SITE = "https://site.api.espn.com/apis/site/v2/sports"
TEAM_URL = SITE + "/{sport}/{league}/teams/{team}"
TEAMS_URL = SITE + "/{sport}/{league}/teams?limit=1000"
SCOREBOARD_URL = SITE + "/{sport}/{league}/scoreboard"
SCHEDULE_URL = SITE + "/{sport}/{league}/teams/{team}/schedule"
SUMMARY_URL = SITE + "/{sport}/{league}/summary?event={event}"
CORE_EVENT_URL = "https://sports.core.api.espn.com/v2/sports/{sport}/leagues/{league}/events/{event}"
# a live game's situation (under 1 KB): basketball's timeouts, team fouls and bonus; hockey's power play; baseball's pitcher and batter
SITUATION_URL = CORE_EVENT_URL + "/competitions/{event}/situation"
CORE_PREFIX = "http://sports.core.api.espn.com/v2/sports/"


def core_ref(ref: Any) -> str | None:
    """A link inside a core-API reply ("$ref", http) as an https address on the same server; None for anything else."""
    if not isinstance(ref, str) or not (ref.startswith(CORE_PREFIX) or ref.startswith(CORE_PREFIX.replace("http:", "https:"))):
        return None
    return "https://" + ref.split("://", 1)[1].split("?")[0]
STANDINGS_URL = "https://site.api.espn.com/apis/v2/sports/{sport}/{league}/standings"
KEEP_FOUND = 30 * 24 * 3600
KEEP_FAILED = 3600
MAX_TEAMS = 24  # per request; a screen never shows more than a handful of games

SPORT_RE = re.compile(r"^[a-z][a-z-]{1,30}$")
# ESPN cup codes have underscores (eng.league_cup)
LEAGUE_RE = re.compile(r"^[a-z0-9][a-z0-9._-]{0,40}$")
TEAM_RE = re.compile(r"^[0-9]{1,9}$")
ATHLETE_LIST_MAX = 400

# ESPN's logo tags ("rel") -> the names scorebugs use. The 4096 px guid logos are asked for at the drawn size by the browser.
_REL = {
    ("default",): "default",
    ("dark",): "dark",
    ("scoreboard",): "scoreboard",
    ("scoreboard", "dark"): "scoreboard_dark",
    ("secondary_logo_on_black_color",): "secondary",
    ("primary_logo_white",): "white",
    ("secondary_logo_white",): "secondary-white",
    ("primary_logo_black",): "black",
}
_ONLY_IF_MISSING = {("secondary_logo_on_white_color",): "secondary"}  # used when there is no "on black" secondary
# the short names above that repeat one of the plain names below (kept for the card's bug_logos and older sensors)
ALIASES = {"white", "black", "secondary", "scoreboard_dark"}
LOGOS_VERSION = 2  # cache entries made before every logo was kept are looked up again


def logo_name(rel: tuple) -> str:
    """ESPN's tag for a logo as a plain name: ("primary_logo_on_white_color",) -> "primary-on-white", ("scoreboard", "dark") ->
    "scoreboard-dark". Every logo ESPN lists for a team gets one, so any of them can be picked."""
    name = "-".join(rel).replace("primary_logo_", "primary-").replace("secondary_logo_", "secondary-").replace("_color", "")
    return name.replace("_", "-")


def logo_label(name: str) -> str:
    """A name as people read it: "primary-on-white" -> "Primary, on white"."""
    if name == "default":
        return "Default"
    head, _, rest = name.partition("-")
    return head.capitalize() + (", " + rest.replace("-", " ") if rest else "")


def team_key(sport: str, league: str, team: str) -> str:
    return f"{sport}/{league}/{team}"


def valid_team(sport: Any, league: Any, team: Any) -> bool:
    return all(isinstance(v, str) for v in (sport, league, team)) and bool(
        SPORT_RE.match(sport) and LEAGUE_RE.match(league) and TEAM_RE.match(team)
    )


def parse_logos(reply: Any) -> dict[str, str]:
    """The logo addresses in an ESPN team reply, by scorebug name. Only https addresses on ESPN's own image server are kept."""
    team = reply.get("team") if isinstance(reply, dict) else None
    out: dict[str, str] = {}
    spare: dict[str, str] = {}
    for logo in (team or {}).get("logos") or []:
        if not isinstance(logo, dict):
            continue
        href = logo.get("href")
        if not isinstance(href, str) or not href.startswith("https://a.espncdn.com/"):
            continue
        rel = tuple(r for r in (logo.get("rel") or []) if r != "full")
        if rel in _REL and _REL[rel] not in out:
            out[_REL[rel]] = href
        elif rel in _ONLY_IF_MISSING:
            spare.setdefault(_ONLY_IF_MISSING[rel], href)
        name = logo_name(rel)
        if rel and re.fullmatch(r"[a-z0-9-]{1,40}", name):
            out.setdefault(name, href)
    for name, href in spare.items():
        out.setdefault(name, href)
    return out


def parse_info(reply: Any) -> dict[str, str]:
    """A team's colours, names and plain logo from an ESPN team reply (what a schedule leaves out)."""
    team = reply.get("team") if isinstance(reply, dict) else None
    if not isinstance(team, dict):
        return {}
    hexok = lambda c: isinstance(c, str) and len(c) == 6 and all(ch in "0123456789abcdefABCDEF" for ch in c)  # noqa: E731
    logos = parse_logos(reply)
    out = {"abbr": team.get("abbreviation"), "name": team.get("shortDisplayName"), "long_name": team.get("displayName"),
           "color": "#" + team["color"] if hexok(team.get("color")) else None,
           "color2": "#" + team["alternateColor"] if hexok(team.get("alternateColor")) else None,
           "logo": logos.get("scoreboard") or logos.get("default")}
    return {k: v for k, v in out.items() if v}


def parse_team_list(reply: Any) -> list[dict[str, str]]:
    """[{id, abbr, name}] from an ESPN /teams reply, sorted by name."""
    out = []
    for league in _walk(reply, "sports", "leagues"):
        for item in league.get("teams") or []:
            t = item.get("team") if isinstance(item, dict) else None
            if isinstance(t, dict) and TEAM_RE.match(str(t.get("id", ""))):
                out.append({"id": str(t["id"]), "abbr": t.get("abbreviation") or "", "name": t.get("displayName") or t.get("name") or ""})
    return sorted(out, key=lambda t: t["name"])


def parse_seeds(reply: Any) -> dict[str, int]:
    """{team id: playoff seed} from an ESPN /standings reply (conferences or divisions as children, entries with a playoffSeed stat)."""
    out: dict[str, int] = {}

    def walk(node: Any) -> None:
        if not isinstance(node, dict):
            return
        for e in (node.get("standings") or {}).get("entries") or []:
            tid = str((e.get("team") or {}).get("id") or "")
            seed = next((s.get("value") for s in e.get("stats") or [] if isinstance(s, dict) and s.get("name") == "playoffSeed"), None)
            if TEAM_RE.match(tid) and isinstance(seed, (int, float)) and 0 < seed < 100:
                out[tid] = int(seed)
        for child in node.get("children") or []:
            walk(child)

    walk(reply)
    return out


def parse_athletes(reply: Any) -> list[dict[str, str]]:
    """[{id, name}] of the players, drivers or fighters in an individual sport's scoreboard (its current event), sorted by name."""
    found: dict[str, str] = {}
    for ev in (reply.get("events") or []) if isinstance(reply, dict) else []:
        comps = list(ev.get("competitions") or []) + [c for g in ev.get("groupings") or [] for c in g.get("competitions") or []]
        for c in comps:
            for x in (c.get("competitors") or []) if isinstance(c, dict) else []:
                name = ((x.get("athlete") or {}).get("displayName") if isinstance(x, dict) else None)
                if name and TEAM_RE.match(str(x.get("id") or "")):
                    found.setdefault(str(x["id"]), name)
    return sorted(({"id": k, "name": v} for k, v in found.items()), key=lambda t: t["name"])[:ATHLETE_LIST_MAX]


def _walk(reply: Any, outer: str, inner: str) -> list[dict]:
    found = []
    for o in (reply.get(outer) or []) if isinstance(reply, dict) else []:
        for i in (o.get(inner) or []) if isinstance(o, dict) else []:
            if isinstance(i, dict):
                found.append(i)
    return found


async def fetch_json(hass: HomeAssistant, url: str, timeout: float = 15) -> Any:
    """GET an ESPN address and decode it; None on any failure (logged at debug level: ESPN hiccups are normal)."""
    session = async_get_clientsession(hass)
    try:
        async with asyncio.timeout(timeout):
            resp = await session.get(url)
            if resp.status != 200:
                _LOGGER.debug("ESPN answered %s for %s", resp.status, url)
                return None
            return await resp.json(content_type=None)
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("ESPN not reachable for %s: %s", url, err)
        return None


class LogoBook:
    """Team logo versions, looked up when asked for and kept in .storage/scorebugs.team_logos."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, 1, "scorebugs.team_logos")
        self._data: dict[str, dict[str, Any]] | None = None
        self._lock = asyncio.Lock()
        self._busy: dict[str, asyncio.Task] = {}

    async def _load(self) -> dict[str, dict[str, Any]]:
        if self._data is None:
            async with self._lock:
                if self._data is None:
                    self._data = (await self._store.async_load() or {}).get("teams", {})
        return self._data

    def _fresh(self, entry: dict[str, Any] | None, now: float) -> bool:
        if not entry:
            return False
        if entry.get("v") and entry.get("r") != LOGOS_VERSION:
            return False
        keep = KEEP_FOUND if entry.get("v") and "i" in entry else KEEP_FAILED
        return now - entry.get("at", 0) < keep

    async def _fetch(self, sport: str, league: str, team: str) -> tuple[dict[str, str], dict[str, str]] | None:
        reply = await fetch_json(self._hass, TEAM_URL.format(sport=sport, league=league, team=team))
        return (parse_logos(reply), parse_info(reply)) if reply is not None else None

    async def get(self, teams: list[dict[str, str]]) -> dict[str, dict[str, str]]:
        """Logo versions by "sport/league/id" for these teams; a team ESPN does not know maps to {}."""
        return {k: dict(e.get("v") or {}) for k, e in (await self._entries(teams)).items()}

    async def info(self, teams: list[dict[str, str]]) -> dict[str, dict[str, str]]:
        """Colours, names and plain logo by "sport/league/id" (cached with the logos)."""
        return {k: dict(e.get("i") or {}) for k, e in (await self._entries(teams)).items()}

    async def _entries(self, teams: list[dict[str, str]]) -> dict[str, dict[str, Any]]:
        data = await self._load()
        now = time.time()
        wanted = []
        for t in teams[:MAX_TEAMS]:
            sport, league, team = t.get("sport"), t.get("league"), t.get("id")
            if valid_team(sport, league, team):
                wanted.append((sport, league, team))
        todo = [w for w in wanted if not self._fresh(data.get(team_key(*w)), now)]
        if todo:
            for w in todo:
                k = team_key(*w)
                if k not in self._busy:
                    self._busy[k] = self._hass.async_create_task(self._fetch(*w), f"scorebugs logos {k}")
            results = await asyncio.gather(*(self._busy[team_key(*w)] for w in todo))
            for w, found in zip(todo, results):
                k = team_key(*w)
                self._busy.pop(k, None)
                logos, info = found or ({}, {})
                data[k] = {"at": now, "v": logos, "i": info, "r": LOGOS_VERSION}
            for k in [k for k, e in data.items() if now - e.get("at", 0) > KEEP_FOUND]:  # drop what nobody asked for in a month
                del data[k]
            self._store.async_delay_save(lambda: {"teams": data}, 5)
        return {team_key(*w): data.get(team_key(*w)) or {} for w in wanted}
