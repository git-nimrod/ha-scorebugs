// "Gold rules '97": after NBC's Super Bowl XXXII bug (January 1998; frame: Packers v Broncos). A black box: each team's name in tall white
// capitals with its score, the network's mark at the right (here the Home Assistant logo), a gold rule, and the quarter spelled out with the
// clock in a segmented display on a black plate. The Super Bowl title over the box is left out.
// Review: only the names block is a black panel; under the gold rule the quarter and the clock sit each on its own dark
// plate over the picture; the rules gold with a bright middle; records before the game in the score column.
import { el, statusText, haMark, marks, scoreSlot, FONTS, fit } from '../kit.js';

const W = 560, H = 236, ROW = 60;
// the clock's plate about a third of the box's width
const NAME_PX = 52, LOW_PX = 34, CLOCK_PX = 44;

export default {
  id: 'nfl-nbc-97',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score column goes and the box closes up on the names
  sizeFor: (g) => ({ w: g.status === 'pre' && !(g.away.record && g.home.record) ? W - 110 : W, h: H }),
  // measured against the frame by the automatic audit: text -28% vs the broadcast; 80 % of the correction
  typeScale: 1.307,
  tv: 'soft',
  fonts: [FONTS.archivo, { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-nfl-nbc-97 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 65%; color: #f2f2f2; }
.sb-nfl-nbc-97 { font-weight: 700; font-stretch: 68%; }   /* face: Archivo 700 at 68% width (medium confidence) */
.sb-nfl-nbc-97 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) 100px 130px;   /* a long name may not widen the box (team sweep: the clock ran off the edge) */ grid-template-rows: ${ROW}px ${ROW}px 1fr; column-gap: 10px; padding: 12px 16px 12px; box-sizing: border-box;
  background: linear-gradient(#9c7424, #f6e7b0 50%, #9c7424) top / 100% 5px no-repeat, linear-gradient(rgba(6,6,7,.94), rgba(6,6,7,.94)) top / 100% ${12 + 2 * ROW + 16}px no-repeat; }
.sb-nfl-nbc-97 .nm { align-self: center; font-size: ${NAME_PX}px; line-height: 1; letter-spacing: 1px; white-space: nowrap; }
.sb-nfl-nbc-97 .sc { align-self: center; text-align: center; font-size: ${NAME_PX}px; line-height: 1; }
.sb-nfl-nbc-97 .mk { grid-column: 3; grid-row: 1 / 3; display: grid; place-items: center; } .sb-nfl-nbc-97 .mk .sb-ha { color: #f2f2f2; }
.sb-nfl-nbc-97 .low { grid-column: 1 / 4; display: flex; align-items: center; justify-content: space-between; margin: 10px -16px 0; padding: 14px 16px 0; font-size: ${LOW_PX}px;
  background: linear-gradient(#9c7424, #f6e7b0 50%, #9c7424) top / 100% 5px no-repeat; }
.sb-nfl-nbc-97 .low > span { padding: 4px 12px; background: rgba(6,6,7,.86); box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-nfl-nbc-97 .ck { font-family: 'SB DSEG7', monospace; font-size: ${CLOCK_PX * 0.8}px; padding: 4px 12px; background: #000; box-shadow: inset 0 0 0 2px #444; letter-spacing: 2px; }
.sb-nfl-nbc-97 .low .w { margin: 0 auto; text-align: center; }
.sb-nfl-nbc-97 .sc.rec { font-size: ${NAME_PX * 0.62}px; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx'), pre = g.status === 'pre';
    const recs = pre && g.away.record && g.home.record;  // records before the game, every time
    if (pre && !recs) bx.style.gridTemplateColumns = 'minmax(0, 1fr) 130px';
    [g.away, g.home].forEach((t, i) => {
      const nm = fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase().slice(0, 12))); nm.style.gridRow = String(i + 1);
      const sc = recs ? el('span', 'sc rec', t.record) : scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.appendChild(nm); if (!pre || recs) bx.appendChild(sc);
    });
    const mk = el('span', 'mk'); if (pre && !recs) mk.style.gridColumn = '2'; if (marks(opts).ha) mk.appendChild(haMark(84)); bx.appendChild(mk);
    const low = el('div', 'low'); low.style.gridColumn = '1 / -1';
    // the sport's own word: hockey plays periods, men's college basketball halves
    if (live) low.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase() + (g.sport === 'hockey' ? ' PERIOD' : g.league === 'NCAAM' ? ' HALF' : ' QUARTER')), el('span', 'ck', g.clock || ''));
    else low.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(low);
    root.appendChild(bx);
  },
};
