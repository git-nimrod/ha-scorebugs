// "Shield box '04": after the free-to-air network's Australian football score box (2004; frame: Fremantle v Brisbane, third quarter,
// a 836 x 480 upload, so the finish readings are guides). A small box at the top left: the two sides' letters on one glossy red plate
// with rounded ends and a silver rim, each side's points on a silver plate whose right edge curves in like a shield, and under them a
// black line with the quarter in yellow and the clock in white.
// measured: red plate 58 % of the width, two rows of 36 % of the
// height each; the red a tube in each row (#7c0924 at the edges to #bb2b3e through the middle, sampled); silver #e3e2e7 to #888888 with
// a step at 38 %; the black line 30 % of the height with a bright top edge (+56 L); capitals 20 % of the height; letters bold, the names
// white with a dark edge, the points black.
// read on two
// 2004 stills: each side is its own row piece: a red tube with a rounded
// cylinder end and a silver end cap, then its own silver points plate whose left edge is a dark arc bowing out over the cap, centred on
// that row's letters (a shallow bow, 13 % of the row's height), and a rounded right end; a dark seam between the two rows. Ours had one red plate and one shield for both rows.
import { el, fit, statusText, FONTS } from '../kit.js';

const W = 300, H = 121;

// a piece's outline as a clip-path polygon: lf(y) and rf(y) are how far in the left and right edges sit at height y; rl and rr are the
// corner radii [top, bottom] on each side
const cin = (y, h, rt, rb) => (y < rt ? rt - Math.sqrt(rt * rt - (rt - y) * (rt - y)) : 0) + (h - y < rb ? rb - Math.sqrt(rb * rb - (rb - h + y) * (rb - h + y)) : 0);
function poly(w, h, lf, rf, rl, rr) {
  const n = Math.max(8, Math.round(h / 2.5)), ys = [];
  for (let i = 0; i <= n; i++) ys.push(h * i / n);
  const L = ys.map((y) => [lf(y) + cin(y, h, rl[0], rl[1]), y]), R = ys.map((y) => [w - rf(y) - cin(y, h, rr[0], rr[1]), y]).reverse();
  return 'polygon(' + L.concat(R).map((q) => q[0].toFixed(1) + 'px ' + q[1].toFixed(1) + 'px').join(',') + ')';
}
const RH = 39;
// row 0 flares out going down, row 1 curves back in (the barrel the stills show)
const endL = (row, d) => (y) => d + 10 * Math.pow(row ? y / RH : 1 - y / RH, 1.15);
const endR = (row, d) => (y) => d + 14 * Math.pow(row ? y / RH : 1 - y / RH, 1.2) * (row ? 0.7 : 1);
const arcX = (row) => (y) => 172 + 11 * Math.pow(row ? 1 - y / RH : y / RH, 1.1);
const cut = (e, w, h, lf, rf, rl, rr) => { e.style.clipPath = poly(w, h, lf, rf, rl, rr); return e; };

