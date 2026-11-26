// "Light bar '23": after ESPN/ABC's college volleyball bar of 2023-25 (frames: retro catalogue vb-24-1, Penn State v Nebraska, 2024
// semifinal; the same bar in vb-23-1, Texas v Nebraska 2023, and vb-25-2, Texas A&M v Kentucky 2025). One light-grey bar along the foot
// of the picture: the away team's logo on its colour, its rank and name in plain letters with the current set's points big at the right
// of its panel; the home team's logo on white and its panel the same way; a status box at the right ("NEB LEADS 1-0 (BEST OF 5)",
// "SET 1 (BEST OF 5)") in narrow capitals. Each team's record in a see-through tab under the left end of its panel; the round in a dark
// tab over the bar when the match has one.
// Measured: bar 48 tall, 1152 wide; logo tiles 73 / 66, panels 349 / 350, status box 310; names cap 0.51
// of the bar, figures 0.64, status 0.51 (condensed); record tab 69 x 19. Panels a soft glass top to foot (sample.py: L 84 -> 72, horizon
// 60 %, a small step); the status box flat (L 81). Timeout dashes under each name: only drawn when the feed gives timeouts.
// measured on the real stills: every
// panel fades evenly from L 85 under its top edge to L 72-73 at the foot (12 L), the same in every column. Each tier gets its own glass:
// the panels lit at the top (+7 L) fading through the middle to -9 L at the foot with a light line under the top edge; the logo tiles
// the same over their own colour; the status box a gentler one (+3 / -3).
import { el, logo, statusText, teamColor, FONTS, fit, scoreSlot, glassCover } from '../kit.js';

const W = 1152, BAR = 48, HEAD = 28, TAB = 19;
const LOGO_A = 73, PANEL = 349, LOGO_H = 66, MSG = 310;
const top = (g) => (g.note ? HEAD : 0);

