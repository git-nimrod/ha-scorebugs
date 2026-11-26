// "Slim bar '15": after Big Ten Network's volleyball bar of 2015 (frame: retro catalogue vb-btn15-1, Nebraska v Penn State, 720p). One
// slim bar: the away team's panel in its colour (bright at the left, deeper at the right) with rank and name in white condensed
// capitals, its points in a white box with black figures, the home team the same way, the set as a yellow ordinal on black ("2ND"), and a
// teal status box ("PENN ST LEADS 1 - 0", small capitals). A yellow arrow at the edge of a score box marks the team serving.
// Measured: bar 980 x 45; panels 306 / 267, score boxes 42, set cell 52, status 260; names cap 0.58
// of the bar in narrow letters, figures 0.62, set 0.42, status 0.47 / 0.44 (small capitals nearly full size); a 1 px light line along
// the top of every part.
// measured on the
// real stills: each team panel runs from L 41 at the left to L 16 at the right (Nebraska; a dark
// colour like Penn State's navy is lifted to L 27 at the left), and a glass lies over it: lit top, a step half way, the foot about
// 9 L darker. The teal box: #4e96b2 at the top, a hard step 44 % down to #0a4a5e, #033547 at the foot. The white boxes: a gloss, white
// to 55 %, grey (#c5c7c2) at the foot. After the match the status box shrinks to fit FINAL, so the bar ends just after it.
// the four real stills measured column by column (bar 34 still px tall, x 1.32): the bar is 840 long, not
// 980: away panel 234 and home panel 237 (nearly equal on air; they were 306 / 267), score boxes 46, set cell 48, status 229. The
// bar ends at the status box (no empty end), and after the match the empty set cell goes too: the bar ends at FINAL.
import { el, statusText, teamColor, FONTS, fit, scoreSlot, relight, shade } from '../kit.js';

const AW = 234, HW = 237, SC = 46, SET = 48, MS = 229, H = 45, FIN = 108;
const W = AW + SC + HW + SC + SET + MS;
// lightness (L*) of a colour, to place the panel's left and right ends as measured
const lum = (hex) => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return 40;
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
};
// the glass on each team panel, as measured down the stills: a dark top edge (no light line), a lit band from about 12 % to the step at
// 42-46 %, darker under it and darkest at the foot
// a colour at a given lightness: lighter through Lab, darker by scaling RGB (Lab clips a deep red and leaves it too light)
const atL = (c, t) => {
  if (t >= lum(c)) return relight(c, t - lum(c));
  let lo = -1, hi = 0;
  for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; if (lum(shade(c, m)) > t) hi = m; else lo = m; }
  return shade(c, (lo + hi) / 2);
};
const GLASS = 'linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,0) 12%, rgba(255,255,255,.08) 24%, rgba(255,255,255,.09) 42%, rgba(0,0,0,.06) 46%, rgba(0,0,0,.1) 78%, rgba(0,0,0,.28))';
// the bar's rounded left end is lit like a tube: a soft pink-white light at the middle of its height
const CAP = 'radial-gradient(16px 12px at 5px 52%, rgba(255,214,222,.55), rgba(255,214,222,0))';

const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'TH' : ['TH', 'ST', 'ND', 'RD'][n % 10] || 'TH');

