// "Steel frame '12": after NESN's Red Sox bug of the early 2010s. A brushed steel frame with rounded
// flanges at its sides: at the left, on dark, each team's letters in white and its score in black on a white box, one row each, and
// beside them the outs on the top row and a lit glass cell on the bottom one; at the right the bases as gold diamonds over the inning
// on a pale plate; under the frame a tab with the network's wordmark on a slanted blue plate (here the Home Assistant logo).
// Left out: the pitch count in the tab (no data). The lit glass cell, blank on the frame, holds the count here (our reading).
// measured (crop px of 126 x 49): frame y 0-35; letters 5-38, score boxes 38-50, outs and glass cell 52-88 (rows y 3-18 and 19-33);
// bases and inning 90-123; tab y 35-49 (blue plate 10-48); capitals 0.2 of the height.
// curves (circle fits on the crop): the frame's sides bow out on an arc of r about 63 px (1.3 H), sag 1.7 px over its 34 px height:
// an elliptical radius 1.7 px across, half the height down; the top is straight (sag 0.8 px over 126 px, noise).
// read on the crop: the steel at the sides runs dark #5d6266 at the top, light
// #c1c6c8 at 40 %, dark #35393c at 57 %, light #d9e6e8 at 92 % (chrome: two light bands round a dark one); the dark panels near
// black (#0d1115 - #1c1a1d) with a faint grey sheen at the top of each row; the inning plate chrome (#f0f1f2 top, #aaabaa at 60 %,
// #e4e5e4 at the foot) with black letters; the NESN plate sits inside the tab's silver outline (a light line above it at y 34, a
// grey one under it at y 47, silver at both slanted ends).
import { el, otherSport, bases, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 4, W = 126 * K, H = 49 * K;
const X = (v) => Math.round(v * K);
const CAP = 9.5 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'mlb-nesn-12',
  size: { w: W, h: H },
  fonts: [FONTS.barlow700],
  css: `
.sb-mlb-nesn-12 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-mlb-nesn-12 .c { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; }
/* the steel frame and its tab */
.sb-mlb-nesn-12 .fr { left: 0; top: 0; width: ${W}px; height: ${X(35)}px; border-radius: ${X(1.7)}px / 50%;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px),
    linear-gradient(#e6e7e9 0%, #5d6266 4%, #8f9b9d 24%, #c1c6c8 40%, #a9adb0 46%, #424649 54%, #35393c 59%, #646a6c 70%, #abaeb0 82%, #d9e6e8 92%, #a7b4b8 97%);
  box-shadow: inset 0 0 0 1px rgba(40,44,48,.55), 0 2px 6px rgba(0,0,0,.5); }
/* the tab: a silver plate with slanted ends; the blue plate inside its silver outline (1.8 px in from every side) */
.sb-mlb-nesn-12 .tb { left: ${X(6)}px; top: ${X(35)}px; width: ${X(48)}px; height: ${X(14)}px; clip-path: polygon(0 0, 100% 0, calc(100% - ${X(3.84)}px) 100%, ${X(3.84)}px 100%);
  background: linear-gradient(#f8fafd, #d0d2d5 40%, #e9e8ec 52%, #90898e 80%, #7d7a80); }
.sb-mlb-nesn-12 .bp { left: ${X(6)}px; top: ${X(35)}px; width: ${X(48)}px; height: ${X(14)}px;
  clip-path: polygon(${X(2.1)}px ${X(1.2)}px, calc(100% - ${X(2.1)}px) ${X(1.2)}px, calc(100% - ${X(5.3)}px) ${X(12.4)}px, ${X(5.3)}px ${X(12.4)}px);
  background: linear-gradient(#335888, #1c45a5 30%, #03225f 75%, #0b2a5c); }
.sb-mlb-nesn-12 .bp .sb-ha { color: #fff; margin-top: -${X(0.4)}px; }
.sb-mlb-nesn-12 .dk { left: ${X(3)}px; top: ${X(3)}px; width: ${X(85)}px; height: ${X(30)}px;
  background: linear-gradient(#2a2b2e 0%, #111214 14%, #060708 46%, #232427 51%, #0e0f11 63%, #050506 100%); box-shadow: inset 0 0 0 1px #000; }
.sb-mlb-nesn-12 .ab { left: ${X(5)}px; width: ${X(32)}px; height: ${X(14)}px; font-size: ${PX}px; }
.sb-mlb-nesn-12 .sc { left: ${X(38)}px; width: ${X(12)}px; height: ${X(12)}px; color: #111; font-size: ${PX}px; background: linear-gradient(#fff, #dedee1); }
/* two-figure scores a size smaller on both rows (the box is the frame's, 12 crop px); before the game the box a little wider and the
   record as wide as its box (the kit's em width shrank with the record's size until it was a speck) */
/*: two figures at 0.84 of the size (they were 0.72, too small), the box 1.5 crop px wider to hold them, still
 clear of the letters and the outs */
.sb-mlb-nesn-12 .sc.two { left: ${X(37.5)}px; width: ${X(13.5)}px; font-size: ${PX * 0.84}px; letter-spacing: -1px; }
.sb-mlb-nesn-12 .sc.pr { left: ${X(37)}px; width: ${X(14.5)}px; }
.sb-mlb-nesn-12 .sc .sb-pre-rec { min-width: 100% !important; }
.sb-mlb-nesn-12 .ou { left: ${X(52)}px; top: ${X(3.5)}px; width: ${X(36)}px; height: ${X(14)}px; font-size: ${PX}px; gap: ${X(1.5)}px; } .sb-mlb-nesn-12 small { font-size: .66em; }
/* the lit glass cell */
.sb-mlb-nesn-12 .gl { left: ${X(52)}px; top: ${X(19)}px; width: ${X(35)}px; height: ${X(13)}px; color: #0f1f40; font-size: ${PX}px; background: radial-gradient(ellipse at 40% 50%, #f4f8ff, #a9c3f0 60%, #6f8fd0); }
.sb-mlb-nesn-12 .rt { left: ${X(90)}px; top: ${X(3)}px; width: ${X(33)}px; height: ${X(16)}px; background: linear-gradient(#232427, #0c0d0f 35%, #050506); }
.sb-mlb-nesn-12 .rt .sb-bases i { background: #7c7d80; } .sb-mlb-nesn-12 .rt .sb-bases i.on { background: linear-gradient(#fff3b0, #e0bd4c); }
.sb-mlb-nesn-12 .in { left: ${X(90)}px; top: ${X(19)}px; width: ${X(33)}px; height: ${X(14)}px; color: #000; font-size: ${PX * 0.9}px; background: linear-gradient(#f0f1f2, #d1d3d4 35%, #aaabaa 60%, #c2c3c2 80%, #e4e5e4); }
.sb-mlb-nesn-12 .w { left: ${X(52)}px; top: ${X(3)}px; width: ${X(71)}px; height: ${X(30)}px; font-size: ${PX * 0.7}px; background: linear-gradient(#232427, #0c0d0f 35%, #050506); }
.sb-mlb-nesn-12 .rt.dt { font-size: ${PX * 0.45}px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 6);
    const live = g.status === 'live' && !os, b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    root.append(el('div', 'c tb'), el('div', 'c fr'), el('div', 'c dk'));
    const bp = el('div', 'c bp'); if (marks(opts).ha) bp.appendChild(haMark(X(8))); root.appendChild(bp);
    const two = [g.away, g.home].some((t) => String(t.score ?? '').length > 1);
    [g.away, g.home].forEach((t, i) => {
      const ab = fit(el('div', 'c ab', (t.abbr || '').toUpperCase())); ab.style.top = X(3.5 + i * 15) + 'px';
      const sc = el('div', 'c sc' + (g.status === 'pre' ? ' pr' : two ? ' two' : '')); sc.style.top = X(4.5 + i * 15) + 'px'; sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      root.append(ab, sc);
    });
    if (live) {
      const ou = el('div', 'c ou'); ou.append(el('span', '', String(b.outs)), el('small', '', 'OUT'));
      const rt = el('div', 'c rt'); rt.appendChild(bases(b.bases, X(5.5)));
      root.append(ou, el('div', 'c gl', b.balls + '-' + b.strikes), rt, fit(el('div', 'c in', (b.half === 'top' ? '▲ ' : b.half === 'bot' ? '▼ ' : '') + (g.period.label || '') + (g.period.suffix || '').toUpperCase())));
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const rt = el('div', 'c rt dt', os.detail);
      root.append(el('div', 'c gl', os.clock), rt, fit(el('div', 'c in', os.period)));
    } else root.appendChild(el('div', 'c w', statusText(g, time)));
  },
};
