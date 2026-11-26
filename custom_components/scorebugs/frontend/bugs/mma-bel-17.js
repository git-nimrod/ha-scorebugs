// "Teal clock '17": after Bellator's fight bug on Spike / Paramount of 2017 (frames: retro catalogue mma-bel-17-1 and -2, Silva v
// Sonnen). A near-black box with a thin teal rim low on the left: a strip at the top with the promotion's logo on air (the league's logo
// from ESPN here), a thin yellow-green line under it filling as the round runs, the round and the fight
// clock in very big white condensed figures; its bottom right corner cut away. Beside it two light mint tiles, one per fighter, each
// with a glove in the fighter's corner colour (red on top, blue below) and the surname in dark spaced capitals; the top tile a plain
// rectangle, the bottom tile's bottom right corner cut.
// Measured: box 157 x 190 (logo strip 22, corner cut 25 x 28), rim 2 #2fa79a; tiles 228 x 58 and 55, 3
// apart, starting 26 down, right end cut 20; clock cap 0.4 of the box, round cap 0.1; names cap 0.52 of a tile, spaced.12 em; tiles
// #e6f2f0 at the top to #a9c7c1 at the foot.
import { el, leagueLogo, marks, statusText, FONTS, fit } from '../kit.js';

const BOX = 157, H = 190, TILE = 228, T1 = 58, T2 = 55, TOP = 34;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);
const secs = (s) => { const m = /^(\d+):(\d\d)$/.exec(s || ''); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };

export default {
  id: 'mma-bel-17',
  size: { w: BOX + 2 + TILE, h: H },
  fonts: [FONTS.barlowCond700, FONTS.barlowSemi700],
  css: `
.sb-mma-bel-17 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-mma-bel-17 .bx { position: absolute; left: 0; top: 0; width: ${BOX}px; height: ${H}px; background: #2fa79a; clip-path: polygon(0 0, 100% 0, 100% ${H - 28}px, ${BOX - 25}px 100%, 0 100%); }
.sb-mma-bel-17 .in { position: absolute; inset: 2px; background: linear-gradient(#141a1a, #070909); clip-path: polygon(0 0, 100% 0, 100% ${H - 29}px, ${BOX - 26}px 100%, 0 100%); display: flex; flex-direction: column; align-items: center; }
.sb-mma-bel-17 .lg { width: 100%; height: 22px; background: #0d1111; border-bottom: 1px solid #2fa79a; display: grid; place-items: center; }
.sb-mma-bel-17 .lg .sb-league { width: 48px; height: 48px; margin: -14px 0; object-fit: contain; }
.sb-mma-bel-17 .pg { align-self: stretch; height: 4px; margin: 3px 4px 0; background: #26302f; }
.sb-mma-bel-17 .pg i { display: block; height: 100%; background: #b8d433; }
.sb-mma-bel-17 .rd { margin-top: 12px; font-size: 29px; line-height: 1; white-space: nowrap; }
.sb-mma-bel-17 .rd small { font-size: .6em; }
.sb-mma-bel-17 .ck { margin-top: 8px; font-size: 92px; line-height: .8; letter-spacing: -.01em; white-space: nowrap; max-width: ${BOX - 10}px; overflow: hidden; }
.sb-mma-bel-17 .ck.tx { font-size: 38px; line-height: 1; margin-top: 30px; }
.sb-mma-bel-17 .tl { position: absolute; left: ${BOX + 2}px; width: ${TILE}px; display: flex; align-items: center; gap: 12px; box-sizing: border-box; padding: 0 22px 0 8px; background: linear-gradient(#eef7f5, #d4e6e2 45%, #a9c7c1); color: #15191a; }
/* the top fighter's tile is a plain rectangle; the bottom one is the old shape upside down: its bottom right corner cut */
.sb-mma-bel-17 .tl.lo { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), ${TILE - 20}px 100%, 0 100%); }
.sb-mma-bel-17 .tl .nm { flex: 1; min-width: 0; font-size: 42px; letter-spacing: .12em; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-mma-bel-17 .tl.lost .nm { opacity: .5; }
.sb-mma-bel-17 .gv { flex: none; position: relative; width: 34px; height: 40px; }
.sb-mma-bel-17 .gv::before { content: ''; position: absolute; left: 2px; top: 0; width: 30px; height: 27px; border-radius: 14px 14px 8px 8px; background: var(--c); box-shadow: inset 0 3px 0 rgba(255,255,255,.35), inset 0 -4px 0 rgba(0,0,0,.25); }
.sb-mma-bel-17 .gv::after { content: ''; position: absolute; left: 6px; top: 27px; width: 22px; height: 12px; border-radius: 0 0 4px 4px; background: #15191a; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', clock = g.fightClock || g.clock || '', n = rounds(g);
    const bx = el('div', 'bx'), inn = el('div', 'in');
    const lg = el('div', 'lg'); if (marks(opts).league) lg.appendChild(leagueLogo(g, 18));
    // the line under the logo: how much of the round has run (5-minute rounds)
    const pg = el('div', 'pg'), s = secs(clock), fill = el('i'); fill.style.width = live && s != null ? Math.max(0, Math.min(100, 100 - s / 3)).toFixed(0) + '%' : '0';
    pg.appendChild(fill);
    const rd = el('div', 'rd');
    if (live || (g.status === 'final' && g.period.label)) { rd.append('ROUND ' + (g.period.label || '1') + ' ', el('small', '', 'OF'), ' ' + Math.max(n, Number(g.period.label) || 0)); } else rd.textContent = n + ' ROUNDS';
    const ck = live && clock ? el('div', 'ck', clock) : fit(el('div', 'ck tx', g.status === 'final' ? 'FINAL' : statusText(g, time)));
    inn.append(lg, pg, rd, ck); bx.appendChild(inn); root.appendChild(bx);
    [[g.away, '#c8202c', TOP, T1], [g.home, '#2457c8', TOP + T1 + 3, T2]].forEach(([t, c, y, h]) => {
      const tl = el('div', 'tl' + (y > TOP ? ' lo' : '') + (g.status === 'final' && !t.winner && (g.away.winner || g.home.winner) ? ' lost' : ''));
      tl.style.top = y + 'px'; tl.style.height = h + 'px';
      const gv = el('span', 'gv'); gv.style.setProperty('--c', c);
      const sur = String(t.name || t.abbr || '').trim().split(/\s+/).pop().toUpperCase();
      tl.append(gv, fit(el('span', 'nm', sur)));
      root.appendChild(tl);
    });
  },
};
