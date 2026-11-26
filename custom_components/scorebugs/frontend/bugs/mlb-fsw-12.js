// "Colour rows '12": after FOX Sports West's Angels bug of the early 2010s. FOX's own 2012-13 package. The two teams in rows of their colours,
// letters and score in white, a black panel with a faint weave at their right holding the bases as outlined diamonds, all held between
// two bracket arcs (a glossy black band and a glassy silver line inside it, the rows running under the line and cut by its curve) under
// a silver line along the top; under them a narrower black strip, its sides slanting in, with the half inning and the inning in gold,
// the count in white and the outs as two dots (gold when made).
// Left out: the pitch-speed box under the bases (no data); the bases panel takes both rows.
// measured: the frame's own circle fits agree with the 2013
// still's (silver line r 52.9 crop px on rows 54 px tall: 0.98, fit within 0.4 px; the band out 6 px past it), so the 2013 numbers
// draw it: the rows 26 crop px each, the colour to 57 % of the box's width, the strip 17 px tall, 21.5 px in at its top, its sides
// 28 deg from upright (the frame's 0.4 px a px, 22 deg, read on a thumbnail). Truncated 0.9 top to bottom.
import { el, otherSport, statusText, scoreSlot, fit, teamPair, teamColor, panelInk, shade, CHROME_DARK, FONTS } from '../kit.js';

// crop px of the 2013 still to ours: across 2.3, down 0.9 of that
// loop pass, the note "Rounded box '12, nfl-fox-12 reference for updates": the rows take nfl-fox-12's later finish: the team's colour
// brought to the same HSL lightness (0.245), lit with a soft sheen at the top and darkening to near black at the foot and, against the
// panel, at the row's right end; the brackets' silver line and the body take its gradients (a dim top, brightest a third down)
// a colour at a set HSL lightness, its hue and saturation kept
const atL = (c, l) => {
  const [r, g, b] = [1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l0 = (mx + mn) / 2;
  const s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l0 - 1));
  const h = mx === mn ? 0 : mx === r ? ((g - b) / (mx - mn) + 6) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
  const C = (1 - Math.abs(2 * l - 1)) * s, X = C * (1 - Math.abs(h % 2 - 1)), m = l - C / 2;
  const [p, q, t] = h < 1 ? [C, X, 0] : h < 2 ? [X, C, 0] : h < 3 ? [0, C, X] : h < 4 ? [0, X, C] : h < 5 ? [X, 0, C] : [C, 0, X];
  return '#' + [p, q, t].map((v) => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('');
};

const SX = 2.3, SY = SX * 0.9, X0 = 3.8, Y0 = 5;
const W = Math.round(221 * SX), H = Math.round(78 * SY);
const X = (v) => (v - X0) * SX, Y = (v) => (v - Y0) * SY;
// the silver line, one circle each side in crop px (centre 62.8, 31.3, r 52.9), mirrored about the box's middle
const lineX = (yc) => X(62.8 - Math.sqrt(52.9 * 52.9 - (yc - 31.3) * (yc - 31.3)));
const ROWS = [9, 35, 36, 62.5], FOOT = [63.5, 81, 21.5, 30], TEAM_END = X(128), BAND = 6 * SX, LINE = 4;
const pts = (y0, y1, d, flip) => {
  const o = [];
  for (let k = 0; k <= 14; k++) { const yc = y0 + (y1 - y0) * k / 14, x = lineX(yc) + d; o.push([flip ? W - x : x, Y(yc)]); }
  return o;
};
const poly = (a) => 'polygon(' + a.map(([x, y]) => x.toFixed(1) + 'px ' + y.toFixed(1) + 'px').join(', ') + ')';
const ring = (d0, d1, flip) => poly(pts(Y0, ROWS[3], d0, flip).concat(pts(Y0, ROWS[3], d1, flip).reverse()));
// the whole box: the band's outer arc down the rows, a step in, the strip slanting in; the same on the right
const SHAPE = (() => {
  const l = pts(Y0, ROWS[3], -BAND, false).concat([[X(FOOT[2]), Y(FOOT[0])], [X(FOOT[3]), Y(FOOT[1])]]);
  return poly(l.concat(l.map(([x, y]) => [W - x, y]).reverse()));
})();
const INNER = poly(pts(ROWS[0], ROWS[3], 0, false).concat(pts(ROWS[0], ROWS[3], 0, true).reverse()));
const CAP = 40, PX = Math.round(CAP / 0.7);

