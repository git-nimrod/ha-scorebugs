"""Scorebug looks: which bug a team's games are drawn with, set in one place (Scorebugs > Configure, or the Look entities).

- The overall look (options["look"]) and each followed team's look (team["look"]): "" = each league's default, "network" = the look of
  the network showing the game, or a bug id from the catalogue. A team's own look wins over the overall one; when two followed teams
  play each other, the card draws the game from the home team's sensor, so the home team's look wins.
- Card defaults (options["card"]): how bugs draw on every card (logos, marks, picture, texture ...). A card's own settings still win.
- Changing a look or a card default does not reload Scorebugs: the sensors and Look entities just update (SIGNAL_LOOKS).
"""

from __future__ import annotations

import re
from typing import Any

SIGNAL_LOOKS = "scorebugs_looks_changed"
DEFAULT = ""
NETWORK = "network"
LABEL_DEFAULT = "Each league's default"
LABEL_NETWORK = "The network showing the game"

# one name per network (the catalogue writes some two ways); bugs with no network sit under "Universal"
_NET = {"fox": "FOX", "apple": "Apple TV", "apple tv": "Apple TV", "apple tv+": "Apple TV", "netflix": "Netflix", "prime": "Prime Video",
        "prime video": "Prime Video", "sn": "Sportsnet", "sportsnet": "Sportsnet", "yes network": "YES", "fox footy": "FOX Footy",
        "seven": "Seven", "7": "Seven"}

# the card settings Scorebugs keeps defaults for (Configure > How bugs look on cards), with their choices
CARD_DEFAULTS: dict[str, tuple[str, ...]] = {
    "bug_logos": ("auto", "primary", "dark", "secondary", "white", "secondary-white", "black"),
    "bug_marks": ("both", "league", "ha", "none"),
    "bug_mark": ("ha", "league", "own", "none"),
    "bug_mark_style": ("auto", "colour", "dark", "white"),
    "bug_tv": ("auto", "clean", "soft", "vhs"),
    "bug_logo_look": ("sharp", "vintage"),
    "bug_dress": ("auto", "regular", "playoffs", "conf-finals", "finals"),
    "bug_lower": ("show", "hide"),
    "bug_texture": ("auto", "none", "mesh", "carbon", "brushed", "plays", "graffiti"),
    "bug_ink": ("auto", "light", "dark"),
}


def network_of(bug: dict[str, Any]) -> str:
    nets = bug.get("networks") or []
    n = str(nets[0]).strip() if nets else ""
    return _NET.get(n.lower(), n) if n else "Universal"


def _year(bug: dict[str, Any]) -> int:
    m = re.search(r"(\d{4})", str(bug.get("era") or ""))
    return int(m.group(1)) if m else 9999


def bug_label(bug: dict[str, Any]) -> str:
    """ "FOX · 2010 · Two columns '10" """
    parts = [network_of(bug), str(bug.get("era") or "").strip(), str(bug.get("label") or bug.get("id"))]
    return " · ".join(p for p in parts if p)


# Other sports a locked sport's looks may draw as well (kit.js ALSO_DRAWS): a baseball look shows the period, the clock and one detail
# of a football, basketball, hockey or soccer game in its baseball block's place.
ALSO_DRAWS: dict[str, tuple[str, ...]] = {"baseball": ("football", "basketball", "hockey", "soccer")}


def fits(bug: dict[str, Any], sport: str) -> bool:
    """Is this look offered for a sport: made for it, or a look whose sports all also draw it."""
    sports = bug.get("sports") or []
    return sport in sports or (bool(sports) and all(sport in ALSO_DRAWS.get(s, ()) for s in sports))


def bugs_for(catalogue: dict[str, Any], sport: str | None) -> list[dict[str, Any]]:
    """The bugs that can draw a sport (all bugs when sport is None), by network (Universal last), then year, then name."""
    bugs = [b for b in catalogue.get("bugs") or [] if isinstance(b, dict) and b.get("id") and (sport is None or fits(b, sport))]
    return sorted(bugs, key=lambda b: (network_of(b) == "Universal", network_of(b).lower(), _year(b), str(b.get("label") or "")))


def choices(catalogue: dict[str, Any], sport: str | None) -> list[tuple[str, str]]:
    """[(value, label)]: the league default, the network, then every bug that fits the sport."""
    return [(DEFAULT, LABEL_DEFAULT), (NETWORK, LABEL_NETWORK)] + [(b["id"], bug_label(b)) for b in bugs_for(catalogue, sport)]


def clean(value: Any, catalogue: dict[str, Any]) -> str:
    """A look as stored: "", "network" or a known bug id ("" for anything else)."""
    v = str(value or "")
    if v in (DEFAULT, NETWORK):
        return v
    return v if any(b.get("id") == v for b in catalogue.get("bugs") or []) else DEFAULT


LEAGUE = "league"   # a team's own look set to the league default (so the overall look doesn't apply to it)


def team_look(options: dict[str, Any], team: dict[str, Any]) -> str:
    """The look a followed team's games use: its own ("league" = the league default), else the overall one."""
    own = str(team.get("look") or "")
    if own == LEAGUE:
        return DEFAULT
    return own or str(options.get("look") or "")


def card_defaults(options: dict[str, Any]) -> dict[str, str]:
    got = options.get("card") or {}
    return {k: str(v) for k, v in got.items() if k in CARD_DEFAULTS and str(v) in CARD_DEFAULTS[k]}


def structural(options: dict[str, Any]) -> Any:
    """What needs a reload when it changes (the followed teams themselves, logos, the own mark); looks and card defaults don't."""
    teams = [{k: v for k, v in t.items() if k != "look"} for t in options.get("teams") or [] if isinstance(t, dict)]
    return (teams, options.get("mark_at"))
