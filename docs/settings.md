# Settings

Everything Scorebugs keeps is under **Settings > Devices & services > Scorebugs > Configure**. The menu shows the teams you
follow and five choices.

## Add a team

Three steps: **Sport**, then **League**, then **Team, player or event** and its **Logo version**.

| Field | What it does |
|---|---|
| Sport | 17 sports, from American football to water polo. |
| League | The leagues of that sport (see [Leagues you can follow](leagues.md)). |
| Team, player or event | Your team. For golf, racing and UFC you can follow the whole event; for tennis, golf, racing and UFC, one person from the current field. |
| Logo version | Which of the team's logos the bugs show: **Primary**, **Dark** (for dark backgrounds), **Secondary**, **White**, **Secondary, white** or **Black**. When a team has no logo of that kind, the closest one is used. |

You can follow up to **30** teams. Each gets:

- a **sensor**, `sensor.scorebugs_<league>_<letters>`, whose state is the game's status and whose attributes hold the game
  (teams, scores, clock, period, down and distance, count and bases, records, the network...);
- a **Look** entity, `select.scorebugs_<league>_<letters>_look`, the look that team's games are drawn with.

Only the leagues of the teams you follow are ever asked for scores, and only as often as their games need.

## Team logo

Pick a team, then its logo:

- **Any logo ESPN has for the team** (often a dozen or more: the main and second logo for light, dark and team-colour backgrounds, all
  white, all black and more). The screen links each one so you can see it first.
- **My own picture**: upload a PNG, WebP or JPG of up to 2 MB (square with a clear background looks best), or put one in
  `/config/scorebugs/logos/` as `<league>/<ESPN team id>.png` (for example `nfl/8.png`) and pick My own picture without uploading. It
  stays on your Home Assistant and is used only for that team. Going back to an ESPN logo keeps the picture for later; removing the team
  deletes it.

## Remove teams

Tick the teams to stop following. Their sensors and Look entities go away.

## Your own mark

Bugs show the **Home Assistant logo** where the TV network's logo was. Upload a picture here, and any card set to **Your own picture**
(see *In the network's spot* below) shows it there instead. Tick **Remove my picture** to go back to the Home Assistant logo.

## Scorebug looks

Pick whose look to set, then the look.

| Look for | What it sets |
|---|---|
| Overall (every team without its own look) | The look for every team that has none of its own. `select.scorebugs_look`. |
| One of your teams | That team's look. `select.scorebugs_<league>_<letters>_look`. |

A card that picked its own look keeps it. When two of your teams play each other, the **home team's** look is used. Every look is
listed in [Every look](bugs.md). **Each league's default** uses the look marked as that league's default. Choosing **The network showing the game** draws each game in the look of the network showing it, where
Scorebugs has one.

## How bugs look on cards

Defaults for every Scorebug card (and Glass Panes panes). A card that sets one of these itself keeps its own. The YAML name of each
is in brackets, for use on a single card (see [Card options](card-options.md)).

| Setting | Choices | What it does |
|---|---|---|
| Team logos (`bug_logos`) | Each team's My teams choice, Primary, Dark, Secondary, White, Secondary white, Black | Which logo version to draw. |
| Marks on the bug (`bug_marks`) | League and Home Assistant, League only, Home Assistant only, None | The small marks a look carries. |
| In the network's spot (`bug_mark`) | Home Assistant logo, The league's logo, Your own picture, Nothing | What goes where the broadcast showed its own logo. A league without a logo, or no picture of your own, shows the Home Assistant logo. |
| League logo version (`bug_mark_style`) | Automatic, Colour, For dark backgrounds, White | Automatic picks the version that reads on the bug. |
| Picture (`bug_tv`) | The bug's own, Sharp, Old TV, VHS tape | Retro looks come out a little soft, like an old TV, by default. |
| Team logos look (`bug_logo_look`) | Sharp, Vintage | Vintage softens the logos a touch, as on an old broadcast. |
| Playoff look (`bug_dress`) | By the season and round, Regular season, Playoffs, Conference finals, Finals | Looks that a network changed for the playoffs follow the game's round by default. |
| Strip under the bug (`bug_lower`) | Show, Hide | The strip under some looks' main bar (records, the day, the round). Hidden, the bug is shorter and the records move into the bar before the game. |
| Panel texture (`bug_texture`) | The bug's own, None, Wire mesh, Carbon weave, Brushed metal, Football plays, Graffiti | The pattern over a look's panels, on looks that use one. |
| Text off the bug (`bug_ink`) | Automatic, Light, Dark | The colour of the parts that sit straight on the card. Automatic reads the card's own colour. |

## Look entities in automations

Every Look entity is an ordinary select, so an automation can change it. For example, switch your team to its playoff look:

```yaml
action: select.select_option
target:
  entity_id: select.scorebugs_nfl_chi_look
data:
  option: "Flat bar '26"
```
