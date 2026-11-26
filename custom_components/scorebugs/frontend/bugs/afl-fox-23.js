// "Logo box '23": after the Australian football score box on pay TV (2023; frames: St Kilda v Port Adelaide, first and third quarters).
// The same box as the free-to-air one (afl-seven-21: this file is that one with the clock tab changed; keep the two in step) with a
// black clock tab and white letters. Not the pay-TV channel's 2025 bar (afl-dark-25): a different look, a long see-through bar.
// measured: the same places as '21 (within 1 %); the clock #000204 with a
// light line along its top (+13 L); the home row near black for St Kilda (#282a24) rising +11 L to its foot.
// measured by hand on a reference frame (1080p, box 94 px): the figures' capitals are 0.245 of
// the box's height for goals and behinds and 0.31 for points (ours were 0.21 and 0.26): now 42 and 54 px. Not changed (ideas): the
// logos (on these stills about 1.4 rows wide and cut by the cell; afl-seven-21's 2.3-row logos are too big here) and the clock's letters.
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
${s} .rows { position: absolute; left: 117px; top: 0; width: 483px; height: 120px; display: grid; grid-template-rows: 1fr 1fr; gap: 2px; }
${s} .row { display: grid; grid-template-columns: 139px 106px 94px 1fr; gap: 3px; }
${s} .row > span { display: flex; align-items: center; justify-content: center; font-size: 42px; line-height: 1; font-weight: 600; white-space: nowrap; }
${s} .row > span.p { font-size: 54px; font-weight: 800; }
${s} .row > span.rec { font-size: 24px; font-weight: 700; }
${s} .row .lg { overflow: hidden; }
${s} .row .lg .sb-logo { width: 96px; height: 56px; object-fit: contain; }
${s} .rows.pre .row { grid-template-columns: 139px 1fr; }
`;
}

const pad = (c) => (/^\d:\d\d$/.test(c || '') ? '0' + c : c || '');

/** Draws the box (as afl-seven-21). */
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
    lg.appendChild(logo(t, 56));
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
  id: 'afl-fox-23',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  // the black clock tab, a light line along its top (sampled: #2b3c1b in the top 3 %, then #000204)
  css: boxCss('afl-fox-23', 'linear-gradient(#3a4038 0%, #0b0d0e 6%, #000204 25%, #000204 100%)', '#fff'),
  draw(root, g, { time }) { drawBox(root, g, time); },
};
