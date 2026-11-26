// "Gold diamond '00": after TBS's Braves bug (2000-01; frame: Expos at Braves). A dark tile turned on its point with a gold edge holding the
// inning, the channel's letters under it (here the Home Assistant logo), each team's letters and score on a dark slanted plate, and the
// count and the outs underneath. The bases are not shown on this one.
// Review: the count and outs on a third, dark slanted plate as on air; records before the game on the black score ends.
import { el, otherSport, statusText, scoreSlot, haMark, marks, ordinal, FONTS } from '../kit.js';

const W = 530, H = 236, TILE = 160, PX = 56, SCORE_W = 96;   // H: the count plate ends at 228 (no empty band under it)

export default {
  id: 'mlb-tbs-00',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the plates lose the black score end and the bug is narrower
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - SCORE_W, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-tbs-00 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #f0f0f0; }
.sb-mlb-tbs-00 { font-weight: 700; font-stretch: 80%; }   /* face: Archivo 700 at 80% width (low confidence) */
/* the tile is a diamond wider than it is tall on air (a squashed square on its point), dark slate inside a gold edge; it used to run off
 the bug's top and left */
/* the diamond sits on top of the plates' left ends, shifted right over them */
.sb-mlb-tbs-00 .tile { position: absolute; z-index: 2; left: 72px; top: 8px; width: ${TILE}px; height: ${TILE}px; transform: scaleY(.72) rotate(45deg); background: linear-gradient(135deg, #2b3947, #0f1820); border: 6px solid #d9b938; box-sizing: border-box; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-tbs-00 .inn { position: absolute; z-index: 3; left: 72px; top: 8px; width: ${TILE}px; height: ${TILE}px; display: grid; place-items: center; font-size: ${PX * 0.75}px; line-height: 1; }
.sb-mlb-tbs-00 .inn .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-mlb-tbs-00 .mk { position: absolute; z-index: 3; left: 50px; top: 178px; }
/* the batting team: a yellow wedge in the top-right corner of its plate */
.sb-mlb-tbs-00 .bat { position: absolute; right: 2px; top: 0; width: 0; height: 0; border-top: 26px solid #f2d33a; border-left: 26px solid transparent; filter: drop-shadow(0 1px 1px rgba(0,0,0,.6)); } .sb-mlb-tbs-00 .mk .sb-ha { color: #e2d240; }
.sb-mlb-tbs-00 .pl { position: absolute; left: 215px; right: 10px; height: 70px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px 0 44px; transform: skewX(-14deg);
  /* a grey metal plate (light top, darker foot) with the score on a black end */
  background: linear-gradient(90deg, transparent calc(100% - ${SCORE_W}px), #0b0b0d calc(100% - ${SCORE_W}px)), linear-gradient(#a3a6ad, #6a6d75 46%, #3c3e44); box-shadow: 0 2px 6px rgba(0,0,0,.5); font-size: ${PX}px; line-height: 1; text-shadow: 1px 2px 0 rgba(0,0,0,.45); }
.sb-mlb-tbs-00 .pl.pre { background: linear-gradient(#a3a6ad, #6a6d75 46%, #3c3e44); }
.sb-mlb-tbs-00 .pl > * { transform: skewX(14deg); }
.sb-mlb-tbs-00 .lo { position: absolute; left: 225px; right: 26px; top: 170px; height: 58px; display: flex; align-items: center; gap: 40px; padding: 0 30px; font-size: ${PX * 0.75}px; line-height: 1; text-shadow: 2px 2px 0 rgba(0,0,0,.6);
  transform: skewX(-14deg); background: linear-gradient(#2a2c31, #0c0d10); box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-mlb-tbs-00 .lo > * { transform: skewX(14deg); }
.sb-mlb-tbs-00 .pl .rec { font-size: ${PX * 0.5}px; width: ${SCORE_W - 30}px; text-align: center; white-space: nowrap; }
.sb-mlb-tbs-00 .inn .os { display: grid; justify-items: center; gap: 6px; } .sb-mlb-tbs-00 .inn .os small { font-size: 22px; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, half: null };
    const inn = el('div', 'inn'); if (live) inn.appendChild(ordinal(g.period));
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    // (the detail under the period, inside the tile)
    if (os) { inn.textContent = ''; const p = el('span', 'os'); p.append(el('span', '', os.period)); if (os.detail) p.appendChild(el('small', '', os.detail)); inn.appendChild(p); }
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(56));
    root.append(el('div', 'tile'), inn, mk);
    [g.away, g.home].forEach((t, i) => {
      const recs = g.status === 'pre' && g.away.record && g.home.record;  // records before the game, every time
      const pl = el('div', g.status === 'pre' && !recs ? 'pl pre' : 'pl'); pl.style.top = (10 + i * 80) + 'px';
      pl.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') pl.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (recs) pl.appendChild(el('span', 'rec', t.record));
      const batting = live && b.half ? (b.half === 'top' ? g.away : g.home) : null;
      if (t === batting) pl.appendChild(el('i', 'bat'));
      root.appendChild(pl);
    });
    const lo = el('div', 'lo');
    if (live) lo.append(el('span', '', b.balls + '-' + b.strikes), el('span', '', b.outs + ' Out'));
    else if (os) lo.appendChild(el('span', '', os.clock));
    else lo.appendChild(el('span', '', statusText(g, time)));
    root.appendChild(lo);
  },
};