export default {
  id: 'afl-nine-04',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-afl-nine-04 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-afl-nine-04 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-afl-nine-04 *, .sb-afl-nine-04 *::before { box-sizing: border-box; }
.sb-afl-nine-04 .row { position: absolute; left: 2px; width: 297px; height: 39px; display: flex; }
.sb-afl-nine-04 .r1 { top: 1px; } .sb-afl-nine-04 .r2 { top: 44px; }
/* each side's letters on its own red tube: a rounded cylinder end with a light rim on the left, a silver end cap on the right */
.sb-afl-nine-04 .tube { width: 169px; flex: none; display: flex; align-items: center; justify-content: center; padding: 0 24px 0 12px; color: #fecbcc; font-size: 34px; line-height: 1; background: linear-gradient(#7c0924 0%, #ac1a36 22%, #bb2b3e 45%, #b32d44 55%, #b31a2d 75%, #8a0416 90%, #7e0013 100%); text-shadow: 0 0 2px #3a0008, 1px 2px 1px rgba(0,0,0,.6); }
/* every piece is cut to its own outline (clip-path polygons from poly below). On the stills each ROW is its own barrel: the
 outer left end flares out going down in the top row and curves back in the bottom row, the right end the same, and the points plate's left edge is
 one arc per row (top row leaning right going down, bottom row leaning back), meeting at the seam. The black line is narrower than the rows, its ends
 silver caps that lean in going down (wider at the top, the bottom edge one straight line). */
.sb-afl-nine-04 .rim { position: absolute; left: 2px; width: 169px; height: 39px; background: linear-gradient(90deg, #f2f2f4 0%, #c8c8ca 100%); }
.sb-afl-nine-04 .rimd { position: absolute; left: 2px; width: 169px; height: 39px; background: #6a0a18; }
.sb-afl-nine-04 .platd { position: absolute; left: 171px; width: 128px; height: 39px; background: #4a4a4c; }
.sb-afl-nine-04 .plate { position: absolute; left: 171px; width: 128px; height: 39px; background: linear-gradient(#dad4c8 0%, #e3e2e7 20%, #d1d1d3 36%, #c4c4c2 40%, #b5b5b5 70%, #888888 100%); }
.sb-afl-nine-04 .capd { position: absolute; left: 156px; width: 40px; height: 39px; background: #3c3c3e; }
.sb-afl-nine-04 .cap { position: absolute; left: 156px; width: 40px; height: 39px; background: linear-gradient(90deg, #b9b9bb 0%, #f2f2f4 40%, #c8c8ca 75%, #9a9a9c 100%); }
.sb-afl-nine-04 .pseam { position: absolute; left: 156px; top: 41px; width: 141px; height: 3px; background: rgba(60,60,62,.75); }
.sb-afl-nine-04 .pt { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center; padding-left: 8px; color: #111; font-size: 39px; line-height: 1; }
.sb-afl-nine-04 .pt.rec { font-size: 26px; }
/* three figures a size smaller */
.sb-afl-nine-04 .pt.wide { font-size: 34px; }
.sb-afl-nine-04 .dnb { position: absolute; left: 12px; top: 89px; width: 277px; height: 32px; background: linear-gradient(90deg, #a9a9ab 0%, #f2f2f4 3.5%, #cfcfd1 7%, #cfcfd1 93%, #f2f2f4 96.5%, #a9a9ab 100%); }
.sb-afl-nine-04 .dn { position: absolute; left: 23px; top: 89px; width: 255px; height: 32px; background: linear-gradient(#c1acad 0%, #514b4b 9%, #020002 22%, #030102 100%); display: flex; align-items: center; justify-content: center; gap: 26px; font-size: 32px; line-height: 1; padding: 2px 10px 0; white-space: nowrap; color: #e6e7e4; }
.sb-afl-nine-04 .dn .q { color: #dadd8a; }
`,
  draw(root, g, { time }) {
    // one barrel per side: its red tube with the letters, then its silver plate with the points; each plate's arc is its own
    const rows = [g.home, g.away].map((t, i) => ({ t, i, y: i ? 44 : 1 }));
    rows.forEach(({ i, y }) => {
      const at = (e) => { e.style.top = y + 'px'; return e; };
      root.append(
        cut(at(el('div', 'rimd')), 169, RH, endL(i, 2.5), () => 0, i ? [3, 8] : [8, 3], [0, 0]),
        cut(at(el('div', 'rim')), 169, RH, endL(i, 0), () => 0, i ? [3, 8] : [8, 3], [0, 0]),
        cut(at(el('div', 'platd')), 128, RH, () => 0, endR(i, 0), [0, 0], i ? [2, 8] : [8, 2]),
        cut(at(el('div', 'plate')), 128, RH, () => 0, endR(i, 3), [0, 0], i ? [2, 7] : [7, 2]));
    });
    rows.forEach(({ t, i, y }) => {
      const row = el('div', 'row r' + (i + 1)), tube = el('div', 'tube');
      tube.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      cut(tube, 169, RH, endL(i, 5), () => 0, i ? [3, 7] : [7, 3], [0, 0]);
      // the points; before the bounce each side's record in their place
      const pt = el('div', 'pt' + (g.status === 'pre' ? ' rec' : g.status !== 'pre' && t.score >= 100 ? ' wide' : ''));
      pt.appendChild(el('span', '', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''));
      row.append(tube, pt); root.appendChild(row);
      const ax = arcX(i);
      const capd = cut(el('div', 'capd'), 40, RH, () => 0, (yy) => 40 - (ax(yy) - 156), [0, 0], [0, 0]);
      const cap = cut(el('div', 'cap'), 40, RH, () => 0, (yy) => 40 - (ax(yy) - 156 - 3), [0, 0], [0, 0]);
      capd.style.top = cap.style.top = y + 'px';
      root.append(capd, cap);
    });
    root.appendChild(el('div', 'pseam'));
    const dnb = el('div', 'dnb'), dn = el('div', 'dn');
    const slant = (y) => 15 * y / 32;
    cut(dnb, 277, 32, slant, slant, [0, 0], [0, 0]);
    cut(dn, 255, 32, slant, slant, [0, 0], [0, 0]);
    root.appendChild(dnb);
    if (g.status === 'live') dn.append(el('span', 'q', ((g.period.label || '') + (g.period.suffix || '')).toUpperCase()), el('span', '', g.clock || ''));
    else dn.appendChild(fit(el('span', 'q', g.status === 'final' ? 'FULL TIME' : statusText(g, time))));
    root.appendChild(dn);
  },
};
