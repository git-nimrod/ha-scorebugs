// "Orange oval '99": after ABC's NHL bug (1999-2002; frame: Devils at Stars). An orange oval at the top left where the network's mark sat
// (here the Home Assistant logo), over a dark box: each team's letters on a slate cell, its score on a light cell, and the period over the
// clock on a dark blue column at the right.
import { el, ordinal, statusText, scoreSlot, haMark, marks, fit, FONTS } from '../kit.js';

// the box starts in from the left so the oval stands out past it; the letters' cell under twice the score's width; the rows close
// together
// the team letters' column centred under the oval: on air
// the oval's middle is 0.20 of the box's width in from its left and the team column's 0.19; here the oval's middle (121) stood 17 px
// left of the column's (138), so the box starts 17 px further left (27, was 44) and the bug is 523 wide (was 540)
const W = 523, H = 250, OVAL = 74, TEAM = 172, SCORE = 96, PX = 56, BOX_LEFT = 27;

export default {
  id: 'nhl-abc-99',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -16% vs the broadcast; 80 % of the correction
  typeScale: 1.153,
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-abc-99 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #eef1f4; }
.sb-nhl-abc-99 { font-weight: 700; font-stretch: 115%; }   /* face: Archivo 700 at 115% width (low confidence) */
.sb-nhl-abc-99 .ov { position: absolute; left: 6px; top: 0; width: 230px; height: ${OVAL}px; border-radius: 50%; display: grid; place-items: center; z-index: 1;
  background: radial-gradient(#b8482a, #96321a 58%, #c4502a 84%, #f08a50); box-shadow: 0 0 0 3px #2b2b2b, 0 0 10px rgba(240,110,50,.55), 0 3px 6px rgba(0,0,0,.5); }   /* a red-orange oval glowing brighter orange at its edge (frame) */
.sb-nhl-abc-99 .ov .sb-ha { color: #fff; }
.sb-nhl-abc-99 .bx { position: absolute; left: ${BOX_LEFT}px; right: 0; top: ${OVAL - 12}px; bottom: 0; display: grid; grid-template-columns: ${TEAM}px ${SCORE}px 1fr; grid-template-rows: 1fr 1fr; gap: 4px 6px; padding: 22px 8px 8px; box-sizing: border-box;
  background: #0e0f11; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-abc-99 .tm { display: grid; place-items: center start; padding-left: 16px; background: linear-gradient(#36403f, #283130); font-size: ${PX}px; line-height: 1; }
.sb-nhl-abc-99 .sc { display: grid; place-items: center; background: linear-gradient(#d8dbd9, #a9adab); color: #1a1d1c; font-size: ${PX}px; line-height: 1; }
.sb-nhl-abc-99 .rt { display: grid; place-items: center; background: linear-gradient(#4c505a, #3a3d45); font-size: ${PX}px; line-height: 1; } .sb-nhl-abc-99 .rt .sb-ord { font-size: .8em; }
.sb-nhl-abc-99 .rt.ck { background: #08090a; }   /* the period on slate grey, the clock on black (frame) */
.sb-nhl-abc-99 .rt.w { grid-row: 1 / 3; font-size: ${PX * 0.55}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      // names, scores and records squeezed to their cells (a long name such as UTAH, a 10-14-1 record, a three-figure score)
      const tm = fit(el('span', 'tm', (t.abbr || '').toUpperCase())); tm.style.gridRow = String(i + 1);
      const sc = fit(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g)); sc.style.gridRow = String(i + 1);
      bx.append(tm, sc);
    });
    if (live) {
      const p = el('span', 'rt'); p.style.cssText = 'grid-column:3;grid-row:1'; p.appendChild(ordinal(g.period));
      const c = el('span', 'rt ck', g.clock || ''); c.style.cssText = 'grid-column:3;grid-row:2';
      bx.append(p, c);
    } else { const w = el('span', 'rt w', statusText(g, time)); w.style.gridColumn = '3'; bx.appendChild(w); }
    const ov = el('div', 'ov'); if (marks(opts).ha) ov.appendChild(haMark(54));
    root.append(bx, ov);
  },
};
