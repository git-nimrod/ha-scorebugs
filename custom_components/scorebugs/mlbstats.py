"""Baseball leagues ESPN lacks, from MLB's public Stats API (statsapi.mlb.com): the Mexican League, the winter leagues, the minor
leagues and the US independent leagues.

MLB's Stats API files each league under a "sport" (11-14 the minor-league levels, 17 the winter leagues, 23 the independent
leagues) and a league id. One schedule request answers the followed teams' games of a date range: both teams (MLB's own team ids),
the status (Preview / Live / Final), the scores and, with `hydrate=linescore`, the inning, its half, the count, the outs and who is
on base. No colours in the feed: teams fall back to grey. Logos are MLB's own team logo addresses (mlbstatic.com), loaded at display
time, nothing stored (the Australian Baseball League and the American Association have none there). MLB's terms
(gdx.mlb.com/components/copyright.txt) allow "individual, non-commercial, non-bulk use", which is what a Home Assistant install is.
Pure functions, tested with saved replies. Written from the feed itself, not from Team Tracker's code.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from .games import FINAL_KEEP, parse_time


@dataclass(frozen=True)
class Feed:
    sport_id: int
    league_id: int | None = None  # None: the whole sport (a minor-league level)
    winter: bool = False  # the season runs over New Year and is named by the year it starts
    logos: bool = True  # MLB's logo server has this league's team logos


# our league code -> where MLB's Stats API files it
FEEDS: dict[str, Feed] = {
    "LMB": Feed(23, 125),
    "LMP": Feed(17, 132, winter=True), "LVBP": Feed(17, 135, winter=True), "LBPRC": Feed(17, 133, winter=True),
    "LIDOM": Feed(17, 131, winter=True), "ABL": Feed(17, 595, winter=True, logos=False), "AZFL": Feed(17, 119),
    "AAA": Feed(11), "AA": Feed(12), "HIGHA": Feed(13), "SINGLEA": Feed(14),
    "ALPB": Feed(23, 436), "AAPB": Feed(23, 6045, logos=False), "FRONTIER": Feed(23, 442), "PIONEER": Feed(23, 128),
}
BASE = "https://statsapi.mlb.com/api/v1/"
LOGO_URL = "https://www.mlbstatic.com/team-logos/{id}.svg"
GREY = ["#D3D3D3", "#A9A9A9"]
SEASON = {"S": "preseason", "E": "preseason", "R": "regular-season", "F": "post-season", "D": "post-season", "L": "post-season",
          "W": "post-season"}
HALF = {"top": "Top", "middle": "Mid", "bottom": "Bot", "end": "End"}  # the words ESPN's baseball clock uses ("Top 5th")
SKIP = {"postponed", "cancelled", "canceled"}


def _filter(feed: Feed) -> str:
    return f"sportId={feed.sport_id}" + (f"&leagueId={feed.league_id}" if feed.league_id else "")


def season_of(feed: Feed, now: datetime) -> int:
    """The season a date falls in: a winter league's 2026-27 season is 2026, also in January 2027."""
    return now.year - 1 if feed.winter and now.month < 7 else now.year


def schedule_url(feed: Feed, now: datetime, team_ids: list[str], days_back: int = 1, days_ahead: int = 8, linescore: bool = True) -> str:
    """The followed teams' games from `days_back` days ago to `days_ahead` days on (UTC dates; a night game in the Americas is the
    next UTC date), with the linescore (inning, count, runners) or without it (much smaller, for the week ahead)."""
    return (BASE + "schedule?" + _filter(feed) + "&teamId=" + ",".join(sorted(str(t) for t in team_ids))
            + "&startDate=" + (now - timedelta(days=days_back)).strftime("%Y-%m-%d")
            + "&endDate=" + (now + timedelta(days=days_ahead)).strftime("%Y-%m-%d") + ("&hydrate=linescore" if linescore else ""))


def teams_url(feed: Feed, now: datetime) -> str:
    return BASE + f"teams?sportId={feed.sport_id}" + (f"&leagueIds={feed.league_id}" if feed.league_id else "") + f"&season={season_of(feed, now)}"


def parse_teams(reply: Any, feed: Feed) -> list[dict[str, str]]:
    """[{id, abbr, name}] of the league's active teams (the request's league filter is checked again), sorted by name."""
    out = [{"id": str(t["id"]), "abbr": t.get("abbreviation") or "", "name": t.get("name") or ""}
           for t in (reply or {}).get("teams") or [] if isinstance(t, dict) and t.get("id") and t.get("active", True)
           and (feed.league_id is None or (t.get("league") or {}).get("id") == feed.league_id)
           and (t.get("sport") or {}).get("id", feed.sport_id) == feed.sport_id]
    return sorted(out, key=lambda t: t["name"])


