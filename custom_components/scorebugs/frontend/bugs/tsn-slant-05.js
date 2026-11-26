// "Slant plates '05": after the Canadian sports network's score bar of the mid-2000s (frame: a TSN hockey game of that era, from a
// "scorebug through the years" reel). A silver bar holding a row of slanted plates, dark for the mark, the scores and the clock and light for the teams and the period: the network's mark first (here the Home Assistant
// logo), then each team's logo and letters followed by its score on its own plate, the period, and the clock. Used then for hockey and
// the CFL alike. Soft picture by default.
import { el, logo, statusText, haMark, marks, FONTS, GLOSS } from '../kit.js';

// plate widths from the frame's gaps (mark 100, team 117, score 53, period 94, clock 113 of a 700 px bar): the
// team plates a little narrower and the period plate wider than before
const PW = { mk: 160, tm: 196, s: 90, pd: 152, ck: 176 };
const W = 1180, H = 60, PRE_CUT = PW.pd + 8;  // before the game the period plate goes; the score plates hold the records
// measured against the frame, frame size / mine: Blackhawks at Oilers
const TYPE = { score: 0.95, letters: 0.81, clock: 0.79, logo: 0.72 };


// the team letters' width to the frame's
const LETTERS = { stretch: 110, track: 1 };   // set tight, as on air (CHI, EDM), not spaced out

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  // the scores' old shift dropped: it pushed the home team's score and record 21 px off their plate's centre
  ['div.row > div.p.lt > span > span', 4.5, -0.5, -4.5],
  // the clock's old shift dropped: the clock sits centred on its plate, as on air
  ['div.row > div.p.lt > span > img.sb-logo', -3.5, 1, 0],
];

export default {
  id: 'tsn-slant-05',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the game there is no score or period: those plates go (they stood empty) and the bar is shorter
  // after it the clock's plate would stand empty beside "Final": it goes too
  sizeFor: (g) => (g.status === 'pre' ? { w: W - PRE_CUT, h: H } : g.status === 'final' ? { w: W - PW.ck - 8, h: H } : { w: W, h: H }),
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-tsn-slant-05 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 112%; color: #f2f2f2; }
.sb-tsn-slant-05 { font-weight: 700; font-stretch: 125%; }   /* face: Archivo 700 at 125% width (low confidence) */
.sb-tsn-slant-05 .row { position: absolute; inset: 0; display: flex; gap: 8px; padding: 6px 12px; box-sizing: border-box; align-items: stretch; background: linear-gradient(#f4f5f6, #9da3a9 50%, #dfe2e5); box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-tsn-slant-05 .p.lt { background: ${GLOSS}, linear-gradient(#ffffff, #c4c8cc); color: #111; border-color: #6c7277; }
.sb-tsn-slant-05 .p { transform: skewX(-24deg); background: ${GLOSS}, linear-gradient(#3a3d42, #101214); border: 3px solid #b9bec4; display: flex; align-items: center; justify-content: center; }
.sb-tsn-slant-05 .p > * { transform: skewX(24deg); }
.sb-tsn-slant-05 .mk { width: 150px; } .sb-tsn-slant-05 .mk .sb-ha { color: #f2f2f2; }
.sb-tsn-slant-05 .tm { width: 214px; gap: 10px; } .sb-tsn-slant-05 .tm .sb-logo { width: ${72 * TYPE.logo}px; height: ${46 * TYPE.logo}px; margin: 0; object-fit: contain; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); } .sb-tsn-slant-05 .tm span { font-size: ${36 * TYPE.letters}px; }
.sb-tsn-slant-05 .s { white-space: nowrap; } .sb-tsn-slant-05 .s { width: 90px; font-size: ${38 * TYPE.score}px; } .sb-tsn-slant-05 .pd { width: 120px; font-size: 34px; } .sb-tsn-slant-05 .ck { width: 170px; font-size: ${36 * TYPE.clock}px; }
.sb-tsn-slant-05 .tm span { font-stretch: ${LETTERS.stretch}%; letter-spacing: ${LETTERS.track}px; }
.sb-tsn-slant-05 .mk { width: ${PW.mk}px; } .sb-tsn-slant-05 .tm { width: ${PW.tm}px; } .sb-tsn-slant-05 .s { width: ${PW.s}px; } .sb-tsn-slant-05 .pd { width: ${PW.pd}px; } .sb-tsn-slant-05 .ck { width: ${PW.ck}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live';
    const row = el('div', 'row');
    const wrap = (cls, child) => { const p = el('div', 'p ' + cls); const s = el('span'); if (child) s.appendChild(child); p.appendChild(s); return p; };
    row.appendChild(wrap('mk', mk.ha ? haMark(40) : null));
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'p lt tm'); const inner = el('span'); inner.style.cssText = 'display:flex;align-items:center;gap:10px';
      inner.append(logo(t, 72), el('span', '', (t.abbr || '').toUpperCase())); tm.appendChild(inner); row.appendChild(tm);
      const sp = wrap('s', document.createTextNode(g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''));
      if (g.status === 'pre') sp.style.fontSize = ((t.record || '').length > 5 ? 17 : 24) + 'px';
      row.appendChild(sp);
    });
    if (g.status !== 'pre') row.append(wrap('pd lt', document.createTextNode(live ? (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toLowerCase()) : g.status === 'final' ? 'Final' : '')));
    if (g.status !== 'final') row.append(wrap('ck' + (g.status === 'pre' ? ' pre' : ''), document.createTextNode(live ? g.clock || '' : g.status === 'pre' ? statusText(g, time) : '')));
    root.appendChild(row);
  },
};
