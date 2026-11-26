// "Black box '90s": after NBC's NFL bug of the 1990s (frame: Cowboys v Steelers, Super Bowl XXX era). A black box: each team's name in
// tall white capitals with its score in a white box beside it, the quarter stacked at the right ("4th" over "QTR"), and under them the
// network's mark (here the Home Assistant logo) and the clock in a big segmented display. Drawn soft, as on an old TV.
import { el, statusText, haMark, marks, scoreSlot, FONTS , fit } from '../kit.js';

// sizes against the box's width on the frame (its foot is cut off, so not its height): the score's figures 0.076
// of the width tall, nearly filling their white box. The names (0.070) and the clock (0.165) already matched.
const W = 480, H = 236, ROW = 58, NAME_PX = 48, SCORE_PX = 52, QTR_PX = 34, CLOCK_PX = 66, MARK_PX = 70;

export default {
  id: 'nfl-nbc-90',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo, { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-nfl-nbc-90 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 62%; color: #f2f2f2; }
.sb-nfl-nbc-90 { font-weight: 700; font-stretch: 68%; }   /* face: Archivo 700 at 68% width (medium confidence) */
.sb-nfl-nbc-90 .bx { position: absolute; inset: 0; background: rgba(6,6,7,.94); box-shadow: 0 3px 8px rgba(0,0,0,.5); display: grid; grid-template-columns: minmax(0, 1fr) 86px 96px;
  grid-template-rows: ${ROW}px ${ROW}px 1fr; padding: 12px 14px 10px; box-sizing: border-box; column-gap: 10px; row-gap: 6px; align-items: center; }
.sb-nfl-nbc-90 .nm { font-size: ${NAME_PX}px; line-height: 1; letter-spacing: 1px; white-space: nowrap; }
.sb-nfl-nbc-90 .r1 { border-bottom: 2px solid #8a8a8a; padding-bottom: 4px; }
.sb-nfl-nbc-90 .sc { height: ${ROW - 6}px; display: grid; place-items: center; background: #f2f2f2; color: #0b0b0b; font-size: ${SCORE_PX}px; font-stretch: 75%; line-height: 1; }
.sb-nfl-nbc-90 .q { font-size: ${QTR_PX}px; line-height: 1; text-align: center; font-stretch: 80%; }
.sb-nfl-nbc-90 .low { grid-column: 1 / 4; display: flex; align-items: center; justify-content: space-between; }
.sb-nfl-nbc-90 .low .sb-ha { color: #f2f2f2; }
.sb-nfl-nbc-90 .ck { font-family: 'SB DSEG7', monospace; font-size: ${CLOCK_PX}px; color: #f2f2f2; letter-spacing: 2px; }
.sb-nfl-nbc-90 .low .w { font-size: ${QTR_PX}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    const name = (t) => (t.name || t.abbr || '').toUpperCase().slice(0, 12);
    // QTR only under a quarter (a hockey period, a set or a round shows its number alone)
    const qtr = !g.period.word && /^(football|basketball|australian-football)$/.test(g.sport) && g.league !== 'NCAAM';
    const q = live ? [g.period.label + (g.period.suffix || '').toLowerCase(), qtr ? 'QTR' : ''] : ['', ''];
    [g.away, g.home].forEach((t, i) => {
      // a long name (COMMANDERS, BUCCANEERS) squeezes into its column; it widened the box and pushed FINAL and the start time off the
      // right edge
      const nm = fit(el('span', 'nm' + (i === 0 ? ' r1' : ''), name(t)));
      bx.append(nm, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g), el('span', 'q', q[i]));
    });
    const low = el('div', 'low');
    low.appendChild(marks(opts).ha ? haMark(MARK_PX) : el('span'));
    low.appendChild(live ? fit(el('span', 'ck', g.clock || '')) : el('span', 'w', statusText(g, time)));
    bx.appendChild(low);
    root.appendChild(bx);
  },
};
