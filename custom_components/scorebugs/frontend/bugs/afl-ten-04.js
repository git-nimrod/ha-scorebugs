// "Grid box '04": after the other free-to-air network's Australian football score box (2004; frame: Essendon v West Coast, third
// quarter, a 1280 x 720 upload of an SD broadcast, so the finish readings are guides). A see-through periwinkle grid at the top left:
// three rows of two cells (each side's letters and points, then the quarter and the clock), the cells parted by thin light lines.
// measured: rows 29 % of the height each, columns 42 % and 55 %, gaps
// 3 % lighter (#9aa2e2); cells #6771b6, flat to a darker foot (-10 L over the last 10 %); capitals 22 % of the height; letters a
// condensed bold sans, white with a dark navy shadow; the quarter in lower case ("3rd").
// sampled across each divider on two
// 2004 stills: the lines between the cells and the frame round them are a dark indigo-purple, core #27326a to
// #2d336d (L 23) with softer #3a3f7f edges, about 3 % of the box's width; they were drawn light (#aab2ec). The clock row is one cell
// on air (no line between the quarter and the clock).
import { el, fit, statusText, FONTS } from '../kit.js';

const W = 290, H = 190;

export default {
  id: 'afl-ten-04',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond700],
  css: `
.sb-afl-ten-04 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-afl-ten-04 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-afl-ten-04 *, .sb-afl-ten-04 *::before { box-sizing: border-box; }
.sb-afl-ten-04 .grid { position: absolute; inset: 0; display: grid; grid-template-columns: 122px 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 6px; padding: 6px; background: #2b336d; box-shadow: inset 0 0 0 1.5px #3a3f7f; }
.sb-afl-ten-04 .c { background: linear-gradient(#6872b8 0%, #6771b6 60%, #666fb1 80%, #5e68a6 92%, #3a4482 100%); display: flex; align-items: center; padding: 0 10px; font-size: 52px; line-height: 1; text-shadow: 2px 2px 0 rgba(28,30,80,.75); white-space: nowrap; }
.sb-afl-ten-04 .c.n { justify-content: flex-end; padding-right: 12px; }
.sb-afl-ten-04 .c.s { font-size: 44px; }
`,
  draw(root, g, { time }) {
    const grid = el('div', 'grid');
    const cell = (txt, cls) => { const c = el('div', 'c ' + (cls || '')); c.appendChild(fit(el('span', '', txt))); return c; };
    [g.home, g.away].forEach((t) => {
      grid.append(cell((t.abbr || '').toUpperCase()), cell(g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : '', 'n' + (g.status === 'pre' ? ' s' : '')));
    });
    // the quarter as the frame writes it ("3rd"), then the clock; before and after the game the time or FULL TIME across the row
    // one cell across the row, as on air (no divider between the quarter and the clock)
    if (g.status === 'live') { const c = cell(((g.period.label || '') + (g.period.suffix || '')).toLowerCase()); c.style.gridColumn = '1 / span 2'; c.style.justifyContent = 'space-between'; c.appendChild(el('span', '', g.clock || '')); grid.appendChild(c); }
    else { const c = cell(g.status === 'final' ? 'FULL TIME' : statusText(g, time), 's'); c.style.gridColumn = '1 / span 2'; c.style.justifyContent = 'center'; grid.appendChild(c); }
    root.appendChild(grid);
  },
};
