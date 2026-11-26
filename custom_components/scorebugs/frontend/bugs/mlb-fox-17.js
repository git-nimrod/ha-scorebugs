// "Flat box '17": after FOX's MLB score box from the 2017 postseason through 2021. A flat dark indigo box: each team's row in a bright flat colour with its
// letters at the left and its score at the right, three big outlined white diamonds for the bases at the right, and a foot row with the
// half inning, the outs ("1 Out") and the count. The pitcher and batter lines above the box need data the feed lacks and are left out.
// measured: team rows 59% of the width, 32% and 35% of the height; bases 0.24 of the height on a side with a 4 px white
// outline, empty inside; foot row 28% of the height; letters heavy, upright, caps 0.15 of the height (measured by hand on the
// crop's rows), white; "Out" in mixed case and a lighter weight. Team rows flat colour, no lines. Not drawn soft.
// black everywhere but the team rows; the bases moved over to where the frame has them (centres 10 px
// right and 10 px lower), outlined in white and black inside when empty. Re-measured part by part on the frame (x3): names' caps 42 px
// (were 37) and scores' 1.14 times the names'; the outline 6 px (frame 2 crop px across the line); the foot row's letters 40-43 px
// (were 36), the arrow 30 px wide (was 16), the outs 18 px further right, the foot's text 7 px higher (centred 217 px down).
import { el, otherSport, bases, statusText, scoreSlot, teamPair, teamColor, panelInk, FONTS } from '../kit.js';

const W = 579, H = 267;

export default {
  id: 'mlb-fox-17',
  size: { w: W, h: H },
  fonts: [FONTS.publicSans],
  css: `
.sb-mlb-fox-17 { font-family: 'SB Public Sans', 'Franklin Gothic Medium', sans-serif; font-weight: 800; color: #fff; }
/* black overall except the team rows */
.sb-mlb-fox-17 .bx { position: absolute; inset: 0; background: linear-gradient(#141518, #0b0c0e 40%, #08090a); }
.sb-mlb-fox-17 .r { position: absolute; left: 0; width: 342px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 0 34px 0 46px; font-size: 59px; line-height: 1; }
.sb-mlb-fox-17 .r .s { min-width: 1.3em; text-align: right; font-size: 67px; }
/* before the game a long record (10-14-1, 102-60) keeps a gap from the bigger name */
.sb-mlb-fox-17 .r .s.sb-pre-rec { margin-left: 20px; }
/* the bases where the frame has them (centres at 407, 459 and 511 across, 63 and 113 down), a 6 px white outline, black inside when
   empty; each 86 px corner to corner (frame 29 crop px, x3) with the frame's gaps between them */
.sb-mlb-fox-17 .bz { position: absolute; left: 365px; top: 19px; }
.sb-mlb-fox-17 .bz .sb-bases i { background: #0b0c0e; border: 6px solid #f4f4f8; }
.sb-mlb-fox-17 .bz .sb-bases i.on { background: #f4f4f8; }
.sb-mlb-fox-17 .ft { position: absolute; left: 0; right: 0; top: 181px; height: 74px; display: flex; align-items: center; font-size: 56px; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-17 .ft .inn { margin-left: 46px; min-width: 104px; } .sb-mlb-fox-17 .ft .inn b { font-size: 44px; margin-right: 4px; vertical-align: 2px; }
.sb-mlb-fox-17 .ft .o { margin-left: 46px; min-width: 150px; } .sb-mlb-fox-17 .ft .o small { font-size: .75em; font-weight: 500; margin-left: 10px; }
.sb-mlb-fox-17 .ft .c { margin-left: 79px; }
.sb-mlb-fox-17 .ft .w { margin-left: 50px; }
.sb-mlb-fox-17 .ft .c.os { margin-left: 70px; }
.sb-mlb-fox-17 .dt { position: absolute; left: 354px; right: 14px; top: 8px; height: 168px; display: grid; place-items: center; text-align: center; font-size: 48px; line-height: 1.05; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const cols = teamPair(g.away, g.home, '#4a505a');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (cols[i].toLowerCase() !== String(teamColor(t, '#4a505a')).toLowerCase() ? panelInk(t, cols[i]) : '#fff'));
    root.appendChild(el('div', 'bx'));
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r'); r.style.top = (i ? 92 : 4) + 'px'; r.style.height = (i ? 92 : 86) + 'px';
      // a flat colour
      r.style.background = cols[i];
      if (ink[i] !== '#fff') r.style.color = ink[i];
      r.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      root.appendChild(r);
    });
    const os = otherSport(g, 7);
    // another sport's game: one detail of the game where the bases were (nothing when there is none)
    if (os) { if (os.detail) root.appendChild(el('div', 'dt', os.detail)); }
    else { const bz = el('div', 'bz'); bz.appendChild(bases(b ? b.bases : null, 61)); root.appendChild(bz); }
    const ft = el('div', 'ft');
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), g.period.label);
      const o = el('span', 'o', String(b.outs)); o.appendChild(el('small', '', b.outs === 1 ? 'Out' : 'Outs'));
      ft.append(inn, o, el('span', 'c', b.balls + '-' + b.strikes));
    } else if (os) { ft.append(el('span', 'inn', os.period), el('span', 'c os', os.clock)); }
    else ft.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(ft);
  },
};
