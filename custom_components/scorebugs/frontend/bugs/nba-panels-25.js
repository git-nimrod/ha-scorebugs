// "Light & dark panels '25": after the NBA bar on NBC and Peacock (2025-26 on; checked against the WNBA version of the same bar). One
// compact bar: each team has a narrow strip of its colour at the outer end with three letters standing on end, then a panel (the
// away team's own colour beside a near-black end strip, white for the home team) with the round logo, a bar in the team colour, and a big score. The centre is dark
// glass with the clock over the quarter (the shot clock beside the quarter is not in the sensor data). A grey strip underneath carries
// the records. The network's mark above the clock becomes the Home Assistant logo; the league's logo sits in the strip.
import { el, logo, ordinal, statusText, teamColor, shade, inkOn, leagueLogo, haMark, marks, abbr3, FONTS, accentOn, pips } from '../kit.js';

// (Nov 23 sweep) the frame's bar is 0.128 of its width tall and the grey strip 0.07: TOP 105 and the strip 57 (were 136 and 50);
// everything inside the bar scaled to it (scores, logos, clock, end letters)
const W = 820, H = 162, TOP = 105, PAN = 270, PRE_PAN = 150;   // before the tip-off a panel holds only its logo
// with the grey strip hidden (card option bug_lower: hide) the records move into the panels before the game, which widen to hold them
const PRE_REC = 236, noLow = (o) => !!(o && o.bug_lower === 'hide');
const prePan = (g, o) => (noLow(o) && g.away.record && g.home.record ? PRE_REC : PRE_PAN);

// measured against the frames: a smaller clock and logos (Aces at Sparks frame)
const LOGO = 66, CLOCK_PX = 34;
// each team panel is a rectangle whose outer end is a half circle round the logo (an arch), inset in a frame of the end strip's colour
const INSET = 9, RAD = (TOP - 2 * INSET) / 2, RING = 2 * RAD - 14;

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.bar > div.mid > div.clk', 1.5, 4, 0],
  // the logos' old shifts dropped: a round logo sits dead centre in its disc
];

