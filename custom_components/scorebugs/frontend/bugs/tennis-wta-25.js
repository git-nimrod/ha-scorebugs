// "Green glass '25": after the women's tour world feed of 2024-2025 (frames: the 2025 Finals, Sabalenka v Rybakina, and Indian Wells
// 2025, Andreeva v Swiatek; retro catalogue ten-wta-25-1 and ten-wta-25b-2, one look). A dark see-through box with rounded corners and a
// thin green rim, low on the left: two rows parted by a faint light line, each with the first initial in a light weight, the surname
// in bold condensed capitals and the seed small in brackets; then the games of each finished set in white (the winner's bold, the
// loser's light), and the set being played on a bright green column with near-black figures.
// Measured on the 1080p stills: box 384 x 94 px, corners 10 px, #2c2e31 at 85 % (the court shows through)
// with a soft light streak across the middle; rim 2 px #2fe39a fading out along the bottom; green column #1fe28c, 30 px wide, running
// the box's full height; capitals 22 px; a 1 px rule rgba(255,255,255,.35) between the rows.
// Left out (no data): the point score column and the ball by the server.
import { el, fit, FONTS } from '../kit.js';

const S = 2, ROW = 44 * S, H = 94 * S, NAME = 300 * S, COL = 34 * S, CUR = 30 * S, TAIL = 34 * S;

export default {
  id: 'tennis-wta-25',
  size: { w: NAME + 4 * COL + CUR + TAIL, h: H },
  sizeFor: (g) => {
    const n = g.status === 'pre' ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    const live = g.status === 'live';
    return { w: NAME + Math.max(0, n - (live ? 1 : 0)) * COL + (live ? CUR : 0) + TAIL, h: H };
  },
  fonts: [FONTS.barlowCond500, FONTS.barlowCond700],
  css: `
.sb-tennis-wta-25 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-tennis-wta-25 .bx { position: absolute; inset: 0; border-radius: ${10 * S}px; overflow: hidden;
  background: linear-gradient(176deg, rgba(255,255,255,0) 44%, rgba(255,255,255,.1) 49%, rgba(255,255,255,0) 54%), linear-gradient(rgba(52,55,58,.88), rgba(40,42,45,.86) 50%, rgba(34,36,38,.88));
  box-shadow: inset 0 0 0 ${S}px rgba(47,227,154,.75), inset 0 ${2 * S}px 0 rgba(47,227,154,.55), 0 ${S}px ${4 * S}px rgba(0,0,0,.35); }
.sb-tennis-wta-25 .rl { position: absolute; left: ${20 * S}px; right: ${TAIL}px; top: ${H / 2}px; height: ${S}px; background: linear-gradient(to right, rgba(255,255,255,.08), rgba(255,255,255,.4) 40%, rgba(255,255,255,.12)); }
.sb-tennis-wta-25 .cuc { position: absolute; top: 0; bottom: 0; width: ${CUR}px; background: linear-gradient(#35f19e, #1fe28c 50%, #19cf80); }
.sb-tennis-wta-25 .rw { position: absolute; left: 0; height: ${ROW}px; display: flex; align-items: center; }
.sb-tennis-wta-25 .nm { width: ${NAME}px; flex: none; box-sizing: border-box; padding-left: ${62 * S}px; padding-right: ${8 * S}px; white-space: nowrap; overflow: hidden; font-size: ${30 * S}px; }
.sb-tennis-wta-25 .nm i { font-style: normal; font-weight: 500; margin-right: ${5 * S}px; color: #e9ebee; }
.sb-tennis-wta-25 .nm small { font-size: ${15 * S}px; font-weight: 500; margin-left: ${7 * S}px; color: #d9dce0; letter-spacing: ${0.5 * S}px; }
.sb-tennis-wta-25 .s { width: ${COL}px; flex: none; text-align: center; font-size: ${30 * S}px; font-weight: 500; color: #e6e8eb; }
.sb-tennis-wta-25 .s.w { font-weight: 700; color: #fff; }
.sb-tennis-wta-25 .s sup { font-size: ${12 * S}px; }
.sb-tennis-wta-25 .cu { width: ${CUR}px; flex: none; text-align: center; font-size: ${30 * S}px; color: #0c1512; position: relative; }
`,
  draw(root, g) {
    root.appendChild(el('div', 'bx'));
    const P = [g.away, g.home];
    const pre = g.status === 'pre';
    const n = pre ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    const cur = g.status === 'live' ? n - 1 : -1;
    if (cur >= 0) { const c = el('div', 'cuc'); c.style.left = (NAME + cur * COL) + 'px'; root.appendChild(c); }
    root.appendChild(el('div', 'rl'));
    P.forEach((t, i) => {
      const o = P[1 - i];
      const rw = el('div', 'rw'); rw.style.top = (3 * S + i * (ROW + 1 * S)) + 'px';
      const nm = el('span', 'nm');
      const first = String(t.name || '').trim().split(/\s+/)[0] || '';
      if (first && String(t.name).trim().split(/\s+/).length > 1) nm.appendChild(el('i', '', first[0].toUpperCase() + '.'));
      nm.appendChild(document.createTextNode(String(t.abbr || '').toUpperCase()));
      if (t.rank) nm.appendChild(el('small', '', '[' + t.rank + ']'));
      rw.appendChild(fit(nm));
      for (let k = 0; k < n; k++) {
        const v = (t.sets || [])[k], w = (o.sets || [])[k];
        const c = el('span', k === cur ? 'cu' : 's' + (v != null && w != null && v > w ? ' w' : ''), v == null ? '' : String(v));
        const tb = (t.tiebreaks || [])[k];
        // a tiebreak's points beside the loser's games, as on air
        if (k !== cur && v != null && w != null && v < w && tb != null && tb !== '') c.appendChild(el('sup', '', String(tb)));
        rw.appendChild(c);
      }
      root.appendChild(rw);
    });
  },
};
