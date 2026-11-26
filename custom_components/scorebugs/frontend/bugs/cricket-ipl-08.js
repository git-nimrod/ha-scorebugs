// "Red slash '08": after the Indian T20 league's world feed bar in its first season (2008; frame: Mumbai chasing, 81-3, "NEED 128 TO
// WIN FROM 63 BALLS (12.2 rpo)"). One bar leaning "/" at both ends, its top right corner rounded: a near-black maroon end with the side
// and runs-wickets, then a deep red run with the state of the game in tall condensed white capitals.
// measured: ends lean 13 deg and bow 9-12 px (geomdiff); the dark end 25 % of the width,
// #2a0002 lit to #740617 along the top (horizon 29 %); the red #8c0006, lighter at the top; corner 12 px; capitals 52 % of the bar's
// height (checked by hand: 34 of 66 px); letters a condensed sans, white.
import { el, fit, statusText, cricketState, FONTS } from '../kit.js';

const W = 1180, H = 96;

export default {
  id: 'cricket-ipl-08',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond500],
  css: `
.sb-cricket-ipl-08 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 500; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-ipl-08 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-ipl-08 *, .sb-cricket-ipl-08 *::before { box-sizing: border-box; }
/* the bar leans 12 deg and its ends bow (measured: bow 9-12 px over the bar's height, the foot right corner about 30 px round) */
.sb-cricket-ipl-08 .bar { position: absolute; inset: 4px 12px; transform: skewX(-13deg); border-radius: 12px 16px 26px 12px / 44px 16px 30px 44px; overflow: hidden; background: linear-gradient(#c3101e 0%, #a5000c 30%, #8d0006 60%, #7d0005 100%); display: flex; align-items: center; font-size: 64px; line-height: 1; }
/* the dark end; the divider to the red bows like the ends */
.sb-cricket-ipl-08 .dark { position: absolute; inset: 0 auto 0 0; width: 292px; border-radius: 0 24px 24px 0 / 0 50% 50% 0; background: linear-gradient(#740617 0%, #5d000e 12%, #590008 26%, #280000 42%, #220002 75%, #3a0a08 100%); }
.sb-cricket-ipl-08 .bar > span { transform: skewX(13deg); white-space: nowrap; }
.sb-cricket-ipl-08 .ab { position: absolute; left: 36px; width: 100px; }
.sb-cricket-ipl-08 .rn { position: absolute; left: 120px; width: 156px; text-align: right; }
.sb-cricket-ipl-08 .msg { position: absolute; left: 300px; right: 34px; white-space: nowrap; }
.sb-cricket-ipl-08 span { text-shadow: 0 1px 2px rgba(0,0,0,.45); }
`,
  draw(root, g, { time }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase();
    const bar = el('div', 'bar'); bar.appendChild(el('div', 'dark'));
    const side = g.status === 'pre' ? g.home : c.bat, other = side === g.home ? g.away : g.home;
    let runs = '', msg = '';
    if (g.status === 'pre') msg = 'v ' + ab(other) + '   ' + statusText(g, time);
    else {
      // runs-wickets ("81-3")
      runs = c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.runs + '-' + c.wkts : String(c.runs);
      if (c.result) msg = c.result.text;
      else if (c.need != null) msg = 'NEED ' + c.need + ' TO WIN' + (c.ballsLeft > 0 ? ' FROM ' + c.ballsLeft + (c.ballsLeft === 1 ? ' BALL (' : ' BALLS (') + (c.need * 6 / c.ballsLeft).toFixed(1) + ' rpo)' : '');
      else if (c.lead != null) msg = (c.lead >= 0 ? 'LEAD BY ' : 'TRAIL BY ') + Math.abs(c.lead) + (c.overs ? '  (' + c.overs + ' OVERS)' : '');
      else msg = (c.overs ? c.overs + ' OVERS' : '') + (c.rate != null ? ' (' + c.rate.toFixed(1) + ' rpo)' : '');
    }
    bar.append(fit(el('span', 'ab', ab(side))), el('span', 'rn', runs), fit(el('span', 'msg', msg)));
    root.appendChild(bar);
  },
};