def _games(reply: Any) -> list[dict]:
    return [g for d in (reply or {}).get("dates") or [] if isinstance(d, dict) for g in d.get("games") or [] if isinstance(g, dict)
            and str((g.get("status") or {}).get("detailedState") or "").lower() not in SKIP]


def _state(game: dict) -> str:
    s = str((game.get("status") or {}).get("abstractGameState") or "").lower()
    return "POST" if s == "final" else "IN" if s == "live" else "PRE"


def _side(game: dict, which: str) -> dict:
    return ((game.get("teams") or {}).get(which) or {})


def team_game(reply: Any, team_id: str, teams: list[dict[str, str]], now: datetime, league: str = "LMB",
              feed: Feed | None = None) -> tuple[str, dict[str, Any]] | None:
    """(state, attributes) of the team's current game: live, else a result of the last 18 hours, else the next within 8 days."""
    tid, feed = str(team_id), feed or FEEDS.get(league, FEEDS["LMB"])
    mine = [g for g in _games(reply) if tid in (str(_side(g, "home").get("team", {}).get("id")), str(_side(g, "away").get("team", {}).get("id")))]
    when = lambda g: parse_time(g.get("gameDate")) or now  # noqa: E731
    game = next((g for g in mine if _state(g) == "IN"), None) \
        or max((g for g in mine if _state(g) == "POST" and now - when(g) < FINAL_KEEP), key=when, default=None) \
        or min((g for g in mine if _state(g) == "PRE" and timedelta(0) < when(g) - now + timedelta(hours=3) and when(g) - now < timedelta(days=8)), key=when, default=None)
    if game is None:
        return None
    record = {t["id"]: t for t in teams}
    home, away = _side(game, "home"), _side(game, "away")
    mine_side, other = (home, away) if str(home.get("team", {}).get("id")) == tid else (away, home)
    state = _state(game)
    ls = game.get("linescore") or {}

    def side(s: dict, p: str) -> dict[str, Any]:
        t = s.get("team") or {}
        sid = str(t.get("id") or "")
        abbr = t.get("abbreviation") or record.get(sid, {}).get("abbr") or ""
        name = record.get(sid, {}).get("name") or t.get("name") or abbr
        return {f"{p}_id": sid, f"{p}_abbr": abbr, f"{p}_name": t.get("teamName") or name, f"{p}_long_name": name,
                f"{p}_homeaway": "home" if s is home else "away", f"{p}_logo": LOGO_URL.format(id=sid) if sid and feed.logos else None,
                f"{p}_colors": GREY,
                f"{p}_score": str(s["score"]) if s.get("score") is not None and state != "PRE" else None,
                f"{p}_winner": bool(s.get("isWinner")) if state == "POST" and "isWinner" in s else None,
                f"{p}_record": "{}-{}".format(s["leagueRecord"]["wins"], s["leagueRecord"]["losses"])
                if isinstance(s.get("leagueRecord"), dict) and "wins" in s["leagueRecord"] else None}

    attrs: dict[str, Any] = {**side(mine_side, "team"), **side(other, "opponent")}
    game_type = str(game.get("gameType") or "R").upper()
    clock = None
    if state == "IN":
        half = HALF.get(str(ls.get("inningState") or "").lower())
        clock = f"{half} {ls.get('currentInningOrdinal')}" if half and ls.get("currentInningOrdinal") else (game.get("status") or {}).get("detailedState")
    elif state == "POST":
        clock = "Final"
    attrs.update({
        "sport": "baseball", "sport_path": "baseball", "league": league, "league_path": league.lower(),
        "season": SEASON.get(game_type, "regular-season"),
        "game_note": game.get("seriesDescription") if SEASON.get(game_type) == "post-season" else None,
        "event_id": str(game.get("gamePk") or ""), "date": game.get("gameDate"),
        "venue": (game.get("venue") or {}).get("name"),
        "quarter": ls.get("currentInning") if state == "IN" else None,
        "clock": clock, "tv_network": None,
    })
    if state == "IN":
        offense = ls.get("offense") or {}
        attrs.update({"outs": ls.get("outs"), "balls": ls.get("balls"), "strikes": ls.get("strikes"),
                      "on_first": bool(offense.get("first")), "on_second": bool(offense.get("second")), "on_third": bool(offense.get("third"))})
        inning_state = str(ls.get("inningState") or "").lower()
        batting = away if inning_state == "top" else home if inning_state == "bottom" else None  # between halves: nobody
        attrs["possession"] = str((batting.get("team") or {}).get("id") or "") or None if batting else None
    return state, attrs
