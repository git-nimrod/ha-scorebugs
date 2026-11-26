// "Header box '26" (the name stays so saved cards keep working): after NESN's MLB bug (2026; frame: Red Sox at Reds, Opening Day). Each
// team on a row of its colour: its logo large at the left, its letters and score in white at the right; beside them a dark panel with the
// inning at the top right, the bases, the count and the outs. The pitcher and exit-velocity lines under the letters are left out (no
// data), and so is the sponsor's plate under the box.
import { el, otherSport, inning, logo, bases, statusText, teamColor, shade, scoreSlot, FONTS } from '../kit.js';

// no header band: the frame has none, so the box is the two team rows only
const W = 640, ROW = 92, PANEL = 210, H = 2 * ROW;
const ABBR_PX = 62, SCORE_PX = 70,  // bigger
  CNT_PX = 38, PRE_CUT = 84;   // a score and its gap, left out before the first pitch

export default {
  id: 'mlb-nesn-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the team rows close up and the box is narrower
  sizeFor: (g) => ({ w: W, h: H }),
  logos: 'dark',   // the logos' versions for dark grounds: the Padres' brown and the Rays' navy were lost on their own rows
  fonts: [FONTS.barlowCond700],
  css: `
.sb-mlb-nesn-26 { font-family: 'SB Barlow Condensed', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: NESN 2026: Barlow Condensed Bold */
.sb-mlb-nesn-26 .bx { position: absolute; inset: 0; box-sizing: border-box; background: #2b2c2f;   /* no light rim: the white was the header band's (frame has neither) */ box-shadow: 0 3px 8px rgba(0,0,0,.5); display: grid; grid-template-columns: 1fr ${PANEL}px; grid-template-rows: ${ROW}px ${ROW}px; }
/* the bottom row lets its logo rise over the top row, cut only at its own foot and sides */
.sb-mlb-nesn-26 .tm:not(.top) { overflow: visible !important; clip-path: inset(-60px 0 0 0); z-index: 2; }
.sb-mlb-nesn-26 .tm:not(.top) .sb-logo { left: 4px; }   /* whole on the left: cut only at its foot */
.sb-mlb-nesn-26 .tm { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: flex-end; gap: 26px; padding-right: 26px; }
.sb-mlb-nesn-26 .tm .sb-logo { position: absolute; left: -10px; top: 50%; transform: translateY(-50%); width: 128px; height: 110px; object-fit: contain; }   /* big and cut by its panel, as on air */
/* the top team's logo whole inside its row, so a lettering logo reads; the bottom one may still run up past its row */
.sb-mlb-nesn-26 .tm.top .sb-logo { left: 6px; top: 6px; transform: none; translate: none !important; width: 96px; height: calc(100% - 12px); object-fit: contain; }
.sb-mlb-nesn-26 .tm .ab { font-size: ${ABBR_PX}px; line-height: 1; } .sb-mlb-nesn-26 .tm .sc { font-size: ${SCORE_PX}px; line-height: 1; }
.sb-mlb-nesn-26 .pn { grid-column: 2; grid-row: 1 / 3; position: relative; background: linear-gradient(#3b3c3f, #2b2c2f); display: grid; justify-items: center; align-content: center; gap: 4px; font-size: ${CNT_PX}px; }
.sb-mlb-nesn-26 .pn .inn { position: absolute; right: 12px; top: 6px; font-size: ${CNT_PX * 0.75}px; }
.sb-mlb-nesn-26 .pn .sb-bases i { background: #0a0a0b; border: 3px solid #c9cbce; }   /* empty bags: black with a light rim (frame) */ .sb-mlb-nesn-26 .pn .sb-bases i.on { background: #fff; border-color: #fff; }
.sb-mlb-nesn-26 .outs { display: flex; gap: 8px; } .sb-mlb-nesn-26 .outs i { width: 16px; height: 16px; border-radius: 50%; background: #45484e; } .sb-mlb-nesn-26 .outs i.on { background: #fff; }
.sb-mlb-nesn-26 .w { font-size: ${CNT_PX}px; text-align: center; }
.sb-mlb-nesn-26 .pn .dt { font-size: 32px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm' + (i === 0 ? ' top' : '')); tm.style.gridRow = String(i + 1);
      // the logo's end is a darker block of the team colour cut on a slant, the rest flat colour (frame)
      tm.style.background = 'linear-gradient(104deg, ' + shade(c, -0.4) + ' 0, ' + shade(c, -0.3) + ' 30%, ' + shade(c, 0.02) + ' 30.4%, ' + shade(c, -0.06) + ')';
      tm.append(logo(t, 156), el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') tm.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else { const r = el('span', 'sc', t.record || ''); r.style.whiteSpace = 'nowrap'; r.style.fontSize = ((t.record || '').length > 5 ? 26 : 34) + 'px'; tm.appendChild(r); }  // the record before the game
      bx.appendChild(tm);
    });
    const pn = el('div', 'pn');
    if (live) {
      const outs = el('span', 'outs'); for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      pn.append(el('span', 'inn', inning(g)), bases(b.bases, 40), el('span', '', b.balls + '-' + b.strikes), outs);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      pn.appendChild(el('span', 'inn', os.period));
      if (os.detail) pn.appendChild(el('span', 'dt', os.detail));
      pn.appendChild(el('span', '', os.clock));
    } else pn.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(pn);
    root.appendChild(bx);
  },
};
