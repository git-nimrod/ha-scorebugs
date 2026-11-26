// "Medallion '26": after the Sunday-night NFL scorebar on NBC (2026 playoffs on). A glassy bar in two team-colour halves, each lit
// silver at its outer end where the big logo sits, the team's letters and record, a big score with three timeout dashes, and a round dark
// medallion in the middle with the clock over the quarter. The down and distance hangs under the team with the ball, between chevrons.
// The network's mark at the top of the medallion becomes the Home Assistant logo. The outer ends sweep down to a point; wide, heavy
// type (Saira, expanded).
import { el, logo, ordinal, pips, statusText, teamColor, shade, haMark, marks, FONTS, teamInk } from '../kit.js';

// (Nov 23 sweep) measured on the frame: the bar 1 : 12.8 (57 of 730 px), the medallion about twice the bar's height across
const W = 780, H = 126, BAR_T = 30, BAR_H = 61, R = 60;
// the logo big at the bar's outer end, cut by the bar's top and bottom and its swept end, as on air
const LOGO_W = 170, LOGO_H = 96,  // bigger, the room the scores gave up
  SCORE_PX = 44, ABBR_PX = 27, CLOCK_PX = 25;


// the team letters' width to the frame's
const LETTERS = { stretch: 125, track: 5 };
// before the kick-off: the divider and the score room (6 + 116 px) go, the letters keep 34 px clear of the medallion
const PRE_CUT = 88;
// a three-figure score (basketball, a football shoot-out): each half 30 px longer and its score room with it, so the score keeps its
// size clear of the medallion and nothing else in the half moves
const BIG = 30, big = (g) => g.status !== 'pre' && [g.away.score, g.home.score].some((v) => v != null && v >= 100);

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.shape.away > div.half.away > div.sc', 1, 2, 0],
  ['div.shape.home > div.half.home > div.sc', -2.5, 2, 0],
  ['div.shape.away > div.half.away > div.id > div.ab', 6.5, -1.5, 0],
  ['div.shape.home > div.half.home > div.id > div.ab', -6.5, 0, 0],
  ['div.med > div.clk', 0, 2, 0],
];

