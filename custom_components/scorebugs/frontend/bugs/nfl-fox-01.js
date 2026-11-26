// "Ticker strip '01": after Fox's NFL score strip (2001-02; frame: Eagles at 49ers). A thin dark strip across the bottom of the screen: each
// team's letters with its score on a small white plate, the clock, the quarter in small capitals, and the show's mark at the right end (here
// the Home Assistant logo). The yellow flag tab under it is left out (no data).
import { el, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

// PX 34 -> 27 (ours were 0.84, 0.56 and 2.7: the audit's 1.45 overshot)
const W = 1280, H = 64, PX = 27;

export default {
  id: 'nfl-fox-01',
  size: { w: W, h: H },
  hug: '.st',  // the strip ends after the show's mark: no empty bar
  // measured against the frame by the automatic audit: text -39% vs the broadcast; 80 % of the correction
  typeScale: 1.45,
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-01 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; color: #f2f2f2; }
.sb-nfl-fox-01 { font-weight: 700; font-stretch: 112%; }   /* face: Saira 700, a little less wide than first matched: the frame's letters are plain bold */
.sb-nfl-fox-01 .st { position: absolute; inset: 0; display: flex; align-items: center; gap: 22px; padding: 0 30px 0 30px; box-sizing: border-box;
  background: linear-gradient(#151617, #0c0c0d 55%, #080808); border-top: 2px solid #3a3c40; border-bottom: 2px solid #050505; font-size: ${PX}px; line-height: 1; }
.sb-nfl-fox-01 .tm { display: flex; align-items: center; gap: 6px; }
.sb-nfl-fox-01 .sc { min-width: 1.1em; padding: 0 6px; line-height: .95; text-align: center; background: linear-gradient(#ffffff, #cfd1d4); color: #111; border-radius: 2px; }
.sb-nfl-fox-01 .ck { margin-left: 40px; } .sb-nfl-fox-01 .q { margin-left: 70px; font-size: ${PX * 0.88}px; font-weight: 600; font-stretch: 100%; letter-spacing: .02em; color: #c4c6c9; }   /* the quarter in a softer grey, as on air */
.sb-nfl-fox-01 .sb-ha { color: #f2f2f2; margin-left: 24px; }
.sb-nfl-fox-01 .w { margin-left: 40px; font-size: ${PX * 0.8}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const tm = el('span', 'tm');
      tm.append(el('span', '', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      st.appendChild(tm);
    });
    if (live) st.append(el('span', 'ck', g.clock || ''), el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '') + (/^(football|basketball|australian-football)$/.test(g.sport) ? ' QTR' : '')));
    else { st.appendChild(el('span', 'w', statusText(g, time))); }
    if (marks(opts).ha) st.appendChild(haMark(44));
    root.appendChild(st);
  },
};
