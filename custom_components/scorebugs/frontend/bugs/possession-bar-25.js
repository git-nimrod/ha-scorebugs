// "Possession bar '25": after ESPN's college football bug of 2025 (and its NFL bug from 2026). The whole bar takes the colour of the
// team with the ball, fading to black across the other side, so a glance says who has it. Top line: rank and name over each team, a
// raised tab in the middle with the down and distance. Middle: the logos at the ends (the team with the ball on its colour, the other on
// a light panel), big scores with three timeout dashes, and the quarter (gold) and clock in the centre. A dark strip underneath with
// the records. No network marks. Each logo panel fades into the score area; school names only; heavy wide type (Saira).
import { el, logo, ordinal, pips, statusText, teamColor, shade, FONTS, GLOSS, teamInk, vividColor, fit, shortName } from '../kit.js';

const W = 900, H = 124, SCORE_W = 130;
// measured against the frame: scores sit higher and further in, the clock is smaller, logos a little smaller and lower
const SCORE_TOP = 19, SCORE_PX = 70, SCORE_IN = 16, CLOCK_PX = 28, LOGO_W = 107, LOGO_H = 57, LOGO_DROP = 6;

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.body > div.sc', 2, -0.5, 1],
  ['div.body > div.mid > span.clk', -4, 5, 0],  // was -17: in the wider matched face the clock ran into the quarter
  ['div.body > div.lp.away > img.sb-logo', 8, -1, 0],
  ['div.body > div.lp.home > img.sb-logo', 4.5, -2, 0],
];

