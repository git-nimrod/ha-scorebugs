// "Silver bar '06": after the Sunday night NFL bar of about 2006-2011 (frame: an NFL scorebugs-through-the-years montage, Saints at
// Seahawks). A dark glossy bar between square chrome end caps. The network's badge stood over the left end, bigger than the bar: here a
// chrome badge with the Home Assistant logo. Each team: a big logo, its letters, and its score in its own framed box right beside them,
// with white timeout dashes on a dark strip below; then a bright silver plate with the down and distance, and the quarter and the clock.
// Soft picture by default.
import { el, logo, pips, statusText, haMark, marks, teamColor, shade, FONTS, GLOSS, fit } from '../kit.js';

const W = 1240, H = 104, BT = 16, BH = 72, DD_ROOM = 240 + 8;   // the silver down plate's width (it fills the rest) and its gap
// measured against the frame, frame size / mine: Saints at Seahawks
const TYPE = { score: 1.17, letters: 1.10, clock: 1.06, logo: 0.49 };

// the team letters' width to the frame's
const LETTERS = { stretch: 114 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  // (on the away side they pushed the letters under the score)
];

export default {
  id: 'nfl-silver-06',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // the silver down-and-distance plate only while the game is on: it stood empty before the game and said FINAL twice after it, so outside play it goes and the bar closes up
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: g.status === 'live' && g.football ? W : W - DD_ROOM, h: H }),
  // measured against the frame by the automatic audit: text -21% vs the broadcast, logos -14%; 80 % of the correction
  typeScale: 1.0, logoScale: 1.13,
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.montserrat],
  css: `
.sb-nfl-silver-06 { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 110%; color: #fff; }
.sb-nfl-silver-06 { font-weight: 700; font-stretch: 100%; }   /* face: Montserrat 700 (low confidence) */
.sb-nfl-silver-06 .bar { position: absolute; left: 24px; right: 24px; top: ${BT}px; height: ${BH}px; background: ${GLOSS}, linear-gradient(#3b3f45, #101215); display: flex; align-items: center; gap: 8px;
  padding: 0 18px 0 150px; box-sizing: border-box; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nfl-silver-06 .cap { position: absolute; top: ${BT - 4}px; height: ${BH + 8}px; width: 34px; border-radius: 6px; background: ${GLOSS}, linear-gradient(#2a2c30, #08090a); box-shadow: 0 2px 5px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,255,255,.18); }
.sb-nfl-silver-06 .badge { position: absolute; left: 30px; top: 0; width: 120px; height: ${H}px; background: #c9ced5; display: grid; place-items: center;
  clip-path: polygon(14% 0, 86% 0, 100% 12%, 100% 72%, 82% 100%, 18% 100%, 0 72%, 0 12%); filter: drop-shadow(0 3px 5px rgba(0,0,0,.55)); }   /* the network's badge: a dark shield with chamfered corners in a silver rim, as on air */
.sb-nfl-silver-06 .badge::before { content: ''; position: absolute; inset: 3px; background: linear-gradient(#3e4248, #16181b 55%, #0b0c0e);
  clip-path: polygon(14% 0, 86% 0, 100% 12%, 100% 72%, 82% 100%, 18% 100%, 0 72%, 0 12%); }
.sb-nfl-silver-06 .badge .sb-ha { position: relative; color: #f2f3f5; }
.sb-nfl-silver-06 .tm { flex: none; display: flex; align-items: stretch; gap: 4px; position: relative; height: 58px; }   /* never squeezed: a squeezed team slid its letters under the score */
.sb-nfl-silver-06 .tm .nm { width: 214px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 0; box-sizing: border-box; border: 2px solid rgba(255,255,255,.28); background: ${GLOSS}, rgba(255,255,255,.07); overflow: visible; }
.sb-nfl-silver-06 .tm .lgp { width: 112px; align-self: stretch; display: grid; place-items: center; overflow: hidden; }
.sb-nfl-silver-06 .tm .lgp { grid-template-rows: minmax(0, 1fr); }
.sb-nfl-silver-06 .tm .sb-logo { align-self: center; width: 104px; height: 104px; margin: -14px 0; object-fit: contain; filter: drop-shadow(0 2px 2px rgba(0,0,0,.5)); }   /* whole from side to side, cut only top and bottom by its panel */
.sb-nfl-silver-06 .tm .ab { font-size: ${32 * TYPE.letters}px; flex: 1; min-width: 0; white-space: nowrap; text-align: right; }
.sb-nfl-silver-06 .tm .s { width: 62px; display: grid; place-items: center; font-size: ${34 * TYPE.score}px; line-height: 1; padding-top: 2px; box-sizing: border-box; border: 2px solid rgba(255,255,255,.55); background: ${GLOSS}, #0c0d0f; }
.sb-nfl-silver-06 .tm .sb-pips { position: absolute; left: 0; width: 186px; bottom: -11px; display: flex; justify-content: center; gap: 8px; }
.sb-nfl-silver-06 .tm .sb-pips i { width: 28px; height: 4px; background: #fff; } .sb-nfl-silver-06 .tm .sb-pips i.used { opacity: .2; }
.sb-nfl-silver-06 .dd { flex: 1; min-width: 0; white-space: nowrap; height: 52px; border-radius: 6px; background: linear-gradient(#ffffff, #dfe3e6 50%, #b9bfc5); color: #111; display: grid; place-items: center; font-size: 30px; box-shadow: inset 0 0 0 2px rgba(0,0,0,.25); }
.sb-nfl-silver-06 .ck { width: 200px; height: 56px; display: flex; align-items: center; justify-content: space-around; font-size: ${32 * TYPE.clock}px; border: 3px solid #9aa1a8; box-shadow: inset 0 0 0 1px rgba(0,0,0,.6); box-sizing: border-box;
  background: ${GLOSS}, #0c0d0f; color: #fff; }   /* the quarter and clock on black, as on air (frame: about 19,13,20 inside the rim) */
.sb-nfl-silver-06 .ck .sb-ord { font-size: .62em; vertical-align: 10px; }
.sb-nfl-silver-06 .tm .ab { font-stretch: ${LETTERS.stretch}%; }
/* the timeout dashes on a dark strip hanging under the whole team (letters and score), long slanted dashes from a little way in, as on
 air (frame: strip about a third of the panel's height, dashes about a sixth of the team's width) */
.sb-nfl-silver-06 .tm .sb-pips { left: 2px; right: 2px; width: auto; top: calc(100% + 7px); bottom: auto; height: 12px; justify-content: flex-start; align-items: center; gap: 16px;
  padding-left: 50px; box-sizing: border-box; background: linear-gradient(#1c1e21, #050506); box-shadow: 0 2px 4px rgba(0,0,0,.5); }
.sb-nfl-silver-06 .tm .sb-pips i { width: 44px; height: 5px; transform: skewX(-25deg); } .sb-nfl-silver-06 .tm .sb-pips i.used { opacity: .3; }
/* the down and distance's white face sits in a thick bright silver bezel that stands above and below the bar (frame: bezel about a
   third of the face's height top and bottom) */
.sb-nfl-silver-06 .dd { height: 80px; border: 14px solid transparent; border-width: 14px 10px; border-radius: 8px; box-sizing: border-box;
  background: linear-gradient(#ffffff, #dfe3e6 50%, #b9bfc5) padding-box, linear-gradient(#f6f7f8, #a3aab1 48%, #cfd3d7 60%, #8a9198) border-box;
  box-shadow: 0 2px 5px rgba(0,0,0,.5), inset 0 0 0 1px rgba(0,0,0,.3); }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live';
    const l = el('i', 'cap'); l.style.left = '0'; const r = el('i', 'cap'); r.style.right = '0';
    const bar = el('div', 'bar');
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'tm'), nm = el('div', 'nm');
      // the logo on a gradient of the team's colour, fading into the dark panel
      const c = teamColor(t, '#555'), lgp = el('span', 'lgp'); lgp.style.background = 'linear-gradient(90deg, ' + shade(c, 0.05) + ' 0%, ' + c + ' 45%, ' + shade(c, -0.55) + ' 80%, #000 100%)';
      const lo = logo(t, 104); lgp.appendChild(lo);
      nm.append(lgp, fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      // the colour runs from behind the logo across the letters, black by the middle of them
      lgp.style.background = 'transparent';
      nm.style.background = 'linear-gradient(90deg, ' + shade(c, 0.05) + ' 0, ' + c + ' 112px, ' + shade(c, -0.6) + ' 150px, #000 175px)';
      tm.append(nm, el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''));
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      bar.appendChild(tm);
    });
    if (live && g.football) bar.appendChild(fit(el('div', 'dd', g.football && g.football.short ? g.football.short : '')));
    const ck = el('div', 'ck');
    if (live) { const q = el('span'); q.append(document.createTextNode(g.period.label || ''), el('span', 'sb-ord', g.period.suffix || '')); ck.append(q, el('span', '', g.clock || '')); }
    else ck.appendChild(el('span', '', statusText(g, time)));
    bar.appendChild(ck);
    root.append(l, r, bar);
    if (mk.ha) { const b = el('div', 'badge'); b.appendChild(haMark(62)); root.appendChild(b); }
  },
};
