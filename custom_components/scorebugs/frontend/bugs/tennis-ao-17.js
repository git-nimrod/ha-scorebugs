// "Black tiles '17": after the Melbourne slam's world feed of 2015-2018 (frame: the 2017 men's final, set 5; retro catalogue
// ten-ao-17-2). Two rows of raised black tiles low on the left: a long tile with the player's flag and surname in white capitals, then a
// tile per set with the games, the sets a player won in light blue, and a pale tile at the end for the point score.
// Measured on the 1080p still: rows 40 px with a 4 px gap; the name tile 285 px, set tiles 45 x 40 px with a 3 px gap;
// tiles near black (#101114 to #1c1d21 top to foot) with a lit top edge (+20 L, 2 px), a dark foot edge and corners of 4 px; won-set
// figures #27a3dc; flags 46 x 28 px with a 1 px dark rim; capitals 22 px.
// Left out (no data): the point score tile and the server's arrow.
import { el, fit, logo, FONTS } from '../kit.js';

const S = 2, ROW = 40 * S, GAP = 4 * S, NAME = 285 * S, TILE = 45 * S, TG = 3 * S;

export default {
  id: 'tennis-ao-17',
  size: { w: NAME + 5 * (TILE + TG), h: 2 * ROW + GAP },
  sizeFor: (g) => {
    const n = g.status === 'pre' ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    return { w: NAME + n * (TILE + TG), h: 2 * ROW + GAP };
  },
  logoScale: 1,
  fonts: [FONTS.barlow700],
  css: `
.sb-tennis-ao-17 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-tennis-ao-17 .rw { position: absolute; left: 0; height: ${ROW}px; display: flex; gap: ${TG}px; }
.sb-tennis-ao-17 .t { height: ${ROW}px; border-radius: ${4 * S}px; display: grid; align-items: center;
  background: linear-gradient(#3a3b40, #18191c 6%, #101114 45%, #17181c 90%, #050506);
  box-shadow: inset 0 ${S}px 0 rgba(255,255,255,.22), inset 0 -${S}px 0 rgba(0,0,0,.7), 0 ${S}px ${2 * S}px rgba(0,0,0,.45); }
.sb-tennis-ao-17 .nm { width: ${NAME}px; grid-template-columns: ${66 * S}px 1fr; box-sizing: border-box; }
.sb-tennis-ao-17 .nm.nf { grid-template-columns: 1fr; padding-left: ${16 * S}px; }
.sb-tennis-ao-17 .nm .sb-logo { width: ${46 * S}px; height: ${28 * S}px; object-fit: cover; justify-self: center; box-shadow: 0 0 0 ${S}px rgba(0,0,0,.6); border-radius: ${2 * S}px; }
.sb-tennis-ao-17 .nm span { font-size: ${30 * S}px; letter-spacing: ${0.5 * S}px; white-space: nowrap; overflow: hidden; padding-right: ${10 * S}px; }
.sb-tennis-ao-17 .st { width: ${TILE}px; justify-items: center; font-size: ${30 * S}px; }
.sb-tennis-ao-17 .st.w { color: #27a3dc; }
/* one line: the games with the tiebreak points raised beside them (a grid would stack them) */
.sb-tennis-ao-17 .st { line-height: 1; display: flex; justify-content: center; align-items: center; }
/* a tiebreak's points small and raised, inside the tile */
.sb-tennis-ao-17 .st sup { font-size: ${13 * S}px; margin-left: ${S}px; align-self: flex-start; margin-top: ${9 * S}px; line-height: 1; }
`,
  draw(root, g) {
    const P = [g.away, g.home];
    const pre = g.status === 'pre';
    const n = pre ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    const cur = g.status === 'live' ? n - 1 : -1;
    P.forEach((t, i) => {
      const o = P[1 - i];
      const rw = el('div', 'rw'); rw.style.top = (i * (ROW + GAP)) + 'px';
      const nm = el('div', 't nm'); if (t.logo) nm.appendChild(logo(t, 46 * S));
      else nm.classList.add('nf');
      nm.append(fit(el('span', '', String(t.abbr || '').toUpperCase())));
      rw.appendChild(nm);
      for (let k = 0; k < n; k++) {
        const v = (t.sets || [])[k], w = (o.sets || [])[k];
        const c = el('div', 't st' + (k !== cur && v != null && w != null && v > w ? ' w' : ''), v == null ? '' : String(v));
        const tb = (t.tiebreaks || [])[k];
        // a tiebreak's points beside the loser's games, as on air
        if (k !== cur && v != null && w != null && v < w && tb != null && tb !== '') c.appendChild(el('sup', '', String(tb)));
        rw.appendChild(c);
      }
      root.appendChild(rw);
    });
  },
};
