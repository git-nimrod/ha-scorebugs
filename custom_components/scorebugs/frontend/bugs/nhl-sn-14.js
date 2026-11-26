// "Logo tiles '14": after Sportsnet's NHL score bar of the mid-2010s. A row of square-cut glossy tiles
// with thin dark seams: the network's tile (here the Home Assistant logo on navy), then for the away team its logo on a lit tile of its
// colour, its letters on its colour and its score on silver; then the home team the other way round (score, letters, logo); then the
// period and the clock on navy tiles.
// measured (crop px of 365 x 26): mark 0-33, logo 35-82, letters 83-127, score 128-160, score 165-197, letters 197-240, logo 240-290,
// period 292-321, clock 323-363; seams 1-2 px; capitals 0.46 of the height; every tile a little lighter over its top half.
// (a glossy, glassy finish"), read on the crop: each logo is as
// wide as its tile (the Leafs' leaf 46 px across a 47 px tile, the Senator 50 across 50) and so about twice the tile's 22 px height,
// cut top and bottom by the tile (only the middle of the leaf and the Senator's face show), on the team's own colour (the Leafs' tile
// deep blue #19365e under the white leaf); every tile glassy: lighter by about 50 levels over its top 45 % with a hard edge there
// (TOR #5f79a9 over #22437f), darker towards the foot.
// retro check: the same look carried the women's league on the network in 2017-18. Read with sample.py on its 36 px tiles, every tile
// wears one glass cover with the step 39 % down: team tiles +7..+14 L at the top, a 17-24 L step, -10..-19 at the foot; silver score
// tiles +9, step 9, -8; navy tiles +6, step 6-8, -5..-6. Drawn with the kit's glassCover against each tile's own colour.
// read in a grid of spots on the 2014 crop (sample.py --grid 3x5): the glass is the tile's own colour lit,
// not grey: above a hard horizon 36 % down the Leafs' tile is a lighter blue (#5c78aa, L +18 at the top rising to +26 just over the
// horizon, brightest there), the Senators' a rose red (#a4525e, +13..+25); under the horizon the deep colour itself (L 27-29), darkest
// at the foot (-12); the silver score tiles +8 / +12 over a 12 L step (a cool blue-grey, #d3e1e3 lit), the navy tiles +9 / +12 over a 16
// L step. The glass over the logos is that coloured light too (a white wash read as grey).
import { el, logo, statusText, haMark, marks, scoreSlot, fit, teamPair, panelInk, relight, alpha, ordinal, glassCover, FONTS } from '../kit.js';

