// "Top ticker '01": after the stock-car ticker on its US broadcast of 2001 (frame: the 2001 Pennsylvania 500 at Pocono, 169 laps to go;
// retro catalogue nas-fox-01-1, an SD upload: rough). A black band across the top of the picture: the race's count in yellow on the
// left, then the running order, each car with its position in black on a yellow square and "number - surname" in white.
// Measured on the still: band 42 px of 720, near black; loop pass 1 (Nov 25): the entries' part is a gloss (L 22 top,
// a step 45 % down, L 3 at the foot), the count's panel flat (L 15); yellow squares #c8ad4a, 25 x 22 px, an
// entry every 225 px; type a plain bold sans, mixed case.
// The frame counts the laps to go; the sensor has no race distance, so the band shows the lap being run ("Lap 31"). The network's mark
// under the band is not drawn.
import { el, fit, statusText, FONTS } from '../kit.js';

const S = 1.5, H = Math.round(42 * S), LEAD = 250, ENTRY = 300, N = 5;
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
// "Ricky Stenhouse Jr." -> "Stenhouse Jr", as tickers set it
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return s + suf; };

export default {
  id: 'race-fox-01',
  size: { w: LEAD + N * ENTRY, h: H },
  sizeFor: (g) => ({ w: LEAD + Math.max(1, Math.min(N, (g.rows || []).length)) * ENTRY, h: H }),
  fonts: [FONTS.barlow700],
  css: `
.sb-race-fox-01 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 600; color: #dcdcdc; }
/* the band: a 2001 gloss, lit on top, a step about 45 % down, near black at the foot (sampled between the entries on both stills) */
.sb-race-fox-01 .bd { position: absolute; inset: 0; background: linear-gradient(#19181a, #161517 32%, #0e0d0f 48%, #070608 76%, #030303); display: flex; align-items: center; }
/* the count sits on its own flat panel (L 15 on air, no gloss) */
.sb-race-fox-01 .lp { width: ${LEAD}px; flex: none; align-self: stretch; display: flex; align-items: center; justify-content: center; background: #100f11; color: #e9cf4a; font-size: 40px; font-weight: 700; white-space: nowrap; }
.sb-race-fox-01 .e { width: ${ENTRY}px; flex: none; display: flex; align-items: center; gap: 12px; font-size: 36px; white-space: nowrap; overflow: hidden; padding-right: 10px; box-sizing: border-box; }
/* the position: black on a flat yellow square, a darker rim */
.sb-race-fox-01 .e .p { flex: none; width: 46px; height: 40px; display: grid; place-items: center; background: linear-gradient(#d9bf55, #c8ad4a 60%, #b39940); box-shadow: inset 0 0 0 2px #6f5f22; color: #111; font-size: 32px; font-weight: 700; }
.sb-race-fox-01 .e .n { min-width: 0; overflow: hidden; }
`,
  draw(root, g, { time }) {
    const bd = el('div', 'bd');
    const race = !g.session || g.session === 'Race';
    bd.appendChild(el('span', 'lp', g.status === 'live' && race && g.lap ? 'Lap ' + g.lap : g.status === 'final' ? 'Final' : g.status === 'pre' ? statusText(g, time) : g.session || ''));
    (g.rows || []).slice(0, N).forEach((r, i) => {
      const e = el('span', 'e');
      e.append(el('span', 'p', String(r.pos || i + 1)), fit(el('span', 'n', (r.number ? r.number + ' - ' : '') + surname(r)), surname(r)));
      bd.appendChild(e);
    });
    fit(bd.firstChild);
    root.appendChild(bd);
  },
};
