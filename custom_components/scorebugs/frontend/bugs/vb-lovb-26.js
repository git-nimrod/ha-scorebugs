// "Pill board '26": after LOVB Pro's volleyball board of 2026 (frame: retro catalogue vb-lovb-2, LOVB Nebraska v LOVB Austin, 720p).
// Top left, one row per team: a fully rounded pill in the team's colour with the short code in dark letters (a small dark dot inside its
// left end for the team serving), then a dark see-through strip with each finished set's points in white, the winner of each set
// underlined in yellow-green, and the set being played in a navy circle at the right end.
// Measured: pill 147 x 56, rows 80 apart; set strip 56 tall reaching 180 past the pill's middle;
// figures cap 0.36 of the row, code cap 0.48; set columns 49 apart; circle 52; underline 33 x 3, #c8d84a; dot 18 navy #1c2540.
// before the
// match each team's record sits in its own row's strip, and the start time (or FINAL after the match) goes in a note pill under the
// rows, the way the broadcast shows its notes.
import { el, statusText, teamColor, FONTS, fit } from '../kit.js';

const ROW = 56, STEP = 80, PILL = 147, COL = 49, CIRC = 52, NOTE = 34, GAP = 10;

const ink = (c) => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c || '');
  if (!m) return '#0d0e12';
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.18 ? '#0d0e12' : '#ffffff';
};

export default {
  id: 'vb-lovb-26',
  size: { w: PILL + 6 * COL + CIRC, h: STEP + ROW + GAP + NOTE },
  sizeFor: (g) => {
    const n = g.status === 'pre' ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 0);
    const pre = g.status === 'pre', rec = pre && (g.away.record || g.home.record);
    return { w: Math.max(PILL + (n ? 26 + Math.max(0, n - 1) * COL + CIRC + 6 : rec ? 150 : 0), g.status === 'live' ? 0 : 300), h: STEP + ROW + (g.status === 'live' ? 0 : GAP + NOTE) };
  },
  fonts: [FONTS.figtree],
  css: `
.sb-vb-lovb-26 { font-family: 'SB Figtree', 'Trebuchet MS', sans-serif; font-weight: 600; color: #fff; }
.sb-vb-lovb-26 .rw { position: absolute; left: 0; height: ${ROW}px; }
.sb-vb-lovb-26 .ss { position: absolute; left: ${PILL / 2}px; top: 0; height: ${ROW}px; display: flex; align-items: center; box-sizing: border-box; padding-left: ${PILL / 2 + 18}px; border-radius: 0 ${ROW / 2}px ${ROW / 2}px 0; background: rgba(38,40,38,.82); }
.sb-vb-lovb-26 .ss span { width: ${COL}px; text-align: center; font-size: 30px; font-weight: 500; line-height: 1; position: relative; }
.sb-vb-lovb-26 .ss span.won::after { content: ''; position: absolute; left: 8px; right: 8px; bottom: -6px; height: 3px; background: #c8d84a; }
.sb-vb-lovb-26 .ss span.cur { width: ${CIRC}px; height: ${CIRC}px; margin: 0 2px; border-radius: 50%; background: #1c2540; display: grid; place-items: center; }
.sb-vb-lovb-26 .ss span.tx { width: auto; padding: 0 22px 0 4px; font-size: 26px; white-space: nowrap; }
.sb-vb-lovb-26 .pl { position: absolute; left: 0; top: 0; width: ${PILL}px; height: ${ROW}px; border-radius: ${ROW / 2}px; display: grid; place-items: center; font-size: 39px; font-weight: 600; line-height: 1; letter-spacing: .01em; white-space: nowrap; overflow: hidden; }
.sb-vb-lovb-26 .nt { position: absolute; left: 4px; top: ${STEP + ROW + GAP}px; height: ${NOTE}px; max-width: 290px; box-sizing: border-box; padding: 0 16px; border-radius: ${NOTE / 2}px; background: #1c2540; display: flex; align-items: center; font-size: 22px; font-weight: 700; line-height: 1; white-space: nowrap; overflow: hidden; }
/* the serving dot gets its own room, so a long code never runs into it */
.sb-vb-lovb-26 .pl.sv { box-sizing: border-box; padding: 0 8px 0 32px; font-size: 34px; }
.sb-vb-lovb-26 .pl > span { max-width: 100%; }
.sb-vb-lovb-26 .pl i { position: absolute; left: 8px; top: 19px; width: 18px; height: 18px; border-radius: 50%; background: #1c2540; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', n = g.status === 'pre' ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 0);
    [g.away, g.home].forEach((t, i) => {
      const o = i ? g.away : g.home, rw = el('div', 'rw'); rw.style.top = (i * STEP) + 'px';
      const ss = el('div', 'ss');
      for (let k = 0; k < n; k++) {
        const v = (t.sets || [])[k], w = (o.sets || [])[k], cur = live && k === n - 1;
        ss.appendChild(el('span', cur ? 'cur' : v != null && w != null && v > w ? 'won' : '', v != null ? String(v) : ''));
      }
      // before the match each team's record on its own row (the start time goes in the note pill below)
      if (g.status === 'pre' && t.record) ss.appendChild(el('span', 'tx', t.record));
      if (ss.childNodes.length && (n || !live)) rw.appendChild(ss);
      const c = teamColor(t, '#5a5f68');
      // the pill takes the team's own first colour when it has one (bright green and lilac on air), letters dark or white to suit it
      const col = /^#[0-9a-f]{6}$/i.test(t.color || '') ? t.color : c;
      const pl = el('div', 'pl'); pl.style.background = col; pl.style.color = ink(col);
      if (live && t.hasBall) { pl.classList.add('sv'); pl.appendChild(el('i')); }
      pl.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      rw.appendChild(pl);
      root.appendChild(rw);
    });
    // the note pill under the rows: the start time before the match, FINAL after it
    if (!live) { const nt = el('div', 'nt'); nt.appendChild(fit(el('span', '', g.status === 'final' ? 'FINAL' : statusText(g, time)))); root.appendChild(nt); }
  },
};