const K = 1180 / 365, H = Math.round(26 * K);
const C = { mk: 107, lg: 152, tm: 143, s: 103, pd: 94, ck: 130 }, SEAM = 4;
const W = C.mk + 2 * (C.lg + C.tm + C.s) + C.pd + C.ck + 8 * SEAM + 16 + 6;
const CAP = 12 * K, PX = Math.round(CAP / 0.7109);
// the glass over the logos (the logo shows through): the team colour's own light over the top to the horizon, a shade under it
const GL = (c) => 'linear-gradient(' + alpha(relight(c, 30), 0.34) + ', ' + alpha(relight(c, 38), 0.46) + ' 36%, ' + alpha(c, 0) + ' 38.5%, rgba(0,0,0,.08) 60%, rgba(0,0,0,.3))';
// the glass cover on every tile, measured in a grid of spots on the 2014 crop and a 720p still (Canucks at Flames, Oct 8 2014: the
// Canucks' tile #5c72b2 lit over #283e7e, the Flames' #b45063 over #7d1624, horizon 39 %, foot -12..-20)
const TEAM_GLASS = { top: 15, mid: 22, horizon: 38, step: 24, foot: -12, line: 14 };
// loop pass, the same note: on air the glass sits on a deep, muted tile (under the horizon the Flames and the Canucks both
// read L 25-30 at about half their chroma), lit in their own hue above it. Bring the colour to that depth first, then the cover: bright
// listed colours no longer turn into a pale wash with a lighter top.
const lum = (h) => { const f = (i) => { const c = parseInt(h.slice(i, i + 2), 16) / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; const Y = 0.2126 * f(1) + 0.7152 * f(3) + 0.0722 * f(5); return 116 * (Y > 0.008856 ? Math.cbrt(Y) : 7.787 * Y + 16 / 116) - 16; };
const mixHex = (a, b, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + parseInt(b.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
const deep = (c) => {
  if (!/^#[0-9a-f]{6}$/i.test(c || '')) return c;
  const L = lum(c);
  if (L > 62) return c;   // a gold or white keeps its own light
  const to = 27 + Math.max(0, L - 27) * 0.15, d = relight(c, to - L), grey = relight('#808080', to - 53.6);
  return mixHex(d, grey, 0.4);
};
const NAVY = glassCover('#1e3344', { top: 6, mid: 7, horizon: 40, step: 10, foot: -8 }).background;
const SILVER = glassCover('#b2bec0', { top: 8, mid: 10, horizon: 40, step: 10, foot: -7 }).background;
// the logo square: as wide as its tile, cut top and bottom by it (the kit slides it to its focal point)
const LG = C.lg - 4;

export default {
  id: 'nhl-sn-14',
  size: { w: W, h: H },
  // a logo goes white on its own colour only when it is all but one colour (the Leafs' leaf, its lettering white, turned into a blank
  // white leaf at the kit's 0.85)
  monoLogos: 0.97,
  // before and after the game the start time or FINAL stands on one tile across the period's and the clock's room (on the clock's
  // tile alone it had to be set very small)
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-sn-14 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; font-stretch: 92%; color: #fff; }
.sb-nhl-sn-14 .row { position: absolute; inset: 0; display: flex; gap: ${SEAM}px; padding: 3px; box-sizing: border-box; background: #0a1420; box-shadow: inset 0 0 0 1px #8a96a8, 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-sn-14 .row > * { flex: none; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.sb-nhl-sn-14 .mk { width: ${C.mk}px; background: ${NAVY}; } .sb-nhl-sn-14 .mk .sb-ha { color: #fff; }
.sb-nhl-sn-14 .row > .lg { position: relative; display: block; }
.sb-nhl-sn-14 .lg .sb-logo { position: absolute; left: 2px; top: calc(50% - ${LG / 2}px); width: ${LG}px; height: ${LG}px; object-fit: contain; }
/* the glass over the logo too (its coloured light is set per team) */
.sb-nhl-sn-14 .lg > .gl { position: absolute; inset: 0; pointer-events: none; }
.sb-nhl-sn-14 .tm { font-size: ${PX}px; white-space: nowrap; text-shadow: 0 2px 2px rgba(0,0,0,.45); }
/* the score tiles: silver, dark figures; the second sits past a slim chrome seam */
.sb-nhl-sn-14 .s { width: ${C.s}px; color: #1b1d20; font-size: ${PX}px; background: ${SILVER}; }
.sb-nhl-sn-14 .sep { width: 10px; background: linear-gradient(90deg, #5a646c, #e2e7ea 50%, #5a646c); }
.sb-nhl-sn-14 .pd, .sb-nhl-sn-14 .ck { background: ${NAVY}; font-size: ${PX}px; white-space: nowrap; }
.sb-nhl-sn-14 .pd { width: ${C.pd}px; } .sb-nhl-sn-14 .ck { width: ${C.ck}px; } .sb-nhl-sn-14 .sb-ord { font-size: .62em; }
/* a five-character clock (12:00, 10:00) squeezes a little inside its tile instead of running to the bug's end */
.sb-nhl-sn-14 .ck { padding: 0 8px; box-sizing: border-box; } .sb-nhl-sn-14 .sb-ord { font-size: .62em; }
.sb-nhl-sn-14 .w { font-size: ${PX * 0.68}px; width: ${C.pd + C.ck + SEAM}px; padding: 0 10px; box-sizing: border-box; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    const pair = teamPair(g.away, g.home, '#2a3f5a');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.55))); row.appendChild(mk);
    const parts = (t, c0) => {
      const c = deep(c0);
      // the logo tile is the team's own colour, the logo about twice the tile's height and cut by it, under the glass;
      // the letters' tile the colour itself under the same glass
      const lg = el('div', 'lg'); lg.style.width = C.lg + 'px'; const gcv = glassCover(c, TEAM_GLASS); lg.style.background = gcv.background; lg.style.boxShadow = gcv.shadow; lg.appendChild(logo(t, LG));
      const gl = el('div', 'gl'); gl.style.background = GL(c); lg.appendChild(gl);
      const tm = fit(el('div', 'tm', (t.abbr || '').toUpperCase())); tm.style.width = C.tm + 'px'; tm.style.background = gcv.background; tm.style.boxShadow = gcv.shadow;
      // white letters unless the colour is too light for them (a gold taken back against a look-alike opponent): then the kit's ink
      tm.style.color = panelInk(t, c0); if (tm.style.color !== 'rgb(255, 255, 255)') tm.style.textShadow = 'none';
      const s = el('div', 's'); s.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      return [lg, tm, s];
    };
    const [la, ta, sa] = parts(g.away, pair[0]), [lh, th, sh] = parts(g.home, pair[1]);
    row.append(la, ta, sa, el('div', 'sep'), sh, th, lh);
    if (live) { const pd = el('div', 'pd'); pd.appendChild(g.period.word ? document.createTextNode(g.period.label) : ordinal(g.period)); row.appendChild(pd); }
    if (live) row.appendChild(fit(el('div', 'ck', g.clock || '')));
    else row.appendChild(fit(el('div', 'ck w', statusText(g, time))));
    root.appendChild(row);
  },
};
