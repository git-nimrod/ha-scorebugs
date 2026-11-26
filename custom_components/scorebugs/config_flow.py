"""Setup screens.

- Add: Settings > Devices & services > Add integration > Scorebugs. One confirm screen.
- Scorebug looks (Configure): the overall look and each team's look (also Look entities, for automations and dashboards).
- How bugs look on cards (Configure): defaults for every card (logos, marks, picture, texture ...); a card's own settings still win.
- My teams: Settings > Devices & services > Scorebugs > Configure: add a team (pick a league, then the team and its logo version),
  pick a team's logo (any of the logos ESPN has for it, or your own picture; ESPN's usual one is the default), or remove teams. Each followed team
  becomes a sensor; only followed teams' leagues are ever fetched.

Home Assistant 2026.10 builds form schemas with `probatio`; older versions used `voluptuous`. Both have Schema / Required / Optional.
"""

from __future__ import annotations

from typing import Any

try:
    import probatio as schema_lib
except ImportError:  # an older Home Assistant
    import voluptuous as schema_lib

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.util import dt as dt_util
import time

from homeassistant.components.file_upload import process_uploaded_file
from homeassistant.helpers.selector import FileSelector, FileSelectorConfig, SelectOptionDict, SelectSelector, SelectSelectorConfig, SelectSelectorMode

from . import cfl, euroleague, looks, mlbstats
from .const import DOMAIN, NAME
from .espn import ALIASES, SCOREBOARD_URL, TEAMS_URL, fetch_json, logo_label, parse_athletes, parse_team_list
from .leagues import LEAGUES, SPORT_NAMES
from .logo_view import MARK, find_own, own_folder, own_name, remove_own, save_own

MAX_TEAMS = 30
LOGO_STYLES = ("primary", "dark", "secondary", "white", "secondary-white", "black")


def _select(options: list[SelectOptionDict], multiple: bool = False, translation_key: str | None = None) -> SelectSelector:
    extra = {"translation_key": translation_key} if translation_key else {}
    return SelectSelector(SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN, multiple=multiple, **extra))


