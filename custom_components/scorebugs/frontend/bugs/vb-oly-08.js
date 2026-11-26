// "Navy sets box '08": after the 2008 Olympic world feed's volleyball box (frame: retro catalogue vb-08-2, USA v Brazil, Beijing). A
// small navy box at the top left with rounded corners, one row per team: the three-letter code in white condensed capitals, the flag
// (the team's logo here), the sets won in tall white figures, and the points of the set being played in navy figures on a light box
// whose right side is rounded; the team serving has an orange triangle in a navy tab beside its points.
// Measured: box 193 x 87 (two rows of 43), radius 6; code cap 0.49 of a row, flag 53 x 30, sets cap
// 0.62, points box 58 x 37 (radius 8 on the right), points cap 0.6; serve tab 31 x 37, triangle 18 wide, orange #f08a1c.
import { el, logo, statusText, FONTS, fit, abbr3 } from '../kit.js';

const W = 238, ROW = 43, BOX = 193;

export default {
  id: 'vb-oly-08',
  size: { w: W, h: 2 * ROW + 1 + 34 },
  sizeFor: (g) => ({ w: W, h: 2 * ROW + 1 + (g.status === 'live' ? 0 : 34) }),
  fonts: [FONTS.barlowCond600],
  css: `
.sb-vb-oly-08 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 600; color: #fff; }
.sb-vb-oly-08 .bx { position: absolute; left: 0; top: 0; width: ${BOX}px; height: ${2 * ROW + 1}px; background: linear-gradient(#24205e, #1b1850); border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
.sb-vb-oly-08 .rw { position: absolute; left: 0; width: ${BOX}px; height: ${ROW}px; display: flex; align-items: center; }
.sb-vb-oly-08 .ab { width: 40px; margin-left: 6px; font-size: 30px; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-vb-oly-08 .fl { width: 53px; height: 30px; display: grid; place-items: center; }
.sb-vb-oly-08 .fl .sb-logo { width: 53px; height: 30px; object-fit: contain; }
.sb-vb-oly-08 .st { width: 30px; margin-left: 9px; text-align: center; font-size: 38px; line-height: 1; }
.sb-vb-oly-08 .pt { position: absolute; right: 2px; top: 3px; width: 54px; height: 37px; border-radius: 2px 9px 9px 2px; background: linear-gradient(#f4f4f6, #e2e3e8); color: #1b1850; display: grid; place-items: center; font-size: 36px; line-height: 1; }
.sb-vb-oly-08 .sv { position: absolute; left: ${BOX - 4}px; width: 35px; height: 37px; border-radius: 0 9px 9px 0; background: #1b1850; }
.sb-vb-oly-08 .sv::after { content: ''; position: absolute; left: 9px; top: 9px; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-right: 18px solid #f08a1c; border-radius: 3px; }
.sb-vb-oly-08 .w { position: absolute; left: 0; top: ${2 * ROW + 5}px; width: ${BOX}px; height: 28px; border-radius: 5px; background: #1b1850; display: grid; place-items: center; font-size: 22px; letter-spacing: .03em; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const bx = el('div', 'bx'), live = g.status === 'live';
    [g.away, g.home].forEach((t, i) => {
      const rw = el('div', 'rw'); rw.style.top = (i * (ROW + 1)) + 'px';
      const fl = el('span', 'fl'); fl.appendChild(logo(t, 53));
      rw.append(fit(el('span', 'ab', abbr3(t))), fl);
      if (g.status !== 'pre') {
        rw.appendChild(el('span', 'st', t.score != null ? String(t.score) : '0'));
        // the points of the set being played (live only; after the match the sets won stand alone)
        if (live) rw.appendChild(el('span', 'pt', (t.sets || []).length ? String(t.sets[t.sets.length - 1]) : ''));
      }
      bx.appendChild(rw);
      if (live && t.hasBall) { const sv = el('div', 'sv'); sv.style.top = (i * (ROW + 1) + 3) + 'px'; root.appendChild(sv); }
    });
    root.appendChild(bx);
    if (!live) root.appendChild(el('div', 'w', g.status === 'final' ? 'FINAL' : statusText(g, time)));
  },
};
