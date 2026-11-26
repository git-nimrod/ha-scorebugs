// "Stadium block '25" (was "Bracket bar"): three equal columns. The left
// column has the match clock on a mid-grey strip over a light-grey tile with the league's logo; each team's column has its letters over
// a large score, both on the club's own colour, with a thin strip of its second colour along the foot. Added time goes in a dark box
// to the left of the clock ("+3"), the clock itself stopping at 45:00 / 90:00. Frames: the league's spec sheet (BMG v RBL) and the
// on-air bug (BAY v VFB), reference pack SOC0007 and SOC0236_bundes. Measured on the on-air frame: clock row 25 % of the height,
// score cap height 38 %, letters and clock cap height 9-10 %; columns equal.
// loop pass 2, on the three 1080p Bundesliga stills (all A): the clock row is dark grey (#343436) with white figures and a
// leading zero ("05:39"), not light grey with black figures; the team letters are bigger (cap 0.58-0.60 of the header row, ours 0.42: 30 -> 40 px); the
// league's tile mark is bigger (0.82 of the tile on air, ours 0.49), its colours and the cut under the wordmark kept (his call).
import { el, soccerClock, homeFirst, leagueLogo, marks, FONTS, fit, scoreSlot, abbr3, teamColor, inkOn, contrast } from '../kit.js';

const C = 140;                 // one column
const TOP = 50, LOW = 142, FOOT = 8, H = TOP + LOW + FOOT;
const ADD = 64;                // room for the added-time box on the left
const W = ADD + 3 * C;
const GREY = { clock: '#343436', tile: '#dddee0', add: '#2c2d30' };

export default {
  id: 'soc-bracket-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.inter],
  css: `
.sb-soc-bracket-25 { font-family: 'SB Inter V', Arial, sans-serif; font-weight: 700; font-stretch: 88%; line-height: 1; }
/* face: Bundesliga DFL: Inter Bold */
.sb-soc-bracket-25 .blk { position: absolute; left: ${ADD}px; top: 0; width: ${3 * C}px; height: ${H}px; display: grid;
  grid-template-columns: repeat(3, ${C}px); grid-template-rows: ${TOP}px ${LOW}px ${FOOT}px; box-shadow: 0 3px 8px rgba(0,0,0,.4); }
.sb-soc-bracket-25 .add { position: absolute; left: 0; top: 0; width: ${ADD}px; height: ${TOP}px; background: ${GREY.add}; color: #fff;
  display: grid; place-items: center; font-size: 30px; }
.sb-soc-bracket-25 .ck { grid-area: 1 / 1; background: linear-gradient(#3b3a3c, #2e2e30); color: #fff; display: grid; place-items: center; font-size: 34px;
  letter-spacing: 1px; font-variant-numeric: tabular-nums; padding: 0 6px; white-space: nowrap; overflow: hidden; }
.sb-soc-bracket-25 .lg { grid-column: 1; grid-row: 2 / 4; background: ${GREY.tile}; display: grid; place-items: center; }
/* only the figure and the ball: the logo's square kept and the league's name under it cut off */
.sb-soc-bracket-25 .lg .cut { width: 96px; height: 74px; overflow: hidden; display: grid; justify-items: center; align-items: start; }
.sb-soc-bracket-25 .lg .sb-league { width: 96px; height: 96px; }   /* (kept in its colours: ESPN's file has a solid square behind the mark, so it cannot be turned dark grey as on air) */
.sb-soc-bracket-25 .n { display: grid; place-items: center; font-size: 40px; letter-spacing: 1px; padding: 0 6px; white-space: nowrap; overflow: hidden; }
.sb-soc-bracket-25 .s { display: grid; place-items: center; padding: 0 12px; font-size: 104px; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const blk = el('div', 'blk');
    // the clock stops at the half's full time and the added minutes go in their own box ("90'+5'" -> 90:00 and +5)
    let clock = soccerClock(g, time), add = '';
    const m = /^(\d+)'?\s*\+\s*(\d+)/.exec(g.status === 'live' ? String(g.clock || '') : '');
    if (m) { clock = m[1] + ':00'; add = '+' + m[2]; }
    const lg = el('div', 'lg');
    // the Bundesliga's logo carries its name under the mark: only the mark is shown; another league's logo whole
    if (mk.league) { if (g.league === 'BUND') { const cut = el('div', 'cut'); cut.appendChild(leagueLogo(g, 96)); lg.appendChild(cut); } else lg.appendChild(leagueLogo(g, 96)); }
    clock = clock.replace(/^(\d):/, '0$1:');   // on air "05:39", a leading zero
    blk.append(fit(el('div', 'ck', clock)), lg);
    // each team: letters (row 1), score (row 2) and a strip of its second colour (row 3), all in its own column
    [h, a].forEach((t, i) => {
      const bg = teamColor(t, '#2a2b2e'), ink = inkOn(bg), c = String(i + 2);
      const c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') && contrast(t.color2, bg) >= 1.6 ? t.color2 : bg;
      const n = fit(el('div', 'n', abbr3(t)));
      // not fitted: a score always fits its column, and an empty fitted box holds an inner span, so the kit could not put the team's
      // logo in it before the game
      const s = scoreSlot(el('div', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      // before the game with both records known, the bug sets them itself at a size that fits the column (the kit's fitting measured
      // before the face arrived and left "10-5" running out of it); with no records the kit puts the logo there
      if (g.status === 'pre' && h.record && a.record) { s.textContent = t.record; s.style.fontSize = (Math.max(h.record.length, a.record.length) > 5 ? 28 : 40) + 'px'; s.style.padding = '0 4px'; }
      s.style.minWidth = '0';   // the column is fixed: without this the slot's two-figure minimum (at 104 px) widened it past the column and a record set there before the game ran out of it
      const f = el('div', 'ft');
      n.style.cssText += `;grid-area:1 / ${c};background:${bg};color:${ink}`;
      s.style.cssText += `;grid-area:2 / ${c};background:${bg};color:${ink}`;
      f.style.cssText = `grid-area:3 / ${c};background:${c2}`;
      blk.append(n, s, f);
    });
    root.append(blk);
    if (add) root.append(el('div', 'add', add));
  },
};
