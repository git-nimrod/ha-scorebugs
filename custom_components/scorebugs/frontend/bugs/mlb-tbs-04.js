// "Red pill '04": after TBS's Braves bug (2004-07; frame: Marlins at Braves; 2007 had the same shape in blue). A deep red rounded bar: the
// channel's mark at the left (here the Home Assistant logo), the bases as small orange diamonds, each team's letters and score in italics on
// a silver slanted plate, and the inning and the outs in white underneath.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, ordinal, FONTS } from '../kit.js';

const W = 760, H = 180, TOP = 96, PX = 46, SCORE_ROOM = 70;

export default {
  id: 'mlb-tbs-04',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch each silver plate loses its score's room and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - 2 * SCORE_ROOM, h: H } : { w: W, h: H }),   // records keep the room
  // measured against the frame by the automatic audit: text -30% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-mlb-tbs-04 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-style: italic; color: #fff; }
.sb-mlb-tbs-04 { font-weight: 800; font-stretch: 110%; font-style: italic; }   /* face: Archivo 800 at 110% width italic (low confidence) */
/* the red's top runs to the end of the first team's plate and curves down, its foot reaching a quarter into the second team's */
.sb-mlb-tbs-04 .bar { position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 60px 0 0 60px;
  /* the right edge: the top ends mid-way along the first plate and runs down behind the plates; under the second plate it drops from the
 plate's foot below its letters and curves back in to a flat bottom under the outs */
  clip-path: path('M 0 0 L 360 0 C 430 0, 480 60, 588 88 C 582 125, 578 162, 540 171 C 522 175, 512 180, 492 180 L 0 180 Z'); background: linear-gradient(#a8161d, #841015 55%, #650b0f);   /* a deep crimson, darker than a bright red */ box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-tbs-04 .mk { position: absolute; left: 24px; top: 16px; } .sb-mlb-tbs-04 .mk .sb-ha { color: #fff; }
.sb-mlb-tbs-04 .bs { position: absolute; left: 120px; top: 16px; } .sb-mlb-tbs-04 .bs .sb-bases i { background: rgba(240,150,60,.45); } .sb-mlb-tbs-04 .bs .sb-bases i.on { background: #f29a3c; }
.sb-mlb-tbs-04 .pls { position: absolute; left: 240px; right: 10px; top: 14px; height: ${TOP - 18}px; display: flex; gap: 4px; }   /* the two plates nearly meet, split by a slash on air */
.sb-mlb-tbs-04 .pl { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 26px; transform: skewX(-18deg); border-radius: 10px;
  background: linear-gradient(#ffffff, #cfd2d8 55%, #9da2aa); color: #2a2c33; font-size: ${PX}px; line-height: 1; box-shadow: 0 2px 4px rgba(0,0,0,.4); }
.sb-mlb-tbs-04 .pl > * { transform: skewX(18deg); }
.sb-mlb-tbs-04 .pl .rec { font-size: ${PX * 0.62}px; white-space: nowrap; }
.sb-mlb-tbs-04 .lo { position: absolute; left: 130px; right: 270px; top: ${TOP + 17}px; display: flex; justify-content: space-between; font-size: ${PX * 1.06}px; line-height: 1.3; }   /* the inning and outs line is a quarter bigger and sits lower on the frame (centre 0.76 of the bar against 0.71) */
.sb-mlb-tbs-04 .lo .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-mlb-tbs-04 .bs.dt { top: 8px; width: 96px; height: 72px; display: grid; place-items: center; text-align: center; font-size: 20px; line-height: 1.05; white-space: pre-line; color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 7);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false] };
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(70));
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const bs = el('div', 'bs'); if (!os) bs.appendChild(bases(live ? b.bases : [false, false, false], 26)); else if (os.detail) { bs.classList.add('dt'); bs.textContent = os.detail; }
    const pls = el('div', 'pls');
    [g.away, g.home].forEach((t) => {
      const pl = el('span', 'pl');
      pl.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') pl.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (g.away.record && g.home.record) { const r = el('span', 'rec', t.record); if (t.record.length > 4) r.style.fontSize = (0.62 * 4.4 / t.record.length).toFixed(3) + 'em'; pl.appendChild(r); }  // a long record set smaller // records before the game, every time
      pls.appendChild(pl);
    });
    const lo = el('div', 'lo');
    if (live) { const p = el('span', ''); p.appendChild(ordinal(g.period)); lo.append(p, el('span', '', b.outs + ' OUT')); }
    else if (os) lo.append(el('span', '', os.period), el('span', '', os.clock));
    else lo.appendChild(el('span', '', statusText(g, time)));
    root.append(el('div', 'bar'), mk, bs, pls, lo);
  },
};
