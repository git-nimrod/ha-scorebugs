// "Mesh box '13": after FOX's MLB score box from the 2012 NLCS through 2013. The same box as FOX's NFL bug of 2012-13
// : the two team rows in their colours, a carbon mesh panel at their right with the bases
// as outlined diamonds, both held between two bracket arcs (a near-black band with a glassy silver line inside it) under a silver rim
// along the top; under them a narrower dark foot, its sides slanting in, with the half inning (a yellow arrow), the count and the outs.
// measured on the 2013 still (crop 234 x 90 px; here 2.4 px a crop px): the box 221 x 76 (0.34 as tall as wide); the rows 26 px each,
// the team colour to 128 (57 % of the box), the mesh from there to the right bracket; the silver line one circle each side (r 52.9,
// fit within 0.4 px, widest a third of the way down the rows), the band out to 6 px past it; a 2 px rim along the top; the foot 17 px
// tall, 21.5 px in at its top, its sides 28 deg from upright; capitals 13 px (0.5 of a row), wide and heavy. Left out: the pitch speed
// and pitch count under the bases (no data), so the bases sit in the middle of the mesh.
import { el, otherSport, statusText, scoreSlot, teamPair, teamColor, panelInk, shade, FONTS } from '../kit.js';

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

const W = 532, H = 188, S = 2.4;
// the silver line's circle on the left (crop px moved to ours: x - 3.8, y - 5), mirrored on the right
const CX = (62.8 - 3.8) * S, CY = (31.3 - 5) * S, R = 52.9 * S;
// the top row 9.6-72.4, a 2 px seam, the lower row 74.4-138 (crop 9-35, 36-62.5)
const ROWS = [9.6, 72.4, 74.4, 138];
// the foot: top, bottom, x in at the top, x in at the bottom
const FOOT = [141, 183, 42, 62];
const lineX = (y) => CX - Math.sqrt(R * R - (y - CY) * (y - CY));
// the band 6 crop px out from the silver line; the line 1.7 crop px wide; the colour ends square against the mesh at crop 128
const BAND = 14.4, LINE = 4, TEAM_END = 298;
const pts = (y0, y1, d, flip) => {
  const o = [];
  for (let k = 0; k <= 14; k++) { const y = y0 + (y1 - y0) * k / 14, x = lineX(y) + d; o.push([flip ? W - x : x, y]); }
  return o;
};
const poly = (a) => 'polygon(' + a.map(([x, y]) => x.toFixed(1) + 'px ' + y.toFixed(1) + 'px').join(', ') + ')';
// a band between two offsets from the silver line, down the rows
const ring = (d0, d1, flip) => poly(pts(0, ROWS[3], d0, flip).concat(pts(0, ROWS[3], d1, flip).reverse()));
// the whole box: the band's outer arc down the rows, a step in, the foot slanting in, and the same on the right
const SHAPE = (() => {
  const l = pts(0, ROWS[3], -BAND, false).concat([[FOOT[2], FOOT[0]], [FOOT[3], FOOT[1]]]);
  const r = l.map(([x, y]) => [W - x, y]).reverse();
  return poly(l.concat(r));
})();
// the rows' area: inside the silver line (the colour runs under it and is cut by its curve)
const INNER = poly(pts(ROWS[0], ROWS[3], 0, false).concat(pts(ROWS[0], ROWS[3], 0, true).reverse()));

