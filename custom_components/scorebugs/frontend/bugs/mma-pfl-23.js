// "Corner box '23": after the PFL's fight bar on ESPN of 2023 (frame: retro catalogue mma-pfl-23-1, Harrison v Mokhnatkina, 720p). Low
// on the left: the weight class across the top in light grey capitals on a dark strip; under it a white tile with the promotion's logo on
// air (the league's logo from ESPN here), a dark cell with the fight clock and, under it, the rounds as small boxes (the current one
// yellow), and two name rows: the red corner's surname on a deep red bar, the blue corner's on near black, both in white condensed
// capitals. The strike-count panels to the right on air are left out: the feed has no strike data.
// Measured: 486 x 120; strip 30; logo tile 147 x 90; clock cell 99 x 44, round boxes 15 x 30, 3
// apart; name rows 240 x 44 and 42; names cap 0.45 of a row; red #8e1a2a at the left to #c0394a at the right.
import { el, leagueLogo, marks, statusText, FONTS, fit } from '../kit.js';

const W = 486, HEAD = 30, BODY = 90, LG = 147, CK = 99, NM = W - LG - CK;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);

export default {
  id: 'mma-pfl-23',
  size: { w: W, h: HEAD + BODY },
  fonts: [FONTS.barlowCond700, FONTS.barlowSemi700],
  css: `
.sb-mma-pfl-23 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-mma-pfl-23 .hd { position: absolute; left: 0; right: 0; top: 0; height: ${HEAD}px; padding: 0 10px 0 40px; display: grid; place-items: center start; background: rgba(16,17,19,.88); color: #d6d8da; font-size: 23px; font-weight: 600; letter-spacing: .02em; white-space: nowrap; overflow: hidden; }
.sb-mma-pfl-23 .bd { position: absolute; left: 0; top: ${HEAD}px; width: ${W}px; height: ${BODY}px; display: flex; box-shadow: 0 0 0 2px rgba(70,72,76,.9); background: #0d0e10; }
.sb-mma-pfl-23 .lg { width: ${LG}px; height: 100%; display: grid; place-items: center; background: linear-gradient(#ffffff, #eef0f2 60%, #d9dcdf); }
.sb-mma-pfl-23 .lg .sb-league { width: 110px; height: 110px; margin: -25px 0; object-fit: contain; }
.sb-mma-pfl-23 .ck { width: ${CK}px; display: flex; flex-direction: column; border-left: 2px solid #3a3c40; }
.sb-mma-pfl-23 .ck b { height: 46px; display: grid; place-items: center; font-family: 'SB Barlow Semi Condensed', sans-serif; font-size: 34px; line-height: 1; border-bottom: 2px solid #3a3c40; white-space: nowrap; overflow: hidden; }
.sb-mma-pfl-23 .ck b.tx { font-size: 22px; }
.sb-mma-pfl-23 .ck span { flex: 1; display: flex; align-items: center; justify-content: center; gap: 3px; }
.sb-mma-pfl-23 .ck span i { width: 15px; height: 30px; background: #55585d; }
.sb-mma-pfl-23 .ck span i.on { background: #f2cc1d; }
.sb-mma-pfl-23 .ck span i.done { background: #8a8d92; }
.sb-mma-pfl-23 .nms { width: ${NM}px; display: flex; flex-direction: column; border-left: 2px solid #3a3c40; }
.sb-mma-pfl-23 .nm { display: flex; align-items: center; box-sizing: border-box; padding: 0 12px 0 22px; font-size: 34px; font-weight: 600; letter-spacing: .02em; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-mma-pfl-23 .nm.r { height: 46px; background: linear-gradient(90deg, #8e1a2a, #a62837 50%, #c0394a); border-bottom: 2px solid #3a3c40; }
.sb-mma-pfl-23 .nm.b { flex: 1; background: #0d0e10; }
.sb-mma-pfl-23 .nm.lost { color: #9a9ca0; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', clock = g.fightClock || g.clock || '', n = rounds(g), r = Number(g.period.label) || 0;
    if (g.note) root.appendChild(fit(el('div', 'hd', String(g.note).toUpperCase())));
    const bd = el('div', 'bd'), lg = el('div', 'lg'); if (marks(opts).league) lg.appendChild(leagueLogo(g, 60));
    const ck = el('div', 'ck');
    ck.appendChild(live && clock ? el('b', '', clock) : fit(el('b', 'tx', g.status === 'final' ? 'FINAL' : statusText(g, time))));
    const pr = el('span');
    for (let k = 1; k <= Math.max(n, r); k++) pr.appendChild(el('i', live && k === r ? 'on' : r && k <= r ? 'done' : ''));
    ck.appendChild(pr);
    const nms = el('div', 'nms'), decided = g.away.winner || g.home.winner;
    [[g.away, 'r'], [g.home, 'b']].forEach(([t, k]) => {
      const sur = String(t.name || t.abbr || '').trim().split(/\s+/).pop().toUpperCase();
      const nm = el('div', 'nm ' + k + (g.status === 'final' && decided && !t.winner ? ' lost' : ''));
      nm.appendChild(fit(el('span', '', sur)));
      nms.appendChild(nm);
    });
    bd.append(lg, ck, nms);
    root.appendChild(bd);
  },
};
