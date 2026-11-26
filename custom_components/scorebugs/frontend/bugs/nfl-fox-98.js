// "Grey plate '98": after Fox's NFL bug (1998-99; frame: 49ers at Falcons). A grey tab on top with the quarter, a dot and the clock; under it
// a light plate where the network's letters sat (here the Home Assistant logo) joined to a black plate with each team's letters and score,
// with a rounded grey end; and the down and distance in outlined white type below.
import { el, ordinal, statusText, scoreSlot, haMark, marks, FONTS, fit } from '../kit.js';

// the light plate a little wider than the black one
const W = 560, H = 300, TAB = 62, BOX = 150, MARK = 240, PX = 54, SC_ROOM = 80;

export default {
  id: 'nfl-fox-98',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score column goes and the plate closes up on the letters; the
  // empty room under the plate where the down and distance stands is left out whenever there is no down to show
  // the down tab's room only for a football game while it runs
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - SC_ROOM : W, h: g.status === 'live' && g.football ? H : TAB + BOX + 8 }),
  // measured against the frame by the automatic audit: text -14% vs the broadcast; 80 % of the correction
  typeScale: 1.135,
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-fox-98 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #f2f2f2; }
.sb-nfl-fox-98 { font-weight: 800; font-stretch: 100%; }   /* face: Archivo 800 (low confidence) */
.sb-nfl-fox-98 .tab > span:last-child:not(.w) { justify-self: end; }
.sb-nfl-fox-98 .tab { position: absolute; left: 90px; right: 90px; top: 0; height: ${TAB}px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; column-gap: 24px; padding: 0 30px; box-sizing: border-box;
  border-radius: 8px 8px 0 0; background: linear-gradient(#b8babd, #7d8084); color: #18191b; font-size: ${PX * 0.8}px; line-height: 1; }
.sb-nfl-fox-98 .tab b { color: #d42a1e; font-size: .5em; text-shadow: 0 0 0 #000, 0 0 2px rgba(0,0,0,.9); }   /* a dark edge so the red dot reads on the silver (team sweep) */ .sb-nfl-fox-98 .tab .w { grid-column: 1 / 4; text-align: center; font-size: ${PX * 0.55}px; }
.sb-nfl-fox-98 .bx { position: absolute; left: 0; right: 0; top: ${TAB}px; height: ${BOX}px; display: grid; grid-template-columns: ${MARK}px 1fr 34px; }
.sb-nfl-fox-98 .mk { display: grid; place-items: center; border-radius: 10px 0 0 10px; background: linear-gradient(#e2e3e4, #a9abae); } .sb-nfl-fox-98 .mk .sb-ha { color: #121212; }
.sb-nfl-fox-98 .tm { display: grid; grid-template-rows: 1fr 1fr; padding: 8px 18px; background: #070707; }
.sb-nfl-fox-98 .ln { display: flex; align-items: center; justify-content: space-between; font-size: ${PX}px; line-height: 1; }
.sb-nfl-fox-98 .end { border-radius: 0 30px 30px 0; background: linear-gradient(90deg, #8d9094, #c9cbce 60%, #8d9094); margin: 14px 0; }
.sb-nfl-fox-98 .dn { position: absolute; left: ${MARK}px; right: 34px; top: ${TAB + BOX + 8}px; text-align: center; white-space: nowrap; font-size: ${PX * 0.9}px; line-height: 1.2; color: #fff;
  -webkit-text-stroke: 2px #111; paint-order: stroke fill; text-shadow: 0 2px 4px rgba(0,0,0,.6); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const tab = el('div', 'tab');
    if (live) { const p = el('span', ''); p.appendChild(ordinal(g.period)); tab.append(p, el('b', '', '●'), el('span', '', g.clock || '')); }
    else tab.appendChild(el('span', 'w', statusText(g, time)));
    const bx = el('div', 'bx'), mk = el('span', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(96));
    const tm = el('span', 'tm');
    [g.away, g.home].forEach((t) => {
      const ln = el('span', 'ln');
      ln.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      tm.appendChild(ln);
    });
    bx.append(mk, tm, el('span', 'end'));
    root.append(tab, bx);
    // one line, squeezed to the box (4TH & GOAL broke onto a second line under the foot)
    if (live && g.football) root.appendChild(fit(el('div', 'dn', g.football && g.football.short ? g.football.short : '')));
  },
};
