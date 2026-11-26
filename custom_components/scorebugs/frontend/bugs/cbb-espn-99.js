// "Slate rows '99": after ESPN's college basketball bug (1999-2004; frame: Kentucky v Michigan State). A dark box with a black tab on top
// for the half and a light oval at the top right where the network's wordmark sat (here the Home Assistant logo); each team's rank and short
// name on a slate row with its score on a white cell, and the clock in a tall segmented display at the right.
import { el, statusText, scoreSlot, haMark, marks, FONTS, TEXT_90S } from '../kit.js';

const W = 560, H = 240, TOP = 62, TEAM = 230, SCORE = 110, PX = 50;

export default {
  id: 'cbb-espn-99',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo, { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-cbb-espn-99 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #ececec; }
.sb-cbb-espn-99 { font-weight: 700; font-stretch: 100%; }   /* face: Archivo 700 (low confidence) */
.sb-cbb-espn-99 .tab { position: absolute; left: 70px; top: 6px; width: 260px; height: ${TOP}px; display: grid; place-items: center; border-radius: 14px 14px 0 0; background: #0b0b0c; font-size: ${PX * 0.7}px; font-stretch: 85%; }   /* "2nd Half" in small capitals, as on air */
.sb-cbb-espn-99 .ov { position: absolute; right: 6px; top: 0; width: 220px; height: 74px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(#f2f2f2, #b5b5b7 75%); box-shadow: 0 0 0 4px #3a3a3c; z-index: 1; }
.sb-cbb-espn-99 .ov .sb-ha { color: #b2141a; }
.sb-cbb-espn-99 .bx { position: absolute; left: 0; right: 0; top: ${TOP}px; bottom: 0; display: grid; grid-template-columns: ${TEAM}px ${SCORE}px 1fr; grid-template-rows: 1fr 1fr; gap: 6px; padding: 10px; box-sizing: border-box;
  border-radius: 12px; background: #0b0b0c; box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-cbb-espn-99 .tm { display: flex; align-items: center; gap: 10px; padding-left: 8px; background: linear-gradient(#56605e, #3a4240); font-size: ${PX}px; line-height: 1; }
.sb-cbb-espn-99 .tm small { width: 36px; font-size: .62em; text-align: right; }
.sb-cbb-espn-99 .tm, .sb-cbb-espn-99 .sc { font-weight: 500; }   /* the frame's names and scores are a regular weight, not heavy */
.sb-cbb-espn-99 .sc { display: grid; place-items: center end; padding-right: 14px; background: linear-gradient(#ffffff, #d7d7d4); color: #111; font-size: ${PX}px; line-height: 1; }
.sb-cbb-espn-99 .ck { grid-column: 3; grid-row: 1 / 3; display: grid; place-items: center; font-family: 'SB DSEG7', monospace; font-size: ${PX * 1.75}px; position: relative; color: #f2f2f2; }
.sb-cbb-espn-99 .ck .d { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scaleX(.58) skewX(-10deg); white-space: nowrap; }   /* centred whatever its width, then narrowed */   /* tall, narrow lit digits filling both rows, as on air */
.sb-cbb-espn-99 .ck.w { font-family: 'SB Archivo', sans-serif; font-size: ${PX * 0.5}px; }
.sb-cbb-espn-99 .tab .sm { font-size: .74em; }
.sb-cbb-espn-99 .tab, .sb-cbb-espn-99 .ck { text-shadow: ${TEXT_90S}; }
/* the team letters plain white with no heavy outline, the ranks a deeper grey, the clock's lit digits leaning */
.sb-cbb-espn-99 .tm span { color: #fff; text-shadow: none; } .sb-cbb-espn-99 .tm small { color: #8d9195; text-shadow: none; }   /* the heavy dark outline and drop shadow of 90s TV type (surface pass) */
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    // "2nd Half" in small capitals, as on air: each word's first letter full size, the rest smaller capitals (built by hand: the face has none)
    const tab = el('div', 'tab'), tx = el('span', ''), words = live ? (g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '') + (g.league === 'NCAAM' ? ' Half' : '')).toUpperCase().split(' ') : [];
    words.forEach((w, i) => { if (i) tx.appendChild(document.createTextNode(' ')); tx.appendChild(document.createTextNode(w[0])); if (w.length > 1) tx.appendChild(el('span', 'sm', w.slice(1))); });
    tab.appendChild(tx);
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const tm = el('span', 'tm'); tm.style.gridRow = String(i + 1);
      tm.append(el('small', '', t.rank && t.rank <= 25 ? String(t.rank) : ''), el('span', '', (t.abbr || '').toUpperCase()));
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.append(tm, sc);
    });
    if (live) { const ck = el('span', 'ck'); ck.appendChild(el('span', 'd', g.clock || '')); bx.appendChild(ck); }
    else bx.appendChild(el('span', 'ck w', statusText(g, time)));
    const ov = el('div', 'ov'); if (marks(opts).ha) ov.appendChild(haMark(52));
    if (live) root.appendChild(tab);   // the tab holds the half only: before and after the game it goes (no empty tab)
    root.append(bx, ov);
  },
};