export default {
  id: 'nba-panels-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the game there is no score: each panel closes up on its logo and the bar is shorter
  sizeFor: (g, o) => (g.status === 'pre' ? { w: W - 2 * (PAN - prePan(g, o)), h: H } : { w: W, h: H }),
  lower: H - TOP,   // the grey strip with the records and the league, which the card can hide
  nudge: NUDGE,
  fonts: [FONTS.teko, FONTS.montserrat, FONTS.bigShoulders],
  css: `
.sb-nba-panels-25 { font-family: 'SB Teko', 'Arial Black', sans-serif; font-stretch: 110%; color: #fff; }
.sb-nba-panels-25 { font-weight: 600; }   /* NBC NBA 2025: Teko */
.sb-nba-panels-25 .bar { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TOP}px; display: grid; grid-template-columns: 52px ${PAN}px 1fr ${PAN}px 52px;
  border-radius: 10px 10px 0 0; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-nba-panels-25 .edge { display: grid; place-items: center; }
.sb-nba-panels-25 .edge b { display: block; writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; line-height: 1; font-weight: 900; font-size: 34px; letter-spacing: 1px; white-space: nowrap; }
.sb-nba-panels-25 .home.edge b { transform: none; }
.sb-nba-panels-25 .pan { position: relative; display: flex; align-items: center; gap: 8px; padding: 0; margin: ${INSET}px 0; }
.sb-nba-panels-25 .pan.away { border-radius: ${RAD}px 0 0 ${RAD}px; } .sb-nba-panels-25 .pan.home { border-radius: 0 ${RAD}px ${RAD}px 0; }   /* the arch: a circle joined to a rectangle */
/* flat panels, as in the frame (Bulls at Cavaliers): the away team's in its own colour, the home team's white */
.sb-nba-panels-25 .pan.light { background: linear-gradient(#ffffff, #ececec); flex-direction: row-reverse; }
.sb-nba-panels-25 .pan.dark { background: linear-gradient(var(--c), var(--cd)); box-shadow: none; }
.sb-nba-panels-25 .ring { flex: none; margin: 0 7px; width: ${RING}px; height: ${RING}px; border-radius: 50%; overflow: hidden;   /* the disc crops what spills past it, as the Bulls badge on air */ display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 4px var(--c); }
.sb-nba-panels-25 .dark .ring { background: var(--cd); box-shadow: 0 0 0 4px rgba(255,255,255,.9); }   /* the logo on a disc of the team colour, as on air (review, Nov 22) */
.sb-nba-panels-25 .dark .brk { background: rgba(255,255,255,.85); }
.sb-nba-panels-25 .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain; }
.sb-nba-panels-25 .mid .sb-ha { color: #d9dadc; margin-bottom: 4px; }
.sb-nba-panels-25 .strip .lg { display: flex; align-items: center; gap: 8px; }
.sb-nba-panels-25 .strip .sb-league { width: 40px; height: 40px; }
.sb-nba-panels-25 .brk { flex: none; position: relative; width: 4px; height: 52px; margin: 0 8px; background: var(--c); border-radius: 2px; }
/* a bracket: the line with a small point at its middle aimed at the logo, as on air (review, Nov 22) */
.sb-nba-panels-25 .brk::after { content: ''; position: absolute; top: 50%; margin-top: -7px; width: 0; height: 0; border-top: 7px solid transparent; border-bottom: 7px solid transparent; }
.sb-nba-panels-25 .away .brk::after { right: 3px; border-right: 7px solid rgba(255,255,255,.85); } .sb-nba-panels-25 .home .brk::after { left: 3px; border-left: 7px solid var(--c); }
.sb-nba-panels-25 .brk sup { position: absolute; top: 2px; font-size: 18px; font-weight: 800; color: #222; }
.sb-nba-panels-25 .dark .brk sup { color: #eee; }
.sb-nba-panels-25 .away .brk sup { left: 8px; } .sb-nba-panels-25 .home .brk sup { right: 8px; }
.sb-nba-panels-25.sb-no-lower .strip { display: none; } .sb-nba-panels-25.sb-no-lower .bar { border-radius: 10px; }
.sb-nba-panels-25 .pan .rec { flex: 1; text-align: center; font-family: 'SB Montserrat', sans-serif; font-weight: 800; font-size: 28px; white-space: nowrap; color: var(--ink, #fff); }   /* the record beside the logo when the strip is hidden */
/* the type, read off the frame: the scores tall, narrow and square (Big Shoulders);
 the clock, the quarter, the end letters and the records wide and round (Montserrat); the strip's label stays condensed (Teko) */
.sb-nba-panels-25 .sc, .sb-nba-panels-25 .sc.long { font-family: 'SB Big Shoulders', 'Arial Narrow', sans-serif; font-weight: 900; letter-spacing: 1px; }
.sb-nba-panels-25 .pan .sc { font-size: 96px; } .sb-nba-panels-25 .pan .sc.long { font-size: 74px; letter-spacing: 0; }   /* the figures about 0.6 of the panel's height, as on air */
.sb-nba-panels-25 .clk, .sb-nba-panels-25 .per, .sb-nba-panels-25 .when, .sb-nba-panels-25 .edge b, .sb-nba-panels-25 .strip > span:not(.lg) { font-family: 'SB Montserrat', 'Arial Black', sans-serif; }
.sb-nba-panels-25 .clk, .sb-nba-panels-25 .per, .sb-nba-panels-25 .when { font-weight: 800; } .sb-nba-panels-25 .edge b { font-weight: 900; font-size: 30px; }
.sb-nba-panels-25 .sc.long { font-size: 60px; letter-spacing: -3px; }
.sb-nba-panels-25 .sc { position: relative; flex: 1; text-align: center; font-weight: 800; font-stretch: 100%; font-size: 96px; line-height: 1; letter-spacing: -2px; }
.sb-nba-panels-25 .mid { display: grid; align-content: center; justify-items: center; background: radial-gradient(ellipse at 50% 0, #5a5d61, #2b2d30 55%, #1a1b1d); box-shadow: inset 0 2px 0 rgba(255,255,255,.25); }
.sb-nba-panels-25 .clk { font-weight: 800; font-stretch: 100%; font-size: ${CLOCK_PX}px; line-height: 1; letter-spacing: -1px; }
.sb-nba-panels-25 .per { font-weight: 800; font-size: 26px; margin-top: 2px; }
.sb-nba-panels-25 .to { position: absolute; left: 50%; transform: translateX(-50%); bottom: -13px; display: flex; gap: 4px; } .sb-nba-panels-25 .to i { width: 12px; height: 4px; background: var(--c); } .sb-nba-panels-25 .to i.used { opacity: .25; }
.sb-nba-panels-25 .sb-ord { font-size: .62em; vertical-align: 10px; }
.sb-nba-panels-25 .when { font-weight: 800; font-size: 28px; text-align: center; line-height: 1.15; }
.sb-nba-panels-25 .strip { position: absolute; left: 0; top: ${TOP}px; width: ${W}px; height: ${H - TOP}px; box-sizing: border-box; padding: 0 22px; display: flex; align-items: center;
  justify-content: space-between; background: linear-gradient(#3c3d40, #2a2b2e); border-radius: 0 0 10px 10px; font-weight: 700; font-size: 26px; color: #d8d8d8; }
.sb-nba-panels-25 .strip .lg { font-weight: 800; font-size: 30px; color: #e8e8e8; letter-spacing: .5px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const side = (t, s) => {
      const c = teamColor(t, '#55595f');
      const edge = el('div', 'edge ' + s);
      // the home end strip is the team colour; the away one, next to a panel in that colour, is the colour taken nearly to black
      const ec = s === 'away' ? shade(c, -0.6) : c;
      edge.style.background = ec;   // flat, one with the frame round the panel
      edge.style.color = accentOn(t, ec);
      edge.appendChild(el('b', '', abbr3(t)));
      const pan = el('div', 'pan ' + s + (s === 'away' ? ' dark' : ' light'));
      pan.style.setProperty('--c', c); pan.style.setProperty('--cd', shade(c, -0.12));
      const ring = el('div', 'ring');
      ring.appendChild(logo(t, 104));
      const brk = el('div', 'brk');   // a bar in the team colour between the logo and the score
      if (t.rank || t.seed) brk.appendChild(el('sup', '', String(t.rank || t.seed)));
      // the score is the team colour on the white (home) panel, white on the dark (away) one
      const sv = g.status !== 'pre' && t.score != null ? String(t.score) : '';
      const sc = el('div', 'sc' + (sv.length > 2 ? ' long' : ''), sv);   // three figures: a size smaller, clear of the clock
      sc.style.color = s === 'home' ? (inkOn(c) === '#111' ? shade(c, -0.45) : c) : '#fff';
      // timeouts (seven a game in the NBA) under the score, when the sensor knows them
      if (g.status === 'live' && t.timeouts != null) { const tp = pips(t.timeouts, g.league === 'WNBA' ? 4 : 7); tp.className = 'sb-pips to'; sc.appendChild(tp); }
      if (g.status === 'pre') { pan.appendChild(ring); if (prePan(g, opts) === PRE_REC) { const rc = el('div', 'rec', t.record); rc.style.color = sc.style.color; pan.appendChild(rc); } } else pan.append(ring, brk, sc);
      return s === 'away' ? [edge, pan] : [pan, edge];
    };
    const mid = el('div', 'mid');
    if (mk.ha) mid.appendChild(haMark(24));   // the network's mark sat above the clock
    if (live) {
      if (g.clock) mid.appendChild(el('div', 'clk', g.clock));
      mid.appendChild(ordinal(g.period, 'per'));
    } else mid.appendChild(el('div', 'when', statusText(g, time)));
    // the frame round each arched panel is its end strip's colour (away: the colour near black; home: the team colour), as on air
    const ea = shade(teamColor(g.away, '#55595f'), -0.6), eh = teamColor(g.home, '#55595f');
    bar.style.background = 'linear-gradient(90deg, ' + ea + ' 50%, ' + eh + ' 50%)';
    bar.append(...side(g.away, 'away'), mid, ...side(g.home, 'home'));
    const pp = prePan(g, opts);
    if (g.status === 'pre') { bar.style.width = (W - 2 * (PAN - pp)) + 'px'; bar.style.gridTemplateColumns = '52px ' + pp + 'px 1fr ' + pp + 'px 52px'; }
    const strip = el('div', 'strip');
    if (g.status === 'pre') strip.style.width = (W - 2 * (PAN - pp)) + 'px';
    const lg = el('span', 'lg');
    if (mk.league) lg.appendChild(leagueLogo(g, 40, null, true));
    lg.appendChild(document.createTextNode(g.league || ''));
    strip.append(el('span', '', g.away.record || ''), lg, el('span', '', g.home.record || ''));
    root.append(bar, strip);
  },
};
