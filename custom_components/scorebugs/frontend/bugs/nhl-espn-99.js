// "Oval tab '99": after ESPN's NHL bug (1999-2004; frame: Islanders at Lightning, playoffs). A red oval at the top left where the network's
// wordmark sat (here the Home Assistant logo), over a dark rounded box: each team's seed (in the playoffs) and letters, its score on a
// light cell, and a column at the right with the period over the clock.
import { el, ordinal, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 540, H = 250, OVAL = 78, TEAM = 230, SCORE = 96, PX = 56;

export default {
  id: 'nhl-espn-99',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-espn-99 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 88%; color: #f2f2f2; }
.sb-nhl-espn-99 { font-weight: 600; font-stretch: 100%; }   /* face: Archivo 600 (low confidence) */
.sb-nhl-espn-99 .ov { position: absolute; left: 10px; top: 0; width: 250px; height: ${OVAL}px; border-radius: 50%; display: grid; place-items: center; z-index: 1;
  background: radial-gradient(#ffffff, #e4e5e8 55%, #b9bbc0); box-shadow: 0 0 0 3px #4a4c50, 0 3px 6px rgba(0,0,0,.5); }   /* a white-silver oval with a dark edge (frame) */
.sb-nhl-espn-99 .ov .sb-ha { color: #c4131c; }
.sb-nhl-espn-99 .bx { position: absolute; left: 0; right: 0; top: ${OVAL - 14}px; bottom: 0; display: grid; grid-template-columns: ${TEAM}px ${SCORE}px 1fr; grid-template-rows: 1fr 1fr; gap: 6px; padding: 24px 10px 10px; box-sizing: border-box;
  border-radius: 16px; background: linear-gradient(#26282c, #121315); box-shadow: inset 0 0 0 3px #8a8c90, 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-espn-99 .tm { display: flex; align-items: center; padding-left: 12px; font-size: ${PX}px; line-height: 1; }
.sb-nhl-espn-99 .tm small { font-size: .62em; margin-right: 4px; }
.sb-nhl-espn-99 .sc { display: grid; place-items: center; background: linear-gradient(#ececec, #c3c4c7); color: #111; font-size: ${PX}px; line-height: 1; }
.sb-nhl-espn-99 .rt { display: grid; place-items: center; font-size: ${PX}px; line-height: 1; } .sb-nhl-espn-99 .rt .sb-ord { font-size: .8em; }
.sb-nhl-espn-99 .rt.w { grid-row: 1 / 3; font-size: ${PX * 0.55}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const tm = el('span', 'tm'); tm.style.gridRow = String(i + 1);
      if (t.seed) tm.appendChild(el('small', '', String(t.seed)));
      tm.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.append(tm, sc);
    });
    if (live) {
      const p = el('span', 'rt'); p.style.cssText = 'grid-column:3;grid-row:1'; p.appendChild(ordinal(g.period));
      const c = el('span', 'rt', g.clock || ''); c.style.cssText = 'grid-column:3;grid-row:2';
      bx.append(p, c);
    } else { const w = el('span', 'rt w', statusText(g, time)); w.style.gridColumn = '3'; bx.appendChild(w); }
    const ov = el('div', 'ov'); if (marks(opts).ha) ov.appendChild(haMark(54));
    root.append(bx, ov);
  },
};
