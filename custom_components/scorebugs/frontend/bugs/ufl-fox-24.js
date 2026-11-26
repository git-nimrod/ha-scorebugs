// "Mesh panels '24": after the spring league's own bug, 2024-26 (frames: San Antonio v St. Louis, the 2024 conference final on FOX,
// 3rd 3:14, 2ND DOWN, and the same teams in 2025, 3rd 10:49; Memphis v Birmingham on ESPN 2025, 2nd & 10; Louisville v St. Louis on FOX
// 2026, 4th & 4: one look over three years and both networks). Two team panels side by side, each in its team's colour: a bright rim
// round a darker inside laid with a fine dot mesh, the logo at the outer end, the code in heavy capitals over the record, the big score at
// the inner end with a white dot before it for the team with the ball. Outside each panel a dark strip holds three white timeout bars and
// a small red-orange square. Under them a near-black row: the quarter and the clock on the left, the down and distance on the right in
// heavy italic (the quarter and clock alone are centred when there is no down).
// Measured on the 1080p frames (stage px = 2x frame px): everything leans 8 deg ("/"); panels 73 tall, 296 wide, 4 apart;
// rims 5; the row 44 tall, 8 below the panels; timeout bars 13 tall, 4 apart, then a 10 px square; the mesh a 4 px dot grid. Sampled
// (sample.py): St. Louis's rim #0510b5 (the listed navy #002677 made vivid), its inside #0d194f at the top to #1c287e at the foot (L
// 14 -> 20); the row #0f1a17 at the top to black at the foot. Letters: code cap 27, record 18, score 43, row 28 (italic).
// The play clock (yellow, in a darker box under the gap) is left out: the sensor has no play clock. The 2024 down reads "2ND DOWN", 2025-26
// "2nd & 10": the later form is used. Type checked with compare.py: codes and scores Saira 800 at 88 % width, the row Saira Italic 700
// leaning 8 deg like the frame (the face's own 12 less 4).
import { el, logo, statusText, teamColor, relight, shade, fit, scoreSlot, dots, FONTS } from '../kit.js';

const S = 2, STRIP = 14 * S, PANEL = 296 * S, GAP = 4 * S, TOP = 73 * S, VGAP = 8 * S, ROW = 44 * S, LEAN = 8;
const PRE_CUT = 70 * S;   // before the game there is no score: each panel closes up by the score's room
const IN = STRIP * 2 + PANEL * 2 + GAP, OVER = Math.ceil(((TOP + VGAP + ROW) / 2) * Math.tan((LEAN * Math.PI) / 180)) + 2;
const W = IN + 2 * OVER, H = TOP + VGAP + ROW;