export default {
  id: 'vb-btn-15',
  size: { w: W, h: H },
  // after the match the bar ends just after a short FINAL box
  sizeFor: (g) => ({ w: g.status === 'final' ? W - SET - MS + FIN : W, h: H }),
  fonts: [FONTS.barlowSemi700, FONTS.barlowSemi600, FONTS.barlowCond600],
  css: `
.sb-vb-btn-15 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-vb-btn-15 .bar { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; display: flex; box-shadow: 0 2px 5px rgba(0,0,0,.45); }
.sb-vb-btn-15 .bar > * { flex: none; height: ${H}px; display: flex; align-items: center; white-space: nowrap; overflow: hidden; line-height: 1; }
.sb-vb-btn-15 .tm { box-sizing: border-box; padding: 0 12px; gap: 5px; }
.sb-vb-btn-15 .tm:first-child { clip-path: polygon(6px 0, 100% 0, 100% 100%, 0 100%); padding-left: 16px; }
.sb-vb-btn-15 .tm .rk { font-size: 17px; flex: none; position: relative; top: 4px; }
.sb-vb-btn-15 .tm .nm { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 600; font-size: 37px; min-width: 0; overflow: hidden; }
.sb-vb-btn-15 .sc { width: ${SC}px; justify-content: center; position: relative; background: linear-gradient(#e4e1e6, #fbf9fa 15%, #ffffff 50%, #f4f4f4 78%, #dcdbde 88%, #a09fa7 96%, #8a8992); color: #0b0b0c; font-size: 38px; overflow: visible !important; }
.sb-vb-btn-15 .sc .sb-num { min-width: 0 !important; }
.sb-vb-btn-15 .sc .sv { position: absolute; left: -9px; top: 9px; width: 0; height: 0; border-top: 13px solid transparent; border-bottom: 13px solid transparent; border-right: 11px solid #f2d21b; }
.sb-vb-btn-15 .set { width: ${SET}px; justify-content: center; background: linear-gradient(#030304, #040405 48%, #0e0f10 51%, #0e0f10); box-shadow: none; color: #f2d21b; font-size: 26px; }
.sb-vb-btn-15 .ms { width: ${MS}px; box-sizing: border-box; padding: 0 12px; background: linear-gradient(90deg, rgba(255,255,255,.08), rgba(255,255,255,.06) 35%, rgba(255,255,255,0) 55%, rgba(0,0,0,.1)), linear-gradient(#2c5668, #3e7b90 12%, #4a8ca4 26%, #4a8aa2 43%, #1a5c70 45%, #0a4a5e 48%, #073f53 70%, #04304a); font-size: 27px; font-weight: 600; letter-spacing: .01em; }
.sb-vb-btn-15 .ms small { font-size: 24px; }
.sb-vb-btn-15 .ms.fin { width: ${FIN}px; justify-content: center; }
.sb-vb-btn-15 .bar.fin { width: ${W - SET - MS + FIN}px; }
.sb-vb-btn-15 .bar.fin .set { display: none; }
`,
  draw(root, g, { time }) {
    const bar = el('div', 'bar' + (g.status === 'final' ? ' fin' : '')), live = g.status === 'live';
    // the big figure: the points of the set being played; after the match, the sets won
    const pts = (t) => (live ? ((t.sets || []).length ? t.sets[t.sets.length - 1] : t.score) : g.status === 'final' ? t.score : null);
    [[g.away, AW], [g.home, HW]].forEach(([t, w]) => {
      const c = teamColor(t, '#3a3f47'), tm = el('div', 'tm');
      tm.style.width = w + 'px';
      // bright at the left end, deepening to near black at the right (measured on the stills at half height: L 36 -> 8 for Nebraska,
      // 14 and 42 under its listed L 50; Penn State's navy lifted to L 27 at the left, 8 at the right; set a little wider, as the glass
      // darkens the middle), the glass over it
      const L = lum(c), l0 = Math.max(L - 6, 30), l1 = Math.max(L - 44, 8);
      tm.style.background = (t === g.away ? CAP + ', ' : '') + GLASS + ', linear-gradient(90deg, ' + atL(c, l0) + ', ' + atL(c, (l0 + l1) / 2) + ' 50%, ' + atL(c, l1) + ')';
      if (t.rank && t.rank <= 25) tm.appendChild(el('span', 'rk', String(t.rank)));
      tm.appendChild(fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase()));
      const v = pts(t), sc = el('div', 'sc');
      sc.appendChild(scoreSlot(el('span', '', v != null ? String(v) : ''), g));
      if (live && t.hasBall) sc.appendChild(el('i', 'sv'));
      bar.append(tm, sc);
    });
    const set = el('div', 'set', live ? ORD(Number(g.period.label) || 1) : '');
    // the status box: who leads the match while it runs (small capitals after the first letter, as on air)
    const ms = el('div', 'ms' + (g.status === 'final' ? ' fin' : ''));
    const caps = (s) => { const f = el('span', ''); String(s).split(' ').forEach((w, i) => { if (i) f.appendChild(document.createTextNode(' ')); if (/^[A-Z]{2,}$/.test(w)) { f.appendChild(document.createTextNode(w[0])); f.appendChild(el('small', '', w.slice(1))); } else f.appendChild(document.createTextNode(w)); }); return f; };
    if (live) {
      const a = g.away.score || 0, h = g.home.score || 0, lead = a > h ? g.away : h > a ? g.home : null;
      const nm = lead ? ((lead.name || '').length <= 9 ? lead.name : lead.abbr || lead.name || '').toUpperCase() : '';
      ms.appendChild(fit(caps(lead ? nm + ' LEADS ' + Math.max(a, h) + ' - ' + Math.min(a, h) : 'MATCH TIED ' + a + ' - ' + h)));
    } else ms.appendChild(fit(caps(g.status === 'final' ? 'FINAL' : statusText(g, time))));
    bar.append(set, ms);
    root.appendChild(bar);
  },
};
