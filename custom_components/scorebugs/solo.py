"""Individual sports from ESPN replies: golf and racing leaderboards, tennis matches and MMA fights. Pure functions, tested with saved replies.

Two shapes come out:
- a board (golf, racing): attributes with kind "board": the event, the round or session, the leading rows and the followed player's row.
  Golf rows carry the hole-by-hole scores of the current round (strokes, and the par of each hole worked out from them).
- a match (tennis, MMA): the same team_* / opponent_* attribute names as a team game, with the followed player as "team", so the
  scorebug code and Team Tracker-style cards read it like any other game. Tennis adds team_sets (games per set).
Written from ESPN's replies (recorded sample replies), not from Team Tracker's code.
"""

from __future__ import annotations

import unicodedata
from datetime import datetime, timedelta
from typing import Any

from .games import FINAL_KEEP, _get, parse_time
from .leagues import League

BOARD_ROWS = 10
RACE_ROWS = 22  # a whole F1 field; a stock-car ticker shows its first 15


def _state(status: dict) -> str:
    return str(_get(status, "type", "state") or "").upper()


def _short(name: str) -> str:
    """'Rory McIlroy' -> 'MCILROY': the surname in capitals, as boards and bugs set it."""
    parts = str(name or "").split()
    return (parts[-1] if parts else "").upper()


def _to_par(text: Any) -> int | None:
    t = str(text or "").strip()
    if t in ("E", "Even", "0"):
        return 0
    try:
        return int(t)
    except ValueError:
        return None


def _par_text(n: int | None) -> str:
    return "" if n is None else "E" if n == 0 else f"{n:+d}"


def _matches(competitor: dict, follow: dict) -> bool:
    if not follow:
        return False
    if follow.get("id") and str(competitor.get("id")) == str(follow["id"]):
        return True
    name = str(follow.get("name") or "").strip().lower()
    athlete = competitor.get("athlete") or {}
    return bool(name) and name in (str(athlete.get("displayName") or "").lower(), str(athlete.get("fullName") or "").lower())


# ---------------------------------------------------------------- golf

def _golf_row(c: dict, current: int) -> dict[str, Any]:
    a = c.get("athlete") or {}
    rounds = [r for r in c.get("linescores") or [] if isinstance(r, dict)]
    now = next((r for r in rounds if r.get("period") == current), None)
    holes = [h for h in (now or {}).get("linescores") or [] if isinstance(h, dict)]
    before = sum(p for r in rounds if (r.get("period") or 0) < current and (p := _to_par(r.get("displayValue"))) is not None)
    strokes = [int(h["value"]) if isinstance(h.get("value"), (int, float)) else None for h in holes]
    vs_par = [_to_par(_get(h, "scoreType", "displayValue")) for h in holes]
    return {
        "id": str(c.get("id") or ""), "name": a.get("displayName") or "", "short": _short(a.get("displayName")),
        "flag": _get(a, "flag", "href"), "country": _get(a, "flag", "alt"),
        "pos": c.get("order"), "score": str(c.get("score") or ""),
        "today": (now or {}).get("displayValue") if holes else None,
        "thru": "F" if len(holes) >= 18 else (len(holes) or None),
        "prior": _par_text(before) if current > 1 else None,
        "strokes": strokes, "hole_par": [s - v if s is not None and v is not None else None for s, v in zip(strokes, vs_par)],
        "rounds": [int(r["value"]) for r in rounds if isinstance(r.get("value"), (int, float)) and len(r.get("linescores") or []) >= 18],
    }


def golf_board(event: dict, league: League, follow: dict | None = None, rows: int = BOARD_ROWS) -> tuple[str, dict[str, Any]]:
    """(state, attributes) of a golf tournament: the leaders and, when one is followed, that player."""
    comp = _get(event, "competitions", 0) or {}
    status = comp.get("status") or event.get("status") or {}
    current = status.get("period") or 1
    field = sorted((c for c in comp.get("competitors") or [] if isinstance(c, dict)), key=lambda c: c.get("order") or 999)
    board = [_golf_row(c, current) for c in field[:rows]]
    # positions as boards print them: a tie shows the same number ("T2" on most boards)
    for i, r in enumerate(board):
        r["tied"] = any(o is not r and o["score"] == r["score"] for o in board)
        r["place"] = next(j + 1 for j, o in enumerate(board) if o["score"] == r["score"])
    me = next((c for c in field if _matches(c, follow or {})), None)
    par = next((r["hole_par"] for r in board if r["hole_par"] and None not in r["hole_par"] and len(r["hole_par"]) == 18), [])
    attrs = {
        "kind": "board", "sport": league.sport, "sport_path": league.sport, "league": league.code, "league_path": league.path,
        "event_id": str(event.get("id") or ""), "event_name": event.get("name"), "date": comp.get("date") or event.get("date"),
        "round": current, "clock": _get(status, "type", "shortDetail"), "par": par,
        "rows": board, "player": _golf_row(me, current) if me else None,
        "tv_network": "/".join(n for b in comp.get("broadcasts") or [] for n in (b.get("names") or [])) or None,
    }
    if attrs["player"]:
        attrs["player"]["place"] = next((j + 1 for j, c in enumerate(field) if str(c.get("score")) == attrs["player"]["score"]), None)
    state = _state(status)
    return (state if state in ("PRE", "IN", "POST") else "NOT_FOUND"), attrs


