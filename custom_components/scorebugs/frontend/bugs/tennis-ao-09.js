// "Orange box '09": after the Melbourne slam's world feed of 2008-2010 (frame: the 2009 men's final, set 3; retro catalogue
// ten-ao-09-2). A small box low on the left: two orange rows, one per player, split by a black rule, each with the player's three
// letters in black and the sets they have won; then a teal cell with the games of the set being played in white, and a white cell
// with the point score.
// Measured on the 1080p still: box 235 x 78 px; rows 37 px with a 3 px black rule between them; orange
// #e99a0a flat with a white wash over its left 20 % and a darker foot (-17 L in the last 10 %); teal #086484, dark at the top (-21 L)
// lightening down; letters a heavy sans, capitals 22 px.
// : the teal cell touches the orange (no gap), and there is no black rim round the box: the
// only black is the 3 px rule between the rows.
// Left out (no data): the point score cell and the ball by the server's name. Before the match only the names show; after it, the sets won.
import { el, fit, FONTS } from '../kit.js';

const S = 3, ROW = 37 * S, RULE = 3 * S, NAME = 108 * S, SETS = 40 * S, CUR = 35 * S;
const W = NAME + SETS + CUR;

export default {
  id: 'tennis-ao-09',
  size: { w: W, h: 2 * ROW + RULE },
  sizeFor: (g) => ({ w: g.status === 'pre' ? NAME : g.status === 'final' ? NAME + SETS : W, h: 2 * ROW + RULE }),
  fonts: [FONTS.archivo],
  css: `
.sb-tennis-ao-09 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 72%; }
.sb-tennis-ao-09 .bx { position: absolute; inset: 0; background: #0b0b0b; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-tennis-ao-09 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: grid; grid-template-columns: ${NAME}px ${SETS}px ${CUR}px; }
.sb-tennis-ao-09 .rw > span { display: grid; align-items: center; }
/* orange with a white wash over its left end, a darker foot */
.sb-tennis-ao-09 .nm, .sb-tennis-ao-09 .sw { background: linear-gradient(rgba(0,0,0,0) 88%, rgba(120,60,0,.35)), linear-gradient(to right, rgba(255,255,255,.75), rgba(255,255,255,0) 22%), #e99a0a; color: #121212; }
.sb-tennis-ao-09 .sw { background: linear-gradient(rgba(0,0,0,0) 88%, rgba(120,60,0,.35)), #e99a0a; }
.sb-tennis-ao-09 .nm { padding-left: ${22 * S}px; font-size: ${32 * S}px; letter-spacing: ${0.5 * S}px; }
.sb-tennis-ao-09 .sw { justify-items: center; font-size: ${30 * S}px; }
.sb-tennis-ao-09 .cu { justify-items: center; font-size: ${30 * S}px; color: #fff; background: linear-gradient(#063f55, #075a78 35%, #0a6e90 75%, #0c7698); }
.sb-tennis-ao-09.pre .sw, .sb-tennis-ao-09.pre .cu, .sb-tennis-ao-09.final .cu { display: none; }
`,
  draw(root, g) {
    const pre = g.status === 'pre';
    if (pre) root.classList.add('pre');
    if (g.status === 'final') root.classList.add('final');
    root.appendChild(el('div', 'bx'));
    const P = [g.away, g.home];
    const n = Math.max((g.away.sets || []).length, (g.home.sets || []).length);
    const cur = g.status === 'live' ? n - 1 : -1;
    P.forEach((t, i) => {
      const o = P[1 - i];
      const rw = el('div', 'rw'); rw.style.top = (i * (ROW + RULE)) + 'px';
      // sets won: finished sets where this player took more games
      let won = 0;
      for (let k = 0; k < n; k++) { const a = (t.sets || [])[k], b = (o.sets || [])[k]; if (k !== cur && a != null && b != null && a > b) won++; }
      const games = cur >= 0 ? (t.sets || [])[cur] : null;
      rw.append(fit(el('span', 'nm', String(t.abbr || '').toUpperCase().slice(0, 3))), el('span', 'sw', pre ? '' : String(won)), el('span', 'cu', games == null ? '' : String(games)));
      root.appendChild(rw);
    });
  },
};
