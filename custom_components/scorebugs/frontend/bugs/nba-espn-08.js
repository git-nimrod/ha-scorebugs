// "Red slant '08": after ESPN's NBA bug (2008; frame: Suns v Spurs). A long red bar with a dark streak through it: the network's mark at
// the left end (here the Home Assistant logo), then each team's letters in white on the red and its score on a white plate slanted at both
// ends, then the quarter and the clock in white. The shot clock is left out (no data).
// Surface: the bar is black chrome, red only where the network's mark sits at the left and in a glow at
// the right end; the mark itself white on that red.
import { el, ordinal, dropShadow, statusText, haMark, marks, scoreSlot, FONTS, CHROME_DARK } from '../kit.js';

const W = 1010, H = 58, MARK = 170, ABBR = 120, PLATE = 150;
const ABBR_PX = 32, SCORE_PX = 34, CLOCK_PX = 32, SLANT = 22;

export default {
  id: 'nba-espn-08',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -32% vs the broadcast; 80 % of the correction
  typeScale: 1.274,
  fonts: [FONTS.archivo],
  css: `
.sb-nba-espn-08 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 112%; color: #fff; }
.sb-nba-espn-08 { font-weight: 700; font-stretch: 115%; }   /* face: Archivo 700 at 115% width (low confidence) */
.sb-nba-espn-08 .bar { position: absolute; inset: 0; display: flex; align-items: center; gap: 10px; padding: 0 30px 0 0; border-radius: 4px;
  background: #000; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
/* (black all along) */
  clip-path: polygon(0 0, 100% 0, calc(100% - 30px) 100%, 0 100%); }
/* the frame's black is a red-black (maroon tint over the chrome) and the bar's right end is cut on a slant */
.sb-nba-espn-08 { box-shadow: ${dropShadow(9, 27)}; }
.sb-nba-espn-08 .mk { width: ${MARK}px; height: 100%; display: grid; place-items: center; background: linear-gradient(#ec3a30, #b0160f 60%, #d0231b); clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%); }
.sb-nba-espn-08 .mk .sb-ha { color: #fff; }
.sb-nba-espn-08 .ab { align-self: stretch; display: flex; align-items: center; justify-content: center; background: #000; }
/* the period on black; the time (or the start time, or FINAL) on a red plate the same slanted shape as the white score plates */
.sb-nba-espn-08 .ck { align-self: stretch; display: flex; align-items: center; justify-content: center; background: #000; }
.sb-nba-espn-08 .ck .tm, .sb-nba-espn-08 .ck .w { height: 40px; display: grid; place-items: center; padding: 0 22px; line-height: 1;   /* centred in the plate */
  color: #fff !important; background: linear-gradient(#ec3a30, #b0160f 60%, #d0231b);
  clip-path: polygon(${SLANT}px 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%); }
.sb-nba-espn-08 .ck { padding: 0 22px; }
.sb-nba-espn-08 .ab { width: ${ABBR}px; text-align: center; font-size: ${ABBR_PX}px; letter-spacing: 1px; text-shadow: 0 2px 2px rgba(0,0,0,.4); }
.sb-nba-espn-08 .pl { width: ${PLATE}px; height: 40px; display: grid; place-items: center; background: #fff; color: #000;   /* clean white plates, no border */
 
  clip-path: polygon(${SLANT}px 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%); font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nba-espn-08 .ck { margin-left: 24px; display: flex; align-items: center; gap: 26px; font-size: ${CLOCK_PX}px; text-shadow: 0 2px 2px rgba(0,0,0,.4); }
.sb-nba-espn-08 .ck .tm { color: #f6c2c0; }   /* the running clock in a light red, as on air (9:43) */
.sb-nba-espn-08 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nba-espn-08 .sb-ord { font-size: .62em; vertical-align: .5em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(40));
    bar.appendChild(mk);
    [g.away, g.home].forEach((t) => bar.append(el('span', 'ab', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'pl', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g)));
    const ck = el('div', 'ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', 'tm', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(ck);
    root.appendChild(bar);
  },
};
