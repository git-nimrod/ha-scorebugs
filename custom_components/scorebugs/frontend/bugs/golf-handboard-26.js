// "Hand board '26": after the hand-operated leaders board at a golf major (frame: the LEADERS board, 2026). A white
// board under an arched LEADERS sign: a PRIOR column (the score before this round), the player's surname, then one column per hole with
// the player's score to par after that hole, red under par and green at or over par, with the HOLE and PAR rows on top. The board's
// TRACK and FAV columns and any sponsor are not drawn; the tournament's logo stands at the top left when its address is known.
import { el, eventLogo } from '../kit.js';

const ROWH = 54, HEAD = 128, NAME = 250, PRIOR = 72, HOLE = 41;
// the board is exactly as wide as its columns plus its padding and rim (it ran on 236 px past the last hole)
const W = PRIOR + NAME + 18 * HOLE + 10 + 16 + 8;

const parNum = (t) => (t == null || t === '' ? null : t === 'E' ? 0 : Number(t));

export default {
  id: 'golf-handboard-26',
  size: { w: W, h: HEAD + 12 * ROWH + 20 },
  fonts: [{ family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', desc: { weight: '700' } }],
  css: `
.sb-golf-handboard-26 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #1a1a1a; }
.sb-golf-handboard-26 .sign { position: absolute; left: 0; right: 0; top: 0; height: ${HEAD - 8}px; background: #f7f6f2; border-radius: 50% 50% 0 0 / 60px 60px 0 0;
  border: 4px solid #d9d6cc; border-bottom: none; display: grid; place-items: end center; padding-bottom: 6px; box-sizing: border-box; }
.sb-golf-handboard-26 .sign span { font-size: 78px; letter-spacing: 6px; color: #23262b; line-height: 1; }
.sb-golf-handboard-26 .board { position: absolute; left: 0; right: 0; top: ${HEAD - 8}px; background: #ebe8df; border: 4px solid #d9d6cc; box-sizing: border-box; padding: 6px 8px; }
.sb-golf-handboard-26 .r { display: grid; grid-template-columns: ${PRIOR}px ${NAME}px repeat(9, ${HOLE}px) 10px repeat(9, ${HOLE}px); height: ${ROWH}px; align-items: center; gap: 0; }
.sb-golf-handboard-26 .r > * { height: ${ROWH - 8}px; display: grid; place-items: center; background: #fbfaf7; border: 1px solid #cfccc3; box-sizing: border-box; font-size: 34px; }
.sb-golf-handboard-26 .r > .gap { background: #1a1a1a; border: none; margin: 0 3px; height: ${ROWH}px; }   /* a black rule between the front and back nine, as on the board */
.sb-golf-handboard-26 .r > .nm { justify-items: start; padding-left: 14px; font-size: 32px; letter-spacing: 1px; margin: 0 6px; }
.sb-golf-handboard-26 .head > * { font-size: 36px; } .sb-golf-handboard-26 .head > .nm { justify-items: center; font-size: 40px; letter-spacing: 6px; }
.sb-golf-handboard-26 .head .pr { position: relative; overflow: visible; }
.sb-golf-handboard-26 .head .pr b { position: absolute; left: -1px; right: -1px; top: -1px; height: ${2 * ROWH - 6}px; z-index: 1; display: grid; place-items: center; background: #fbfaf7; border: 1px solid #cfccc3; box-sizing: border-box;
  font-size: 15px; line-height: .9; color: #1a1a1a; writing-mode: vertical-rl; text-orientation: upright; letter-spacing: -1px; }   /* PRIOR on end across both header rows, as on the board */   /* PRIOR on end, as on air */
.sb-golf-handboard-26 .r.grp { border-top: 4px solid #1a1a1a; margin-top: 2px; }   /* thick black rules after the leader, then every three rows, as on the board */
.sb-golf-handboard-26 .head .pr2 { visibility: hidden; }   /* PRIOR spans both header rows, as on the board */
.sb-golf-handboard-26 .u { color: #c8102e; } .sb-golf-handboard-26 .o { color: #0b7a3e; }
.sb-golf-handboard-26 .me > .nm { background: #fff5c2; }
.sb-golf-handboard-26 .sep { height: 6px; }
`,
  draw(root, g, { opts }) {
    const sign = el('div', 'sign'); sign.appendChild(el('span', '', 'LEADERS')); root.appendChild(sign);
    const lg = eventLogo(g, 84, opts);
    // the tournament's logo sits inside the arch (not over its curved corner), clear of the sign's edge
    if (lg) { lg.style.position = 'absolute'; lg.style.left = '70px'; lg.style.top = '34px'; lg.style.maxWidth = '170px'; root.appendChild(lg); }
    const board = el('div', 'board');
    const cell = (text, cls) => el('span', cls || '', text == null ? '' : String(text));
    const holesRow = (label, values, cls) => {
      const r = el('div', 'r head');
      r.append(cell('', cls ? 'pr' : ''), cell(label, 'nm'));
      for (let i = 0; i < 18; i++) { if (i === 9) r.appendChild(el('span', 'gap')); r.appendChild(cell(values[i])); }
      return r;
    };
    const top = holesRow('HOLE', Array.from({ length: 18 }, (_, i) => i + 1), true);
    top.firstChild.appendChild(el('b', '', 'PRIOR'));
    const parRow = holesRow('PAR', g.par || []); parRow.firstChild.classList.add('pr2');
    board.append(top, parRow);
    const tone = (n) => (n == null ? '' : n < 0 ? 'u' : 'o');
    const row = (p, me) => {
      const r = el('div', 'r' + (me ? ' me' : ''));
      const prior = parNum(p.prior);
      r.append(cell(prior == null ? '' : Math.abs(prior), tone(prior)), cell(String(p.short || '').slice(0, 14), 'nm'));
      // the score to par after each hole of this round, carried on from the prior total
      let run = prior || 0;
      for (let i = 0; i < 18; i++) {
        if (i === 9) r.appendChild(el('span', 'gap'));
        const s = (p.strokes || [])[i], par = (p.hole_par || [])[i];
        if (s == null || par == null) { r.appendChild(cell('')); continue; }
        run += s - par;
        r.appendChild(cell(Math.abs(run), tone(run)));
      }
      return r;
    };
    const rows = (g.rows || []).slice(0, 10);
    rows.forEach((p, i) => { const r = row(p, g.player && g.player.id === p.id); if (i === 1 || i === 4 || i === 7) r.classList.add('grp'); board.appendChild(r); });
    if (g.player && !rows.some((p) => p.id === g.player.id)) { board.appendChild(el('div', 'sep')); board.appendChild(row(g.player, true)); }
    root.appendChild(board);
  },
};
