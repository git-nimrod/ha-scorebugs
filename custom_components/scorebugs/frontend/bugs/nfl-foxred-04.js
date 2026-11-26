// "Red clock '04": after Fox's NFL score strip from week 11 of 2004 to week 14 of 2005 (a 347 x 19 px strip, rough). A thin dark see-through
// strip across the bottom: each team's letters lit in its own colour and its score in white, the clock in light figures on a red
// box, the quarter in pale yellow, then plain strip to the show's mark at the right end (here the Home Assistant logo).
// measured: the strip body #272b1c, its top rule #060e00 and its foot #040901; the
// first letters at 6-14% of the width (the Vikings' purple lifted to #7871b8), its score at 16-20%, the second letters at 23-30% (the
// Panthers' blue lifted to #84adbe), its score at 33-37%, the red box at 37.5-50.5% (#83271d at its ends to #cd7764 in the middle,
// figures #fdd8cc), the quarter at 51-58% (#c9d093), the mark at 78%; capitals 0.6 of the strip's height (by hand: 8.5 of its 14 rows).
import { el, statusText, scoreSlot, haMark, marks, teamPair, teamColor, panelInk, vividColor, shade, gloss, FONTS } from '../kit.js';

const W = 1280, H = 52, PX = 43;
// "needs angled dividing lines with black... have the background color be the team color". The strip black and
// see-through; each team's letters and score on a tab of its colour; every part parted by a thin light line leaning like a backslash
// (his reference, FOX's ALCS strip: 19-30 deg from upright by his marks, 25 used), the tabs' ends leaning the same way
const LEAN = 25;
// a deep neon version of a team's colour: its hue at full
// saturation and a deep lightness (0.4); black, grey and white teams keep their own colour (a near-black one takes its bright second
// colour first, kit vividColor)
const deepNeon = (hex, L = 0.4) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
  const n = parseInt(m[1], 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l0 = (mx + mn) / 2, s0 = d ? d / (1 - Math.abs(2 * l0 - 1)) : 0;
  if (s0 < 0.15) return hex;
  let h = !d ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360;
  // deep enough that white letters read on it (3:1, as the kit asks of every team panel): a bright hue (yellow, cyan, green) goes a
  // little deeper rather than taking dark letters
  for (let l = L; ; l -= 0.02) {
    const c = 1 - Math.abs(2 * l - 1), x = c * (1 - Math.abs((h / 60) % 2 - 1)), o = l - c / 2;
    const v = (h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]).map((k) => k + o);
    const lum = v.map((k) => (k <= 0.03928 ? k / 12.92 : ((k + 0.055) / 1.055) ** 2.4)), Y = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    if (1.05 / (Y + 0.05) >= 3.1 || l < 0.2) return '#' + v.map((k) => Math.round(k * 255).toString(16).padStart(2, '0')).join('');
  }
};
const hueOf = (hex) => {
  const n = parseInt(String(hex).slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255, mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
  if (d < 40) return null;
  const h = 60 * (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4); return h < 0 ? h + 360 : h;
};
// the two tabs' neon colours, never alike: two hues within 28 deg (a navy and a blue both turn deep blue) make the home team take its
// other colour, else keep its own deep shade
const neonPair = (a, b, cs) => {
  const base = (t, c) => (c.toLowerCase() === String(teamColor(t, c)).toLowerCase() ? vividColor(t, c) : c);
  const na = deepNeon(base(a, cs[0])); let nh = deepNeon(base(b, cs[1]));
  const close = (x, y) => { const p = hueOf(x), q = hueOf(y); return p != null && q != null && Math.min(Math.abs(p - q), 360 - Math.abs(p - q)) < 28; };
  if (close(na, nh)) {
    const alt = [b.color2, b.color].map((x) => deepNeon(x || '')).find((x) => /^#[0-9a-f]{6}$/i.test(x) && !close(x, na) && hueOf(x) != null);
    nh = alt || shade(cs[1], -0.2);
  }
  return [na, nh];
};

export default {
  id: 'nfl-foxred-04',
  size: { w: W, h: H },
  // the strip ends a little after the show's mark
  hug: '.st',
  fonts: [FONTS.saira],
  css: `
.sb-nfl-foxred-04 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; font-stretch: 100%; color: #f2f4ee; }
/* the strip starts where the first team's tab starts: its left edge is that tab's
 leaning left end carried to the strip's top and foot (25 deg: 0 px in at the top, 24.6 at the foot), no strip before it (there was 50 px
 of empty strip); it ends 14 px after the mark (was 70) */
.sb-nfl-foxred-04 .st { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 14px 0 12px; box-sizing: border-box;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 24.6px 100%);
  background: linear-gradient(rgba(3,3,4,.9) 0%, rgba(8,9,10,.74) 10%, rgba(14,15,16,.7) 50%, rgba(8,9,10,.74) 88%, rgba(3,3,4,.9) 100%);
  font-size: ${PX}px; line-height: 1; white-space: nowrap; }
/* a tab: its ends lean with the dividers; the letters inside stand upright. The team's letters on a deep neon tab of its colour, its score
 on a black tab */
.sb-nfl-foxred-04 .tb { align-self: stretch; display: flex; align-items: center; justify-content: center; margin: 4px 0 6px; padding: 0 10px; transform: skewX(${LEAN}deg); text-shadow: 0 1px 2px rgba(0,0,0,.35); }
.sb-nfl-foxred-04 .tb > * { transform: skewX(-${LEAN}deg); }
.sb-nfl-foxred-04 .tm { padding: 0 12px 0 14px; }
.sb-nfl-foxred-04 .scb { min-width: 60px; background: linear-gradient(#1c1d20, #050506 55%, #0b0c0e); color: #fff; }
.sb-nfl-foxred-04 .ab { min-width: 90px; text-align: center; letter-spacing: .04em; }
.sb-nfl-foxred-04 .dv { align-self: stretch; flex: none; width: 3px; margin: 4px 5px 6px; background: rgba(214,218,206,.8); transform: skewX(${LEAN}deg); }
.sb-nfl-foxred-04 .sc { text-align: left; }
/* the red box: darker at its ends, lighter in the middle, the full height of the strip's body; its ends lean with the dividers (it was square-ended) */
.sb-nfl-foxred-04 .ck { min-width: 120px; padding: 0 12px;
  background: linear-gradient(90deg, #83271d, #a44035 20%, #b8604c 50%, #a44035 80%, #851610); color: #fdd8cc; text-shadow: none; }
.sb-nfl-foxred-04 .q { margin-left: 0; color: #c9d093; font-size: ${Math.round(PX * 0.92)}px; }
.sb-nfl-foxred-04 .w { margin-left: 0; font-size: ${Math.round(PX * 0.8)}px; }
/* the mark brought left to a short gap after the last divider, and the strip cut short after it (it sat after a 200 px empty run, as on air) */
.sb-nfl-foxred-04 .sp { width: 24px; }
.sb-nfl-foxred-04 .sb-ha { color: #eef0ea; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    // the two teams never alike (red on red takes one team's other colour); the letters dark on a light colour
    const cs = teamPair(g.away, g.home, '#4a5560');
    const ns = neonPair(g.away, g.home, cs);
    const dv = () => el('i', 'dv');
    [g.away, g.home].forEach((t, i) => {
      if (i) st.appendChild(dv());
      const c = ns[i];
      const tm = el('span', 'tb tm');
      tm.style.background = gloss(42, 0.25) + ', linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.18) + ')';
      tm.style.color = panelInk(t, c);
      tm.appendChild(el('span', 'ab', (t.abbr || '').toUpperCase()));
      const sc = el('span', 'tb scb'); sc.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      st.append(tm, dv(), sc);
    });
    st.appendChild(dv());
    if (live) { const ck = el('span', 'tb ck'); ck.appendChild(el('span', '', (g.clock || '').replace(/^0:/, ':'))); st.append(ck, dv(), el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')), dv()); }
    else st.append(el('span', 'w', statusText(g, time)), dv());
    st.appendChild(el('span', 'sp'));
    if (marks(opts).ha) st.appendChild(haMark(40));
    root.appendChild(st);
  },
};
