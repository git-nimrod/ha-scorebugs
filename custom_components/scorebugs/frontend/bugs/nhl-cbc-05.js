// "Blue capsule '05": after CBC's Hockey Night in Canada score bar of the mid-2000s. A dark navy bar,
// rounded at its right end: the network's gem in red at the left (here the Home Assistant logo, in the gem's red), then two rows, one
// per team: its letters in navy on a white box and its score in white on the blue; at the right the period in navy on a white box
// over the clock in white. The bar comes in from the left edge of the picture.
// measured (crop px of 146 x 42): bar y 4-40 with a rounded right end (below), mark 25-50, letter boxes 55-82,
// scores 84-95, period box and clock 97-133; rows y 8-22 and 23-38; capitals 0.24 of the height, condensed and heavy.
// curves (the right edge traced row by row on the crop, Nov 24 check): straight at x 143 from y 12 to 30, rounding into the top at
// x 133 (radii 10 across / 9 down) and into the foot at x 131 (12 / 9); the left end is cut by the picture's edge.
// the ink measured on the render sat 2.5 px low in its 52 px
// box (8 px over, 3 under) in every cell (letters, scores, period, clock): each cell now lifts its text 1.25 crop px so the ink sits
// in the middle both ways (it was already centred across); the mark centred on the bar (y 22, was 23).
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 4, W = 146 * K, H = 42 * K;
const X = (v) => Math.round(v * K);
const CAP = 10 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'nhl-cbc-05',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.barlowCond700],
  css: `
.sb-nhl-cbc-05 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* the bar: dark navy (#101060-#202070 behind the scores and clock), a brighter blue towards the round end, a pale blue rim round that
   end and a light blue band along the foot */
.sb-nhl-cbc-05 .bar { position: absolute; left: 0; right: ${X(3)}px; top: ${X(4)}px; bottom: ${X(2)}px; border-radius: 0 ${X(10)}px ${X(12)}px 0 / 0 ${X(9)}px ${X(9)}px 0;
  background: linear-gradient(90deg, rgba(32,64,176,0) 84%, rgba(32,68,184,.85) 94%), linear-gradient(rgba(0,0,0,0) 88%, #5070c0 90%, #5070c0 96%, #304090),
    linear-gradient(90deg, #1a3070, #142a68 20%, #141660 45%, #181a66 70%, #1c2a80);
  box-shadow: inset -${X(0.6)}px 0 0 #6090d0, inset 0 2px 0 rgba(255,255,255,.12), 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-cbc-05 .c { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; }
.sb-nhl-cbc-05 .mk { left: ${X(22)}px; top: ${X(7)}px; width: ${X(30)}px; height: ${X(30)}px; } .sb-nhl-cbc-05 .mk .sb-ha { color: #f0483c; }
/* white boxes with navy letters */
.sb-nhl-cbc-05 .wb { background: linear-gradient(#ffffff, #eef0f7); color: #0f1f5c; box-shadow: 0 1px 2px rgba(0,0,30,.5); }
/* Barlow Condensed's capitals sit low in a line-height of 1: each cell lifts its text 1.25 crop px so the ink is centred */
.sb-nhl-cbc-05 .ab, .sb-nhl-cbc-05 .sc, .sb-nhl-cbc-05 .pd, .sb-nhl-cbc-05 .ck { box-sizing: border-box; padding-bottom: ${X(1.25)}px; }
.sb-nhl-cbc-05 .ab { left: ${X(55)}px; width: ${X(27)}px; height: ${X(13)}px; font-size: ${PX}px; }
.sb-nhl-cbc-05 .sc { left: ${X(83)}px; width: ${X(13)}px; height: ${X(13)}px; font-size: ${PX}px; }
.sb-nhl-cbc-05 .pd { left: ${X(97)}px; width: ${X(36)}px; height: ${X(13)}px; font-size: ${PX}px; }
.sb-nhl-cbc-05 .ck { left: ${X(97)}px; width: ${X(36)}px; height: ${X(13)}px; font-size: ${PX}px; }
/* three-figure scores (or any basketball game): the score place a little wider and the period box and clock moved over by as much,
 a little narrower, so the figures keep clear of them (103 ran into the clock, 107 into FINAL) */
.sb-nhl-cbc-05.wide .sc { width: ${X(19)}px; } .sb-nhl-cbc-05.wide .sc > span { min-width: 0 !important; } .sb-nhl-cbc-05.wide .sc > .n3 { font-size: ${Math.round(PX * 0.86)}px; }
.sb-nhl-cbc-05.wide .pd, .sb-nhl-cbc-05.wide .ck { left: ${X(103)}px; width: ${X(33)}px; }
.sb-nhl-cbc-05 .w { font-size: ${PX * 0.62}px; } .sb-nhl-cbc-05 .t { font-size: ${PX * 0.8}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.classList.toggle('wide', g.status !== 'pre' && (g.sport === 'basketball' || [g.away, g.home].some((t) => String(t.score == null ? '' : t.score).length > 2)));
    root.appendChild(el('div', 'bar'));
    const mk = el('div', 'c mk'); if (marks(opts).ha) mk.appendChild(haMark(X(24))); root.appendChild(mk);
    const top = [X(8.5), X(24)];
    [g.away, g.home].forEach((t, i) => {
      const ab = fit(el('div', 'c wb ab', (t.abbr || '').toUpperCase())); ab.style.top = top[i] + 'px';
      const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : '';
      const sc = el('div', 'c sc'); sc.style.top = top[i] + 'px'; sc.appendChild(scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g));
      root.append(ab, sc);
    });
    // before the game a start a day or more ahead goes over both rows like the period and clock: the day in the white box, the time under it
    const st = live ? '' : statusText(g, time), split = /^(SUN|MON|TUE|WED|THU|FRI|SAT) (.+)$/.exec(st);
    const pd = el('div', 'c wb pd' + (live || split ? '' : ' w'), live ? (g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()) : split ? split[1] : st);
    pd.style.top = top[0] + 'px'; root.appendChild(pd);
    const lo = live ? g.clock || '' : split ? split[2] : '';
    if (lo) { const ck = fit(el('div', 'c ck' + (live ? '' : ' t'), lo)); ck.style.top = top[1] + 'px'; root.appendChild(ck); }
  },
};
