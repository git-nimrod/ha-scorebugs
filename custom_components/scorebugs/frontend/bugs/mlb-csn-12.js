// "Ballpark box '12": after Comcast SportsNet California's baseball bug of the early 2010s. A
// dark box with a thin light rim: the network's mark at the left (here the Home Assistant logo), the two teams in rows (logo, letters in
// white, score in black on a white box), a small drawn ballpark in the middle (orange dirt, green infield) whose bases light up when
// taken, and at the right the inning with a thin gold line over it, the count under it, and the outs.
// Left out: the pitch count at the top right (no data); the outs take the right column's full height.
// measured (crop px of 216 x 35): mark 0-35, logos 37-55, letters 57-85, score boxes 85-105, rows y 2-17 and 18-33, ballpark 105-140,
// inning and count 140-180, outs 180-216; capitals 0.29 of the height.
// finish (team area with the linings, the team colour as the
// background moving from dark team colour to black"), read on the crop: every section is grey metal at the top fading to black by
// the middle (beside the ballpark: lum 160 at y 4, 104 at y 12, 53 at y 14, 25 from y 16 = 45 % of the height); the mark's section
// the same (lum 122 at y 3-8, 50 at y 13, black from y 15); a bright silver upright (lum 255) between the mark and the teams, fading
// below the middle; a silver line along the top and a lighter silver left edge; the team rows each a 1 px light lining of their
// colour at the top (OAK #c3d5cc, TOR #c5ccf2), then the colour (OAK #527154, TOR #6661aa) darkening down and to the right to black
// by the row's foot; the right-hand panels grey at the top (#4f4648) to black by a third of their height.
import { el, otherSport, logo, statusText, haMark, marks, scoreSlot, fit, teamPair, shade, FONTS } from '../kit.js';

