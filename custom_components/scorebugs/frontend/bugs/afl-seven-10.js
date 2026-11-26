// "Stack box '10": after the free-to-air network's Australian football score box (2010; frame: Collingwood v St Kilda, first quarter,
// a 1280 x 720 upload of the broadcast). A small stacked box at the top left: the clock on a glossy red tab beside the quarter on a white
// one, then each side's letters on a glossy black plate beside its points on a glossy red one; a pale rim round the top row, a black
// rim round the whole.
// measured: top row 29 % of the height, the two side rows 33 % each;
// name plates 56 % of the width, points 40 %; the red #ac2a13 with a light band along its top third (horizon 26-30 %, step 14-19 L);
// the black #1c1e1e with a grey sheen in its top third; the white #f7faf2 over #dde2de; capitals 18 % of the height; letters a wide bold
// sans, white (the quarter black).
import { el, fit, statusText, FONTS } from '../kit.js';

const W = 300, H = 177;

export default {
  id: 'afl-seven-10',
  size: { w: W, h: H },
  fonts: [FONTS.barlow800],
  css: `
.sb-afl-seven-10 { font-family: 'SB Barlow', 'Arial Black', sans-serif; font-weight: 800; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-afl-seven-10 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-afl-seven-10 *, .sb-afl-seven-10 *::before { box-sizing: border-box; }
.sb-afl-seven-10 .box { position: absolute; inset: 0; background: #0b0c0c; border-radius: 3px; padding: 4px; display: grid; grid-template-rows: 47px 1fr 1fr; gap: 4px; }
.sb-afl-seven-10 .row { display: grid; grid-template-columns: 164px 1fr; gap: 4px; }
.sb-afl-seven-10 .row.t { box-shadow: 0 0 0 3px #d8d8c8; border-radius: 2px; gap: 0; }
.sb-afl-seven-10 .row > span { display: flex; align-items: center; justify-content: center; padding: 0 8px; font-size: 44px; line-height: 1; white-space: nowrap; }
/* glossy red: a light band over the top third, a step at 28 %, the red below (sampled) */
.sb-afl-seven-10 .red { background: linear-gradient(#d86c5c 0%, #c45a48 26%, #ac311c 30%, #ac2810 55%, #b31d06 75%, #9c1600 100%); }
.sb-afl-seven-10 .blk { background: linear-gradient(#3a3a3a 0%, #646464 22%, #2a2a2a 30%, #1c1c1e 50%, #252726 65%, #151a12 100%); }
.sb-afl-seven-10 .wht { background: linear-gradient(#f7faf2 0%, #eef2ec 26%, #dde2de 30%, #eaf1ee 60%, #cfd3d0 100%); color: #111; }
.sb-afl-seven-10 .rec { font-size: 30px !important; }
`,
  draw(root, g, { time }) {
    const box = el('div', 'box');
    const t1 = el('div', 'row t');
    if (g.status === 'live') t1.append(el('span', 'red', g.clock || ''), el('span', 'wht', ((g.period.label || '') + (g.period.suffix || '')).toUpperCase()));
    else { const s = el('span', 'red'); s.appendChild(fit(el('span', '', g.status === 'final' ? 'FULL TIME' : statusText(g, time)))); s.style.gridColumn = '1 / span 2'; s.style.fontSize = '34px'; t1.appendChild(s); }
    box.appendChild(t1);
    [g.home, g.away].forEach((t) => {
      const r = el('div', 'row'), nm = el('span', 'blk');
      nm.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      // the points; before the bounce each side's record in their place
      r.append(nm, el('span', 'red' + (g.status === 'pre' ? ' rec' : ''), g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''));
      box.appendChild(r);
    });
    root.appendChild(box);
  },
};
