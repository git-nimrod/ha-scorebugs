// "Split bar '24": after the NFL Christmas games on Netflix (2024-25; frame: Chiefs at Steelers). Rebuilt to the frame's
// construction (then: "the top is straight and the bottom is concaving into it with the edges being
// longer"): two team halves with a straight top edge whose bottom edge curves up towards the middle, so the outer ends are the tallest; each half in its team's colour with the letters over the record near the outer end and a big
// score near the middle; at each outer end the team's logo whole on a white disc with a silver ring, bigger than the bar; in the middle a
// silver dome rising over the bar with the play-clock disc's white face (no play clock in the data, so it carries the network's place:
// the Home Assistant logo). A football beside the score of the team with the ball; three timeout bars stand upright inside each disc's
// edge. Over the dome, the down and distance on a tab in the colour of the team with the ball, chevrons pointing the way it is going;
// under the middle a dark tab with the quarter and the clock (before the game: the start time; after: FINAL).
import { el, logo, ordinal, statusText, teamColor, teamPair, shade, haMark, marks, teamInk, inkOn, scoreSlot, FONTS, GLOSS } from '../kit.js';

// The bottom edge measured on the full frame: it is one circle arc from end to end, centred under the middle (radius 1821
// px on a 982 px bar: 1.86 times the bar's width, fit within 2.2 px over both halves), so it is flat at the middle and steepest at the
// ends (about 15 deg there, 8 deg a third of the way in), the ends' foot 64 px lower than the middle's (0.065 of the width); the top
// edge straight. The bar 0.13 of its width tall at the ends, as on air. (Before, the foot ran flat across the outer third and curved
// up only near the middle: the opposite bend.)
// Checked against the full frame: the arc's bend was right but the whole bar too thin (0.127 of its width at the ends, on air
// 0.15; 0.07 at the middle, on air 0.075 where the clock tab meets it), so the bar is 170 tall at the ends and 86 at the middle. The
// silver piece in the middle does not rise over the bar: it is a slice of a circle standing on the clock tab, its top level with the bar's
// top, narrower there (0.077 of the bar's width) and widening down curved sides to 0.113 where it meets the tab; the bar's two feet
// curve up into its foot, so the piece, the bar and the tab meet in one line. The clock tab 0.34 of the bar's width and 0.054 tall; the down tab
// over the bar 0.047 of its width tall (54 px, was 60 over a dome).
const UP = 56, LOW_UP = 4, W = 1140, BAR = 170, DISC = 172, DOME = 130, DOME_TOP = 88, DOME_R = 190, TAB_W = 384, TAB_H = 60, RISE = 84;   // RISE: how much the bottom edge climbs from the ends to the middle
// measured on his full frame (bar 990 px there, ours 1140: x1.15): the rim round the bar 4.0 px light over a banded grey (0.027 of
// the end height; ours 5 px), its lightness changing 83 L along the end and from silver on top to grey at the foot; the down tab's top edge
// bows up 3 px over its 300 (ours 4 over 380), its outline 3.2-3.5 px, its foot on the bar's top rim; the clock tab's outline 3.9 px light
// grey, its sides bowing out a little as they slant in (28 px over its 53 px height, ours 30 over 61), its top under the bar's foot. The logos
// 0.13 of the bar's width and 0.65-0.8 of its end height (KC 138 x 97, PIT's disc 116 across): ours 150 x 126 tiles holding 134 x 110 logos.
// : giant as on air: at our scale KC is 159 x 112 and the Steelers' disc 133 across, ours drew 134 x 89 and 110
// (16-17 % small), so the tiles are 172 x 140 holding 158 x 124 logos (the letters start that much further in).
const RIM = 5, TUCK = 30, DD_BOW = 4, TAB_SLANT = 30;
const H = UP + BAR + 8;   // the bar's outer ends are its tallest part; the clock tab hangs under the thin middle
const PRE_CUT = 90;   // the score's room in each half, left out before the kick-off
const ABBR_PX = 46, REC_PX = 22, SCORE_PX = 66, CLOCK_PX = 34;

