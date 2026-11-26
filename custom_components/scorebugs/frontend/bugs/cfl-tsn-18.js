// "Capsule cells '18": after the Canadian sports network's CFL bar of the late 2010s (the second shows the down). A white bar with rounded ends and a silver foot holding a
// row of rounded glass cells: the network's mark on white at the left (here the Home Assistant logo, in the mark's red), then each team
// as a pale plate for its logo, its letters on a glass cell of its colour and its score on a charcoal glass cell; then the quarter and
// the clock on white; while a team has the ball its down on a glass cell of its colour, pointing at the spot on white ("2nd & 4" >
// "WPG 53").
// measured (crop px of 855 x 36): cells y 3-32 inside a 3 px white rim; mark 1-98, logo plate 101-150, letters 150-214, score 217-266,
// logo plate 271-325, letters 326-394, score 395-446, clock 453-623, down 635-742 (point 4 px), spot 745-845; outer ends rounded 8 px,
// cells 7 px (geomdiff: 6-8 crop px); capitals 17 px (0.47 of the bar). Glass (sample.py, the team and score cells alike): lit +23..+32 L at the top, falling
// to a horizon about 27-45 % down, darkest just under the middle (-12..-14 L), rising again to +12..+17 at the foot over a bright
// 1 px rim; the white clock cell is shaded 20 L along its top edge (the bar's rim) and white from a quarter down; the bar's own foot
// goes silver (-12 L over its lowest third).
import { el, logo, ordinal, fit, statusText, teamColor, relight, haMark, marks, abbr3, scoreSlot, setSrc, badge, FONTS } from '../kit.js';

const K = 1200 / 855, P = (x) => Math.round(x * K);
const H = P(36), CELL = P(29), TOP = P(3);
const NET = P(97), LOGO = P(51), LET = P(64), SC = P(49), GAP = P(4), CK = P(170), DN = P(110), SPOT = P(100);
const TEAM = LOGO + LET + SC;
const W = P(1) + NET + GAP + TEAM + GAP + TEAM + GAP + CK + P(8);
const DOWN = GAP + DN + SPOT;
// the glass profile measured on the frame's team and score cells: [stop %, L* against the cell's colour]
// glass top: measured with sample.py --grid on the 2018 still (2nd & 4, TOR v WPG),
// every team and score cell is lit flat over its top quarter (L 56-60 on the letters, 46 on the score: +26..+28 against the cell),
// then a hard step at 25-28 % down (36 L) to its darkest (-12), rising again to the foot (+7) over a bright 1 px rim
const GLASS = [[0, 28], [12, 27], [24, 23], [28, -12], [50, -12], [75, -3], [92, 6], [97, 14], [100, 34]];
// loop pass 1: the team cells' lit top is brighter than the score cells' (L 58 over the top band
// on the Argonauts' cell, ours 44): the team cells take a stronger top, the score cells keep the one above
const GLASS_TM = [[0, 40], [12, 38], [24, 33], [28, -12], [50, -12], [75, -3], [92, 6], [97, 14], [100, 34]];
// the CFL's logos come from the league feed; the kit draws ESPN's only for now, so this
// bug loads the feed's own address itself and keeps the letters badge if it fails
const feedLogo = (t, px) => {
  const im = logo(t, px);
  if (/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(t.logo || '')) setSrc(im, t.logo, () => { im.src = badge(t); });
  return im;
};
const glassOf = (c, gl = GLASS) => 'linear-gradient(' + gl.map(([p, d]) => relight(c, d) + ' ' + p + '%').join(', ') + ')';

