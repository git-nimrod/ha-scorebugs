// "Corner board '24": after a US network's tour leaderboard of 2023-2025 (frame: a 2024 tour event, the leader on 6; retro catalogue
// golf-pga-24-1). A small board in the lower right corner running to the screen's edge: five rows, each with the position (shown once
// for a tie), the surname in capitals, the score to par in white on a deep red column, and the holes played; the leader's row is pale,
// the others a dark green-grey.
// Measured on the 1080p still: board 367 x 200 px, rows 40 px with no gaps; the leader's row #d8dcd5, the
// others #3c5041 (flat); the red column #761622, 45 px wide, running the board's full height; positions 32 px, names from 40 px,
// holes from 245 px; capitals 15 px, a plain sans of medium weight.
// : capitals 0.43 of a row (17 px on a 40 px row), a wide geometric
// sans (round C, O and S, open tracking: 0.31 of a capital between letters) of medium weight: Montserrat 500; the leader's letters a
// dark grey (#444845 on the zoom), not near-black; positions in a 36 px column, names from 39 px.
import { el, fit, FONTS } from '../kit.js';

const S = 2, ROW = 40 * S, ROWS = 5, W = 367 * S, POS = 36 * S, NAME = 156 * S, RED = 45 * S;
const holesOf = (p) => (p.thru === 'F' || Number(p.thru) >= 18 ? 'F' : p.thru ? String(p.thru) : '');

// the surname as boards print it: "Davis Love III" -> LOVE III (the feed's short form is the last word alone)
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const sur = (p, keep = true) => { const w = String(p.name || '').trim().split(/\s+/); const s = String(p.short || '');
  if (w.length > 2 && SUF.test(w[w.length - 1])) return (w[w.length - 2] + (keep ? ' ' + w[w.length - 1].replace(/\.$/, '') : '')).toUpperCase();
  return (s || w[w.length - 1] || '').toUpperCase(); };

export default {
  id: 'golf-cbs-24',
  size: { w: W, h: ROWS * ROW },
  sizeFor: (g) => ({ w: W, h: Math.max(1, Math.min(ROWS, (g.rows || []).length)) * ROW }),
  fonts: [FONTS.montserrat],
  css: `
.sb-golf-cbs-24 { font-family: 'SB Montserrat', 'Arial', sans-serif; font-weight: 500; color: #f2f4f2; }
.sb-golf-cbs-24 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: grid; grid-template-columns: ${POS}px ${NAME}px ${RED}px 1fr; align-items: center; background: #3c5041; font-size: ${22.5 * S}px; }
.sb-golf-cbs-24 .rw.lead { background: #d8dcd5; color: #444845; }
.sb-golf-cbs-24 .rw .p { text-align: center; }
.sb-golf-cbs-24 .rw .n { min-width: 0; overflow: hidden; white-space: nowrap; padding: 0 ${6 * S}px 0 ${3 * S}px; letter-spacing: ${0.8 * S}px; }
.sb-golf-cbs-24 .rw .s { height: 100%; display: grid; place-items: center; background: #761622; color: #fff; }
.sb-golf-cbs-24 .rw .t { padding-left: ${20 * S}px; }
`,
  draw(root, g) {
    const rows = (g.rows || []).slice(0, ROWS);
    if (g.player && !rows.some((p) => p.id === g.player.id) && rows.length) rows[rows.length - 1] = g.player;
    let last = null;
    rows.forEach((p, i) => {
      const rw = el('div', 'rw' + (i === 0 ? ' lead' : '') + (g.player && g.player.id === p.id ? ' me' : ''));
      rw.style.top = (i * ROW) + 'px';
      const place = p.place || p.pos;
      rw.append(el('span', 'p', place === last ? '' : String(place || '')), fit(el('span', 'n', sur(p))),
        el('span', 's', p.score || ''), el('span', 't', g.status === 'pre' ? '' : holesOf(p)));
      last = place;
      root.appendChild(rw);
    });
  },
};
