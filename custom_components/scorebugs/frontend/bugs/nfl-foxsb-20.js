// "Logo plates '20": after FOX's Super Bowl LIV bug (2020). Two plates of
// the teams' colours side by side, each with a thin lighter frame, the team's logo at its outer end and its score at the inner end (a dot
// beside the score of the team with the ball). Under them a dark glass strip with the quarter and the clock, then the down and distance.
// No network mark shows on this bug, so none is drawn. The player's line beside the strip needs data the sensor lacks.
import { el, logo, statusText, teamColor, shade, inkOn, scoreSlot, FONTS, GLOSS } from '../kit.js';

const W = 780, PL = 88, STRIP = 54, H = PL + 4 + STRIP;
// on air the plates and the strip lean forward: their upright ends slant 8 degrees, top to the right (measured on the frame: the edge where the
// plates meet 7.4 deg, the 49ers plate's outer rim 8.2 deg, line fits within 1 px). The shapes are slanted and their
// logos and figures set back upright inside them; the slant pushes each end out 6 px, so the bug keeps 7 px clear at each side.
const SLANT = 8, PAD = 7;

export default {
  id: 'nfl-foxsb-20',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi800i],
  css: `
.sb-nfl-foxsb-20 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 800; font-style: italic; color: #fff; }
.sb-nfl-foxsb-20 .pls { position: absolute; left: ${PAD}px; right: ${PAD}px; top: 0; height: ${PL}px; display: flex; gap: 2px; }
.sb-nfl-foxsb-20 .pl, .sb-nfl-foxsb-20 .strip { transform: skewX(-${SLANT}deg); }
.sb-nfl-foxsb-20 .pl > *, .sb-nfl-foxsb-20 .strip > * { transform: skewX(${SLANT}deg); }
/* the two plates meet in the middle, and each has a short dashed light line just in from its outer end */
.sb-nfl-foxsb-20 .pl::after { content: ''; position: absolute; top: 12px; bottom: 12px; left: 9px; width: 4px; background: repeating-linear-gradient(rgba(255,255,255,.8) 0 7px, transparent 7px 11px); }
.sb-nfl-foxsb-20 .pl.h::after { left: auto; right: 9px; }
.sb-nfl-foxsb-20 .pl { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 22px 0 18px; box-sizing: border-box; border-radius: 3px; position: relative; overflow: hidden; }
.sb-nfl-foxsb-20 .pl.h { flex-direction: row-reverse; padding: 0 18px 0 22px; }
/* logos much bigger, as on air: there each is about 0.43 of its plate's width (49ers 118 of 274 px, Chiefs 125 of 286), so 160 wide here,
 and as tall as the plate allows (84 of its 88): on air both logos stand whole inside their plates, and at 100 tall a round logo
 with no margin (the Packers' G, the Commanders' W) was cut by the plate's top and foot (checked Nov 24) */
.sb-nfl-foxsb-20 .pl .sb-logo { width: 160px; height: 84px; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); }
.sb-nfl-foxsb-20 .sc { font-size: 72px; line-height: 1; text-shadow: 0 2px 3px rgba(0,0,0,.35); display: flex; align-items: center; gap: 8px; }
.sb-nfl-foxsb-20 .pl.a .sc { text-align: right; }
.sb-nfl-foxsb-20 .sc .ball { width: 12px; height: 12px; border-radius: 50%; background: currentColor; flex: none; }
.sb-nfl-foxsb-20 .sc.rec { font-size: 44px; }
.sb-nfl-foxsb-20 .strip { position: absolute; left: ${PAD}px; right: ${PAD}px; top: ${PL + 4}px; height: ${STRIP}px; display: flex; align-items: center; padding: 0 26px; box-sizing: border-box; border-radius: 3px;
  background: ${GLOSS}, linear-gradient(rgba(22,30,40,.94), rgba(6,10,16,.94)); box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.18); font-size: 40px; line-height: 1; color: #dfe8f2; }
.sb-nfl-foxsb-20 .strip .q { width: 110px; } .sb-nfl-foxsb-20 .strip .q .sb-ord { font-size: .78em; }
.sb-nfl-foxsb-20 .strip .clk { width: 170px; }
.sb-nfl-foxsb-20 .strip .dn { flex: 1; text-align: center; color: #fff; }
.sb-nfl-foxsb-20 .strip .w { flex: 1; text-align: center; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const pls = el('div', 'pls');
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k]) => {
      const c = teamColor(t, '#4a4f57');
      const pl = el('div', 'pl ' + k);
      // the plate's colour with a soft light top and a thin lighter frame, as on air
      pl.style.background = 'linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,0) 50%, rgba(0,0,0,.14)), ' + c;
      pl.style.boxShadow = 'inset 0 0 0 3px ' + shade(c, 0.35) + ', 0 3px 8px rgba(0,0,0,.45)';
      pl.style.color = inkOn(c) === '#111' ? shade(c, -0.75) : '#fff';
      let sc;
      if (g.status === 'pre') sc = el('span', 'sc rec', t.record || '');
      else {
        sc = scoreSlot(el('span', 'sc', ''), g);
        const n = document.createTextNode(t.score != null ? String(t.score) : '');
        // the dot sits on the score's inner side, towards the other team
        if (live && t.hasBall) { if (k === 'a') sc.append(el('i', 'ball'), n); else sc.append(n, el('i', 'ball')); } else sc.appendChild(n);
        sc.style.justifyContent = k === 'a' ? 'flex-end' : 'flex-start';
      }
      pl.append(logo(t, 160), sc);
      pls.appendChild(pl);
    });
    const strip = el('div', 'strip');
    if (live) {
      const q = el('span', 'q'); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase()));
      strip.append(q, el('span', 'clk', g.clock || ''), el('span', 'dn', g.football && g.football.short ? g.football.short : ''));
    } else strip.appendChild(el('span', 'w', statusText(g, time).toUpperCase()));
    root.append(pls, strip);
  },
};