export default {
  id: 'mlb-fox-13',
  size: { w: W, h: H },
  fonts: [FONTS.saira],
  css: `
.sb-mlb-fox-13 { font-family: 'SB Saira', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 125%; color: #fff; }
.sb-mlb-fox-13 .bx, .sb-mlb-fox-13 .in, .sb-mlb-fox-13 .rim { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
/* the box's body near black (the band's 4-9 of 255), under everything */
.sb-mlb-fox-13 .bx { clip-path: ${SHAPE}; background: linear-gradient(#141617, #0b0c0c 50%, #070808); }
.sb-mlb-fox-13 .in { clip-path: ${INNER}; }
/* the mesh panel (crop 128 to the right bracket): a fine carbon weave, dark green-grey (#1e211c, L 11-13 on the 2013 still) */
.sb-mlb-fox-13 .ms { position: absolute; left: ${TEAM_END}px; right: 0; top: ${ROWS[0]}px; height: ${ROWS[3] - ROWS[0]}px;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 2.5px, transparent 2.5px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,.28) 0 2.5px, transparent 2.5px 5px), linear-gradient(#242823, #1b1e1a 60%, #161815); }
.sb-mlb-fox-13 .r { position: absolute; left: 0; width: ${TEAM_END}px; display: flex; align-items: center; box-sizing: border-box; padding: 0 0 2px 62px; font-size: 44px; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,.5); }
.sb-mlb-fox-13 .r .n { width: 124px; white-space: nowrap; }
.sb-mlb-fox-13 .r .s { flex: 1; text-align: center; padding-right: 22px; white-space: nowrap; }
/* one gloss across the top of the box under the rim (the still: the red row lifted +10 L from 10 to 40 % down, the mesh's top band
   L 37 over 13 below, crop rows 10-19, a horizon there), over the top row's colour and the mesh alike; the lower row has none */
.sb-mlb-fox-13 .gl { position: absolute; left: 0; right: 0; top: ${ROWS[0] + 2}px; height: 25px; background: linear-gradient(rgba(220,236,232,.15), rgba(220,236,232,.21) 92%, rgba(220,236,232,.04) 96%, rgba(220,236,232,0)); pointer-events: none; }
/* the rim along the top: dark above, brightest on its last row (the still: 41, 95, 172, 237 down crop rows 5-8), from one silver
   line to the other, under the brackets */
.sb-mlb-fox-13 .rim.top { clip-path: polygon(${lineX(0).toFixed(1)}px 0, ${(W - lineX(0)).toFixed(1)}px 0, ${(W - lineX(9.6)).toFixed(1)}px 9.6px, ${lineX(9.6).toFixed(1)}px 9.6px); background: linear-gradient(#2a2f30 0, #5f6566 25%, #b9bdbe 55%, #eef1f0 80%, #6a5f62); }
/* the brackets (as nfl-fox-12): the near-black band from its outer edge to the silver line, a faint glassy line along the band's
   outer edge (the still: L 110-150, 1 crop px), and the silver line itself (L 250 down the middle, 160-200 at the ends) */
.sb-mlb-fox-13 .rim.band { background: linear-gradient(#24272c, #101114 60%, #17191c); }
.sb-mlb-fox-13 .rim.edge { background: linear-gradient(rgba(170,180,186,.35), rgba(190,200,206,.6) 45%, rgba(170,180,186,.4)); }
.sb-mlb-fox-13 .rim.line { background: linear-gradient(#7d838a, #f4f6f8 38%, #e3e6ea 55%, #aab0b7); }
/* the foot: dark green-grey (#17211f, L 11, flat), with fine light lines across it every 5 px (scan lines on the still); its letters
   narrower than the rows' (4TH, 2-2 on the still) */
.sb-mlb-fox-13 .ft { position: absolute; left: 0; top: ${FOOT[0]}px; width: ${W}px; height: ${FOOT[1] - FOOT[0]}px; display: flex; align-items: center; justify-content: center;
  clip-path: polygon(${FOOT[2]}px 0, ${W - FOOT[2]}px 0, ${W - FOOT[3]}px 100%, ${FOOT[3]}px 100%);
  background: repeating-linear-gradient(rgba(255,255,255,.045) 0 2px, transparent 2px 5px), linear-gradient(#1a2321, #141c1a);
  font-size: 38px; font-weight: 700; font-stretch: 82%; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-13 .ft .inn { width: 150px; color: #ecd43c; display: flex; align-items: baseline; justify-content: center; }
.sb-mlb-fox-13 .ft .inn b { font-size: 24px; margin-right: 6px; }
.sb-mlb-fox-13 .ft .inn .sb-ord { font-size: .72em; }
.sb-mlb-fox-13 .ft .c { width: 150px; text-align: center; font-size: 40px; }
.sb-mlb-fox-13 .ft .pips { width: 120px; display: flex; gap: 19px; justify-content: center; }
.sb-mlb-fox-13 .ft .pips i { width: 17px; height: 17px; border-radius: 50%; background: #565a59; }
.sb-mlb-fox-13 .ft .pips i.on { background: radial-gradient(circle at 40% 35%, #fff59a, #ecd83c 60%, #c4ae1c); }
.sb-mlb-fox-13 .ft .w { font-size: 32px; }
.sb-mlb-fox-13 .bz { position: absolute; left: ${TEAM_END}px; right: 26px; top: ${ROWS[0]}px; height: ${ROWS[3] - ROWS[0]}px; }
.sb-mlb-fox-13 .bz.os { display: grid; place-items: center; padding: 0 10px 0 16px; box-sizing: border-box; }
.sb-mlb-fox-13 .bz .dt { font-size: 36px; font-weight: 700; font-stretch: 82%; line-height: 1.1; text-align: center; color: #fff; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const cols = teamPair(g.away, g.home, '#4a505a');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (cols[i].toLowerCase() !== String(teamColor(t, '#4a505a')).toLowerCase() ? panelInk(t, cols[i]) : '#fff'));
    root.appendChild(el('div', 'bx'));
    const inn = el('div', 'in');
    inn.appendChild(el('div', 'ms'));
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r'), y0 = i ? ROWS[2] : ROWS[0], y1 = i ? ROWS[3] : ROWS[1];
      r.style.top = y0 + 'px'; r.style.height = (y1 - y0) + 'px';
      // the team's colour, square against the mesh: a dark line along its top, the colour, darkening to about 40 % at its foot (the
      // still: STL red #b71c37 in the middle, #4a000a at the foot; BOS #062a56 to #03213b)
      // a near-black team (Pirates, White Sox) lifted to a charcoal so its row still reads on the near-black box (as nfl-fox-12)
      const c = /^#[0-9a-f]{6}$/i.test(cols[i]) && Math.max(...[1, 3, 5].map((j) => parseInt(cols[i].slice(j, j + 2), 16))) < 48 ? '#454b54' : cols[i];
      const bb = c === '#454b54' ? c : atL(c, 0.245);
      r.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) calc(100% - 12px), #050606), linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 40%), linear-gradient(' + shade(bb, -0.45) + ', ' + bb + ' 30%, ' + shade(bb, -0.15) + ' 55%, ' + shade(bb, -0.62) + ' 88%, ' + shade(bb, -0.82) + ')';
      // letters read against the row as drawn (a light other colour is darkened to the row's shade above)
      if (ink[i] !== '#fff') { const k = panelInk(t, bb); if (k !== '#fff') { r.style.color = k; r.style.textShadow = 'none'; } }
      r.append(el('span', 'n', (t.abbr || '').toUpperCase().slice(0, 3)));
      if (g.status === 'pre') { const rec = el('span', 's', t.record || ''); rec.style.fontSize = (t.record || '').length > 5 ? '.48em' : '.62em'; r.appendChild(rec); }
      else r.appendChild(scoreSlot(el('span', 's', t.score != null ? String(t.score) : ''), g));
      inn.appendChild(r);
    });
    // the bases: flattened diamonds (21 x 13.6 crop px on the still, a 1.3 px light grey outline with the mesh showing inside; solid
    // yellow when taken), second at the top, first and third under it each side; centred in the mesh (no pitch speed under them)
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    const bz = el('div', 'bz'); svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.setAttribute('viewBox', '0 0 208 128');
    const os = otherSport(g, 9);
    const on = b ? b.bases : [false, false, false], dw = 28, dh = 18;
    svg.innerHTML = [[1, 104, 44], [2, 64, 78], [0, 144, 78]].map(([k, x, y]) =>
      '<polygon points="' + [x - dw, y, x, y - dh, x + dw, y, x, y + dh].join(' ') + '" fill="' + (on[k] ? '#efd23a' : 'rgba(10,12,10,.35)') + '" stroke="' + (on[k] ? '#f4e27a' : '#b5b9b8') + '" stroke-width="3"/>').join('');
    // another sport's game: one detail of the game where the bases were (nothing when there is none)
    if (os) { bz.classList.add('os'); if (os.detail) bz.appendChild(el('span', 'dt', os.detail)); } else bz.appendChild(svg);
    inn.appendChild(bz);
    inn.appendChild(el('div', 'gl'));
    root.appendChild(inn);
    root.appendChild(el('i', 'rim top'));
    [false, true].forEach((flip) => {
      const band = el('i', 'rim band'); band.style.clipPath = ring(-BAND, 0, flip);
      const edge = el('i', 'rim edge'); edge.style.clipPath = ring(-BAND, -BAND + 2.4, flip);
      const line = el('i', 'rim line'); line.style.clipPath = ring(-LINE / 2, LINE / 2, flip);
      root.append(band, edge, line);
    });
    const ft = el('div', 'ft');
    if (live) {
      const ii = el('span', 'inn'); ii.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), g.period.label); ii.appendChild(el('span', 'sb-ord', g.period.suffix || ''));
      const pips = el('span', 'pips'); for (let i = 0; i < 2; i++) pips.appendChild(el('i', i < b.outs ? 'on' : ''));
      ft.append(ii, el('span', 'c', b.balls + '-' + b.strikes), pips);
    } else if (os) ft.append(el('span', 'inn', os.period), el('span', 'c', os.clock));
    else ft.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(ft);
  },
};