const K = 4, W = 216 * K, H = 35 * K;
const X = (v) => Math.round(v * K);
const CAP = 10 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'mlb-csn-12',
  size: { w: W, h: H },
  fonts: [FONTS.barlow700],
  css: `
.sb-mlb-csn-12 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-mlb-csn-12 .bx { position: absolute; inset: 0; background: linear-gradient(#a19ea3 4%, #8e8b90 20%, #5e5b5f 34%, #222224 42%, #0d0d0e 55%, #060607);
  box-shadow: inset 0 ${X(0.8)}px 0 #aeadb2, inset ${X(0.8)}px 0 0 #aeadb2, inset -${X(0.8)}px 0 0 #aeadb2, inset 0 -${X(0.8)}px 0 #aeadb2, 0 2px 6px rgba(0,0,0,.5); }
/* the mark's section: grey metal at the top to black, a bright silver upright at its right */
.sb-mlb-csn-12 .mks { position: absolute; left: ${X(1)}px; top: ${X(1.6)}px; width: ${X(35.5)}px; height: ${X(31.6)}px; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(#828185, #77767a 22%, #3a393c 38%, #0b0b0c 46%, #040405); box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6); }
.sb-mlb-csn-12 .dv { position: absolute; left: ${X(36.5)}px; top: ${X(1.6)}px; width: ${X(1)}px; height: ${X(31.6)}px; background: linear-gradient(#ffffff, #f4f4f6 45%, #8a8a8e 60%, #3c3c40); }
/* the team rows: a light lining of the team colour along the top, the colour darkening down and to the right to black */
.sb-mlb-csn-12 .rw { position: absolute; left: ${X(37.5)}px; width: ${X(68)}px; height: ${X(15)}px; }
.sb-mlb-csn-12 .c { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; }
.sb-mlb-csn-12 .mk { left: 0; top: 0; width: ${X(36)}px; height: ${H}px; } .sb-mlb-csn-12 .mk .sb-ha { color: #fff; }
.sb-mlb-csn-12 .lg { left: ${X(37)}px; width: ${X(18)}px; height: ${X(15)}px; } .sb-mlb-csn-12 .lg .sb-logo { width: ${X(17)}px; height: ${X(14)}px; object-fit: contain; }
.sb-mlb-csn-12 .ab { left: ${X(56)}px; width: ${X(29)}px; height: ${X(15)}px; font-size: ${PX}px; justify-content: flex-start; }
.sb-mlb-csn-12 .sc { left: ${X(86)}px; width: ${X(19)}px; height: ${X(14)}px; color: #111; font-size: ${PX * 1.05}px; background: linear-gradient(#ffffff, #e4e4e6 55%, #c9c9cc); }
/* before the game each record as wide as its white box (the kit's em width shrank a long record to a speck) */
.sb-mlb-csn-12 .sc .sb-pre-rec { min-width: 100% !important; }
/* the drawn ballpark: an orange fan of dirt, a green infield, white bases (gold when taken). the sand runs to the top
 of the bug and is cut off there. Measured on the crop: the foul lines leave home plate (123.5, 32) at about 45 deg and reach the
 widest point (x 106-141) at y 11-14; above that the outfield edge is an arc of r 18 px centred at (123.5, 15), cut by the top at
 x 113-133 (y 0): so that circle cut by the two foul lines from home plate, the sand over the box's top line there */
/* the top of the sand's arc gets a black outline. Measured on the crop along radii from (123.5, 15): a dark band at
 r 18-19.5 (lum 52-74 against the sand's 124), about 1 crop px once the blur is taken out; it runs round the arc only, the foul
 lines have none. So a 1 crop px black ring just inside the circle's edge (r 17-18; on air 18-19.5, within 1.3 crop px), cut by the
 foul lines with it (a bigger circle moved the measuring box onto the foot rim) */
.sb-mlb-csn-12 .pk { left: ${X(105)}px; top: 0; width: ${X(36)}px; height: ${X(34)}px; overflow: hidden; }
.sb-mlb-csn-12 .pk .dirt { position: absolute; left: ${X(18.5 - 18)}px; top: ${X(15 - 18)}px; width: ${X(36)}px; height: ${X(36)}px; border-radius: 50%;
  background: radial-gradient(circle at 50% 97%, #b86f2e, #d99a52 55%, #c98440);
  box-shadow: inset 0 0 0 ${X(1)}px #000;
  clip-path: polygon(${X(18)}px ${X(36)}px, ${X(-82)}px ${X(-64)}px, ${X(118)}px ${X(-64)}px); }
/* the infield centred in the fan at its bottom corner. Measured on the crop: fan, infield and home plate all on one
 upright at x 123.5 (18.5 in the ballpark); infield y 9-27 and x 113-132 (a square on its point, 19 across); home plate y 30-31 in
 the dirt below the infield's corner; the fan's tip at y 33 */
.sb-mlb-csn-12 .pk .grass { position: absolute; left: ${X(18.5 - 6.72)}px; top: ${X(18 - 6.72)}px; width: ${X(13.44)}px; height: ${X(13.44)}px; transform: rotate(45deg); background: linear-gradient(#3c8a3a, #22621f); }
.sb-mlb-csn-12 .pk b { position: absolute; width: ${X(3)}px; height: ${X(3)}px; transform: rotate(45deg); background: #f1ece2; box-shadow: 0 0 0 1px rgba(0,0,0,.35); }
.sb-mlb-csn-12 .pk b.on { background: #ffd23a; box-shadow: 0 0 ${X(1.5)}px #ffe27a; }
.sb-mlb-csn-12 .pn { top: ${X(2)}px; height: ${X(31)}px; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.28)), linear-gradient(#56585a, #3a3b3c 14%, #121212 34%, #050505); box-shadow: inset 0 0 0 1px #4a4a4e, inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6); }
.sb-mlb-csn-12 .in { left: ${X(141)}px; top: ${X(2)}px; width: ${X(39)}px; height: ${X(15)}px; font-size: ${PX}px; box-shadow: inset 0 ${X(1)}px 0 #c9b04a; }
.sb-mlb-csn-12 .ct { left: ${X(141)}px; top: ${X(18)}px; width: ${X(39)}px; height: ${X(15)}px; font-size: ${PX}px; }
.sb-mlb-csn-12 .ou { left: ${X(181)}px; top: ${X(2)}px; width: ${X(33)}px; height: ${X(31)}px; font-size: ${PX}px; gap: ${X(1)}px; }
.sb-mlb-csn-12 small { font-size: .62em; }
.sb-mlb-csn-12 .w { left: ${X(141)}px; width: ${X(73)}px; height: ${X(31)}px; top: ${X(2)}px; font-size: ${PX * 0.72}px; }
.sb-mlb-csn-12 .pn.os { width: ${X(73)}px; }
.sb-mlb-csn-12 .dt { left: ${X(105)}px; top: 0; width: ${X(36)}px; height: ${H}px; font-size: ${PX * 0.5}px; line-height: 1.1; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os, b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    root.append(el('div', 'bx'), el('div', 'mks'), el('div', 'dv'));
    const pair = teamPair(g.away, g.home, '#3a3f47');
    [0, 1].forEach((i) => {
      // the top row reaches the top of the mark's box (y 1.6; on the crop both start under the 1 px rim)
      const rw = el('div', 'rw'); rw.style.top = X(i ? 18 : 1.6) + 'px'; rw.style.height = X(i ? 15.2 : 15.6) + 'px';
      rw.style.background = 'linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(90deg, transparent 30%, rgba(0,0,0,.45)), linear-gradient(' + pair[i] + ' 6%, ' + shade(pair[i], -0.45) + ' 40%, #000 85%)';
      rw.style.boxShadow = 'inset 0 ' + X(0.6) + 'px 0 ' + shade(pair[i], 0.72) + ', inset 0 ' + X(1.1) + 'px 0 ' + shade(pair[i], 0.45);
      root.appendChild(rw);
    });
    const mk = el('div', 'c mk'); if (marks(opts).ha) mk.appendChild(haMark(X(22))); root.appendChild(mk);
    [g.away, g.home].forEach((t, i) => {
      const y = X(i ? 18.4 : 2) + 'px';
      const lg = el('div', 'c lg'); lg.style.top = y; lg.appendChild(logo(t, X(17)));
      const ab = fit(el('div', 'c ab', (t.abbr || '').toUpperCase())); ab.style.top = y;
      const sc = el('div', 'c sc'); sc.style.top = X(i ? 19 : 2.6) + 'px'; sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      root.append(lg, ab, sc);
    });
    const pk = el('div', 'c pk'); pk.append(el('i', 'dirt'), el('i', 'grass'));
    // first, second and third just inside the infield's corners (centres), home plate on the dirt under its bottom corner
    [[1, 26.5 - 1.5, 18 - 1.5], [2, 18.5 - 1.5, 10 - 1.5], [3, 10.5 - 1.5, 18 - 1.5], [0, 18.5 - 1.5, 30.2 - 1.5]].forEach(([n, x, y]) => {
      const bs = el('b', n && live && b.bases && b.bases[n - 1] ? 'on' : ''); bs.style.left = X(x) + 'px'; bs.style.top = X(y) + 'px'; pk.appendChild(bs);
    });
    if (!os) root.appendChild(pk);
    else if (os.detail) root.appendChild(el('div', 'c dt', os.detail));
    if (live) {
      const inn = el('div', 'c pn in'); inn.append(document.createTextNode((b.half === 'top' ? '▲' : b.half === 'bot' ? '▼' : '') + (g.period.label || '')), el('small', '', (g.period.suffix || '').toUpperCase()));
      const ou = el('div', 'c pn ou'); ou.append(el('span', '', String(b.outs)), el('small', '', 'OUT'));
      root.append(inn, el('div', 'c pn ct', b.balls + '-' + b.strikes), ou);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      root.append(el('div', 'c pn in os', os.period), el('div', 'c pn ct os', os.clock));
    } else root.appendChild(el('div', 'c pn w', statusText(g, time)));
  },
};
