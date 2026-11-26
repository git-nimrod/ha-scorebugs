// "Bottom strip '22": after the NBA regional sports networks' bottom-of-screen strip of the early 2020s (a 700 x 45 px
// strip, fair; the other two strips checked for the same parts). A light grey strip: each team a flat panel of its colour with its big
// logo cut by the panel's top and foot at the left, faded into the colour, and its score in white on a darker end of the panel; under
// each panel on the grey a row of seven dashes, red for each timeout left and grey for each one used; then a white bar with the quarter
// and the clock in black, and the network's tile at the right end (here the Home Assistant logo). "BONUS" in small dark capitals under
// the dashes of the team that shoots the bonus (Scorebugs' sensors, live NBA and WNBA games). Left out (no data): the shot clock in the white bar, the team fouls (the third
// strip's "FOULS 3"), and the ticker of other games and player lines that runs on past the tile.
// measured (x1.85 here): a 21 px light grey cap at the left (#c5c5c5), panels 216 px wide (0.31 of the
// strip) and 35 tall (0.78), 12 px apart, their darker score end the last 36%; dashes 17 x 4.5 px, 4 px apart, 3 px under the panel,
// red #c8202c and grey #b8b8b8; the white bar 189 px (#f6f6f6 to #d8d8d8); the scores' capitals 0.57 of a panel, heavy, upright.
// gloss: each panel lit along its top (the brightest band the top tenth, a light line on the top edge), easing down to a soft
// horizon about 40 % down and darkest at the foot, 8-9 L top to foot on air on the colour part and the score end alike (Mavericks,
// Hornets, Thunder); drawn with the kit's glass cover, a touch stronger (11 L) so it reads at card size.
import { el, logo, statusText, teamPair, panelInk, shade, haMark, marks, scoreSlot, pips, ordinal, glassCover, FONTS } from '../kit.js';

const GLOSS = { top: 15, mid: 8, horizon: 42, step: 9, foot: -12, line: 26 };

const S = 1.85, W = 1295, H = 84, CAP = Math.round(21 * S), PAN = Math.round(216 * S), PH = Math.round(35 * S), TOP = 4, BARW = Math.round(189 * S);

export default {
  id: 'nba-strip-22',
  size: { w: W, h: H },
  hug: '.st',
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-nba-strip-22 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-nba-strip-22 .st { position: absolute; inset: 0; display: flex; align-items: flex-start; gap: ${Math.round(12 * S)}px; padding: ${TOP}px 0 0 ${CAP}px; box-sizing: border-box;
  background: linear-gradient(#d4d4d4, #c2c2c2); }
.sb-nba-strip-22 .tm { width: ${PAN}px; display: grid; grid-template-rows: ${PH}px 1fr; row-gap: 6px; }
/* the panel: its colour, the logo large and faded at the left (cut by the panel's top and foot), the score on the darker end */
.sb-nba-strip-22 .pan { position: relative; display: flex; justify-content: flex-end; overflow: hidden; }
.sb-nba-strip-22 .pan .lg { position: absolute; left: ${Math.round(29 * S)}px; top: 50%; width: ${Math.round(90 * S)}px; height: ${Math.round(90 * S)}px; margin-top: -${Math.round(45 * S)}px; opacity: .55; }
.sb-nba-strip-22 .pan .sb-logo { width: 100%; height: 100%; object-fit: contain; }
.sb-nba-strip-22 .end { position: relative; width: 36%; display: grid; place-items: center end; padding-right: 22px; box-sizing: border-box; }
.sb-nba-strip-22 .sc { font-size: 54px; font-weight: 700; line-height: 1; letter-spacing: 1px; text-align: right; }
.sb-nba-strip-22 .sb-pips { display: flex; gap: ${Math.round(4 * S)}px; padding-left: 4px; }
.sb-nba-strip-22 .sb-pips i { width: ${Math.round(17 * S)}px; height: ${Math.round(4.5 * S)}px; background: #c8202c; }
.sb-nba-strip-22 .sb-pips i.used { background: #b8b8b8; }
.sb-nba-strip-22 .ft { display: flex; align-items: center; height: ${Math.round(5 * S)}px; }
.sb-nba-strip-22 .bn { position: absolute; left: ${Math.round(163 * S)}px; width: ${Math.round(33 * S)}px; text-align: center; color: #1e2330; font-size: 12px; line-height: 9px; letter-spacing: .5px; }
/* the white bar: the quarter and the clock in black, the network's tile at its right end */
.sb-nba-strip-22 .bar { align-self: stretch; margin: -${TOP}px 0 0 -${Math.round(10 * S)}px; width: ${BARW}px; display: flex; align-items: center; gap: 40px; padding: 0 0 0 30px; box-sizing: border-box;
  background: linear-gradient(#fafafa, #ededed 50%, #d8d8d8); color: #111; font-size: 52px; line-height: 1; }
.sb-nba-strip-22 .bar .q { font-size: 44px; } .sb-nba-strip-22 .bar .sb-ord { font-size: .8em; }
.sb-nba-strip-22 .bar .ck { font-size: 66px; font-weight: 700; letter-spacing: 1px; }
.sb-nba-strip-22 .bar .w { font-size: 44px; }
.sb-nba-strip-22 .tile { align-self: stretch; margin: -${TOP}px 0 0 -${Math.round(11 * S)}px; width: ${Math.round(43 * S)}px; display: grid; place-items: center; background: linear-gradient(#fafafa, #ededed 50%, #d8d8d8); }
.sb-nba-strip-22 .tile .sb-ha { color: #222; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    // never two look-alike panels (two navies), and dark letters on a light panel (GS gold)
    const [ca, ch] = teamPair(g.away, g.home, '#4a5560');
    const st = el('div', 'st');
    [[g.away, ca], [g.home, ch]].forEach(([t, c]) => {
      const tm = el('div', 'tm');
      const pan = el('div', 'pan');
      const gl = glassCover(c, GLOSS);
      pan.style.background = gl.background; pan.style.boxShadow = gl.shadow;
      // the logo centred on its face (its sharpest detail) and a wide one drawn smaller so three quarters of its height shows
      const lg = el('span', 'lg'); lg.dataset.focus = 'face'; lg.dataset.keep = '0.75'; lg.appendChild(logo(t, Math.round(90 * S)));
      const end = el('div', 'end');
      end.style.color = panelInk(t, shade(c, -0.19));
      const ge = glassCover(shade(c, -0.19), GLOSS);
      end.style.background = ge.background; end.style.boxShadow = ge.shadow;
      end.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      pan.append(lg, end);
      const d = el('div', 'ft');
      d.style.position = 'relative';
      if (live && t.timeouts != null) d.appendChild(pips(t.timeouts, 7));
      if (live && t.bonus) d.appendChild(el('span', 'bn', 'BONUS'));
      tm.append(pan, d);
      st.appendChild(tm);
    });
    const bar = el('div', 'bar');
    if (live) bar.append(ordinal(g.period, 'q'), el('span', 'ck', g.clock || ''));
    else bar.appendChild(el('span', 'w', statusText(g, time)));
    st.appendChild(bar);
    if (marks(opts).ha) { const tile = el('div', 'tile'); tile.appendChild(haMark(46)); st.appendChild(tile); }
    root.appendChild(st);
  },
};
