// "Top ticker '04": after the stock-car ticker on its US broadcast of 2004 (frame: the 2004 Daytona 500, lap 24; retro catalogue
// nas-nbc-04-1, an SD upload). Top left: the network's mark (the Home Assistant mark here) beside a black tab with the lap in yellow
// capitals; under it a see-through grey ticker with the running order: the position in white, the car number in white italics on a
// disc in the car's colour with a white rim, and the surname in white, mixed case.
// Measured on the still: ticker 34 px of 720 tall, #242a23 at the top lightening 9 L to the foot (glass over the track),
// an entry every 287 px; number discs 40 px across with a 2 px white rim; lap tab black, its type #e6cf4a.
// Left out (no data): the race distance ("OF 200"), the flag light by the lap, the interval row under the ticker; the sponsor's mark
// at the right is never drawn.
import { el, fit, haMark, inkOn, marks, statusText, FONTS } from '../kit.js';

const S = 1.5, MARK = 160, ENTRY = 430, N = 3, H = Math.round(68 * S);
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return s + suf; };

export default {
  id: 'race-nbc-04',
  size: { w: MARK + 8 + N * ENTRY, h: H },
  sizeFor: (g) => ({ w: MARK + 8 + Math.max(1, Math.min(N, (g.rows || []).length)) * ENTRY, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-race-nbc-04 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 600; color: #f4f4f4; }
.sb-race-nbc-04 .mk { position: absolute; left: 0; top: ${Math.round(14 * S)}px; width: ${MARK}px; height: ${Math.round(52 * S)}px; display: grid; place-items: center; color: #fff; }
.sb-race-nbc-04 .lp { position: absolute; left: ${MARK + 10}px; top: 0; height: ${Math.round(30 * S)}px; padding: 0 28px; display: grid; place-items: center; background: rgba(0,0,0,.9); border-radius: 12px;
  color: #e6cf4a; font-size: 30px; font-weight: 700; letter-spacing: 1px; white-space: nowrap; }
/* the ticker: glass over the track, darker at the top and lighter at the foot */
.sb-race-nbc-04 .tk { position: absolute; left: ${MARK + 8}px; right: 0; top: ${Math.round(34 * S)}px; height: ${Math.round(34 * S)}px; display: flex;
  background: linear-gradient(rgba(30,35,32,.86), rgba(36,42,38,.84) 45%, rgba(58,64,62,.84) 80%, rgba(78,84,84,.86)); box-shadow: 0 2px 4px rgba(0,0,0,.4); }
.sb-race-nbc-04 .e { width: ${ENTRY}px; flex: none; display: flex; align-items: center; gap: 12px; padding-left: 22px; box-sizing: border-box; font-size: 34px; white-space: nowrap; overflow: hidden; }
.sb-race-nbc-04 .e + .e { box-shadow: inset 3px 0 0 rgba(0,0,0,.35); }
.sb-race-nbc-04 .e .p { flex: none; width: 28px; text-align: center; font-weight: 700; }
.sb-race-nbc-04 .e .d { flex: none; width: 56px; height: 46px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 3px #f2f2f2, 0 0 0 1px rgba(0,0,0,.6);
  font-style: italic; font-weight: 800; font-size: 32px; color: #fff; }
.sb-race-nbc-04 .e .n { min-width: 0; overflow: hidden; padding-right: 12px; }
`,
  draw(root, g, { opts, time }) {
    if (marks(opts).ha) { const m = el('div', 'mk'); m.appendChild(haMark(76)); root.appendChild(m); }
    const race = !g.session || g.session === 'Race';
    root.appendChild(el('div', 'lp', g.status === 'live' && race && g.lap ? 'LAP ' + g.lap : g.status === 'final' ? 'FINAL' : g.status === 'pre' ? statusText(g, time) : String(g.session || '').toUpperCase()));
    const tk = el('div', 'tk');
    (g.rows || []).slice(0, N).forEach((r, i) => {
      const e = el('span', 'e');
      const d = el('span', 'd', r.number || ''); d.style.background = r.color || '#5a5f66'; d.style.color = inkOn(r.color || '#5a5f66');
      e.append(el('span', 'p', String(r.pos || i + 1)), d, fit(el('span', 'n', surname(r))));
      tk.appendChild(e);
    });
    root.appendChild(tk);
  },
};
