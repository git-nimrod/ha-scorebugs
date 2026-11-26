// "Curved plate '25": after the women's pro hockey league's own world feed from the 2025 Finals on (its third season, 2025-26). A pale plate hung at the top centre, its ends cut back under it: the first team's
// logo standing up out of its left end, its letters and score in its own colour; the league's logo in the middle; the second team on a
// flat panel of its colour cut into the plate's right half, score and letters in white, its logo standing up out of the right end.
// Under the plate a smaller pale plate with the period and clock, and each side a tab in the team's colour with its shots ("SHOTS 12",
// "5 SHOTS"). In the Finals a pale plate with rounded top corners sits on top with the series ("BEST-OF-5 FINALS: MTL LEADS 2-1").
// measured (crop px of 651 x 85, Boston v Seattle): plate y 3-50, 645 wide at the top and 591 at its foot, its ends curling back under
// it (the foot rises into the top corner: 2 px in at a fifth of the height, 6 at two fifths, 12 at three, 19 at four, 27 at the foot); logos about 80 x 62 standing 10 px over the plate, centred 87 px in from each end; letters capitals 24 px, centred 172 in;
// scores capitals 35 px, centred 247 and 407; league logo centred, 45 wide; the second team's panel from a 30 deg leaning edge at
// 366-393 to 606-621, the plate's full height; under-plate y 52-79, 220 wide at the top narrowing 13 px a side; shots tabs 100 wide
// beside it, "SHOTS" capitals 13 px and the figures 19. Surfaces (sample.py): plate L 92 at the top to 86 at its foot, panel and tabs
// flat in the team's colour, under-plate L 89. Finals plate (crop of 810 x 122): 60 % of the bar's width, 0.61 of its height, top
// corners rounded 18 px, capitals 16 px dark grey. The 2026 Finals put a sponsor's tile where the league logo goes and a power-play tab
// at the right end: neither is drawn (no sponsor art; no power-play data).
// measured on 1080p stills (Minnesota v Boston, Dec 7 2025; Minnesota v Toronto, May 7 2025):
// the plate is a raised piece with a border: a bright edge line (L 90-93, 2 px) and a grey groove inside it (L 62-77, 2 px), the face
// L 87-91, and its foot bevelled over the last 6 px down to L 69; the second team's panel sits inside the border (4-5 px in at the top
// and the foot); each logo stands up over the top border but its foot goes under the bottom border; the series plate sits straight on
// the plate's top edge (no gap).
import { el, logo, ordinal, dressFor, statusText, teamColor, teamInk, inkOn, shade, leagueLogo, marks, abbr3, scoreSlot, FONTS } from '../kit.js';

const K = 900 / 651, P = (x) => Math.round(x * K);
const OVER = P(10), PH = P(47), TAB = P(27), W = P(651);
const H = OVER + PH + P(2) + TAB;
const SER = Math.round(PH * 0.61);
// a four-sided plate (top corners at x a and w - b, foot corners at x d and w - c) with its foot corners rounded r px (geomdiff on the
// frame: the under-plate and the shots tabs round their lower corners about 11 px; their tops are square)
const trap = (w, h, a, b, c, d, r) => {
  const t = 1 - r / h;
  return "path('M" + a + ' 0 L' + (w - b) + ' 0 L' + (w - b + (b - c) * t).toFixed(1) + ' ' + (h - r) + ' Q' + (w - c) + ' ' + h + ' ' + (w - c - r) + ' ' + h +
    ' L' + (d + r) + ' ' + h + ' Q' + d + ' ' + h + ' ' + (a + (d - a) * t).toFixed(1) + ' ' + (h - r) + " Z')";
};
const LO_W = P(220), SH_W = P(112), R = P(8);
// the dress is worked out here too: the stage is sized before the kit sets g.dress
const DRESSES = ['regular', 'playoffs', 'finals'];
const series = (g, o) => (g.dress || dressFor(g, { dresses: DRESSES }, o)) !== 'regular' && !!(g.series || g.note);
// the plate's ends: its foot curls up into the top corner (crop: x = 3 + 27 t^1.5 px in from the end at t = share of the height)
const END = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => [P(27 * t ** 1.5), Math.round(t * 100)]);
const PLATE_CLIP = 'polygon(' + END.map(([x, y]) => x + 'px ' + y + '%').join(', ') + ', ' + END.slice().reverse().map(([x, y]) => 'calc(100% - ' + x + 'px) ' + y + '%').join(', ') + ')';

