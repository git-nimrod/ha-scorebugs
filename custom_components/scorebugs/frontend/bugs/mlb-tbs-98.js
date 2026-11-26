// "Superstation '98": after TBS's Braves bug (1998-99; frame: Cardinals at Braves). A dark see-through box: the channel's wordmark along the
// top (here the Home Assistant logo), the bases at the left with the inning under them, each team's letters and score with a rule between
// them, and the count and the outs along the bottom.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, ordinal, FONTS } from '../kit.js';

const W = 520, H = 320, TOP = 64, LOW = 70, LEFT = 170, PX = 58, SCORE_ROOM = 90;

export default {
  id: 'mlb-tbs-98',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the scores' room goes and the box is narrower
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - SCORE_ROOM, h: H } : { w: W, h: H }),   // records before the game keep the room
  // measured against the frame by the automatic audit: text -20% vs the broadcast; 80 % of the correction
  typeScale: 1.195,
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-tbs-98 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #ececec; text-shadow: 2px 2px 0 rgba(0,0,0,.6); }
.sb-mlb-tbs-98 { font-weight: 800; font-stretch: 84%; text-shadow: 3px 3px 0 rgba(0,0,0,.85); }   /* tall, heavy, a little narrow, with a hard black shadow down-right, as on air */
.sb-mlb-tbs-98 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LEFT}px 1fr; grid-template-rows: ${TOP}px 1fr 1fr ${LOW}px; padding: 6px 22px 6px 14px; box-sizing: border-box;
  background: linear-gradient(rgba(44,46,58,.92), rgba(12,13,20,.92) 50%, rgba(22,24,32,.92)); box-shadow: 0 2px 6px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.3); }   /* near-black with a blue cast, as measured on the frame behind the letters */
.sb-mlb-tbs-98 .hd { grid-column: 1 / 3; display: grid; place-items: center; } .sb-mlb-tbs-98 .hd .sb-ha { color: #e6e6e6; }
.sb-mlb-tbs-98 .bs { grid-row: 2 / 4; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: ${PX * 0.75}px; line-height: 1; }
.sb-mlb-tbs-98 .bs .sb-bases i { background: linear-gradient(#6c6b84, #5a5970); } .sb-mlb-tbs-98 .bs .sb-bases i.on { background: #e8e8e8; }
.sb-mlb-tbs-98 .bs .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-mlb-tbs-98 .ln { display: flex; align-items: center; justify-content: space-between; padding-left: 20px; font-size: ${PX}px; line-height: 1; }
.sb-mlb-tbs-98 .ln.r1 { border-bottom: 3px solid rgba(220,220,220,.8); }
.sb-mlb-tbs-98 .lo { grid-column: 1 / 3; display: flex; align-items: center; gap: 60px; padding-left: 10px; font-size: ${PX * 0.85}px; line-height: 1; }
.sb-mlb-tbs-98 .ln .rec { font-size: ${PX * 0.6}px; white-space: nowrap; }
.sb-mlb-tbs-98 .lo .w { flex: 1; text-align: center; font-size: ${PX * 0.6}px; }
.sb-mlb-tbs-98 .bs .dt { font-size: 34px; line-height: 1.05; text-align: center; white-space: pre-line; margin-bottom: 10px; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx'), hd = el('div', 'hd'); if (marks(opts).ha) hd.appendChild(haMark(56));
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const bs = el('div', 'bs');
    if (os) { if (os.detail) bs.appendChild(el('span', 'dt', os.detail)); bs.appendChild(el('span', '', os.period)); }
    else bs.appendChild(bases(live ? b.bases : [false, false, false], 46));
    if (live) { const p = el('span', ''); p.appendChild(ordinal(g.period)); bs.appendChild(p); }
    bx.append(hd, bs);
    [g.away, g.home].forEach((t, i) => {
      const ln = el('div', 'ln' + (i ? '' : ' r1')); ln.style.gridColumn = '2';
      ln.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (g.away.record && g.home.record) { const r = el('span', 'rec', t.record); if (t.record.length > 4) r.style.fontSize = (0.6 * 4.4 / t.record.length).toFixed(3) + 'em'; ln.appendChild(r); }  // a long record set smaller, never past the edge // records before the game, every time
      bx.appendChild(ln);
    });
    const lo = el('div', 'lo');
    if (live) lo.append(el('span', '', b.balls + '-' + b.strikes), el('span', '', b.outs + ' Out'));
    else if (os) lo.appendChild(el('span', '', os.clock));
    else lo.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(lo);
    root.appendChild(bx);
  },
};
