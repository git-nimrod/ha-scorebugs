"""Scorebugs: TV-style scorebugs for Home Assistant.

What it does when set up:
- serves its browser files (the bug code, the bug list, the fonts) from /scorebugs/frontend/;
- adds the Scorebug card to every dashboard (Home Assistant's `frontend.add_extra_js_url`, so nobody adds a resource by hand);
- answers two websocket commands: scorebugs/info and scorebugs/team_logos;
- serves logos from /scorebugs/logo: the person's own (/config/scorebugs/logos/) or a cached copy of ESPN's or Wikimedia's (logo_view.py);
- gives other integrations (Glass Panes) `hass.data["scorebugs"]`: version, plug number (API), the files' address and the bug list.

My teams (Configure): each followed team gets a sensor with its current game, from one ESPN scoreboard request per league that
has a followed team, paced by the games (20 s live, 5 min on game day, hourly otherwise). Nothing else is fetched on its own;
extra logo versions are looked up only when a bug that needs them is drawn.
"""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send

from . import looks, ws_api
from .const import API, CARD_URL, DOMAIN, URL_BASE
from .espn import LogoBook
from .frontend_view import FOLDER, FrontendView, TeamLogosView
from .logo_view import LogoView
from .leagues import LEAGUES
from .tracker import LeagueTracker

PLATFORMS = [Platform.SENSOR, Platform.SELECT]

_LOGGER = logging.getLogger(__name__)


@dataclass
class ScorebugsData:
    """What Scorebugs offers other integrations through hass.data["scorebugs"]."""

    version: str
    url: str
    catalogue: dict[str, Any]
    logos: LogoBook
    api: int = API
    card_url: str = field(default="")
    trackers: list[LeagueTracker] = field(default_factory=list)
    structural: Any = None   # the settings that need a reload when they change (looks.structural)


def _read_files(folder: Path) -> tuple[str, dict[str, Any]]:
    version = json.loads((folder.parent / "manifest.json").read_text(encoding="utf-8")).get("version", "0")
    try:
        catalogue = json.loads((folder / "catalogue.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        _LOGGER.error("Scorebugs' bug list (frontend/catalogue.json) is missing or broken; reinstall Scorebugs")
        catalogue = {"bugs": []}
    return version, catalogue


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    version, catalogue = await hass.async_add_executor_job(_read_files, FOLDER)
    if not hass.data.get(f"{DOMAIN}_views"):
        hass.http.register_view(FrontendView(hass))  # views cannot be removed, so register once per run
        hass.http.register_view(TeamLogosView(hass))
        hass.http.register_view(LogoView(hass))  # logos from Home Assistant itself: the person's own, else a cached copy
        ws_api.async_register(hass)
        hass.data[f"{DOMAIN}_views"] = True
    card_url = f"{CARD_URL}?v={version}"
    frontend.add_extra_js_url(hass, card_url)
    book = LogoBook(hass)
    data = ScorebugsData(version=version, url=URL_BASE + "/", catalogue=catalogue, logos=book, card_url=card_url)
    hass.data[DOMAIN] = data

    # My teams: one tracker per league that has a followed team
    by_league: dict[str, list[dict[str, Any]]] = {}
    for team in entry.options.get("teams") or []:
        if isinstance(team, dict) and team.get("league") in LEAGUES and team.get("id"):
            by_league.setdefault(team["league"], []).append(team)
    data.structural = looks.structural(dict(entry.options))
    data.trackers = [LeagueTracker(hass, entry, LEAGUES[code], teams, book) for code, teams in by_league.items()]
    # all leagues at once; ESPN down at start-up: the sensors show unavailable and each tracker keeps trying on its own
    await asyncio.gather(*(tracker.async_refresh() for tracker in data.trackers))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_options_changed))
    return True


async def _options_changed(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """My teams changed: set up again with the new list. Only a look or a card default changed: update in place (no reload)."""
    data: ScorebugsData | None = hass.data.get(DOMAIN)
    if data is not None and looks.structural(dict(entry.options)) == data.structural:
        async_dispatcher_send(hass, looks.SIGNAL_LOOKS)
        return
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    data: ScorebugsData | None = hass.data.pop(DOMAIN, None)
    if data and data.card_url:
        try:
            frontend.remove_extra_js_url(hass, data.card_url)
        except KeyError:
            pass
    return True
