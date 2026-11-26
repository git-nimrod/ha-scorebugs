// "Small box '02": after ESPN's NBA bug (2002-04; frame: Suns at Spurs). A small rounded box: a black tab on top with the quarter, the
// network's oval at the top right (here the Home Assistant logo on a light oval), then each team's letters on grey and its score on a
// light cell, and the clock in a black column at the right (the red shot clock under it is left out: no data).
import { el, ordinal, statusText, scoreSlot, haMark, marks, fit, FONTS } from '../kit.js';

const W = 620, H = 340, TAB = 70, ABBR = 196, SCORE = 146, OVAL_W = 224, OVAL_H = 92;
// loop pass 1 (the frame's cells measured by hand, x2.03 to ours: the cells are the same size): on air the letters nearly
// fill their cells: team capitals 39 frame px = 79 here (ours 56), score figures 42 = 85 (ours 56), the clock 47 = 96 (ours 56);
// the letters 1.33x and the clock 1.43x, each squeezed to its cell (fit)
const TAB_PX = 38, ROW_PX = 112, CLOCK_PX = 120, STATUS_PX = 38;

export default {
  id: 'nba-espn-02',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-espn-02 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 88%; color: #f4f4f4; }
.sb-nba-espn-02 { font-weight: 700; font-stretch: 75%; }   /* face: Archivo 700 at 75% width (low confidence) */
.sb-nba-espn-02 .tab { position: absolute; left: 34px; width: ${ABBR + SCORE - 10}px; top: 6px; height: ${TAB + 14}px; display: flex; justify-content: center; padding-top: 10px; box-sizing: border-box;
  border-radius: 18px 18px 0 0; background: #0c0c0d; font-size: ${TAB_PX}px; line-height: 1; text-transform: uppercase; }
.sb-nba-espn-02 .tab .pn { width: 2.1em; text-align: right; } .sb-nba-espn-02 .tab .q { width: 2.6em; margin-left: .3em; }
.sb-nba-espn-02 .tab .sb-ord { font-size: .7em; vertical-align: .3em; }
.sb-nba-espn-02 .bx { position: absolute; left: 10px; right: 10px; top: ${TAB}px; bottom: 6px; display: grid; grid-template-columns: ${ABBR}px ${SCORE}px 1fr; grid-template-rows: 1fr 1fr; gap: 6px; padding: 10px; box-sizing: border-box;
  border-radius: 20px; background: #0c0c0d; box-shadow: 0 3px 10px rgba(0,0,0,.5); }
.sb-nba-espn-02 .ab { display: grid; place-items: center; background: linear-gradient(#6a6c70, #3c3e42); font-size: ${ROW_PX}px; line-height: 1; }
.sb-nba-espn-02 .sc { display: grid; place-items: center; background: linear-gradient(#f6f7f4, #c9ccc6); color: #1a1b1d; font-size: ${ROW_PX}px; line-height: 1; }
.sb-nba-espn-02 .ck { grid-column: 3; grid-row: 1 / 3; display: grid; place-items: center; font-size: ${CLOCK_PX}px; line-height: 1; }
.sb-nba-espn-02 .ck.w { font-size: ${STATUS_PX}px; text-align: center; }
.sb-nba-espn-02 .ov { position: absolute; right: 0; top: 0; width: ${OVAL_W}px; height: ${OVAL_H}px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(#f4f1ec, #cfc9c0 75%); box-shadow: 0 0 0 5px #3a3230, 0 3px 8px rgba(0,0,0,.45); }
.sb-nba-espn-02 .ov .sb-ha { color: #3a3230; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const tab = el('div', 'tab');
    // QTR only under a quarter (a hockey period, a set or a round shows its number alone)
    if (live) { const pn = el('span', 'pn'); pn.appendChild(ordinal(g.period)); tab.append(pn, el('span', 'q', g.period.word || !/^(football|basketball|australian-football)$/.test(g.sport) ? '' : 'QTR')); }
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const ab = fit(el('span', 'ab', (t.abbr || '').toUpperCase())); ab.style.gridRow = String(i + 1);
      // the bigger figures squeezed to their cell (fit after scoreSlot: its three-figure room would push the cell wider than 146)
      const sc = fit(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g)); sc.style.gridRow = String(i + 1);
      bx.append(ab, sc);
    });
    bx.appendChild(live ? fit(el('span', 'ck', g.clock || '')) : el('span', 'ck w', statusText(g, time)));
    const ov = el('div', 'ov'); if (marks(opts).ha) ov.appendChild(haMark(66));
    root.append(tab, bx, ov);
  },
};
