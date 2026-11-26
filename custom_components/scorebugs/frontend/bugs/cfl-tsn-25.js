// "Centre box '25": after the Canadian sports network's CFL bug of 2025-26 (its Friday Night Football package, also the 2025 Grey Cup). A symmetrical box at the foot of the picture: each team on a flat panel of its colour (logo at the outer end, letters in
// the middle with the timeout bars under them, the score next to the centre), and between them a black box running the full height
// with the network's mark on top (here the Home Assistant logo), the clock under it and the quarter under that. While a team has the
// ball a tab sits over its panel: the down on the team's colour, pointing in at the spot on white ("1st & 10" > "EDM 23").
// measured (crop px of 888 x 118, Elks at Redblacks): tab row y 2-42, team row y 43-115; panels 3-364 and 522-884 (362 wide), centre
// box 366-520 (155) the full height; logo centred 60 px from the outer end, about 82 x 70; letters centred 181 from the outer end, capitals
// 32 px; score centred 56 from the centre box, capitals 49 px; timeout bars 34 x 6 px at y 102-107, 22 apart, in the letters' ink;
// clock capitals 28 px, quarter 22 px (lower case, light grey); the down cell 57 % of the tab, its point 9 px deep at mid-height. Every
// surface flat (sample.py: panels and box within 2 L top to foot), square corners, no rims, no shadow.
import { el, logo, ordinal, fit, pips, statusText, teamColor, teamInk, haMark, marks, abbr3, scoreSlot, setSrc, badge, relight, FONTS } from '../kit.js';

