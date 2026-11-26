// "Blue grid '24": after SNY's MLB bug (2020s; frame: Yankees at Mets). A blue box ruled in white: each team's logo in a cell at the left
// with its score in the next cell, and a wide cell at the right with the bases as three white-outlined diamonds, the inning (an arrow and
// the number) and, under them, the outs as rings and the count. The pitcher and batter lines under the box are left out (no data); the
// network's mark is not on this bug.
import { el, otherSport, logo, bases, statusText, scoreSlot, teamPair, shade, contrast, FONTS } from '../kit.js';

// columns as on air: logo cell 26 %, score cell 19 %, the status cell the rest (frame 193 / 138 / 395 px of 735)
const W = 560, H = 186, CELL = 146, SCORE = 104, RULE = 3;
const SCORE_PX = 56, INN_PX = 56, COUNT_PX = 56;  // inning and count figures about 42 % of a row's height, as on air (they were 35 %) // the inning and the count are about the scores' size on air

export default {
  id: 'mlb-sny-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the score column goes and the status cell closes up on the logos
  sizeFor: (g) => ({ w: W, h: H }),  // before the game the score cells hold the records
  fonts: [FONTS.publicSans],
  css: `
.sb-mlb-sny-24 { font-family: 'SB Public Sans', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: SNY: Public Sans Bold */
.sb-mlb-sny-24 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${CELL}px ${SCORE}px 1fr; grid-template-rows: 1fr 1fr; gap: ${RULE}px; padding: ${RULE}px; box-sizing: border-box;
  background: #eef1f6; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-mlb-sny-24 .c { background: #1f4f97; display: grid; place-items: center; }   /* flat cells, as on air */
.sb-mlb-sny-24 .c.r1 { background: #2e2e30; }   /* the top (away) row is charcoal on air, the bottom row and the status cell blue */
.sb-mlb-sny-24 .c .sb-logo { width: 92px; height: 70px; object-fit: contain; }
.sb-mlb-sny-24 .sc { font-size: ${SCORE_PX}px; line-height: 1; }
/* every figure white, kept readable on a light team colour by a soft shadow */
.sb-mlb-sny-24 .c { color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.45); }
/* the outs centred under the bases, the inning and the count close beside them */
.sb-mlb-sny-24 .st { grid-row: 1 / 3; grid-column: 3; display: grid; grid-template-columns: auto auto; justify-content: space-evenly; column-gap: 24px; grid-template-rows: 1fr 1fr; align-items: center; padding: 6px 12px; box-sizing: border-box; }
.sb-mlb-sny-24 .outs { justify-self: center; } .sb-mlb-sny-24 .inn, .sb-mlb-sny-24 .cnt { justify-self: end; }
.sb-mlb-sny-24 .st .sb-bases { justify-self: start; } .sb-mlb-sny-24 .st .sb-bases i { border: 3px solid #fff; background: transparent; } .sb-mlb-sny-24 .st .sb-bases i.on { background: #d9c27b; border-color: #d9c27b; }   /* a runner: a gold base */
.sb-mlb-sny-24 .inn { font-size: ${INN_PX}px; } .sb-mlb-sny-24 .inn b { font-size: .6em; margin-right: 6px; vertical-align: .15em; }
.sb-mlb-sny-24 .outs { display: flex; gap: 10px; } .sb-mlb-sny-24 .outs i { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #fff; box-sizing: border-box; } .sb-mlb-sny-24 .outs i.on { background: #d9c27b; border-color: #d9c27b; }   /* the outs: gold dots */
.sb-mlb-sny-24 .cnt { font-size: ${COUNT_PX}px; }
.sb-mlb-sny-24 .w { grid-column: 1 / 3; grid-row: 1 / 3; text-align: center; font-size: 32px; }
.sb-mlb-sny-24 .st .dt { font-size: 28px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    const deep = (c) => { let x = c; for (let k = 0; k < 8 && contrast('#ffffff', x) < 3; k++) x = shade(x, -0.06); return x; };
    [g.away, g.home].forEach((t, i) => {
      // each team's row in its own colour (logo cell and score cell), never two alike; the status panel stays the network's blue
      const own = (x) => [x.color, x.color2].find((c) => /^#[0-9a-f]{6}$/i.test(c || '') && contrast(c, '#000000') >= 2.2);
      // a colour too light for the white figures (the A's gold) is darkened until they read
      const tc = deep(own(t) || teamPair(g.away, g.home, '#2e2e30')[i]), fill = 'linear-gradient(' + shade(tc, 0.04) + ', ' + shade(tc, -0.1) + ')';
      const lg = el('div', 'c r' + (i + 1)); lg.style.gridRow = String(i + 1); lg.style.background = fill; lg.appendChild(logo(t, 92));
      bx.appendChild(lg);
      const sc = el('div', 'c r' + (i + 1)); sc.style.gridRow = String(i + 1); sc.style.background = fill;  sc.appendChild(g.status === 'pre' ? scoreSlot(el('span', 'sc', ''), g) /* empty before the game: the kit puts the record in and sizes it to the box */ : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(sc);
    });
    const st = el('div', 'c st');
    // while the game is on, the right side takes the colour of the team at bat (top of the inning the away team, bottom the home team)
    const bat = live ? (b.half === 'top' ? g.away : b.half === 'bot' ? g.home : null) : null;
    if (bat) { const own = (x) => [x.color, x.color2].find((c) => /^#[0-9a-f]{6}$/i.test(c || '') && contrast(c, '#000000') >= 2.2); const bc = deep(own(bat) || '#1f4f97'); st.style.background = 'linear-gradient(' + shade(bc, 0.04) + ', ' + shade(bc, -0.12) + ')'; }
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      const outs = el('span', 'outs'); for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      // the bases a little bigger: the three span about 1.5 rows' height across on air (they spanned 1.2)
      st.append(bases(b.bases, 42), inn, outs, el('span', 'cnt', b.balls + '-' + b.strikes));
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const ck = el('span', 'cnt', os.clock); ck.style.gridColumn = '1 / 3'; ck.style.justifySelf = 'center';
      if (os.detail) st.append(el('span', 'dt', os.detail), el('span', 'inn', os.period), ck);
      else { const p = el('span', 'inn', os.period); p.style.gridColumn = '1 / 3'; p.style.justifySelf = 'center'; st.append(p, ck); }
    } else st.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(st);
    root.appendChild(bx);
  },
};