export default {
  id: 'possession-bar-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score room goes and the logo ends close up on the start time
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W, h: H } : { w: W, h: H }),
  nudge: NUDGE,
  fonts: [FONTS.unbounded],
  css: `
.sb-possession-bar-25 { font-family: 'SB Unbounded', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 115%; color: #fff; }
/* face: ESPN CFB 2025: Unbounded 800 */
.sb-possession-bar-25 .body { position: absolute; left: 0; right: 0; top: 0; height: 98px; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.35); }
.sb-possession-bar-25 .nm { position: absolute; top: 0; height: 30px; display: flex; align-items: center; font-size: 20px; letter-spacing: .3px; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
.sb-possession-bar-25 .nm b { font-size: 14px; margin-right: 6px; opacity: .9; }
.sb-possession-bar-25 .tab { position: absolute; left: 330px; width: 240px; top: 0; height: 34px; display: grid; place-items: center; font-size: 24px; border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,.5), inset 0 -1px 0 rgba(255,255,255,.15); }
.sb-possession-bar-25 .lp { position: absolute; top: 28px; width: 190px; height: 66px; display: grid; align-items: center; overflow: hidden; }
.sb-possession-bar-25 .lp.away { -webkit-mask-image: linear-gradient(90deg, #000 62%, transparent); mask-image: linear-gradient(90deg, #000 62%, transparent); justify-items: start; padding-left: 12px; box-sizing: border-box; }
.sb-possession-bar-25 .lp.home { -webkit-mask-image: linear-gradient(270deg, #000 62%, transparent); mask-image: linear-gradient(270deg, #000 62%, transparent); justify-items: end; padding-right: 12px; box-sizing: border-box; }
/* no plates: each logo sits in a round glow of its team's colour, drawn on the body */
.sb-possession-bar-25 .lp { -webkit-mask-image: none !important; mask-image: none !important; background: none !important; }
.sb-possession-bar-25 .sb-logo { width: ${LOGO_W}px; height: ${LOGO_H}px; object-fit: contain; margin-top: ${LOGO_DROP * 2}px; }
.sb-possession-bar-25 .sc { position: absolute; top: ${SCORE_TOP}px; width: 130px; height: 64px; display: grid; justify-items: center; align-content: start; font-size: ${SCORE_PX}px; font-stretch: 105%; line-height: 1.05; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-possession-bar-25 .sb-pips { display: flex; gap: 6px; margin-top: 3px; }
.sb-possession-bar-25 .sb-pips i { width: 24px; height: 4px; background: #f2f2f2; } .sb-possession-bar-25 .sb-pips i.used { opacity: .2; }
.sb-possession-bar-25 .mid { position: absolute; left: 300px; width: 300px; top: 42px; height: 44px; display: flex; align-items: center; justify-content: center; gap: 18px; }
.sb-possession-bar-25 .q { color: #f3c94a; font-size: 24px; } .sb-possession-bar-25 .clk { font-size: ${CLOCK_PX}px; letter-spacing: .5px; }
.sb-possession-bar-25 .sb-ord { font-size: .72em; }
.sb-possession-bar-25 .ball { position: absolute; top: 0; width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 8px solid #f4f4f4; }
.sb-possession-bar-25 .strip { position: absolute; left: 14px; right: 14px; top: 98px; height: 24px; background: linear-gradient(#2c2d30, #1b1c1e); border-radius: 0 0 6px 6px;
  display: flex; justify-content: space-between; align-items: center; padding: 0 18px; font-size: 14px; color: #e4e4e4; letter-spacing: .5px; }
.sb-possession-bar-25 .strip .ev { font-size: 13px; letter-spacing: .6px; white-space: nowrap; }
/* postseason (frame: CFP national championship, Jan 2026): a gold edge along the top of the strip and the event a little larger */
.sb-possession-bar-25.sb-playoffs .strip { box-shadow: inset 0 2px 0 #c9a54a; } .sb-possession-bar-25.sb-playoffs .strip .ev { font-size: 15px; color: #fff; }
`,
  dresses: ['regular', 'playoffs'],
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const ball = live ? (g.away.hasBall ? 'away' : g.home.hasBall ? 'home' : null) : null;
    const lead = ball ? g[ball] : null;
    const c = lead ? teamColor(lead, '#3a3f47') : '#2d2f33';
    const body = el('div', 'body');
    // the colour of the team with the ball floods from its end and fades to black at the other
    // round glows that fade softly to black: each team's colour round its logo at
    // its end, and the colour of the team with the ball round the top of the middle; black between them
    const rgba = (x, a) => 'rgba(' + [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16)).join(', ') + ', ' + a + ')';
    const glow = (x, at, w, h) => 'radial-gradient(ellipse ' + w + ' ' + h + ' at ' + at + ', ' + rgba(x, 1) + ' 0%, ' + rgba(x, 0.8) + ' 30%, ' + rgba(x, 0.45) + ' 60%, ' + rgba(x, 0.15) + ' 85%, ' + rgba(x, 0) + ' 100%)';
    // a team whose colour is too dark to glow (Virginia's navy) glows in its bright second colour
    const bright = (t) => { const c = teamColor(t, '#3a3f47'), c2 = t.color2 || ''; const v = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
      const lum = (x) => { const q = v(x); return (Math.max(...q) + Math.min(...q)) / 510; }, sat = (x) => { const q = v(x); return (Math.max(...q) - Math.min(...q)) / 255; };
      return /^#[0-9a-f]{6}$/i.test(c2) && lum(c) < 0.3 && sat(c2) > 0.45 && lum(c2) > 0.3 ? c2 : vividColor(t, '#3a3f47'); };
    const ca = bright(g.away), ch = bright(g.home);
    body.style.background = [GLOSS, glow(ca, '6% 60%', '32%', '130%'), glow(ch, '94% 60%', '32%', '130%')].concat(lead ? [glow(c, '50% 0%', '34%', '90%')] : []).concat(['linear-gradient(#17181b, #050506)']).join(', ');
    root.appendChild(body);
    const name = (t) => (t.name || t.abbr).toUpperCase();
    [['away', 18], ['home', null]].forEach(([side, x]) => {
      const t = g[side];
      const nm = el('div', 'nm');
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode(name(t).slice(0, 18)));
      if (x != null) nm.style.left = x + 'px'; else nm.style.right = '18px';
      // a three-figure score is wider than its slot: the names end before it (squeezed, then the short form), so the score keeps its
      // size instead of being shrunk under a long name
      if (g.status !== 'pre' && [g.away.score, g.home.score].some((v) => v != null && v >= 100)) { const sn = shortName(name(t)); nm.style.maxWidth = '140px'; fit(nm, (sn.replace(/\s/g, '').length >= 6 ? sn : (t.abbr || sn).toUpperCase()).slice(0, 18)); }   // ("B ST" says nothing: then the abbreviation)
      const ink = '#fff';   // white on the glows and the black
      nm.style.color = ink;
      body.appendChild(nm);
      const lp = el('div', 'lp ' + side + (ball === side ? '' : ' light'));
      lp.style[side === 'away' ? 'left' : 'right'] = '0';
      lp.appendChild(logo(t, 116));
      body.appendChild(lp);
      const sc = el('div', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      if (g.sport === 'football' && live) sc.appendChild(pips(t.timeouts, 3));
      sc.style.left = (side === 'away' ? 160 + SCORE_IN : W - 290 - SCORE_IN) + 'px';
      sc.style.color = ink;
      if (g.status !== 'pre') body.appendChild(sc);
      if (ball === side) { const b = el('span', 'ball'); b.style.left = (side === 'away' ? 216 : W - 234) + 'px'; body.appendChild(b); }
    });
    const tab = el('div', 'tab', live && g.football && g.football.short ? g.football.short : '');
    // a round glow of the ball team's colour from its side of the tab, fading to grey-black
    tab.style.background = lead ? 'radial-gradient(ellipse 75% 160% at ' + (ball === 'away' ? '0%' : '100%') + ' 50%, ' + shade(c, 0.05) + ' 0%, ' + shade(c, -0.25) + ' 35%, ' + shade(c, -0.6) + ' 65%, #1d1e21 100%), #1d1e21' : 'linear-gradient(#45474c, #2a2b2f)';
    if (lead) tab.style.color = '#fff';
    if (tab.textContent) body.appendChild(tab);
    const mid = el('div', 'mid');
    if (live) { mid.appendChild(ordinal(g.period, 'q')); if (g.clock) mid.appendChild(el('span', 'clk', g.clock)); }
    else mid.appendChild(el('span', 'clk', statusText(g, time)));
    if (g.status === 'pre') mid.style.left = (W - 2 * SCORE_W - 300) / 2 + 'px';   // centred on the closed-up bar
    body.appendChild(mid);
    // the strip: the records at the ends and, when the game has one, its event in the middle ("AER LINGUS COLLEGE FOOTBALL CLASSIC",
    // "CFP NATIONAL CHAMPIONSHIP"); the presenting sponsor and the network's mark that sit there on air are left out
    const note = String(g.note || '').replace(/\s+presented by .*$/i, '').replace(/^College Football Playoff\b/i, 'CFP').toUpperCase();
    if (g.away.record || g.home.record || note) {
      const strip = el('div', 'strip');
      strip.append(el('span', '', g.away.record), el('span', 'ev', note), el('span', '', g.home.record));
      root.appendChild(strip);
    }
  },
};
