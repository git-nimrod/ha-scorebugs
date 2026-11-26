// "Black panels '24": after SportsNet LA's Dodgers bug (2020s; frame: Diamondbacks at Dodgers). A black box ruled in grey: each team on a
// row that runs from its colour into black, with its logo, letters and score; then a narrow column with the inning number between two
// arrows (the half lit), the bases as grey diamonds with the outs as dots under them, and the count at the right (the pitch count
// under it is left out: no data).
import { el, fit, otherSport, logo, bases, statusText, scoreSlot, teamColor, shade, FONTS } from '../kit.js';

const W = 860, H = 200, RULE = 4, TEAMS = 410, INN = 74, BASES = 150;
const PRE_CUT = 80;   // a score and the room before it, left out before the first pitch
const ABBR_PX = 52, SCORE_PX = 58, INN_PX = 62, COUNT_PX = 56;

export default {
  id: 'mlb-snla-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the team rows close up and the box is narrower
  sizeFor: (g) => ({ w: W, h: H }),
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  // measured against the frame by the automatic audit: text -21% vs the broadcast, logos -23%; 80 % of the correction
  typeScale: 1.207, logoScale: 1.237,
  fonts: [FONTS.barlowCond700],
  css: `
.sb-mlb-snla-24 { font-family: 'SB Barlow Condensed', 'Arial', sans-serif; font-weight: 600; color: #fff; }
/* face: SportsNet LA: Barlow Condensed Bold */
.sb-mlb-snla-24 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${TEAMS}px ${INN}px ${BASES}px 1fr; grid-template-rows: 1fr 1fr; gap: ${RULE}px; padding: ${RULE}px; box-sizing: border-box;
  background: #d3d5d8; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-snla-24 .tm { display: flex; align-items: center; padding: 0 26px 0 14px; gap: 14px; }
.sb-mlb-snla-24 .tm .sb-logo { width: 84px; height: 72px; object-fit: contain; }
.sb-mlb-snla-24 .tm .ab { flex: 1; text-align: right; font-size: ${ABBR_PX}px; line-height: 1; padding-right: 30px; }
.sb-mlb-snla-24 .tm .sc { width: 50px; text-align: center; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-mlb-snla-24 .k { background: #000; }   /* black, flat (was a near-black gradient, #141414 at the top) */
.sb-mlb-snla-24 .inn { grid-column: 2; grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: ${INN_PX}px; line-height: 1; }
.sb-mlb-snla-24 .inn b { font-size: .42em; color: #5f6267; } .sb-mlb-snla-24 .inn b.on { color: #fff; }
.sb-mlb-snla-24 .bs { grid-column: 3; grid-row: 1 / 3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; }
.sb-mlb-snla-24 .bs .sb-bases i { background: #6b6c70; } .sb-mlb-snla-24 .bs .sb-bases i.on { background: #f2f2f2; }
.sb-mlb-snla-24 .outs { display: flex; gap: 14px; } .sb-mlb-snla-24 .outs i { width: 20px; height: 20px; border-radius: 50%; background: #55575b; } .sb-mlb-snla-24 .outs i.on { background: #ecd23a; }   /* an out lights yellow, the rules are light grey (frame) */
.sb-mlb-snla-24 .cnt { grid-column: 4; grid-row: 1 / 3; display: grid; place-items: center; font-size: ${COUNT_PX}px; line-height: 1; }
.sb-mlb-snla-24 .w { grid-column: 2 / 5; grid-row: 1 / 3; display: grid; place-items: center; font-size: ${COUNT_PX * 0.75}px; }
.sb-mlb-snla-24 .bs.dt { font-size: 34px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#2a2c30');
      const tm = el('div', 'tm'); tm.style.gridRow = String(i + 1);
      tm.style.background = 'linear-gradient(90deg, ' + shade(c, -0.05) + ' 0%, ' + shade(c, -0.2) + ' 40%, #050505 92%)';
      tm.append(logo(t, 84), el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') tm.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else { const r = el('span', 'sc', t.record || ''); r.style.whiteSpace = 'nowrap'; r.style.fontSize = ((t.record || '').length > 5 ? 26 : 34) + 'px'; tm.appendChild(r); }  // the record before the game
      bx.appendChild(tm);
    });
    if (live) {
      const inn = el('div', 'k inn');
      inn.append(el('b', b.half === 'top' ? 'on' : '', '▲'), el('span', '', g.period.label || ''), el('b', b.half === 'top' ? '' : 'on', '▼'));
      const bs = el('div', 'k bs'), outs = el('span', 'outs');
      for (let i = 0; i < 3; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      bs.append(bases(b.bases, 40), outs);
      bx.append(inn, bs, el('div', 'k cnt', b.balls + '-' + b.strikes));
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      bx.append(fit(el('div', 'k inn', os.period)), el('div', 'k bs dt', os.detail), el('div', 'k cnt', os.clock));
    } else bx.appendChild(el('div', 'k w', statusText(g, time)));
    root.appendChild(bx);
  },
};
