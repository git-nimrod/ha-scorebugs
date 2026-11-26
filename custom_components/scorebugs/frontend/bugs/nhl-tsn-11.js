// "Black slants '11": after TSN's NHL score bar of the early 2010s. A chrome bar, light over the top and dark
// at the foot, across the whole width; in its middle a row of plates leaning forward, edged in white: the network's plate in black
// (here the Home Assistant logo), each team's logo and letters on a silver plate with its score on a black one, the period on silver
// and the clock on black. The chrome runs on empty past both ends of the row, as on air.
// measured (crop px of 382 x 24): plates 17 px tall (y 4-21), lean about 24 deg; network 32-82, team 82-138, score 138-165, team
// 165-222, score 222-250, period 250-295, clock 295-347; the chrome bar's light top and dark foot meet just under the middle.
// read
// across the row at y 12: dark plate | a metallic line about 3 px wide (lum 130-210, brightest at the top: 225 at y 5, 210 at y 12,
// 140 at y 19) | a 1 px black edge (lum 4-29) | the silver plate | 1 px black | metallic line | dark plate: so the silver plates
// carry a black outline along their leaning sides, top and foot, and every plate is parted from the next by a leaning metallic line
// (it was a 2 px white outline round every plate).
// (nothing else changed): every plate's text keeps 14 px
// clear of the plate's leaning ends (the lean takes about 7 px at the letters' foot: UTAH's H, FINAL/OT and 10-14-1 ran into the
// slanted ends), a start time or FINAL is held to its plate so it is squeezed rather than spilling, and a team's letters longer than
// three take their first three as the short form when squeezing alone is not enough (college PIKEV, AAMU).
import { el, logo, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 1180 / 382, H = Math.round(24 * K);
// DV: the metallic dividing line (3 crop px) between the plates and at both ends of the row
const P = { mk: 155, tm: 173, s: 84, pd: 139, ck: 160 }, DV = 9, END = 91;
const W = 2 * END + P.mk + 2 * (P.tm + P.s) + P.pd + P.ck + 8 * DV;
const TOP = Math.round(4 * K), PH = Math.round(17 * K);
const CAP = 10 * K, PX = Math.round(CAP / 0.7109);

export default {
  id: 'nhl-tsn-11',
  size: { w: W, h: H },
  // before the game the period's plate goes; after it the clock's: the chrome closes up behind them
  // (the start time's plate 50 px wider than the clock's, so it clears the leaning ends)
  sizeFor: (g) => (g.status === 'pre' ? { w: W - P.pd - DV + 50, h: H } : g.status === 'final' ? { w: W - P.ck - DV, h: H } : { w: W, h: H }),
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-tsn-11 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* the chrome bar (measured #f2f3f6 at the top, #8c8f99 just under the middle, a lighter band, then dark at the foot) */
.sb-nhl-tsn-11 .row { position: absolute; inset: 0; display: flex; padding: ${TOP}px ${END}px 0; box-sizing: border-box;
  background: linear-gradient(#f4f5f8, #d4d6dc 40%, #8c8f99 56%, #a9acb4 78%, #5f626b); box-shadow: inset 0 0 0 2px #3a3c42, 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-tsn-11 .p { flex: none; height: ${PH}px; transform: skewX(-24deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 3px rgba(0,0,0,.45); }
/* the metallic dividing lines, leaning with the plates: bright at the top, grey towards the foot */
.sb-nhl-tsn-11 .dv { flex: none; width: ${DV}px; height: ${PH}px; transform: skewX(-24deg); background: linear-gradient(90deg, rgba(0,0,0,.18), transparent 35% 65%, rgba(0,0,0,.18)), linear-gradient(#f6f7f9, #e1e3e7 25%, #c4c7cc 50%, #9a9da4 80%, #84878e); }
.sb-nhl-tsn-11 .p > span { transform: skewX(24deg); display: flex; align-items: center; gap: 10px; min-width: 0; max-width: 100%; white-space: nowrap; box-sizing: border-box; padding: 0 14px; }
/* the score plates are short: their figures keep only 5 px clear, as before (two figures filled them) */
.sb-nhl-tsn-11 .s > span { padding: 0 5px; }
.sb-nhl-tsn-11 .dk { background: linear-gradient(#45464c, #121317 48%, #000 52%, #0c0c10); }
.sb-nhl-tsn-11 .lt { background: linear-gradient(#ffffff, #e6e7ea 48%, #c2c4c9 52%, #dadbe0); color: #111; }
/* the silver plates' black outline (1 crop px), following the leaning shape */
.sb-nhl-tsn-11 .lt { box-shadow: inset 0 0 0 3px #0a0a0b, 0 2px 3px rgba(0,0,0,.45); }
.sb-nhl-tsn-11 .mk { width: ${P.mk}px; } .sb-nhl-tsn-11 .mk .sb-ha { color: #fff; }
.sb-nhl-tsn-11 .tm { width: ${P.tm}px; font-size: ${PX}px; } .sb-nhl-tsn-11 .tm .sb-logo { width: 54px; height: 44px; object-fit: contain; flex: none; }
.sb-nhl-tsn-11 .s { width: ${P.s}px; font-size: ${PX * 1.05}px; } .sb-nhl-tsn-11 .pd { width: ${P.pd}px; font-size: ${PX}px; font-weight: 500; } .sb-nhl-tsn-11 .ck { width: ${P.ck}px; font-size: ${PX * 1.05}px; }
/* the start time or FINAL (class st: the kit squeezes any .w box itself, which here undid the plate's counter-slant and let the
   start time run off its plate) */
.sb-nhl-tsn-11 .st { font-size: ${PX * 0.72}px; } .sb-nhl-tsn-11 .ck.st { width: ${P.ck + 50}px; }
/* a three-figure score a size smaller, inside its leaning plate */
.sb-nhl-tsn-11 .s .n3 { font-size: ${PX * 0.84}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    // a bare text goes one span deeper than the counter-slant, so the kit's squeeze of a long status never undoes it
    const plate = (cls, ...kids) => { const p = el('div', 'p ' + cls), s = el('span'); kids.forEach((k) => { if (!k) return; if (k.nodeType === 3) { const t = el('span'); t.style.display = 'inline-block'; t.style.maxWidth = '100%'; t.appendChild(k); s.appendChild(t); } else s.appendChild(k); }); p.appendChild(s); return p; };
    row.appendChild(plate('dk mk', marks(opts).ha ? haMark(Math.round(PH * 0.72)) : null));
    [g.away, g.home].forEach((t) => {
      const ab = (t.abbr || '').toUpperCase();
      row.appendChild(plate('lt tm', logo(t, 54), fit(el('span', '', ab), ab.length > 3 ? ab.slice(0, 3) : undefined)));
      const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : '';
      row.appendChild(plate('dk s', scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g)));
    });
    const per = g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase();
    if (g.status !== 'pre') row.appendChild(plate('lt pd' + (live ? '' : ' st'), document.createTextNode(live ? per : statusText(g, time))));
    if (g.status !== 'final') row.appendChild(plate('dk ck' + (live ? '' : ' st'), document.createTextNode(live ? g.clock || '' : statusText(g, time))));
    // a metallic line before, between and after the plates
    [...row.children].forEach((p) => row.insertBefore(el('i', 'dv'), p)); row.appendChild(el('i', 'dv'));
    root.appendChild(row);
  },
};
