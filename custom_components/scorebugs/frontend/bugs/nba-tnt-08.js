// "Team columns '08": after the NBA score box on TNT, 2008-10 (frame: Spurs at Mavericks, 2nd quarter, from a sheet of TNT's NBA bugs
// by era; rough: the bar is 91 x 27 px on the sheet, so finish readings are guides). A dark bar, black at the left turning deep
// maroon at the right, whose right end is a half circle round a red disc in a white ring holding the network's mark (here the Home
// Assistant logo, white). On it two leaning columns in the teams' colours, each with the team's letters small on top and the score
// large under them; a thin gold rule under the columns; the clock and the quarter under that; the league's logo between the columns
// and the disc. The shot clock (a small red disc at the far left) is left out: no data. Not drawn soft: TNT was in HD by 2008.
// measured (91 px frame, x5): the disc's white ring fitted as a circle (ring.py, circle_fit): centre 0.85 across, 0.51 down, r 9.5 px
// = 0.35 of the bar's height (48 here); the bar's right end fitted on its dark rim: a circle about the same centre, r 13.5 = 0.50
// (half the bar's height), so the end is round (border-radius 50% of the height); the bar is the whole height; columns lean 10 deg (top to the left), 74 high at 7;
// columns the team's colour at about 55% over the bar, letters a light tint of it; caps 15 px on the letters, 28 px on the scores, 19 px on the clock line; gold rule #b8a860 3 px at 88.
import { el, statusText, haMark, marks, fit, scoreSlot, teamPair, shade, alpha, FONTS } from '../kit.js';

const W = 354, H = 135, CX = 286, CY = 69, R = 48, BT = 0, BH = 135, K = 13 / 74;

export default {
  id: 'nba-tnt-08',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-08 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 700; color: #fff; }
/* the bar: its right end a half circle (radius half the bar's height), its left end cut on a slant
 every slant leans like '\' (top to the left), as on air: measured on the frame
 the Mavericks column's right edge runs 2.5 px over 8 (about 17 deg) and its left edge 1.5 over 10 (about 9 deg), both top to the left;
 the columns here 13 px over 74 (10 deg) */
/* the bug starts at the first team's column: the bar's left end is the
 first column's own leaning left side carried on to the bar's top and foot (x = 1 + (y - 7) * 13 / 74: -0.2 at the top, 23.5 at the foot),
 so nothing is left of the team; the 41 px of black and the black wedge before the column are gone and everything moved 41 px left
 (the bug is 414 wide, was 455) */
.sb-nba-tnt-08 .bar { position: absolute; left: 0; top: ${BT}px; width: ${CX + BH / 2}px; height: ${BH}px; border-radius: 0 ${BH / 2}px ${BH / 2}px 0; overflow: hidden;
  clip-path: polygon(${1 - 7 * K}px 0, 100% 0, 100% 100%, ${1 + 128 * K}px 100%); background: linear-gradient(90deg, #141416, #0b0c0e 45%, #08090a);
  box-shadow: inset 0 2px 0 rgba(255,255,255,.1); }
.sb-nba-tnt-08 .bar::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,0) 40%, rgba(0,0,0,.2)); }
/* the bar black all along: it ran from black at the left into maroon (#7a141c) at
 the right; now near-black #0b0c0e end to end, the disc alone red */
/* the two team columns meet: they were parted by a 15 px gap,
 now the first column's leaning right side is the second's left side (both lean 10 deg, 13 px over 74), and each column has a 2 px rim
 in a light tint of its colour round all four sides (the Spurs' black column showed no edge on the black bar); where they meet the two
 rims make one light leaning line between the teams */
.sb-nba-tnt-08 .col { position: absolute; top: 7px; height: 74px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1;
  clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 100%, 13px 100%); }
.sb-nba-tnt-08 .col::before { content: ''; position: absolute; inset: 0; background: var(--fill); box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
  clip-path: polygon(2.4px 2px, calc(100% - 14.7px) 2px, calc(100% - 2.4px) calc(100% - 2px), 14.7px calc(100% - 2px)); }
.sb-nba-tnt-08 .col > * { position: relative; }
.sb-nba-tnt-08 .col .ab { font-size: 22px; letter-spacing: 1px; opacity: .9; white-space: nowrap; }
.sb-nba-tnt-08 .col .sc { font-size: 41px; font-weight: 800; margin-top: 4px; color: #e8e9ee; }
.sb-nba-tnt-08 .col .sc.rec { font-size: 22px; margin-top: 8px; }
.sb-nba-tnt-08 .rule { position: absolute; left: 20px; top: 88px; width: 203px; height: 3px; background: linear-gradient(90deg, rgba(184,168,96,.3), #b8a860 15%, #b8a860 85%, rgba(184,168,96,.3)); }
.sb-nba-tnt-08 .ln { position: absolute; left: 32px; top: 97px; width: 191px; height: 34px; display: flex; align-items: center; justify-content: space-around; font-size: 28px; letter-spacing: 1px; white-space: nowrap; }
/* the gap where the league's logo stood is closed: the disc moved 60 px left so its ring sits
 13 px after the second column's foot corner (238 against 225), the bar ends round it as before; the bug is 354 wide (was 414) */
/* the disc: a circle (border-radius 50%) in a white ring */
.sb-nba-tnt-08 .disc { position: absolute; left: ${CX - R}px; top: ${CY - R}px; width: ${2 * R}px; height: ${2 * R}px; box-sizing: border-box; border-radius: 50%;
  border: 6px solid #f4e4e4; background: radial-gradient(circle at 42% 35%, #8c1620, #640a12 60%, #44060c); box-shadow: 0 0 0 2px rgba(40,4,8,.6);
  display: grid; place-items: center; color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live', mk = marks(opts);
    root.appendChild(el('div', 'bar'));
    const recs = pre && g.away.record && g.home.record;
    // two look-alike teams: one takes its other colour (kit teamPair)
    const cols = teamPair(g.away, g.home, '#3a3f47');
    [[g.away, 1, 116], [g.home, 104, 121]].forEach(([t, x, w], i) => {
      const c = cols[i];
      const col = el('div', 'col');
      col.style.left = x + 'px'; col.style.width = w + 'px';
      // the team's colour see-through over the dark bar (about 55%), the letters in a light tint of it, as on air
      col.style.setProperty('--fill', 'linear-gradient(' + alpha(shade(c, 0.1), 0.6) + ', ' + alpha(c, 0.5) + ' 50%, ' + alpha(shade(c, -0.3), 0.6) + ')');
      col.style.background = alpha(shade(c, 0.6), 0.85);
      col.style.color = shade(c, 0.7);
      const sc = el('span', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      col.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), sc);
      root.appendChild(col);
    });
    root.appendChild(el('div', 'rule'));
    const ln = el('div', 'ln');
    if (live) {
      const p = g.period;
      ln.append(el('span', '', g.clock || ''), el('span', '', p.word ? p.label : (p.label + (p.suffix || '')).toUpperCase()));
    } else ln.appendChild(fit(el('span', '', statusText(g, time))));
    root.appendChild(ln);
    // the league's logo is no longer drawn: the player alone would mean
    // drawing the league's own artwork by hand or recolouring ESPN's file with a filter, and the house rules allow neither
    const disc = el('div', 'disc');
    if (mk.ha) disc.appendChild(haMark(54));
    root.appendChild(disc);
  },
};
