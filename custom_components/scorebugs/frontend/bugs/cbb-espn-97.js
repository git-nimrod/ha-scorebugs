// "White tag '97": after ESPN's college basketball bug (1997-98; frame: Louisville v Marquette). A white tag at the top left where the
// network's wordmark sat (here the Home Assistant logo) and a black tab with the half at the right; under them a dark panel with each team's
// short name and score, and the clock large beside them.
import { el, statusText, scoreSlot, haMark, marks, FONTS, TEXT_90S, fit } from '../kit.js';

const W = 560, H = 190, TOP = 60, LEFT = 360, PX = 52, PRE_CUT = 112;   // before the tip-off the names' panel loses its empty score room

export default {
  id: 'cbb-espn-97',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the game there is no score: the names' panel closes up and the box is narrower
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - PRE_CUT, h: H } : { w: W, h: H }),   // records keep the room
  // measured against the frame by the automatic audit: text -31% vs the broadcast; 80 % of the correction
  typeScale: 1.353,
  fonts: [FONTS.archivo, { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-cbb-espn-97 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 88%; color: #ececec; }
.sb-cbb-espn-97 { font-weight: 800; font-stretch: 72%; }   /* tall, narrow letters as on air (Archivo 700 at full width was too wide) */
.sb-cbb-espn-97 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LEFT}px 1fr; grid-template-rows: ${TOP}px 1fr 1fr; background: #121214; box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-cbb-espn-97 .tag { display: grid; place-items: center start; padding-left: 18px; background: linear-gradient(#ffffff, #d9dadd); } .sb-cbb-espn-97 .tag .sb-ha { color: #111; }
.sb-cbb-espn-97 .hf { display: grid; place-items: center; background: #050505; font-size: ${PX * 0.75}px; line-height: 1; }
.sb-cbb-espn-97 .ln { grid-column: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 8px 6px 10px; background: #4b4643;   /* one even warm grey under both names, the scores close to the clock's panel */   /* the frame's rows are a warm grey (sampled ~#4d4845) */ font-size: ${PX}px; line-height: .9; overflow: hidden; }   /* the letters sat on the row's foot and the lower name was cut */
.sb-cbb-espn-97 .ck { grid-column: 2; grid-row: 2 / 4; display: grid; place-items: center; font-family: 'SB DSEG7', monospace; font-weight: 700; font-size: ${PX * 0.82}px; line-height: 1; }   /* thin lit-segment digits, as on air */
.sb-cbb-espn-97 .ln .rec { font-size: .6em; white-space: nowrap; }
.sb-cbb-espn-97 .ck.w { grid-row: 1 / 4; font-family: inherit; font-weight: 800; font-size: ${PX * 0.55}px; }
.sb-cbb-espn-97 .hf, .sb-cbb-espn-97 .ln, .sb-cbb-espn-97 .ck { text-shadow: ${TEXT_90S}; }   /* the heavy dark outline and drop shadow of 90s TV type (surface pass) */
.sb-cbb-espn-97 .ln .nm { flex: 1; white-space: nowrap; margin-right: 14px; }   /* four letters (UTAH) fit their room (team sweep) */
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    const recs = g.status === 'pre' && g.away.record && g.home.record;  // records before the game, every time
    if (g.status === 'pre' && !recs) bx.style.gridTemplateColumns = (LEFT - PRE_CUT) + 'px 1fr';
    const tag = el('span', 'tag'); if (marks(opts).ha) tag.appendChild(haMark(42));
    bx.appendChild(tag);
    if (live) bx.appendChild(el('span', 'hf', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')));
    [g.away, g.home].forEach((t, i) => {
      const ln = el('div', 'ln'); ln.style.gridRow = String(i + 2);
      ln.appendChild(fit(el('span', 'nm', (t.abbr || '').toUpperCase())));
      if (g.status !== 'pre') ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (recs) ln.appendChild(el('span', 'rec', t.record));
      bx.appendChild(ln);
    });
    bx.appendChild(fit(el('span', live ? 'ck' : 'ck w', live ? g.clock || '' : statusText(g, time))));   // the matched face is wider: the clock is squeezed to its box
    root.appendChild(bx);
  },
};