// a team's rim colour: its own hue, made vivid the way the package draws it (St. Louis's navy #002677 reads #0510b5 on air)
function vivid(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return hex;
  let [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d < 0.08) return relight(hex, 6);   // a grey team stays grey, a touch lighter
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  const s2 = Math.min(1, Math.max(0.85, d / (1 - Math.abs(2 * l - 1)))), l2 = Math.min(0.5, Math.max(0.33, l));
  const c = (1 - Math.abs(2 * l2 - 1)) * s2, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m0 = l2 - c / 2;
  [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map((v) => Math.round((v + m0) * 255).toString(16).padStart(2, '0')).join('');
}

export default {
  id: 'ufl-fox-24',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * PRE_CUT : W, h: H }),
  fonts: [FONTS.saira, FONTS.sairaItalic],
  css: `
.sb-ufl-fox-24 { font-family: 'SB Saira', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 88%; color: #f2f5f5; }
.sb-ufl-fox-24 .lean { position: absolute; left: ${OVER}px; top: 0; right: ${OVER}px; height: ${H}px; transform: skewX(-${LEAN}deg); }
.sb-ufl-fox-24 .blk { position: absolute; top: 0; height: ${TOP}px; display: flex; }
.sb-ufl-fox-24 .blk.h { flex-direction: row-reverse; }
/* the dark strip outside each panel: three white timeout bars and the red-orange square under them (they lean with the panel) */
.sb-ufl-fox-24 .strip { width: ${STRIP}px; flex: none; background: rgba(14,16,16,.86); display: flex; flex-direction: column; align-items: center; padding-top: ${7 * S}px; gap: ${4 * S}px; box-sizing: border-box; }
.sb-ufl-fox-24 .strip i { width: ${8 * S}px; height: ${13 * S}px; background: linear-gradient(#ffffff, #d4dad8); border-radius: 1px; }
.sb-ufl-fox-24 .strip i.used { opacity: .16; }
.sb-ufl-fox-24 .strip b { width: ${8 * S}px; height: ${9 * S}px; margin-top: ${1 * S}px; background: #e4502c; box-shadow: inset 0 0 0 2px rgba(120,20,10,.55); }
/* the panel: a 5 px rim in the team's vivid colour round a darker inside laid with a 4 px dot mesh, lighter towards the foot */
/* as the
 slanted NFL bugs do (Medallion '22's logo slot), the logo is drawn larger than its slot at the panel's outer end and the slanted panel
 cuts it; the kit slides it so its focal point sits in what shows; the rim is laid over it (the logo tucks under the rim). The logo
 runs 0.95 of the panel's height (on air 0.80-0.85 inside the rim; drawn a size up so the cut lands on the artwork, not on its margin).
 The code and record sit as one block inside the rim, record foot 6 px clear of the rim (it ran 8 px past the panel). */
.sb-ufl-fox-24 .pn { position: relative; flex: 1; min-width: 0; overflow: hidden; box-shadow: 0 0 0 2px rgba(0,0,0,.55), 0 3px 8px rgba(0,0,0,.4); }
.sb-ufl-fox-24 .pn::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 0 ${5 * S}px var(--rim); pointer-events: none; z-index: 2; }
.sb-ufl-fox-24 .pn > * { position: absolute; transform: skewX(${LEAN}deg); }
.sb-ufl-fox-24 .lg { top: ${-4 * S}px; width: ${104 * S}px; height: ${77 * S}px; display: grid; place-items: center; z-index: 1; }
.sb-ufl-fox-24 .lg .sb-logo { width: ${130 * S}px; height: ${85 * S}px; flex: none; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); }
.sb-ufl-fox-24 .a .lg .sb-logo { margin-left: ${-22 * S}px; } .sb-ufl-fox-24 .h .lg .sb-logo { margin-right: ${-22 * S}px; }   /* loop pass 2: 130 x 85, 8 px further out */
.sb-ufl-fox-24 .id { top: ${9 * S}px; width: ${84 * S}px; display: grid; justify-items: center; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); z-index: 1; }
.sb-ufl-fox-24 .ab { font-size: ${37 * S}px; white-space: nowrap; max-width: ${84 * S}px; overflow: hidden; line-height: .92; }
.sb-ufl-fox-24 .rc { font-size: ${23 * S}px; font-weight: 600; margin-top: ${1 * S}px; white-space: nowrap; line-height: 1; max-width: ${84 * S}px; overflow: hidden; }
.sb-ufl-fox-24 .sc { top: ${9 * S}px; height: ${55 * S}px; display: grid; place-items: center end; font-size: ${61 * S}px; font-weight: 900; font-stretch: 100%; line-height: 1; text-shadow: 0 3px 3px rgba(0,0,0,.6); min-width: 0 !important; }
.sb-ufl-fox-24 .h .sc { justify-items: start; }
.sb-ufl-fox-24 .dot { top: ${33 * S}px; width: ${10 * S}px; height: ${10 * S}px; border-radius: 50%; background: #f2f5f5; box-shadow: 0 2px 2px rgba(0,0,0,.5); }
/* the row: near black, a touch lighter at its top; heavy italic letters, the suffix in small capitals */
.sb-ufl-fox-24 .row { position: absolute; top: ${TOP + VGAP}px; left: 0; right: 0; height: ${ROW}px; background: linear-gradient(#111c19, #07110e 40%, #000302 75%, #000000); box-shadow: 0 0 0 2px rgba(0,0,0,.5), 0 3px 8px rgba(0,0,0,.4);
  font-family: 'SB Saira Italic', 'SB Saira', sans-serif; font-style: italic; font-weight: 700; font-stretch: 96%; font-size: ${40 * S}px; color: #e6eaea; line-height: 1; }
/* measured places along the row (centres): quarter 11 %, clock 30 %, down 78 %; with no down, quarter 37 % and clock 59 % (2025 frame) */
.sb-ufl-fox-24 .row > * { position: absolute; top: 0; height: ${ROW}px; display: flex; align-items: center; justify-content: center; transform: translateX(-50%) skewX(${LEAN + 4}deg); white-space: nowrap; }
.sb-ufl-fox-24 .row .w { left: 50%; font-size: ${30 * S}px; }
.sb-ufl-fox-24 .row .q { font-size: .82em; }
.sb-ufl-fox-24 .row small { font-size: 1em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const P = PANEL - (pre ? PRE_CUT : 0);
    const lean = el('div', 'lean');
    [[g.away, 'a', 0], [g.home, 'h', STRIP + P + GAP]].forEach(([t, k, x]) => {
      const c = teamColor(t, '#3a4448'), rim = vivid(c);
      const blk = el('div', 'blk ' + k); blk.style.left = x + 'px'; blk.style.width = STRIP + P + 'px';
      const strip = el('div', 'strip');
      if (live && t.timeouts != null) { for (let i = 0; i < 3; i++) strip.appendChild(el('i', i >= t.timeouts ? 'used' : '')); strip.appendChild(el('b', '')); }
      const pn = el('div', 'pn');
      pn.style.setProperty('--rim', rim);
      const m = dots(4 * S, '#ffffff', 0.12);
      // the inside: the team's colour a little darker at the top, lighter at the foot (sampled L 14 -> 20 on a navy of L 18)
      pn.style.background = m.image + ', linear-gradient(' + relight(c, -9) + ', ' + relight(c, -6) + ' 45%, ' + relight(c, 0) + ')';
      pn.style.backgroundSize = m.size + ', auto';
      const out = k === 'a' ? 'left' : 'right', inn = k === 'a' ? 'right' : 'left';
      const lg = el('div', 'lg'); lg.style[out] = 0; lg.appendChild(logo(t, 85 * S)); pn.appendChild(lg);
      const id = el('div', 'id'); id.style[out] = 100 * S + 'px';
      id.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), fit(el('span', 'rc', t.record || '')));
      pn.appendChild(id);
      if (!pre) {
        const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g); sc.style[inn] = 20 * S + 'px'; pn.appendChild(sc);
        if (live && t.hasBall) { const d = el('i', 'dot'); d.style[inn] = 98 * S + 'px'; pn.appendChild(d); }
      }
      blk.append(strip, pn);
      lean.appendChild(blk);
    });
    const row = el('div', 'row');
    const q = () => { const s = el('span', 'q'); s.append(document.createTextNode(g.period.label || ''), el('small', '', g.period.word ? '' : g.period.suffix || '')); return s; };
    if (live) {
      const dn = g.football && g.football.short ? g.football.short.replace(/^(\d)(ST|ND|RD|TH)/, (a, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '';
      const at = (n, x) => { n.style.left = x + '%'; row.appendChild(n); };
      const qn = el('div', ''); qn.appendChild(q()); at(qn, dn ? 11 : 37);
      at(el('div', '', g.clock || ''), dn ? 30 : 59);
      if (dn) at(el('div', '', dn), 78);
    } else row.appendChild(el('div', 'w', statusText(g, time)));
    lean.appendChild(row);
    root.appendChild(lean);
  },
};
