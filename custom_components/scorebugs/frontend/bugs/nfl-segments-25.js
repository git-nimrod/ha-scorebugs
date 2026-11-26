// "Segments '25": after the Monday-night NFL bar on ESPN (2023-2025). One long, low bar in separate glossy segments: each team a
// segment in its colour with a big cropped logo, three timeout squares stacked at its outer edge and the score; a small arrow on the team
// with the ball; a dark clock segment (quarter, clock); and a down-and-distance segment underlined in red. The network's wordmark at the
// left end becomes the Home Assistant logo. Each team segment runs from its colour, lit behind the logo, to near black at the score, with
// a glossy top and a glow of the colour along the bottom; wide heavy type (Saira).
// Rebuilt against the upscaled frame: each team segment is near black, its colour only as NEON light: a bright line along
// the foot glowing up into the dark, a thin line along the top, the timeout ticks in the same neon; the logo big and cut by the segment.
import { el, logo, ordinal, pips, statusText, teamColor, shade, haMark, marks, FONTS, GLOSS, vividColor } from '../kit.js';

const W = 1060, H = 52, DD_ROOM = W - 64 - 2 * 260 - 230 - 3 * 6;   // the down segment's own width (it fills the rest) and its gap
// the down segment holds the down and distance while the game is on, else both records; with neither it is left out (it stood empty)
// the right block holds only the down: before the game the records go into the empty score room, and it goes when idle
const ddText = (g) => (g.status === 'live' && g.football && g.football.short ? g.football.short : '');
// a three-figure score (basketball, a football shoot-out): each team segment 44 px longer and the bar with them, so the score stays
// clear of the big logo
const BIG = 44, big = (g) => g.status !== 'pre' && [g.away.score, g.home.score].some((v) => v != null && v >= 100);