export default {
  id: 'mlb-fsw-12',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-mlb-fsw-12 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-mlb-fsw-12 .c { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; }
.sb-mlb-fsw-12 .bx, .sb-mlb-fsw-12 .ins, .sb-mlb-fsw-12 .rim { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
.sb-mlb-fsw-12 .bx { clip-path: ${SHAPE}; background: linear-gradient(#141516, #070708 55%, #0c0c0d); }
.sb-mlb-fsw-12 .ins { clip-path: ${INNER}; }
/* the brackets as nfl-fox-12's: the band from its outer edge to the silver line, the silver line on the same circle. "get glossiness on the black on the outsides": the band is black chrome (the kit's dark chrome: a lit grey top, black through the
 middle, a lift at the foot) */
.sb-mlb-fsw-12 .rim.band { background: ${CHROME_DARK}; }
.sb-mlb-fsw-12 .rim.line { background: linear-gradient(#7d838a, #f4f6f8 38%, #e3e6ea 55%, #aab0b7); }
/* the silver line along the top, from one silver line to the other (on the frame it runs on from the arcs, y 1-2 of 45) */
.sb-mlb-fsw-12 .rim.top { background: linear-gradient(#3a3d42, #b9bcc1 45%, #eef0f2 80%, #55585d); }
.sb-mlb-fsw-12 .rw { left: 0; width: ${TEAM_END.toFixed(1)}px; justify-content: space-between; padding: 0 ${(4 * SX).toFixed(1)}px 0 ${(24 * SX).toFixed(1)}px; box-sizing: border-box; font-size: ${PX}px; text-shadow: 0 2px 2px rgba(0,0,0,.45); }
.sb-mlb-fsw-12 .rw .sb-num { font-size: 1.1em; }
/* the bases panel; "black background for bases with the slight meshing": near black with a faint weave. the
 panel's shine measured on the frame: a gloss band under the silver line (blue-grey (82,97,107), lum 80-95, over a body near 40):
 11-22 % of the panel's height */
.sb-mlb-fsw-12 .cp { left: ${TEAM_END.toFixed(1)}px; right: 0; top: ${Y(ROWS[0]).toFixed(1)}px; height: ${(Y(ROWS[3]) - Y(ROWS[0])).toFixed(1)}px; padding-right: ${(10 * SX).toFixed(1)}px; box-sizing: border-box;
  background: linear-gradient(rgba(150,165,180,0) 4%, rgba(150,165,180,.5) 6%, rgba(150,165,180,.46) 18%, rgba(150,165,180,0) 22%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,.035) 0 2px, transparent 2px 4px), linear-gradient(#111113, #060607); }
.sb-mlb-fsw-12 .st { left: 0; top: ${Y(FOOT[0]).toFixed(1)}px; width: ${W}px; height: ${(Y(FOOT[1]) - Y(FOOT[0])).toFixed(1)}px;
  clip-path: polygon(${X(FOOT[2]).toFixed(1)}px 0, ${(W - X(FOOT[2])).toFixed(1)}px 0, ${(W - X(FOOT[3])).toFixed(1)}px 100%, ${X(FOOT[3]).toFixed(1)}px 100%); background: linear-gradient(#202022, #070708); }
.sb-mlb-fsw-12 .st .in, .sb-mlb-fsw-12 .st .cn, .sb-mlb-fsw-12 .st .ou, .sb-mlb-fsw-12 .st .w { height: 100%; }
.sb-mlb-fsw-12 .st .in { width: ${(36 * SX).toFixed(1)}px; color: #f2c63a; font-size: 36px; gap: 4px; }
.sb-mlb-fsw-12 .st .in small { font-size: .7em; }
.sb-mlb-fsw-12 .st .cn { width: ${(42 * SX).toFixed(1)}px; font-size: 40px; }
.sb-mlb-fsw-12 .st .ou { width: ${(36 * SX).toFixed(1)}px; gap: 10px; }
.sb-mlb-fsw-12 .st .ou i { width: 20px; height: 20px; border-radius: 50%; background: #55565a; }
.sb-mlb-fsw-12 .st .ou i.on { background: #f2d43a; }
.sb-mlb-fsw-12 .st .w { font-size: ${Math.round(PX * 0.62)}px; }
.sb-mlb-fsw-12 .cp.dt { font-size: 34px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os, b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const ins = el('div', 'ins');
    root.append(el('div', 'bx'), ins);
    const pair = teamPair(g.away, g.home, '#3a3f47');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (pair[i].toLowerCase() !== String(teamColor(t, '#3a3f47')).toLowerCase() ? panelInk(t, pair[i]) : '#fff'));
    [g.away, g.home].forEach((t, i) => {
      // the rows run from the box's edge under the silver line, which cuts them on its curve (as nfl-fox-12; they ended on a third arc
      // with a dark seam before)
      const rw = el('div', 'c rw'), y0 = Y(i ? ROWS[2] : ROWS[0]), y1 = Y(i ? ROWS[3] : ROWS[1]);
      rw.style.top = y0.toFixed(1) + 'px'; rw.style.height = (y1 - y0).toFixed(1) + 'px';
      const c0 = pair[i], bb = /^#[0-9a-f]{6}$/i.test(c0) && Math.max(...[1, 3, 5].map((j) => parseInt(c0.slice(j, j + 2), 16))) < 48 ? '#454b54' : atL(c0, 0.245);
      rw.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) calc(100% - 12px), #050606), linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 40%), linear-gradient(' + shade(bb, -0.45) + ', ' + bb + ' 30%, ' + shade(bb, -0.15) + ' 55%, ' + shade(bb, -0.62) + ' 88%, ' + shade(bb, -0.82) + ')';
      // letters read against the row as drawn (a light other colour is darkened to the row's shade above)
      if (ink[i] !== '#fff') { const k = panelInk(t, bb); if (k !== '#fff') { rw.style.color = k; rw.style.textShadow = 'none'; } }
      rw.append(fit(el('span', '', (t.abbr || '').toUpperCase())), scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      ins.appendChild(rw);
    });
    // the bases always as the three diamonds (outlined when empty, as on the frame): flattened as on air (21 x 13.6 crop px on the 2013
    // still, a light grey outline, solid yellow when taken)
    const cp = el('div', 'c cp');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), on = live ? b.bases : [false, false, false];
    svg.setAttribute('width', '150'); svg.setAttribute('height', '96'); svg.setAttribute('viewBox', '0 0 150 96');
    svg.innerHTML = [[1, 75, 30], [2, 39, 62], [0, 111, 62]].map(([k, x, y]) =>
      '<polygon points="' + [x - 26, y, x, y - 16, x + 26, y, x, y + 16].join(' ') + '" fill="' + (on[k] ? '#f2d43a' : 'rgba(20,20,22,.6)') + '" stroke="' + (on[k] ? '#f6e48a' : '#a9abb0') + '" stroke-width="3"/>').join('');
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (os) { if (os.detail) { cp.classList.add('dt'); cp.textContent = os.detail; } } else cp.appendChild(svg);
    ins.appendChild(cp);
    const top = el('i', 'rim top');
    top.style.clipPath = poly([[lineX(Y0), 0], [W - lineX(Y0), 0], [W - lineX(Y0 + 2.2), Y(Y0 + 2.2)], [lineX(Y0 + 2.2), Y(Y0 + 2.2)]]);
    root.appendChild(top);
    [false, true].forEach((flip) => {
      const band = el('i', 'rim band'); band.style.clipPath = ring(-BAND, 0, flip);
      const line = el('i', 'rim line'); line.style.clipPath = ring(-LINE / 2, LINE / 2, flip);
      root.append(band, line);
    });
    // the strip: the inning, count and outs centred in the black both ways
    const st = el('div', 'c st');
    if (live) {
      // the inning squeezed into its own box (12TH ran into the count)
      const inn = fit(el('div', 'c in')); inn.style.position = 'relative';
      inn.append(el('small', '', b.half === 'top' ? '▲' : b.half === 'bot' ? '▼' : ''), el('span', '', (g.period.label || '') + (g.period.suffix || '').toUpperCase()));
      const ou = el('div', 'c ou'); ou.style.position = 'relative'; [0, 1].forEach((n) => ou.appendChild(el('i', n < b.outs ? 'on' : '')));
      const cn = el('div', 'c cn', b.balls + '-' + b.strikes); cn.style.position = 'relative';
      st.append(inn, cn, ou);
    } else if (os) {
      const inn = fit(el('div', 'c in', os.period)), cn = el('div', 'c cn', os.clock);
      inn.style.position = cn.style.position = 'relative';
      st.append(inn, cn);
    } else { const w = el('div', 'c w', statusText(g, time)); w.style.position = 'relative'; st.appendChild(w); }
    root.appendChild(st);
  },
};
