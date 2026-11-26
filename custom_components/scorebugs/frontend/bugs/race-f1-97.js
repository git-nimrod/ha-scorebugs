// "Top three '97": after the Formula 1 world feed of 1997 (frame: the 1997 European GP at Jerez, the finish; retro catalogue
// f1-97-3). A see-through grey band low on the picture with the first three cars: the position on a yellow square, the driver's
// surname in white capitals with the hard dark shadow of 1990s type, and on the right, in a pale yellow, the race distance on the
// leader's line ("62 Laps") and the gap on the others.
// Measured on the 1080p still: band #424741 flat, about 85 % opaque over the track (the track and kerb show
// through); rows 57 px apart, capitals 30 px. : the squares sit 6 px under the band's top (the bug ends
// as far under the third), olive yellow #929038 with no rim and no shadow (sampled in five bands on all three).
// The gaps need timing the sensor lacks: the leader's line carries the laps run (the lap the sensor gives), the others stay empty
// as on the frame's leader line. Other sessions show their name on the leader's line.
import { el, fit, FONTS } from '../kit.js';

const W = 700, ROW = 57, TOP = 4, ROWS = 3;
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
// "Ricky Stenhouse Jr." -> "STENHOUSE JR": a suffix keeps its surname
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return (s + suf).toUpperCase(); };
const SESSION = { Qual: 'Qualifying', FP1: 'Practice 1', FP2: 'Practice 2', FP3: 'Practice 3', Sprint: 'Sprint', SQ: 'Sprint Quali' };

export default {
  id: 'race-f1-97',
  size: { w: W, h: TOP * 2 + ROWS * ROW - 6 },
  sizeFor: (g) => ({ w: W, h: TOP * 2 + Math.max(1, Math.min(ROWS, (g.rows || []).length)) * ROW - 6 }),
  fonts: [FONTS.archivo],
  css: `
.sb-race-f1-97 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 600; font-stretch: 96%; color: #e6e6e0; }
/* the band: flat dark grey, see-through */
.sb-race-f1-97 .bd { position: absolute; inset: 0; background: rgba(66,71,65,.86); }
.sb-race-f1-97 .rw { position: absolute; left: 30px; right: 34px; height: ${ROW - 8}px; display: grid; grid-template-columns: 50px 1fr 210px; column-gap: 14px; align-items: center; }
/* the position square: a flat olive yellow (#929038 on air, no rim, no shadow), the figure a dark olive brown (stroke core #1e1500) */
.sb-race-f1-97 .p { height: 44px; display: grid; place-items: center; background: linear-gradient(#949248, #939036 18%, #928e3a 80%, #8a8538); color: #322a04; font-size: 48px; font-weight: 800; line-height: 1; }
.sb-race-f1-97 .n { font-size: 43px; letter-spacing: 1px; white-space: nowrap; overflow: hidden; line-height: 1.1;
  text-shadow: 2px 2px 0 #20221f, 3px 4px 2px rgba(0,0,0,.6); }
.sb-race-f1-97 .t { justify-self: end; font-size: 32px; font-weight: 800; font-stretch: 112%; color: #ddd69a; white-space: nowrap; line-height: 1.1; text-shadow: 2px 2px 0 #20221f, 3px 4px 2px rgba(0,0,0,.6); }
.sb-race-f1-97 .t small { font-size: 30px; font-weight: 700; margin-left: 8px; }
`,
  draw(root, g) {
    root.appendChild(el('div', 'bd'));
    const race = !g.session || g.session === 'Race';
    (g.rows || []).slice(0, ROWS).forEach((r, i) => {
      const rw = el('div', 'rw'); rw.style.top = (TOP + i * ROW) + 'px';
      const t = el('span', 't');
      if (i === 0) {
        if (race && g.status !== 'pre' && g.lap) { t.appendChild(document.createTextNode(String(g.lap))); t.appendChild(el('small', '', 'Laps')); }
        else if (!race) t.textContent = SESSION[g.session] || g.session;
      }
      rw.append(el('span', 'p', String(r.pos || i + 1)), fit(el('span', 'n', SUF.test(String(r.short || '').replace(/\.$/, '')) || !r.short ? surname(r) : String(r.short).toUpperCase()), r.code || ''), t);
      root.appendChild(rw);
    });
  },
};
