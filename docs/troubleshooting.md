# Troubleshooting

**The card says "Scorebugs could not load its files".** Restart Home Assistant after installing or updating Scorebugs, then reload
the dashboard.

**A look didn't change after an update.** Your browser or the Home Assistant app is holding an old copy. Reload the page; in the
app, **Settings > Companion app > Debugging > Reset frontend cache**.

**"No game coming up".** None of the card's teams has a game scheduled that the league has published yet. Check the team's sensor
(`sensor.scorebugs_...`) in **Developer tools > States**: its attributes show the game it is following.

**"Could not get that league's teams right now".** The league's score service did not answer. Try again in a minute.

**A logo is missing or shows letters.** Logos load from the league's image service when the bug is drawn; when one can't be reached,
the bug shows the team's letters instead. They come back on their own.

**The scores are late.** Scorebugs asks for scores as often as each game needs (every 20 seconds during play, every 30 seconds just before the start), and the services
themselves run a little behind the broadcast.

**Something else.** Open an issue on [GitHub](https://github.com/git-nimrod/ha-scorebugs/issues) with the look's name, the league and
teams, the game state (before, live, final) and a screenshot.
