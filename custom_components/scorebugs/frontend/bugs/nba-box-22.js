// "Silver scores '22": after an NBA regional broadcast's bug of the early 2020s (a 416 x 103 px box, fair). A box in a thin light frame: two team rows,
// each a panel of the team's colour with its logo and its letters in heavy white capitals, then its score dark on a silver panel; at the
// right a dark grey block with the clock over the quarter. Left out (no data): the shot clock in red beside the quarter and the rule
// between them. The bug carries no network mark, so there is no Home Assistant logo either.
// measured (x2.5 here): team panels 0.44 of the width, the silver scores 0.23, a 4 px gap, the dark block
// 0.30; rows 0.48 of the height each with a dark 4 px rule between; the letters' capitals 0.45 of a row, the scores' 0.58 (#303235 on
// #d9dcdf to #c4c8cc), the clock's 0.4 of the block's height in white over a quarter 0.27; a light rim of 5 px all round (#e8e4e0).
// logos: on the frame the Knicks' logo is 1.47 rows wide and the Nuggets'
// ring 1.30, both cut by their row at top and bottom, centred 0.76 of a row from the panel's left; so a 165 px box (1.35 rows) cut by
// the panel, and the letters start 1.7 rows in (frame 1.79).
import { el, logo, statusText, teamPair, panelInk, shade, scoreSlot, ordinal, fit, FONTS } from '../kit.js';

const W = 1040, H = 258, RIM = 5, ROW = 122, TEAM = 461, SC = 240, GAP = 10, LOGO = 165;

export default {
  id: 'nba-box-22',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-nba-box-22 { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 800; color: #fff; box-sizing: border-box; padding: ${RIM}px;
  background: linear-gradient(#efebe7, #dcd8d4); display: grid; grid-template-columns: ${TEAM}px ${SC}px 1fr; grid-template-rows: ${ROW}px ${ROW}px;
  row-gap: 4px; column-gap: 0; }
.sb-nba-box-22 .tm { display: flex; align-items: center; gap: 34px; padding: 0 16px 0 10px; min-width: 0; overflow: hidden; }
.sb-nba-box-22 .tm .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain; flex: none; }
.sb-nba-box-22 .ab { font-size: 80px; line-height: 1; letter-spacing: 1px; white-space: nowrap; }
.sb-nba-box-22 .sc { display: grid; place-items: center; background: linear-gradient(90deg, #c9cdd1, #e4e6e8 55%, #cfd3d7); color: #303235;
  font-size: 102px; font-weight: 700; line-height: 1; box-shadow: inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1px 0 rgba(0,0,0,.18); }
.sb-nba-box-22 .sc > span { text-align: center; }
/* on air a dark rule parts the two scores (the team panels are parted by the light frame) */
.sb-nba-box-22 .sc.a { box-shadow: inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1px 0 rgba(0,0,0,.18), 0 4px 0 #444e58; }
/* the dark block, a gap from the scores, the clock over the quarter */
.sb-nba-box-22 .blk { grid-column: 3; grid-row: 1 / 3; margin-left: ${GAP}px; display: grid; align-content: center; justify-items: center; row-gap: 14px;
  background: linear-gradient(#3a3c3e, #2c2e30 60%, #262829); }
.sb-nba-box-22 .ck { font-size: 72px; font-weight: 700; line-height: 1; letter-spacing: 1px; }
.sb-nba-box-22 .q { font-size: 64px; font-weight: 700; line-height: 1; }
.sb-nba-box-22 .q .sb-ord { font-size: .7em; }
.sb-nba-box-22 .w { font-size: 50px; font-weight: 700; text-align: center; line-height: 1.15; padding: 0 10px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    // never two look-alike panels (two navies), and dark letters on a light panel (GS gold)
    const [ca, ch] = teamPair(g.away, g.home, '#4a5560');
    const rows = [[g.away, ca], [g.home, ch]].map(([t, c], i) => {
      const tm = el('div', 'tm');
      tm.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.08) + ')';
      tm.style.color = panelInk(t, c);
      tm.append(logo(t, LOGO), fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      const sc = el('div', i ? 'sc' : 'sc a'); sc.appendChild(scoreSlot(el('span', '', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      return [tm, sc];
    });
    const blk = el('div', 'blk');
    if (live) blk.append(el('div', 'ck', g.clock || ''), ordinal(g.period, 'q'));
    else blk.appendChild(el('div', 'w', statusText(g, time)));
    // grid order: away panel, away score, the block (spanning both rows), home panel, home score
    root.append(rows[0][0], rows[0][1], blk, rows[1][0], rows[1][1]);
  },
};