export default {
  id: 'cfl-tsn-18',
  size: { w: W + DOWN, h: H },
  // the down and spot cells only while a team has the ball (the frame shows them then); otherwise the bar ends after the clock
  sizeFor: (g) => ({ w: W + (g.status === 'live' && g.football && g.football.short ? DOWN : 0), h: H }),
  fonts: [FONTS.montserrat],
  css: `
.sb-cfl-tsn-18 { font-family: 'SB Montserrat', Arial, sans-serif; font-weight: 600; color: #fff; }
.sb-cfl-tsn-18 .bar { position: absolute; inset: 0; border-radius: ${P(8)}px; background: linear-gradient(#fafff3, #fbf7f8 25%, #f6f4f2 55%, #e8ede5 75%, #c5ceca); box-shadow: inset 0 0 0 1px rgba(150,160,150,.55);
  display: flex; align-items: flex-start; padding: ${TOP}px ${P(1)}px 0; gap: ${GAP}px; box-sizing: border-box; }
.sb-cfl-tsn-18 .net { flex: 0 0 ${NET}px; height: ${CELL}px; display: grid; place-items: center; }
.sb-cfl-tsn-18 .net .sb-ha { color: #a6010d; }
.sb-cfl-tsn-18 .tm { flex: 0 0 ${TEAM}px; height: ${CELL}px; display: flex; border-radius: ${P(7)}px; overflow: hidden; }
/* the logo stands on the team's own glass, as tall as the cell (2018 still: the Argonauts' roundel and the Bombers' W fill it) */
.sb-cfl-tsn-18 .lg { flex: 0 0 ${LOGO}px; display: grid; place-items: center; }
.sb-cfl-tsn-18 .lg .sb-logo { width: ${P(46)}px; height: ${CELL - 2}px; object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.45)); }
.sb-cfl-tsn-18 .ab { flex: 0 0 ${LET}px; text-shadow: 0 1px 1px rgba(0,0,0,.35); display: grid; place-items: center; font-size: ${P(17 / 0.7)}px; line-height: 1; letter-spacing: 0; }
.sb-cfl-tsn-18 .sc { flex: 0 0 ${SC}px; display: grid; place-items: center; font-size: ${P(18 / 0.7)}px; font-weight: 700; line-height: 1; min-width: 0 !important; border-left: 2px solid rgba(255,255,255,.7); }
.sb-cfl-tsn-18 .ck { flex: 0 0 ${CK}px; height: ${CELL}px; border-radius: ${P(4)}px; display: flex; align-items: center; justify-content: center; gap: ${P(9)}px; color: #111;
  background: linear-gradient(#ccd7ce, #f0f7f1 25%, #fafefe 50%, #f5fbf8 75%, #eef4f1); font-size: ${P(17 / 0.7)}px; line-height: 1; white-space: nowrap; }
.sb-cfl-tsn-18 .ck .sb-ord { font-size: 1em; text-transform: lowercase; }
.sb-cfl-tsn-18 .dn { flex: 0 0 ${DN}px; min-width: 0; overflow: hidden; height: ${CELL}px; border-radius: ${P(4)}px 0 0 ${P(4)}px; display: grid; place-items: center; font-size: ${P(17 / 0.7)}px; line-height: 1; white-space: nowrap;
  clip-path: polygon(0 0, calc(100% - ${P(4)}px) 0, 100% 50%, calc(100% - ${P(4)}px) 100%, 0 100%); position: relative; z-index: 1; }
.sb-cfl-tsn-18 .sp { flex: 0 0 ${SPOT}px; min-width: 0; overflow: hidden; height: ${CELL}px; margin-left: -${GAP + P(4)}px; padding-left: ${P(4)}px; border-radius: 0 ${P(8)}px ${P(8)}px 0; display: grid; place-items: center; color: #111;
  background: linear-gradient(#ccd7ce, #f0f7f1 25%, #fafefe 50%, #f5fbf8 75%, #eef4f1); font-size: ${P(16 / 0.7)}px; line-height: 1; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    const bar = el('div', 'bar');
    const net = el('div', 'net');
    if (mk.ha) net.appendChild(haMark(P(24)));
    bar.appendChild(net);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#4a5560');
      const tm = el('div', 'tm'), lg = el('div', 'lg'), ab = el('div', 'ab', abbr3(t));
      lg.appendChild(feedLogo(t, P(44)));
      // the logo and the letters share one glass cell in the team's colour (no pale plate on the still)
      tm.style.background = glassOf(c, GLASS_TM);
      const sc = scoreSlot(el('div', 'sc', !pre && t.score != null ? String(t.score) : ''), g);
      sc.style.background = glassOf('#303638');
      tm.append(lg, ab, sc);
      bar.appendChild(tm);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(ordinal(g.period, 'pd'), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(ck);
    const f = g.football, ball = live && f && f.short ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    if (live && f && f.short) {
      const c = ball ? teamColor(ball, '#4a5560') : '#4a5560';
      const dn = el('div', 'dn', (/goal/i.test(f.text) ? f.short.replace(/&\s*\S+$/, '& Goal') : f.short).replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()));
      dn.style.background = glassOf(c);
      const spot = /\bat\s+([A-Z]{1,4}\s*\d{1,2})\b/i.exec(f.text || '');
      bar.append(fit(dn), fit(el('div', 'sp', spot ? spot[1].toUpperCase() : '')));
    }
    root.appendChild(bar);
  },
};
