// "Gold rows '03": after ABC's NHL bug (2003; frame: Devils at Ducks). The network's round mark at the left (here the Home Assistant logo
// on a black disc); over the rows a gold slanted tab with the period and a black tab with the clock; then each team's letters on a black
// panel that ends in a hard slanted cut, its score on the gold end beyond the cut, both rows inside a thin gold frame with a glowing red line
// between them. Every slant measured on the upscaled frame (see the angles below).
import { el, ordinal, statusText, haMark, marks, scoreSlot, FONTS } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

const W = 660, H = 220, DISC = 130, TAB = 70, ROWS_L = 120, PER = 190;
const TAB_PX = 46, TEAM_PX = 50, SCORE_PX = 52;
// angles measured on the frame (degrees from vertical, every edge leaning like /): the cut from a team's black panel into the gold 24,
// the period tab's left side 26 and right side 18 (the clock tab follows the period tab); the rows block's right end is upright.
const tanx = (deg, h) => Math.round(Math.tan(deg * Math.PI / 180) * h);
const PRE_CUT = 150;   // what the bar loses before the game
const ROW_H = (H - TAB - 4 - 4 - 4 - 4) / 2, CUT_AT = 0.68, CUT = tanx(24, ROW_H), PER_L = tanx(22, TAB), PER_R = tanx(22, TAB);  // both tab sides 22 deg

export default {
  id: 'nhl-abc-03',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the gold score end shrinks to a short tip past the cut and the bar is narrower
  sizeFor: (g) => (noRec(g) ? { w: W - PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -25% vs the broadcast; 80 % of the correction
  typeScale: 1.26,
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-abc-03 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #fff; }
.sb-nhl-abc-03 { font-weight: 800; font-stretch: 110%; }   /* face: Archivo 800 at 110% width (low confidence) */
.sb-nhl-abc-03 .tabs { position: absolute; left: ${ROWS_L + 40}px; right: 20px; top: 0; height: ${TAB}px; display: flex; filter: drop-shadow(0 3px 4px rgba(0,0,0,.5)); }
.sb-nhl-abc-03 .per { align-self: flex-end; height: ${TAB - 8}px; width: ${PER}px; display: grid; place-items: center; background: linear-gradient(#ffe27a, #f2c33a 55%, #d39a12); color: #111; font-size: ${TAB_PX}px; clip-path: polygon(${PER_L}px 0, 100% 0, calc(100% - ${PER_R}px) 100%, 0 100%); }
.sb-nhl-abc-03 .ck { flex: 1; margin-left: -${PER_R}px; display: grid; place-items: center; background: linear-gradient(#2a2b2e, #050506); font-size: ${TAB_PX * 1.1}px; line-height: 1; clip-path: polygon(${PER_R}px 0, 100% 0, calc(100% - ${PER_R}px) 100%, 0 100%); }
.sb-nhl-abc-03 .ck.w { font-size: ${TAB_PX * 0.7}px; }
.sb-nhl-abc-03 .rows { position: absolute; left: ${20 + DISC / 2}px; right: 0; top: ${TAB + 4}px; bottom: 4px; display: grid; grid-template-rows: 1fr 1fr; gap: 4px; padding: 4px 4px 4px 0; box-sizing: border-box; border-radius: 0 8px 8px 0;
  background: linear-gradient(#ffe27a, #e7ad18); box-shadow: 0 3px 8px rgba(0,0,0,.5); }   /* a gold frame round both rows, upright right end (frame) */
.sb-nhl-abc-03 .rows::after { content: ''; position: absolute; left: 0; right: 4px; top: calc(50% - 2.5px); height: 5px; background: #e01a22; box-shadow: 0 0 4px rgba(255,40,30,.7); }   /* the red line between the rows, heavier */
.sb-nhl-abc-03 .ln { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 56px 0 ${DISC / 2 + 30}px; background: linear-gradient(#ffe680, #f2c33a 50%, #c98f10); }   /* the gold darkens to the row's foot */
.sb-nhl-abc-03 .ln::before { content: ''; position: absolute; inset: 0; background: linear-gradient(#2b2b2d, #050506); clip-path: polygon(0 0, ${Math.round(CUT_AT * 100)}% 0, calc(${Math.round(CUT_AT * 100)}% - ${CUT}px) 100%, 0 100%); }   /* the black panel, cut at 24 degrees */
.sb-nhl-abc-03 .ln > * { position: relative; }
.sb-nhl-abc-03 .rows.pre .ln::before { clip-path: polygon(0 0, calc(100% - 26px) 0, calc(100% - 26px - ${CUT}px) 100%, 0 100%); }   /* before the game: only a gold tip past the cut */
.sb-nhl-abc-03 .ln .ab { font-size: ${TEAM_PX}px; line-height: 1; } .sb-nhl-abc-03 .ln .sc { color: #111; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nhl-abc-03 .disc { position: absolute; left: 20px; top: ${TAB + (H - TAB - DISC) / 2 - 4}px; width: ${DISC}px; height: ${DISC}px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(#2a2b2e, #050506 70%); box-shadow: 0 0 0 5px #f2c33a, 0 0 0 7px #9a6d0a, 0 0 0 11px #d0201c, 0 3px 8px 6px rgba(0,0,0,.45); z-index: 2; }   /* a gold ring with a red outline outside it */
.sb-nhl-abc-03 .disc .sb-ha { color: #f2f2f2; }
.sb-nhl-abc-03 .sb-ord { font-size: .62em; vertical-align: .45em; text-transform: lowercase; }
.sb-nhl-abc-03 .per .sb-ord { font-size: .85em; vertical-align: baseline; }   /* on air the st of 1st is nearly as big as the 1 (2003 Final stills) */
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const tabs = el('div', 'tabs');
    if (live) { const p = el('span', 'per'); p.appendChild(ordinal(g.period)); tabs.append(p, el('span', 'ck', g.clock || '')); }
    else tabs.appendChild(el('span', 'ck w', statusText(g, time)));
    const rows = el('div', 'rows' + (noRec(g) ? ' pre' : ''));
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      ln.appendChild(el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (!noRec(g)) ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      rows.appendChild(ln);
    });
    const disc = el('div', 'disc'); if (marks(opts).ha) disc.appendChild(haMark(70));
    root.append(tabs, rows, disc);
  },
};
