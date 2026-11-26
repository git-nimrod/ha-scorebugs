// "Purple frame '24": after the women's pro hockey league's own world feed of its first season (2024). A bar in the top-left corner
// framed in white: the period on black, the clock in purple figures on white, then each team's letters on its colour with its score on
// black, and between the two scores the league's logo on white. In the Finals (and, here, every post-season round) a purple strip runs over it: the round ("PWHL FINALS -
// GAME 1") over the period, clock and first team, and each team's shots with "SHOTS" between them over the scores and the logo.
// measured (crop px of 823 x 70, season frame): white frame 3 px all round, cells y 3-67; period 3-117, clock 117-289, team 289-421,
// score 421-503, logo 503-606, score 606-688, team 688-820; capitals 30 px (0.43 of the bar), clock figures 36, scores 34; a wide,
// square, heavy face. Team panels lighter at the top (sample.py: +10..+20 L over the top quarter, -9 at the foot); black and white
// cells flat. Finals strip (crop of 772 x 97): 27 px tall, 3 px over the bar, purple #2b0080 with white capitals 13 px; its first part
// ends 20 px short of the first team's end, its second part covers the two scores and the logo.
import { el, ordinal, dressFor, statusText, teamColor, relight, leagueLogo, haMark, marks, abbr3, scoreSlot, FONTS } from '../kit.js';

const K = 960 / 823, P = (x) => Math.round(x * K);
const RIM = P(3), CH = P(64), H = CH + 2 * RIM;
const PER = P(114), CK = P(172), TEAM = P(132), SC = P(82), LG = P(103);
const W = 2 * RIM + PER + CK + 2 * (TEAM + SC) + LG;
const HDR = P(27), HGAP = P(3), PURPLE = '#2b0080';
// the dress is worked out here too: the stage is sized before the kit sets g.dress
const DRESSES = ['regular', 'playoffs', 'finals'];
const strip = (g, o) => (g.dress || dressFor(g, { dresses: DRESSES }, o)) !== 'regular' && !!(g.note || g.series);

export default {
  id: 'pwhl-bar-24',
  size: { w: W, h: H + HDR + HGAP },
  sizeFor: (g, o) => ({ w: W, h: H + (strip(g, o) ? HDR + HGAP : 0) }),
  // the strip in every post-season round (the frame is the Finals; the feed names the round in its note)
  dresses: ['regular', 'playoffs', 'finals'],
  fonts: [FONTS.archivo],
  css: `
.sb-pwhl-bar-24 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; font-stretch: 125%; color: #fff; }
.sb-pwhl-bar-24 .bar { position: absolute; left: 0; bottom: 0; width: ${W}px; height: ${H}px; background: #fdfdfd; padding: ${RIM}px; box-sizing: border-box; display: flex; }
.sb-pwhl-bar-24 .bar > * { height: ${CH}px; display: grid; place-items: center; line-height: 1; white-space: nowrap; }
.sb-pwhl-bar-24 .bar > .pd { flex: 0 0 ${PER}px; background: #000; font-size: ${P(26 / 0.686)}px; display: flex; align-items: center; justify-content: center; }
.sb-pwhl-bar-24 .pd .sb-ord { font-size: 1em; }
.sb-pwhl-bar-24 .ck { flex: 0 0 ${CK}px; background: #fefefe; color: #2c0082; font-size: ${P(36 / 0.686)}px; font-weight: 700; }
.sb-pwhl-bar-24 .w { flex: 0 0 ${PER + CK}px; background: #fefefe; color: #2c0082; font-size: ${P(28 / 0.686)}px; font-weight: 700; }
.sb-pwhl-bar-24 .tm { flex: 0 0 ${TEAM}px; font-size: ${P(28 / 0.686)}px; letter-spacing: 1px; }
.sb-pwhl-bar-24 .sc { flex: 0 0 ${SC}px; background: #000; font-size: ${P(34 / 0.686)}px; font-weight: 700; min-width: 0 !important; }
.sb-pwhl-bar-24 .lg { flex: 0 0 ${LG}px; background: #fffdfe; }
.sb-pwhl-bar-24 .lg .sb-logo, .sb-pwhl-bar-24 .lg .sb-league { width: ${P(86)}px !important; height: ${P(56)}px !important; object-fit: contain; }
.sb-pwhl-bar-24 .lg .sb-league:not(img) { color: #2c0082; font-size: ${P(20)}px; }
.sb-pwhl-bar-24 .lg .sb-ha { color: #2c0082; }
.sb-pwhl-bar-24 .hd { position: absolute; top: 0; height: ${HDR}px; background: ${PURPLE}; display: flex; align-items: center; font-size: ${P(13 / 0.686)}px; font-weight: 700; font-stretch: 112%; line-height: 1; white-space: nowrap; }
.sb-pwhl-bar-24 .hd.r { left: 0; width: ${RIM + PER + CK + TEAM - P(20)}px; justify-content: center; }
.sb-pwhl-bar-24 .hd.s { left: ${RIM + PER + CK + TEAM}px; width: ${2 * SC + LG}px; }
.sb-pwhl-bar-24 .hd.s span { display: grid; place-items: center; } .sb-pwhl-bar-24 .hd.s .n { width: ${SC}px; } .sb-pwhl-bar-24 .hd.s .l { width: ${LG}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    const bar = el('div', 'bar');
    if (live) {
      bar.appendChild(ordinal(g.period, 'pd'));
      bar.appendChild(el('div', 'ck', g.clock || ''));
    } else bar.appendChild(el('div', 'w', statusText(g, time)));
    const team = (t) => {
      const c = teamColor(t, '#4b3a6e');
      const tm = el('div', 'tm', abbr3(t));
      // lit over the top, darker to the foot (measured on both frames)
      tm.style.background = 'linear-gradient(' + relight(c, 14) + ', ' + relight(c, 4) + ' 30%, ' + relight(c, -2) + ' 60%, ' + relight(c, -9) + ')';
      return tm;
    };
    const score = (t) => scoreSlot(el('div', 'sc', !pre && t.score != null ? String(t.score) : ''), g);
    // the league's logo between the scores (its letters where there is none); the Home Assistant logo when only that mark is wanted
    const lg = el('div', 'lg');
    lg.appendChild(mk.league ? leagueLogo(g, P(84)) : mk.ha ? haMark(P(40)) : el('span'));
    bar.append(team(g.away), score(g.away), lg, score(g.home), team(g.home));
    root.appendChild(bar);
    if (strip(g, opts)) {
      const r = el('div', 'hd r', (g.note || g.series || '').toUpperCase());
      root.appendChild(r);
      if (g.away.shots != null && g.home.shots != null && !pre) {
        const s = el('div', 'hd s');
        s.append(el('span', 'n', String(g.away.shots)), el('span', 'l', 'SHOTS'), el('span', 'n', String(g.home.shots)));
        root.appendChild(s);
      }
    }
  },
};
