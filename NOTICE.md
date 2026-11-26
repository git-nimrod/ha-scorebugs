# Notices

**Not affiliated.** Scorebugs is a fan project. It is not affiliated with, endorsed by or sponsored by any league, team, tournament,
broadcaster or streaming service.

**Drawn from scratch.** Each scorebug is drawn in code after the general look of a scorebug seen on TV. No network logo, wordmark or
channel mark is drawn or included; in the place where a broadcast showed its own mark, Scorebugs shows the Home Assistant logo (from
Home Assistant's own icon set), the league's logo, your own picture, or nothing. Network names appear only as plain words, to say which
broadcast a look follows.

**Logos are not included.** Team and league logos are loaded at display time from ESPN's public image service, at the addresses the
score feeds give. None is stored in this repository. Your Home Assistant keeps a cached copy of the ones it has shown (in
`/config/.cache/scorebugs/logos`, refreshed monthly, not in backups) so your screens don't fetch them again. They are the trademarks of
their owners.

**Tournament and CFL team logos.** Some tournaments' own logos (golf and tennis majors and team events) and the CFL teams' logos are
loaded at display time from Wikimedia's image servers (upload.wikimedia.org), at the addresses listed in the add-on. They are not stored in
this repository. Many are trademarks shown on Wikipedia under its non-free content rules; they belong to their owners, and Scorebugs is
not affiliated with any of them. When one can't be loaded, the bug shows the name or letters instead.

**Your own pictures.** Team logos and the mark you upload in Configure stay on your Home Assistant and are used only there.

**Data.** Scores come from free public feeds: ESPN's site API for most leagues, the CFL's own feed, the EuroLeague's and EuroCup's
own feeds, and MLB's Stats API for the baseball leagues ESPN doesn't carry. All are unofficial or undocumented for this use, can change
without notice, and run a little behind the broadcast. Only the leagues of the teams you follow are asked for scores.

**Fonts.** Twenty-eight open-licence font families, all under the SIL Open Font License 1.1, each with its licence beside it; see
`custom_components/scorebugs/frontend/fonts/README.md`.

**Icons.** The Home Assistant logo is drawn from Home Assistant's own icon set on your own Home Assistant; it is not bundled. The
Scorebugs logo and icon are the project's own.
