// "Red box '97": after CBC's Hockey Night in Canada score box of the late 1990s. A royal blue square at the top left where the network's gem stood (here the Home Assistant logo), beside a red panel
// with the two teams' letters and scores in heavy white type with dark shadows, one row each; under both a pale silver strip with
// the period at the left and the clock at the right in blue italics. The same red for both teams. Soft picture by default.
// measured (crop px of 111 x 50): blue square 0-30 x 0-33, red panel 30-108 x 0-33 (letters 35-75, scores 98-105), silver strip
// y 33-50; capitals 9 px of 50 in the panel (0.18, counted row by row on the crop, Nov 24 check) and wide (TOR 31 px across),
// 8.5 px in the strip; the red read about #8a1220 at its middle, the blue #222f86.
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS, TEXT_90S } from '../kit.js';

const K = 4, W = 110 * K, H = 50 * K;
const X = (v) => Math.round(v * K);
const CAP = 9 * K, PX = Math.round(CAP / 0.686);

export default {
  id: 'nhl-cbc-97',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-nhl-cbc-97 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 125%; color: #fff; }
.sb-nhl-cbc-97 .c { position: absolute; display: flex; align-items: center; white-space: nowrap; line-height: 1; }
.sb-nhl-cbc-97 .bl { left: 0; top: 0; width: ${X(30)}px; height: ${X(33)}px; justify-content: center; background: linear-gradient(#34449e, #222f86 55%, #18236e); box-shadow: inset 0 2px 0 rgba(255,255,255,.3), inset -2px 0 0 rgba(0,0,0,.3); }
.sb-nhl-cbc-97 .bl .sb-ha { color: #e9ecff; }
/* the red panel: deep red, a little lighter at the top */
.sb-nhl-cbc-97 .rd { left: ${X(30)}px; top: 0; width: ${X(80)}px; height: ${X(33)}px; background: linear-gradient(#a8202c, #8a1220 50%, #6e0c18); box-shadow: inset 0 2px 0 rgba(255,255,255,.25), inset 0 -2px 0 rgba(0,0,0,.3); }
.sb-nhl-cbc-97 .ab { left: ${X(35)}px; width: ${X(44)}px; height: ${X(15)}px; font-size: ${PX}px; text-shadow: ${TEXT_90S}; }
.sb-nhl-cbc-97 .sc { left: ${X(90)}px; width: ${X(18)}px; height: ${X(15)}px; justify-content: center; font-size: ${PX}px; text-shadow: ${TEXT_90S}; }
.sb-nhl-cbc-97 .sc.rec { left: ${X(76)}px; width: ${X(32)}px; justify-content: flex-end; }
/* three-figure scores: the score place reaches back towards the letters (as it does for a record) so the figures keep their size
 (they were shrunk to 0.65) */
.sb-nhl-cbc-97 .sc.n3 { left: ${X(81)}px; width: ${X(27)}px; justify-content: flex-end; } .sb-nhl-cbc-97 .sc.n3 > span { min-width: 0 !important; }
/* the silver strip: blue italics */
.sb-nhl-cbc-97 .st { left: 0; top: ${X(33)}px; width: ${W}px; height: ${X(17)}px; justify-content: space-between; padding: 0 ${X(6)}px 0 ${X(7)}px; box-sizing: border-box;
  background: linear-gradient(#e2e3ec, #c3c4d2 50%, #a3a5b6); color: #1c2a9c; font-family: 'SB Archivo', sans-serif; font-style: italic; font-size: ${PX * 0.95}px; }
.sb-nhl-cbc-97 .st.w { justify-content: center; font-size: ${PX * 0.8}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bl = el('div', 'c bl'); if (marks(opts).ha) bl.appendChild(haMark(X(20))); root.append(bl, el('div', 'c rd'));
    [g.away, g.home].forEach((t, i) => {
      const y = X(1.5 + i * 15.5) + 'px';
      const ab = fit(el('div', 'c ab', (t.abbr || '').toUpperCase())); ab.style.top = y;
      // before the game the score place reaches back towards the letters, so a three-part record (10-14-1) is not a speck
      const n3 = g.status !== 'pre' && [g.away, g.home].some((x) => String(x.score == null ? '' : x.score).length > 2);
      const sc = el('div', 'c sc' + (g.status === 'pre' ? ' rec' : n3 ? ' n3' : '')); sc.style.top = y; if (n3) fit(sc); sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      root.append(ab, sc);
    });
    const st = el('div', 'c st' + (live ? '' : ' w'));
    if (live) st.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toUpperCase()), el('span', '', g.clock || ''));
    else st.appendChild(el('span', '', statusText(g, time)));
    root.appendChild(st);
  },
};
