// "Gold plates '02": after Fox's NFL score strip of 2002 (a 350 x 18 px strip, rough). The 2001 strip (Ticker strip '01) again, with gold score
// plates: a thin smoked strip across the bottom, dark at its top and foot and lighter through the middle; each team's letters in white
// with its score dark on a small gold plate; the clock; the quarter in small grey capitals; the show's mark at the right end (here the
// Home Assistant logo). Nothing else is on the frame.
// measured: the first letters at 10% of the width, the plates 6.6% wide and 0.64
// of the strip tall (gold #f8ed8f at the top to #d09f51 at the foot, figures dark brown #6b5410), the second team at 27%, the clock at
// 41%, the quarter at 61% (0.7 of the letters' size), the mark at 74%; capitals 0.57 of the strip's height (by hand: 8 of its 14 rows).
import { el, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 1280, H = 52, PX = 41;

export default {
  id: 'nfl-fox-02',
  size: { w: W, h: H },
  // the strip ends a little after the show's mark, as on air
  hug: '.st',
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-02 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; font-stretch: 112%; color: #eef2e4; }
/* the strip blacked out: the frame's fade kept, darkest at the
 top and foot and a little lifted through the middle, but in black (near black #050506 at the rules, #1d1e20 at the middle; was an olive
 grey #2a2a22 to #55543f) */
.sb-nfl-fox-02 .st { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 70px 0 128px; box-sizing: border-box;
  background: linear-gradient(#050506 0%, #040405 12%, #0e0f10 24%, #1d1e20 42%, #1a1b1d 58%, #121315 72%, #060607 84%, #030304 100%);
  border-top: 1px solid #2c2d30; font-size: ${PX}px; line-height: 1; white-space: nowrap; }
.sb-nfl-fox-02 .tm { display: flex; align-items: center; gap: 8px; }
.sb-nfl-fox-02 .tm + .tm { margin-left: 46px; }
/* the gold plate: 0.64 of the strip tall, a little lighter at the top, the figure dark brown; its corners rounded about 2 of the
   frame's pixels (6 here), as the frame's plates read */
.sb-nfl-fox-02 .sc { min-width: 1.9em; height: 34px; display: inline-grid; place-items: center; padding: 0 8px; box-sizing: border-box; text-align: center;
  background: linear-gradient(#f8ed8f, #eacb5d 45%, #d7a650 70%, #d09f51); color: #6b5410; border-radius: 6px; font-size: ${PX * 0.88}px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), inset 0 -1px 0 rgba(90,60,0,.35); }
.sb-nfl-fox-02 .ck { margin-left: 54px; }
.sb-nfl-fox-02 .q { margin-left: 120px; font-size: ${Math.round(PX * 0.74)}px; font-weight: 600; font-stretch: 90%; letter-spacing: .04em; color: #c3c7b3; }
.sb-nfl-fox-02 .w { margin-left: 54px; font-size: ${Math.round(PX * 0.8)}px; }
.sb-nfl-fox-02 .sb-ha { color: #eef2e4; margin-left: 40px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const tm = el('span', 'tm');
      tm.append(el('span', 'ab', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      st.appendChild(tm);
    });
    const qtr = g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '') + (/^(football|basketball)$/.test(g.sport) ? ' QTR' : '');
    if (live) st.append(el('span', 'ck', g.clock || ''), el('span', 'q', qtr));
    else st.appendChild(el('span', 'w', statusText(g, time)));
    if (marks(opts).ha) st.appendChild(haMark(40));
    root.appendChild(st);
  },
};
