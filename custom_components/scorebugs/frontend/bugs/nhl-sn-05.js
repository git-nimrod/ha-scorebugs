// "Gold scores '05": after Rogers Sportsnet's NHL score strip of the mid-2000s. A dark see-through strip: each team's letters in light grey italics, each score in dark figures on a rounded gold box,
// the period and the clock in the same light italics, and at the right a white plate leaning forward where the network's wordmark
// stood (here the Home Assistant logo). Soft picture by default.
// measured (crop px of 247 x 26, the strip y 3-17): letters 25-42, gold 46-60, letters 63-80, gold 85-98, period 100-115, clock
// 118-140, network plate 188-237; capitals about 0.55 of the strip's height, slanted about 12 deg.
// read on the crop:
// the strip is grey cells (lum 45-70) parted by black lines (lum under 25) about 1.5 px wide at x 23, 45, 62, 84, 100, 118, 144,
// 166 and 187, leaning with the letters; each team's letters, the period and the clock sit on their own grey cell, the gold boxes in
// theirs, and two empty grey cells run on to the network's plate.
// (remove the right 2 blank spots unless you keep them for
// other sports"): the gold boxes lean 12 deg like the black lines (their figures kept at the letters' own italic); the two empty
// cells are gone (no sport this bug draws fills them: hockey, and football and basketball without downs), so the strip ends at the
// clock's line (x 143.5) and the plate follows it, 43.5 crop px shorter. Before and after the game the status line ends at that
// same line.
// each gold box fills its cell, from the
// strip's top to its foot and from one black line to the next (it was 1.5 crop px in from the top and foot and 1 px off the lines,
// with round corners; now square, under the lines), and the whole bug has a black outline 4 px wide round its four sides.
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 1180 / 247, H = Math.round(14 * K), END = 143.5;
const X = (v) => Math.round(v * K);
const CAP = 7.5 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'nhl-sn-05',
  size: { w: X(247 - 43.5), h: H },
  tv: 'soft',
  fonts: [FONTS.barlowSemi700i],
  css: `
.sb-nhl-sn-05 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-style: italic; font-weight: 700; color: #c9cbce; }
/* the strip: grey cells, see-through (the arena shows through on air), parted by black lines leaning with the letters */
.sb-nhl-sn-05 .bar { position: absolute; inset: 0; background: linear-gradient(rgba(96,100,106,.9), rgba(66,69,74,.92) 50%, rgba(46,48,52,.92)); box-shadow: 0 2px 4px rgba(0,0,0,.45); }
/* the black outline round the whole bug, over everything at its edges */
.sb-nhl-sn-05 .ol { position: absolute; inset: 0; z-index: 3; box-shadow: inset 0 0 0 4px #060708; pointer-events: none; }
.sb-nhl-sn-05 .dv { position: absolute; top: 0; height: ${H}px; width: ${X(1.6)}px; background: #060708; transform: skewX(-12deg); z-index: 2; }
.sb-nhl-sn-05 .c { position: absolute; top: 0; height: ${H}px; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nhl-sn-05 .a { left: ${X(22)}px; width: ${X(22)}px; } .sb-nhl-sn-05 .h { left: ${X(61)}px; width: ${X(22)}px; }
/* the leaning letters keep clear of the gold boxes (a long name such as UTAH touched them) */
.sb-nhl-sn-05 .a, .sb-nhl-sn-05 .h { padding: 0 ${X(1.2)}px; box-sizing: border-box; }
/* the gold score boxes: each fills its cell top to bottom and line to line (the lines and the outline lie over its edges), dark figures */
.sb-nhl-sn-05 .g { top: 0; height: ${H}px; transform: skewX(-12deg); color: #1e1a10; text-shadow: none; background: linear-gradient(#f4d270, #ddb03c 50%, #b48a26); box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 1px 2px rgba(0,0,0,.6); }
.sb-nhl-sn-05 .g1 { left: ${X(45)}px; width: ${X(61.5) - X(45)}px; } .sb-nhl-sn-05 .g2 { left: ${X(84)}px; width: ${X(99.5) - X(84)}px; }
/* a three-figure score: a size a little smaller than two figures, squeezed sideways into its gold box (it was 0.7) */
.sb-nhl-sn-05 .g .n3 { font-size: ${PX * 0.86}px; min-width: 0 !important; max-width: 76%; }
.sb-nhl-sn-05 .g > * { transform: skewX(12deg); }
.sb-nhl-sn-05 .pd { left: ${X(99)}px; width: ${X(18)}px; } .sb-nhl-sn-05 .ck { left: ${X(118)}px; width: ${X(24)}px; }
.sb-nhl-sn-05 .w { left: ${X(101)}px; width: ${X(END - 102)}px; font-size: ${PX * 0.8}px; }
/* before the game the gold boxes widen so the records (a three-part hockey record: 10-14-1) can be read; the row moves over to make room */
.sb-nhl-sn-05.pre .a { left: ${X(13)}px; } .sb-nhl-sn-05.pre .g1 { left: ${X(36)}px; width: ${X(60) - X(36)}px; } .sb-nhl-sn-05.pre .h { left: ${X(61)}px; }
.sb-nhl-sn-05.pre .g2 { left: ${X(84)}px; width: ${X(108.5) - X(84)}px; } .sb-nhl-sn-05.pre .w { left: ${X(110)}px; width: ${X(END - 111)}px; }
/* the white plate where the network's wordmark stood, leaning forward */
.sb-nhl-sn-05 .mk { left: ${X(END + 1)}px; width: ${X(49)}px; top: ${X(1)}px; height: ${X(12)}px; transform: skewX(-12deg); background: linear-gradient(#ffffff, #e9eaee 55%, #c9ccd4); box-shadow: 0 1px 2px rgba(0,0,0,.5); }
.sb-nhl-sn-05 .mk .sb-ha { color: #20306a; transform: skewX(12deg); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.classList.toggle('pre', g.status === 'pre');
    root.appendChild(el('div', 'bar'));
    // the black dividing lines between the cells (crop px), moved with the cells before the game; the last one always at the clock's end
    const dv = g.status === 'pre' ? [11.5, 36, 60, 84, 108.5, END] : live ? [22.5, 45, 61.5, 84, 99.5, 117.5, END] : [22.5, 45, 61.5, 84, 99.5, END];
    dv.forEach((x) => { const d = el('div', 'dv'); d.style.left = (X(x) - X(0.8)) + 'px'; root.appendChild(d); });
    root.append(fit(el('div', 'c a', (g.away.abbr || '').toUpperCase())), fit(el('div', 'c h', (g.home.abbr || '').toUpperCase())));
    [[g.away, 'g1'], [g.home, 'g2']].forEach(([t, c]) => { const b = el('div', 'c g ' + c); const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''; const n = scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g); b.appendChild(v.length > 2 ? fit(n) : n); root.appendChild(b); });
    if (live) root.append(el('div', 'c pd', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('div', 'c ck', g.clock || ''));
    else root.appendChild(el('div', 'c w', statusText(g, time)));
    const mk = el('div', 'c mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.72))); root.append(mk, el('div', 'ol'));
  },
};
