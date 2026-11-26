// "Scorecard bar '23": after a US golf channel's women's tour coverage of 2021-2024 (frame: the 2023 season finale, final round; retro
// catalogue golf-lpga-23-2, a 480p upload). Low on the picture a long blue scorecard bar for one player: the name in white bold
// capitals on a mid blue band, under it the holes with their par in small type and the nine-hole par, and under that the player's
// strokes on dark teal, birdies in white rings, bogeys on pale squares, each nine's total on a pale box; at the right end the score to
// par in white on a bright blue box over the round's par. Beside it, top right of the bar, a small board: the event's name in a serif
// on white, the round in white on navy, and the first four with the position, surname, score on a white box and the holes played.
// Measured on the 480p still: bar 626 x 88 px: name band #086494 (flat) 28 px, hole row #144460 26 px,
// stroke row #102e3b 32 px; columns 26 px, each nine's total box 40 px (#a9c1c7, a dark line at its top); score box #009dd7 68 x 42 px
// over a #e8ecf0 par box; board 140 x 107 px, title #f0f0f0, rows #12385a, score boxes #e6e8ea with dark figures.
// The followed player's card (the leader's without one). Two circles for an eagle and two squares for a double bogey, as the
// card in Leaderboard and card '25 does.
// : the type is bigger on air: the name's capitals
// 0.52 of its band (were 0.44), hole numbers 25 px on a 65 px row (were 17), strokes 30 px (were 26), the nine totals 37 px in a
// regular weight dark grey; a bogey is a grey-blue square (#5a8299; on air lit a little at the top: #6b93ad to #52788c) with a white figure, not a pale
// one; the name band lit from the left (#056797 at the left end to #104d6e at the right, sample.py 5x3 grid);
// the round's par sits on bright blue #005390 (lit at the top), not navy.
import { el, fit, FONTS } from '../kit.js';

const S = 2.5, COL = 26 * S, TOT = 40 * S, BOX = 68 * S, NAMEH = 28 * S, HOLEH = 26 * S, STRH = 32 * S;
const BAR = 9 * COL * 2 + 2 * TOT + 8 * S + BOX, BOARD = 140 * S, GAP = 15 * S;
const H = NAMEH + HOLEH + STRH;
const sum = (a) => a.reduce((x, y) => x + (y || 0), 0);

// the surname as boards print it: "Davis Love III" -> LOVE III (the feed's short form is the last word alone)
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const sur = (p, keep = true) => { const w = String(p.name || '').trim().split(/\s+/); const s = String(p.short || '');
  if (w.length > 2 && SUF.test(w[w.length - 1])) return (w[w.length - 2] + (keep ? ' ' + w[w.length - 1].replace(/\.$/, '') : '')).toUpperCase();
  return (s || w[w.length - 1] || '').toUpperCase(); };

