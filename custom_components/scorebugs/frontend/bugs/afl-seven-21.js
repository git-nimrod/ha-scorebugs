// "Logo box '21": after the Australian football score box on free-to-air TV (2021-23; frames: Brisbane v Western Bulldogs, second and
// third quarters). The same box was used on pay TV with a black clock (afl-fox-23: a copy of this file with that tab; keep the two in step). Low at the left: a gold clock
// tab (the quarter over the clock), then two rows: the home side's on its colour, the away side's on white in its colour's letters;
// each row a logo cell, then the goals, the behinds and the points in their own cells, the points larger.
// measured: clock 19.4 % of the width, logo cell 23 %, goals and
// behinds cells 17.7 % and 15.6 %, points 22.3 %; rows 49 % each; gold #eaf0be at the top to #8b8b58 at the foot (sampled); home row the
// team colour near flat (+4 L top line), its logo cell a touch brighter toward the foot; away row #fafafd with a grey top (-11 L) and a
// light grey logo cell (#e2e0e5) edged in the side's colour; cells parted by 3 px lines; capitals 24 % of the height for goals,
// 29 % for points; letters a geometric bold sans; the clock padded to 00:00.
// read on the two 2021 stills
// : each logo is drawn about 1.6 times its row's height and cut by its cell top and foot (the lion's mane
// and the bulldog's shield run off the cell), centred on its face; ours fitted the whole logo inside the cell (56 px in a 59 px row).
// The kit's focal point (data-focus face) slides each cut logo so its face sits in the cell's middle.
// the same note measured by hand on crop-1 (1080p): the lion's face (brow to chin) is 0.77 of its row and
// the bulldog's head 0.8, the mane and shield cut by the cell on every side, no wordmark showing; ours drew the face at 0.6 of the row
// with ESPN's LIONS wordmark showing above it. Now 136 px logos (2.3 rows) on the kit's focal point, wide ones kept to three quarters
// of their height (data-keep). Tried: the kit's 'face' point (lands on the LIONS letters: the lion cut at the eyes) and a fixed lift
// (right for the Lions, wrong for West Coast's and the Giants' logos, whose wordmark is at the foot).
import { el, fit, logo, statusText, teamColor, shade, relight, FONTS } from '../kit.js';

const W = 600, H = 120;

/** The box's css for one bug id and its clock tab (background, ink). */
function boxCss(id, clock, ink) {
  const s = '.sb-' + id;
  return `
${s} { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 700; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
${s} [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
${s} *, ${s} *::before { box-sizing: border-box; }
${s} .clk { position: absolute; left: 0; top: 0; width: 116px; height: 120px; background: ${clock}; color: ${ink}; display: grid; grid-template-rows: 1fr 1fr; place-items: center; padding: 24px 4px 22px; font-size: 33px; font-weight: 800; line-height: 1; }
${s} .clk.one { grid-template-rows: 1fr; font-size: 24px; text-align: center; }
${s} .clk .small { font-size: 24px; }
${s} .rows { position: absolute; left: 117px; top: 0; width: 483px; height: 120px; display: grid; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); gap: 2px; }
${s} .row { display: grid; grid-template-columns: 139px 106px 94px 1fr; gap: 3px; min-height: 0; }
${s} .row > span { display: flex; align-items: center; justify-content: center; font-size: 36px; line-height: 1; font-weight: 600; white-space: nowrap; }
${s} .row > span.p { font-size: 44px; font-weight: 800; }
${s} .row > span.rec { font-size: 24px; font-weight: 700; }
${s} .row .lg { overflow: hidden; position: relative; min-height: 0; }
/* the logo about 2.3 times the row's height, cut by the cell and centred on its face (the face itself about 0.8 of the row, as on air) */
${s} .row .lg .sb-logo { width: 192px; height: 136px; object-fit: contain; flex: none; }
${s} .rows.pre .row { grid-template-columns: 139px 1fr; }
`;
}

const pad = (c) => (/^\d:\d\d$/.test(c || '') ? '0' + c : c || '');

/** Draws the box (afl-fox-23 has the same). */
function drawBox(root, g, time) {
  const clk = el('div', 'clk');
  if (g.status === 'live') clk.append(el('span', '', ((g.period.label || '') + (g.period.suffix || '')).toUpperCase()), el('span', '', pad(g.clock)));
  else if (g.status === 'final') clk.append(el('span', '', 'FULL'), el('span', '', 'TIME'));
  else {
    // before the game: a day and a time on two lines, like the quarter and the clock ("SAT" over "12:25 PM")
    const st = statusText(g, time), m = /^([A-Z]{3}) (.+)$/.exec(st);
    if (m) clk.append(el('span', 'small', m[1]), fit(el('span', 'small', m[2])));
    else { clk.classList.add('one'); clk.appendChild(fit(el('span', '', st))); }
  }
  const rows = el('div', 'rows' + (g.status === 'pre' ? ' pre' : ''));
  [g.home, g.away].forEach((t, i) => {
    const c = teamColor(t, i ? '#1a2b6b' : '#7a1f3d'), row = el('div', 'row'), lg = el('span', 'lg');
    // the kit's focal point slides the cut logo onto its detail; a wide logo (a wordmark) keeps three quarters of its height
    lg.dataset.keep = '0.75';
    lg.appendChild(logo(t, 136));
    const cells = g.status === 'pre' ? [el('span', 'rec', t.record || '')] : [el('span', '', t.goals != null ? String(t.goals) : ''), el('span', '', t.behinds != null ? String(t.behinds) : ''), el('span', 'p', t.score != null ? String(t.score) : '')];
    if (!i) {
      // the home row: the side's colour, near flat with a light line at the top; its logo cell a touch brighter toward the foot
      const bg = 'linear-gradient(' + relight(c, 4) + ' 0%, ' + c + ' 10%, ' + c + ' 75%, ' + relight(c, 2) + ' 100%)';
      cells.forEach((x) => { x.style.background = bg; });
      lg.style.background = 'linear-gradient(' + relight(c, -4) + ', ' + c + ' 40%, ' + relight(c, 9) + ')';
    } else {
      // the away row: white with a grey top, the side's colour as ink; the logo cell light grey edged in the side's colour
      const ink = shade(c, -0.1);
      cells.forEach((x) => { x.style.background = 'linear-gradient(#e2dfe4 0%, #f6f6f8 25%, #fafafc 50%, #fdfcff 100%)'; x.style.color = ink; });
      lg.style.background = 'linear-gradient(90deg, ' + c + ' 0 5px, rgba(0,0,0,0) 5px), linear-gradient(#e2e0e5, #cac9d0 15%, #c8cad0 60%, #e9ebe8)';
    }
    row.append(lg, ...cells);
    rows.appendChild(row);
  });
  root.append(clk, rows);
}

export default {
  id: 'afl-seven-21',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  // the gold clock tab (sampled: #eaf0be lit at the top, #b8a972 through the middle, #8b8b58 at the foot)
  css: boxCss('afl-seven-21', 'linear-gradient(#eaf0be 0%, #d0ca8c 10%, #c0b47c 25%, #b8a972 45%, #ab9f6a 55%, #9d955e 75%, #8b8b58 100%)', '#111'),
  draw(root, g, { time }) { drawBox(root, g, time); },
};
