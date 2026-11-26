// "Dark glass '25" (after the MLB bug on Apple TV, 2022-2025): a
// quiet see-through dark card with round corners and light type. Top row: away logo and score, the bases as grey diamonds (lit white
// when someone is on), the home score and logo. Second row under it, as on air: the half inning with its yellow arrow under the away
// side, the outs as two small dots under the bases, and the count under the home side. Real stills (Apple TV, Padres v Giants 2025,
// 720p): the card is about 3.3 x as wide as tall without the pitcher line (left out: no data), logos 44 % of the height, score cap
// height 35 %, bases 68 % of the height across, second row's type 17 %.
import { el, otherSport, logo, bases, pips, statusText, scoreSlot, fit, FONTS } from '../kit.js';

const H = 100, W = 340;
const LOGO = 44, SCORE_PX = 49, SC_COL = 62;

export default {
  id: 'mlb-glass-25',
  size: { w: W, h: H },
  // before the first pitch there is no score: the two score columns go and the card closes up
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - 2 * SC_COL, h: H } : { w: W, h: H }),   // records keep the score columns
  logos: 'dark',   // white one-colour logos on the dark glass, as on air
  fonts: [{ family: 'SB Inter', file: 'inter-latin-600-normal.woff2', desc: { weight: '600' } }, FONTS.inter],
  css: `
.sb-mlb-glass-25 { font-family: 'SB Inter', -apple-system, 'Segoe UI', sans-serif; font-weight: 600; color: #f4f4f4; line-height: 1; }
.sb-mlb-glass-25 .card { position: absolute; inset: 0; border-radius: ${Math.round(H * 0.13)}px; background: rgba(18,20,24,.5); -webkit-backdrop-filter: blur(8px) saturate(1.2); backdrop-filter: blur(8px) saturate(1.2);   /* see-through smoked glass: what is behind shows, softened */
  box-shadow: 0 4px 14px rgba(0,0,0,.35); display: grid; grid-template-columns: ${SC_COL - 4}px ${SC_COL}px 1fr ${SC_COL}px ${SC_COL - 4}px; grid-template-rows: 62px 1fr; padding: 8px 18px 6px; align-items: center; }
.sb-mlb-glass-25 .card.pre { grid-template-columns: ${SC_COL - 4}px 1fr ${SC_COL - 4}px; }
.sb-mlb-glass-25 .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain; justify-self: center; }
.sb-mlb-glass-25 .s { font-size: ${SCORE_PX}px; text-align: center; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sb-mlb-glass-25 .s { font-family: 'SB Inter V', 'SB Inter', sans-serif; font-weight: 300; }   /* the scores are thin light figures on air (frame) */
.sb-mlb-glass-25 .mid { display: flex; align-items: center; justify-content: center; }
.sb-mlb-glass-25 .sb-bases i { background: rgba(0,0,0,.25); border: 2.5px solid #f4f4f4; border-radius: 2px; } .sb-mlb-glass-25 .sb-bases i.on { background: #f4f4f4; }   /* an empty bag is a white outline, as on air (review, Nov 22) */
.sb-mlb-glass-25 .s.rec { font-size: 22px; font-weight: 500; }
.sb-mlb-glass-25 .sb-pips { display: flex; gap: 10px; } .sb-mlb-glass-25 .sb-pips i { width: 15px; height: 15px; border-radius: 50%; background: #f4f4f4; box-sizing: border-box; }
.sb-mlb-glass-25 .sb-pips i.used { background: none; border: 2.5px solid rgba(255,255,255,.65); }   /* out dots about 0.4 of a bag across, as on air (rework, Nov 23) */
.sb-mlb-glass-25 .r2 { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 22px; white-space: nowrap; }
.sb-mlb-glass-25 .r2 b { color: #f2c832; font-size: 15px; margin-right: 3px; font-weight: 600; }
.sb-mlb-glass-25 .r2.all { grid-column: 1 / -1; }
.sb-mlb-glass-25 .mid .dt { font-size: 14px; line-height: 1.1; text-align: center; white-space: pre-line; }
.sb-mlb-glass-25 .card.big .s { font-size: 36px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball; // a baseball bug forced onto another sport's game shows only the scores
    const card = el('div', 'card'), mid = el('div', 'mid');
    // three-figure scores (another sport's game) take a smaller size, both alike
    if ([g.away, g.home].some((t) => Number(t.score) >= 100)) card.classList.add('big');
    const sc = (t) => scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
    const os = otherSport(g, 5);
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (os) { if (os.detail) mid.appendChild(el('span', 'dt', os.detail)); } else mid.append(bases(live ? g.baseball.bases : null, 22));   // bigger, as on air
    const rec = (t) => { const r = el('span', 's rec', t.record); if (t.record.length > 5) r.style.fontSize = '16px'; return r; };
    if (g.status === 'pre' && g.away.record && g.home.record) card.append(logo(g.away, LOGO), rec(g.away), mid, rec(g.home), logo(g.home, LOGO));  // records before the game, every time
    else if (g.status === 'pre') { card.classList.add('pre'); card.append(logo(g.away, LOGO), mid, logo(g.home, LOGO)); }
    else card.append(logo(g.away, LOGO), sc(g.away), mid, sc(g.home), logo(g.home, LOGO));
    const cols = card.classList.contains('pre') ? 3 : 5;
    if (live) {
      const b = g.baseball, h = el('span', 'r2'), o = el('span', 'r2'), c = el('span', 'r2');
      h.style.gridColumn = '1 / span 2'; o.style.gridColumn = '3'; c.style.gridColumn = (cols - 1) + ' / span 2';
      h.appendChild(el('b', '', b.half === 'bot' ? '\u25bc' : b.half === 'top' ? '\u25b2' : ''));
      h.appendChild(document.createTextNode(g.period.label + (g.period.suffix || '').toLowerCase()));
      o.appendChild(pips(b.outs, 2));
      c.textContent = b.balls + '-' + b.strikes;
      card.append(h, o, c);
    } else if (os) {
      const h = el('span', 'r2', os.period), c = el('span', 'r2', os.clock);
      h.style.gridColumn = '1 / span 2'; c.style.gridColumn = (cols - 1) + ' / span 2';
      card.append(h, c);
    }
    else {
      // the start time on one line under the bases, as the inning stands in a live game
      const w = el('span', 'r2 all', statusText(g, time));
      card.appendChild(fit(w));
    }
    root.appendChild(card);
  },
};
