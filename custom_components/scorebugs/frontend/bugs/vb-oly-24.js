// "Mint rows '24": after the 2024 Olympic world feed's volleyball box (frames: retro catalogue vb-24oly-1 and -2, France v Poland, Paris
// gold medal match). Two light mint rows, one per team: a strip of the team's colour at the left end, the three-letter code in dark teal
// in a light rounded face, the flag (the team's logo here) and, for the team serving, a dark navy arrowhead; then the sets won in a dark
// teal cell and the points of the set being played in a teal cell. The round in a teal tab across the top ("GOLD MEDAL MATCH").
// Measured: rows 159 + 45 + 40 wide, 35 tall, 4 apart; colour strip 14; tab 22 tall; code cap 0.5 of a
// row, figures 0.5; mint #d8f0eb, sets cell #0d4f5a, points cell #15655f, ink #1d4b4b.
import { el, logo, statusText, teamColor, FONTS, fit, abbr3 } from '../kit.js';

const ROW = 35, GAP = 4, HEAD = 22, NAME = 159, SET = 45, PTS = 40, W = NAME + 3 + SET + 3 + PTS;
const top = (g) => (g.note ? HEAD + 3 : 0);

export default {
  id: 'vb-oly-24',
  size: { w: W, h: HEAD + 3 + 2 * ROW + GAP + 3 + ROW },
  sizeFor: (g) => ({ w: W, h: top(g) + 2 * ROW + GAP + (g.status === 'live' ? 0 : 3 + ROW) }),
  fonts: [FONTS.outfit],
  css: `
.sb-vb-oly-24 { font-family: 'SB Outfit', 'Trebuchet MS', sans-serif; font-weight: 500; color: #fff; }
.sb-vb-oly-24 .hd { position: absolute; left: 0; top: 0; width: ${W}px; height: ${HEAD}px; background: #1f6e6a; color: #d9efe9; font-size: 19px; font-weight: 400; letter-spacing: .03em; display: grid; place-items: center; white-space: nowrap; overflow: hidden; line-height: 1; }
.sb-vb-oly-24 .rw { position: absolute; left: 0; height: ${ROW}px; display: flex; gap: 3px; }
.sb-vb-oly-24 .nm { width: ${NAME}px; height: ${ROW}px; position: relative; display: flex; align-items: center; box-sizing: border-box; padding: 0 6px 0 24px; gap: 10px; background: #d8f0eb; color: #1d4b4b; }
.sb-vb-oly-24 .nm b { width: 2.3em; font-weight: 500; font-size: 25px; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-vb-oly-24 .nm .sb-logo { width: 47px; height: 27px; object-fit: contain; }
.sb-vb-oly-24 .nm .sv { position: absolute; right: 7px; top: 8px; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 19px solid #1c2a48; clip-path: polygon(0 0, 100% 50%, 0 100%, 40% 50%); }
.sb-vb-oly-24 .nm i { position: absolute; left: 0; top: 0; bottom: 0; width: 14px; }
.sb-vb-oly-24 .c { height: ${ROW}px; display: grid; place-items: center; font-size: 25px; line-height: 1; }
.sb-vb-oly-24 .s { width: ${SET}px; background: #0d4f5a; } .sb-vb-oly-24 .p { width: ${PTS}px; background: #15655f; }
.sb-vb-oly-24 .w { position: absolute; left: 0; width: ${W}px; height: ${ROW}px; background: #15655f; display: grid; place-items: center; font-size: 22px; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const y = top(g), live = g.status === 'live';
    if (g.note) root.appendChild(fit(el('div', 'hd', String(g.note).toUpperCase())));
    [g.away, g.home].forEach((t, i) => {
      const rw = el('div', 'rw'); rw.style.top = (y + i * (ROW + GAP)) + 'px';
      const nm = el('div', 'nm'), strip = el('i');
      strip.style.background = teamColor(t, '#3a3f47');
      nm.append(strip, fit(el('b', '', abbr3(t))), logo(t, 47));
      if (live && t.hasBall) nm.appendChild(el('span', 'sv'));
      rw.appendChild(nm);
      if (g.status !== 'pre') {
        rw.appendChild(el('span', 'c s', t.score != null ? String(t.score) : '0'));
        if (live) rw.appendChild(el('span', 'c p', (t.sets || []).length ? String(t.sets[t.sets.length - 1]) : ''));
      }
      root.appendChild(rw);
    });
    if (!live) { const w = el('div', 'w', g.status === 'final' ? 'FINAL' : statusText(g, time)); w.style.top = (y + 2 * ROW + GAP + 3) + 'px'; root.appendChild(w); }
  },
};
