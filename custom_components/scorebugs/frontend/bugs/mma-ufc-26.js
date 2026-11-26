// "Fight strip '26": after the UFC's fight strip on Paramount+ of 2026 (frame: retro catalogue mma-ufc-26-2, Strickland v Hernandez). The
// same strip as the ESPN era's (mma-ufc-22, drawn the same way here) with grey rank squares and a grey round box in place of the gold:
// each fighter's rank and spaced surname at the ends, a near-black middle with the league's logo (UFC's, from ESPN), the clock, the round
// box and thin bars for the rounds to come, a tall bar of each fighter's colour either side of it, the bout in a dark tab under it.
// Measured: strip 986 x 57; middle 355 (logo 85, clock cap 0.46 of the strip, round box 40 x 24 #9c9d9f,
// round bars 3 x 20, 7 apart); colour bars 15 x 40; rank squares 20; names cap 0.35, spaced.1 em; tab 355 x 33, 8 under the strip.
// Strip and tab at 92 / 94 % (were 80 / 85 %).
// The colour bars are each fighter's flag colour on air; the feed gives no colour per fighter, so the red and blue corners stand in.
import { el, leagueLogo, marks, statusText, FONTS, fit } from '../kit.js';

const W = 986, H = 57, MID = 355, TAB = 33;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);

/** The strip, with the accent of its year: 'gold' (2022) or 'grey' (2026). */
function fightStrip(id, accent) {
  const box = accent === 'gold' ? 'background: #c9ad45; color: #121212;' : 'background: #9c9d9f; color: #121212;';
  const S = '.sb-' + id;
  return {
    id,
    size: { w: W, h: H + 8 + TAB },
    sizeFor: (g) => ({ w: W, h: H + (g.note ? 8 + TAB : 0) }),
    fonts: [FONTS.roboto],
    css: `
${S} { font-family: 'SB Roboto', Arial, sans-serif; color: #fff; }
${S} .st { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; display: flex; align-items: center; background: rgba(38,40,44,.92); box-shadow: inset 0 1px 0 rgba(255,255,255,.12); }
${S} .f { flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 14px; padding: 0 22px 0 48px; box-sizing: border-box; }
${S} .f.h { padding: 0 22px 0 40px; }
${S} .f .rk { flex: none; width: 20px; height: 20px; display: grid; place-items: center; font-size: 15px; font-weight: 600; ${box} }
${S} .f .nm { min-width: 0; font-size: 28px; font-weight: 400; letter-spacing: .1em; white-space: nowrap; overflow: hidden; line-height: 1.35; }
${S} .f.lost .nm { opacity: .5; }
${S} .cb { flex: none; width: 15px; height: 40px; }
${S} .md { flex: none; width: ${MID - 30}px; height: 100%; display: flex; align-items: center; justify-content: center; gap: 16px; background: #111214; }
${S} .md .sb-league { width: 85px; height: 85px; margin: -26px 0; object-fit: contain; }
${S} .md .ck { font-size: 38px; font-weight: 500; letter-spacing: .04em; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; }
${S} .md .ck.tx { font-size: 26px; letter-spacing: .02em; }
${S} .md .rd { display: flex; align-items: center; gap: 7px; }
${S} .md .rd b { width: 40px; height: 24px; display: grid; place-items: center; font-size: 18px; font-weight: 500; ${box} }
${S} .md .rd i { width: 3px; height: 20px; background: #6c6e72; }
${S} .md .rd i.sep { background: #9c9d9f; margin-right: 3px; }
${S} .tb { position: absolute; left: ${(W - MID) / 2}px; top: ${H + 8}px; width: ${MID}px; height: ${TAB}px; padding: 0 10px; box-sizing: border-box; display: grid; place-items: center; background: rgba(38,40,44,.94); font-size: 15px; font-weight: 700; letter-spacing: .08em; white-space: nowrap; overflow: hidden; }
`,
    draw(root, g, { time, opts }) {
      const live = g.status === 'live', clock = g.fightClock || g.clock || '', n = rounds(g), r = Number(g.period.label) || 0;
      const decided = g.away.winner || g.home.winner;
      const st = el('div', 'st');
      const side = (t, home) => {
        const f = el('div', 'f' + (home ? ' h' : '') + (g.status === 'final' && decided && !t.winner ? ' lost' : ''));
        if (t.rank) f.appendChild(el('span', 'rk', String(t.rank)));
        const sur = String(t.name || t.abbr || '').trim().split(/\s+/).pop().toUpperCase();
        f.appendChild(fit(el('span', 'nm', sur)));
        return f;
      };
      const bar = (c) => { const b = el('span', 'cb'); b.style.background = c; return b; };
      const md = el('div', 'md');
      if (marks(opts).league) md.appendChild(leagueLogo(g, 34));
      if (live && clock) {
        md.appendChild(el('span', 'ck', clock));
        const rd = el('span', 'rd'); rd.appendChild(el('i', 'sep')); rd.appendChild(el('b', '', 'R' + (r || 1)));
        for (let k = r + 1; k <= n; k++) rd.appendChild(el('i'));
        md.appendChild(rd);
      } else md.appendChild(fit(el('span', 'ck tx', g.status === 'final' ? 'FINAL' + (r ? ' · R' + r : '') : statusText(g, time))));
      st.append(side(g.away, false), bar('#c8202c'), md, bar('#2457c8'), side(g.home, true));
      root.appendChild(st);
      if (g.note) root.appendChild(fit(el('div', 'tb', String(g.note).toUpperCase())));
    },
  };
}

export default fightStrip('mma-ufc-26', 'grey');
