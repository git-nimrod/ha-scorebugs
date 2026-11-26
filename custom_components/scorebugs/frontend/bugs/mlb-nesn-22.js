// "Navy grid '22": after NESN's Red Sox bug (2020s; frame: Yankees at Red Sox). A navy box ruled in grey-blue: both teams' letters and
// scores stacked at the left, the outs over the count in the middle, and the bases (yellow when a runner is on) over the inning at the
// right. The pitcher line under the box is left out (no data).
import { el, otherSport, bases, statusText, scoreSlot, FONTS } from '../kit.js';

const W = 720, H = 196, RULE = 4, TEAMS = 300, MID = 214;
const TEAM_PX = 60, MID_PX = 50, INN_PX = 52, PRE_TEAMS = 200;   // before the first pitch the team column holds only the letters

export default {
  id: 'mlb-nesn-22',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the team column closes up round the letters and the box is shorter
  sizeFor: (g) => ({ w: W, h: H }),  // before the first pitch the records stand in the scores' place
  // measured against the frame by the automatic audit: text -26% vs the broadcast; 80 % of the correction
  typeScale: 1.278,
  fonts: [FONTS.titillium, FONTS.montserrat],
  css: `
.sb-mlb-nesn-22 { font-family: 'SB Montserrat', 'Arial', sans-serif; font-weight: 800; color: #f4f5f7; }   /* heavy and wide, like the face of Team boxes '25 (no team-colour outlines here) */
/* face: NESN 2017-25: Titillium Web Bold */
.sb-mlb-nesn-22 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${TEAMS}px ${MID}px 1fr; gap: ${RULE}px; padding: ${RULE}px; box-sizing: border-box;
  background: #5d6f8a; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-nesn-22 .bx > div { background: linear-gradient(#123563, #0b2548); display: grid; grid-template-rows: 1fr 1fr; align-items: center; padding: 12px 0; box-sizing: border-box; }
.sb-mlb-nesn-22 .ln { display: flex; justify-content: space-between; padding: 0 30px 0 26px; font-size: ${TEAM_PX}px; line-height: 1; }
.sb-mlb-nesn-22 .ln .sc { width: 1.2em; text-align: center; }
.sb-mlb-nesn-22 .md { justify-items: center; font-size: ${MID_PX}px; line-height: 1; } .sb-mlb-nesn-22 .md small { font-size: .62em; margin-left: 6px; }
.sb-mlb-nesn-22 .rt { justify-items: center; }
.sb-mlb-nesn-22 .rt .sb-bases i { background: #8d939c; } .sb-mlb-nesn-22 .rt .sb-bases i.on { background: #e9b92c; }
.sb-mlb-nesn-22 .inn { font-size: ${INN_PX}px; line-height: 1; } .sb-mlb-nesn-22 .inn b { font-size: .62em; margin-right: 14px; vertical-align: .14em; }
.sb-mlb-nesn-22 .w { grid-column: 2 / 4; display: grid !important; grid-template-rows: 1fr !important; place-items: center; font-size: ${MID_PX * 0.8}px; }   /* one line, in the middle of its cell (it hung in the top half) */
.sb-mlb-nesn-22 .bx.pre { grid-template-columns: ${PRE_TEAMS}px ${MID}px 1fr; }
.sb-mlb-nesn-22 .rt .dt { font-size: 30px; line-height: 1.05; text-align: center; white-space: pre-line; }
.sb-mlb-nesn-22 .bx.big .ln { font-size: 46px; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx'), tm = el('div', 'tm');
    // three-figure scores (another sport's game): the letters and scores a size smaller, so both still fit their line
    if ([g.away, g.home].some((t) => Number(t.score) >= 100)) bx.classList.add('big');
    [g.away, g.home].forEach((t) => {
      const ln = el('span', 'ln');
      ln.append(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else { const r = el('span', 'sc', t.record || ''); r.style.whiteSpace = 'nowrap'; r.style.fontSize = ((t.record || '').length > 4 ? 22 : 30) + 'px'; ln.appendChild(r); }
      tm.appendChild(ln);
    });
    bx.appendChild(tm);
    if (live) {
      const md = el('div', 'md'), outs = el('span', '', String(b.outs)); outs.appendChild(el('small', '', 'OUTS'));
      md.append(outs, el('span', '', b.balls + ' - ' + b.strikes));
      const rt = el('div', 'rt'), inn = el('span', 'inn');
      inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      // the bases bigger and laid a little flat, as on air (the three span a fifth of the box's width and are 1.9 times as wide as tall)
      const bs = bases(b.bases, 44); bs.style.transform = 'scaleY(.75)'; bs.style.margin = '-16px 0';
      rt.append(bs, inn);
      bx.append(md, rt);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const md = el('div', 'md'), ck = el('span', '', os.clock); ck.style.gridRow = '1 / 3'; md.appendChild(ck);
      const rt = el('div', 'rt'); rt.append(el('span', 'dt', os.detail), el('span', 'inn', os.period));
      bx.append(md, rt);
    } else bx.appendChild(el('div', 'w', statusText(g, time)));
    root.appendChild(bx);
  },
};
