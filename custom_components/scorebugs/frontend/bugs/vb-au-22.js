// "Pro bar '22": after the Athletes Unlimited volleyball bar of 2022 (frames: retro catalogue vb-au-1 and -2, 720p). One flat bar: a
// near-black tile at the left (the league's round mark on air: the Home Assistant mark here), then each team's panel in its colour with
// the name in thin and bold capitals ("TEAM" thin, the captain's name bold on air; rank thin, school bold here) and two timeout dashes
// under it, its points in a deeper shade of its colour, and the set ("SET 1 OF 3") white on near black at the right. A small white
// arrow before the score of the team serving.
// Measured: bar 1265 x 58; mark tile 75, panels 390 / 390, score cells 87 / 87, set box 236; names
// cap 0.4 of the bar set high, figures 0.6, set 0.42; dashes 30 x 3 at 0.86 down. Flat colour, no gloss.
import { el, statusText, teamPair, panelInk, alikeColors, contrast, FONTS, fit, scoreSlot, relight, haMark, marks } from '../kit.js';

const W = 1265, H = 58;

export default {
  id: 'vb-au-22',
  size: { w: W, h: H },
  fonts: [FONTS.roboto],
  css: `
.sb-vb-au-22 { font-family: 'SB Roboto', Arial, sans-serif; color: #fff; }
.sb-vb-au-22 .bar { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; display: flex; }
.sb-vb-au-22 .bar > * { flex: none; height: ${H}px; display: flex; align-items: center; position: relative; white-space: nowrap; overflow: hidden; line-height: 1; }
.sb-vb-au-22 .mk { width: 75px; justify-content: center; background: #2b2c30; color: #fff; }
.sb-vb-au-22 .tm { width: 390px; box-sizing: border-box; padding: 0 16px 12px 22px; gap: 8px; }
.sb-vb-au-22 .tm .rk { font-weight: 300; font-size: 33px; flex: none; }
.sb-vb-au-22 .tm .nm { font-weight: 700; font-size: 33px; min-width: 0; overflow: hidden; flex: 1; }
.sb-vb-au-22 .tm .sv { flex: none; font-size: 18px; margin-left: auto; position: relative; top: 6px; }
.sb-vb-au-22 .tm .to { position: absolute; left: 22px; bottom: 8px; display: flex; gap: 10px; }
.sb-vb-au-22 .tm .to i { width: 45px; height: 3px; background: currentColor; }
.sb-vb-au-22 .tm .to i.used { opacity: .3; }
.sb-vb-au-22 .sc { width: 87px; justify-content: center; font-weight: 700; font-size: 50px; }
.sb-vb-au-22 .sc .sb-num { min-width: 0 !important; }
.sb-vb-au-22 .st { flex: 1 !important; justify-content: center; background: #1c1d20; font-weight: 500; font-size: 34px; padding: 0 10px; }
`,
  draw(root, g, { time, opts }) {
    const bar = el('div', 'bar'), live = g.status === 'live';
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(40));
    bar.appendChild(mk);
    const pts = (t) => (live ? ((t.sets || []).length ? t.sets[t.sets.length - 1] : t.score) : g.status === 'final' ? t.score : null);
    // the team's own first colour as it is (gold stays gold on air, with white letters); teamPair keeps the two apart
    const own = (t, c) => (/^#[0-9a-f]{6}$/i.test(t.color || '') && !/^#(d3d3d3|a9a9a9)$/i.test(t.color) ? t.color : c);
    const tp = teamPair(g.away, g.home, '#4a4f57'), cs = [own(g.away, tp[0]), own(g.home, tp[1])];
    if (alikeColors(cs[0], cs[1])) cs[1] = tp[1];
    [[g.away, cs[0]], [g.home, cs[1]]].forEach(([t, c]) => {
      const ink = contrast('#ffffff', c) >= 2.2 ? '#fff' : panelInk(t, c);
      // lit from the left and the foot on air (measured: L +6 at the left end to -6 at the right)
      const tm = el('div', 'tm'); tm.style.background = 'linear-gradient(to top, rgba(255,255,255,.26), rgba(255,255,255,.1) 38%, rgba(255,255,255,0) 56%), linear-gradient(90deg, ' + relight(c, 1) + ', ' + c + ' 55%, ' + relight(c, -1) + ')'; tm.style.color = ink;
      if (t.rank && t.rank <= 25) tm.appendChild(el('span', 'rk', String(t.rank)));
      tm.appendChild(fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase()));
      if (live && t.hasBall) tm.appendChild(el('span', 'sv', '▶'));
      if (live && t.timeouts != null) {
        const to = el('span', 'to');
        for (let k = 0; k < 2; k++) to.appendChild(el('i', k >= t.timeouts ? 'used' : ''));
        tm.appendChild(to);
      }
      const v = pts(t), sc = el('div', 'sc'); sc.style.background = relight(c, -9); sc.style.color = ink;
      sc.appendChild(scoreSlot(el('span', '', v != null ? String(v) : ''), g));
      bar.append(tm, sc);
    });
    const st = live ? 'SET ' + (g.period.label || '1') + ' OF 5' : g.status === 'final' ? 'FINAL' : statusText(g, time);
    bar.appendChild(fit(el('div', 'st', st)));
    root.appendChild(bar);
  },
};
