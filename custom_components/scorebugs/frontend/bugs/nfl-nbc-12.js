// "Chrome caps '12": after NBC's Sunday Night Football bug (2012-15; frame: Steelers at Cardinals). A silver chrome bar with rounded
// end caps: the network's mark in a dark capsule at the left (here the Home Assistant logo); each team as a dark plate with a silver rim
// holding its logo and letters, its score in a black box beside it, and a thin bar under the plate for its timeouts; then the down and
// distance in a white capsule and the quarter and the clock in a dark box.
import { el, logo, ordinal, statusText, haMark, marks, scoreSlot, teamColor, shade, FONTS } from '../kit.js';

const W = 1180, H = 84, BAR = 54,   // the stage taller than the bar: the network's badge stands out over it, as on air
  MARK = 120, PLATE = 200, SCORE = 66, DOWN = 250, CLOCK = 190;
const ABBR_PX = 30, SCORE_PX = 32, DOWN_PX = 26, CLOCK_PX = 30;

export default {
  id: 'nfl-nbc-12',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // the white down-and-distance capsule only while the game is on: before and after it the capsule goes and the bar closes up (it stood
  // empty before the game, and after it)
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: g.status === 'live' && g.football ? W : W - DOWN - 6, h: H }),
  fonts: [FONTS.montserrat],
  css: `
.sb-nfl-nbc-12 { font-family: 'SB Montserrat', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 92%; color: #fff; }
.sb-nfl-nbc-12 { font-weight: 700; font-stretch: 100%; }   /* face: Montserrat 700 (low confidence) */
.sb-nfl-nbc-12 .bar { position: absolute; left: 0; top: ${(H - BAR) / 2}px; width: 100%; height: ${BAR}px; box-sizing: border-box; padding: 5px 22px; border-radius: ${BAR / 2}px;
  background: linear-gradient(#f6f7f8, #a6abb1 50%, #c9cdd1 55%, #858a90); display: flex; align-items: center; gap: 6px; box-shadow: 0 3px 6px rgba(0,0,0,.5); }
/* the network's badge: a dark shield with chamfered corners in a silver rim, taller than the bar, standing out over it */
.sb-nfl-nbc-12 .mk { position: relative; width: ${MARK}px; height: ${H}px; margin: -${(H - BAR) / 2 + 5}px 0; flex: none; display: grid; place-items: center; background: linear-gradient(#f4f6f8, #b9bec6 45%, #8d939b 55%, #d7dbe0);   /* a metal rim */
  clip-path: polygon(14% 0, 86% 0, 100% 14%, 100% 70%, 82% 100%, 18% 100%, 0 70%, 0 14%); filter: drop-shadow(0 3px 5px rgba(0,0,0,.5)); }
.sb-nfl-nbc-12 .mk::before { content: ''; position: absolute; inset: 3px; background: linear-gradient(#3e4248, #16181b 55%, #0b0c0e); clip-path: inherit; }
.sb-nfl-nbc-12 .mk .sb-ha { position: relative; color: #f2f2f2; }
.sb-nfl-nbc-12 .pl { position: relative; width: ${PLATE}px; height: 100%; flex: none; display: grid; grid-template-columns: 84px 1fr; align-items: center; background: linear-gradient(#4b4f55, #24272b);
  box-shadow: inset 0 0 0 2px #c9cdd1; overflow: hidden; grid-template-rows: minmax(0, 1fr); }   /* the row keeps the plate's height: the bigger logo is cut, the letters stay centred */
/* the logo in its own box inside the plate's rim: as tall as the plate, never painted over the rim */
.sb-nfl-nbc-12 .pl .lw { align-self: stretch; margin: 2px 0 2px 2px; overflow: hidden; display: grid; place-items: center; }
.sb-nfl-nbc-12 .pl .lw .sb-logo { width: 82px; height: 56px; object-fit: contain; }
.sb-nfl-nbc-12 .pl .ab { font-size: ${ABBR_PX}px; text-align: center; letter-spacing: 1px; }
.sb-nfl-nbc-12 .sc { width: ${SCORE}px; height: 100%; flex: none; display: grid; place-items: center; background: linear-gradient(#202226, #050506); box-shadow: inset 0 0 0 2px #c9cdd1; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nfl-nbc-12 .sb-pips { position: absolute; left: 10px; right: 10px; bottom: -8px; display: flex; gap: 6px; } .sb-nfl-nbc-12 .sb-pips i { flex: 1; height: 3px; background: #3a3d42; } .sb-nfl-nbc-12 .sb-pips i.used { opacity: .25; }
.sb-nfl-nbc-12 .dn { width: ${DOWN}px; height: 100%; flex: none; display: grid; place-items: center; border-radius: 6px; background: linear-gradient(#ffffff, #f3f4f6 44%, #c3c7cd 52%, #e9ebee 100%); color: #111;   /* glossy chrome, a bright upper half and a hard horizon */
  font-size: ${DOWN_PX}px; box-shadow: inset 0 0 0 2px #9ea3a9; }
.sb-nfl-nbc-12 .ck { width: ${CLOCK}px; height: 100%; flex: none; display: flex; align-items: center; justify-content: space-evenly; background: linear-gradient(#2f3236, #0d0e10); box-shadow: inset 0 0 0 2px #c9cdd1; font-size: ${CLOCK_PX}px; }
.sb-nfl-nbc-12 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-nbc-12 .sb-ord { font-size: .62em; vertical-align: .5em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(50));  // larger, in the middle of its badge
    bar.appendChild(mk);
    [g.away, g.home].forEach((t) => {
      const pl = el('div', 'pl'), c = teamColor(t, '#4b4f55');
      // the team's colour behind the logo, running into the plate's dark grey under the letters, as on air
      pl.style.background = 'linear-gradient(90deg, ' + shade(c, 0.05) + ', ' + shade(c, -0.2) + ' 34%, #2c2f34 62%, #24272b)';
      const lo = el('span', 'lw'); lo.appendChild(logo(t, 82));
      pl.append(lo, el('span', 'ab', (t.abbr || '').toUpperCase()));
      const pp = el('span', 'sb-pips');
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) pp.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      pl.appendChild(pp);
      bar.append(pl, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
    });
    if (live && g.football) bar.appendChild(el('span', 'dn', g.football && g.football.short ? g.football.short : ''));
    const ck = el('div', 'ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', '', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(ck);
    root.appendChild(bar);
  },
};
