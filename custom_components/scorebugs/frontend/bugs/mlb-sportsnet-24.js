// "Navy box '24": after Sportsnet's Blue Jays bug (2020s; frame: Blue Jays at Cardinals). A navy box: the bases at the left (yellow when
// a runner is on), each team's letters and score on a bar of its colour in the middle, the network's mark on a white cell at the right
// (here the Home Assistant logo), and along the bottom a blue cell with the inning and a light row with the count and the outs. The
// pitcher and batter lines over the box are left out (no data).
import { el, otherSport, bases, statusText, scoreSlot, teamColor, shade, inkOn, haMark, marks, FONTS } from '../kit.js';

const W = 620, H = 236, RULE = 4, SIDE = 160, ROW = 80, LOW = 58;
const TEAM_PX = 66, LOW_PX = 52, SCORE_ROOM = 96;

export default {
  id: 'mlb-sportsnet-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the team bars lose the score's room and the box is narrower
  sizeFor: (g) => ({ w: W, h: H }),  // before the game the records stand in the scores' place
  fonts: [FONTS.roboto],
  css: `
.sb-mlb-sportsnet-24 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: Sportsnet: Roboto Bold */
.sb-mlb-sportsnet-24 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${SIDE}px 1fr ${SIDE}px; grid-template-rows: ${ROW}px ${ROW}px 1fr; row-gap: 2px; box-sizing: border-box;
  background: #d3d8df; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
/* on air the box has no navy frame: the cells meet edge to edge, a thin light line between the rows */
.sb-mlb-sportsnet-24 .bs { grid-column: 1; grid-row: 1 / 3; display: grid; place-items: center; background: #11284a; }
.sb-mlb-sportsnet-24 .bs .sb-bases i { background: #11284a; border: 5px solid #c9d3e2; } .sb-mlb-sportsnet-24 .bs .sb-bases i.on { background: #f4c42a; border-color: #f4c42a; }
.sb-mlb-sportsnet-24 .tm { grid-column: 2; display: flex; align-items: center; justify-content: space-between; padding: 0 34px 0 40px; font-size: ${TEAM_PX}px; line-height: 1; }
.sb-mlb-sportsnet-24 .tm .sc { font-size: 1.3em; font-weight: 800; }
.sb-mlb-sportsnet-24 .bx.pre .tm { font-size: 50px; gap: 12px; padding: 0 20px 0 24px; }   /* the records before the game need the room (stress, Nov 25) */
.sb-mlb-sportsnet-24 .bx.pre .tm .sc { font-size: 1em; }
.sb-mlb-sportsnet-24 .mk { grid-column: 3; grid-row: 1 / 3; display: grid; place-items: center; background: #e8e9eb; }   /* flat light grey */
.sb-mlb-sportsnet-24 .mk .sb-ha { color: #11284a; }
.sb-mlb-sportsnet-24 .lo { grid-column: 1 / 4; display: grid; grid-template-columns: ${SIDE}px 1fr; column-gap: 2px; }
.sb-mlb-sportsnet-24 .lo .in { display: flex; align-items: center; justify-content: center; background: #2a6fcc; font-size: ${LOW_PX * 1.15}px; line-height: 1; }
.sb-mlb-sportsnet-24 .lo .in b { font-size: .5em; margin-right: 6px; vertical-align: .2em; }
.sb-mlb-sportsnet-24 .lo .rw { display: grid; grid-template-columns: 1fr 1fr; align-items: center; justify-items: center; background: #e3e5e8; color: #1b2436; font-size: ${LOW_PX}px; font-weight: 600; line-height: 1; }
.sb-mlb-sportsnet-24 .lo .rw b { font-weight: 800; } .sb-mlb-sportsnet-24 .lo .rw small { font-size: 1em; margin-left: 10px; }   /* "0 OUT" is one size on air */
.sb-mlb-sportsnet-24 .lo .w { grid-column: 1 / 3; grid-template-columns: 1fr; }   /* the start time or FINAL centred across the row */
.sb-mlb-sportsnet-24 .bs .dt { font-size: 34px; line-height: 1.05; text-align: center; white-space: pre-line; }
.sb-mlb-sportsnet-24 .lo .w.os { grid-column: 2; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', g.status === 'pre' ? 'bx pre' : 'bx');
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const bs = el('div', 'bs'); if (live) bs.appendChild(bases(b.bases, 44)); else if (os && os.detail) bs.appendChild(el('span', 'dt', os.detail)); bx.appendChild(bs);  // the bases only while the game is on
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#2a3f66');
      const tm = el('div', 'tm'); tm.style.gridRow = String(i + 1);
      tm.style.background = 'linear-gradient(' + shade(c, 0.03) + ', ' + shade(c, -0.04) + ')';   // flat bars on air
      tm.style.color = inkOn(c);   // (this line had been swallowed by the comment before it)
      tm.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      tm.appendChild(g.status === 'pre' ? scoreSlot(el('span', 'sc', ''), g) /* empty before the game: the kit puts the record in and sizes it to the box */ : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(tm);
    });
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(96)); bx.appendChild(mk);
    const lo = el('div', 'lo');
    if (live) {
      const inn = el('span', 'in'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      const rw = el('span', 'rw'); const outs = el('span', '', String(b.outs)); outs.appendChild(el('small', '', 'OUT'));
      rw.append(el('b', '', b.balls + '-' + b.strikes), outs);
      lo.append(inn, rw);
    } else if (os) lo.append(el('span', 'in', os.period), el('span', 'rw w os', os.clock));
    else lo.appendChild(el('span', 'rw w', statusText(g, time)));
    bx.appendChild(lo);
    root.appendChild(bx);
  },
};
