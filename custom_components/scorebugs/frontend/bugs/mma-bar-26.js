// "Fight bar '26": a plain fight bug for MMA. NOT a copy of a broadcast: no clean frame of a current MMA bug was found yet, so this is a
// simple layout (each fighter's flag, name and record either side of the round and clock, the weight class above) until one is.
import { el, logo, statusText } from '../kit.js';

const W = 860, H = 120;  // narrower

export default {
  id: 'mma-bar-26',
  size: { w: W, h: H },
  fonts: [{ family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', desc: { weight: '700' } }],
  css: `
.sb-mma-bar-26 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-mma-bar-26 .wc { position: absolute; left: 50%; transform: translateX(-50%); top: 0; height: 34px; padding: 0 20px; background: #b3141c; display: grid; place-items: center; font-size: 22px; letter-spacing: 2px; }
.sb-mma-bar-26 .bar { position: absolute; left: 0; right: 0; top: 34px; height: 76px; background: linear-gradient(#22242a, #0f1013); display: grid; grid-template-columns: minmax(0, 1fr) 210px minmax(0, 1fr); align-items: center; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mma-bar-26 .f { display: flex; align-items: center; gap: 14px; padding: 0 18px; } .sb-mma-bar-26 .f.h { flex-direction: row-reverse; text-align: right; }
.sb-mma-bar-26 .f .sb-logo { width: 46px; height: 32px; object-fit: cover; }
.sb-mma-bar-26 .f .nm { font-size: 34px; letter-spacing: .5px; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; } .sb-mma-bar-26 .f { min-width: 0; overflow: hidden; } .sb-mma-bar-26 .f .rc { font-size: 22px; color: #b9bcc2; }
.sb-mma-bar-26 .f.win .nm { color: #f2c94c; }
.sb-mma-bar-26 .mid { display: grid; justify-items: center; background: #b3141c; height: 100%; align-content: center; font-size: 26px; }
.sb-mma-bar-26 .mid b { font-size: 34px; }
`,
  draw(root, g, { time }) {
    if (g.note) root.appendChild(el('div', 'wc', String(g.note).toUpperCase()));
    const bar = el('div', 'bar');
    const side = (t, k) => {
      const f = el('div', 'f ' + k + (g.status === 'final' && t.winner ? ' win' : ''));
      const tx = el('div', ''); tx.append(el('div', 'nm', (t.abbr || '').toUpperCase()), el('div', 'rc', t.record || ''));
      f.append(logo(t, 46), tx);
      return f;
    };
    const mid = el('div', 'mid');
    if (g.status === 'live') mid.append(el('span', '', 'ROUND ' + (g.period.label || '')), el('b', '', g.fightClock || g.clock || ''));
    else mid.appendChild(el('span', '', g.status === 'final' ? 'FINAL' : statusText(g, time)));
    bar.append(side(g.away, 'a'), mid, side(g.home, 'h'));
    root.appendChild(bar);
  },
};
