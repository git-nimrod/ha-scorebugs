// "Battle box '16": after the Formula 1 world feed's graphics of 2015-2017 (frame: the 2016 Spanish GP, lap 13; retro catalogue
// f1-16-1). Top left: a small black tab with the lap, and under it a battle box: a black head "Battle for 3rd" over two grey rows,
// each with the position on a lighter square, a slash in the team's colour, the driver's three letters and the gap.
// Measured on the 720p still: lap tab 103 x 22 px, box 207 px wide, head 26 px, rows 22 px on a 24 px pitch; head
// black at 80 %, rows #2b2b2b at 75 %, position squares #5f5f5f; the slash leans 30 deg, 3 px wide.
// The battle: the followed driver and the car ahead of them (the leader and the car behind when the followed driver leads; the first
// two without one). : the box 192 px wide; the lap tab 24 px; the head
// and the rows 24 px each with no gap between the rows, the position squares 24 px wide.
// The gap needs timing the sensor lacks: left empty, as on the frame's first row.
import { el, FONTS } from '../kit.js';

const W = 576, S = 3;
const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const SESSION = { Race: 'Race', Qual: 'Qualifying', FP1: 'Practice 1', FP2: 'Practice 2', FP3: 'Practice 3', Sprint: 'Sprint', SQ: 'Sprint Quali' };

export default {
  id: 'race-f1-16',
  size: { w: W, h: 100 * S },
  sizeFor: (g) => ({ w: W, h: ((g.rows || []).length >= 2 ? 100 : 22) * S }),
  fonts: [FONTS.titillium],
  css: `
.sb-race-f1-16 { font-family: 'SB Titillium', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-race-f1-16 .lp { position: absolute; left: 0; top: 0; height: ${24 * S}px; padding: 0 ${8 * S}px; display: grid; place-items: center; background: rgba(0,0,0,.78); font-size: ${15 * S}px; white-space: nowrap; border-radius: ${3 * S}px; }
.sb-race-f1-16 .hd { position: absolute; left: 0; right: 0; top: ${28 * S}px; height: ${24 * S}px; display: grid; place-items: center; background: rgba(0,0,0,.8); font-size: ${15 * S}px; font-weight: 400; white-space: nowrap; }
.sb-race-f1-16 .rw { position: absolute; left: 0; right: 0; height: ${24 * S}px; display: grid; grid-template-columns: ${24 * S}px ${20 * S}px 1fr auto; align-items: center; background: rgba(40,40,40,.76); font-size: ${16 * S}px; }
.sb-race-f1-16 .rw .p { height: 100%; display: grid; place-items: center; background: rgba(98,98,98,.9); font-weight: 400; }
.sb-race-f1-16 .rw .mk { width: ${3 * S}px; height: ${16 * S}px; transform: skewX(-30deg); justify-self: center; }
/* a black team's mark keeps a faint light edge on the dark row */
.sb-race-f1-16 .rw .mk { box-shadow: 0 0 0 1px rgba(255,255,255,.22); }
.sb-race-f1-16 .rw .c { letter-spacing: 1px; padding-left: ${4 * S}px; }
.sb-race-f1-16 .rw .g { padding-right: ${10 * S}px; font-weight: 400; }
`,
  draw(root, g) {
    const live = g.status === 'live' && (!g.session || g.session === 'Race') && g.lap;
    root.appendChild(el('div', 'lp', live ? 'Lap ' + g.lap : g.status === 'final' ? 'Final' : SESSION[g.session] || g.session || 'Race'));
    const rows = g.rows || [];
    if (rows.length < 2) return;
    let i = g.player ? rows.findIndex((r) => r.id === g.player.id) : -1;
    if (i < 1) i = 1;
    const pair = [rows[i - 1], rows[i]];
    const pos = (r, k) => Number(r.pos) || i - 1 + k + 1;
    root.appendChild(el('div', 'hd', g.status === 'final' ? 'Result' : 'Battle for ' + ORD(pos(pair[0], 0))));
    pair.forEach((r, k) => {
      const rw = el('div', 'rw'); rw.style.top = (52 + k * 24) * S + 'px';
      const m = el('i', 'mk'); m.style.background = r.color || '#9a9aa8';
      rw.append(el('span', 'p', String(pos(r, k))), m, el('span', 'c', r.code || String(r.short || '').slice(0, 3)), el('span', 'g', ''));
      root.appendChild(rw);
    });
  },
};
