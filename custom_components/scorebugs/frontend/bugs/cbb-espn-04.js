// "Black box '04": after ESPN's college basketball bug (2004-07; frame: Syracuse at Rutgers). A black box: a dark red sweep at the top left
// where the network's wordmark sat (here the Home Assistant logo) with the half at the right, each team's rank and short name with its score
// on a light cell, and the clock large in a segmented display at the right.
import { el, statusText, scoreSlot, haMark, marks, FONTS, TEXT_90S, fit } from '../kit.js';

const W = 560, H = 230, TOP = 64, TEAM = 220, SCORE = 120, PX = 54;

export default {
  id: 'cbb-espn-04',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -29% vs the broadcast; 80 % of the correction
  typeScale: 1.145,
  fonts: [FONTS.archivo, { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-cbb-espn-04 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #ececec; }
.sb-cbb-espn-04 { font-weight: 800; font-stretch: 112%; }   /* face: Archivo 800 at 112% width (low confidence) */
.sb-cbb-espn-04 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${TEAM}px ${SCORE}px 1fr; grid-template-rows: ${TOP}px 1fr 1fr; gap: 4px; padding: 6px 10px 10px; box-sizing: border-box;
  border-radius: 8px; background: linear-gradient(#1b1b1d, #070708); box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-cbb-espn-04 .hd { grid-column: 1 / 3; display: grid; place-items: center start; padding-left: 14px; background: linear-gradient(90deg, rgba(150,10,16,.8), rgba(150,10,16,.55) 45%, transparent); }   /* the red is strongest at the left end, behind the mark, and fades right */
.sb-cbb-espn-04 .hd .sb-ha { color: #f2f2f2; }
.sb-cbb-espn-04 .hf { display: grid; place-items: center end; padding-right: 10px; font-size: ${PX * 0.65}px; line-height: 1; }
.sb-cbb-espn-04 .tm { display: flex; align-items: center; gap: 8px; padding-left: 6px; border-top: 2px solid #3a3a3c; font-size: ${PX}px; line-height: 1; }
.sb-cbb-espn-04 .tm small { min-width: 30px; flex: none; font-size: .6em; text-align: right; opacity: .85; white-space: nowrap; }
/* the rank's box grows with a two-figure rank instead of letting it run into the letters */
.sb-cbb-espn-04 .sc { display: grid; place-items: center; background: linear-gradient(#f0f0ee, #c4c4c0); color: #111; font-size: ${PX * 0.9}px; line-height: 1; }
.sb-cbb-espn-04 .ck { grid-column: 3; grid-row: 2 / 4; position: relative; font-family: 'SB DSEG7', monospace; font-size: ${PX * 1.55}px; color: #f2f2f2; }
.sb-cbb-espn-04 .ck .d { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scaleX(.6); white-space: nowrap; }   /* tall, narrow lit digits over both rows, as on air (review, Nov 22) */
.sb-cbb-espn-04 .ck.w { display: grid; place-items: center; font-family: 'SB Archivo', sans-serif; font-size: ${PX * 0.5}px; }
.sb-cbb-espn-04 .hf, .sb-cbb-espn-04 .tm, .sb-cbb-espn-04 .ck { text-shadow: ${TEXT_90S}; }   /* the heavy dark outline and drop shadow of 90s TV type (surface pass) */
.sb-cbb-espn-04 .tm .nm { flex: 1; white-space: nowrap; margin-right: 10px; }   /* four letters (UTAH) fit their room (team sweep) */
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx'), hd = el('span', 'hd'); if (marks(opts).ha) hd.appendChild(haMark(46));
    bx.append(hd, el('span', 'hf', live ? (g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')) : ''));
    [g.away, g.home].forEach((t, i) => {
      const tm = el('span', 'tm'); tm.style.gridRow = String(i + 2);
      tm.append(el('small', '', t.rank && t.rank <= 25 ? String(t.rank) : ''), fit(el('span', 'nm', (t.abbr || '').toUpperCase())));
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 2);
      bx.append(tm, sc);
    });
    if (live) { const ck = el('span', 'ck'); ck.appendChild(el('span', 'd', g.clock || '')); bx.appendChild(ck); }
    else bx.appendChild(el('span', 'ck w', statusText(g, time)));
    root.appendChild(bx);
  },
};
