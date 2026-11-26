// "Blue rows '18": after the New York slam's score box on its US network, 2015-2018 (frame: the 2018 men's final, set 2; retro catalogue
// ten-espn-18-2). Two blue bars low on the left, one per player, parted by a thin light line: the seed small, the surname in white
// bold condensed type (mixed case), the country's letters small after it, then the games of each set, the finished ones a faded blue
// for the player who lost them, and a dark navy cell at the right end for the point score.
// Measured on the 1080p still: box 430 x 98 px, bars 46 px with a 4 px light line (#9fc1b4, the court showing through
// a gap) between them; blue #1b4d8e at the top to #123a73 at the foot; the point cell #0c1b3e, 48 px; capitals 24 px, the country's
// letters 11 px; set columns 32 px; a lost set's games #5f8fd0.
// Left out (no data): the point score (the navy cell stays, empty) and the server's yellow ball.
import { el, fit, FONTS } from '../kit.js';

const S = 2, ROW = 46 * S, LINE = 3 * S, W = 430 * S, PT = 48 * S, COL = 32 * S;
// "DEL POTRO" -> "Del Potro": the box sets surnames in mixed case
const title = (s) => String(s || '').toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());

export default {
  id: 'tennis-espn-18',
  size: { w: W, h: 2 * ROW + LINE },
  fonts: [FONTS.barlowCond700],
  css: `
.sb-tennis-espn-18 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-tennis-espn-18 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: grid; grid-template-columns: ${34 * S}px 1fr auto ${PT}px; align-items: center;
  background: linear-gradient(#1f559a, #1b4d8e 40%, #123a73); box-shadow: 0 ${S}px ${2 * S}px rgba(0,0,0,.35); }
.sb-tennis-espn-18 .sd { text-align: right; padding-right: ${6 * S}px; font-size: ${17 * S}px; font-weight: 700; }
.sb-tennis-espn-18 .nm { min-width: 0; white-space: nowrap; overflow: hidden; font-size: ${34 * S}px; letter-spacing: ${0.3 * S}px; }
.sb-tennis-espn-18 .nm small { font-size: ${13 * S}px; margin-left: ${6 * S}px; letter-spacing: ${0.5 * S}px; color: #e6edf6; }
.sb-tennis-espn-18 .ss { display: flex; padding-right: ${8 * S}px; } .sb-tennis-espn-18 .ss span { width: ${COL}px; text-align: center; font-size: ${30 * S}px; }
.sb-tennis-espn-18 .ss span.l { color: #5f8fd0; }
.sb-tennis-espn-18 .ss span sup { font-size: ${12 * S}px; }
.sb-tennis-espn-18 .pt { height: 100%; background: linear-gradient(#0f2148, #0c1b3e); }
`,
  draw(root, g) {
    const P = [g.away, g.home];
    const pre = g.status === 'pre';
    const n = pre ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    const cur = g.status === 'live' ? n - 1 : -1;
    P.forEach((t, i) => {
      const o = P[1 - i];
      const rw = el('div', 'rw'); rw.style.top = (i * (ROW + LINE)) + 'px';
      const nm = el('span', 'nm', title(t.abbr));
      const code = (/\/countries\/500\/([a-z]{3})\.png/.exec(t.logo || '') || [])[1];
      if (code) nm.appendChild(el('small', '', code.toUpperCase()));
      const ss = el('span', 'ss');
      for (let k = 0; k < n; k++) {
        const v = (t.sets || [])[k], w = (o.sets || [])[k];
        const c = el('span', k !== cur && v != null && w != null && v < w ? 'l' : '', v == null ? '' : String(v));
        const tb = (t.tiebreaks || [])[k];
        // a tiebreak's points beside the loser's games, as on air
        if (k !== cur && v != null && w != null && v < w && tb != null && tb !== '') c.appendChild(el('sup', '', String(tb)));
        ss.appendChild(c);
      }
      rw.append(el('span', 'sd', t.rank ? String(t.rank) : ''), fit(nm), ss, el('span', 'pt'));
      root.appendChild(rw);
    });
  },
};