# ---------------------------------------------------------------- racing

SESSION_ORDER = {"Race": 0, "Sprint": 1, "Qual": 2, "SQ": 3, "FP3": 4, "FP2": 5, "FP1": 6}


def pick_session(event: dict, now: datetime) -> dict | None:
    """The session to show: a live one, else the race once it has run, else the latest finished session, else the next one."""
    comps = [c for c in event.get("competitions") or [] if isinstance(c, dict)]
    live = [c for c in comps if _state(c.get("status") or {}) == "IN"]
    if live:
        return live[0]
    done = [c for c in comps if _state(c.get("status") or {}) == "POST"]
    if done:
        return max(done, key=lambda c: parse_time(c.get("date")) or now)
    return min(comps, key=lambda c: parse_time(c.get("date")) or now) if comps else None


def race_board(event: dict, league: League, follow: dict | None, now: datetime, cars: dict[str, dict] | None = None,
               rows: int = RACE_ROWS) -> tuple[str, dict[str, Any]]:
    """(state, attributes) of a race weekend: the running order of its session, team colours where known, and the followed driver."""
    comp = pick_session(event, now) or {}
    cars = cars or {}
    field = sorted((c for c in comp.get("competitors") or [] if isinstance(c, dict)), key=lambda c: c.get("order") or 999)

    def row(c: dict) -> dict[str, Any]:
        a = c.get("athlete") or {}
        car = cars.get(str(c.get("id")), {})
        color = car.get("teamColor")
        return {"id": str(c.get("id") or ""), "name": a.get("displayName") or "", "short": _short(a.get("displayName")),
                "code": unicodedata.normalize("NFKD", _short(a.get("displayName"))).encode("ascii", "ignore").decode()[:3], "flag": _get(a, "flag", "href"), "pos": c.get("order"),
                "number": car.get("number"), "team": car.get("manufacturer"),
                "color": "#" + color if isinstance(color, str) and len(color) == 6 else None, "winner": c.get("winner") is True}

    me = next((c for c in field if _matches(c, follow or {})), None)
    circuit = event.get("circuit") or {}
    status = comp.get("status") or event.get("status") or {}
    attrs = {
        "kind": "board", "sport": league.sport, "sport_path": league.sport, "league": league.code, "league_path": league.path,
        "event_id": str(event.get("id") or ""), "event_name": event.get("shortName") or event.get("name"),
        "date": comp.get("date") or event.get("date"), "session": _get(comp, "type", "abbreviation"),
        "circuit": circuit.get("fullName"), "city": _get(circuit, "address", "city"), "country": _get(circuit, "address", "country"),
        "clock": _get(status, "type", "shortDetail"), "lap": status.get("period") or None,
        "rows": [row(c) for c in field[:rows]], "player": row(me) if me else None,
        "tv_network": "/".join(n for b in comp.get("broadcasts") or [] for n in (b.get("names") or [])) or None,
    }
    state = _state(status)
    return (state if state in ("PRE", "IN", "POST") else "NOT_FOUND"), attrs


# ---------------------------------------------------------------- tennis and MMA

def _matches_of(event: dict) -> list[tuple[dict, dict]]:
    """(competition, grouping) pairs: tennis groups its matches (Men's Singles ...), MMA lists the bouts of the card."""
    out = []
    for g in event.get("groupings") or []:
        for c in g.get("competitions") or []:
            out.append((c, g))
    for c in event.get("competitions") or []:
        out.append((c, {}))
    return [(c, g) for c, g in out if isinstance(c, dict) and len(c.get("competitors") or []) == 2]


