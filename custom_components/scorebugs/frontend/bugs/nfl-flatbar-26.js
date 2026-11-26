// "Flat bar '26": after ESPN's NFL bug from 2026 (frame: Eagles at Bears, Monday night, Week 3). One long, flat bar: each end in the
// team's colour fading to black towards the middle, the team logos large and cropped at the ends, big scores with three timeout
// dashes under them, and the records small in the lower corners. In the middle a tab in the colour of the team with the ball gives
// the down and distance, above a pale pill with the quarter, the clock and the play clock (the play clock needs data the sensor lacks).
// Rounded, glossy, fine diagonal lines through the team colours, a rim lit in each team's colour; heavy wide type (Saira).
import { el, logo, pips, statusText, teamColor, shade, fit, FONTS, GLOSS, vividColor } from '../kit.js';

const W = 1300, H = 140, BAR = 130, PRE_CUT = 80;   // before the game each side closes up by PRE_CUT and the record takes the score's place
// measured against the frame, frame size / mine: Eagles v Bears (the logo is cut to its artwork, so its box shrinks to keep the frame size)
const TYPE = { logo: 0.55 };   // 0.72 matched the frame's size, but the frame's logo bleeds past the bar; shown whole here

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
];

export default {
  id: 'nfl-flatbar-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -22% vs the broadcast, logos -12%; 80 % of the correction
  typeScale: 1.226, logoScale: 1.11,
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * PRE_CUT : W, h: H }),
  nudge: NUDGE,
  fonts: [FONTS.saira],
  css: `
.sb-nfl-flatbar-26 { font-family: 'SB Saira', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 112%; color: #fff; }
/* face: square, blocky capitals and figures as on air */
.sb-nfl-flatbar-26 .bar { position: absolute; left: 0; top: 0; right: 0; height: ${BAR}px; overflow: hidden; border-radius: 16px; box-shadow: 0 3px 8px rgba(0,0,0,.5);
  border: 3px solid rgba(255,255,255,.3); box-sizing: border-box; }
.sb-nfl-flatbar-26 .lg { position: absolute; top: -40px; width: 300px; height: 210px; display: grid; place-items: center; }
.sb-nfl-flatbar-26 .lg .sb-logo { width: ${300 * TYPE.logo}px; height: ${210 * TYPE.logo}px; object-fit: contain; filter: drop-shadow(0 3px 4px rgba(0,0,0,.45)); }
.sb-nfl-flatbar-26 .sc { position: absolute; top: 8px; width: 170px; display: grid; justify-items: center; font-size: 78px;   /* figures about half the bar tall with the dashes under them, as on air */
   font-stretch: 108%; line-height: 1; text-shadow: 0 3px 3px rgba(0,0,0,.5); }
.sb-nfl-flatbar-26 .sb-pips { display: flex; gap: 14px; margin-top: 4px; } .sb-nfl-flatbar-26 .sb-pips i { width: 30px; height: 6px; background: #f2f2f2; }
.sb-nfl-flatbar-26 .sb-pips i.used { opacity: .25; }
/* records smaller in the corners (caps 0.11 of the bar as on the 2026 stills; were 0.15) */
.sb-nfl-flatbar-26 .rec { position: absolute; bottom: 4px; font-size: 17px; padding: 2px 14px; font-stretch: 108%; }
.sb-nfl-flatbar-26 .rec.away { left: 0; background: linear-gradient(90deg, rgba(0,0,0,.6), rgba(0,0,0,0)); } .sb-nfl-flatbar-26 .rec.home { right: 0; background: linear-gradient(270deg, rgba(0,0,0,.6), rgba(0,0,0,0)); }
/* the down tab: a rounded rectangle as wide as the pill, the team's colour at its ends fading darker to its middle */
/* the down and distance hangs from the bar's top edge as part of it: flush with the top, its foot rounded, and concave shoulders
 curving into the top edge either side */
.sb-nfl-flatbar-26 .tab::before, .sb-nfl-flatbar-26 .tab::after { content: ''; position: absolute; top: 0; width: 16px; height: 16px; background: var(--tc, #3a3f47); }
.sb-nfl-flatbar-26 .tab::before { left: -16px; -webkit-mask: radial-gradient(circle at 0 100%, transparent 15.5px, #000 16px); mask: radial-gradient(circle at 0 100%, transparent 15.5px, #000 16px); }
.sb-nfl-flatbar-26 .tab::after { right: -16px; -webkit-mask: radial-gradient(circle at 100% 100%, transparent 15.5px, #000 16px); mask: radial-gradient(circle at 100% 100%, transparent 15.5px, #000 16px); }
.sb-nfl-flatbar-26 .tab { position: absolute; left: calc(50% - 150px); width: 300px; top: 0; height: 46px; border-radius: 0 0 14px 14px; display: grid; place-items: center; font-size: 25px; line-height: 1; font-stretch: 108%;
  box-shadow: inset 0 -1px 0 rgba(255,255,255,.22), 0 1px 3px rgba(0,0,0,.5); }
.sb-nfl-flatbar-26 .pill { position: absolute; left: calc(50% - 150px); width: 300px; top: 58px; height: 56px; border-radius: 28px; font-stretch: 108%; background: linear-gradient(#f6f6f6, #d8d8d8); color: #151515;
  display: flex; align-items: center; justify-content: center; gap: 26px; font-size: 40px; box-shadow: inset 0 0 0 3px rgba(0,0,0,.35), inset 0 6px 6px rgba(255,255,255,.6); }
.sb-nfl-flatbar-26 .pill .sb-ord { font-size: .62em; vertical-align: 10px; } .sb-nfl-flatbar-26 .pill .w { font-size: 26px; }
.sb-nfl-flatbar-26 .ball .in { position: absolute; left: -10px; top: -14px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 9px solid #fff; }
.sb-nfl-flatbar-26 .ball { position: absolute; top: 0; width: 0; height: 0; border-left: 16px solid transparent; border-right: 16px solid transparent; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    // the end colour stands out: a team whose main colour is near black (the Bears' navy) glows in its bright second colour
    const ca = vividColor(g.away, '#3a3f47'), ch = vividColor(g.home, '#3a3f47');
    const bar = el('div', 'bar');
    // the team's colour only at the very end of the bar, fading to black across the logo: the logo's outer side on the colour, its inner
    // side on black (sampled on the frame: solid for the last ~4 %, near black by ~15 %)
    // only behind the logo's outer side: solid for the first 3 %, gone by 7 %, so a wide logo's inner side (the Falcons' wing) is on black
    // each team's colour a curved patch hugging the bar's end behind the logo's outer side, not a straight fade through the logo
    const end = (c, at) => 'radial-gradient(ellipse 170px 150px at ' + at + ' 0%, ' + shade(c, 0.15) + ' 0%, ' + c + ' 45%, ' + shade(c, -0.5) + ' 72%, rgba(11,12,14,0) 100%)';
    bar.style.background = GLOSS + ', ' + end(ca, '0%') + ', ' + end(ch, '100%') + ', #0b0c0e';
    bar.style.borderColor = 'transparent'; bar.style.boxShadow = '0 3px 8px rgba(0,0,0,.5), inset 3px 0 0 ' + shade(ca, 0.4) + ', inset -3px 0 0 ' + shade(ch, 0.4) + ', inset 0 2px 0 rgba(255,255,255,.35)';
    const cut = g.status === 'pre' ? PRE_CUT : 0, Wp = W - 2 * cut;
    // the scores a touch further from the centre pill than before, as on air
    [['away', -10, 316 - cut, ca], ['home', Wp - 290, Wp - (316 - cut) - 170, ch]].forEach(([side, lx, sx, c]) => {
      const t = g[side];
      const lg = el('div', 'lg'); lg.style.left = lx + 'px'; lg.appendChild(logo(t, 300)); bar.appendChild(lg);
      const sc = el('div', 'sc'); sc.style.left = sx + 'px';
      const v = el('span', '', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : '');
      if (g.status === 'pre') { v.style.fontSize = '54px'; v.style.marginTop = '24px'; }   // the record in the score's place before the game
      v.style.whiteSpace = 'nowrap'; v.style.maxWidth = '210px'; sc.appendChild(fit(v));   // one line always: a long record is squeezed, never broken
      if (live && t.timeouts != null) sc.appendChild(pips(t.timeouts, 3));
      bar.appendChild(sc);
      if (t.record && g.status !== 'pre') bar.appendChild(el('span', 'rec ' + side, t.record));
      if (live && t.hasBall) { const b = el('span', 'ball'); b.style.left = (sx + 69) + 'px'; b.style.borderTop = '14px solid ' + shade(c, 0.35); const inner = el('i', 'in'); b.appendChild(inner); bar.appendChild(b); }
    });
    const lead = live ? (g.away.hasBall ? ca : g.home.hasBall ? ch : null) : null;
    if (live && g.football && g.football.short) {
      const tab = el('div', 'tab', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()));
      const tc = lead || '#3a3f47';
      tab.style.setProperty('--tc', shade(tc, 0.12));
      // the team's colour along the bar's top edge, joining the tab
      bar.style.boxShadow = (bar.style.boxShadow ? bar.style.boxShadow + ', ' : '') + 'inset 0 3px 0 ' + shade(tc, 0.12);
      tab.style.background = 'linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,0) 50%), linear-gradient(90deg, ' + shade(tc, 0.12) + ', ' + shade(tc, -0.5) + ' 50%, ' + shade(tc, 0.12) + ')';
      bar.appendChild(tab);
    }
    const pill = el('div', 'pill');
    if (!live) pill.style.top = Math.round((BAR - 56) / 2) + 'px';  // no down tab above it: the pill in the bar's middle
    if (live) { const q = el('span', ''); q.append(document.createTextNode(g.period.label || ''), el('span', 'sb-ord', g.period.suffix || '')); pill.append(q, el('span', '', g.clock || '')); }
    else pill.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(pill);
    root.appendChild(bar);
  },
};
