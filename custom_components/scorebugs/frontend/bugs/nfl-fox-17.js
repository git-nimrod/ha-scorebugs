// "Flat bar '17": after Fox's NFL bug (2017-19; frames: Vikings at Eagles, Bears at Titans). A flat full-width bar along the bottom: each
// team's name in capitals and its score on a long panel of its colour, a gold line over the team with the ball and its timeouts as white
// dashes under it; then black cells with the quarter, the clock in yellow and the down and distance (the orange play clock is left out:
// no data).
// Review: the gold line sits only over the ball team's score block, not the whole panel; the timeout dashes thicker and
// at the panel's foot; the panel darkens towards its score block.
// Flat halves '20 had been built from the same frame; merged on the picks: the team panels from Flat bar, the game's
// parts (the quarter, the clock and the down and distance in one dark box) from Flat halves. The old id nfl-fox-20 draws this bug.
import { el, ordinal, statusText, scoreSlot, teamColor, shade, inkOn, FONTS } from '../kit.js';

const W = 1280, H = 76, TEAM = 400, PRE_TEAM = 350;   // before the game the panel holds the name and the record (room for COMMANDERS 10-14-1)
// the score about half the bar's height
const NAME_PX = 34, SCORE_PX = 54, CELL_PX = 30;

export default {
  id: 'nfl-fox-17',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: both team panels close up on their names, so the bar is shorter
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * (TEAM - PRE_TEAM) : W, h: H }),
  fonts: [FONTS.barlowSemi700, FONTS.barlowSemi600],
  css: `
.sb-nfl-fox-17 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: FOX, closest in the pack: Barlow Semi Condensed Bold */
.sb-nfl-fox-17 .bar { position: absolute; inset: 0; display: grid; grid-template-columns: ${TEAM}px ${TEAM}px 1fr; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-nfl-fox-17 .tm { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 26px; border-right: 2px solid rgba(0,0,0,.35); }
.sb-nfl-fox-17 .tm .nm { font-size: ${NAME_PX}px; letter-spacing: .02em; }
/* the score on a darker block of the team's colour at the panel's right end, as in the frame */
.sb-nfl-fox-17 .tm .sc { align-self: stretch; display: grid; place-items: center; width: 96px; margin-right: -26px; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nfl-fox-17 .tm.ball::before { content: ''; position: absolute; right: 0; width: 96px; top: 0; height: 6px; background: #e8b923; z-index: 1; }
.sb-nfl-fox-17 .to { position: absolute; left: 10px; right: 108px; bottom: 3px; display: flex; gap: 10px; } .sb-nfl-fox-17 .to i { flex: 1; height: 6px; border-radius: 1px; background: rgba(236,238,240,.9); } .sb-nfl-fox-17 .to i.used { opacity: .2; }
.sb-nfl-fox-17 .tm .rec { font-size: ${NAME_PX * 0.8}px; opacity: .92; white-space: nowrap; margin-left: 12px; }
.sb-nfl-fox-17 .rt { display: flex; align-items: center; justify-content: space-evenly; background: linear-gradient(#26282c, #121315); font-size: ${CELL_PX}px; }   /* Flat halves' game box */
.sb-nfl-fox-17 .rt .dn { color: #f2c230; } .sb-nfl-fox-17 .rt .w { font-size: ${CELL_PX * 0.85}px; }
.sb-nfl-fox-17 .sb-ord { font-size: .62em; vertical-align: .5em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    if (g.status === 'pre') bar.style.gridTemplateColumns = PRE_TEAM + 'px ' + PRE_TEAM + 'px 1fr';
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('span', 'tm' + (live && t.hasBall ? ' ball' : ''));
      tm.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.18)), linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.12) + ')'; tm.style.color = inkOn(c);
      tm.appendChild(el('span', 'nm', (t.name || t.abbr || '').toUpperCase().slice(0, 14)));
      if (g.status === 'pre' && t.record) { const r = el('span', 'rec', t.record); tm.appendChild(r); }  // records before the game, every time
      if (g.status !== 'pre') {
        const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
        sc.style.background = 'linear-gradient(' + shade(c, -0.14) + ', ' + shade(c, -0.28) + ')'; sc.style.color = inkOn(c);
        tm.appendChild(sc);
      }
      const to = el('span', 'to'); if (live && t.timeouts != null) for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      tm.appendChild(to);
      bar.appendChild(tm);
    });
    const rt = el('span', 'rt');
    if (live) { rt.appendChild(ordinal(g.period)); if (g.clock) rt.appendChild(el('span', 'ck', g.clock)); if (g.football && g.football.short) rt.appendChild(el('span', 'dn', g.football.short)); }
    else rt.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(rt);
    root.appendChild(bar);
  },
};