class ScorebugsConfigFlow(ConfigFlow, domain=DOMAIN):
    """One confirm screen. `single_config_entry` in the manifest blocks a second copy."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title=NAME, data={}, options={"teams": []})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return MyTeamsFlow()


class MyTeamsFlow(OptionsFlow):
    """My teams: add or remove followed teams."""

    def __init__(self) -> None:
        self._league: str | None = None
        self._sport: str | None = None
        self._teams: list[dict[str, str]] = []
        self._logo_team: dict[str, Any] | None = None
        self._look_for: str | None = None

    @staticmethod
    def _key(t: dict[str, Any]) -> str:
        return f"{t['league']}:{t['id']}"

    def _followed(self) -> list[dict[str, Any]]:
        return list(self.config_entry.options.get("teams") or [])

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        menu = (["add_team", "team_logo", "remove_team"] if self._followed() else ["add_team"]) + ["looks", "card_defaults", "my_mark"]
        return self.async_show_menu(step_id="init", menu_options=menu,
                                    description_placeholders={"teams": ", ".join(f"{t['league']} {t.get('abbr') or t['id']}" for t in self._followed()) or "none yet"})

    async def async_step_add_team(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if len(self._followed()) >= MAX_TEAMS:
            return self.async_abort(reason="too_many")
        # sport first, then its league: one list of 180 leagues was too long to pick from
        if user_input is not None:
            self._sport = user_input["sport"]
            return await self.async_step_add_team_league()
        sports = sorted({lg.sport for lg in LEAGUES.values()}, key=lambda sp: SPORT_NAMES.get(sp, sp))
        options = [SelectOptionDict(value=sp, label=SPORT_NAMES.get(sp, sp)) for sp in sports]
        return self.async_show_form(step_id="add_team", data_schema=schema_lib.Schema({schema_lib.Required("sport"): _select(options)}))

    async def async_step_add_team_league(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        # every league draws a scorebug now (its own look, else its sport's), so no league is marked "scores only" any more
        leagues = [lg for lg in LEAGUES.values() if lg.sport == self._sport]
        if user_input is not None or len(leagues) == 1:
            self._league = user_input["league"] if user_input is not None else leagues[0].code
            if self._league not in LEAGUES:
                return self.async_abort(reason="no_teams")
            return await self.async_step_pick_team()
        options = [SelectOptionDict(value=lg.code, label=lg.name) for lg in leagues]
        return self.async_show_form(step_id="add_team_league", data_schema=schema_lib.Schema({schema_lib.Required("league"): _select(options)}),
                                    description_placeholders={"sport": SPORT_NAMES.get(self._sport or "", self._sport or "")})

    async def async_step_pick_team(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        league = LEAGUES[self._league]
        if not self._teams:
            if league.provider == "cfl":
                self._teams = cfl.parse_squads(await fetch_json(self.hass, cfl.SQUADS_URL))
            elif league.provider == "euroleague":
                self._teams = euroleague.parse_clubs(await fetch_json(self.hass, euroleague.clubs_url(
                    dt_util.utcnow(), euroleague.COMPETITIONS.get(league.code, euroleague.COMPETITION))))
            elif league.provider == "mlbstats":
                feed = mlbstats.FEEDS[league.code]
                self._teams = mlbstats.parse_teams(await fetch_json(self.hass, mlbstats.teams_url(feed, dt_util.utcnow())), feed)
            elif league.kind == "team":
                self._teams = parse_team_list(await fetch_json(self.hass, TEAMS_URL.format(sport=league.sport, league=league.path)))
            else:
                # individual sports: the whole tournament / race / card, or a player from the current event's field
                whole = {"golf": "The whole tournament", "racing": "The whole race weekend", "mma": "The whole card (main event)"}.get(league.kind)
                field = parse_athletes(await fetch_json(self.hass, SCOREBOARD_URL.format(sport=league.sport, league=league.path)))
                self._teams = ([{"id": "event", "abbr": "event", "name": whole}] if whole else []) + [
                    {"id": a["id"], "abbr": a["name"].split()[-1].upper(), "name": a["name"]} for a in field]
            if not self._teams:
                return self.async_abort(reason="no_teams")
        followed = {(t["league"], str(t["id"])) for t in self._followed()}
        if user_input is not None:
            team = next((t for t in self._teams if t["id"] == user_input["team"]), None)
            if team is None:
                return self.async_abort(reason="no_teams")
            if (league.code, team["id"]) not in followed:
                new = {"league": league.code, "id": team["id"], "abbr": team["abbr"], "name": team["name"],
                       "logo_style": user_input.get("logo_style", "primary")}
                return self.async_create_entry(data={**self.config_entry.options, "teams": [*self._followed(), new]})
            return self.async_create_entry(data=dict(self.config_entry.options))
        label = (lambda t: f"{t['name']} ({t['abbr']})") if league.kind == "team" else (lambda t: t["name"])
        options = [SelectOptionDict(value=t["id"], label=label(t)) for t in self._teams if (league.code, t["id"]) not in followed]
        return self.async_show_form(
            step_id="pick_team",
            data_schema=schema_lib.Schema({
                schema_lib.Required("team"): _select(options),
                schema_lib.Required("logo_style", default="primary"): _select(
                    [SelectOptionDict(value=s, label=s) for s in LOGO_STYLES], translation_key="logo_style"),
            }),
            description_placeholders={"league": league.name},
        )

    async def async_step_team_logo(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Team logo, step 1: which team."""
        followed = self._followed()
        if user_input is not None:
            self._logo_team = next((t for t in followed if self._key(t) == user_input["team"]), None)
            if self._logo_team is None:
                return self.async_abort(reason="no_teams")
            return await self.async_step_team_logo_pick()
        options = [SelectOptionDict(value=self._key(t), label=f"{t['league']}: {t.get('name') or t['id']}") for t in followed]
        return self.async_show_form(step_id="team_logo", data_schema=schema_lib.Schema({schema_lib.Required("team"): _select(options)}))

    async def async_step_team_logo_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Team logo, step 2: any logo ESPN has for the team, or the person's own picture (uploaded, or already in the folder)."""
        team = self._logo_team
        league = LEAGUES.get(team["league"])
        versions: dict[str, str] = {}
        data = self.hass.data.get(DOMAIN)
        if data is not None and league is not None and league.kind == "team" and league.provider == "espn":
            found = await data.logos.get([{"sport": league.sport, "league": league.path, "id": str(team["id"])}])
            versions = {k: v for k, v in next(iter(found.values()), {}).items() if k not in ALIASES}
        errors: dict[str, str] = {}
        name, folder = own_name(team["league"], team["id"]), own_folder(self.hass)
        if user_input is not None:
            pick = user_input["logo"]
            if pick != "own":
                team = {**team, "logo_style": pick, "own_logo": 0}   # an own picture stays in the folder for later
            elif user_input.get("file"):
                def keep() -> bool:
                    with process_uploaded_file(self.hass, user_input["file"]) as path:
                        return save_own(folder, name, path)
                try:
                    ok = await self.hass.async_add_executor_job(keep)
                except (ValueError, OSError):
                    ok = False
                if ok:
                    team = {**team, "own_logo": int(time.time())}
                else:
                    errors["file"] = "not_image"
            elif await self.hass.async_add_executor_job(find_own, folder, name):
                team = {**team, "own_logo": team.get("own_logo") or int(time.time())}   # the earlier upload, or one put in the folder
            else:
                errors["file"] = "need_file"
            if not errors:
                followed = self._followed()
                return self.async_create_entry(data={**self.config_entry.options,
                                                     "teams": [team if self._key(t) == self._key(team) else t for t in followed]})
        options = [SelectOptionDict(value="primary", label="ESPN's usual logo")]
        options += [SelectOptionDict(value=k, label="ESPN: " + logo_label(k)) for k in sorted(versions) if k != "primary"]
        options.append(SelectOptionDict(value="own", label="My own picture"))
        current = "own" if team.get("own_logo") else (team.get("logo_style") or "primary")
        if current not in {o["value"] for o in options}:
            current = "primary"
        links = "\n".join(f"- [{logo_label(k)}]({v})" for k, v in sorted(versions.items())) or "- (ESPN has no logos for this team)"
        return self.async_show_form(
            step_id="team_logo_pick", errors=errors,
            data_schema=schema_lib.Schema({
                schema_lib.Required("logo", default=current): _select(options),
                schema_lib.Optional("file"): FileSelector(FileSelectorConfig(accept="image/png,image/webp,image/jpeg")),
            }),
            description_placeholders={"team": team.get("name") or team["id"], "links": links, "file_name": name + ".png"},
        )

    async def async_step_my_mark(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Your own mark: a picture for the network's spot on the bugs (used where a card or pane sets bug_mark: own)."""
        folder, errors = own_folder(self.hass), {}
        have = await self.hass.async_add_executor_job(find_own, folder, MARK)
        if user_input is not None:
            if user_input.get("remove"):
                await self.hass.async_add_executor_job(remove_own, folder, MARK)
                return self.async_create_entry(data={**self.config_entry.options, "mark_at": 0})
            if user_input.get("file"):
                def keep() -> bool:
                    with process_uploaded_file(self.hass, user_input["file"]) as path:
                        return save_own(folder, MARK, path)
                try:
                    ok = await self.hass.async_add_executor_job(keep)
                except (ValueError, OSError):
                    ok = False
                if ok:
                    return self.async_create_entry(data={**self.config_entry.options, "mark_at": int(time.time())})
                errors["file"] = "not_image"
            else:
                errors["file"] = "need_mark_file"
        return self.async_show_form(
            step_id="my_mark", errors=errors,
            data_schema=schema_lib.Schema({
                schema_lib.Optional("file"): FileSelector(FileSelectorConfig(accept="image/png,image/webp,image/jpeg")),
                schema_lib.Optional("remove", default=False): bool,
            }),
            description_placeholders={"now": "You have one." if have else "You have none yet.", "file_name": MARK + ".png"},
        )

    async def async_step_remove_team(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        followed = self._followed()
        key = lambda t: f"{t['league']}:{t['id']}"  # noqa: E731
        if user_input is not None:
            drop = set(user_input.get("teams") or [])
            for t in followed:  # a removed team's own logo goes with it
                if key(t) in drop and t.get("own_logo"):
                    await self.hass.async_add_executor_job(remove_own, own_folder(self.hass), own_name(t["league"], t["id"]))
            return self.async_create_entry(data={**self.config_entry.options, "teams": [t for t in followed if key(t) not in drop]})
        options = [SelectOptionDict(value=key(t), label=f"{t['league']}: {t.get('name') or t['id']}") for t in followed]
        return self.async_show_form(step_id="remove_team", data_schema=schema_lib.Schema({schema_lib.Required("teams"): _select(options, multiple=True)}))


    # ---------------------------------------------------------------- looks and card defaults (no reload: see looks.structural)

    def _catalogue(self) -> dict[str, Any]:
        data = self.hass.data.get(DOMAIN)
        return data.catalogue if data is not None else {"bugs": []}

    async def async_step_looks(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Scorebug looks, step 1: the overall look, or one team's."""
        if user_input is not None:
            self._look_for = user_input["which"]
            return await self.async_step_look_pick()
        options = [SelectOptionDict(value="*", label="Overall (every team without its own look)")]
        options += [SelectOptionDict(value=self._key(t), label=f"{t['league']}: {t.get('name') or t['id']}") for t in self._followed()]
        return self.async_show_form(step_id="looks", data_schema=schema_lib.Schema({schema_lib.Required("which", default="*"): _select(options)}))

    async def async_step_look_pick(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Scorebug looks, step 2: pick the look (a team's list only has bugs that fit its sport)."""
        catalogue, opts = self._catalogue(), dict(self.config_entry.options)
        team = None if self._look_for == "*" else next((t for t in self._followed() if self._key(t) == self._look_for), None)
        if self._look_for != "*" and team is None:
            return self.async_abort(reason="no_teams")
        # a dropdown can't offer an empty value: the league default is "league" here, and "same" (a team following the overall look)
        if team is None:
            choices = [(looks.LEAGUE, looks.LABEL_DEFAULT)] + [c for c in looks.choices(catalogue, None) if c[0] != looks.DEFAULT]
            current = str(opts.get("look") or "") or looks.LEAGUE
        else:
            league = LEAGUES.get(team["league"])
            choices = [("same", "Same as the overall look"), (looks.LEAGUE, looks.LABEL_DEFAULT)] + [
                c for c in looks.choices(catalogue, league.sport if league else None) if c[0] != looks.DEFAULT]
            current = str(team.get("look") or "") or "same"
        if user_input is not None:
            value = user_input["look"]
            if team is None:
                opts["look"] = "" if value == looks.LEAGUE else looks.clean(value, catalogue)
            else:
                stored = "" if value == "same" else looks.LEAGUE if value == looks.LEAGUE else looks.clean(value, catalogue)
                opts["teams"] = [{**t, "look": stored} if self._key(t) == self._key(team) else t for t in self._followed()]
            return self.async_create_entry(data=opts)
        if current not in {v for v, _ in choices}:
            current = choices[0][0]
        return self.async_show_form(
            step_id="look_pick",
            data_schema=schema_lib.Schema({schema_lib.Required("look", default=current): _select([SelectOptionDict(value=v, label=l) for v, l in choices])}),
            description_placeholders={"who": "every team without its own look" if team is None else (team.get("name") or team["id"])},
        )

    async def async_step_card_defaults(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """How bugs look on cards: defaults for every Scorebug card and Glass Panes pane (a card's own settings still win)."""
        opts = dict(self.config_entry.options)
        current = looks.card_defaults(opts)
        if user_input is not None:
            opts["card"] = {k: v for k, v in user_input.items() if k in looks.CARD_DEFAULTS and v in looks.CARD_DEFAULTS[k]}
            return self.async_create_entry(data=opts)
        fields = {}
        for key, values in looks.CARD_DEFAULTS.items():
            fields[schema_lib.Required(key, default=current.get(key, values[0]))] = _select(
                [SelectOptionDict(value=v, label=v) for v in values], translation_key=key)
        return self.async_show_form(step_id="card_defaults", data_schema=schema_lib.Schema(fields))
