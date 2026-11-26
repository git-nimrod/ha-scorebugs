// "Team tabs '04": after Fox's NFL score strip of 2004, weeks 1 to 10 (a 364 x 19 px strip, rough). A thin grey see-through strip across the bottom
// carrying a run of leaning tabs: each team a glossy tab of its colour with its small logo and its letters in white, then its score
// white on a black tab; the clock and the quarter on light olive tabs; then plain strip to the show's mark at the right end (here the
// Home Assistant logo). Every tab's ends lean the same way, top left to bottom right.
// measured: the strip body #656e64 between dark rules #3a493d; the first team tab at
// 5-14% of the width, its score tab 14-21%, the second team tab 21-31%, its score tab 31-38%, the clock tab 38-49% and the quarter tab
// 50-58% (olive, #a0a675 to #c0cba3, letters cream #f4f8c9), the mark at 72%; tab ends lean about 20 deg; capitals 0.55 of the
// strip's height (by hand: 7.5 of its 14 rows). The team tabs read lighter than the teams' colours on the frame (a gloss over them).
import { el, logo, statusText, scoreSlot, haMark, marks, teamPair, teamColor, panelInk, vividColor, shade, gloss, FONTS } from '../kit.js';

const W = 1280, H = 50, PX = 38, LEAN = 20, LOGO = 30;
// a neon version of a team's colour: its hue at full saturation and a bright lightness (0.48); black, grey and white teams keep their own colour (a near-black one takes its bright second
// colour first, kit vividColor)
const deepNeon = (hex, L = 0.48) => {
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
  id: 'nfl-fox-04',
  size: { w: W, h: H },
  // the strip ends a little after the show's box
  hug: '.st',
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-04 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; font-stretch: 100%; color: #fff; }
/* a black border along the strip's top and foot, the whole length of the bug, the tabs between them (frame: a near-black row, 8-20 of 255, over and under the tabs
 all along, 1 of the strip's 13 rows each, so 4 px here; it was a dark grey-green #3a493d to #282d22) */
.sb-nfl-fox-04 .st { position: absolute; inset: 0; display: flex; align-items: stretch; padding: 4px 70px 4px 63px; box-sizing: border-box;
  background: linear-gradient(#050606 0 4px, #5d685d 4px, #747a67 30%, #666e62 55%, #646a5e 78%, #4c5146 calc(100% - 4px), #050606 calc(100% - 4px));
  font-size: ${PX}px; line-height: 1; white-space: nowrap; overflow: hidden; }
/* black dividing lines between the tabs, leaning with them */
.sb-nfl-fox-04 .dv { flex: none; width: 4px; background: #050506; transform: skewX(${LEAN}deg); }
/* a tab: its ends lean top left to bottom right; the letters inside stand upright */
.sb-nfl-fox-04 .tb { display: flex; align-items: center; gap: 8px; padding: 0 14px; transform: skewX(${LEAN}deg); }
.sb-nfl-fox-04 .tb > * { transform: skewX(-${LEAN}deg); }
.sb-nfl-fox-04 .tm { min-width: 90px; text-shadow: 0 1px 2px rgba(0,0,0,.3); }
.sb-nfl-fox-04 .tm .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain; }
.sb-nfl-fox-04 .sc { justify-content: center; min-width: 54px; background: linear-gradient(#1b2320, #070b0a 55%, #0d1714); }
.sb-nfl-fox-04 .sc > * { text-align: center; }
/* the clock and quarter tabs: the tabs a plain mid grey (#9a9d98 to #7c807a,
 was a light olive), the figures a clear yellow (#ffe23c, was cream #f4f8c9) edged dark so they read on the grey */
.sb-nfl-fox-04 .ol { background: linear-gradient(#a9aca7, #92958f 45%, #7c807a 60%, #8a8d87); color: #ffe23c; text-shadow: 0 0 2px rgba(20,20,10,.85), 0 1px 2px rgba(20,20,10,.7); }
.sb-nfl-fox-04 .ck { min-width: 112px; justify-content: center; }
.sb-nfl-fox-04 .q { margin-left: 4px; min-width: 70px; justify-content: center; font-size: ${Math.round(PX * 0.9)}px; }
.sb-nfl-fox-04 .w { min-width: 150px; justify-content: center; font-size: ${Math.round(PX * 0.85)}px; }
.sb-nfl-fox-04 .sp { width: 26px; }
/* the mark brought left, a short gap after the quarter (it sat after a 190 px empty run), and truncated: taller than the strip, which
 crops its top and foot; the strip ends a little after it */
.sb-nfl-fox-04 .sb-ha { align-self: center; flex: none; color: #eef1ea; }
/* the two black borders laid over everything, so they run unbroken the whole length, over the cropped mark too */
.sb-nfl-fox-04 .st::after { content: ''; position: absolute; inset: 0; border-top: 4px solid #050606; border-bottom: 4px solid #050606; pointer-events: none; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    // never two look-alike tabs (red on red, or two colours that come out the same neon); dark letters on a light tab (the Saints' gold)
    const cs = teamPair(g.away, g.home, '#4a5560'), ns = neonPair(g.away, g.home, cs);
    const dv = () => el('i', 'dv');
    [g.away, g.home].forEach((t, i) => {
      const c = ns[i];
      const tm = el('span', 'tb tm');
      tm.style.color = panelInk(t, c);
      // neon, the colour full to past the letters' middle, then fading to black at the tab's
      // right end before the score (his note on Logo strip '03: "fade to black before scores and have same angles"); the tab is leaned,
      // so the fade leans with it
      tm.style.background = gloss(48, 0.3) + ', linear-gradient(90deg, ' + shade(c, 0.12) + ', ' + c + ' 55%, ' + shade(c, -0.45) + ' 80%, #070809)';
      tm.append(logo(t, LOGO), el('span', 'ab', (t.abbr || '').toUpperCase()));
      const sc = el('span', 'tb sc');
      sc.appendChild(scoreSlot(el('span', '', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      if (i) st.appendChild(dv());
      st.append(tm, dv(), sc);
    });
    const tab = (cls, text) => { const t = el('span', 'tb ol ' + cls); t.appendChild(el('span', '', text)); return t; };
    if (live) st.append(dv(), tab('ck', g.clock || ''), dv(), tab('q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')), dv());
    else st.append(dv(), tab('w', statusText(g, time)), dv());
    st.appendChild(el('span', 'sp'));
    if (marks(opts).ha) st.appendChild(haMark(66));
    root.appendChild(st);
  },
};
