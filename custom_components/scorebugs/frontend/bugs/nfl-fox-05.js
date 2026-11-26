// "Silver slants '05": after Fox's NFL score strip (late 2005 and playoffs; frame: 49ers at Rams). A thin black strip across the bottom:
// each team's letters in its colour and its score on a slanted silver plate, a long silver bar with the clock and the quarter, and the
// show's mark at the right end (here the Home Assistant logo).
// Review: each team's letters white in a leaning box of its colour with a contrasting top line; plates and the
// clock bar lean the same way (top-left to bottom-right); the clock bar runs long and fades out.
import { el, statusText, scoreSlot, haMark, marks, teamBox, FONTS } from '../kit.js';

const W = 1280, H = 64, PX = 28, PLATE_ROOM = 80;   // a silver score plate and its gap, per team

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-fox-05',
  size: { w: W, h: H },
  // before the kick-off there is no score: the empty silver plates go and the strip is shorter by their room
  hug: '.st',   // the stage ends at the mark
  sizeFor: (g) => (closeUp(g) ? { w: W - 2 * PLATE_ROOM, h: H } : { w: W, h: H }),
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-05 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; color: #f2f2f2; }
.sb-nfl-fox-05 { font-weight: 700; font-stretch: 87.5%; }   /* face: Saira 700 at 87.5% width (low confidence) */
.sb-nfl-fox-05 .st { position: absolute; inset: 0; display: flex; align-items: center; gap: 6px; padding: 0 16px 0 36px;   /* tighter */
  box-sizing: border-box;
  background: linear-gradient(#26272a, #0b0b0c 55%, #000); border-top: 2px solid #4a4c50; font-size: ${PX}px; line-height: 1; }
.sb-nfl-fox-05 .pl { padding: 2px 24px; transform: skewX(18deg); background: linear-gradient(#ffffff, #c6c9ce 55%, #9ea2a8); color: #111; }
.sb-nfl-fox-05 .pl > * { display: inline-block; transform: skewX(-18deg); }
/* each team's letters white inside a box of its colour, leaning top-left to bottom-right like the plates */
.sb-nfl-fox-05 .ab { padding: 2px 11px; transform: skewX(18deg); text-shadow: 0 1px 2px rgba(0,0,0,.6); } .sb-nfl-fox-05 .ab > * { display: inline-block; transform: skewX(-18deg); }
/* the clock bar runs long towards the show's mark, fading out on its right, as on air */
/* a short fade, the mark right after it and the bar ends there */
.sb-nfl-fox-05 .bar { flex: none; min-width: 300px; margin-right: 10px; display: flex; gap: 30px; align-items: center; margin-left: 10px; padding: 6px 40px 6px 22px; transform: skewX(18deg); background: linear-gradient(90deg, #c6c9ce, #ffffff 30%, #dfe2e6 60%, rgba(255,255,255,.08)); color: #142a5c; font-size: ${PX * 0.85}px; }
.sb-nfl-fox-05 .bar > * { transform: skewX(-18deg); }
.sb-nfl-fox-05 .gap { flex: 1; } .sb-nfl-fox-05 .sb-ha { color: #dfe2e8; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const bx = teamBox(t, '#3a3f47'), ab = el('span', 'ab'); ab.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      ab.style.color = bx.ink; ab.style.background = 'linear-gradient(' + bx.line + ', ' + bx.line + ') top / 100% 3px no-repeat, ' + bx.bg;
      const pl = el('span', 'pl'); pl.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      if (closeUp(g)) { if (t === g.home) ab.style.marginLeft = '22px'; st.appendChild(ab); } else st.append(ab, pl);   // the two teams' letters kept apart
    });
    const bar = el('span', 'bar');
    if (live) bar.append(el('span', '', g.clock || ''), el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')));
    else bar.appendChild(el('span', '', statusText(g, time)));
    st.append(bar);
    if (marks(opts).ha) st.appendChild(haMark(34));
    root.appendChild(st);
  },
};