export default {
  id: 'pwhl-curve-25',
  size: { w: W, h: H + SER },
  sizeFor: (g, o) => ({ w: W, h: H + (series(g, o) ? SER : 0) }),
  // the series plate in every post-season round (the frames are the Finals)
  dresses: ['regular', 'playoffs', 'finals'],
  fonts: [FONTS.montserrat],
  css: `
.sb-pwhl-curve-25 { font-family: 'SB Montserrat', Arial, sans-serif; font-weight: 700; color: #3f4243; }
.sb-pwhl-curve-25 .bug { position: absolute; left: 0; right: 0; bottom: 0; height: ${H}px; }
.sb-pwhl-curve-25 .plate { position: absolute; left: 0; top: ${OVER}px; width: ${W}px; height: ${PH}px; background: #eff1f0; clip-path: ${PLATE_CLIP}; }
.sb-pwhl-curve-25 .groove { position: absolute; left: 3px; top: ${OVER + 3}px; width: ${W - 6}px; height: ${PH - 3}px; background: #8f9598; clip-path: ${PLATE_CLIP}; }
.sb-pwhl-curve-25 .face { position: absolute; left: 6px; top: ${OVER + 6}px; width: ${W - 12}px; height: ${PH - 6}px; background: linear-gradient(#f2f4f2, #e6e9e6 22%, #e0e3e0 55%, #dbdedb 88%); clip-path: ${PLATE_CLIP}; }
.sb-pwhl-curve-25 .foot { position: absolute; left: 0; top: ${OVER + PH - 8}px; width: ${W}px; height: 8px; background: linear-gradient(#e6e9e7, #c3c7c8 50%, #8f9598);
  clip-path: polygon(${P(23)}px 0, calc(100% - ${P(23)}px) 0, calc(100% - ${P(27)}px) 100%, ${P(27)}px 100%); }
.sb-pwhl-curve-25 .pn { position: absolute; top: ${OVER + 5}px; left: ${P(366)}px; width: ${P(255)}px; height: ${PH - 10}px; clip-path: polygon(${P(27)}px 0, 100% 0, calc(100% - ${P(15)}px) 100%, 0 100%);
  box-shadow: inset 0 -3px 4px -2px rgba(0,0,0,.25); }
.sb-pwhl-curve-25 .sb-logo.t { position: absolute; top: 0; width: ${P(80)}px; height: ${OVER + PH - 1}px; object-fit: contain; object-position: 50% 100%; }
.sb-pwhl-curve-25 .sb-logo.t.a { left: ${P(87 - 40)}px; } .sb-pwhl-curve-25 .sb-logo.t.h { right: ${P(87 - 40)}px; }
.sb-pwhl-curve-25 .ab { position: absolute; top: ${OVER}px; height: ${PH}px; width: ${P(90)}px; display: grid; place-items: center; font-size: ${P(24 / 0.7)}px; line-height: 1; letter-spacing: .5px; }
.sb-pwhl-curve-25 .ab.a { left: ${P(172 - 45)}px; } .sb-pwhl-curve-25 .ab.h { right: ${P(172 - 45)}px; color: #fff; }
.sb-pwhl-curve-25 .sc { position: absolute; top: ${OVER}px; height: ${PH}px; width: ${P(56)}px; display: grid; place-items: center; font-size: ${P(35 / 0.7)}px; font-weight: 700; line-height: 1; min-width: 0 !important; }
.sb-pwhl-curve-25 .sc.a { left: ${P(247 - 28)}px; } .sb-pwhl-curve-25 .sc.h { left: ${P(407 - 28)}px; color: #fff; }
.sb-pwhl-curve-25 .sc.sb-pre-rec { font-weight: 700; }
.sb-pwhl-curve-25 .lg { position: absolute; top: ${OVER}px; left: ${P(325 - 32)}px; width: ${P(64)}px; height: ${PH}px; display: grid; place-items: center; }
.sb-pwhl-curve-25 .lg .sb-league { width: ${P(60)}px !important; height: ${P(44)}px !important; object-fit: contain; }
.sb-pwhl-curve-25 .lg .sb-league:not(img) { width: auto; height: auto; color: #5a3ab0; font-size: ${P(12)}px; font-weight: 800; }
.sb-pwhl-curve-25 .lo { position: absolute; top: ${OVER + PH + P(2)}px; left: ${P(325 - 110)}px; width: ${P(220)}px; height: ${TAB}px; background: linear-gradient(#e3e6e4, #dbdfdf 60%, #d3d7d6);
  clip-path: ${trap(LO_W, TAB, 0, 0, P(13), P(13), R)}; display: flex; align-items: center; justify-content: center; gap: ${P(28)}px; font-size: ${P(21 / 0.7)}px; line-height: 1; white-space: nowrap; }
.sb-pwhl-curve-25 .lo .sb-ord { font-size: .72em; }
.sb-pwhl-curve-25 .lo .w { font-size: .8em; }
.sb-pwhl-curve-25 .sh { position: absolute; top: ${OVER + PH + P(2)}px; height: ${TAB}px; width: ${P(112)}px; display: flex; align-items: center; justify-content: center; gap: ${P(5)}px; color: #fff; line-height: 1; white-space: nowrap; }
.sb-pwhl-curve-25 .sh.a { left: ${P(325 - 110 - 100)}px; clip-path: ${trap(SH_W, TAB, 0, 0, P(13), P(10), R)}; padding-right: ${P(8)}px; box-sizing: border-box; }
.sb-pwhl-curve-25 .sh.h { left: ${P(325 + 110 - 12)}px; clip-path: ${trap(SH_W, TAB, P(13), 0, P(10), 0, R)}; padding-left: ${P(8)}px; box-sizing: border-box; }
/* the shots words a little smaller than first built: "SHOTS 15" ran past the tab's leaning end */
.sb-pwhl-curve-25 .sh .l { font-size: ${P(11.5 / 0.7)}px; font-weight: 600; } .sb-pwhl-curve-25 .sh .n { font-size: ${P(17 / 0.7)}px; font-weight: 800; }
.sb-pwhl-curve-25 .ser { position: absolute; top: 0; left: ${Math.round(W * 0.2)}px; width: ${Math.round(W * 0.6)}px; background: linear-gradient(#eceeed, #f2f4f2);
  height: ${SER + OVER + 6}px; padding-bottom: ${OVER + 6}px; box-sizing: border-box; box-shadow: inset 0 2px 0 #f7f8f7; z-index: 3;
  border-radius: ${P(15)}px ${P(15)}px 0 0; display: grid; place-items: center; font-size: ${P(13 / 0.7)}px; line-height: 1; white-space: nowrap; overflow: hidden; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    if (series(g, opts)) root.appendChild(el('div', 'ser', (g.series || g.note).toUpperCase()));
    const bug = el('div', 'bug');
    const ca = teamColor(g.away, '#4b3a6e'), ch = teamColor(g.home, '#4b3a6e');
    // the first team's letters and score in its own colour on the pale plate: a colour too light to read there goes deeper
    const inkA = inkOn(ca) === '#fff' ? ca : shade(ca, -0.45);
    bug.append(el('div', 'plate'), el('div', 'groove'), el('div', 'face'));
    const pn = el('div', 'pn'); pn.style.background = ch;
    bug.appendChild(pn);
    const abA = el('div', 'ab a', abbr3(g.away)); abA.style.color = inkA;
    const scA = scoreSlot(el('div', 'sc a', !pre && g.away.score != null ? String(g.away.score) : ''), g); scA.style.color = inkA;
    const scH = scoreSlot(el('div', 'sc h', !pre && g.home.score != null ? String(g.home.score) : ''), g); scH.style.color = teamInk(ch);
    const abH = el('div', 'ab h', abbr3(g.home)); abH.style.color = teamInk(ch);
    // two or three figures (other sports on this bug) step down so they keep clear of the letters
    [scA, scH].forEach((n) => { const k = n.textContent.length; if (k > 1) n.style.fontSize = Math.round(P(35 / 0.7) * (k > 2 ? 0.5 : 0.66)) + 'px'; });
    const lg = el('div', 'lg');
    if (mk.league) lg.appendChild(leagueLogo(g, P(50)));
    // the logos' feet go under the plate's bottom border (drawn after them)
    bug.append(abA, scA, lg, scH, abH, logo(g.away, P(80), 'sb-logo t a'), logo(g.home, P(80), 'sb-logo t h'), el('div', 'foot'));
    const lo = el('div', 'lo');
    if (live) lo.append(ordinal(g.period, 'pd'), el('span', '', g.clock || ''));
    else lo.appendChild(el('span', 'w', statusText(g, time)));
    bug.appendChild(lo);
    // the shots tabs, only when the feed gives shots (and not before the face-off)
    if (!pre && g.away.shots != null && g.home.shots != null) {
      const a = el('div', 'sh a'); a.style.background = ca; a.append(el('span', 'l', 'SHOTS'), el('span', 'n', String(g.away.shots)));
      const h = el('div', 'sh h'); h.style.background = ch; h.append(el('span', 'n', String(g.home.shots)), el('span', 'l', 'SHOTS'));
      bug.append(a, h);
    }
    root.appendChild(bug);
  },
};
