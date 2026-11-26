# Card options

The card editor asks only for your team and its look. Everything else comes from **Configure > How bugs look on cards** (see
[Settings](settings.md)), so all your cards match. To change one card on its own, open it in the **code editor** (the card editor's
three-dot menu > Show code editor) and add any option below. A card's own option always wins over the Configure default.

## A minimal card

```yaml
type: custom:scorebug-card
entities:
  - sensor.scorebugs_nfl_chi
```

## A card with its own look

```yaml
type: custom:scorebug-card
entities:
  - sensor.scorebugs_nfl_chi
  - sensor.scorebugs_nba_chi
bug: nfl-fox-12
bug_by_team:
  "NBA:CHI": nba-tnt-08
bug_tv: soft
max_games: 2
```

## Games and teams

| Option | Values | Default | What it does |
|---|---|---|---|
| `entities` | a list of sensors | (required) | The teams to show: Scorebugs' own sensors, or [Team Tracker](https://github.com/vasqued2/ha-teamtracker) sensors. |
| `max_games` | 1 to 6 | 3 | How many games to show at once, when several of the card's teams play. |
| `empty_text` | any text | `No game coming up` | What the card says when none of its teams has a game. |

## Which look

| Option | Values | Default | What it does |
|---|---|---|---|
| `bug` | `auto`, `network`, or a look's id | `auto` | `auto`: the look from Configure (the team's, else the overall one, else the league's default). `network`: the look of the network showing the game. An id from [Every look](bugs.md): always that look. |
| `bug_by_team` | a map `"LEAGUE:LETTERS": id` | (none) | When that team plays, its look. The key can be the letters alone (`CHI`). The value can be `network`. Checked before `bug`. |
| `bug_by_league` | a map `LEAGUE: id` | (none) | A look for every game of that league. |

## How it draws

These are the same settings as **Configure > How bugs look on cards**; set here, they apply to this card only.

| Option | Values | What it does |
|---|---|---|
| `bug_logos` | `auto`, `primary`, `dark`, `secondary`, `white`, `secondary-white`, `black` | The team logo version (`auto`: each team's My teams choice). |
| `bug_marks` | `both`, `league`, `ha`, `none` | The small marks a look carries. |
| `bug_mark` | `ha`, `league`, `own`, `none` | What goes in the network's spot: the Home Assistant logo, the league's logo, your own picture, or nothing. |
| `bug_mark_style` | `auto`, `colour`, `dark`, `white` | The league logo's version. |
| `bug_tv` | `auto`, `clean`, `soft`, `vhs` | The picture: the look's own, sharp, an old TV, or taped off TV. |
| `bug_logo_look` | `sharp`, `vintage` | Vintage softens the team logos a touch. |
| `bug_dress` | `auto`, `regular`, `playoffs`, `conf-finals`, `finals` | The playoff look, on looks that have one (`auto`: from the game's round). |
| `bug_lower` | `show`, `hide` | The strip under the main bar, on looks that have one. |
| `bug_strip_color` | `#rrggbb` | That strip's colour (empty: the look's own). |
| `bug_texture` | `auto`, `none`, `mesh`, `carbon`, `brushed`, `plays`, `graffiti` | The pattern over a look's panels, on looks that use one. |
| `bug_ink` | `auto`, `light`, `dark` | The colour of the parts that sit straight on the card. |

## Size and place

| Option | Values | Default | What it does |
|---|---|---|---|
| `align` | `left`, `center`, `right` | `center` | Where the bug sits when the card is wider than it. |
| `bug_height` | pixels | the look's own | Draw the bug no taller than this. |
| `bug_gap` | pixels | 8 | The space between games when the card shows more than one. |

## Demo games

For trying looks out, or showing them off, with no game on.

| Option | Values | What it does |
|---|---|---|
| `demo` | `cycle`, `pre`, `live`, `final` | A made-up game between the card's teams. `cycle` plays before, live and final, a minute each, again and again. The card is labelled "Demo game". |
| `demo_league` | `NCAAF`, `NCAAM`, `WNBA`, `CFL`, `EPL`, `CL`, `BUND`, `MLS`, `NWSL`, `WC`, `PGA`, `F1`, `ATP`, `UFC`, `AFL`, `IPL`, `NCAAVB` | With `demo` and no sensor: a sample game of that league with real teams or players. |

```yaml
type: custom:scorebug-card
demo: cycle
demo_league: EPL
bug: soc-crest-25
```
