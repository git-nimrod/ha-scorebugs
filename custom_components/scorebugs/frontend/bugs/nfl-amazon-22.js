// "Prime bar '22": after Amazon's Thursday Night Football bug (2022). A
// bar whose ends lean in at the foot: each team's logo on a pale wedge of its colour at the outer end (its record in a small box at the
// wedge's inner foot), its score on a deep panel of its colour, a thin light slanted line, and in the middle a black block: the show's mark
// at the top left (here the Home Assistant logo), the down and distance on a pale band across the top, the quarter and clock under it.
// The play clock beside the clock needs data the sensor lacks.
import { el, logo, statusText, teamPair, panelInk, shade, haMark, marks, scoreSlot, FONTS, GLOSS } from '../kit.js';

// Curves measured on the frame (frame bar 98 px tall, ours 114): the top and bottom edges are straight (level within 2 px over
// the whole bar), but the ends are not: each end leans 35 deg from upright at the top and bends to about 60 deg at the foot (a curve bowing
// 0.05 of the bar's height off the straight line), the foot 0.85 of the bar's height in from the top corner. The lines between the score
// panels and the black middle, and between each logo wedge and its score, lean 17 deg at the top and 23 deg at the foot (bowing 4 px over
// 94; 0.35 of the bar's height across). Each is drawn as a curve with one control point where the measured top and foot directions meet.
// the logo wedges wider and the score panels narrower: each
// wedge 280 px (was 230), each score 160 (was 200), so a wedge is 1.27 times its score panel (was 0.88); the middle 20 px narrower
const W = 1320, H = 120, BH = H - 6, WEDGE = 280, SC = 160, LEAN = 97, SLANT = 40;
const END = 'Q 68 97.5 ';            // the ends' control point (0.60 and 0.855 of the bar's height)
// the light lines and the edges beside them are each one circle arc. Measured on the frame (circle_fit over the left line's 15 points, Bills' panel to the black middle): radius 330 px on a 98 px
// bar, fit within 0.47 px, bowing 3.55 px over its 92 px length (0.039), leaning 14 deg at the top and 27 at the foot, bulging down and
// out. Here: the same 40 px slant over 114 with a bow of 0.039 of the line (4.7 px), radius 394. It was a curve with one control point
// that bowed only 1.5 px, so it read as a straight line with a bend.
const ARC_R = 394;
// an arc to (x, y): 'down' for a line drawn from its top to its foot, false for foot to top; 'lean' 1 for a line leaning like a backslash
// (the left side), -1 like a slash (the right side)
const ARC = (x, y, down, lean) => 'A ' + ARC_R + ' ' + ARC_R + ' 0 0 ' + ((down ? 0 : 1) ^ (lean < 0 ? 1 : 0)) + ' ' + x + ' ' + y;
const BARD = 'M 0 0 H ' + W + ' Q ' + (W - 68) + ' 97.5 ' + (W - LEAN) + ' ' + BH + ' H ' + LEAN + ' ' + END + '0 0 Z';
const BAR = "path('" + BARD + "')";
// a light outline round the bar's outer edges, drawn as the bar's own outline so it follows the curved ends
const OUTLINE = 'url("data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='" + W + "' height='" + BH + "'><path d='" + BARD + "' fill='none' stroke='rgba(255,255,255,.7)' stroke-width='5'/></svg>") + '")';
// the logos shifted out towards their ends: each logo's
// window reaches this far past the wedge's outer end, so the kit centres the logo's focal point that much further out and the bar's end
// cuts it, as the Bills' logo on air
const OUT = 20;

