// "Box strip '06": after Fox's NFL score strip (2006-09; frame: Dolphins at Panthers). A thin dark blue-grey strip across the bottom: the
// show's box at the left end (here the Home Assistant logo on a dark box), then each team's letters and score in its own framed cell (the
// team with the ball outlined in blue), and the clock with the quarter. The scores of other games running on to the right are left out, and so is their empty cell.
// Review: cells with rounded corners, the strip edged top and bottom in bright silver, the quarter small in yellow, the
// ball team's cell filled navy under its blue outline, letters a light grey.
import { el, statusText, scoreSlot, haMark, marks, shade, FONTS, vividColor, teamColor } from '../kit.js';

const W = 1280, H = 76,   // 12 px over the strip for the ball tab
  PX = 30, SCORE_ROOM = 50;   // a score slot and its gap, per team

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-fox-06',
  size: { w: W, h: H },
  // before the kick-off there is no score: the cells close up on the letters and the strip is shorter by that room
  sizeFor: (g) => (closeUp(g) ? { w: W - 2 * SCORE_ROOM, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -36% vs the broadcast; 80 % of the correction
  typeScale: 1.09,
  hug: '.st',  // the strip ends after the clock: no empty cell or bar past it
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-06 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 700; color: #f2f2f2; }
.sb-nfl-fox-06 { font-weight: 700; font-stretch: 87.5%; }   /* face: Saira 700 at 87.5% width (low confidence) */
.sb-nfl-fox-06 .st { position: absolute; inset: 12px 0 0 0; display: flex; align-items: center; gap: 8px; padding: 0 8px; box-sizing: border-box;
  background: linear-gradient(#e6e8ea, #a9adb3 45%, #7f848b 52%, #b5b9be); border-top: 3px solid #f4f5f7; border-bottom: 3px solid #6c7178;   /* a polished grey metal strip, as the chrome bars of the time */ font-size: ${PX}px; line-height: 1; color: #e4e6ea; }
/* surface sweep to the frame (Dolphins at Panthers): the show's box is dark like the cells, its mark light; every cell in a
 thin silver outline (they were grey) */
.sb-nfl-fox-06 .mk { height: 38px; width: 120px; align-self: flex-end; margin-bottom: 7px; display: grid; place-items: center; background: linear-gradient(#2d3138, #0d0e11); border: 2px solid #c9ccd1; border-radius: 6px; box-sizing: border-box; } .sb-nfl-fox-06 .mk .sb-ha { color: #f2f2f2; }
.sb-nfl-fox-06 .c { height: 38px; align-self: flex-end; margin-bottom: 7px; display: flex; align-items: center; gap: 12px; padding: 0 12px; box-sizing: border-box; border: 2px solid #b9bdc4; border-radius: 6px; background: linear-gradient(#2d3138, #15171b); }
/* the team cells stay black; the team with the ball is ringed in its own colour with a glow */
.sb-nfl-fox-06 .c { background: linear-gradient(#202226, #050506); }
.sb-nfl-fox-06 .c.ball { position: relative; overflow: visible; border: 3px solid var(--tc, #2e8de8); box-shadow: 0 0 0 1px var(--tc, #2e8de8), 0 0 14px var(--tc, #2e8de8); }
/* and a bright tab of its colour rising above the cell, as on air */
.sb-nfl-fox-06 .c.ball::before { content: ''; position: absolute; left: 6%; right: 6%; top: -18px; height: 12px; border-radius: 4px 4px 0 0; background: linear-gradient(#ffffff55, transparent), var(--tc, #2e8de8); box-shadow: 0 0 10px var(--tc, #2e8de8); }
.sb-nfl-fox-06 .ck small { font-size: .6em; margin-left: 6px; color: #e8d34a; }
.sb-nfl-fox-06 .rest { flex: 1; height: 38px; border: 2px solid #6c7178; border-radius: 6px; box-sizing: border-box; background: rgba(0,0,0,.25); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st'), mk = el('span', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(38));
    st.appendChild(mk);
    [g.away, g.home].forEach((t) => {
      const c = el('span', 'c' + (live && t.hasBall ? ' ball' : ''));
      if (live && t.hasBall) c.style.setProperty('--tc', teamColor(t, '#2e8de8'));  // the team's main colour
      c.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (!closeUp(g)) c.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      st.appendChild(c);
    });
    const ck = el('span', 'c ck');
    if (live) { ck.appendChild(document.createTextNode(g.clock || '')); ck.appendChild(el('small', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || ''))); }
    else ck.appendChild(document.createTextNode(statusText(g, time)));
    st.append(ck);
    root.appendChild(st);
  },
};
