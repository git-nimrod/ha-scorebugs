// "Cream box '05": after ABC's Monday Night Football bug (2004-05). A round black badge at the left with the network's mark (here the Home Assistant logo) holding together two gold
// and cream rows, each with the team's letters dark and its score in white on a black cell, a thin red rule between them; on top a tab
// with the quarter on black and the clock dark on gold; under the rows the down and distance dark on a white plate with a red foot.
import { el, statusText, scoreSlot, haMark, marks, FONTS, GLOSS } from '../kit.js';

// measured on the frame (frame px, our px at 1.68 times): the badge a circle of radius 33.6 on rows 61 tall (1.1 times their
// height), the gold rows starting right at the badge's edge with no red at their ends; the score one black block over both rows, 74 wide,
// its left corners round (radius 18.9 top, 17.0 bottom: 0.29 of the block's height), its right side square; the top tab's black part ends
// in a big arc (a circle of radius 68.5, its centre 27 px above the tab) that sweeps up from the tab's foot to its top over 36 px across,
// the gold filling in under it and running on down into the rows; the white down plate joined to the rows' foot by a dull gold line
// (4 px, about 165,162,127), from under the badge to the rows' right edge
const W = 440, TAB = 56, ROW = 56, BADGE = 124, DOWN = 50, GOLD = 5, ROWS_T = TAB, H = ROWS_T + 2 * ROW + 2 + GOLD + DOWN + 6;
const TL = 100, BLK = 178, ARC = 111;   // the tab's left edge, the black part's width at its top, the arc's radius (68.5 x 1.62)

export default {
  id: 'nfl-abc-05',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H : ROWS_T + 2 * ROW + 12 }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-abc-05 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 80%; color: #fff; }
.sb-nfl-abc-05 .tab { white-space: nowrap; position: absolute; left: ${TL}px; right: 6px; top: 0; height: ${TAB}px; font-size: 36px; line-height: 1;
  background: linear-gradient(90deg, transparent ${BLK - 70}px, rgba(0,0,0,0) ${BLK - 70}px), linear-gradient(#f3d679, #f2d382 60%, #f6e2a4) ${BLK - 70}px 0 / 100% 100% no-repeat; }
/* the quarter in white on the black part (on air the 3rd is white) */
/* the black part: both ends arcs of radius ${ARC} px sweeping up to the right from the foot, so the two lean the same way (checked Nov 24,
   2026: on the frame the left end is 14-22 px further out at the foot than at the top, flaring as it nears the foot, the same lean as
   the right end; it bowed the other way, wider at the top) */
.sb-nfl-abc-05 .tab .q { position: absolute; left: 0; top: 0; width: ${BLK}px; height: 100%; display: flex; align-items: center; justify-content: center; padding-right: 18px; box-sizing: border-box;
  background: linear-gradient(#2a2a2d, #050506); color: #fff; clip-path: path('M 36 0 H ${BLK} A ${ARC} ${ARC} 0 0 1 ${BLK - 60} ${TAB} H 0 A ${ARC} ${ARC} 0 0 0 36 0 Z'); }
.sb-nfl-abc-05 .tab .c { position: absolute; left: ${BLK - 10}px; right: 0; top: 0; height: 100%; display: grid; place-items: center; color: #1a1405; }
/* before and after the game there is no quarter: the whole tab is gold with the start time or FINAL */
.sb-nfl-abc-05 .tab.idle { background: linear-gradient(#f3d679, #f2d382 60%, #f6e2a4); }
.sb-nfl-abc-05 .tab .w { position: absolute; inset: 0; display: grid; place-items: center; color: #1a1405; font-size: 28px; }
.sb-nfl-abc-05 .tab .sb-ord { font-size: .75em; }
/* the rows start under the badge's middle (no red at their ends); the red shows only in the thin line between them */
.sb-nfl-abc-05 .rows { position: absolute; left: ${BADGE / 2}px; right: 6px; top: ${ROWS_T}px; display: grid; grid-auto-rows: ${ROW}px; gap: 2px; background: linear-gradient(90deg, transparent ${BADGE / 2}px, #b3121c ${BADGE / 2}px); box-shadow: 0 4px 9px rgba(0,0,0,.55); }
.sb-nfl-abc-05 .ln { display: flex; align-items: center; justify-content: space-between; padding-left: ${BADGE / 2 + 10}px; background: ${GLOSS}, linear-gradient(90deg, #f0cc63, #f7df8e 55%, #e0b448); color: #1c1608; font-size: 44px; line-height: 1; }
/* the rows' middle more gold, less cream: gold at the ends (#f0cc63, #e0b448) and a lighter gold through the
 middle (#f7df8e, was a near-white cream #fff6d6) */
/* the score one black block over both rows: left corners round (0.29 of the block's height), right side square; it reaches further left,
 152 px (was 124), so a basketball game's three figures (112) fit with room either side */
.sb-nfl-abc-05 .sc { width: 152px; flex: none; height: 100%; display: grid; place-items: center; background: linear-gradient(#2b2b2e, #050506); color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.2); padding: 0 6px; box-sizing: border-box; }
.sb-nfl-abc-05 .ln:first-child .sc { border-radius: 33px 0 0 0; } .sb-nfl-abc-05 .ln:last-child .sc { border-radius: 0 0 0 33px; }
.sb-nfl-abc-05 .sc.rec { font-size: 26px; }
/* the badge: a black disc with a red-brown rim, standing over the rows' left end */
.sb-nfl-abc-05 .badge { position: absolute; left: 0; top: ${ROWS_T + ROW + 1 - BADGE / 2}px; width: ${BADGE}px; height: ${BADGE}px; border-radius: 50%; display: grid; place-items: center; z-index: 2;
  background: radial-gradient(circle at 50% 35%, #3a3a3e, #0b0b0c 60%); box-shadow: 0 0 0 4px #5e1a12, 0 0 0 6px #c9a04a, 0 5px 10px rgba(0,0,0,.6), inset 0 3px 5px rgba(255,255,255,.3); }
.sb-nfl-abc-05 .badge .sb-ha { color: #fff; }
/* the white plate hangs straight from the rows' foot, a dull gold line between them */
.sb-nfl-abc-05 .dn { position: absolute; left: 79px; right: 6px; top: ${ROWS_T + 2 * ROW + 2}px; height: ${DOWN}px; display: grid; place-items: center; color: #15120a; font-size: 34px; line-height: 1;
  border-top: ${GOLD}px solid #b8a468; background: linear-gradient(#ffffff, #dedfe2); border-radius: 0 0 10px 10px; box-shadow: 0 4px 8px rgba(0,0,0,.5), inset 0 -4px 0 #b3121c; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const tab = el('div', 'tab');
    if (live) {
      const q = el('span', 'q'); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toLowerCase()));
      tab.append(q, el('span', 'c', g.clock || ''));
    } else { tab.classList.add('idle'); tab.appendChild(el('span', 'w', statusText(g, time))); }
    const rows = el('div', 'rows');
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      ln.append(el('span', '', (t.abbr || '').toUpperCase()), g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      rows.appendChild(ln);
    });
    const badge = el('div', 'badge'); if (marks(opts).ha) badge.appendChild(haMark(64));
    root.append(tab, rows, badge);
    if (live && g.football && g.football.short) root.appendChild(el('div', 'dn', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal')));
  },
};
