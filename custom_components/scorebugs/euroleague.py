"""EuroLeague and EuroCup basketball, from the league's own public feeds (api-live.euroleague.net and live.euroleague.net). ESPN does not carry it.

Two feeds, both open (no key):
- the season's games (v2): every game with both clubs (the league's three-letter club code, the TV abbreviation, the names and a
  crest address), the start time, the phase and round, `played`, and the final score. While a game is on it still says
  `played: false` with 0-0, so it cannot tell live from not started.
- one game's header (`Header?gamecode=..&seasoncode=..`, about 1 KB, cached 60 s by the league's CDN): `Live`, the quarter, the
  time left in it, the scores, team fouls and timeouts. Asked only for a followed team's game from its start until it is over.
No colours: teams fall back to grey. Crests are the league's own image addresses, loaded at display time, nothing stored.
Pure functions, tested with saved replies. Written from the feeds themselves, not from Team Tracker's code.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from .games import FINAL_KEEP, parse_time

COMPETITION = "E"
COMPETITIONS = {"EUROLEAGUE": "E", "EUROCUP": "U"}  # our league code -> the feeds' competition (EuroCup answers the same feeds)
GAMES_URL = "https://api-live.euroleague.net/v2/competitions/{comp}/seasons/{season}/games"
CLUBS_URL = "https://api-live.euroleague.net/v2/competitions/{comp}/seasons/{season}/clubs"
HEADER_URL = "https://live.euroleague.net/api/Header?gamecode={game}&seasoncode={season}"
GREY = ["#D3D3D3", "#A9A9A9"]
LIVE_WINDOW = timedelta(hours=4)  # after its start a game not yet marked played is checked live this long
POST_PHASES = {"PI": "Play-In", "PO": "Playoffs", "FF": "Final Four"}


def season_code(now: datetime, comp: str = COMPETITION) -> str:
    """The season a date falls in: "E2026" from July 2026 to June 2027."""
    return f"{comp}{now.year if now.month >= 7 else now.year - 1}"


def games_url(now: datetime, comp: str = COMPETITION) -> str:
    return GAMES_URL.format(comp=comp, season=season_code(now, comp))


def clubs_url(now: datetime, comp: str = COMPETITION) -> str:
    return CLUBS_URL.format(comp=comp, season=season_code(now, comp))


def header_url(game_code: Any, now: datetime, comp: str = COMPETITION) -> str:
    return HEADER_URL.format(game=game_code, season=season_code(now, comp))


def parse_clubs(reply: Any) -> list[dict[str, str]]:
    """[{id, abbr, name}] of the season's clubs (id = the league's club code, abbr = the TV abbreviation), sorted by name."""
    out = [{"id": str(c["code"]), "abbr": c.get("tvCode") or c["code"], "name": c.get("name") or c["code"]}
           for c in (reply or {}).get("data") or [] if isinstance(c, dict) and c.get("code") and not c.get("isVirtual")]
    return sorted(out, key=lambda t: t["name"])


def _games(reply: Any) -> list[dict]:
    return [g for g in (reply or {}).get("data") or [] if isinstance(g, dict) and isinstance(g.get("local"), dict) and isinstance(g.get("road"), dict)]


def _code(side: dict) -> str:
    return str((side.get("club") or {}).get("code") or "")


def _when(game: dict, now: datetime) -> datetime:
    return parse_time(game.get("utcDate")) or now


def _in_window(game: dict, now: datetime) -> bool:
    """Started, not marked played, and not long ago: its header says whether it is on."""
    return not game.get("played") and timedelta(0) <= now - _when(game, now) < LIVE_WINDOW


def headers_needed(reply: Any, team_ids: list[str], now: datetime) -> list[int]:
    """The game codes whose live header to ask for: the followed clubs' games that have started and are not marked played."""
    ids = {str(t) for t in team_ids}
    return sorted({int(g["gameCode"]) for g in _games(reply) if g.get("gameCode") is not None and _in_window(g, now)
                   and ({_code(g["local"]), _code(g["road"])} & ids)})