export default {
  id: 'nfl-amazon-22',
  size: { w: W, h: H },
  fonts: [FONTS.figtree],
  css: `
.sb-nfl-amazon-22 { font-family: 'SB Figtree', 'Arial', sans-serif; font-weight: 800; color: #fff; }
/* the whole bar leans in at the foot */
.sb-nfl-amazon-22 .bar { position: absolute; inset: 0 0 6px 0; display: flex; clip-path: ${BAR}; }
/* a shadow on the outside: the bar's own shape, dark, a little below it, with a fainter second step for a soft edge
 (no blur; the old drop shadow was cut away by the bar's own outline and never showed) */
.sb-nfl-amazon-22 .shadow { position: absolute; left: 0; width: ${W}px; top: 4px; height: ${BH}px; background: rgba(0,0,0,.42); clip-path: ${BAR}; }
.sb-nfl-amazon-22 .shadow.s2 { top: 6px; background: rgba(0,0,0,.2); }
.sb-nfl-amazon-22 .bar > .ol { position: absolute; inset: 0; z-index: 3; pointer-events: none; background: ${OUTLINE}; }
/* each wedge lit from its outer end, the light running in from the end's top corner (away) or its top corner on the right (home) across to
 the team's colour (on air the Bills' wedge is near white at
 its outer top corner) */
.sb-nfl-amazon-22 .wd { width: ${WEDGE}px; flex: none; position: relative; overflow: hidden; }
.sb-nfl-amazon-22 .wd .lw { position: absolute; top: 0; bottom: 0; width: ${WEDGE}px; display: grid; place-items: center; overflow: hidden; }
.sb-nfl-amazon-22 .wd.a .lw { left: -${OUT}px; } .sb-nfl-amazon-22 .wd.h .lw { right: -${OUT}px; }
/* the logos much larger: on air the Bills' logo runs 180 of the frame's 1140 px across and the bar's full height,
 cut by the bar's slanted end; here a 290 x 170 box on a 114 px bar, so a round logo is cut a little top and bottom and a wide one by the
 wedge's ends; the kit slides each to its focal point (the middle of its detail) inside what shows */
.sb-nfl-amazon-22 .wd .sb-logo { width: 290px; height: 170px; flex: none; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.4)); }
/* the record rechecked: a small white box at the wedge's inner foot, its corner kept clear of the score panel's
 leaning edge (it was cut by it: the edge runs 13 px further in at the box's top than at the foot) */
.sb-nfl-amazon-22 .rec { position: absolute; z-index: 1; bottom: 10px; padding: 2px 6px; background: linear-gradient(#ffffff, #dfe3e8); color: #1b1f26; font-size: 18px; line-height: 1; border-radius: 2px; }
.sb-nfl-amazon-22 .wd.a .rec { right: 18px; } .sb-nfl-amazon-22 .wd.h .rec { left: 18px; }
.sb-nfl-amazon-22 .sc { position: relative; z-index: 1; width: ${SC + SLANT / 2 + SLANT}px; box-sizing: border-box; flex: none; display: grid; place-items: center; font-size: 84px; line-height: 1; text-shadow: 0 3px 4px rgba(0,0,0,.45); }
/* each score panel runs in over its logo wedge, the line between them a curve leaning like the middle's sides */
.sb-nfl-amazon-22 .sc.a { margin-left: -${SLANT}px; padding: 0 ${SLANT / 2}px 0 ${SLANT}px; clip-path: path('M 0 0 H ${SC + SLANT * 1.5} V ${BH} H ${SLANT} ${ARC(0, 0, false, 1)} Z'); }
.sb-nfl-amazon-22 .sc.h { margin-right: -${SLANT}px; padding: 0 ${SLANT}px 0 ${SLANT / 2}px; clip-path: path('M 0 0 H ${SC + SLANT * 1.5} ${ARC(SC + SLANT / 2, BH, true, -1)} H 0 Z'); }
/* the middle's sides and their thin light lines are curves set per state in draw (the middle's width changes before the game) */
.sb-nfl-amazon-22 .mid { flex: 1; position: relative; z-index: 2; margin: 0 -${SLANT}px; display: grid; grid-template-rows: 1fr 1fr; background: linear-gradient(#24272c, #0b0c0e); clip-path: var(--cut); }
.sb-nfl-amazon-22 .mid::before, .sb-nfl-amazon-22 .mid::after { content: ''; position: absolute; inset: 0; pointer-events: none; }
.sb-nfl-amazon-22 .mid::before { background: var(--tl, rgba(200,225,255,.75)); clip-path: var(--ll); }
.sb-nfl-amazon-22 .mid::after { background: var(--tr, rgba(255,200,200,.75)); clip-path: var(--lr); }
.sb-nfl-amazon-22 .mid .mk { position: absolute; left: 44px; top: 8px; } .sb-nfl-amazon-22 .mid .mk .sb-ha { color: #fff; }
/* the down and distance band as on air: flush with the bar's top, 0.56 of its height
 (frame 55 of 98 px; was 0.47 and set 6 px down), running right to the light line on the right so its right end is that line's curve
 (it stopped 36 px short), its left end leaning 16 deg from upright (frame: 13 px over its 45, top to the left) just after the mark */
/* its words bigger: 50 px, was 40 */
.sb-nfl-amazon-22 .mid { grid-template-rows: 56fr 44fr; }
.sb-nfl-amazon-22 .dnb { margin: 0 0 0 112px; padding-right: ${SLANT}px; display: grid; place-items: center; background: linear-gradient(#f2f6fb, #c9d3df); color: #1a3c94; font-size: 50px; line-height: 1; clip-path: polygon(0 0, 100% 0, 100% 100%, 18px 100%); }
.sb-nfl-amazon-22 .lo { display: flex; align-items: center; justify-content: center; gap: 26px; font-size: 40px; line-height: 1; font-weight: 700; }
.sb-nfl-amazon-22 .lo .q { font-size: 28px; color: #c9ced6; } .sb-nfl-amazon-22 .lo .sb-ord { font-size: .7em; }
.sb-nfl-amazon-22 .mid.off { grid-template-rows: 1fr; } .sb-nfl-amazon-22 .mid.off .lo { padding-left: 70px; font-size: 36px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    // two look-alike teams (red on red) part by one taking its other colour; letters dark on a too-light score panel
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const side = (t, k) => {
      const c = pair[k === 'a' ? 0 : 1];
      const wd = el('div', 'wd ' + k);
      // the wedge: a pale wash of the team colour, lighter towards the outer end
      // the wedge in the team's colour (was a pale wash of it), lit towards the outer end;
      // the score panel a deeper shade of it, so the curve between them still reads
      wd.style.background = 'linear-gradient(' + (k === 'a' ? '115deg' : '245deg') + ', ' + shade(c, 0.62) + ', ' + shade(c, 0.3) + ' 22%, ' + c + ' 52%, ' + shade(c, -0.12) + ')';
      const lw = el('div', 'lw'); lw.appendChild(logo(t, 290)); wd.appendChild(lw);
      if (t.record) wd.appendChild(el('span', 'rec', t.record));
      const sc = scoreSlot(el('div', 'sc ' + k, g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      sc.style.color = panelInk(t, c);
      sc.style.background = GLOSS + ', linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, -0.38) + ', ' + shade(c, -0.18) + ')';
      // before the kick-off there is no score: its panel goes and the middle widens
      if (g.status === 'pre') return [wd];
      return k === 'a' ? [wd, sc] : [sc, wd];
    };
    const mid = el('div', 'mid' + (live && g.football && g.football.short ? '' : ' off'));
    // the middle's width: the bar less the wedges and (once there is a score) the score panels, plus the two slants it runs in under
    const mw = W - 2 * WEDGE - (g.status === 'pre' ? 0 : 2 * (SC + SLANT / 2)) + 2 * SLANT;
    mid.style.setProperty('--cut', "path('M 0 0 H " + mw + ' ' + ARC(mw - SLANT, BH, true, -1) + ' H ' + SLANT + ' ' + ARC(0, 0, false, 1) + " Z')");
    // the lines 7 px wide while they carry the timeouts (4 px otherwise), so the three pieces read
    const lt = live && g.football ? 7 : 4;
    mid.style.setProperty('--ll', "path('M 0 0 " + ARC(SLANT, BH, true, 1) + ' H ' + (SLANT + lt) + ' ' + ARC(lt, 0, false, 1) + " Z')");
    mid.style.setProperty('--lr', "path('M " + mw + ' 0 ' + ARC(mw - SLANT, BH, true, -1) + ' H ' + (mw - SLANT - lt) + ' ' + ARC(mw - lt, 0, false, -1) + " Z')");
    // the thin light lines either side of the middle carry the timeouts: during play each line is three pieces with a small gap between them, a used one dim
    if (live && g.football) {
      const tl = (n, col) => {
        const u = (i) => (n != null && i >= n ? 'rgba(255,255,255,.16)' : col);
        return 'linear-gradient(' + u(2) + ' 0 31%, transparent 31% 34.5%, ' + u(1) + ' 34.5% 65.5%, transparent 65.5% 69%, ' + u(0) + ' 69%)';
      };
      mid.style.setProperty('--tl', tl(g.away.timeouts, 'rgba(200,225,255,.85)'));
      mid.style.setProperty('--tr', tl(g.home.timeouts, 'rgba(255,200,200,.85)'));
    }
    const mk = el('span', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(52)); mid.appendChild(mk);
    const lo = el('div', 'lo');
    if (live) {
      if (g.football && g.football.short) mid.appendChild(el('div', 'dnb', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal')));
      const q = el('span', 'q'); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase()));
      lo.append(q, el('span', '', g.clock || ''));
    } else lo.appendChild(el('span', '', statusText(g, time)));
    mid.appendChild(lo);
    bar.append(...side(g.away, 'a'), mid, ...side(g.home, 'h'));
    // the outline first in the bar: it lies on top by its z-index, and drawn last it counted as covering both scores, so a three-figure
    // score was cut to a third of its size
    bar.prepend(el('i', 'ol'));
    root.append(el('i', 'shadow s2'), el('i', 'shadow'), bar);
  },
};
