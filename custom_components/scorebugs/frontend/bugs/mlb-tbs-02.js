// "Navy diamond '02": after TBS's Braves bug (2002; frame: Mets at Braves). A light grey panel: a big navy diamond at the left with the bases
// on it and the inning under it, each team's letters in white on a navy slanted plate with its score in a white box, and a navy strip along
// the bottom with the channel's letters (here the Home Assistant logo) and the outs.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, ordinal, FONTS } from '../kit.js';

const W = 600, H = 300, LOW = 70, DIA = 130, PX = 56;

export default {
  id: 'mlb-tbs-02',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-tbs-02 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #fff; }
.sb-mlb-tbs-02 { font-weight: 800; font-stretch: 100%; }   /* face: Archivo 800 (low confidence) */
.sb-mlb-tbs-02 .pn { position: absolute; left: 0; right: 0; top: 0; bottom: ${LOW}px; background: linear-gradient(#d6d9e0, #c2c6d0); box-shadow: 0 3px 8px rgba(0,0,0,.45); }   /* a cooler, mid-light grey (frame, levels corrected) */
/* on air the navy shape is a home plate on its head: a point at the top, widest under the middle, a flat foot; flat colour. The old
 turned square ran off the bug's top */
.sb-mlb-tbs-02 .dia { position: absolute; left: 30px; top: 16px; width: 196px; height: 146px; clip-path: polygon(50% 0, 100% 62%, 75% 100%, 25% 100%, 0 62%); background: #302d68; }   /* a muted violet-navy (frame) */
.sb-mlb-tbs-02 .bs { position: absolute; left: 30px; top: 30px; width: 196px; height: 132px; display: grid; place-items: center; }
.sb-mlb-tbs-02 .bs .sb-bases i { background: rgba(255,255,255,.18); } .sb-mlb-tbs-02 .bs .sb-bases i.on { background: #f2f2f2; }
.sb-mlb-tbs-02 .inn { position: absolute; left: 30px; width: 196px; text-align: center; top: 172px; color: #22226a; font-size: ${PX * 0.6}px; line-height: 1; }
.sb-mlb-tbs-02 .pl { position: absolute; left: 260px; right: 0; height: 92px; display: grid; grid-template-columns: 1fr 90px; align-items: center; }
.sb-mlb-tbs-02 .pl .nm { height: 100%; display: grid; place-items: center; padding-left: 20px; clip-path: polygon(14% 0, 100% 0, 100% 100%, 0 100%); background: linear-gradient(#4b4ba6 0, #2c2c80 14%, #24246c); font-size: ${PX}px; line-height: 1; text-shadow: 2px 2px 0 rgba(0,0,30,.55); }   /* a lit top edge and a hard shadow on the letters, as on air (review, Nov 22) */
.sb-mlb-tbs-02 .pl .sc { height: 70%; display: grid; place-items: center; margin: 0 8px; background: #fff; color: #1f1f6a; font-size: ${PX * 0.85}px; line-height: 1; }
.sb-mlb-tbs-02 .lo { position: absolute; left: 0; right: 0; bottom: 0; height: ${LOW}px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px 0 70px; background: linear-gradient(#28234e, #13112a); font-size: ${PX * 0.6}px; }   /* darker than the plates, nearly black-violet (frame) */
.sb-mlb-tbs-02 .lo .sb-ha { color: #e7d33c; }
.sb-mlb-tbs-02 .bs .dt { font-size: 34px; line-height: 1.05; text-align: center; white-space: pre-line; padding-top: 18px; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false] };
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const bs = el('div', 'bs');
    if (os) { if (os.detail) bs.appendChild(el('span', 'dt', os.detail)); }
    else bs.appendChild(bases(live ? b.bases : [false, false, false], 40));  // filling the plate's upper part, as on air
    const inn = el('div', 'inn'); if (live) inn.appendChild(ordinal(g.period)); else if (os) inn.textContent = os.period;
    root.append(el('div', 'pn'), el('div', 'dia'), bs, inn);
    [g.away, g.home].forEach((t, i) => {
      const pl = el('div', 'pl'); pl.style.top = (12 + i * 100) + 'px';
      pl.append(el('span', 'nm', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      root.appendChild(pl);
    });
    const lo = el('div', 'lo'); if (marks(opts).ha) lo.appendChild(haMark(50)); else lo.appendChild(el('span', ''));
    lo.appendChild(el('span', '', live ? b.outs + ' Out' : os ? os.clock : statusText(g, time)));
    root.appendChild(lo);
  },
};
