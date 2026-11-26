"""Serves the browser files (kit.js, card.js, bugs/, fonts/, catalogue.json) from /scorebugs/frontend/<path>.

Home Assistant's own static file serving cannot say "always re-check this file", so browsers may keep an old copy for days after an
update. These are served with `Cache-Control: no-cache`: the browser keeps its copy but asks every time whether it changed (a cheap
"not modified" when it did not), so an update shows on the next page load.

No login, like Home Assistant's own frontend files: only code, fonts and the bug list live in this folder, never entities or secrets.
"""

from __future__ import annotations

from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN, URL_BASE

FOLDER = Path(__file__).parent / "frontend"


class FrontendView(HomeAssistantView):
    """GET /scorebugs/frontend/<path>: one file from the frontend folder, never anything outside it."""

    url = URL_BASE + "/{path:.+}"
    name = "scorebugs:frontend"
    requires_auth = False

    def __init__(self, hass: HomeAssistant, folder: Path = FOLDER) -> None:
        self._hass = hass
        self._folder = folder

    def _find(self, path: str) -> Path | None:
        """The file to send, or None. Runs off the event loop because it touches the disk."""
        root = self._folder.resolve()
        target = (root / path).resolve()
        if root not in target.parents:  # a path that climbs out of the folder
            return None
        return target if target.is_file() else None

    async def get(self, request: web.Request, path: str) -> web.StreamResponse:
        target = await self._hass.async_add_executor_job(self._find, path)
        if target is None:
            raise web.HTTPNotFound()
        return web.FileResponse(target, headers={"Cache-Control": "no-cache"})


class TeamLogosView(HomeAssistantView):
    """POST /api/scorebugs/team_logos {"teams": [{sport, league, id}]}: the same answer as the scorebugs/team_logos websocket command.

    For displays that talk to Home Assistant over REST (Glass Panes' player). Needs a login like any /api/ address.
    """

    url = "/api/scorebugs/team_logos"
    name = "api:scorebugs:team_logos"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def post(self, request: web.Request) -> web.Response:
        data = self._hass.data.get(DOMAIN)
        if data is None:
            raise web.HTTPNotFound()
        try:
            body = await request.json()
        except ValueError:
            raise web.HTTPBadRequest() from None
        teams = body.get("teams") if isinstance(body, dict) else None
        if not isinstance(teams, list):
            raise web.HTTPBadRequest()
        found = await data.logos.get([t for t in teams if isinstance(t, dict)])
        return web.json_response({"teams": found})
