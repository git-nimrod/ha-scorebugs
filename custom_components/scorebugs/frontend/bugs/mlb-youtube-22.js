// "Logo blocks '22": after YouTube's MLB Game of the Week bug (2022; frame: Dodgers at Phillies). A dark box: each team's logo on a block of
// its colour with its score on a white cell, then the bases over the inning (a red arrow); along the bottom the network's white cell (here
// the Home Assistant logo) and a dark row with the count and the outs as rings (the pitch count is left out: no data).
// As on air: each logo in its white one-colour version, filling most of a glossy tile (light top, darker foot).
import { el, otherSport, logo, bases, statusText, scoreSlot, teamColor, shade, haMark, marks, FONTS } from '../kit.js';

/** The team colour darkened until it is deep (relative luminance at most 0.085), as the broadcast's tiles are: a bright red needs far more
 *  darkening than the Dodgers' blue (measured on the frame: Dodgers top #115886, Phillies top #800E0E). */
function deep(c) {
  const lum = (h) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h || ''); if (!m) return 0;
    return m.slice(1).map((x) => { const v = parseInt(x, 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); };
  let k = 0, out = c;
  while (lum(out) > 0.085 && k < 0.8) { k += 0.05; out = shade(c, -k); }
  return out;
}

const W = 720, H = 240, RULE = 4, LOGO = 168, SCORE = 104, TOP = 150;
// type measured on the frame: the score's figures about 55 % of the tile's height (tall and narrow), the bottom row's 54 % of its height, all in a tall narrow face
const COND = { family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', desc: { weight: '700' } }, COND_CAP = 0.7;
const SCORE_PX = Math.round(0.53 * TOP / COND_CAP),   // 0.53: two figures still fit the tile (the slot keeps room for two)
      LOW_PX = Math.round(0.54 * (H - TOP - 16 - 4) / COND_CAP), INN_PX = Math.round(0.25 * TOP / COND_CAP);

export default {
  id: 'mlb-youtube-22',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the white score cells and the empty bases column go: the two logo tiles close up, the network's cell under the
  // first and the start time in the dark row under the second (the kit's logo in the score cell doubled the tile's)
  sizeFor: (g) => ({ w: W, h: H }),  // before the game the score cells hold the records
  logos: 'dark',
  fonts: [FONTS.roboto, COND],
  css: `
.sb-mlb-youtube-22 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; font-stretch: 90%; color: #f4f4f4; }
.sb-mlb-youtube-22 { font-weight: 700; font-stretch: 75%; }   /* face: Roboto 700 at 75% width (low confidence) */
.sb-mlb-youtube-22 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LOGO}px ${SCORE}px ${LOGO}px ${SCORE}px 1fr; grid-template-rows: ${TOP}px 1fr; gap: ${RULE}px; padding: 8px; box-sizing: border-box;
  background: #2b2c2f; box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 0 0 3px #3a6db0; }
.sb-mlb-youtube-22 .lg { position: relative; display: grid; place-items: center; }
/* the broadcast's gloss over the white logo: it greys towards the foot (the P is white at the top and about #999 at the bottom) */
.sb-mlb-youtube-22 .lg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(0,0,0,0) 40%, rgba(0,0,0,.34)); pointer-events: none; } .sb-mlb-youtube-22 .lg .sb-logo { width: 140px; height: 128px; object-fit: contain; }
.sb-mlb-youtube-22 .sc { display: grid; place-items: center; background: linear-gradient(#f4f4f4, #dcdcdc); color: #0b0b0d; font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-size: ${SCORE_PX}px; letter-spacing: -2px; line-height: 1; overflow: hidden; min-width: 0 !important; text-align: center; }   /* the tile is the score's fixed room: centred, as on air */
.sb-mlb-youtube-22 .st { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #1e1f22; font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-size: ${INN_PX}px; line-height: 1; }
.sb-mlb-youtube-22 .st .sb-bases i { border: 3px solid #f2f2f2; background: transparent; } .sb-mlb-youtube-22 .st .sb-bases i.on { background: #f2f2f2; }
.sb-mlb-youtube-22 .st b { color: #d9262c; font-size: .48em; margin-right: 6px; vertical-align: .15em; }
.sb-mlb-youtube-22 .mk { grid-column: 1 / 3; display: grid; place-items: center; background: #fff; } .sb-mlb-youtube-22 .mk .sb-ha { color: #d9262c; }
.sb-mlb-youtube-22 .lo { grid-column: 3 / 6; display: flex; align-items: center; justify-content: center; gap: 40px; background: #1e1f22; font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-size: ${LOW_PX}px; line-height: 1;
  box-shadow: inset 0 3px 0 #55565a; }   /* the grey separator along the top of the bottom row (frame) */
.sb-mlb-youtube-22 .rings { display: flex; gap: 14px; } .sb-mlb-youtube-22 .rings i { width: 26px; height: 26px; border-radius: 50%; border: 3px solid #e9e9e9; box-sizing: border-box; } .sb-mlb-youtube-22 .rings i.on { background: #e9e9e9; }
.sb-mlb-youtube-22 .w { grid-row: 1; font-size: ${INN_PX * 0.8}px; }
.sb-mlb-youtube-22 .bx.pre { grid-template-columns: ${LOGO}px ${LOGO}px; } .sb-mlb-youtube-22 .bx.pre .mk { grid-column: 1; } .sb-mlb-youtube-22 .bx.pre .lo { grid-column: 2; font-size: 40px; }
.sb-mlb-youtube-22 .st .dt { font-size: .55em; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const lg = el('span', 'lg'); const top = deep(c); lg.style.background = 'linear-gradient(' + top + ' 0, ' + shade(top, -0.16) + ' 45%, ' + shade(top, -0.42) + ' 53%, ' + shade(top, -0.72) + ')'; lg.appendChild(logo(t, 128));   // as on air (measured column by column): a deep version of the colour at the top (Dodgers #08468A, Phillies #810E07), darkening slowly to
      // 45 %, faster over the next 8 % (no hard line: that band is about 6 source px), then slowly to near black at the foot
      bx.appendChild(lg);
      bx.appendChild(g.status === 'pre' ? scoreSlot(el('span', 'sc', ''), g) /* empty before the game: the kit puts the record in and sizes it to the box */ : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
    });
    const st = el('span', 'st');
    if (live) { const inn = el('span', ''); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || '')); st.append(bases(b.bases, 30), inn); }
    else if (os) { // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      if (os.detail) st.appendChild(el('span', 'dt', os.detail)); st.appendChild(el('span', '', os.period)); }
    else st.appendChild(el('span', 'w', statusText(g, time)));
    const mk = el('span', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(62));
    const lo = el('span', 'lo');
    if (os) lo.appendChild(el('span', '', os.clock));
    if (live) { const r = el('span', 'rings'); for (let i = 0; i < 2; i++) r.appendChild(el('i', i < b.outs ? 'on' : '')); lo.append(el('span', '', b.balls + '-' + b.strikes), r); }
    bx.append(st, mk, lo);
    root.appendChild(bx);
  },
};