/** The team's colour as a neon light: same hue, full saturation, light (Bills navy reads sky blue, Jets green reads bright green on air). */
function neon(c, a) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c || ''); if (!m) return 'rgba(120,200,255,' + (a == null ? 1 : a) + ')';
  const [r, g, b] = m.slice(1).map((h) => parseInt(h, 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0; if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return 'hsla(' + Math.round(((h * 60) + 360) % 360) + ', ' + (d < 0.06 ? 0 : 100) + '%, 62%, ' + (a == null ? 1 : a) + ')';
}

/** A neon light along a part's foot, very bright, diffusing softly up into the dark. */
// the down box: the neon only along its lower half, black from about half way up
const neonLow = (c) => 'linear-gradient(0deg, ' + neon(c) + ' 0, ' + neon(c) + ' 3px, ' + neon(c, 0.7) + ' 5px, ' + neon(c, 0.3) + ' 25%, rgba(0,0,0,0) 50%)';
const neonGlow = (c) => 'linear-gradient(0deg, ' + neon(c) + ' 0, ' + neon(c) + ' 4px, ' + neon(c, 0.8) + ' 5px, ' + neon(c, 0.45) + ' 28%, ' + neon(c, 0.18) + ' 58%, ' + neon(c, 0.05) + ' 80%, rgba(0,0,0,0) 100%)';

export default {
  id: 'nfl-segments-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: (ddText(g) ? W : W - DD_ROOM) + (big(g) ? 2 * BIG : 0), h: H }),
  fonts: [FONTS.unbounded],
  css: `
.sb-nfl-segments-25 { font-family: 'SB Unbounded', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 118%; color: #fff; display: flex; gap: 6px; height: ${H}px; }
/* face: ESPN MNF 2023-25: Unbounded 800 */
.sb-nfl-segments-25 > div { position: relative; height: 100%; border-radius: 4px; overflow: hidden; display: flex; align-items: center;
  box-shadow: inset 0 0 0 2px #d9dde3, inset 0 0 0 3px #7d838d, 0 2px 6px rgba(0,0,0,.5); }   /* a metallic white-grey outline on every part; the team parts get theirs in their neon */
.sb-nfl-segments-25 .team { width: 260px; }
.sb-nfl-segments-25 .net { width: 64px; justify-content: center; background: linear-gradient(#3a3b3f, #17181a); color: #f2f2f2; }
.sb-nfl-segments-25 .sb-logo { position: absolute; top: -20%; width: 150px; height: 140%;   /* big, cut by its segment, centred on its focal point */
    /* built up: about one and a half times the panel's height, its top and foot just trimmed, as big as on air */ object-fit: cover; opacity: 1; }   /* the whole logo, as tall as its panel, as in the frame (Bills, Jets): the old crop showed slivers */
.sb-nfl-segments-25 .away .sb-logo { left: 16px; } .sb-nfl-segments-25 .home .sb-logo { right: 16px; }
.sb-nfl-segments-25 .sc { position: absolute; font-size: 44px; font-stretch: 105%; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nfl-segments-25 .away .sc { right: 26px; } .sb-nfl-segments-25 .home .sc { left: 26px; }
.sb-nfl-segments-25 .sb-pips { position: absolute; top: 12px; display: grid; gap: 5px; }
.sb-nfl-segments-25 .away .sb-pips { left: 9px; } .sb-nfl-segments-25 .home .sb-pips { right: 9px; }
.sb-nfl-segments-25 .sb-pips i { width: 4px; height: 9px; background: var(--neon, #fff); box-shadow: 0 0 4px var(--neon, #fff); } .sb-nfl-segments-25 .sb-pips i.used { opacity: .2; }
.sb-nfl-segments-25 .ball { position: absolute; top: 50%; margin-top: -10px; width: 14px; height: 20px; background: #f2f2f2; }
.sb-nfl-segments-25 .ball::after { content: ''; position: absolute; inset: 3px; background: #e8202a; }
.sb-nfl-segments-25 .away .ball, .sb-nfl-segments-25 .away .ball::after { clip-path: polygon(100% 0, 100% 100%, 0 50%); } .sb-nfl-segments-25 .away .ball { right: 0; }
.sb-nfl-segments-25 .home .ball, .sb-nfl-segments-25 .home .ball::after { clip-path: polygon(0 0, 0 100%, 100% 50%); } .sb-nfl-segments-25 .home .ball { left: 0; }
/* the clock: a white light along its foot fading up to black, under the grey outline */
.sb-nfl-segments-25 .clock { width: 230px; background: linear-gradient(0deg, #f4f6f8 0, #f4f6f8 3px, rgba(235,238,242,.6) 5px, rgba(210,214,220,.22) 30%, rgba(0,0,0,0) 65%), #08090b; justify-content: center; gap: 18px; }
.sb-nfl-segments-25 .q { font-size: 20px; } .sb-nfl-segments-25 .clk { font-size: 34px; letter-spacing: .5px; }
.sb-nfl-segments-25 .sb-ord { font-size: .75em; }
.sb-nfl-segments-25 .dd { flex: 1; background: linear-gradient(#2e2f33, #151618); justify-content: center; font-size: 24px; border-bottom: 4px solid #d71920; box-sizing: border-box; }
`,
  draw(root, g, { time, opts }) {
    root.dataset.focus = 'face';  // cut logos centred on their face: the panther's head, the star's top point
    const live = g.status === 'live';
    const team = (t, side) => {
      const c = vividColor(t, '#3a3f47');   // a near-black team colour lights in its bright second colour
      const b = el('div', 'team ' + side);
      if (big(g)) b.style.width = (260 + BIG) + 'px';
      const dir = side === 'away' ? '90deg' : '270deg';
      // near black, lit from its foot by the team's neon (as on air), a faint wash of the colour behind the logo
      b.style.setProperty('--neon', neon(c));
      // a very bright neon light along the foot diffusing up into the dark, and an outline in the same neon
      // and fading to black towards the inner side, by the score
      // as the down box: black above, the neon only along the lower half
      b.style.background = neonLow(c) + ', #060607';
      b.style.boxShadow = 'inset 0 0 0 2px ' + neon(c, 0.95) + ', 0 0 10px ' + neon(c, 0.45) + ', 0 2px 6px rgba(0,0,0,.5)';
      b.appendChild(logo(t, 150));
      const sc = el('span', 'sc', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : '');
      if (g.status === 'pre') { sc.style.fontSize = ((t.record || '').length > 4 ? 24 : 30) + 'px'; sc.style.whiteSpace = 'nowrap'; }
      b.appendChild(sc);
      if (g.sport === 'football' && live) b.appendChild(pips(t.timeouts, 3));
      if (live && t.hasBall) b.appendChild(el('span', 'ball'));
      return b;
    };
    const clock = el('div', 'clock');
    if (live) { clock.appendChild(ordinal(g.period, 'q')); if (g.clock) clock.appendChild(el('span', 'clk', g.clock)); }
    else clock.appendChild(el('span', 'clk', statusText(g, time)));
    const dd = el('div', 'dd', ddText(g));
    // the down and distance carries the colour of the team with the ball, the same gradient as its segment
    const lead = live ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    // the same neon light as the team with the ball, rising from the foot, and its neon outline
    if (lead) { const c = vividColor(lead, '#3a3f47'); dd.style.background = neonLow(c) + ', #060607'; dd.style.borderBottom = '0'; dd.style.boxShadow = 'inset 0 0 0 2px ' + neon(c, 0.95) + ', 0 0 10px ' + neon(c, 0.45) + ', 0 2px 6px rgba(0,0,0,.5)'; }
    if (marks(opts).ha) { const n = el('div', 'net'); n.appendChild(haMark(40)); root.appendChild(n); }
    root.append(team(g.away, 'away'), team(g.home, 'home'), clock);
    if (dd.textContent) root.appendChild(dd);
  },
};
