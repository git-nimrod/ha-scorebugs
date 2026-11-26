// "Gold period '14": after Leafs TV's score bar of the mid-2010s. A dark bar: the channel's mark at the left (here the
// Home Assistant logo, in the light blue the channel's letters wore), each team's letters in white on a grey metal panel, both scores
// in white on dark panels parted by a thin teal line (away score beside the away team, home score beside the home team), the clock in
// white on black, and the period in gold letters on a bronze-grey panel at the right end.
// measured (crop px of 345 x 19): mark 0-95, team 96-145, score 146-170, teal line 171, score 172-196, team 196-245, clock 246-305,
// period 305-345; capitals 0.58 of the height, wide and heavy.
import { el, statusText, haMark, marks, scoreSlot, fit, ordinal, FONTS } from '../kit.js';

const K = 1180 / 345, H = Math.round(19 * K);
const C = { mk: 325, tm: 168, s: 82, line: 4, ck: 202, pd: 137 };
const W = C.mk + 2 * (C.tm + C.s) + C.line + C.ck + C.pd;
const CAP = 11 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'nhl-leafstv-14',
  size: { w: W, h: H },
  // before and after the game the period's panel goes (FINAL stands on the period's bronze panel, as wide as the clock's, so
  // FINAL/OT fits with room round it)
  sizeFor: (g) => (g.status !== 'live' ? { w: W - C.pd, h: H } : { w: W, h: H }),
  fonts: [FONTS.montserrat],
  css: `
.sb-nhl-leafstv-14 { font-family: 'SB Montserrat', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-nhl-leafstv-14 .row { position: absolute; inset: 0; display: flex; align-items: stretch; background: linear-gradient(#232d3c, #141b26); box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-leafstv-14 .row > * { flex: none; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; }
.sb-nhl-leafstv-14 .mk { width: ${C.mk}px; } .sb-nhl-leafstv-14 .mk .sb-ha { color: #3d8fd8; }
/* the team panels: grey metal, lighter over the top */
.sb-nhl-leafstv-14 .tm { width: ${C.tm}px; background: linear-gradient(#a3a3a9, #807f86 45%, #5d5c63 55%, #6e6d74); text-shadow: 0 2px 2px rgba(0,0,0,.45); }
.sb-nhl-leafstv-14 .s { width: ${C.s}px; background: linear-gradient(#2c2b30, #18171b); }
/* a record keeps a little room each side, clear of the teal line */
.sb-nhl-leafstv-14 .s > span { max-width: 86%; } .sb-nhl-leafstv-14 .s > .n3 { font-size: ${PX * 0.8}px; }
/* a three-figure score squeezes into its panel, clear of the teal line (139 and 148 touched) */
.sb-nhl-leafstv-14 .s > .n3 { min-width: 0 !important; }
.sb-nhl-leafstv-14 .line { width: ${C.line}px; background: #2fa39a; margin: 3px 0; }
.sb-nhl-leafstv-14 .ck { width: ${C.ck}px; background: linear-gradient(#1b1a1f, #0a0a0c); }
.sb-nhl-leafstv-14 .pd { width: ${C.pd}px; background: linear-gradient(#8c8077, #6b625b 50%, #5a534e); color: #e2b04a; font-size: ${PX * 0.88}px; }
.sb-nhl-leafstv-14 .pd .sb-ord { font-size: .7em; vertical-align: .32em; }
.sb-nhl-leafstv-14 .w { font-size: ${PX * 0.6}px; padding: 0 ${Math.round(C.ck * 0.07)}px; box-sizing: border-box; } .sb-nhl-leafstv-14 .pd.w { width: ${C.ck}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.7))); row.appendChild(mk);
    const score = (t) => { const s = el('div', 's'); const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''; const n = scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g); s.appendChild(v.length > 2 ? fit(n) : n); return s; };
    row.append(fit(el('div', 'tm', (g.away.abbr || '').toUpperCase())), score(g.away), el('i', 'line'), score(g.home), fit(el('div', 'tm', (g.home.abbr || '').toUpperCase())));
    if (g.status !== 'final') row.appendChild(live ? el('div', 'ck', g.clock || '') : fit(el('div', 'ck w', statusText(g, time))));
    if (live) { const pd = el('div', 'pd'); pd.appendChild(g.period.word ? document.createTextNode(g.period.label) : ordinal(g.period)); row.appendChild(pd); }
    else if (g.status === 'final') row.appendChild(fit(el('div', 'pd w', statusText(g, time))));
    root.appendChild(row);
  },
};