def _header_state(header: dict | None) -> str | None:
    """IN while the header says Live; POST once it is over (no quarter left, 40 minutes or more played); None: not started."""
    if not isinstance(header, dict):
        return None
    if header.get("Live"):
        return "IN"
    played = str(header.get("GameTime") or "")
    if not header.get("Quarter") and played[:2].isdigit() and int(played[:2]) >= 40:
        return "POST"
    return None


def euroleague_game(reply: Any, team_id: str, clubs: list[dict[str, str]], now: datetime,
                    headers: dict[int, dict] | None = None, league: str = "EUROLEAGUE") -> tuple[str, dict[str, Any]] | None:
    """(state, attributes) of the club's current game: live, else a result of the last 18 hours, else the next within 8 days.
    `headers` are the live headers of the games headers_needed named ({game code: header})."""
    tid, headers = str(team_id), headers or {}
    mine = [g for g in _games(reply) if tid in (_code(g["local"]), _code(g["road"]))]

    def state(g: dict) -> str:
        if g.get("played"):
            return "POST"
        h = _header_state(headers.get(int(g.get("gameCode") or 0))) if _in_window(g, now) else None
        return h or "PRE"

    when = lambda g: _when(g, now)  # noqa: E731
    game = next((g for g in mine if state(g) == "IN"), None) \
        or max((g for g in mine if state(g) == "POST" and now - when(g) < FINAL_KEEP), key=when, default=None) \
        or min((g for g in mine if state(g) == "PRE" and timedelta(0) < when(g) - now + LIVE_WINDOW and when(g) - now < timedelta(days=8)), key=when, default=None)
    if game is None:
        return None
    st = state(game)
    header = headers.get(int(game.get("gameCode") or 0)) if not game.get("played") else None
    record = {c["id"]: c for c in clubs}
    home, away = game["local"], game["road"]
    mine_side, other = (home, away) if _code(home) == tid else (away, home)

    def score(s: dict) -> str | None:
        if st == "PRE":
            return None
        if header:  # live, or just over and the season list not yet updated
            return str(header.get("ScoreA" if s is home else "ScoreB") or "0").strip()
        return str(s.get("score")) if s.get("score") is not None else None

    scores = {id(home): score(home), id(away): score(away)}

    def side(s: dict, p: str) -> dict[str, Any]:
        club = s.get("club") or {}
        code = _code(s)
        abbr = club.get("tvCode") or record.get(code, {}).get("abbr") or code
        crest = (club.get("images") or {}).get("crest")
        mine_score, other_score = scores[id(s)], scores[id(home if s is away else away)]
        won = None
        if st == "POST" and mine_score is not None and other_score is not None and mine_score.isdigit() and other_score.isdigit():
            won = int(mine_score) > int(other_score)
        return {f"{p}_id": code, f"{p}_abbr": abbr, f"{p}_name": club.get("editorialName") or club.get("abbreviatedName") or abbr,
                f"{p}_long_name": club.get("name") or record.get(code, {}).get("name"),
                f"{p}_homeaway": "home" if s is home else "away",
                f"{p}_logo": crest if isinstance(crest, str) and crest.startswith("https://") else None,
                f"{p}_colors": GREY, f"{p}_score": mine_score, f"{p}_winner": won}

    attrs: dict[str, Any] = {**side(mine_side, "team"), **side(other, "opponent")}
    phase = str((game.get("phaseType") or {}).get("code") or "RS").upper()
    quarter = str((header or {}).get("Quarter") or "").strip()
    attrs.update({
        "sport": "basketball", "sport_path": "basketball", "league": league, "league_path": league.lower(),
        "season": "post-season" if phase in POST_PHASES else "regular-season",
        "game_note": POST_PHASES.get(phase) if phase in POST_PHASES else None,
        "event_id": str(game.get("identifier") or game.get("gameCode") or ""), "date": game.get("utcDate"),
        "venue": (game.get("venue") or {}).get("name"),
        "quarter": int(quarter) if st == "IN" and quarter.isdigit() else None,
        "clock": str((header or {}).get("RemainingPartialTime") or "").strip() or None if st == "IN" else ("Final" if st == "POST" else None),
        "tv_network": None,
    })
    return st, attrs
