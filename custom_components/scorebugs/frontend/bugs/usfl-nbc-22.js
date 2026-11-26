// "Slant blocks '22": after the 2022 spring league's bar on NBC and USA (frames: Houston v Michigan, 2nd 12:59, 2nd Down; the same game at
// 2nd 0:40, 4th & Goal, and at 3rd 0:32 with a yellow flag). One thin bar at the foot of the picture, every part a block leaning 12 deg
// and set off from the next by a thin silver line: a light silver plate with the network's mark (the Home Assistant mark here), then for
// each team a block with its logo cut by the block's edges over a dark tint of its colour, a block in its colour with its code in white
// capitals, and a darker block with its score; then a charcoal block with the quarter and the clock, and the down and distance on a block
// in the colour of the team with the ball (charcoal when no one has it). A thin silver line along the top and the foot of the bar.
// Measured on the 720p frame (stage px = frame px x 1.5): the bar 50 tall between 2 px silver lines (3 at the foot); blocks
// lean 12 deg; widths: mark 150, logo 138, code 135, score 80 (home 93), clock 292, down 285. Sampled (sample.py): the silver plate
// #e6e7e2 at the top to #5b6063 behind the mark and #f5fafe at the foot; the code blocks a touch lighter at the top (#353a33 -> #2d322b);
// Michigan's down block #732e40 -> #5b1f27; the clock #383641 -> #272a31. Letters: codes and scores cap 23, clock 24, down 22.
// Left out (no data): the play clock (":27" in its own block) and the yellow flag state; the bar closes up where they were.
import { el, logo, haMark, statusText, teamColor, relight, fit, scoreSlot, FONTS } from '../kit.js';

// every block takes the glass
// measured on the 4th & Goal still with sample.py --grid (code, score and clock blocks alike: lit +6..+12 L at the top under a light
// line, +5..+9 L, a horizon about 44 % down, the foot -6 L); the silver lines along the top and the foot are thicker (4 and 5 px, were
// 2 and 3) and banded like metal: bright edge, darker underside, the light changing along the bar (the still's top line changes 33 L
// along its length), and the thin lines between the blocks take the same metal.
const H = 66, CORE = 50, LEAN = 12, MK = 150, LOGO = 138, CODE = 135, SCA = 80, SCH = 93, CLK = 292, DN = 285;
const OVER = Math.ceil((H / 2) * Math.tan((LEAN * Math.PI) / 180)) + 2;
const GAP = 3, W = 2 * OVER + MK + 2 * (LOGO + CODE) + SCA + SCH + CLK + DN + 8 * GAP;

