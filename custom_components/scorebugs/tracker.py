"""One tracker per league that has a followed team: one scoreboard request for all of that league's followed teams.

Pace (see games.next_poll): every 20 s while a followed game is live, 30 s just before kick-off, 5 min on game day, hourly otherwise.
A team that is not on today's scoreboard gets its next game (or last result) from its season schedule, asked at most every 6 hours.
Leagues with a playoff seeding (SEED_LEAGUES) read their standings at most twice a day, only while a followed game is in the
postseason, so the bugs can show each team's seed.
Nothing is fetched for a league nobody follows.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from . import cfl, euroleague, games, mlbstats, solo
from .espn import (CORE_EVENT_URL, SCHEDULE_URL, SCOREBOARD_URL, SITUATION_URL, STANDINGS_URL, SUMMARY_URL, LogoBook, core_ref,
                   fetch_json, parse_seeds, team_key)
from .leagues import League
from .logo_view import own_name

_LOGGER = logging.getLogger(__name__)
SCHEDULE_KEEP = timedelta(hours=6)
SCHEDULE_HORIZON = timedelta(days=30)  # a sensor shows the next game up to a month ahead; displays show a week
SEED_KEEP = timedelta(hours=12)
EL_LIVE_KEEP = timedelta(minutes=30)
SEED_LEAGUES = {"NBA", "WNBA", "NHL", "NFL", "MLB", "MLS", "NWSL"}


def own_logo(attrs: dict[str, Any], team: dict[str, Any], league: League) -> None:
    """A team with its own picture chosen (My teams > Use your own logo): its sensor names the file and when it was uploaded."""
    if team.get("own_logo"):
        attrs["team_own_logo"] = own_name(league.code, str(team["id"]))
        attrs["team_own_logo_at"] = int(team["own_logo"])


class LeagueTracker(DataUpdateCoordinator[dict[str, tuple[str, dict[str, Any]]]]):
    """data: {team id: (state, attributes)} for the followed teams of one league."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, league: League, teams: list[dict[str, Any]], book: LogoBook) -> None:
        super().__init__(hass, _LOGGER, config_entry=entry, name=f"Scorebugs {league.code}", update_interval=timedelta(minutes=5))
        self.league = league
        self.teams = teams
        self.book = book
        self._schedules: dict[str, tuple[datetime, list[dict]]] = {}
        self._car_cache: dict[str, dict[str, dict]] = {}
        self._seeds: tuple[datetime, dict[str, int]] | None = None

    def _ref(self, team_id: str) -> dict[str, str]:
        return {"sport": self.league.sport, "league": self.league.path, "id": str(team_id)}

    async def _seed_map(self, now: datetime) -> dict[str, int]:
        """{team id: playoff seed} from the league's standings, kept 12 hours; {} when they cannot be read."""
        if self._seeds and now - self._seeds[0] < SEED_KEEP:
            return self._seeds[1]
        seeds = parse_seeds(await fetch_json(self.hass, STANDINGS_URL.format(sport=self.league.sport, league=self.league.path)))
        self._seeds = (now, seeds)
        return seeds

    async def _schedule(self, team_id: str, now: datetime) -> list[dict]:
        got = self._schedules.get(team_id)
        stale = got is None or now - got[0] > SCHEDULE_KEEP or any(
            games._get(e, "competitions", 0, "status", "type", "state") == "pre" and (games.parse_time(e.get("date")) or now) < now
            for e in got[1])  # a game in it should have started by now: ask again
        if stale:
            reply = await fetch_json(self.hass, SCHEDULE_URL.format(sport=self.league.sport, league=self.league.path, team=team_id))
            if isinstance(reply, dict):
                self._schedules[team_id] = (now, [e for e in reply.get("events") or [] if isinstance(e, dict)])
            elif got is None:
                return []
        return self._schedules.get(team_id, (now, []))[1]

    async def _cars(self, event_id: str) -> dict[str, dict]:
        """Racing: each driver's car number, team and team colour for this race weekend (ESPN's core API), asked once per event."""
        if event_id in self._car_cache:
            return self._car_cache[event_id]
        base = CORE_EVENT_URL.format(sport=self.league.sport, league=self.league.path, event=event_id)
        listing = await fetch_json(self.hass, base + "/competitions")
        refs = [i.get("$ref") for i in (listing or {}).get("items") or [] if isinstance(i, dict) and str(i.get("$ref", "")).startswith("http://sports.core.api.espn.com/")]
        cars: dict[str, dict] = {}
        if refs:
            last = refs[-1].split("?")[0].replace("http://", "https://")
            reply = await fetch_json(self.hass, last + "/competitors?limit=60")
            for item in (reply or {}).get("items") or []:
                if isinstance(item, dict) and isinstance(item.get("vehicle"), dict):
                    cars[str(item.get("id"))] = {k: item["vehicle"].get(k) for k in ("number", "manufacturer", "teamColor")}
        self._car_cache = {event_id: cars}  # keep only the current weekend
        return cars

    async def _solo(self, events: list[dict], league_logo: str | None, now: datetime) -> dict[str, tuple[str, dict[str, Any]]]:
        """Individual sports: the current event's board (golf, racing) or each followed player's match or fight (tennis, MMA)."""
        event = events[0] if events else None
        cars = await self._cars(str(event.get("id"))) if event and self.league.kind == "racing" else None
        out: dict[str, tuple[str, dict[str, Any]]] = {}
        for t in self.teams:
            state, attrs = solo.solo_state(event, self.league, t, now, cars)
            if league_logo:
                attrs["league_logo"] = league_logo
            out[str(t["id"])] = (state, attrs)
        self.update_interval = games.next_poll([(s, games.parse_time(a.get("date"))) for s, a in out.values()], now)
        return out

    async def _cfl_update(self, now: datetime) -> dict[str, tuple[str, dict[str, Any]]]:
        """The CFL from the league's own feed: one request for the season's rounds, and the team list once."""
        rounds = await fetch_json(self.hass, cfl.ROUNDS_URL)
        if rounds is None:
            if self.data:
                return self.data
            raise UpdateFailed("The CFL's scoreboard is not reachable")
        if not getattr(self, "_squads", None):
            self._squads = cfl.parse_squads(await fetch_json(self.hass, cfl.SQUADS_URL))
        out: dict[str, tuple[str, dict[str, Any]]] = {}
        for t in self.teams:
            found = cfl.cfl_game(rounds, str(t["id"]), self._squads, now)
            if found is None:
                found = ("NOT_FOUND", {"sport": "football", "league": "CFL", "league_path": "cfl", "team_id": str(t["id"]),
                                       "team_abbr": t.get("abbr"), "team_name": t.get("name"), "team_colors": cfl.COLORS.get(t.get("abbr") or "", ["#D3D3D3", "#A9A9A9"])})
            own_logo(found[1], t, self.league)
            out[str(t["id"])] = found
        self.update_interval = games.next_poll([(s, games.parse_time(a.get("date"))) for s, a in out.values()], now)
        return out

    def _not_found(self, t: dict[str, Any]) -> tuple[str, dict[str, Any]]:
        return ("NOT_FOUND", {"sport": self.league.sport, "league": self.league.code, "league_path": self.league.path, "team_id": str(t["id"]),
                              "team_abbr": t.get("abbr"), "team_name": t.get("name"), "team_colors": ["#D3D3D3", "#A9A9A9"]})

    async def _euroleague_update(self, now: datetime) -> dict[str, tuple[str, dict[str, Any]]]:
        """EuroLeague and EuroCup from the league's own feeds: the season's games (kept 6 hours, asked again once a followed game has started),
        the club list once, and while a followed game is on, that game's small live header."""
        comp = euroleague.COMPETITIONS.get(self.league.code, euroleague.COMPETITION)
        got = getattr(self, "_el_games", None)
        ids = [str(t["id"]) for t in self.teams]
        # the season list is large (about 750 KB): kept 6 hours, or 30 minutes while a followed game is on (to pick up its result)
        if got is None or now - got[0] > SCHEDULE_KEEP or (euroleague.headers_needed(got[1], ids, now) and now - got[0] > EL_LIVE_KEEP):
            reply = await fetch_json(self.hass, euroleague.games_url(now, comp))
            if isinstance(reply, dict):
                got = self._el_games = (now, reply)
        if got is None:
            if self.data:
                return self.data
            raise UpdateFailed(f"The {self.league.name} feed is not reachable")
        if not getattr(self, "_clubs", None):
            self._clubs = euroleague.parse_clubs(await fetch_json(self.hass, euroleague.clubs_url(now, comp)))
        headers = {}
        for code in euroleague.headers_needed(got[1], ids, now):
            h = await fetch_json(self.hass, euroleague.header_url(code, now, comp))
            if isinstance(h, dict):
                headers[code] = h
        out: dict[str, tuple[str, dict[str, Any]]] = {}
        for t in self.teams:
            found = euroleague.euroleague_game(got[1], str(t["id"]), self._clubs, now, headers, self.league.code) or self._not_found(t)
            own_logo(found[1], t, self.league)
            out[str(t["id"])] = found
        self.update_interval = games.next_poll([(s, games.parse_time(a.get("date"))) for s, a in out.values()], now)
        return out

    async def _mlbstats_update(self, now: datetime) -> dict[str, tuple[str, dict[str, Any]]]:
        """Baseball from MLB's Stats API (the Mexican, winter, minor and independent leagues), asked only for the followed teams:
        yesterday to tomorrow with the linescore every poll, and the week ahead (no linescore, kept 6 hours) only for a team with
        nothing in those three days."""
        feed = mlbstats.FEEDS[self.league.code]
        ids = [str(t["id"]) for t in self.teams]
        near = await fetch_json(self.hass, mlbstats.schedule_url(feed, now, ids, 1, 1))
        if near is None:
            if self.data:
                return self.data
            raise UpdateFailed("MLB's Stats API is not reachable")
        if not getattr(self, "_mlb_teams", None):
            self._mlb_teams = mlbstats.parse_teams(await fetch_json(self.hass, mlbstats.teams_url(feed, now)), feed)
        out: dict[str, tuple[str, dict[str, Any]]] = {}
        for t in self.teams:
            found = mlbstats.team_game(near, str(t["id"]), self._mlb_teams, now, self.league.code, feed)
            if found is None:
                ahead = getattr(self, "_mlb_ahead", None)
                if ahead is None or now - ahead[0] > SCHEDULE_KEEP:
                    reply = await fetch_json(self.hass, mlbstats.schedule_url(feed, now, ids, 0, 8, linescore=False))
                    ahead = self._mlb_ahead = (now, reply if isinstance(reply, dict) else {})
                found = mlbstats.team_game(ahead[1], str(t["id"]), self._mlb_teams, now, self.league.code, feed)
            found = found or self._not_found(t)
            own_logo(found[1], t, self.league)
            out[str(t["id"])] = found
        self.update_interval = games.next_poll([(s, games.parse_time(a.get("date"))) for s, a in out.values()], now)
        return out

    async def _afl_goals(self, out: dict[str, tuple[str, dict[str, Any]]]) -> None:
        """AFL bugs show goals and behinds ("12.17 89"); only the game summary has them: one request per followed live game,
        and once for a finished one (kept)."""
        cache = getattr(self, "_afl_cache", {})
        for state, attrs in out.values():
            ev = attrs.get("event_id")
            if state not in ("IN", "POST") or not ev:
                continue
            if state == "IN" or ev not in cache:
                summary = await fetch_json(self.hass, SUMMARY_URL.format(sport=self.league.sport, league=self.league.path, event=ev))
                if summary is not None:
                    cache[ev] = games.afl_goals_behinds(summary)
            gb = cache.get(ev, {})
            for p in ("team", "opponent"):
                g_b = gb.get(str(attrs.get(f"{p}_id")))
                if g_b:
                    attrs[f"{p}_goals"], attrs[f"{p}_behinds"] = g_b
        self._afl_cache = {k: v for k, v in cache.items() if k in {a.get("event_id") for _, a in out.values()}}

    async def _situations(self, out: dict[str, tuple[str, dict[str, Any]]]) -> None:
        """Basketball's timeouts, team fouls and bonus, hockey's power play, baseball's pitcher, pitch count and batter: the scoreboard
        leaves them out, ESPN's core API has them in a small situation reply (under 1 KB). One request per followed live game (and for
        baseball one for the pitcher's numbers, about 24 KB, plus a player's name once), only while it is live."""
        sport = self.league.sport
        if sport not in ("basketball", "hockey", "baseball"):
            return
        names: dict[str, tuple[str, str]] = getattr(self, "_names", {})
        done: dict[str, dict[str, Any] | None] = {}
        for state, attrs in out.values():
            ev = str(attrs.get("event_id") or "")
            if state != "IN" or not ev.isdigit():
                continue
            if ev not in done:
                reply = await fetch_json(self.hass, SITUATION_URL.format(sport=sport, league=self.league.path, event=ev), timeout=8)
                extra: dict[str, Any] | None = None
                if sport == "basketball":
                    extra = games.basketball_situation(reply)
                elif sport == "hockey":
                    extra = games.hockey_situation(reply)
                else:
                    found = games.baseball_situation(reply)
                    if found:
                        extra = {}
                        stats = core_ref(found.get("pitcher_stats"))
                        if stats:
                            extra["pitch_count"] = games.pitch_count(await fetch_json(self.hass, stats, timeout=8))
                        for who in ("pitcher", "batter"):
                            pid, ref = found.get(who + "_id"), core_ref(found.get(who + "_athlete"))
                            if not pid:
                                continue
                            extra[who + "_id"] = pid
                            if attrs.get(who):  # the scoreboard named them already
                                names.setdefault(pid, (attrs[who], attrs.get(who + "_short") or attrs[who]))
                            if pid not in names and ref:
                                got = games.athlete_names(await fetch_json(self.hass, ref, timeout=8))
                                if got:
                                    names[pid] = got
                            if pid in names:
                                extra[who], extra[who + "_short"] = names[pid]
                done[ev] = extra
            if done[ev]:
                games.apply_situation(attrs, sport, done[ev])
        if len(names) > 200:  # a season's worth of pitchers and batters is plenty; start again
            names = {}
        self._names = names

    async def _async_update_data(self) -> dict[str, tuple[str, dict[str, Any]]]:
        now = dt_util.utcnow()
        if self.league.provider == "cfl":
            return await self._cfl_update(now)
        if self.league.provider == "euroleague":
            return await self._euroleague_update(now)
        if self.league.provider == "mlbstats":
            return await self._mlbstats_update(now)
        board = await fetch_json(self.hass, SCOREBOARD_URL.format(sport=self.league.sport, league=self.league.path))
        if board is None:
            if self.data:
                return self.data  # keep showing the last answer through a hiccup
            raise UpdateFailed(f"ESPN's {self.league.code} scoreboard is not reachable")
        events = [e for e in board.get("events") or [] if isinstance(e, dict)]
        league_logo = next((lg.get("href") for lg in games._get(board, "leagues", 0, "logos") or [] if isinstance(lg, dict)
                            and str(lg.get("href", "")).startswith("https://a.espncdn.com/")), None)
        if self.league.kind != "team":
            return await self._solo(events, league_logo, now)

        picked: dict[str, dict | None] = {}
        for t in self.teams:
            tid = str(t["id"])
            ev = games.pick_event(events, tid, now)
            if ev is None:
                ev = games.pick_event(await self._schedule(tid, now), tid, now, horizon=SCHEDULE_HORIZON)
            picked[tid] = ev

        # colours, names and logo versions: the followed teams, and the opponents of games taken from a schedule (cached 30 days)
        refs = [self._ref(t["id"]) for t in self.teams]
        for ev in picked.values():
            if ev is not None and ev not in events:
                refs += [self._ref(c.get("id")) for c in games.competitors(ev) if c.get("id")]
        info = {r["id"]: v for r in refs if (v := (await self.book.info([r])).get(team_key(r["sport"], r["league"], r["id"])))}
        logos = await self.book.get([self._ref(t["id"]) for t in self.teams])

        out: dict[str, tuple[str, dict[str, Any]]] = {}
        for t in self.teams:
            tid = str(t["id"])
            found = games.game_attributes(picked[tid], tid, self.league, info) if picked[tid] else None
            if found is None:
                me = info.get(tid, {})
                found = ("NOT_FOUND", {"sport": self.league.sport, "sport_path": self.league.sport, "league": self.league.code,
                                       "league_path": self.league.path, "team_id": tid, "team_abbr": me.get("abbr") or t.get("abbr"),
                                       "team_name": me.get("name") or t.get("name"), "team_logo": me.get("logo"),
                                       "team_colors": [c for c in (me.get("color"), me.get("color2")) if c] or ["#D3D3D3", "#A9A9A9"]})
            state, attrs = found
            if league_logo:
                attrs["league_logo"] = league_logo
            attrs["team_logos"] = logos.get(team_key(self.league.sport, self.league.path, tid), {})
            attrs["team_logo_style"] = t.get("logo_style") or "primary"
            own_logo(attrs, t, self.league)
            out[tid] = (state, attrs)

        if self.league.code == "AFL":
            await self._afl_goals(out)
        await self._situations(out)
        if self.league.code in SEED_LEAGUES and any(a.get("season") == "post-season" for _, a in out.values()):
            seeds = await self._seed_map(now)
            for _, attrs in out.values():
                for p in ("team", "opponent"):
                    if seeds.get(str(attrs.get(f"{p}_id"))):
                        attrs[f"{p}_seed"] = seeds[str(attrs[f"{p}_id"])]

        self.update_interval = games.next_poll(
            [(s, games.parse_time(a.get("date"))) for s, a in out.values()], now)
        return out
