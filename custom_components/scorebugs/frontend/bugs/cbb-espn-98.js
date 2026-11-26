// "Oval tag '98": after ESPN's college basketball bug (1998-99; frame: North Carolina v Duke). A black box with a light oval at the top left
// where the network's wordmark sat (here the Home Assistant logo) and the half spelled out at the right; each team's rank and short name with
// its score on a light cell, and the clock in a segmented display.
import { el, statusText, scoreSlot, haMark, marks, FONTS, TEXT_90S, fit } from '../kit.js';

const W = 560, H = 230, TOP = 76, TEAM = 230, SCORE = 90, PX = 46;

export default {
  id: 'cbb-espn-98',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo, { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-cbb-espn-98 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #ececec; }
.sb-cbb-espn-98 { font-weight: 800; font-stretch: 110%; }   /* face: Archivo 800 at 110% width (low confidence) */
.sb-cbb-espn-98 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${TEAM}px ${SCORE}px 1fr; grid-template-rows: ${TOP}px 1fr 1fr; gap: 4px; padding: 6px 10px 10px; box-sizing: border-box;
  border-radius: 10px; background: #0b0b0c; box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-cbb-espn-98 .ov { grid-column: 1 / 3; justify-self: start; width: 240px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(#eeeeee, #a9a9ab 75%); box-shadow: inset 0 0 0 4px #5b5b5e; }
.sb-cbb-espn-98 .ov .sb-ha { color: #111; }
.sb-cbb-espn-98 .hf { display: grid; place-items: center end; padding-right: 10px; font-size: ${PX * 0.8}px; line-height: 1; }
.sb-cbb-espn-98 .tm { display: flex; align-items: center; gap: 8px; padding-left: 8px; background: linear-gradient(#6a665c, #48453d); font-size: ${PX}px; line-height: 1; }   /* the frame's rows are a warm mid grey (sampled ~#5a554b), not near-black */
.sb-cbb-espn-98 .tm small { min-width: 26px; flex: none; font-size: .6em; text-align: right; opacity: .85; white-space: nowrap; }
/* the rank's box grows with a two-figure rank instead of letting it run into the letters */
/* and the letters fitted to what is left of the row */
.sb-cbb-espn-98 .tm .nm { flex: 1; white-space: nowrap; margin-right: 6px; }
.sb-cbb-espn-98 .sc { display: grid; place-items: center; background: linear-gradient(#f2f2ee, #c7c7c1); color: #111; font-size: ${PX * 0.85}px; line-height: 1; }
.sb-cbb-espn-98 .ck { grid-column: 3; grid-row: 2 / 4; display: grid; place-items: center; font-family: 'SB DSEG7', monospace; font-size: ${PX * 1.9}px; position: relative; color: #f2f2f2; }
.sb-cbb-espn-98 .ck .d { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scaleX(.6); white-space: nowrap; }   /* tall narrow lit digits about three quarters of the two rows' height, as on air; centred, then narrowed */
.sb-cbb-espn-98 .ck.w { font-family: 'SB Archivo', sans-serif; font-size: ${PX * 0.55}px; }
.sb-cbb-espn-98 .hf, .sb-cbb-espn-98 .tm, .sb-cbb-espn-98 .ck { text-shadow: ${TEXT_90S}; }   /* the heavy dark outline and drop shadow of 90s TV type (surface pass) */
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx'), ov = el('span', 'ov'); if (marks(opts).ha) ov.appendChild(haMark(52));
    // "Half" only for a men's college game in halves (it read 3rd Half on football, 2 Half on cricket)
    bx.append(ov, el('span', 'hf', live ? (g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase() + (g.league === 'NCAAM' ? ' Half' : '')) : ''));
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
