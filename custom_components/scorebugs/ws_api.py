"""Websocket commands: scorebugs/info and scorebugs/team_logos. Read-only, so any logged-in user may call them (a display's own user).

Home Assistant 2026.10 builds message schemas with `probatio`; older versions used `voluptuous`. Both have Required / Optional.
"""

from __future__ import annotations

from typing import Any

try:
    import probatio as schema_lib
except ImportError:  # an older Home Assistant
    import voluptuous as schema_lib

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from . import looks
from .const import API, DOMAIN

Required = schema_lib.Required


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_team_logos)
    websocket_api.async_register_command(hass, ws_settings)


@websocket_api.websocket_command({Required("type"): f"{DOMAIN}/info"})
@callback
def ws_info(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Version, plug number, where the files are, and the bug list."""
    data = hass.data.get(DOMAIN)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Scorebugs is not set up")
        return
    connection.send_result(msg["id"], {"version": data.version, "api": API, "url": data.url, "catalogue": data.catalogue})


@websocket_api.websocket_command({Required("type"): f"{DOMAIN}/team_logos", Required("teams"): list})
@websocket_api.async_response
async def ws_team_logos(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Logo versions for teams: [{sport, league, id}] -> {"teams": {"sport/league/id": {default, dark, secondary, white, ...}}}."""
    data = hass.data.get(DOMAIN)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Scorebugs is not set up")
        return
    teams = [t for t in msg["teams"] if isinstance(t, dict)]
    found = await data.logos.get(teams)
    connection.send_result(msg["id"], {"teams": found})


@websocket_api.websocket_command({Required("type"): f"{DOMAIN}/settings"})
@callback
def ws_settings(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """What the cards start from: the overall look and the card defaults (Scorebugs > Configure). A card's own settings still win."""
    entries = hass.config_entries.async_entries(DOMAIN)
    options = dict(entries[0].options) if entries else {}
    connection.send_result(msg["id"], {"look": str(options.get("look") or ""), "card": looks.card_defaults(options)})
