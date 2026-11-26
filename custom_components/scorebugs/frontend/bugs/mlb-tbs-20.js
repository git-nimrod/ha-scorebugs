// "Dark cells '20": after TBS's MLB postseason bug (2020-21; frame: Yankees at Guardians). A charcoal box of cells: each team's logo on
// navy with its score on a white cell beside it; then a column with the count over the outs (yellow dots), a column with the bases (a
// yellow diamond when a runner is on) over the inning, and the network's blue cell at the right (here the Home Assistant logo). The
// pitcher and speed line under the box is left out (no data).
import { el, otherSport, logo, bases, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 760, H = 196, RULE = 4, LOGO = 104, SCORE = 108, COL = 164, MARK = 164;
const SCORE_PX = 70, COUNT_PX = 50;

export default {
  id: 'mlb-tbs-20',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the white score cells go (the kit's logo in them doubled the logo beside it) and the box closes up
  sizeFor: (g) => (g.status === 'pre' ? { w: W - SCORE - RULE, h: H } : { w: W, h: H }),
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  // measured against the frame by the automatic audit: text -19% vs the broadcast, logos -20%; 80 % of the correction
  typeScale: 1.0, logoScale: 1.199,
  fonts: [FONTS.kanit600],
  css: `
.sb-mlb-tbs-20 { font-family: 'SB Kanit', 'Arial', sans-serif; font-weight: 600; color: #f2f3f5; }
.sb-mlb-tbs-20 { font-weight: 600; }   /* TBS/TNT MLB: Kanit SemiBold */
.sb-mlb-tbs-20 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LOGO}px ${SCORE}px ${COL}px ${COL}px ${MARK}px; grid-template-rows: 1fr 1fr; gap: ${RULE}px; padding: 8px; box-sizing: border-box;
  border-radius: 6px; background: linear-gradient(#24262b, #141518); box-shadow: 0 3px 8px rgba(0,0,0,.55); }
.sb-mlb-tbs-20 .lg { display: grid; place-items: center; background: linear-gradient(#22294a, #151a33); }
.sb-mlb-tbs-20 .lg .sb-logo { width: 72px; height: 66px; object-fit: contain; }
.sb-mlb-tbs-20 .sc { display: grid; place-items: center; background: linear-gradient(#f6f6f6, #cfd1d5); color: #0b0b0d; font-size: ${SCORE_PX}px; font-weight: 800; line-height: 1; }
.sb-mlb-tbs-20 .c { display: flex; align-items: center; justify-content: center; white-space: nowrap; background: linear-gradient(#2f3136, #1d1f23); font-size: ${COUNT_PX}px; line-height: 1; }
.sb-mlb-tbs-20 .c.lo { background: linear-gradient(#1f1f1d, #151514); }   /* the lower cells (outs, inning) are darker than the upper ones on air (#181816 against #323335) */
.sb-mlb-tbs-20 .c b { color: #f2d230; font-size: .55em; margin-right: 6px; vertical-align: .2em; }
.sb-mlb-tbs-20 .dots { display: flex; gap: 16px; } .sb-mlb-tbs-20 .dots i { width: 22px; height: 22px; border-radius: 50%; background: #45474c; } .sb-mlb-tbs-20 .dots i.on { background: radial-gradient(circle at 40% 35%, #fff37a, #e6c21e 70%); }
.sb-mlb-tbs-20 .sb-bases i { background: #55575c; } .sb-mlb-tbs-20 .sb-bases i.on { background: linear-gradient(135deg, #fff16a, #e3b812); }
.sb-mlb-tbs-20 .mk { grid-column: 5; grid-row: 1 / 3; display: grid; place-items: center; border-radius: 4px; background: radial-gradient(120% 100% at 50% 30%, #205a98, #123c6c 70%); }   /* deeper blue on air (#174674) */
.sb-mlb-tbs-20 .mk .sb-ha { color: #fff; }
.sb-mlb-tbs-20 .w { grid-column: 3 / 5; grid-row: 1 / 3; font-size: ${COUNT_PX * 0.75}px; }
.sb-mlb-tbs-20 .c.dt { font-size: 30px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const lg = el('span', 'lg'); lg.style.gridRow = String(i + 1); lg.appendChild(logo(t, 72));
      bx.appendChild(lg);
      if (g.status === 'pre') return;
      const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.appendChild(sc);
    });
    if (live) {
      const cnt = el('span', 'c', b.balls + '-' + b.strikes); cnt.style.cssText = 'grid-column:3;grid-row:1';
      const outs = el('span', 'c lo'); outs.style.cssText = 'grid-column:3;grid-row:2';
      const dots = el('span', 'dots'); for (let i = 0; i < 3; i++) dots.appendChild(el('i', i < b.outs ? 'on' : '')); outs.appendChild(dots);
      const bs = el('span', 'c'); bs.style.cssText = 'grid-column:4;grid-row:1'; bs.appendChild(bases(b.bases, 34));
      const inn = el('span', 'c lo'); inn.style.cssText = 'grid-column:4;grid-row:2'; inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      bx.append(cnt, outs, bs, inn);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const ck = el('span', 'c', os.clock); ck.style.cssText = 'grid-column:3;grid-row:1 / 3';
      const dt = el('span', 'c dt', os.detail); dt.style.cssText = 'grid-column:4;grid-row:1';
      const inn = el('span', 'c lo', os.period); inn.style.cssText = 'grid-column:4;grid-row:2';
      bx.append(ck, dt, inn);
    } else {
      const w = el('span', 'c w', statusText(g, time));
      if (g.status === 'pre') { bx.style.gridTemplateColumns = LOGO + 'px ' + COL + 'px ' + COL + 'px ' + MARK + 'px'; w.style.gridColumn = '2 / 4'; }
      bx.appendChild(w);
    }
    const mk = el('span', 'mk'); if (g.status === 'pre') mk.style.gridColumn = '4'; if (marks(opts).ha) mk.appendChild(haMark(92)); bx.appendChild(mk);
    root.appendChild(bx);
  },
};
