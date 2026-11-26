// "Timing tower '19": after the Formula 1 world feed's timing tower of 2018-2021 (frame: the 2019 Abu Dhabi GP, lap 36; retro catalogue
// f1-19-2). A narrow dark column down the left of the picture: LAP spaced out over the lap, then a row per car with the position in
// black on a small white square, a thin upright bar in the team's colour, the driver's three letters, and a lighter column on the right.
// Measured on the 720p still: column 172 px wide, rows on a 24 px pitch, white squares 18 x 18 px, team bars 4 x 16 px;
// LAP tracked out about 0.3 em. : the left 57 % solid black (L 0), the
// interval column see-through (the track shows through: black at about 55 %); squares 20 x 20 from x 5, team bar at x 34-37, code
// from x 47.
// The intervals need timing the sensor lacks: the right column carries the car's number in grey, as the 2025 tower does. The
// fastest-lap clock and the pit marks are left out (no data).
import { el, fit, FONTS } from '../kit.js';

const S = 2, W = 172 * S, ROW = 24 * S, TOP = 48 * S, ROWS = 20;
const SESSION = { Race: 'RACE', Qual: 'QUALI', FP1: 'FP1', FP2: 'FP2', FP3: 'FP3', Sprint: 'SPRINT', SQ: 'SPRINT Q' };

export default {
  id: 'race-f1-19',
  size: { w: W, h: TOP + ROWS * ROW - 2 * S },
  sizeFor: (g) => ({ w: W, h: TOP + Math.max(1, Math.min(ROWS, (g.rows || []).length)) * ROW - 2 * S }),
  fonts: [FONTS.titillium],
  css: `
.sb-race-f1-19 { font-family: 'SB Titillium', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-race-f1-19 .col { position: absolute; inset: 0; background: linear-gradient(to right, #000 0 57%, rgba(0,0,0,.55) 57%); }
.sb-race-f1-19 .hd { position: absolute; left: 0; width: 57%; top: ${2 * S}px; display: grid; justify-items: center; line-height: 1; }
.sb-race-f1-19 .hd .w { font-size: ${15 * S}px; letter-spacing: ${5 * S}px; margin-right: -${5 * S}px; }
.sb-race-f1-19 .hd .v { font-size: ${15 * S}px; font-weight: 400; margin-top: ${6 * S}px; letter-spacing: ${1 * S}px; }
.sb-race-f1-19 .rw { position: absolute; left: ${5 * S}px; right: ${4 * S}px; height: ${20 * S}px; display: grid; grid-template-columns: ${20 * S}px ${21 * S}px 1fr auto; align-items: center; font-size: ${13 * S}px; }
.sb-race-f1-19 .rw .p { height: ${20 * S}px; display: grid; place-items: center; background: #f4f4f4; color: #0c0c0c; font-size: ${13 * S}px; border-radius: 1px; }
.sb-race-f1-19 .rw .mk { width: ${4 * S}px; height: ${16 * S}px; justify-self: center; }
/* a black team's mark keeps a faint light edge on the dark row */
.sb-race-f1-19 .rw .mk { box-shadow: 0 0 0 1px rgba(255,255,255,.22); }
.sb-race-f1-19 .rw .c { letter-spacing: ${0.5 * S}px; padding-left: ${1 * S}px; }
.sb-race-f1-19 .rw .n { font-weight: 400; color: #ececf0; padding-right: ${4 * S}px; }
.sb-race-f1-19 .rw.me { background: rgba(255,255,255,.16); }
`,
  draw(root, g) {
    const col = el('div', 'col');
    const hd = el('div', 'hd');
    const race = !g.session || g.session === 'Race';
    if (race && g.lap && g.status !== 'pre') hd.append(el('span', 'w', 'LAP'), el('span', 'v', String(g.lap)));
    else hd.append(el('span', 'w', SESSION[g.session] || g.session || 'RACE'), el('span', 'v', g.status === 'final' ? 'FINAL' : ''));
    col.appendChild(hd);
    (g.rows || []).slice(0, ROWS).forEach((r, i) => {
      const rw = el('div', 'rw' + (g.player && g.player.id === r.id ? ' me' : ''));
      rw.style.top = (TOP + i * ROW) + 'px';
      const m = el('i', 'mk'); m.style.background = r.color || '#8a8a96';
      rw.append(el('span', 'p', String(r.pos || i + 1)), m, fit(el('span', 'c', r.code || String(r.short || '').slice(0, 3))), el('span', 'n', r.number ? '#' + r.number : ''));
      col.appendChild(rw);
    });
    root.appendChild(col);
  },
};
