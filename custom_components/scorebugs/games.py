"""Turning ESPN replies into one game per followed team: pure functions, no Home Assistant, tested with saved replies.

The result uses Team Tracker's attribute names (team_*, opponent_*, quarter, clock, possession ...), so Team Tracker cards, Glass
Panes' plain sports layouts and the scorebugs all read our sensors the same way. Written from ESPN's replies themselves (see the
fixtures in tests/), not from Team Tracker's code.

Two kinds of reply carry games:
- a league scoreboard (/scoreboard): today's games (the week's, for the NFL) with live details: scores, clock, down and distance,
  count and bases, records, ranks, the network, the series and the round;
- a team schedule (/teams/<id>/schedule): the whole season with less detail (no colours, no records), used for the next game
  or the last result when the team is not on today's scoreboard.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from .leagues import League

SEASON_BY_TYPE = {1: "preseason", 2: "regular-season", 3: "post-season", 4: "off-season"}
FINAL_KEEP = timedelta(hours=18)  # a final stays the "current" game this long, like Team Tracker's
# soccer competitions name the round in the season slug: slug -> (label, knockout?)
SOCCER_ROUNDS = {
    "group-stage": ("Group Stage", False), "league-phase": ("League Phase", False),
    "knockout-round-playoffs": ("Knockout Playoffs", True), "round-of-32": ("Round of 32", True), "round-of-16": ("Round of 16", True),
    "quarterfinals": ("Quarterfinals", True), "semifinals": ("Semifinals", True), "third-place": ("Third Place", True),
    "final": ("Final", True), "mls-cup": ("MLS Cup", True), "playoffs---championship": ("Championship", True),
    "playoffs---semifinals": ("Semifinals", True), "playoffs---quarterfinals": ("Quarterfinals", True),
    "round-one": ("Round One", True), "conference-semifinals": ("Conference Semifinals", True), "conference-finals": ("Conference Final", True),
}


def _get(d: Any, *path: Any, default: Any = None) -> Any:
    for p in path:
        if isinstance(d, dict):
            d = d.get(p)
        elif isinstance(d, list) and isinstance(p, int) and -len(d) <= p < len(d):
            d = d[p]
        else:
            return default
        if d is None:
            return default
    return d


def parse_time(text: Any) -> datetime | None:
    if not isinstance(text, str):
        return None
    try:
        t = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return None
    return t if t.tzinfo else t.replace(tzinfo=timezone.utc)


def _score(c: dict) -> str | None:
    s = c.get("score")
    if isinstance(s, dict):  # schedules: {"value": 35.0, "displayValue": "35"}
        s = s.get("displayValue")
    return str(s) if s not in (None, "") else None


def _color(c: Any) -> str | None:
    return "#" + c if isinstance(c, str) and len(c) in (3, 6) and all(ch in "0123456789abcdefABCDEF" for ch in c) else None


def _stat(c: dict, name: str) -> float | None:
    for s in c.get("statistics") or []:
        if isinstance(s, dict) and s.get("name") == name:
            try:
                return float(s.get("displayValue"))
            except (TypeError, ValueError):
                return None
    return None


def _networks(comp: dict) -> str | None:
    """The channels a game is on, national ones first (a scoreboard also lists each team's local channel)."""
    names: list[str] = []
    casts = [b for b in comp.get("broadcasts") or [] if isinstance(b, dict)]
    national = lambda b: str(b.get("market") if isinstance(b.get("market"), str) else _get(b, "market", "type") or "").lower() == "national"  # noqa: E731
    for b in sorted(casts, key=lambda b: 0 if national(b) else 1):
        for n in b.get("names") or []:  # scoreboards: {"names": ["Fox"]}
            if isinstance(n, str) and n not in names:
                names.append(n)
        n = _get(b, "media", "shortName")  # schedules: {"media": {"shortName": "Fox"}}
        if isinstance(n, str) and n not in names:
            names.append(n)
    return "/".join(names) or None


def competitors(event: dict) -> list[dict]:
    return [c for c in (_get(event, "competitions", 0, "competitors") or []) if isinstance(c, dict)]


def has_team(event: dict, team_id: str) -> bool:
    return any(str(c.get("id") or _get(c, "team", "id")) == str(team_id) for c in competitors(event))


def game_attributes(event: dict, team_id: str, league: League, team_info: dict | None = None) -> tuple[str, dict[str, Any]] | None:
    """(state, attributes) of `team_id`'s game in one ESPN event; None when the team is not in it.

    state is PRE, IN or POST. `team_info` adds what a schedule leaves out (colours, logo) from the cached team look-ups,
    as {team id: {"color": "#rrggbb", "color2": ..., "logo": ...}}.
    """
    comp = _get(event, "competitions", 0) or {}
    sides = competitors(event)
    mine = next((c for c in sides if str(c.get("id") or _get(c, "team", "id")) == str(team_id)), None)
    if mine is None or len(sides) != 2:
        return None
    other = sides[1] if sides[0] is mine else sides[0]
    status = comp.get("status") or event.get("status") or {}
    state = str(_get(status, "type", "state") or "").upper()
    if state not in ("PRE", "IN", "POST"):
        return None
    info = team_info or {}

    def side(c: dict, p: str) -> dict[str, Any]:
        t = c.get("team") or {}
        tid = str(c.get("id") or t.get("id") or "")
        known = info.get(tid, {})
        logo = t.get("logo") or known.get("logo") or _get(t, "logos", 0, "href")
        rank = _get(c, "curatedRank", "current")
        colors = [x for x in (_color(t.get("color")) or known.get("color"), _color(t.get("alternateColor")) or known.get("color2")) if x]
        return {
            f"{p}_id": tid,
            f"{p}_abbr": t.get("abbreviation"),
            f"{p}_name": t.get("shortDisplayName") or t.get("name") or t.get("nickname"),
            f"{p}_long_name": t.get("displayName"),
            f"{p}_homeaway": c.get("homeAway"),
            f"{p}_logo": logo,
            f"{p}_colors": colors or ["#D3D3D3", "#A9A9A9"],
            f"{p}_score": _score(c),
            f"{p}_record": _get(c, "records", 0, "summary") or _get(c, "record", 0, "displayValue"),
            f"{p}_rank": rank if isinstance(rank, int) and 0 < rank <= 25 else None,
            f"{p}_winner": c.get("winner") if isinstance(c.get("winner"), bool) else None,
        }

    a: dict[str, Any] = {**side(mine, "team"), **side(other, "opponent")}
    sit = comp.get("situation") or {}
    short = _get(status, "type", "shortDetail")
    slug = _get(event, "season", "slug")
    note = _get(comp, "notes", 0, "headline")
    season = slug
    if slug in SOCCER_ROUNDS:
        # soccer cups put the round in the season name ("semifinals", "mls-cup", "group-stage") and the leg in the note ("1st Leg")
        label, knockout = SOCCER_ROUNDS[slug]
        if label == "Championship" and league.code == "NWSL":
            label = "NWSL Championship"
        note = label + (" - " + note if note else "")
        season = "post-season" if knockout else "regular-season"
    elif season not in SEASON_BY_TYPE.values():  # a league's own season name ("2026-27-english-premier-league"): use the season type
        season = SEASON_BY_TYPE.get(_get(event, "seasonType", "type") or _get(event, "season", "type"), "regular-season")
    a.update({
        "sport": league.sport, "sport_path": league.sport, "league": league.code, "league_path": league.path,
        "season": season,
        "event_id": str(event.get("id") or ""), "event_name": event.get("shortName"),
        "game_note": note,
        "date": comp.get("date") or event.get("date"),
        "venue": _get(comp, "venue", "fullName"),
        "tv_network": _networks(comp),
        "series_summary": _get(comp, "series", "summary"),
        "clock": short, "quarter": status.get("period") or None,
        # soccer: the running clock in seconds, so a bug can show MM:SS (ESPN's text gives whole minutes)
        "clock_seconds": status.get("clock") if league.sport == "soccer" and state == "IN" and isinstance(status.get("clock"), (int, float)) else None,
        "last_play": _get(sit, "lastPlay", "text"),
    })
    home = mine if mine.get("homeAway") == "home" else other
    if league.sport == "football":
        a["down_distance_text"] = sit.get("downDistanceText")
        a["possession"] = str(sit["possession"]) if sit.get("possession") not in (None, "") else None
        to_home, to_away = sit.get("homeTimeouts"), sit.get("awayTimeouts")
        a["team_timeouts"], a["opponent_timeouts"] = (to_home, to_away) if home is mine else (to_away, to_home)
    if league.sport == "baseball":
        a.update({k: sit.get(src) for k, src in (("outs", "outs"), ("balls", "balls"), ("strikes", "strikes"),
                                                  ("on_first", "onFirst"), ("on_second", "onSecond"), ("on_third", "onThird"))})
        half = str(short or "").lower()
        away = other if home is mine else mine
        batting = away if half.startswith("top") else home if half.startswith("bot") else None
        a["possession"] = str(batting.get("id")) if batting is not None and state == "IN" else None
        # the scoreboard names the pitcher and batter of a live game when it has them (the tracker fills in what it leaves out)
        for who in ("pitcher", "batter"):
            ath = _get(sit, who, "athlete")
            if isinstance(ath, dict) and isinstance(ath.get("displayName"), str) and state == "IN":
                a[who] = ath["displayName"]
                a[who + "_short"] = ath.get("shortName") or ath["displayName"]
    if league.sport == "hockey":
        for p, c, o in (("team", mine, other), ("opponent", other, mine)):
            shots = _stat(c, "shots")
            goals, saves = _stat(c, "goals"), _stat(o, "saves")
            if shots is None and goals is not None and saves is not None:
                shots = goals + saves  # shots on goal = goals + the other goalie's saves
            a[f"{p}_shots_on_target"] = int(shots) if shots is not None else None
    if league.sport == "soccer":
        for p, c in (("team", mine), ("opponent", other)):
            for key, name in (("shots_on_target", "shotsOnTarget"), ("total_shots", "totalShots"), ("possession", "possessionPct")):
                v = _stat(c, name)
                a[f"{p}_{key}"] = (int(v) if key != "possession" else v) if v is not None else None
    if league.sport in ("volleyball", "australian-football"):
        # volleyball: the points of each set (the score is sets won); AFL: the points of each quarter
        for p, c in (("team", mine), ("opponent", other)):
            vals = [int(x["value"]) for x in c.get("linescores") or [] if isinstance(x, dict) and isinstance(x.get("value"), (int, float))]
            a[f"{p}_{'sets' if league.sport == 'volleyball' else 'quarters'}"] = vals
    if league.sport == "cricket":
        # each side's innings (runs / wickets / overs, who is batting), the format (ODI, Twenty20 ...) and the match summary
        for p, c in (("team", mine), ("opponent", other)):
            inns = [x for x in c.get("linescores") or [] if isinstance(x, dict) and (x.get("runs") or x.get("wickets") or x.get("isBatting"))]
            last = inns[-1] if inns else {}
            a[f"{p}_score_text"] = c.get("score") if isinstance(c.get("score"), str) else None
            a[f"{p}_score"] = str(sum(int(x.get("runs") or 0) for x in inns)) if inns else None
            a[f"{p}_wickets"] = last.get("wickets") if inns else None
            a[f"{p}_overs"] = last.get("overs") if inns else None
            if last.get("isBatting") and state == "IN":
                a["possession"] = a[f"{p}_id"]
        a["game_note"] = a.get("game_note") or _get(comp, "class", "generalClassCard")
        a["last_play"] = _get(status, "summary") or a.get("last_play")
    return state, a


BONUS = {"SINGLE": "single", "DOUBLE": "double", "BONUS": "single", "PENALTY": "double"}


def basketball_situation(reply: Any) -> dict[str, dict[str, Any]] | None:
    """{"home": {...}, "away": {...}} from a live basketball game's core-API situation: each team's timeouts left, its own team fouls
    this period, the fouls it has to give, and whether it shoots the bonus. Checked on a live NBA game:
    timeoutsRemainingCurrent is what is left (timeoutsCurrent is what was used), and bonusState belongs to the team that shoots it
    (ORL at its limit with 0 fouls to give -> DET "DOUBLE"). None when the league does not keep them (college: all zeros)."""
    if not isinstance(reply, dict):
        return None
    num = lambda v: int(v) if isinstance(v, (int, float)) and not isinstance(v, bool) and 0 <= v < 100 else None  # noqa: E731
    out, kept = {}, False
    for side in ("home", "away"):
        to, fo = reply.get(side + "Timeouts"), reply.get(side + "Fouls")
        out[side] = {"timeouts": num(_get(to, "timeoutsRemainingCurrent")), "fouls": num(_get(fo, "teamFoulsCurrent")),
                     "fouls_to_give": num(_get(fo, "foulsToGive")), "bonus": BONUS.get(str(_get(fo, "bonusState") or "").upper())}
        kept = kept or any(num(v) for v in (_get(to, "timeoutsRemainingCurrent"), _get(to, "timeoutsCurrent"), _get(fo, "teamFouls")))
    return out if kept else None  # all zeros all game long: not tracked for this league (college)


def hockey_situation(reply: Any) -> dict[str, Any] | None:
    """{"power_play": bool, "empty_net": bool} from a live hockey game's core-API situation (ESPN does not say which team)."""
    if not isinstance(reply, dict) or not isinstance(reply.get("powerPlay"), bool):
        return None
    return {"power_play": reply["powerPlay"], "empty_net": reply.get("emptyNet") is True}


def baseball_situation(reply: Any) -> dict[str, Any] | None:
    """{"pitcher_id", "pitcher_athlete", "pitcher_stats", "batter_id", "batter_athlete"} from a live baseball game's core-API
    situation: the ids and the core-API links to each player and to the pitcher's numbers in this game (where the pitch count is)."""
    if not isinstance(reply, dict):
        return None
    out: dict[str, Any] = {}
    for who in ("pitcher", "batter"):
        p = reply.get(who)
        pid = p.get("playerId") if isinstance(p, dict) else None
        if isinstance(pid, (int, str)) and str(pid).isdigit():
            out[who + "_id"] = str(pid)
            out[who + "_athlete"] = _get(p, "athlete", "$ref")
            if who == "pitcher":
                out["pitcher_stats"] = _get(p, "statistics", "$ref")
    return out or None


def pitch_count(stats: Any) -> int | None:
    """The pitches thrown, from a pitcher's core-API numbers for one game (category "pitching", stat "pitches")."""
    for cat in _get(stats, "splits", "categories") or []:
        if isinstance(cat, dict) and cat.get("name") == "pitching":
            for s in cat.get("stats") or []:
                if isinstance(s, dict) and s.get("name") in ("pitches", "pitchCount") and isinstance(s.get("value"), (int, float)):
                    return int(s["value"])
    return None


def athlete_names(reply: Any) -> tuple[str, str] | None:
    """(full name, short name) from a core-API athlete reply: ("Tarik Skubal", "T. Skubal")."""
    full = reply.get("displayName") if isinstance(reply, dict) else None
    if not isinstance(full, str) or not full:
        return None
    short = reply.get("shortName")
    return full, short if isinstance(short, str) and short else full


def apply_situation(attrs: dict[str, Any], sport: str, extra: dict[str, Any]) -> None:
    """Put a live game's situation extras on its attributes: per team (team_* / opponent_*) by home and away, or game-wide."""
    home = "team" if attrs.get("team_homeaway") == "home" else "opponent"
    away = "opponent" if home == "team" else "team"
    if sport == "basketball":
        for side, p in (("home", home), ("away", away)):
            for k, v in (extra.get(side) or {}).items():
                attrs[f"{p}_{k}"] = v
    else:
        attrs.update(extra)


def afl_goals_behinds(summary: Any) -> dict[str, tuple[int, int]]:
    """{team id: (goals, behinds)} from an AFL game summary's box score (the scoreboard gives only the points)."""
    out: dict[str, tuple[int, int]] = {}
    for t in _get(summary, "boxscore", "teams") or []:
        stats = {s.get("name"): s.get("displayValue") for s in t.get("statistics") or [] if isinstance(s, dict)}
        try:
            out[str(_get(t, "team", "id"))] = (int(stats["goals"]), int(stats["behinds"]))
        except (KeyError, TypeError, ValueError):
            continue
    return out


def pick_event(events: list[dict], team_id: str, now: datetime, horizon: timedelta = timedelta(days=8)) -> dict | None:
    """The team's current game among `events`: live first, then a final of the last 18 hours, then the next one within `horizon`."""
    mine = [e for e in events if isinstance(e, dict) and has_team(e, team_id)]
    state = lambda e: str(_get(e, "competitions", 0, "status", "type", "state") or _get(e, "status", "type", "state") or "")  # noqa: E731
    when = lambda e: parse_time(_get(e, "competitions", 0, "date") or e.get("date")) or now  # noqa: E731
    live = [e for e in mine if state(e) == "in"]
    if live:
        return live[0]
    finals = sorted((e for e in mine if state(e) == "post" and now - when(e) < FINAL_KEEP), key=when)
    if finals:
        return finals[-1]
    nxt = sorted((e for e in mine if state(e) == "pre" and when(e) > now - timedelta(hours=3) and when(e) - now < horizon), key=when)
    return nxt[0] if nxt else None


def next_poll(states: list[tuple[str, datetime | None]], now: datetime) -> timedelta:
    """How soon to ask again, from the followed teams' current games: fast while one is live or about to start, slow otherwise."""
    soon = timedelta(hours=24)
    for state, start in states:
        if state == "IN":
            return timedelta(seconds=20)
        if state == "PRE" and start is not None:
            until = start - now
            if until <= timedelta(minutes=20):
                return timedelta(seconds=30)  # kick-off is close: catch the first whistle
            soon = min(soon, until)
    if soon <= timedelta(hours=12):
        return timedelta(minutes=5)  # game day
    return timedelta(minutes=60)
