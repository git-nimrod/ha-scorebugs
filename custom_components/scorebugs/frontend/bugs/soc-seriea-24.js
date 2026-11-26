// "Navy slants '24": after Lega Serie A's world-feed bug (2024 on; frame: reference pack SOC0236-seriea, Torino v Roma, 09:42).
// The league's gem logo at the left, in a thick white outline that joins the white clock box (the outlined logo is the bug's left edge),
// taller than the bar and overhanging it below; the match clock on white, then the home team's letters, the score ("0-0") on white and
// the away team's letters, every box a parallelogram leaning the same way.
// "The logo is the outlined edge. TOR should have a team color, roma should too on the outside": the name boxes
// carry each team's colour (navy on air in every frame; his call stands over the frames).
// Measured: every slanted side leans 23.7 deg ("/"), boxes at
// mid-height clock 105 / names 63 and 65 / score 62 wide; clock cap 0.52 of the bar (#1a2238), letters and figures the same.
// Measured on the 1080p still (bar 51 px there, so x 1.137 here): sides lean 23.5 deg; the outlined logo 85 px tall
// (1.67 of the bar), its top 8 px above the bar and its foot 26 px below; the white outline 5-6 px round the gem (9 at the tip);
// every box flat (no sheen, no rim: grid spots within 1 L); names at mid-height 100 / score 97 / 100 wide.
import { el, soccerClock, homeFirst, leagueLogo, marks, teamPair, panelInk, FONTS, scoreSlot, fit } from '../kit.js';

const BT = 9, BH = 58, L = 26, HL = L / 2, H = 97;
// each box's left and right at the bar's mid-height
const CK = [40, 233], HN = [233, 343], SC = [343, 451], AN = [451, 564];
const W = AN[1] + HL + 2;
const box = (m) => 'left: ' + (m[0] - HL) + 'px; width: ' + (m[1] - m[0] + L) + 'px;';
// the logo: ESPN's file is the gem over the league's name on a white tile (500 px); drawn 160 px, the tile cut to the gem's outline
// (the gem 152-347 across, 45-300 down; the outline about 19 units outside it, so 6 px here)
const LS = 160, LX = -43, LY = -8;
const OUT = 'polygon(44.4% 5.2%, 55.4% 5.2%, 73.2% 46.4%, 50% 63.2%, 26.6% 46.4%)';

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-seriea-24',
  size: { w: W, h: H },
  fonts: [FONTS.figtree],
  css: `
.sb-soc-seriea-24 { font-family: 'SB Figtree', Arial, sans-serif; font-weight: 600; color: #fff; }
.sb-soc-seriea-24 .b { position: absolute; top: ${BT}px; height: ${BH}px; display: grid; place-items: center; white-space: nowrap; overflow: hidden; line-height: 1;
  clip-path: polygon(${L}px 0, 100% 0, calc(100% - ${L}px) 100%, 0 100%); box-sizing: border-box; padding: 0 ${L + 4}px; font-size: 43px; }
/* the clock's left end is square (it runs under the logo's white outline) */
.sb-soc-seriea-24 .ck { left: ${CK[0]}px; width: ${CK[1] + HL - CK[0]}px; background: #fbfdfd; color: #1a2238; font-weight: 700; letter-spacing: -.04em; font-variant-numeric: tabular-nums;
  clip-path: polygon(0 0, 100% 0, calc(100% - ${L}px) 100%, 0 100%); padding: 0 ${L}px 0 44px; }
.sb-soc-seriea-24 .ck.when { font-size: 28px; }
.sb-soc-seriea-24 .hn { ${box(HN)} } .sb-soc-seriea-24 .an { ${box(AN)} }
.sb-soc-seriea-24 .sc { ${box(SC)} background: #fbfdfe; color: #1a2238; display: flex; justify-content: center; align-items: center; gap: 2px; }
.sb-soc-seriea-24 .sc .d { font-size: .85em; }
.sb-soc-seriea-24 .sc .sb-num { min-width: .62em !important; }
/* the gem in its white outline: ESPN's white tile shows only inside the outline's shape, the league's name under the gem is cut away */
.sb-soc-seriea-24 .lg { position: absolute; left: 0; top: 0; width: ${LS + LX}px; height: ${H}px; z-index: 2; }
.sb-soc-seriea-24 .lg .sb-league { position: absolute; left: ${LX}px; top: ${LY}px; width: ${LS}px; height: ${LS}px; object-fit: contain !important; clip-path: ${OUT}; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    const clock = mmss(soccerClock(g, time));
    // each name box in its team's colour (never two alike), white letters where they read, else the team's other colour
    const [ch, ca] = teamPair(h, a, '#0a2255');
    // the box itself is fitted, so a long name is squeezed inside its padding and never runs under the slanted ends
    const name = (t, k, c) => { const n = fit(el('div', 'b ' + k, (t.abbr || '').toUpperCase())); n.style.background = c; n.style.color = panelInk(t, c); return n; };
    const sc = el('div', 'b sc');
    // before the kick-off the two figure slots stay empty: the kit puts each team's record in them
    sc.append(scoreSlot(el('span', '', live && h.score != null ? String(h.score) : ''), g), el('span', 'd', live ? '-' : ''),
      scoreSlot(el('span', '', live && a.score != null ? String(a.score) : ''), g));
    root.append(el('div', 'b ck' + (clock.length > 5 ? ' when' : ''), clock), name(h, 'hn', ch), sc, name(a, 'an', ca));
    if (mk.league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, LS)); root.appendChild(lg); }
  },
};
