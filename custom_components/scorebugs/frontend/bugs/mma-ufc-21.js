// "Round bars '21": after the UFC's fight strip on ABC / ESPN+ of 2021 (frame: retro catalogue mma-ufc-21-1, Holloway v Kattar). One dark
// see-through strip low in the middle: each fighter's rank in a small grey square and the name in white widely spaced capitals; a
// near-black middle with the league's logo (UFC's, from ESPN) and the fight clock, a small tick of each fighter's colour either side of
// it; under the middle a row of bars, one per round, the rounds fought lit white; the bout ("FEATHERWEIGHT MAIN EVENT") in a dark tab
// over the middle.
// Measured: strip 750 x 61; middle 250 (logo 95 x 34, clock cap 0.44 of the strip); ticks 7 x 15;
// rank squares 19; names cap 0.3, spaced.2 em; round bars 44 x 5, 8 apart, 9 under the strip; tab 400 x 22 over it. Strip
// mid grey see-through (L 40 at the top to 27 at the foot, about 84 %), middle dark grey #2a2c30; unlit round bars dark teal-grey.
import { el, leagueLogo, marks, statusText, FONTS, fit } from '../kit.js';

const W = 750, H = 61, MID = 250, HEAD = 24, BARS = 14;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);
const top = (g) => (g.note ? HEAD : 0);

export default {
  id: 'mma-ufc-21',
  size: { w: W, h: HEAD + H + BARS },
  sizeFor: (g) => ({ w: W, h: top(g) + H + (g.status === 'live' ? BARS : 0) }),
  fonts: [FONTS.roboto],
  css: `
.sb-mma-ufc-21 { font-family: 'SB Roboto', Arial, sans-serif; color: #fff; }
.sb-mma-ufc-21 .hd { position: absolute; left: ${(W - 400) / 2}px; top: 0; width: 400px; height: ${HEAD}px; display: grid; place-items: center; background: rgba(20,21,24,.9); font-size: 15px; font-weight: 700; letter-spacing: .1em; white-space: nowrap; overflow: hidden; }
.sb-mma-ufc-21 .st { position: absolute; left: 0; width: ${W}px; height: ${H}px; display: flex; align-items: center; background: linear-gradient(rgba(96,98,102,.84), rgba(74,76,80,.84) 45%, rgba(62,64,68,.86)); }
.sb-mma-ufc-21 .f { flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 0 14px; box-sizing: border-box; }
.sb-mma-ufc-21 .f .rk { flex: none; width: 19px; height: 19px; display: grid; place-items: center; background: #8d8f93; color: #18191b; font-size: 14px; font-weight: 700; }
.sb-mma-ufc-21 .f .nm { min-width: 0; font-size: 27px; font-weight: 500; font-stretch: 85%; letter-spacing: .2em; white-space: nowrap; overflow: hidden; line-height: 1.35; }
.sb-mma-ufc-21 .f.lost .nm { opacity: .5; }
.sb-mma-ufc-21 .tk { flex: none; width: 7px; height: 15px; }
.sb-mma-ufc-21 .md { flex: none; width: ${MID - 14}px; height: 100%; display: flex; align-items: center; justify-content: center; gap: 22px; background: linear-gradient(#303236, #232528); }
.sb-mma-ufc-21 .md .sb-league { width: 95px; height: 95px; margin: -30px 0; object-fit: contain; }
.sb-mma-ufc-21 .md .ck { font-size: 37px; font-weight: 400; letter-spacing: .05em; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sb-mma-ufc-21 .md .ck.tx { font-size: 24px; }
.sb-mma-ufc-21 .rb { position: absolute; left: ${(W - MID) / 2}px; width: ${MID}px; display: flex; justify-content: center; gap: 8px; }
.sb-mma-ufc-21 .rb i { width: 42px; height: 5px; background: rgba(40,62,70,.9); }
.sb-mma-ufc-21 .rb i.on { background: #f4f5f6; }
`,
  draw(root, g, { time, opts }) {
    const y = top(g), live = g.status === 'live', clock = g.fightClock || g.clock || '', n = rounds(g), r = Number(g.period.label) || 0;
    if (g.note) root.appendChild(fit(el('div', 'hd', String(g.note).toUpperCase())));
    const decided = g.away.winner || g.home.winner;
    const st = el('div', 'st'); st.style.top = y + 'px';
    const side = (t) => {
      const f = el('div', 'f' + (g.status === 'final' && decided && !t.winner ? ' lost' : ''));
      if (t.rank) f.appendChild(el('span', 'rk', String(t.rank)));
      f.appendChild(fit(el('span', 'nm', String(t.name || t.abbr || '').trim().split(/\s+/).pop().toUpperCase())));
      return f;
    };
    const tick = (c) => { const b = el('span', 'tk'); b.style.background = c; return b; };
    const md = el('div', 'md');
    if (marks(opts).league) md.appendChild(leagueLogo(g, 34));
    md.appendChild(live && clock ? el('span', 'ck', clock) : fit(el('span', 'ck tx', g.status === 'final' ? 'FINAL' + (r ? ' · R' + r : '') : statusText(g, time))));
    st.append(side(g.away), tick('#c8202c'), md, tick('#2457c8'), side(g.home));
    root.appendChild(st);
    if (live) {
      const rb = el('div', 'rb'); rb.style.top = (y + H + 9) + 'px';
      for (let k = 1; k <= Math.max(n, r); k++) rb.appendChild(el('i', k <= r ? 'on' : ''));
      root.appendChild(rb);
    }
  },
};
