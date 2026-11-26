// "Prism box '15": after the 50-over world championship's world feed score box (2015; frame: New Zealand batting, 145-6 after 21.3
// overs, chasing 152). A navy box at the top left cut like a prism: a cyan face down its left side coming to a point, a red field across
// the top right behind the score, a cyan sliver along the slanting foot; three lines: the side and runs-wickets, the overs, the target.
// measured: the box 86 % of the width after the cyan face; its foot
// rises 6 % from left to right; the red field from 39 % across at the top to 59 % at its foot, 33 % of the height; navy #0a125c lit
// +6 L at the top, a lighter facet at the bottom right (#12307c); face #1cb3e6 to #20c8e2; lines' capitals 22 %, 15 % and 15 % of the
// height; the third line cyan (#3ec8f0). Letters a heavy geometric sans, white.
// mapped on the 1080p still:
// the left face is a triangle (top at the box's top-left corner, its point 36 % down, its foot at the box's bottom-left corner), light
// cyan #1cd3f2 outside and a darker blue facet #1692c5 against the box; above the box a violet glass ridge (blue #0c2492 at its left,
// violet #3e0ba4 in the middle, dimming to #2e105a at the right; its top rises from the face to a peak a quarter across, about 11 %
// of the box's height, then falls to the right end); inside, under the red field a lighter violet facet on the right (#1c0f78), a
// lighter blue facet across the bottom (#00135c rising to #003b7b at the right) and the cyan sliver as a wedge on a square foot (14 px
// deep at the right, nothing at the left), not a thin line on a slanted foot.
// the same note, angles read on crop-1 (1080p): the box's left edge leans out at the top (3.3 deg: x 30 at
// the top, 38 at the foot of 279 px), ours leaned the other way; the face's upper edge 19 deg from upright (ours 30) with its point
// 26 % of the face's width further in; the inside facets mapped again (see.ft,.fv,.fb).
import { el, fit, statusText, cricketState, FONTS } from '../kit.js';

const W = 400, H = 250;

export default {
  id: 'cricket-icc-15',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-cricket-icc-15 { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 800; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-icc-15 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-icc-15 *, .sb-cricket-icc-15 *::before { box-sizing: border-box; }
/* everything but the ridge sits 24 px down, under the glass ridge */
.sb-cricket-icc-15 .all { position: absolute; left: 0; right: 0; top: 24px; height: 226px; }
.sb-cricket-icc-15 .all > * { position: absolute; inset: 0; }
.sb-cricket-icc-15 .ridge { position: absolute; inset: 0; clip-path: polygon(38px 24px, 132px 1px, 373px 19px, 373px 25px, 38px 25px); background: linear-gradient(rgba(8,12,40,.3), rgba(8,12,40,0) 60%, rgba(140,120,255,.18) 100%), linear-gradient(90deg, #0d2490 0%, #1a24a0 20%, #3714ae 38%, #3e0ba4 50%, #3b0785 68%, #2e105a 88%, #1c1936 100%); }
.sb-cricket-icc-15 .face { clip-path: polygon(38px 0, 11px 78px, 49px 226px); background: linear-gradient(#4e9fd0 0%, #22bbe7 30%, #1cd3f2 50%, #26bde8 75%, #2fc3e1 100%); }
.sb-cricket-icc-15 .face2 { clip-path: polygon(38px 0, 26px 80px, 49px 226px, 51px 226px, 40px 0); background: linear-gradient(#3684c2, #1692c5 50%, #0999cb); }
/* the box: navy lit at the top, a darker band through the middle and a lighter facet at the bottom right */
.sb-cricket-icc-15 .box { clip-path: polygon(38px 0, 373px 0, 373px 226px, 49px 226px); background: linear-gradient(#0a1466 0%, #060c5a 25%, #050852 45%, #050450 60%, #050450 100%); }
/* the facets inside: the top row left of the red field lit towards its foot;
 under the red a violet triangle whose edge runs from 30 % down at two thirds across to 95 % at the right end; a lighter blue facet
 across the bottom whose top edge falls in one straight line from 57 % down at the left to 91 % at the right; the dark band between; the violet one starts at the red field's lower-left corner and runs on under it */
.sb-cricket-icc-15 .ft { clip-path: polygon(38px 0, 157px 0, 230px 76px, 42px 76px); background: linear-gradient(#010758 0%, #040e5e 35%, #08176a 70%, #0b1e76 100%); }
.sb-cricket-icc-15 .fv { clip-path: polygon(236px 72px, 373px 72px, 373px 215px); background: linear-gradient(#24095a, #1c0f78 40%, #1b0d64); }
.sb-cricket-icc-15 .fb { clip-path: polygon(44px 128px, 373px 205px, 373px 226px, 49px 226px); background: linear-gradient(100deg, #03125a 0%, #00226a 45%, #00307a 80%, #0a3a80 100%); }
.sb-cricket-icc-15 .red { clip-path: polygon(156px 0, 373px 0, 373px 75px, 236px 75px); background: linear-gradient(#7f0230 0%, #9d001d 25%, #97001d 60%, #8b0320 100%); }
.sb-cricket-icc-15 .sliver { clip-path: polygon(85px 226px, 373px 204px, 373px 226px); background: linear-gradient(90deg, #30689b 0%, #50c1e9 30%, #3ecbef 70%, #36cff1 100%); }
.sb-cricket-icc-15 .ln { position: absolute; left: 62px; right: 34px; display: flex; align-items: center; justify-content: space-between; line-height: 1; white-space: nowrap; }
.sb-cricket-icc-15 .l1 { top: 46px; height: 54px; font-size: 47px; }
.sb-cricket-icc-15 .l2 { top: 116px; height: 46px; font-size: 32px; font-weight: 700; }
.sb-cricket-icc-15 .l2 b { font-size: 36px; font-weight: 800; }
.sb-cricket-icc-15 .l3 { top: 178px; height: 44px; font-size: 32px; font-weight: 700; color: #3ec8f0; right: 60px; }
`,
  draw(root, g, { time }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase();
    const all = el('div', 'all');
    all.append(el('div', 'face'), el('div', 'face2'), el('div', 'box'), el('div', 'ft'), el('div', 'fb'), el('div', 'fv'), el('div', 'red'), el('div', 'sliver'));
    root.append(el('div', 'ridge'), all);
    const l1 = el('div', 'ln l1'), l2 = el('div', 'ln l2'), l3 = el('div', 'ln l3');
    if (g.status === 'pre') {
      l1.append(el('span', '', ab(g.home)), el('span', '', 'v ' + ab(g.away)));
      // the start; the word only where the time is short (a day and a time fill the line)
      const st = statusText(g, time);
      l2.append(el('span', '', st.length <= 8 ? 'START' : ''), el('b', '', st));
      l3.appendChild(fit(el('span', '', (g.note || '').toUpperCase())));
    } else {
      // the world feed's order: runs-wickets ("145-6")
      const runs = c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.runs + '-' + c.wkts : String(c.runs);
      l1.append(fit(el('span', '', ab(c.bat))), el('span', '', runs));
      if (c.overs) l2.append(el('span', '', 'OVERS'), el('b', '', c.overs));
      const line = c.result ? c.result.text : c.target != null ? 'TARGET ' + c.target : c.lead != null ? (c.lead >= 0 ? 'LEAD BY ' + c.lead : 'TRAIL BY ' + -c.lead) : c.rate != null ? 'RUN RATE ' + c.rate.toFixed(2) : '';
      l3.appendChild(fit(el('span', '', line)));
    }
    root.append(l1, l2, l3);
  },
};
