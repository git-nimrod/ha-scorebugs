"""The CFL, from the league's own public scoreboard feed (cflscoreboard.cfl.ca). ESPN's CFL data stopped after 2022.

The feed gives the season as rounds ("Week 7", "Semi-Finals", "Conference Finals", "113th Grey Cup"), each with its games: both teams
(the CFL's own team ids, names and abbreviations), scores, status (scheduled / complete / anything else while playing), the quarter,
the clock, possession (Home / Away) and timeouts. No logos and no colours: the colours below are the teams' published colours (plain
facts, not marks); the logos are Wikimedia addresses loaded at display time. Pure functions, tested with a saved reply.
Written from the feed itself, not from Team Tracker's code.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from .games import FINAL_KEEP, parse_time
from .leagues import League

ROUNDS_URL = "https://cflscoreboard.cfl.ca/json/scoreboard/rounds.json"
SQUADS_URL = "https://cflscoreboard.cfl.ca/json/scoreboard/squads.json"

# the teams' colours by abbreviation (primary, secondary)
COLORS = {
    "BC": ["#F15A24", "#000000"], "CGY": ["#C8102E", "#FFFFFF"], "EDM": ["#2B5134", "#F2B62F"], "HAM": ["#000000", "#FFB819"],
    "MTL": ["#002D72", "#C8102E"], "OTT": ["#000000", "#D52B1E"], "SSK": ["#00573F", "#FFFFFF"], "TOR": ["#6CACE4", "#002855"],
    "WPG": ["#1D3D7A", "#B6862C"],
}
SEASON = {"PRE": "preseason", "REG": "regular-season", "POST": "post-season"}
# the teams' logos, loaded at display time from Wikimedia (nothing stored; ESPN has none for the CFL)
LOGOS = {
    "BC": "https://upload.wikimedia.org/wikipedia/en/a/a5/BC_Lions_2025.png",
    "CGY": "https://thumb.wikimedia.org/wikipedia/en/thumb/1/14/Calgary_Stampeders_logo.svg/500px-Calgary_Stampeders_logo.svg.png",
    "EDM": "https://upload.wikimedia.org/wikipedia/en/0/0d/Edmonton_Elks_Logo.png",
    "HAM": "https://thumb.wikimedia.org/wikipedia/en/thumb/b/b4/Hamilton_Tiger-Cats_logo.svg/500px-Hamilton_Tiger-Cats_logo.svg.png",
    "MTL": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Montreal_Alouettes_logo_2019.png/500px-Montreal_Alouettes_logo_2019.png",
    "OTT": "https://thumb.wikimedia.org/wikipedia/en/thumb/f/f2/Ottawa_Redblacks_logo.svg/500px-Ottawa_Redblacks_logo.svg.png",
    "SSK": "https://thumb.wikimedia.org/wikipedia/en/thumb/f/f6/Saskatchewan_Roughriders_logo.svg/500px-Saskatchewan_Roughriders_logo.svg.png",
    "TOR": "https://thumb.wikimedia.org/wikipedia/en/thumb/9/9e/Toronto_Argonauts_logo.svg/500px-Toronto_Argonauts_logo.svg.png",
    "WPG": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Winnipeg_Blue_Bombers_Logo.svg/500px-Winnipeg_Blue_Bombers_Logo.svg.png",
}



def parse_squads(reply: Any) -> list[dict[str, str]]:
    """[{id, abbr, name}] of the CFL's teams (the feed lists a placeholder "TBD" team, left out), sorted by name."""
    out = [{"id": str(s["id"]), "abbr": s.get("abbreviation") or "", "name": s.get("name") or ""}
           for s in reply or [] if isinstance(s, dict) and s.get("id")]
    return sorted(out, key=lambda t: t["name"])


def _games(rounds: Any) -> list[tuple[dict, dict]]:
    return [(g, r) for r in rounds or [] if isinstance(r, dict) for g in r.get("tournaments") or [] if isinstance(g, dict)]


def _state(game: dict) -> str:
    s = str(game.get("status") or "").lower()
    return "POST" if s == "complete" else "PRE" if s == "scheduled" else "IN"


def cfl_game(rounds: Any, team_id: str, squads: list[dict[str, str]], now: datetime) -> tuple[str, dict[str, Any]] | None:
    """(state, attributes) of the team's current game: live, else a result of the last 18 hours, else the next within 8 days."""
    mine = [(g, r) for g, r in _games(rounds)
            if str((g.get("homeSquad") or {}).get("id")) == str(team_id) or str((g.get("awaySquad") or {}).get("id")) == str(team_id)]
    when = lambda p: parse_time(p[0].get("date")) or now  # noqa: E731
    pick = next((p for p in mine if _state(p[0]) == "IN"), None) \
        or max((p for p in mine if _state(p[0]) == "POST" and now - when(p) < FINAL_KEEP), key=when, default=None) \
        or min((p for p in mine if _state(p[0]) == "PRE" and timedelta(0) < when(p) - now + timedelta(hours=3) and when(p) - now < timedelta(days=8)), key=when, default=None)
    if pick is None:
        return None
    game, rnd = pick
    record = {s["id"]: s for s in squads}
    home, away = game.get("homeSquad") or {}, game.get("awaySquad") or {}
    mine_side, other = (home, away) if str(home.get("id")) == str(team_id) else (away, home)
    state = _state(game)
    poss = str(game.get("possession") or "")
    holder = home if poss.lower() == "home" else away if poss.lower() == "away" else None
    timeouts = game.get("timeouts") or {}

    def side(s: dict, p: str) -> dict[str, Any]:
        abbr = s.get("shortName") or record.get(str(s.get("id")), {}).get("abbr") or ""
        winner = game.get("winner")
        return {f"{p}_id": str(s.get("id") or ""), f"{p}_abbr": abbr, f"{p}_name": s.get("name") or abbr, f"{p}_long_name": s.get("name"),
                f"{p}_homeaway": "home" if s is home else "away", f"{p}_logo": LOGOS.get(abbr), f"{p}_colors": COLORS.get(abbr, ["#D3D3D3", "#A9A9A9"]),
                f"{p}_score": str(s["score"]) if s.get("score") is not None and state != "PRE" else None,
                f"{p}_winner": (str(winner) == str(s.get("id"))) if state == "POST" and winner else None,
                f"{p}_timeouts": timeouts.get("home" if s is home else "away") if state == "IN" else None}

    attrs: dict[str, Any] = {**side(mine_side, "team"), **side(other, "opponent")}
    attrs.update({
        "sport": "football", "sport_path": "football", "league": "CFL", "league_path": "cfl",
        "season": SEASON.get(str(rnd.get("type") or "").upper(), "regular-season"),
        "game_note": rnd.get("name") if str(rnd.get("type") or "").upper() == "POST" else None,
        "event_id": str(game.get("id") or ""), "date": game.get("date"),
        "quarter": game.get("activePeriod") if state == "IN" else None,
        "clock": game.get("clock") if state == "IN" else ("Final" if state == "POST" else None),
        "possession": str(holder.get("id")) if holder and state == "IN" else None,
        "tv_network": None,
    })
    return state, attrs