const K = 1000 / 888;
// the panels and the tab now touch the centre box and each other (no 1 px seams), and each panel has a
// lit line along its top and its foot in its own colour made brighter. Measured on the Grey Cup still (column samples): a 2-3 px core
// (0.03-0.04 of the panel's height) lighter and more vivid than the panel (Alouettes navy #011e4c -> #173585, Roughriders green
// #035429 -> #237b4c, Redblacks red #7b0000 -> #aa0019), fading into the panel over about 6 px.
const TAB = 45, ROW = 82, H = TAB + ROW, PANEL = 408, MID = 174, W = 2 * PANEL + MID, LINE = 4;
// the neon line's colour: the team's colour lit up; a near-black team takes its second colour (the Redblacks run red on air)
const lum = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return 0; const n = parseInt(m[1], 16); return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; };
const neonOf = (t, c) => (lum(c) < 0.09 && /^#[0-9a-f]{6}$/i.test(t.color2 || '') && lum(t.color2) > 0.09 && lum(t.color2) < 0.85 ? t.color2 : relight(c, 28));
const PRE_CUT = 0;

// the CFL's logos come from the league feed; the kit draws ESPN's only for now, so this
// bug loads the feed's own address itself and keeps the letters badge if it fails
const feedLogo = (t, px) => {
  const im = logo(t, px);
  if (/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(t.logo || '')) setSrc(im, t.logo, () => { im.src = badge(t); });
  return im;
};

export default {
  id: 'cfl-tsn-25',
  size: { w: W, h: H },
  sizeFor: () => ({ w: W - PRE_CUT, h: H }),
  // type check (compare.py): Montserrat ran 32-46 % wider than the frame's letters and figures; Saira at 90 % width matches
  fonts: [FONTS.saira],
  css: `
.sb-cfl-tsn-25 { font-family: 'SB Saira', Arial, sans-serif; font-weight: 700; font-stretch: 90%; color: #fff; }
.sb-cfl-tsn-25 .tm { position: absolute; top: ${TAB}px; height: ${ROW}px; width: ${PANEL}px; }
/* the neon lines along the panel's top and foot, running right up to the centre box */
.sb-cfl-tsn-25 .tm::before, .sb-cfl-tsn-25 .tm::after { content: ''; position: absolute; left: 0; right: 0; height: ${LINE + 6}px; pointer-events: none; }
.sb-cfl-tsn-25 .tm::before { top: 0; background: linear-gradient(var(--neon) 0 ${LINE}px, transparent ${LINE + 6}px); }
.sb-cfl-tsn-25 .tm::after { bottom: 0; background: linear-gradient(transparent 0, var(--neon) 6px ${LINE + 6}px); }
/* the two lines run on across the centre box, each half in its side's neon colour; lines brighter and 4 px (checked by eye only: no still shows them clearly) */
.sb-cfl-tsn-25 .nl { position: absolute; left: ${PANEL}px; width: ${MID}px; height: ${LINE}px; z-index: 2; }
.sb-cfl-tsn-25 .nl.t { top: ${TAB}px; } .sb-cfl-tsn-25 .nl.b { bottom: 0; }
.sb-cfl-tsn-25 .tm.a { left: 0; } .sb-cfl-tsn-25 .tm.h { right: 0; }
.sb-cfl-tsn-25 .tm .sb-logo { position: absolute; top: ${Math.round((ROW - 76) / 2)}px; width: 92px; height: 76px; object-fit: contain; }
.sb-cfl-tsn-25 .tm.a .sb-logo { left: ${Math.round(60 * K - 46)}px; } .sb-cfl-tsn-25 .tm.h .sb-logo { right: ${Math.round(60 * K - 46)}px; }
.sb-cfl-tsn-25 .ab { position: absolute; top: 0; height: ${ROW - 14}px; width: 130px; display: grid; place-items: center; font-size: ${Math.round(32 * K / 0.688)}px; font-weight: 700; letter-spacing: 0; line-height: 1; padding-top: 10px; box-sizing: border-box; }
.sb-cfl-tsn-25 .tm.a .ab { left: ${Math.round(181 * K - 65)}px; } .sb-cfl-tsn-25 .tm.h .ab { right: ${Math.round(181 * K - 65)}px; }
.sb-cfl-tsn-25 .sb-pips { position: absolute; bottom: ${Math.round(8.5 * K)}px; width: 150px; display: flex; justify-content: center; gap: ${Math.round(22 * K)}px; }
.sb-cfl-tsn-25 .tm.a .sb-pips { left: ${Math.round(181 * K - 75)}px; } .sb-cfl-tsn-25 .tm.h .sb-pips { right: ${Math.round(181 * K - 75)}px; }
.sb-cfl-tsn-25 .sb-pips i { width: ${Math.round(34 * K)}px; height: ${Math.round(6 * K)}px; background: currentColor; }
.sb-cfl-tsn-25 .sb-pips i.used { opacity: .22; }
.sb-cfl-tsn-25 .sc { position: absolute; top: 0; height: ${ROW}px; width: 96px; display: grid; place-items: center; font-size: ${Math.round(47 * K / 0.688)}px; font-weight: 800; line-height: 1; letter-spacing: -1px; min-width: 0 !important; }
.sb-cfl-tsn-25 .tm.a .sc { right: ${Math.round(56 * K - 48)}px; } .sb-cfl-tsn-25 .tm.h .sc { left: ${Math.round(56 * K - 48)}px; }
.sb-cfl-tsn-25 .tm .sc.pre { font-weight: 700; width: 112px; letter-spacing: 0; }
.sb-cfl-tsn-25 .tm.a .sc.pre { right: 6px; } .sb-cfl-tsn-25 .tm.h .sc.pre { left: 6px; }
.sb-cfl-tsn-25 .mid { position: absolute; left: ${PANEL}px; z-index: 1; top: 0; width: ${MID}px; height: ${H}px; background: #020201; display: grid; grid-template-rows: ${TAB}px 1fr 38px; justify-items: center; align-items: center; }
.sb-cfl-tsn-25 .mid .sb-ha { color: #d9dbd6; }
.sb-cfl-tsn-25 .mid .ck { font-size: ${Math.round(28 * K / 0.688)}px; font-weight: 700; line-height: 1; align-self: end; padding-bottom: 2px; }
.sb-cfl-tsn-25 .mid .pd { font-size: ${Math.round(22 * K / 0.688)}px; font-weight: 500; color: #d3d8d1; line-height: 1; align-self: start; }
.sb-cfl-tsn-25 .mid .pd .sb-ord { font-size: .75em; text-transform: lowercase; }
.sb-cfl-tsn-25 .mid .w { grid-row: 2 / 4; align-self: center; font-size: 30px; font-weight: 700; text-align: center; line-height: 1.1; }
.sb-cfl-tsn-25 .tab { position: absolute; top: 0; height: ${TAB}px; width: ${PANEL}px; display: flex; font-size: ${Math.round(25 * K / 0.688)}px; font-weight: 700; line-height: 1; }
.sb-cfl-tsn-25 .tab.a { left: 0; } .sb-cfl-tsn-25 .tab.h { right: 0; flex-direction: row-reverse; }
.sb-cfl-tsn-25 .tab .dn { flex: 0 0 57%; min-width: 0; overflow: hidden; display: grid; place-items: center; position: relative; z-index: 1; white-space: nowrap; }
.sb-cfl-tsn-25 .tab.a .dn { clip-path: polygon(0 0, calc(100% - ${Math.round(9 * K)}px) 0, 100% 50%, calc(100% - ${Math.round(9 * K)}px) 100%, 0 100%); padding-right: 6px; }
.sb-cfl-tsn-25 .tab.h .dn { clip-path: polygon(${Math.round(9 * K)}px 0, 100% 0, 100% 100%, ${Math.round(9 * K)}px 100%, 0 50%); padding-left: 6px; }
.sb-cfl-tsn-25 .tab .sp { flex: 1 1 auto; background: #fafcf5; color: #111; display: grid; place-items: center; white-space: nowrap; }
.sb-cfl-tsn-25 .tab.a .sp { margin-left: -${Math.round(9 * K)}px; padding-left: ${Math.round(9 * K)}px; } .sb-cfl-tsn-25 .tab.h .sp { margin-right: -${Math.round(9 * K)}px; padding-right: ${Math.round(9 * K)}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, side]) => {
      const c = teamColor(t, '#3a3f47'), ink = teamInk(c);
      const tm = el('div', 'tm ' + side);
      tm.style.background = c; tm.style.color = ink;
      tm.style.setProperty('--neon', neonOf(t, c));
      const ab = el('div', 'ab', abbr3(t));
      const sc = scoreSlot(el('div', 'sc' + (pre ? ' pre' : ''), !pre && t.score != null ? String(t.score) : ''), g);
      tm.append(feedLogo(t, 92), ab, sc);
      // the timeout bars under the letters, only while the game is on (the CFL gives each team two, the US leagues three)
      if (g.sport === 'football' && live) tm.appendChild(pips(t.timeouts, g.league === 'CFL' ? 2 : 3));
      root.appendChild(tm);
    });
    const nA = neonOf(g.away, teamColor(g.away, '#3a3f47')), nH = neonOf(g.home, teamColor(g.home, '#3a3f47'));
    ['t', 'b'].forEach((k) => { const n = el('div', 'nl ' + k); n.style.background = 'linear-gradient(90deg, ' + nA + ' 50%, ' + nH + ' 50%)'; root.appendChild(n); });
    const mid = el('div', 'mid');
    mid.appendChild(mk.ha ? haMark(36) : el('span'));
    if (live) {
      mid.appendChild(el('span', 'ck', g.clock || ''));
      mid.appendChild(ordinal(g.period, 'pd'));
    } else mid.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(mid);
    // the tab over the team with the ball: the down on its colour pointing in at the spot on white
    const f = g.football, ball = live && f && f.short ? (g.away.hasBall ? [g.away, 'a'] : g.home.hasBall ? [g.home, 'h'] : null) : null;
    if (ball) {
      const [t, side] = ball, c = teamColor(t, '#3a3f47');
      const tab = el('div', 'tab ' + side);
      const dn = el('div', 'dn', (/goal/i.test(f.text) ? f.short.replace(/&\s*\S+$/, '& Goal') : f.short).replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()));
      dn.style.background = c; dn.style.color = teamInk(c);
      tab.appendChild(fit(dn));
      const spot = /\bat\s+([A-Z]{1,4}\s*\d{1,2})\b/i.exec(f.text || '');
      if (spot) tab.appendChild(el('div', 'sp', spot[1].toUpperCase()));
      root.appendChild(tab);
    }
  },
};