export default {
  id: 'vb-espn-23',
  size: { w: W, h: HEAD + BAR + TAB },
  sizeFor: (g) => ({ w: W, h: top(g) + BAR + (g.status === 'pre' ? 0 : TAB) }),
  fonts: [FONTS.roboto],
  css: `
.sb-vb-espn-23 { font-family: 'SB Roboto', Arial, sans-serif; color: #1d1e20; }
.sb-vb-espn-23 .hd { position: absolute; left: 0; top: 0; height: ${HEAD - 2}px; padding: 0 12px; display: grid; place-items: center; background: rgba(30,31,40,.86); color: #fff; font-weight: 700; font-size: 21px; letter-spacing: .02em; white-space: nowrap; }
.sb-vb-espn-23 .bar { position: absolute; left: 0; height: ${BAR}px; width: ${W}px; display: flex; box-shadow: 0 1px 3px rgba(0,0,0,.35); }
.sb-vb-espn-23 .lg { flex: none; height: ${BAR}px; display: grid; place-items: center; }
.sb-vb-espn-23 .lg .sb-logo { width: 60px; height: 40px; object-fit: contain; }
.sb-vb-espn-23 .pn { flex: none; width: ${PANEL}px; height: ${BAR}px; position: relative; display: flex; align-items: center; box-sizing: border-box; padding: 0 14px 0 6px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.14); }
.sb-vb-espn-23 .nm { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 6px; font-size: 36px; font-weight: 600; letter-spacing: -.01em; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-vb-espn-23 .nm .rk { font-weight: 500; font-size: .86em; flex: none; }
.sb-vb-espn-23 .nm .tn { min-width: 0; overflow: hidden; }
.sb-vb-espn-23 .nm .sv { font-size: .5em; flex: none; position: relative; top: -.25em; }
.sb-vb-espn-23 .sc { flex: none; font-weight: 800; font-size: 42px; font-stretch: 100%; line-height: 1; text-align: right; font-variant-numeric: tabular-nums; min-width: 1.3em !important; }
.sb-vb-espn-23 .to { position: absolute; left: 6px; bottom: 6px; display: flex; gap: 4px; }
.sb-vb-espn-23 .to i { width: 19px; height: 4px; }
.sb-vb-espn-23 .to i.used { opacity: .25; }
.sb-vb-espn-23 .ms { flex: none; margin-left: 4px; width: ${MSG}px; height: ${BAR}px; box-sizing: border-box; padding: 0 12px; display: flex; align-items: center; background: linear-gradient(#d3d5d2, #cfd1ce 30%, #caccc8 52%, #c3c5c1 90%, #bbb8b8); box-shadow: inset 0 1px 0 rgba(255,255,255,.45), inset 0 0 0 1px rgba(0,0,0,.14); font-size: 32px; font-weight: 600; font-stretch: 80%; letter-spacing: 0; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-vb-espn-23 .rc { position: absolute; height: ${TAB}px; width: 69px; display: grid; place-items: center; background: rgba(176,176,170,.82); color: #3a3b3d; font-size: 21px; font-weight: 600; line-height: 1; }
`,
  draw(root, g, { time }) {
    const y = top(g);
    if (g.note) root.appendChild(fit(el('div', 'hd', String(g.note).toUpperCase())));
    const bar = el('div', 'bar'); bar.style.top = y + 'px';
    const live = g.status === 'live', pre = g.status === 'pre';
    // the big figure: the points of the set being played; after the match, the sets won
    const pts = (t) => (live ? ((t.sets || []).length ? t.sets[t.sets.length - 1] : t.score) : g.status === 'final' ? t.score : null);
    const glass = glassCover('#c1c4c2', { top: 7, mid: 2.5, horizon: 46, step: 3, foot: -9, line: 14 });
    const tile = (c) => glassCover(c, { top: 6, mid: 2, horizon: 46, step: 3, foot: -8, line: 10 });
    const side = (t, home) => {
      const lg = el('div', 'lg'); lg.style.width = (home ? LOGO_H : LOGO_A) + 'px';
      const tg = tile(home ? '#f4f4f2' : teamColor(t, '#3a3f47')); lg.style.background = tg.background; lg.style.boxShadow = tg.shadow;
      lg.appendChild(logo(t, 60));
      const pn = el('div', 'pn'); pn.style.background = glass.background; pn.style.boxShadow = glass.shadow + ', inset 0 0 0 1px rgba(0,0,0,.14)';
      const nm = el('div', 'nm');
      if (t.rank && t.rank <= 25) nm.appendChild(el('span', 'rk', String(t.rank)));
      nm.appendChild(fit(el('span', 'tn', t.name || t.abbr || '')));
      if (live && t.hasBall) nm.appendChild(el('span', 'sv', '◀'));
      const v = pts(t);
      pn.append(nm, scoreSlot(el('span', 'sc', v != null ? String(v) : ''), g));
      if (live && t.timeouts != null) {
        const to = el('span', 'to'), c = teamColor(t, '#2a2b2e');
        for (let k = 0; k < 2; k++) { const i = el('i', k >= t.timeouts ? 'used' : ''); i.style.background = c; to.appendChild(i); }
        pn.appendChild(to);
      }
      bar.append(lg, pn);
    };
    side(g.away, false); side(g.home, true);
    // the status box: who leads the match (sets won) and the format while it runs, FINAL after, the start time before
    let msg;
    if (live) {
      const a = g.away.score || 0, h = g.home.score || 0, lead = a > h ? g.away : h > a ? g.home : null;
      msg = lead ? (lead.abbr || '').toUpperCase() + ' LEADS ' + Math.max(a, h) + '-' + Math.min(a, h) + ' (BEST OF 5)' : 'SET ' + (g.period.label || a + h + 1) + ' (BEST OF 5)';
    } else msg = g.status === 'final' ? 'FINAL' : statusText(g, time);
    bar.appendChild(fit(el('div', 'ms', msg)));
    root.appendChild(bar);
    if (!pre) [[g.away, LOGO_A + 3], [g.home, LOGO_A + PANEL + LOGO_H + 3]].forEach(([t, x]) => {
      if (!t.record) return;
      const r = el('div', 'rc', t.record); r.style.left = x + 'px'; r.style.top = (y + BAR) + 'px';
      root.appendChild(r);
    });
  },
};
