# Contributing

Thanks for helping out. The most useful help is real-world reports: a bug that draws wrong for your team or league, a game that shows the
wrong state, or a broadcast look you'd like to see.

## Ground rules

- **No network logos, wordmarks or channel bugs.** Scorebugs draws every look in code and puts the Home Assistant logo where a
  broadcast showed its own mark. Changes that add a network's mark can't be accepted.
- **No logos or pictures in the repository.** Team and league logos load at display time; nothing of a league's, team's or network's is
  stored here.
- **Open-licence fonts only**, with the licence file beside each (see `custom_components/scorebugs/frontend/fonts/README.md`).
- **Never paste secrets** into an issue or a pull request: no access tokens, passwords, IP addresses or entity ids from a real house.

## Reporting a look that draws wrong

Say which look (its name in the card editor), the league and teams, and the game state (before, live, final). A screenshot helps; blur
anything personal.

## Pull requests

Small, focused pull requests are welcome. Please open an issue first for anything bigger, so we can agree on the approach. Maintainers
run the full automated test suite before every release, and may ask for changes based on it.

## Where things are

| Path | What |
|---|---|
| `custom_components/scorebugs/` | The Home Assistant integration (this is what HACS installs) |
| `custom_components/scorebugs/frontend/` | The Scorebug card, the shared kit and every look |
| `custom_components/scorebugs/frontend/bugs/` | One file per look |
| `docs/` | Documentation |
