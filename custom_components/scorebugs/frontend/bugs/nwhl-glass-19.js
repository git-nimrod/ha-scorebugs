// "Glass tiles '19": after the women's pro hockey league stream's bar of 2019 (the NWHL, before the PWHL). A dark glass bar
// in the top centre holding tiles under a glass cover, in groups edged by thin light lines: the league's mark on the dark glass at the
// left (here the league's logo of the game), then each team as a pale logo tile, a panel of its colour with its letters, and its score
// in black on a pale tile, the two teams mirrored about the middle; then the period and the clock on dark tiles.
// measured (crop px of 512 x 37): tiles y 3-34; mark 0-79, edge lines at 82, 238/242 and 400 (1 px, L 70); team group 85-237 (logo tile
// 85-137, panel 139-203, score 205-237), the other mirrored 244-395, period 402-437, clock 439-508; letters capitals 12-13 px (0.35 of
// the bar), scores 15, period 8. Glass (sample.py): dark tiles lit +10..+11 L at the top to a horizon 37-41 %,
// a 6-7 L step, -4..-6 at the foot; pale tiles +12..+13 at the top falling to -12..-14 at the foot (L 91 to 65, horizon 43-50 %, step
// 3-4); team panels a pane lit in the middle: -5..-7 at the top, brightest at about half way, -16..-17 at the foot.
// read on the frame row by row: inside a group the tiles touch (green panel L 52 straight into the
// score tile L 79, no seam); each group's outline is a light line (L 70-90, #dee2e6) 1-2 crop px wide that hugs the tiles with only a
// 1 px dark hairline between, corners barely rounded; the league's mark fills its tile (about 70 of its 79 px across, the full height).
import { el, logo, ordinal, statusText, teamColor, teamInk, glassCover, leagueLogo, haMark, marks, abbr3, scoreSlot, FONTS } from '../kit.js';

const K = 2, P = (x) => Math.round(x * K);
const H = P(37), TOP = P(3), TH = P(31);
const MARK = P(79), LOGO = P(53), TEAM = P(65), SC = P(33), PER = P(35), CK = P(69), GAP = 0, EDGE = P(3);
const GROUP = LOGO + TEAM + SC + 2 * GAP;
// loop pass, his note "bring the outlines together, white": the groups sit one edge apart so each neighbour's outline lands
// on the same 2 px line (one shared white line at every join, as on the frame), and the league's mark is larger
const W = MARK + EDGE + GROUP + EDGE + GROUP + EDGE + PER + GAP + CK + P(3);
const DARK = glassCover('#282e34', { top: 10.5, horizon: 39, step: 6.7, foot: -5 });
const PALE = glassCover('#c4c3c4', { top: 13, mid: 4, horizon: 46, step: 4, foot: -13 });

export default {
  id: 'nwhl-glass-19',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-nwhl-glass-19 { font-family: 'SB Montserrat', Arial, sans-serif; font-weight: 800; color: #fff; }
.sb-nwhl-glass-19 .bar { position: absolute; inset: 0; background: ${DARK.background}; display: flex; align-items: flex-start; padding-top: ${TOP}px; box-sizing: border-box; }
.sb-nwhl-glass-19 .mk { flex: 0 0 ${MARK}px; height: ${TH}px; display: grid; place-items: center; }
.sb-nwhl-glass-19 .mk .sb-league, .sb-nwhl-glass-19 .mk .sb-logo { width: ${P(76)}px; height: ${P(41)}px; object-fit: contain; margin-top: -5px; }
.sb-nwhl-glass-19 .mk .sb-league:not(img) { width: auto; height: auto; font-size: ${P(12)}px; font-style: italic; }
.sb-nwhl-glass-19 .mk .sb-ha { color: #f4f8fd; }
.sb-nwhl-glass-19 .grp { height: ${TH}px; display: flex; gap: ${GAP}px; margin: 0 0 0 ${EDGE}px; position: relative; }
.sb-nwhl-glass-19 .mk { position: relative; margin-left: 4px; flex-basis: ${MARK - 4}px !important; }
.sb-nwhl-glass-19 .mk::before, .sb-nwhl-glass-19 .grp::before { content: ''; position: absolute; inset: -4px; border: 2px solid #fff; border-radius: 3px; pointer-events: none; }
.sb-nwhl-glass-19 .lg { flex: 0 0 ${LOGO}px; display: grid; place-items: center; background: ${PALE.background}; }
.sb-nwhl-glass-19 .lg .sb-logo { width: ${P(42)}px; height: ${P(27)}px; object-fit: contain; }
.sb-nwhl-glass-19 .tm { flex: 0 0 ${TEAM}px; display: grid; place-items: center; font-size: ${P(12.5 / 0.7)}px; line-height: 1; letter-spacing: 0; }
.sb-nwhl-glass-19 .sc { flex: 0 0 ${SC}px; display: grid; place-items: center; background: ${PALE.background}; color: #050404; font-size: ${P(15 / 0.7)}px; line-height: 1; min-width: 0 !important; }
.sb-nwhl-glass-19 .sc.sb-pre-rec { font-weight: 700; }
.sb-nwhl-glass-19 .pd, .sb-nwhl-glass-19 .ck, .sb-nwhl-glass-19 .w { height: ${TH}px; display: grid; place-items: center; background: ${DARK.background}; font-size: ${P(9 / 0.7)}px; font-weight: 700; line-height: 1; white-space: nowrap; }
.sb-nwhl-glass-19 .grp > .pd { flex: 0 0 ${PER}px; display: flex; align-items: center; justify-content: center; } .sb-nwhl-glass-19 .ck { flex: 0 0 ${CK}px; font-size: ${P(11 / 0.7)}px; }
.sb-nwhl-glass-19 .w { flex: 0 0 ${PER + GAP + CK}px; }
.sb-nwhl-glass-19 .pd .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-nwhl-glass-19 .grp.c { gap: 0; }
.sb-nwhl-glass-19 .grp.c > .ck { border-left: 2px solid #5f6469; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    const bar = el('div', 'bar');
    const m = el('div', 'mk');
    m.appendChild(mk.league ? leagueLogo(g, P(62), null, true) : mk.ha ? haMark(P(24)) : el('span'));
    bar.appendChild(m);
    const group = (t, away) => {
      const c = teamColor(t, '#4b5563');
      const grp = el('div', 'grp');
      const lg = el('div', 'lg'); lg.appendChild(logo(t, P(42)));
      const tm = el('div', 'tm', abbr3(t));
      // the team's colour as a pane lit in the middle (measured on the frame's two panels)
      const pane = glassCover(c, { top: -6, mid: 5, horizon: 50, step: 1, foot: -17 });
      tm.style.background = pane.background; tm.style.color = teamInk(c);
      const sc = scoreSlot(el('div', 'sc', !pre && t.score != null ? String(t.score) : ''), g);
      if (away) grp.append(lg, tm, sc); else grp.append(sc, tm, lg);
      return grp;
    };
    bar.append(group(g.away, true), group(g.home, false));
    const c = el('div', 'grp c');
    if (live) c.append(ordinal(g.period, 'pd'), el('div', 'ck', g.clock || ''));
    else c.appendChild(el('div', 'w', statusText(g, time)));
    bar.appendChild(c);
    root.appendChild(bar);
  },
};
