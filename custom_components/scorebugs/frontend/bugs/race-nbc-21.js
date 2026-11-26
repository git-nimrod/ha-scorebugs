// "Timing tower '21": after the open-wheel series' timing tower on its US broadcast of 2019-2021 (frame: the 2021 Music City GP, lap 10;
// retro catalogue indy-nbc-21-1). A tower down the left: a dark teal glass head between two chrome posts with the race's name and the lap
// in pale cyan, a white plate with the series' logo, then a row per car on near-black glass: the position with a full stop, the car
// number on a small plate in the car's colours, and the surname in white capitals; the rows alternate a shade and are parted by thin
// grey rules.
// Measured on the 1080p still: head #0e282b glass, a bright top line (+15 L) and top (+33) over a horizon at
// 25 %; logo plate #d7e2e2 gloss, horizon 31 %; rows 36 px on a 40 px pitch, #191c1a and #0a0e0d by turns, the top one lit +1 L; number
// plates 32 x 24 px, italic figures; letters wide, cyan #8fe8f0 in the head.
// Left out (no data): the race distance ("OF 80") and the "behind leader" seconds; their header strip says RUNNING ORDER instead.
import { el, fit, inkOn, leagueLogo, marks, statusText, FONTS } from '../kit.js';

const S = 1.2, W = Math.round(300 * S), ROW = Math.round(40 * S), TOP = Math.round(137 * S), ROWS = 17;
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return s + suf; };

export default {
  id: 'race-nbc-21',
  size: { w: W, h: TOP + ROWS * ROW },
  sizeFor: (g) => ({ w: W, h: TOP + Math.max(1, Math.min(ROWS, (g.rows || []).length)) * ROW }),
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-race-nbc-21 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* the head: teal glass between two chrome posts */
.sb-race-nbc-21 .hd { position: absolute; left: 0; right: 0; top: 0; height: ${Math.round(56 * S)}px; padding: 0 ${Math.round(14 * S)}px; display: grid; align-content: center; justify-items: center;
  background: linear-gradient(to right, #8b8f92, #e0e3e5 3%, #6d7174 5%, transparent 5.2%, transparent 94.8%, #6d7174 95%, #e0e3e5 97%, #8b8f92),
    linear-gradient(#5fa4ab 0, #2a5c62 4%, #17393d 22%, #0e282b 28%, #0c2326 70%, #123236); color: #8fe8f0; line-height: 1.08; font-stretch: 118%; font-weight: 500; }
.sb-race-nbc-21 .hd .ev { font-size: ${Math.round(17 * S)}px; letter-spacing: .5px; white-space: nowrap; max-width: 100%; overflow: hidden; }
.sb-race-nbc-21 .hd .lp { font-size: ${Math.round(24 * S)}px; letter-spacing: 2px; word-spacing: 6px; white-space: nowrap; }
.sb-race-nbc-21 .lg { position: absolute; left: ${Math.round(14 * S)}px; right: ${Math.round(14 * S)}px; top: ${Math.round(58 * S)}px; height: ${Math.round(38 * S)}px; display: grid; place-items: center;
  background: linear-gradient(#fbfdfd, #eef4f4 28%, #d4dfdf 34%, #cbd6d6); box-shadow: inset 0 0 0 1px rgba(0,0,0,.25); }
.sb-race-nbc-21 .lg .sb-league { height: ${Math.round(34 * S)}px; width: auto; max-width: 90%; object-fit: contain; }
.sb-race-nbc-21 .lg .sb-league-text { font-size: 28px !important; color: #15181a; font-weight: 800; letter-spacing: 2px; display: grid; place-items: center; }
/* a dark chrome strip over the rows (the seconds' header on air): the running order's name here */
.sb-race-nbc-21 .sh { position: absolute; left: 0; right: 0; top: ${Math.round(104 * S)}px; height: ${Math.round(30 * S)}px; display: grid; align-items: center; padding-left: ${Math.round(10 * S)}px;
  background: linear-gradient(#5a5d60, #2b2e30 30%, #050606 40%, #000); font-size: ${Math.round(17 * S)}px; font-weight: 500; font-stretch: 112%; letter-spacing: .5px; }
.sb-race-nbc-21 .rw { position: absolute; left: 0; right: 0; height: ${ROW - 2}px; display: grid; grid-template-columns: ${Math.round(44 * S)}px ${Math.round(42 * S)}px 1fr; align-items: center;
  background: rgba(0, 0, 0, .5); border-bottom: 2px solid #3c3f42; font-size: ${Math.round(21 * S)}px; font-stretch: 86%; }
/* each row a rounded slab: corners about 12 px in the bug's units on the frame */
.sb-race-nbc-21 .rw { border-radius: 11px; }
.sb-race-nbc-21 .rw .p { text-align: right; padding-right: ${Math.round(4 * S)}px; }
.sb-race-nbc-21 .rw .c { height: ${Math.round(24 * S)}px; margin: 0 ${Math.round(5 * S)}px; display: grid; place-items: center; border-radius: 2px; font-family: 'SB Archivo', sans-serif; font-style: italic; font-weight: 800; font-size: ${Math.round(18 * S)}px; }
.sb-race-nbc-21 .rw .n { min-width: 0; overflow: hidden; white-space: nowrap; padding: 0 ${Math.round(8 * S)}px 0 ${Math.round(6 * S)}px; letter-spacing: .5px; }
`,
  draw(root, g, { opts, time }) {
    const hd = el('div', 'hd');
    const race = !g.session || g.session === 'Race';
    hd.append(fit(el('span', 'ev', String(g.event || '').toUpperCase())),
      el('span', 'lp', g.status === 'live' && race && g.lap ? 'LAP ' + g.lap : g.status === 'final' ? 'FINAL' : g.status === 'pre' ? statusText(g, time) : String(g.session || '').toUpperCase()));
    root.appendChild(hd);
    const lg = el('div', 'lg'); if (marks(opts).league) lg.appendChild(leagueLogo(g, Math.round(34 * S))); root.appendChild(lg);
    root.appendChild(el('div', 'sh', 'RUNNING ORDER'));
    (g.rows || []).slice(0, ROWS).forEach((r, i) => {
      const rw = el('div', 'rw' + (i % 2 ? ' alt' : '') + (g.player && g.player.id === r.id ? ' me' : ''));
      rw.style.top = (TOP + i * ROW) + 'px';
      const c = el('span', 'c', r.number || ''); const col = r.color || '#2a2d30'; c.style.background = col; c.style.color = inkOn(col);
      rw.append(el('span', 'p', String(r.pos || i + 1) + '.'), c, fit(el('span', 'n', surname(r).toUpperCase())));
      root.appendChild(rw);
    });
  },
};