export default {
  id: 'usfl-nbc-22',
  size: { w: W, h: H },
  sizeFor: (g) => {
    const live = g.status === 'live', dn = live && g.football && g.football.short;
    return { w: W - (dn ? 0 : DN + GAP), h: H };
  },
  fonts: [FONTS.interTight],
  css: `
.sb-usfl-nbc-22 { font-family: 'SB Inter Tight', Arial, sans-serif; font-weight: 700; color: #f4f2f2; }
.sb-usfl-nbc-22 .lean { position: absolute; left: ${OVER}px; right: ${OVER}px; top: 0; height: ${H}px; transform: skewX(-${LEAN}deg); display: flex;
  background: linear-gradient(90deg, rgba(255,255,255,.28), rgba(255,255,255,0) 22%, rgba(255,255,255,.18) 55%, rgba(0,0,0,.12) 80%, rgba(255,255,255,.2)),
    linear-gradient(#f6f8f9, #dfe3e6 1.5px, #b9bfc4 3px, #7e858b 5.5px, #aab0b5 50%, #5f666c calc(100% - 7.5px), #a3aaaf calc(100% - 5px), #eef1f3 calc(100% - 2px), #8f969c);   /* a thicker metal frame: bright edge, dark underside, a lit inner lip */
  box-shadow: 0 2px 5px rgba(0,0,0,.45); padding: 7px 0 8px; box-sizing: border-box; gap: ${GAP}px; }
.sb-usfl-nbc-22 .lean > * { position: relative; flex: none; height: ${CORE + 1}px; overflow: hidden; display: grid; place-items: center; }
.sb-usfl-nbc-22 .lean > * > * { transform: skewX(${LEAN}deg); }
/* the network's plate: light silver, darker behind the mark, near white at its foot */
.sb-usfl-nbc-22 .mk { width: ${MK}px; background: linear-gradient(#ffffff, #eef0ee 8%, #d6d9db 42%, #c0c5c9 46%, #b7bcc0 70%, #f5fafe); color: #3a3d42; }
/* the logo big enough that the block's edges cut it a little, as on air */
.sb-usfl-nbc-22 .lg .sb-logo { width: ${LOGO - 10}px; height: ${CORE * 1.35}px; object-fit: contain; }
.sb-usfl-nbc-22 .ab { font-size: ${29 / 0.73}px; line-height: 1; white-space: nowrap; padding: 0 12px; }
.sb-usfl-nbc-22 .sc { font-size: ${31 / 0.73}px; line-height: 1; min-width: 0 !important; width: 100%; text-align: center; white-space: nowrap; }
.sb-usfl-nbc-22 .clk { width: ${CLK}px; background: linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,0) 2px), linear-gradient(#41444f, #363944 42%, #2a2d35 46%, #1f2229); }
.sb-usfl-nbc-22 .clk > span { display: flex; gap: 26px; font-size: ${27 / 0.73}px; line-height: 1; white-space: nowrap; }
.sb-usfl-nbc-22 .clk .w { font-size: ${20 / 0.73}px; }
.sb-usfl-nbc-22 .dn { width: ${DN}px; font-size: ${22 / 0.73}px; font-weight: 600; line-height: 1; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const lean = el('div', 'lean');
    const mk = el('div', 'mk'); mk.appendChild(haMark(42)); lean.appendChild(mk);
    // glass on every block: lit at the top, a horizon at 44 %, a deeper foot, and a light line along its top edge (sample.py on the still)
    const fill = (c, d) => 'linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,0) 2px), linear-gradient(' + relight(c, d + 12) + ', ' + relight(c, d + 6) + ' 42%, ' + relight(c, d - 1) + ' 46%, ' + relight(c, d - 7) + ')';
    [[g.away, SCA], [g.home, SCH]].forEach(([t, w]) => {
      const c = teamColor(t, '#3a3f47');
      const lg = el('div', 'lg'); lg.style.width = LOGO + 'px'; lg.style.background = fill(c, -8); lg.appendChild(logo(t, LOGO)); lean.appendChild(lg);
      const ab = el('div', 'ab'); ab.style.width = CODE + 'px'; ab.style.background = fill(c, 0); ab.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase()))); lean.appendChild(ab);
      // before the game the score blocks stay empty and the kit puts each team's record there
      { const sc = el('div', 'scb'); sc.style.width = w + 'px'; sc.style.background = fill(c, -16); sc.appendChild(scoreSlot(el('span', 'sc', !pre && t.score != null ? String(t.score) : ''), g)); lean.appendChild(sc); }
    });
    const clk = el('div', 'clk');
    if (live) { const s = el('span', ''); s.append(el('span', '', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toLowerCase())), el('span', '', g.clock || '')); clk.appendChild(s); }
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    lean.appendChild(clk);
    const dn = live && g.football && g.football.short ? g.football.short.replace(/^(\d)(ST|ND|RD|TH)/, (a, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '';
    if (dn) {
      const who = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null;
      const b = el('div', 'dn'); b.style.background = fill(who ? teamColor(who, '#2d3037') : '#2d3037', who ? -6 : 0);
      b.appendChild(el('span', '', dn)); lean.appendChild(b);
    }
    root.appendChild(lean);
  },
};
