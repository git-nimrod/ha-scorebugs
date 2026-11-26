"""One sensor per followed team: state PRE / IN / POST / NOT_FOUND, attributes named like Team Tracker's.

So a Team Tracker card, Glass Panes' sports widget and the Scorebug card all read these sensors, and automations can use them
("flash the lights when we score": a trigger on the team_score attribute).
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import looks
from .const import DOMAIN
from .tracker import LeagueTracker


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    trackers: list[LeagueTracker] = hass.data[DOMAIN].trackers
    async_add_entities(TeamSensor(tr, team) for tr in trackers for team in tr.teams)


class TeamSensor(CoordinatorEntity[LeagueTracker], SensorEntity):
    """A followed team's current game."""

    _attr_icon = "mdi:scoreboard-outline"
    _attr_attribution = "Data from ESPN"
    # big or fast-changing attributes are left out of the history database
    _unrecorded_attributes = frozenset({"team_logos", "last_play", "game_note", "venue"})

    def __init__(self, tracker: LeagueTracker, team: dict[str, Any]) -> None:
        super().__init__(tracker)
        self._team_id = str(team["id"])
        code = tracker.league.code
        self._attr_unique_id = f"{code.lower()}_{self._team_id}"
        self._attr_name = f"Scorebugs {code} {team.get('abbr') or self._team_id}"
        self._apply()

    def _apply(self) -> None:
        got = (self.coordinator.data or {}).get(self._team_id)
        self._attr_native_value = got[0] if got else None
        self._attr_extra_state_attributes = dict(got[1]) if got else {}
        if got:
            # the look this team's games are drawn with (its own, else the overall one): the cards read it, so a change to the
            # Look entity or Scorebugs' settings shows on every card without touching them
            entry = self.coordinator.config_entry
            team = next((t for t in (entry.options.get("teams") or []) if isinstance(t, dict) and str(t.get("id")) == self._team_id
                         and t.get("league") == self.coordinator.league.code), {})
            self._attr_extra_state_attributes["bug_look"] = looks.team_look(dict(entry.options), team)

    @callback
    def _handle_coordinator_update(self) -> None:
        self._apply()
        super()._handle_coordinator_update()

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.async_on_remove(async_dispatcher_connect(self.hass, looks.SIGNAL_LOOKS, self._looks_changed))

    @callback
    def _looks_changed(self) -> None:
        self._apply()
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return super().available and self._team_id in (self.coordinator.data or {})