// the clock tab's outline: a straight top, each side bowing out a little as it slants in by s, rounded foot corners r
const tabPath = (w, h, s, r) => 'M 0 0 H ' + w + ' Q ' + (w - s * 0.2) + ' ' + h * 0.55 + ' ' + (w - s) + ' ' + (h - r) + ' Q ' + (w - s - 1) + ' ' + h + ' ' + (w - s - r) + ' ' + h
  + ' H ' + (s + r) + ' Q ' + (s + 1) + ' ' + h + ' ' + s + ' ' + (h - r) + ' Q ' + s * 0.2 + ' ' + h * 0.55 + ' 0 0 Z';

const hasDown = (g) => !!(g.status === 'live' && g.football && g.football.short);

// the fine grain over the team panels on air: two faint offset speckle grids, no filters
const GRAIN = 'radial-gradient(rgba(255,255,255,.08) 30%, transparent 34%) 0 0 / 3px 3px, radial-gradient(rgba(0,0,0,.12) 30%, transparent 34%) 1px 2px / 5px 5px';

export default {
  id: 'nfl-netflix-24',
  sizedFor: 0.7275,   // sizes were measured in SB Inter Tight; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: both halves close up on the middle, so the bar is shorter; the down tab
  // over the dome only while a down is on, otherwise only the dome's own room above the bar (no empty band)
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * PRE_CUT : W, h: hasDown(g) ? H : H - UP + LOW_UP }),
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-nfl-netflix-24 { font-family: 'SB Barlow Semi Condensed', 'Arial Black', sans-serif; font-weight: 800; color: #fff; --up: ${UP}px; }
/* face: Netflix Christmas 2024: Barlow Semi Condensed Bold */
/* the two halves: each tilted down towards its outer end about the middle, so together they make a low arch, as on air */
.sb-nfl-netflix-24 .tm { position: absolute; top: var(--up); height: ${BAR}px; width: calc(50% - ${DISC / 2}px); display: grid; align-items: center; box-sizing: border-box;
  padding-bottom: ${RISE}px; }   /* the text sits in the part every column has (the curve takes the foot) */
.sb-nfl-netflix-24 .tm.a { left: 0; width: 50%; grid-template-columns: 1fr auto; padding: 0 ${DOME / 2 + 40}px ${RISE}px ${DISC + 72}px; }
.sb-nfl-netflix-24 .tm.h { right: 0; width: 50%; grid-template-columns: auto 1fr; padding: 0 ${DISC + 72}px ${RISE}px ${DOME / 2 + 40}px; }
/* a thin light frame round the whole shape, as on air */
.sb-nfl-netflix-24 .arch { position: absolute; inset: 0; filter: drop-shadow(0 3px 6px rgba(0,0,0,.45)); }
/* the metal rim: a slightly bigger copy of each half behind it, banded silver (a light top line, grey middle, a lit foot) with a sheen across
 that lights the ends and darkens the middle, so the rim changes along every side as on air */
.sb-nfl-netflix-24 .rim { position: absolute; top: calc(var(--up) - ${RIM}px); height: ${BAR + 2 * RIM}px; width: calc(50% + ${RIM}px);
  background: linear-gradient(90deg, rgba(255,255,255,.4), rgba(255,255,255,0) 20%, rgba(0,0,0,.25) 50%, rgba(255,255,255,0) 80%, rgba(255,255,255,.35)),
    linear-gradient(#f4f6f8, #d5d9de 3%, #9aa0a7 30%, #7d838a 55%, #b9bec4 92%, #e6e9ec 97%, #80868d); }
.sb-nfl-netflix-24 .rim.a { left: -${RIM}px; } .sb-nfl-netflix-24 .rim.h { right: -${RIM}px; }
/* the same metal drawn once more IN FRONT of the logos, only as the border (a ring: the rim's shape with the half cut out, plus the end strip), so the
 logos sit behind the borders */
.sb-nfl-netflix-24 .rim.fr { z-index: 3; pointer-events: none; }
.sb-nfl-netflix-24 .id { display: grid; justify-items: start; } .sb-nfl-netflix-24 .tm.h .id { justify-items: end; }
.sb-nfl-netflix-24 .ab { font-size: ${ABBR_PX}px; line-height: 1; letter-spacing: .5px; }
.sb-nfl-netflix-24 .rec { font-size: ${REC_PX}px; font-weight: 600; line-height: 1.1; opacity: .92; }
.sb-nfl-netflix-24 .sc { position: relative; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nfl-netflix-24 .ball { position: absolute; top: 50%; width: 38px; height: 22px; margin-top: -11px; border-radius: 50%; box-shadow: 0 0 0 2px rgba(0,0,0,.35); z-index: 3;
  background: linear-gradient(90deg, transparent 22%, #8d939b 22% 26%, transparent 26% 74%, #8d939b 74% 78%, transparent 78%), linear-gradient(transparent 44%, #8d939b 44% 56%, transparent 56%), #fff; }   /* a white football with grey laces */
.sb-nfl-netflix-24 .tm.a .ball { right: -48px; } .sb-nfl-netflix-24 .tm.h .ball { left: -48px; }
/* the logos whole on white discs at the outer ends, bigger than the bar, dropped with the halves' ends */
.sb-nfl-netflix-24 .ds { position: absolute; top: calc(var(--up) - 6px); width: ${DISC + 20}px; height: ${BAR - 22}px; z-index: 2; display: grid; place-items: center; }
/* no tile: the logo itself, big, at the bar's outer end; depth from a tight dark edge under a long soft drop (the existing drop-shadow recipe) */
.sb-nfl-netflix-24 .ds.a { left: 42px; } .sb-nfl-netflix-24 .ds.h { right: 42px; }
.sb-nfl-netflix-24 .ds .sb-logo { width: 198px; height: 152px; object-fit: contain; filter: drop-shadow(0 2px 1px rgba(0,0,0,.65)) drop-shadow(3px 7px 4px rgba(0,0,0,.5)); }
/* the timeouts upright bars at the bar's very outer edge, just inside the rim, as tall as on air (they were 20 px, a third of that, and read as stubs), and a
 used one gone, the ones left at the foot (on air the Chiefs' last timeout is the lowest bar, the two above it empty) */
.sb-nfl-netflix-24 .to { position: absolute; top: -4px; display: grid; gap: 8px; } .sb-nfl-netflix-24 .ds.a .to { left: -30px; } .sb-nfl-netflix-24 .ds.h .to { right: -30px; }
.sb-nfl-netflix-24 .to i { width: 6px; height: 44px; border-radius: 1px; background: #f4f4f4; box-shadow: 0 0 0 1px rgba(0,0,0,.35); } .sb-nfl-netflix-24 .to i.used { opacity: 0; }   /* white on air */
/* the silver piece in the middle: from the bar's top to the clock tab, its sides arcs of a circle (radius ${DOME_R}) bowing out, wider at the foot */
.sb-nfl-netflix-24 .dome { position: absolute; left: calc(50% - ${DOME / 2}px); top: var(--up); width: ${DOME}px; height: ${BAR - RISE}px; z-index: 2;
  clip-path: path('M ${(DOME - DOME_TOP) / 2} 0 H ${(DOME + DOME_TOP) / 2} A ${DOME_R} ${DOME_R} 0 0 1 ${DOME} ${BAR - RISE} H 0 A ${DOME_R} ${DOME_R} 0 0 1 ${(DOME - DOME_TOP) / 2} 0 Z');
  background: linear-gradient(#ffffff, #e6e8eb 55%, #c3c7cc); display: grid; place-items: center; }
.sb-nfl-netflix-24 .disc { width: 70px; height: 70px; border-radius: 50%; background: #fbfbfb; box-sizing: border-box; border: 4px solid #9a9ea3;
  box-shadow: inset 0 0 0 3px #fff, inset 0 0 0 5px #c4c7cb, 0 2px 3px rgba(0,0,0,.3); display: grid; place-items: center; }
.sb-nfl-netflix-24 .disc .sb-ha { color: #c8102e; }
/* the down tab: its top edge one shallow arc bowing up, a silver outline, its foot on the bar's top rim */
.sb-nfl-netflix-24 .ddo { position: absolute; left: calc(50% - 194px); width: 388px; top: 0; height: ${UP}px;
  clip-path: path('M 0 ${UP} L 20 ${DD_BOW} Q 194 ${-DD_BOW} 368 ${DD_BOW} L 388 ${UP} Z'); background: linear-gradient(#eef0f2, #b7bcc2 45%, #8a9097); }
.sb-nfl-netflix-24 .dd { position: absolute; left: 4px; top: 4px; width: 380px; height: ${UP - 4}px; padding-bottom: 4px; box-sizing: border-box;
  clip-path: path('M 0 ${UP - 4} L 19 ${DD_BOW} Q 190 ${-DD_BOW + 1} 361 ${DD_BOW} L 380 ${UP - 4} Z');
  display: flex; align-items: center; justify-content: center; gap: 26px; font-size: 38px; letter-spacing: .5px; }
.sb-nfl-netflix-24 .dd .o { font-size: .62em; vertical-align: .05em; margin: 0 6px 0 1px; }
.sb-nfl-netflix-24 .ch { display: flex; gap: 10px; } .sb-nfl-netflix-24 .ch i { width: 14px; height: 14px; border: solid currentColor; border-width: 5px 5px 0 0; transform: rotate(45deg); }
.sb-nfl-netflix-24 .ch.l i { transform: rotate(-135deg); }
/* the clock tab tucked under the bar's foot (its top ${TUCK} px behind it), its sides bowing out a little as they slant in, rounded foot
 corners, a light outline round it */
.sb-nfl-netflix-24 .tabo { position: absolute; left: calc(50% - ${TAB_W / 2 + 4}px); top: calc(var(--up) + ${BAR - RISE - TUCK}px); width: ${TAB_W + 8}px; height: ${TAB_H + TUCK + 4}px;
  clip-path: path('${tabPath(TAB_W + 8, TAB_H + TUCK + 4, TAB_SLANT + 1, 10)}'); background: linear-gradient(#f4f6f8, #d6dade 60%, #aab0b6); }
.sb-nfl-netflix-24 .tab { position: absolute; left: 4px; top: 0; width: ${TAB_W}px; height: ${TAB_H + TUCK}px; padding-top: ${TUCK}px; box-sizing: border-box;
  clip-path: path('${tabPath(TAB_W, TAB_H + TUCK, TAB_SLANT, 8)}');
  background: ${GLOSS}, linear-gradient(#323848, #1b1f29); display: flex; align-items: center; justify-content: center; gap: 22px; font-size: ${CLOCK_PX}px; }
.sb-nfl-netflix-24 .tab .w { font-size: ${CLOCK_PX * 0.82}px; }
.sb-nfl-netflix-24 .sb-ord { font-size: .62em; vertical-align: .55em; }
`,
  draw(root, g, { time, opts }) {
    if (!hasDown(g)) root.style.setProperty('--up', LOW_UP + 'px');
    const live = g.status === 'live';
    const disc = (t, k) => {
      const d = el('div', 'ds ' + k);
      d.appendChild(logo(t, 88));
      if (live && t.timeouts != null) { const to = el('span', 'to'); for (let i = 0; i < 3; i++) to.appendChild(el('i', i < 3 - t.timeouts ? 'used' : '')); d.appendChild(to); }
      return d;
    };
    // two look-alike teams (red on red) part by one taking its other colour
    const pair = teamPair(g.away, g.home, '#3a3f47'), rims = [], frames = [];
    const half = (t, k) => {
      const c = pair[k === 'a' ? 0 : 1];
      const h = el('div', 'tm ' + k);
      // the straight top, the bottom one circle arc rising from the ends to the middle (then: "look at the angle of the arc"); u runs from the outer end (0, full height) to the middle (1, RISE shorter)
      // one circle under the middle: its radius set so the ends' foot is RISE lower than the middle's at this state's width
      const wa = g.status === 'pre' ? W - 2 * PRE_CUT : W, R = ((wa / 2) ** 2 + RISE ** 2) / (2 * RISE);
      const foot = []; for (let i = 0; i <= 24; i++) { const u = i / 24, dx = (1 - u) * wa / 2, y = BAR - RISE + (R - Math.sqrt(R * R - dx * dx)); foot.push({ x: k === 'a' ? u : 1 - u, y }); }
      foot.sort((p, q) => q.x - p.x);   // right to left along the foot
      h.style.clipPath = 'polygon(0 0, 100% 0, ' + foot.map((p) => (p.x * 100).toFixed(1) + '% ' + p.y.toFixed(1) + 'px').join(', ') + ')';
      // its metal rim: the same outline grown by RIM px (the outer end out, the foot down), behind the half
      const w = wa / 2, rim = el('i', 'rim ' + k);
      const rx = (p) => (k === 'a' ? (p.x === 0 ? 0 : p.x * w + RIM) : (p.x === 1 ? w + RIM : p.x * w));
      rim.style.clipPath = 'polygon(0 0, 100% 0, ' + foot.map((p) => rx(p).toFixed(1) + 'px ' + (p.y + 2 * RIM).toFixed(1) + 'px').join(', ') + ')';
      rims.push(rim);
      // the front frame: the rim's outline with the half's cut out (even-odd), the middle ends flush at the half's own edge, the end strip kept in the ring
      const fr = el('i', 'rim fr ' + k), mid = k === 'a' ? w : w + RIM;
      const fx = (p) => (k === 'a' ? (p.x === 0 ? 0 : p.x === 1 ? w : p.x * w + RIM) : (p.x === 1 ? w + RIM : p.x * w));
      const hx = (p) => (k === 'a' ? (p.x === 0 ? 2 * RIM : p.x === 1 ? w : p.x * w + RIM) : (p.x === 1 ? w - RIM : p.x * w));
      const ring = (pts) => 'M ' + pts.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L ') + ' Z ';
      fr.style.clipPath = 'path(evenodd, "' + ring([[0, 0], [mid, 0]].concat(foot.map((p) => [fx(p), p.y + 2 * RIM]))) + ring([[k === 'a' ? 2 * RIM : 0, RIM], [k === 'a' ? w : w - RIM, RIM]].concat(foot.map((p) => [hx(p), p.y + RIM]))) + '")';
      frames.push(fr);
      // the rim's outer end: the bar meets the card's edge, so the end's metal strip is drawn inside the half (5 px, banded top to foot)
      const endRim = 'linear-gradient(#f4f6f8, #c9ced3 8%, #8d939a 50%, #c4c9ce 85%, #6f757c) ' + (k === 'a' ? 'left' : 'right') + ' top / ' + RIM + 'px 100% no-repeat';
      h.style.background = endRim + ', ' + GLOSS + ', ' + GRAIN + ', linear-gradient(rgba(0,0,0,0) 45%, rgba(0,0,0,.3)), linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, -0.5) + ', ' + shade(c, 0.06) + ' 36%, ' + shade(c, -0.5) + ')';
      h.style.color = teamInk(c);
      const id = el('div', 'id');
      id.append(el('span', 'ab', (t.abbr || '').toUpperCase()), el('span', 'rec', t.record || ''));
      // before the kick-off the score's room goes
      if (g.status === 'pre') { h.style.gridTemplateColumns = '1fr'; h.appendChild(id); return h; }
      const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      if (live && t.hasBall) sc.appendChild(el('i', 'ball'));
      if (k === 'a') h.append(id, sc); else h.append(sc, id);
      return h;
    };
    const dome = el('div', 'dome'), face = el('div', 'disc');
    if (marks(opts).ha) face.appendChild(haMark(40));
    dome.appendChild(face);
    const tabo = el('div', 'tabo'), tab = el('div', 'tab'); tabo.appendChild(tab);
    if (live) { tab.appendChild(ordinal(g.period)); if (g.clock) tab.appendChild(el('span', '', g.clock)); }
    else tab.appendChild(el('span', 'w', statusText(g, time)));
    const ha = half(g.away, 'a'), hh = half(g.home, 'h');
    const arch = el('div', 'arch'); arch.append(...rims, ha, hh);
    root.append(tabo, arch, dome, disc(g.away, 'a'), disc(g.home, 'h'), ...frames);
    // the down and distance over the dome, on the colour of the team with the ball, chevrons pointing the way it is going
    const fb = g.football, m = live && fb && fb.short ? /^(\d)(\D+?) & (.+)$/.exec(fb.short) : null;
    if (m) {
      const att = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null, c = att ? teamColor(att, '#2a2e36') : '#2a2e36';
      const dd = el('div', 'dd'), dir = att === g.home ? 'l' : 'r';
      dd.style.background = GLOSS + ', linear-gradient(' + shade(c, 0.08) + ', ' + shade(c, -0.3) + ')'; dd.style.color = inkOn(c);
      const chev = () => { const x = el('span', 'ch ' + dir); x.append(el('i'), el('i')); return x; };
      const t = el('span', 't'); t.append(document.createTextNode(m[1]), el('span', 'o', m[2].toUpperCase()), document.createTextNode('& ' + m[3]));
      dd.append(att ? chev() : el('span'), t, att ? chev() : el('span'));
      // under the bar's rim, so it sits on the line
      const ddo = el('div', 'ddo'); ddo.appendChild(dd); root.insertBefore(ddo, arch);
    }
  },
};