def match_attributes(event: dict, league: League, follow: dict, now: datetime) -> tuple[str, dict[str, Any]] | None:
    """The followed player's match (tennis) or fight (MMA) in this event: live first, then a result of the last 18 hours, then the next.

    Following the event itself (id "event") gives the card's main event for MMA.
    """
    pairs = _matches_of(event)
    if follow.get("id") == "event":
        mine = pairs[-1:] if league.sport == "mma" else []
    else:
        mine = [(c, g) for c, g in pairs if any(_matches(x, follow) for x in c["competitors"])]
    if not mine:
        return None
    when = lambda p: parse_time(p[0].get("date") or p[0].get("startDate")) or now  # noqa: E731
    state = lambda p: _state(p[0].get("status") or {})  # noqa: E731
    pick = next((p for p in mine if state(p) == "IN"), None) \
        or max((p for p in mine if state(p) == "POST" and now - when(p) < FINAL_KEEP), key=when, default=None) \
        or min((p for p in mine if state(p) == "PRE"), key=when, default=None)
    if pick is None:
        return None
    comp, group = pick
    first, second = comp["competitors"]
    me = first if follow.get("id") == "event" or _matches(first, follow) else second
    other = second if me is first else first

    def side(c: dict, p: str) -> dict[str, Any]:
        a = c.get("athlete") or {}
        roster = c.get("roster") or {}
        name = a.get("displayName") or roster.get("displayName") or ""
        sets = [int(s["value"]) for s in c.get("linescores") or [] if isinstance(s, dict) and isinstance(s.get("value"), (int, float))]
        won = sum(1 for s in c.get("linescores") or [] if isinstance(s, dict) and s.get("winner") is True)
        rank = _get(c, "curatedRank", "current")
        return {f"{p}_id": str(c.get("id") or ""), f"{p}_name": name, f"{p}_long_name": name, f"{p}_abbr": _short(name),
                f"{p}_logo": _get(a, "flag", "href") or _get(a, "headshot", "href"), f"{p}_colors": ["#2b2f36", "#9aa0a6"],
                f"{p}_score": str(won) if league.sport == "tennis" and sets else None, f"{p}_sets": sets,
                f"{p}_tiebreaks": [s.get("tiebreak") for s in c.get("linescores") or [] if isinstance(s, dict)],
                f"{p}_record": _get(c, "records", 0, "summary"), f"{p}_rank": rank if isinstance(rank, int) else None,
                f"{p}_winner": c.get("winner") if isinstance(c.get("winner"), bool) else None, f"{p}_homeaway": c.get("homeAway") or ("home" if c is first else "away")}

    status = comp.get("status") or {}
    attrs: dict[str, Any] = {**side(me, "team"), **side(other, "opponent")}
    attrs.update({
        "sport": league.sport, "sport_path": league.sport, "league": league.code, "league_path": league.path, "kind": "match",
        "event_id": str(event.get("id") or ""), "event_name": event.get("name"),
        "game_note": _get(comp, "round", "displayName") or _get(comp, "type", "abbreviation") or group.get("grouping", {}).get("displayName"),
        "match_type": _get(comp, "type", "text") or _get(group, "grouping", "displayName"),
        "date": comp.get("date") or comp.get("startDate") or event.get("date"),
        "clock": _get(status, "type", "shortDetail"), "quarter": status.get("period") or None,
        "fight_clock": status.get("displayClock") if league.sport == "mma" else None,
        "season": "regular-season",
        "tv_network": "/".join(n for b in comp.get("broadcasts") or [] for n in (b.get("names") or [])) or None,
    })
    st = state(pick)
    return (st if st in ("PRE", "IN", "POST") else "NOT_FOUND"), attrs


def solo_state(event: dict | None, league: League, follow: dict, now: datetime, cars: dict | None = None) -> tuple[str, dict[str, Any]]:
    """One followed item of an individual sport: a tournament or race board (golf, racing), or a player's match or fight."""
    base = {"sport": league.sport, "league": league.code, "league_path": league.path, "kind": "board" if league.kind in ("golf", "racing") else "match"}
    if not event:
        return "NOT_FOUND", base
    if league.kind == "golf":
        state, attrs = golf_board(event, league, None if follow.get("id") == "event" else follow)
    elif league.kind == "racing":
        state, attrs = race_board(event, league, None if follow.get("id") == "event" else follow, now, cars)
    else:
        found = match_attributes(event, league, follow, now)
        if found is None:
            return "NOT_FOUND", {**base, "event_name": event.get("name"), "team_name": follow.get("name")}
        state, attrs = found
    if follow.get("id") != "event" and league.kind in ("golf", "racing") and not attrs.get("player"):
        state = "NOT_FOUND"   # the followed player is not in this event's field
    return state, attrs
