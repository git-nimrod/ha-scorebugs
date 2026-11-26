// "Grey plate '95": after ESPN's NHL bug (1995; frame: Flyers at Devils). A plain see-through grey plate with two lines of shadowed white
// type: each team's letters and score, with the period on the first line and the clock on the second.
import { el, ordinal, statusText, scoreSlot, FONTS , fit } from '../kit.js';

const W = 520, H = 150, PX = 54;

export default {
  id: 'nhl-espn-95',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: its column goes and the plate closes up on the time
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 110, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -11% vs the broadcast; 80 % of the correction
  typeScale: 1.101,
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-espn-95 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 95%; color: #f2f2f2; text-shadow: 2px 2px 0 rgba(0,0,0,.65); }
.sb-nhl-espn-95 { font-weight: 700; font-stretch: 100%; }   /* face: Archivo 700 (low confidence) */
.sb-nhl-espn-95 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 150px) 100px 1fr; grid-template-rows: 1fr 1fr; align-items: center; padding: 6px 22px; box-sizing: border-box;
  background: linear-gradient(rgba(128,125,133,.9), rgba(116,113,121,.9));   /* a flat grey with a faint violet cast (frame) */ box-shadow: 0 2px 6px rgba(0,0,0,.4); font-size: ${PX}px; line-height: 1; }
.sb-nhl-espn-95 .sc { text-align: center; } .sb-nhl-espn-95 .rt { text-align: right; } .sb-nhl-espn-95 .rt .sb-ord { text-transform: lowercase; font-size: .85em; }
.sb-nhl-espn-95 .w { grid-row: 1 / 3; font-size: ${PX * 0.6}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (g.status === 'pre') bx.style.gridTemplateColumns = '150px 0 1fr';   // the empty score column closes
    [g.away, g.home].forEach((t, i) => {
      // the score's column a little further right, as on air (centred at about 0.43 of the plate); four letters (UTAH) squeeze into their 150 px column instead of running into the score
      const ab = fit(el('span', '', (t.abbr || '').toUpperCase())); ab.style.gridRow = String(i + 1);
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.appendChild(ab); if (g.status !== 'pre') bx.appendChild(sc);
    });
    if (live) {
      const p = el('span', 'rt'); p.style.gridRow = '1'; p.appendChild(ordinal(g.period));
      const c = el('span', 'rt', g.clock || ''); c.style.gridRow = '2';
      bx.append(p, c);
    } else { const w = el('span', 'rt w', statusText(g, time)); w.style.gridColumn = '3'; bx.appendChild(w); }
    root.appendChild(bx);
  },
};
