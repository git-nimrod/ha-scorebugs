// "Two rows '24": after MASN's MLB bug (2020s; frame: Rangers at Orioles). Rebuilt to the frame (it stacks the teams):
// two rows, each with the team's logo on a tile of its colour and its score on a bevelled light-grey tile; beside them a dark 2 x 2
// block: the bases as grey diamonds (yellow when occupied) over the count, the inning (a yellow arrow and the number) over the outs as
// yellow dots. The pitcher and batter lines under it are left out (no data); the network's mark is not on this bug.
import { el, fit, otherSport, logo, bases, statusText, teamColor, shade, scoreSlot, FONTS, BEVEL } from '../kit.js';

const ROW = 92, LOGO_W = 196, SCORE = 120, BASES = 160, INN = 104, GAP = 4;
const W = LOGO_W + SCORE + BASES + INN + 3 * GAP, H = 2 * ROW + GAP;
// sizes against the row's height, as on air (frame row 113 px): score figures 62 %, count 42 %, inning 49 %, out dots 39 %, the bases
// as tall as the row
const SCORE_PX = 88, ROW_PX = 56;

export default {
  id: 'mlb-masn-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  fonts: [FONTS.baiJamjuree],
  css: `
.sb-mlb-masn-24 { font-family: 'SB Bai Jamjuree', 'Arial', sans-serif; font-weight: 600; color: #fff; }
/* face: MASN 2024: Bai Jamjuree Bold */
.sb-mlb-masn-24 .g { position: absolute; inset: 0; display: grid; grid-template-columns: ${LOGO_W}px ${SCORE}px ${BASES}px ${INN}px; grid-template-rows: ${ROW}px ${ROW}px; gap: ${GAP}px;
  background: #0b0c0e; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-mlb-masn-24 .lg { display: grid; place-items: center; overflow: hidden; } .sb-mlb-masn-24 .lg .sb-logo { width: 150px; height: 82px; object-fit: contain; }
.sb-mlb-masn-24 .sc { display: grid; place-items: center; background: linear-gradient(#ffffff, #e4e5e7 40%, #b9bcc1); box-shadow: ${BEVEL}; color: #111; font-size: ${SCORE_PX}px; line-height: 1; white-space: nowrap; }
.sb-mlb-masn-24 .ck { display: grid; place-items: center; background: #000;   /* plain black, as on air */
  font-size: ${ROW_PX}px; }
.sb-mlb-masn-24 .sb-bases i { background: #8c8e93; } .sb-mlb-masn-24 .sb-bases i.on { background: #f2d43a; }
.sb-mlb-masn-24 .outs { display: flex; gap: 10px; } .sb-mlb-masn-24 .outs i { width: 36px; height: 36px; border-radius: 50%; background: #55575c; } .sb-mlb-masn-24 .outs i.on { background: #f2d43a; }
.sb-mlb-masn-24 .inn { font-size: 1.15em; }
.sb-mlb-masn-24 .inn b { color: #f2d43a; font-size: .6em; margin-right: 6px; vertical-align: .2em; }
.sb-mlb-masn-24 .ck.w { grid-column: 3 / 5; grid-row: 1 / 3; font-size: ${ROW_PX * 0.8}px; }
.sb-mlb-masn-24 .ck.dt { font-size: 30px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const grid = el('div', 'g');
    const cell = (cls, row, col, child) => { const c = el('div', cls); c.style.gridRow = String(row); c.style.gridColumn = String(col); if (child) c.appendChild(child); grid.appendChild(c); return c; };
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#3a3f47');
      const lg = cell('lg', i + 1, 1, logo(t, 150)); lg.style.background = 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.12) + ')';
      // before the first pitch the record on the score's tile, smaller
      const sc = g.status === 'pre' ? el('span', 'sc', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre') sc.style.fontSize = ((t.record || '').length > 5 ? 26 : 34) + 'px';
      sc.style.gridRow = String(i + 1); sc.style.gridColumn = '2'; grid.appendChild(sc);
    });
    if (live) {
      cell('ck', 1, 3, bases(b.bases, 38));
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      cell('ck', 1, 4, inn);
      cell('ck', 2, 3, el('span', '', b.balls + '-' + b.strikes));
      const outs = el('span', 'outs'); for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      cell('ck', 2, 4, outs);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      // (no detail: the period takes the bases' room too)
      if (os.detail) cell('ck dt', 1, 3, el('span', '', os.detail));
      const p = cell('ck', 1, os.detail ? 4 : '3 / 5', fit(el('span', 'inn', os.period)));
      cell('ck', 2, '3 / 5', el('span', '', os.clock));
    } else { const w = el('div', 'ck w', statusText(g, time)); grid.appendChild(w); }
    root.appendChild(grid);
  },
};
