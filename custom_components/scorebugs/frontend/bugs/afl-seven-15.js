// "Dark box '15": after the Australian football score box shared by the free-to-air and pay-TV networks (2015; frame: Hawthorn v West
// Coast, second quarter). A dark box low at the left: a blue tab with the quarter over the clock, the two sides' full names on a dark
// glass plate in two lines, and their points on a red tab at the right.
// measured: blue tab 16 % of the width, names 65 %, red 13 %, gaps
// 1 %; two rows of 47 %; blue #0e4270, near flat; the dark plate #222022 at 86 %, lit over its top half (+11 L, horizon 50 %), a faint light line at the top; the box 6.5 times as wide as tall (checked by hand); red #b2011e, darker at
// its top and foot edges; capitals 30 % of the height (checked by hand: 17 of 56 px); letters a condensed bold sans, white.
// sampled in a grid on two 2015 stills:
// the names plate is near black, #161516 (L 7) at its left rising to #232123 (L 14) at its right, a faint light line at the top (+11 L)
// and a soft step at 51 %; almost nothing shows through it. Ours was a see-through grey (L 19-20).
import { el, fit, statusText, FONTS } from '../kit.js';

const W = 640, H = 98;

export default {
  id: 'afl-seven-15',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond600],
  css: `
.sb-afl-seven-15 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 600; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-afl-seven-15 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-afl-seven-15 *, .sb-afl-seven-15 *::before { box-sizing: border-box; }
.sb-afl-seven-15 .bar { position: absolute; inset: 0; display: flex; gap: 5px; }
/* the outer corners rounded (measured about 8-12 px on the frame) */
.sb-afl-seven-15 .clk { border-radius: 10px 0 0 10px; }
.sb-afl-seven-15 .pts { border-radius: 0 10px 10px 0; }
.sb-afl-seven-15 .clk { width: 106px; background: linear-gradient(#144475 0%, #0e4373 25%, #084170 50%, #103f6f 80%, #0c3b63 100%); display: grid; grid-template-rows: 1fr 1fr; place-items: center; font-size: 38px; line-height: 1; padding: 4px 0; }
.sb-afl-seven-15 .clk.one { grid-template-rows: 1fr; font-size: 26px; }
.sb-afl-seven-15 .nms { flex: 1; min-width: 0; background: linear-gradient(rgba(255,255,255,.018) 0%, rgba(255,255,255,.012) 50%, rgba(0,0,0,.05) 51%, rgba(0,0,0,0) 100%), linear-gradient(90deg, rgba(17,16,18,.98) 0%, rgba(21,20,23,.98) 45%, rgba(31,29,33,.97) 82%, rgba(37,35,39,.97) 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,.16); display: grid; grid-template-rows: 1fr 1fr; padding: 2px 22px 2px 30px; font-size: 42px; line-height: 1; }
.sb-afl-seven-15 .nms > span { display: flex; align-items: center; white-space: nowrap; }
.sb-afl-seven-15 .pts { width: 96px; background: linear-gradient(#802c36 0%, #bb0327 10%, #ba0021 25%, #a60019 50%, #b5001f 75%, #aa011e 90%, #7e1322 100%); display: grid; grid-template-rows: 1fr 1fr; place-items: center; font-size: 42px; line-height: 1; padding: 2px 0; }
.sb-afl-seven-15 .pts.rec { font-size: 26px; }
`,
  draw(root, g, { time }) {
    const bar = el('div', 'bar'), clk = el('div', 'clk'), nms = el('div', 'nms'), pts = el('div', 'pts' + (g.status === 'pre' ? ' rec' : ''));
    if (g.status === 'live') clk.append(el('span', '', ((g.period.label || '') + (g.period.suffix || '')).toUpperCase()), el('span', '', g.clock || ''));
    else if (g.status === 'final') clk.append(el('span', '', 'FULL'), el('span', '', 'TIME'));
    else { clk.classList.add('one'); clk.appendChild(fit(el('span', '', statusText(g, time)))); }
    [g.home, g.away].forEach((t) => {
      // the full name as on air ("WEST COAST EAGLES"), its short name when it will not fit
      nms.appendChild(fit(el('span', '', (t.longName || t.name || t.abbr || '').toUpperCase()), (t.name || t.abbr || '').toUpperCase()));
      // the points; before the bounce each side's record in their place
      pts.appendChild(el('span', '', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''));
    });
    bar.append(clk, nms, pts);
    root.appendChild(bar);
  },
};
