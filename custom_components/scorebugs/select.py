"""Look entities: a dropdown for the overall look and one for each followed team, so an automation or a dashboard tile can change
which bug the cards draw (select.select_option), without opening any card's editor. Each change is saved in Scorebugs' settings.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import looks
from .const import DOMAIN
from .leagues import LEAGUES


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    catalogue = hass.data[DOMAIN].catalogue
    found: list[LookSelect] = [LookSelect(entry, catalogue, None)]
    for team in entry.options.get("teams") or []:
        if isinstance(team, dict) and team.get("league") in LEAGUES and team.get("id"):
            found.append(LookSelect(entry, catalogue, team))
    async_add_entities(found)


class LookSelect(SelectEntity):
    """The overall look (team None) or one followed team's look."""

    _attr_icon = "mdi:television-classic"
    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry, catalogue: dict[str, Any], team: dict[str, Any] | None) -> None:
        self._entry = entry
        self._catalogue = catalogue
        self._key = f"{team['league']}:{team['id']}" if team else None
        if team is None:
            self._choices = looks.choices(catalogue, None)
            self._attr_unique_id = "look"
            self._attr_name = "Scorebugs look"
        else:
            league = LEAGUES[team["league"]]
            # a team's own list adds "the overall look" first, so a team can go back to following it
            self._choices = [("", "Same as the overall look")] + [c for c in looks.choices(catalogue, league.sport) if c[0] != looks.DEFAULT] \
                + [(looks.LEAGUE, looks.LABEL_DEFAULT)]
            self._attr_unique_id = f"{league.code.lower()}_{team['id']}_look"
            self._attr_name = f"Scorebugs {league.code} {team.get('abbr') or team['id']} look"
        self._attr_options = [label for _, label in self._choices]

    def _team(self) -> dict[str, Any] | None:
        return next((t for t in self._entry.options.get("teams") or [] if isinstance(t, dict) and f"{t.get('league')}:{t.get('id')}" == self._key), None)

    @property
    def current_option(self) -> str | None:
        if self._key is None:
            value = str(self._entry.options.get("look") or "")
        else:
            team = self._team() or {}
            value = str(team.get("look") or "")
        return next((label for v, label in self._choices if v == value), self._choices[0][1])

    async def async_select_option(self, option: str) -> None:
        value = next((v for v, label in self._choices if label == option), None)
        if value is None:
            return
        options = dict(self._entry.options)
        if self._key is None:
            options["look"] = looks.clean(value, self._catalogue)
        else:
            stored = looks.LEAGUE if value == looks.LEAGUE else looks.clean(value, self._catalogue)
            options["teams"] = [{**t, "look": stored} if f"{t.get('league')}:{t.get('id')}" == self._key else t
                                for t in options.get("teams") or [] if isinstance(t, dict)]
        self.hass.config_entries.async_update_entry(self._entry, options=options)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(async_dispatcher_connect(self.hass, looks.SIGNAL_LOOKS, self._changed))

    @callback
    def _changed(self) -> None:
        self.async_write_ha_state()
