// "Set box (plain)": a plain volleyball score box. NOT a copy of a broadcast: no clean frame of a current college volleyball bug was found
// yet. Two rows, one per team, with the logo, the letters, the sets won in a box and each set's points in columns, the set being played
// picked out.
import { el, logo, statusText, teamColor, shade } from '../kit.js';

// loop pass (the critique's minor finding: "before the match the right half of the board is empty space"): no reference exists
// (a house look, not a broadcast), so this is the house "truncate" rule: before the match the board ends after the record, 380 px wide (was 720).
const W = 720, H = 166, ROW = 64, PRE_W = 380;  // (was 140: the start time and FINAL under the box were cut off at the foot)

export default {
  id: 'vb-sets-26',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: g.status === 'pre' ? PRE_W : W, h: H }),
  fonts: [{ family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', desc: { weight: '700' } }],
  css: `
.sb-vb-sets-26 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-vb-sets-26 .bx { position: absolute; left: 0; top: 0; width: ${W}px; height: ${2 * ROW + 4}px; background: #15181d; border-radius: 6px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-vb-sets-26 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: flex; align-items: center; }
.sb-vb-sets-26 .rw .sb-logo { width: 52px; height: 46px; object-fit: contain; margin: 0 12px; }
.sb-vb-sets-26 .rw .nm { flex: 1; font-size: 38px; letter-spacing: 1px; }
.sb-vb-sets-26 .rw .won { width: 64px; height: 100%; display: grid; place-items: center; font-size: 42px; }
.sb-vb-sets-26 .rw .ss { display: flex; height: 100%; } .sb-vb-sets-26 .rw .ss span { width: 54px; display: grid; place-items: center; font-size: 32px; color: #c9ccd1; }
.sb-vb-sets-26 .rw .ss span.rec { width: auto; padding: 0 18px; color: #fff; }
.sb-vb-sets-26 .rw .ss span.cur { background: #2e5fd1; color: #fff; }
.sb-vb-sets-26.sb-ink-dark .w { color: #16181b; text-shadow: none; }
.sb-vb-sets-26 .w { position: absolute; left: 0; right: 0; top: ${2 * ROW + 10}px; font-size: 22px; line-height: 1.1; text-align: center; }
`,
  draw(root, g, { time }) {
    const bx = el('div', 'bx'); if (g.status === 'pre') bx.style.width = PRE_W + 'px';
    // no set columns before the match (a feed can carry last match's points); each team's record stands there instead
    const n = g.status === 'pre' ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 0);
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#3a3f47');
      const rw = el('div', 'rw'); rw.style.top = (2 + i * ROW) + 'px';
      const won = el('span', 'won', g.status !== 'pre' && t.score != null ? String(t.score) : ''); won.style.background = shade(c, -0.1);
      const ss = el('span', 'ss');
      for (let k = 0; k < n; k++) ss.appendChild(el('span', g.status === 'live' && k === n - 1 ? 'cur' : '', (t.sets || [])[k] != null ? String(t.sets[k]) : ''));
      if (g.status === 'pre' && t.record) ss.appendChild(el('span', 'rec', t.record));
      rw.append(logo(t, 52), el('span', 'nm', (t.abbr || '').toUpperCase()), ss);
      if (g.status !== 'pre') rw.appendChild(won);   // no empty sets-won box before the match
      bx.appendChild(rw);
    });
    root.appendChild(bx);
    // another sport's game while it runs: its period and clock under the box (a volleyball match shows the set being played instead)
    if (g.status === 'live' && g.sport !== 'volleyball') root.appendChild(el('div', 'w', [(g.period.label || '') + (g.period.suffix || ''), g.clock || ''].filter(Boolean).join('  ')));
    if (g.status !== 'live') root.appendChild(el('div', 'w', g.status === 'final' ? 'FINAL' + (g.note ? ' · ' + String(g.note).toUpperCase() : '') : statusText(g, time)));
  },
};
