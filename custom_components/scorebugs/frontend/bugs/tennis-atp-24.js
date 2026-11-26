// "Lime box '24": after the men's tour's own streaming feed, 2023-2025 (frame: a 2024 Masters 1000 match, first set; retro catalogue
// ten-atp-24-1). A navy box low on the left: two rows with the surnames in white condensed capitals, opened up, parted by a thin
// line; then the games of each finished set in white and the set being played on lime tiles with black figures.
// Measured on the 1080p still: box 230 x 94 px, navy #18213a with a faint lighter top (+3 L); rows 44 px,
// a 1 px rule #3c4660 between them inset 30 px; lime tiles #e1f25a, 36 x 40 px, 3 px apart, square corners; capitals 20 px with
// 0.08 em tracking and a faint grey lower half (a two-tone fill; drawn plain white with a small dark drop here).
// Left out (no data): the point score and the lime dot by the server.
import { el, fit, FONTS } from '../kit.js';

const S = 2, ROW = 44 * S, NAME = 160 * S, COL = 36 * S, TILE = 36 * S, PAD = 6 * S;

export default {
  id: 'tennis-atp-24',
  size: { w: NAME + 4 * COL + TILE + PAD, h: 2 * ROW + 6 * S },
  sizeFor: (g) => {
    const n = g.status === 'pre' ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    const live = g.status === 'live';
    return { w: NAME + Math.max(0, n - (live ? 1 : 0)) * COL + (live ? TILE : 0) + PAD, h: 2 * ROW + 6 * S };
  },
  fonts: [FONTS.barlowCond700],
  css: `
.sb-tennis-atp-24 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-tennis-atp-24 .bx { position: absolute; inset: 0; background: linear-gradient(#1f2944, #18213a 30%, #161e35); box-shadow: 0 ${S}px ${3 * S}px rgba(0,0,0,.35); }
.sb-tennis-atp-24 .rl { position: absolute; left: ${30 * S}px; width: ${NAME - 50 * S}px; top: ${3 * S + ROW}px; height: ${S}px; background: #3c4660; }
.sb-tennis-atp-24 .rw { position: absolute; left: 0; right: ${PAD}px; height: ${ROW}px; display: flex; align-items: center; }
.sb-tennis-atp-24 .nm { width: ${NAME}px; flex: none; box-sizing: border-box; padding-left: ${28 * S}px; padding-right: ${8 * S}px; font-size: ${29 * S}px; letter-spacing: ${2.2 * S}px; white-space: nowrap; overflow: hidden;
  color: #f2f3f7; text-shadow: 0 ${S}px 0 rgba(0,0,0,.35); }
.sb-tennis-atp-24 .s { width: ${COL}px; flex: none; text-align: center; font-size: ${29 * S}px; }
.sb-tennis-atp-24 .s sup { font-size: ${12 * S}px; }
.sb-tennis-atp-24 .cu { width: ${TILE}px; height: ${40 * S}px; flex: none; display: grid; place-items: center; background: #e1f25a; color: #0d1326; font-size: ${29 * S}px; }
`,
  draw(root, g) {
    root.appendChild(el('div', 'bx')); root.appendChild(el('div', 'rl'));
    const P = [g.away, g.home];
    const pre = g.status === 'pre';
    const n = pre ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    const cur = g.status === 'live' ? n - 1 : -1;
    P.forEach((t, i) => {
      const rw = el('div', 'rw'); rw.style.top = (i * (ROW + 6 * S)) + 'px';
      rw.appendChild(fit(el('span', 'nm', String(t.abbr || '').toUpperCase())));
      for (let k = 0; k < n; k++) {
        const v = (t.sets || [])[k], w = (P[1 - i].sets || [])[k];
        const c = el('span', k === cur ? 'cu' : 's', v == null ? '' : String(v));
        const tb = (t.tiebreaks || [])[k];
        // a tiebreak's points beside the loser's games, as on air
        if (k !== cur && v != null && w != null && v < w && tb != null && tb !== '') c.appendChild(el('sup', '', String(tb)));
        rw.appendChild(c);
      }
      root.appendChild(rw);
    });
  },
};