export default {
  id: 'golf-gc-23',
  size: { w: BAR + GAP + BOARD, h: Math.max(H, 108 * S) },
  fonts: [FONTS.montserrat, FONTS.playfair],
  css: `
.sb-golf-gc-23 { font-family: 'SB Montserrat', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-golf-gc-23 .bar { position: absolute; left: 0; top: ${108 * S - H}px; width: ${BAR}px; height: ${H}px; }
.sb-golf-gc-23 .nmb { position: absolute; left: 0; right: ${BOX}px; top: 0; height: ${NAMEH}px; background: linear-gradient(rgba(255,255,255,.04), rgba(0,0,0,.06)), linear-gradient(90deg, #056797, #0b6190 30%, #165b85 50%, #14557a 70%, #104d6e); display: grid; align-items: center; padding-left: ${10 * S}px; font-size: ${22.5 * S}px; font-weight: 600; letter-spacing: ${0.3 * S}px; white-space: nowrap; overflow: hidden; }
.sb-golf-gc-23 .hr, .sb-golf-gc-23 .sr { position: absolute; left: 0; right: ${BOX}px; display: grid; grid-template-columns: repeat(9, ${COL}px) ${TOT}px ${4 * S}px repeat(9, ${COL}px) ${TOT}px; align-items: center; justify-items: center; padding-left: ${2 * S}px; }
.sb-golf-gc-23 .hr { top: ${NAMEH}px; height: ${HOLEH}px; background: #144460; border-top: ${S}px solid rgba(255,255,255,.18); }
.sb-golf-gc-23 .hr span { display: grid; justify-items: center; line-height: 1.05; font-size: ${11.5 * S}px; font-weight: 500; }
.sb-golf-gc-23 .hr span small { font-size: ${6.5 * S}px; font-weight: 500; color: #c8d9e6; line-height: 1; }
.sb-golf-gc-23 .hr .t { align-self: end; font-size: ${9 * S}px; font-weight: 700; padding-bottom: ${S}px; }
.sb-golf-gc-23 .sr { top: ${NAMEH + HOLEH}px; height: ${STRH}px; background: linear-gradient(#123441, #102e3b 50%, #0e2a36); }
.sb-golf-gc-23 .sr span { width: ${21 * S}px; height: ${21 * S}px; display: grid; place-items: center; box-sizing: border-box; font-size: ${14 * S}px; font-weight: 600; }
.sb-golf-gc-23 .sr .b { border: ${1.2 * S}px solid #fff; border-radius: 50%; }
.sb-golf-gc-23 .sr .e { border: ${1.2 * S}px solid #fff; border-radius: 50%; box-shadow: 0 0 0 ${1.2 * S}px #102e3b, 0 0 0 ${2.4 * S}px #fff; }
.sb-golf-gc-23 .sr .k { background: #5a8299; color: #fff; }
.sb-golf-gc-23 .sr .k2 { background: #5a8299; color: #fff; box-shadow: 0 0 0 ${S}px #102e3b, 0 0 0 ${2 * S}px #8fb6cf; }
.sb-golf-gc-23 .sr .t { width: ${TOT}px; height: ${STRH}px; background: linear-gradient(#7d969c, #a9c1c7 8%, #b6cdd2 45%, #a1b9bf); color: #3a4650; font-size: ${15.5 * S}px; font-weight: 500; }
.sb-golf-gc-23 .sc { position: absolute; right: 0; top: 0; width: ${BOX}px; height: ${NAMEH + 14 * S}px; display: grid; place-items: center; background: #009dd7; font-size: ${25 * S}px; }
.sb-golf-gc-23 .pr { position: absolute; right: 0; top: ${NAMEH + 14 * S}px; width: ${BOX}px; height: ${HOLEH - 14 * S}px; display: grid; place-items: center; background: linear-gradient(#0066a2, #00549b 40%, #00528b); font-size: ${8.5 * S}px; }
.sb-golf-gc-23 .rt { position: absolute; right: 0; top: ${NAMEH + HOLEH}px; width: ${BOX}px; height: ${STRH}px; display: grid; place-items: center; background: linear-gradient(#f4f6f8, #e8ecf0 70%, #c9cfd5); color: #10222c; font-size: ${13 * S}px; }
.sb-golf-gc-23 .bd { position: absolute; right: 0; top: 0; width: ${BOARD}px; height: ${108 * S}px; background: #12385a; box-shadow: 0 ${S}px ${3 * S}px rgba(0,0,0,.35); }
.sb-golf-gc-23 .bd .ti { height: ${30 * S}px; display: grid; place-items: center; text-align: center; background: #f0f0f0; color: #1b2430; font-family: 'SB Playfair', Georgia, serif; font-size: ${8.5 * S}px; line-height: 1.1; padding: 0 ${4 * S}px; }
.sb-golf-gc-23 .bd .rd { height: ${13 * S}px; display: grid; place-items: center; background: #0d2a45; font-family: 'SB Playfair', Georgia, serif; font-size: ${8 * S}px; border-bottom: ${S}px solid rgba(255,255,255,.25); }
.sb-golf-gc-23 .bd .r { height: ${15.5 * S}px; display: grid; grid-template-columns: ${12 * S}px 1fr ${22 * S}px ${18 * S}px; align-items: center; font-size: ${8.5 * S}px; font-weight: 600; }
.sb-golf-gc-23 .bd .r .p { text-align: center; } .sb-golf-gc-23 .bd .r .n { min-width: 0; overflow: hidden; white-space: nowrap; }
.sb-golf-gc-23 .bd .r .s { background: #e6e8ea; color: #12222e; text-align: center; height: ${11 * S}px; line-height: ${11 * S}px; font-weight: 700; }
.sb-golf-gc-23 .bd .r .t { text-align: center; }
`,
  draw(root, g) {
    const p = g.player || (g.rows || [])[0];
    const bar = el('div', 'bar');
    if (p) {
      bar.appendChild(fit(el('div', 'nmb', String(p.name || p.short || '').toUpperCase()), String(p.short || '').toUpperCase()));
      const par = g.par && g.par.length === 18 ? g.par : (p.hole_par || []);
      const hr = el('div', 'hr'), sr = el('div', 'sr');
      for (const half of [0, 9]) {
        for (let i = half; i < half + 9; i++) {
          const h = el('span', '', String(i + 1)); h.appendChild(el('small', '', par[i] != null ? String(par[i]) : '')); hr.appendChild(h);
          const s = (p.strokes || [])[i], hp = (p.hole_par || [])[i];
          const d = s != null && hp != null ? s - hp : null;
          sr.appendChild(el('span', d == null ? '' : d <= -2 ? 'e' : d === -1 ? 'b' : d === 1 ? 'k' : d >= 2 ? 'k2' : '', s == null ? '' : String(s)));
        }
        const nine = par.slice(half, half + 9);
        hr.appendChild(el('span', 't', nine.length === 9 && nine.every((x) => x != null) ? String(sum(nine)) : ''));
        const st = (p.strokes || []).slice(half, half + 9);
        // a nine's total once all of it is played
        sr.appendChild(el('span', 't', st.length === 9 && st.every((x) => x != null) ? String(sum(st)) : ''));
        if (half === 0) { hr.appendChild(el('i')); sr.appendChild(el('i')); }
      }
      const done = (p.strokes || []).filter((x) => x != null);
      bar.append(hr, sr, el('div', 'sc', g.status === 'pre' ? '' : p.score || ''), el('div', 'pr', par.length === 18 ? String(sum(par)) : ''),
        el('div', 'rt', done.length >= 18 ? String(sum(done)) : ''));
    }
    root.appendChild(bar);
    const bd = el('div', 'bd');
    bd.appendChild(fit(el('div', 'ti', String(g.event || '').replace(/\s+presented by .*$/i, ''))));
    const rd = g.roundNo || 1;
    bd.appendChild(el('div', 'rd', g.status === 'final' && rd >= 4 ? 'Final' : rd >= 4 ? 'Final Round' : 'Round ' + rd));
    (g.rows || []).slice(0, 4).forEach((r) => {
      const thru = r.thru === 'F' || Number(r.thru) >= 18 ? 'F' : r.thru ? String(r.thru) : '';
      const row = el('div', 'r');
      row.append(el('span', 'p', String(r.place || r.pos || '')), fit(el('span', 'n', sur(r))), el('span', 's', r.score || ''), el('span', 't', g.status === 'pre' ? '' : thru));
      bd.appendChild(row);
    });
    root.appendChild(bd);
  },
};
