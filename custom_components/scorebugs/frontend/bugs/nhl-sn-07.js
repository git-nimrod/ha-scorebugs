// "Navy slants '07": after Rogers Sportsnet's NHL score bar of the late 2000s. One glossy navy bar,
// the same navy for both teams: each team's letters in white, its score in black on a white box whose right side leans forward, then
// the period, a thin light seam, the clock, and at the right end a light plate leaning like the score boxes where the network's
// wordmark stood (here the Home Assistant logo), closed by a short grey end.
// measured (crop px of 369 x 26): letters 5-60, score 60-90, letters 92-142, score 143-172, period 173-215, seam 216, clock 218-270,
// network plate 272-357, end 357-369; the navy (#1c2454 across the middle) lighter over the top half; capitals 0.5 of the height.
import { el, statusText, haMark, marks, scoreSlot, fit, ordinal, FONTS } from '../kit.js';

const K = 1180 / 369, H = Math.round(26 * K);
const C = { cap: 16, tm: 168, s: 96, pd: 135, seam: 6, ck: 166, mk: 272, end: 36 };
const W = C.cap + 2 * (C.tm + C.s) + C.pd + C.seam + C.ck + C.mk + C.end;
const CAP = 13 * K, PX = Math.round(CAP / 0.7109);

export default {
  id: 'nhl-sn-07',
  size: { w: W, h: H },
  // before and after the game the period and the seam go (the bar closes up); the start time or FINAL takes the clock's room
  sizeFor: (g) => (g.status !== 'live' ? { w: W - C.pd - C.seam, h: H } : { w: W, h: H }),
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-sn-07 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; font-stretch: 84%; color: #fff; }
.sb-nhl-sn-07 .row { position: absolute; inset: 0; display: flex; align-items: stretch; overflow: hidden;
  background: linear-gradient(#45558f, #26326c 44%, #18214f 56%, #1c2658); box-shadow: inset 0 2px 0 rgba(255,255,255,.25), inset 0 -2px 0 rgba(0,0,0,.4), 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-sn-07 .row > * { flex: none; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; }
.sb-nhl-sn-07 .cap { width: ${C.cap}px; background: linear-gradient(#e8ebf2, #a9b0c4); clip-path: polygon(0 0, 100% 0, 40% 100%, 0 100%); }
.sb-nhl-sn-07 .tm { width: ${C.tm}px; }
/* the score boxes: white, black figures, the right side leaning forward */
.sb-nhl-sn-07 .s { width: ${C.s}px; color: #111; margin: 4px 0; background: linear-gradient(#ffffff, #f2f1f6 50%, #d9d8e0); clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%); }
.sb-nhl-sn-07 .pd { width: ${C.pd}px; } .sb-nhl-sn-07 .pd .sb-ord { font-size: .7em; }
.sb-nhl-sn-07 .seam { width: ${C.seam}px; background: linear-gradient(#c7cde0, #6f7aa3); margin: 6px 0; }
.sb-nhl-sn-07 .ck { width: ${C.ck}px; }
.sb-nhl-sn-07 .mk { width: ${C.mk}px; margin: 3px 0; background: linear-gradient(#f4f6fc, #d1d5ec 55%, #b9bfdc); clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%); }
.sb-nhl-sn-07 .mk .sb-ha { color: #1d2860; margin-right: 30px; }
.sb-nhl-sn-07 .end { width: ${C.end}px; background: linear-gradient(#9a9ba2, #4a4b52); clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%); }
.sb-nhl-sn-07 .w { font-size: ${PX * 0.66}px; padding: 0 ${C.cap}px 0 ${C.cap / 2}px; box-sizing: border-box; }
/* a record or a three-figure score keeps clear of the box's leaning side */
.sb-nhl-sn-07 .s > span { max-width: 80%; margin-right: 8%; } .sb-nhl-sn-07 .s > .n3 { font-size: ${PX * 0.84}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    row.appendChild(el('i', 'cap'));
    [g.away, g.home].forEach((t) => {
      row.appendChild(fit(el('div', 'tm', (t.abbr || '').toUpperCase())));
      const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : '';
      const s = el('div', 's'); s.appendChild(scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g)); row.appendChild(s);
    });
    if (live) { const pd = el('div', 'pd'); pd.appendChild(g.period.word ? document.createTextNode(g.period.label) : ordinal(g.period)); row.append(pd, el('i', 'seam'), el('div', 'ck', g.clock || '')); }
    else row.appendChild(fit(el('div', 'ck w', statusText(g, time))));
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.6))); row.append(mk, el('i', 'end'));
    root.appendChild(row);
  },
};