export default {
  id: 'nfl-medallion-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: both halves close up on the medallion, so the bar is shorter
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * PRE_CUT : W + (big(g) ? 2 * BIG : 0), h: H }),
  // measured against the frame by the automatic audit: text -27% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  nudge: NUDGE,
  fonts: [FONTS.lexend, FONTS.interTight],
  css: `
.sb-nfl-medallion-26 { font-family: 'SB Lexend', 'Arial Black', sans-serif; font-stretch: 115%; color: #fff; }
/* face: NBC SNF 2022-26: Lexend Bold */
.sb-nfl-medallion-26 .shape { position: absolute; top: ${BAR_T}px; height: ${BAR_H}px; width: ${W / 2 - 20}px; filter: drop-shadow(0 3px 5px rgba(0,0,0,.5)); }
.sb-nfl-medallion-26 .shape.away { left: 0; } .sb-nfl-medallion-26 .shape.home { right: 0; }
.sb-nfl-medallion-26 .half { position: absolute; inset: 0; display: grid; grid-template-rows: ${BAR_H}px; align-items: center; overflow: hidden;
  box-shadow: inset 0 2px 0 rgba(255,255,255,.55), inset 0 -3px 0 rgba(0,0,0,.35); }
.sb-nfl-medallion-26 .half.away { clip-path: path('M ${W / 2 - 20} 0 L 70 0 Q 18 0 0 ${BAR_H} L ${W / 2 - 20} ${BAR_H} Z'); grid-template-columns: 1fr auto 6px 104px; }
.sb-nfl-medallion-26 .half.home { clip-path: path('M 0 0 L ${W / 2 - 90} 0 Q ${W / 2 - 38} 0 ${W / 2 - 20} ${BAR_H} L 0 ${BAR_H} Z'); grid-template-columns: 104px 6px auto 1fr; }
.sb-nfl-medallion-26 .sb-logo { width: ${LOGO_W}px; height: ${LOGO_H}px; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); }
.sb-nfl-medallion-26 .away .sb-logo { margin: 0 0 0 6px; justify-self: start; } .sb-nfl-medallion-26 .home .sb-logo { margin: 0 6px 0 0; justify-self: end; }
.sb-nfl-medallion-26 .half::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 45%, rgba(0,0,0,0) 52%, rgba(0,0,0,.18)); }
.sb-nfl-medallion-26 .med .sb-ha { color: #e9ecef; position: absolute; top: 9px; left: 50%; transform: translateX(-50%); }
.sb-nfl-medallion-26 .id { display: grid; line-height: 1; }
.sb-nfl-medallion-26 .away .id { justify-items: start; padding-right: 16px; } .sb-nfl-medallion-26 .home .id { justify-items: end; padding-left: 16px; }
.sb-nfl-medallion-26 .ab { font-weight: 800; font-size: ${ABBR_PX}px; letter-spacing: .5px; text-shadow: 0 2px 2px rgba(0,0,0,.45); }
.sb-nfl-medallion-26 .ab sup { font-size: 17px; vertical-align: 14px; margin-right: 2px; font-weight: 700; }
.sb-nfl-medallion-26 .rec { font-weight: 600; font-size: 18px; margin-top: 2px; opacity: .92; }
.sb-nfl-medallion-26 .sep { width: 2px; height: 46px; background: rgba(255,255,255,.35); justify-self: center; }
.sb-nfl-medallion-26 .sc { position: relative; height: 100%; box-sizing: border-box; padding-bottom: 14px; display: grid; place-items: center; line-height: 1; font-weight: 800; font-size: ${SCORE_PX}px; font-stretch: 105%; text-shadow: 0 2px 3px rgba(0,0,0,.5); }
/* the medallion covers 38 px of each half: the scores keep about 18 px clear of its rim, as on air (they ran into it) */
/* the scores close up against the medallion, just clear of its rim */
.sb-nfl-medallion-26 .away .sc { padding-right: 42px; } .sb-nfl-medallion-26 .home .sc { padding-left: 42px; }
/* a half whose parts are wider than it (a wide set of letters such as PHX or CGY, a three-figure score) runs over at its outer end,
 where the swept end cuts the logo, as the home half always did: the away half ran over towards the medallion, so the letters went
 under it before the game */
.sb-nfl-medallion-26 .half.away { justify-content: end; }
/* the letters and the record never break (a long record, 10-14-1, broke at its dashes when a half ran over) */
.sb-nfl-medallion-26 .id { white-space: nowrap; }
/* every text white */
.sb-nfl-medallion-26 .half, .sb-nfl-medallion-26 .rec, .sb-nfl-medallion-26 .sc { color: #fff !important; }
.sb-nfl-medallion-26 .sb-pips { position: absolute; bottom: 6px; display: flex; justify-content: center; gap: 6px; }
.sb-nfl-medallion-26 .away .sb-pips { left: 0; right: 42px; } .sb-nfl-medallion-26 .home .sb-pips { left: 42px; right: 0; }
.sb-nfl-medallion-26 .sb-pips i { width: 22px; height: 4px; background: #f4f4f4; border-radius: 1px; } .sb-nfl-medallion-26 .sb-pips i.used { opacity: .22; }
.sb-nfl-medallion-26 .med { position: absolute; left: ${W / 2 - R}px; top: 0; width: ${2 * R}px; height: ${2 * R}px; border-radius: 50%; box-sizing: border-box;
  border: 3px solid #c6cacf; background: radial-gradient(circle at 50% 30%, #55595f, #26282c 62%, #17181a); box-shadow: 0 3px 10px rgba(0,0,0,.6), inset 0 0 0 2px rgba(0,0,0,.5);
  display: grid; align-content: center; justify-items: center; padding-top: 16px; }
.sb-nfl-medallion-26 .clk { font-weight: 800; font-size: ${CLOCK_PX}px; font-stretch: 100%; line-height: 1; letter-spacing: -.5px; }
.sb-nfl-medallion-26 .per { font-weight: 800; font-size: 20px; line-height: 1.15; margin-top: 3px; border-top: 2px solid rgba(255,255,255,.35); padding: 2px 8px 0; }
.sb-nfl-medallion-26 .sb-ord { font-size: .62em; vertical-align: 5px; text-decoration: underline; text-underline-offset: 2px; }
.sb-nfl-medallion-26 .when { font-weight: 800; font-size: 20px; text-align: center; line-height: 1.15; padding: 0 8px; }
.sb-nfl-medallion-26 .dd { position: absolute; top: ${BAR_T + BAR_H}px; height: 32px; width: 330px; display: flex; align-items: center; justify-content: center; gap: 16px;
  font-weight: 700; font-size: 22px; border-radius: 0 0 8px 8px; box-shadow: 0 3px 6px rgba(0,0,0,.45); }
.sb-nfl-medallion-26 .dd i { font-style: normal; font-size: 13px; letter-spacing: -3px; opacity: .65; }
/* the team letters: a bold grotesque set tight, larger and white, as on air (no source names NBC's face, Inter Tight is the nearest open one) */
.sb-nfl-medallion-26 .ab { font-family: 'SB Inter Tight', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 100%; letter-spacing: -.5px; font-size: ${Math.round(ABBR_PX * 1.55)}px; color: #fff !important; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const w = pre ? W - 2 * PRE_CUT : W + (big(g) ? 2 * BIG : 0), SW = w / 2 - 20;
    const half = (t, side) => {
      const c = teamColor(t, '#3a3f47');
      const box = el('div', 'shape ' + side), h = el('div', 'half ' + side); box.appendChild(h);
      if (pre || big(g)) {   // the same swept ends on the shorter (or longer) halves
        box.style.width = SW + 'px';
        h.style.clipPath = side === 'away' ? "path('M " + SW + " 0 L 70 0 Q 18 0 0 " + BAR_H + " L " + SW + ' ' + BAR_H + " Z')"
          : "path('M 0 0 L " + (SW - 70) + ' 0 Q ' + (SW - 18) + ' 0 ' + SW + ' ' + BAR_H + ' L 0 ' + BAR_H + " Z')";
        if (pre) h.style.gridTemplateColumns = side === 'away' ? '1fr auto' : 'auto 1fr';
      }
      // silver at the outer end, the team colour through the middle, darker towards the medallion
      const dir = side === 'away' ? '90deg' : '270deg';
      h.style.background = 'linear-gradient(' + dir + ', #eef0f2 0, ' + shade(c, 0.25) + ' 120px, ' + c + ' 230px, ' + shade(c, -0.45) + ' 100%)';
      h.style.color = teamInk(shade(c, 0.12));   // the letters sit where the pale end turns into the team colour
      const id = el('div', 'id');
      const ab = el('div', 'ab');
      if (t.rank) ab.appendChild(el('sup', '', String(t.rank)));
      ab.appendChild(document.createTextNode(t.abbr));
      id.appendChild(ab);
      if (t.record) id.appendChild(el('div', 'rec', t.record));
      const sc = el('div', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      sc.style.color = teamInk(shade(c, -0.3));   // the score sits towards the bar's dark end
      if (g.sport === 'football' && live) sc.appendChild(pips(t.timeouts, 3));
      if (pre) id.style[side === 'away' ? 'paddingRight' : 'paddingLeft'] = '50px';
      if (big(g)) { h.style.gridTemplateColumns = side === 'away' ? '1fr auto 6px 134px' : '134px 6px auto 1fr'; sc.style[side === 'away' ? 'paddingRight' : 'paddingLeft'] = '48px'; }   // (6 px more off the medallion's rim)
      const parts = pre ? [logo(t, 168), id] : [logo(t, 168), id, el('span', 'sep'), sc];
      h.append(...(side === 'away' ? parts : parts.reverse()));
      return box;
    };
    root.append(half(g.away, 'away'), half(g.home, 'home'));
    const med = el('div', 'med'); med.style.left = (w / 2 - R) + 'px';
    if (marks(opts).ha) med.appendChild(haMark(24));   // the network's mark sat at the top of the medallion
    if (live) {
      if (g.clock) med.appendChild(el('div', 'clk', g.clock));
      const per = el('div', 'per'); per.appendChild(ordinal(g.period)); med.appendChild(per);
    } else med.appendChild(el('div', 'when', statusText(g, time)));
    root.appendChild(med);
    const ball = g.away.hasBall ? 'away' : g.home.hasBall ? 'home' : null;
    if (live && g.football && g.football.short && ball) {
      const c = teamColor(g[ball], '#2a2d33');
      const dd = el('div', 'dd');
      dd.style.background = 'linear-gradient(' + shade(c, -0.35) + ', ' + shade(c, -0.6) + ')';
      // flush with the bar's outer end, never past its corner
      dd.style.left = (ball === 'away' ? 0 : w / 2 + R + 10) + 'px'; dd.style.width = (w / 2 - R - 10) + 'px';
      const chev = (s) => el('i', '', s);
      dd.append(chev(ball === 'away' ? '▶▶' : '◀◀'), el('span', '', g.football.short.replace(/^(\d)(ST|ND|RD|TH)/, (m, n, s) => n + s.toLowerCase())), chev(ball === 'away' ? '▶▶' : '◀◀'));
      root.appendChild(dd);
    }
  },
};
