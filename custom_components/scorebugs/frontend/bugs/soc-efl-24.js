// "Four tiles '24": after Sky Sports' EFL bug (2024-25; frame: reference pack SOC0236-efl, Sheffield United v Wolves, 17:31). Four flat tiles of one size in a row, no crests: the home
// team's letters on its full kit colour, the score on white in navy figures ("0-0"), the away team's letters on its kit colour (dark
// letters on a light kit), the match clock on white. No gloss, no rims, square corners.
// Measured: tiles 84 / 84.5 / 84 / 85 wide (equal quarters), letters
// cap 0.58 of the bar, figures 0.55, clock 0.51 with open tracking (+0.09 em). Score figures navy #141450, clock near black.
// Another Sky EFL frame of that season (SOC0001, Preston v Leeds) has the score and clock tiles near black; the sheet and the
// pack's 2024-25 tile agree on white, so white is built.
// "Review font selected, has sort of crisp ends". Sky's own face cuts its strokes square (flat ends on S, C, 2, 3,
// a flag on the 1); Open Sans ends them on a slant. Set side by side with the pack's 2766 px Sky EFL still of that season (Preston v
// Leeds), Roboto is the open face with the same square-cut ends, and flagged 1, and the same cap height (0.711 against 0.714),
// so every measured size stays.
// measured by hand on the 1080p Sky still (Hull v Coventry, 2024-25; bar 42 px, scaled x1.43): the
// letters are full width and semibold (cap 0.52 of the bar, HUL 87 px wide, stroke 0.18 of the cap): Roboto at 100 % width, 600,
// 44 px; the score figures are far heavier and rounder (stroke 0.33 of the cap, each 0 26 px wide): Archivo Black at 105 %, 42 px
// (stroke 0.28: the heaviest open face we have), with the dash as tall as the figures and wider gaps ("0 - 0" 90 px on air).
import { el, soccerClock, homeFirst, teamColor, teamInk, FONTS, scoreSlot, fit } from '../kit.js';

const T = 169, H = 60, W = 4 * T;

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-efl-24',
  size: { w: W, h: H },
  fonts: [FONTS.roboto, FONTS.archivo],
  css: `
.sb-soc-efl-24 { font-family: 'SB Roboto', Arial, sans-serif; font-weight: 700; font-stretch: 100%; color: #fff; }
.sb-soc-efl-24 .row { position: absolute; left: 0; top: 0; height: ${H}px; display: flex; }
.sb-soc-efl-24 .t { width: ${T}px; height: ${H}px; display: grid; place-items: center; box-sizing: border-box; padding: 0 10px; white-space: nowrap; overflow: hidden; }
/* letters: cap 0.52 of the bar (31 px / Roboto's 0.711), full width, semibold: Sky EFL 2024-25 HUL v COV still (stroke 0.18 of the cap) */
.sb-soc-efl-24 .ab { font-size: 44px; font-weight: 600; line-height: 1; letter-spacing: .02em; }
.sb-soc-efl-24 .sc { background: #fdfdfd; color: #141450; font-family: 'SB Archivo', 'SB Roboto', Arial, sans-serif; font-weight: 900; font-stretch: 105%; font-size: 42px; line-height: 1; display: flex; align-items: center; justify-content: center; gap: 10px; }
.sb-soc-efl-24 .sc .sb-num { min-width: .7em !important; }
.sb-soc-efl-24 .sc.pre { gap: 12px; }
.sb-soc-efl-24 .sc .d { font-size: 1em; }
.sb-soc-efl-24 .ck { background: #fefdfd; color: #141414; font-weight: 600; font-stretch: 100%; font-size: 43px; line-height: 1; letter-spacing: .09em; font-variant-numeric: tabular-nums; }
.sb-soc-efl-24 .ck.when { font-size: 30px; letter-spacing: 0; }
`,
  draw(root, g, { time }) {
    const [h, a] = homeFirst(g);
    const row = el('div', 'row');
    const team = (t) => {
      const c = teamColor(t, '#3a3f47'), n = el('div', 't ab');
      n.style.background = c; n.style.color = teamInk(c);
      n.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      return n;
    };
    const live = g.status !== 'pre';
    const sc = el('div', 't sc' + (live ? '' : ' pre'));
    // before the kick-off the two figure slots stay empty: the kit puts each team's record in them
    sc.append(scoreSlot(el('span', '', live && h.score != null ? String(h.score) : ''), g), el('span', 'd', live ? '-' : ''),
      scoreSlot(el('span', '', live && a.score != null ? String(a.score) : ''), g));
    const clock = mmss(soccerClock(g, time));
    row.append(team(h), sc, team(a), el('div', 't ck' + (clock.length > 5 ? ' when' : ''), clock));
    root.appendChild(row);
  },
};
