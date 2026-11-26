// "Split tiles '20": after ESPN's NBA bug (2020; frame: Nuggets at Lakers). A dark bar of tiles: each team's logo on a dark tile, then a
// panel in the team's colour with its letters and a big score, both in white; then a dark textured box with the quarter | the clock. The
// network's mark sat above the bug. The shot clock is left out (no data).
import { el, logo, statusText, teamColor, teamPair, panelInk, shade, teamInk, scoreSlot, FONTS } from '../kit.js';

const W = 1060, H = 90, TILE = 96, TEAM = 290, CLOCK = 280, PRE_CUT = 84;   // before the tip-off each team panel loses its empty score room
// letters 0.43 and scores 0.56 of the bar's height in capitals, the letters opened up (read with that taken out, DEN runs 1.36x ours across)
const ABBR_PX = 54, SCORE_PX = 66, CLOCK_PX = 40;

export default {
  id: 'nba-espn-20',
  size: { w: W, h: H },
  // before the game there is no score: the team panels close up on their letters and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -21% vs the broadcast, logos -9%; 80 % of the correction
  typeScale: 1.0, logoScale: 1.077,
  fonts: [FONTS.interTight],
  css: `
.sb-nba-espn-20 { font-family: 'SB Inter Tight', 'Arial', sans-serif; font-weight: 600; color: #fff; display: grid; grid-template-columns: ${TILE}px ${TEAM}px ${TILE}px ${TEAM}px ${CLOCK}px;
  grid-template-rows: minmax(0, 1fr); height: ${H}px; gap: 4px; padding: 4px; box-sizing: border-box; background: #111215; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nba-espn-20 .tile { display: grid; place-items: center; background: linear-gradient(#24262a, #0f1012); overflow: hidden; }
.sb-nba-espn-20 .tile .sb-logo { width: 92px; height: 84px; object-fit: contain; }   /* the frame's logos fill their tile and touch its edges */
.sb-nba-espn-20 .tm { display: flex; align-items: center; justify-content: space-between; padding: 0 16px 0 18px; outline: 2px dotted rgba(255,255,255,.16); outline-offset: -5px; }   /* flat colour with a fine stitched rim inside its edge, as in the frame */
.sb-nba-espn-20 .ab { font-size: ${ABBR_PX}px; letter-spacing: 3px; } .sb-nba-espn-20 .sc { font-size: ${SCORE_PX}px; font-weight: 700; line-height: 1; }
.sb-nba-espn-20 .ck { display: flex; align-items: center; justify-content: center; gap: 18px; font-size: ${CLOCK_PX}px; color: #d8d8d8;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 2px, transparent 2px 6px), linear-gradient(#26282c, #121315); }
.sb-nba-espn-20 .ck i { width: 2px; height: 46px; background: rgba(255,255,255,.25); }
.sb-nba-espn-20 .ck .w { font-size: ${CLOCK_PX * 0.72}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const parts = [];
    [g.away, g.home].forEach((t) => {
      const c = teamPair(g.away, g.home, '#3a3f47')[t === g.away ? 0 : 1];  // never two alike panels
      const tile = el('div', 'tile'); tile.appendChild(logo(t, 80));
      const p = el('div', 'tm');
      p.style.background = 'linear-gradient(' + shade(c, 0.03) + ', ' + shade(c, -0.1) + ')';   // flat, no gloss (frame sweep)
      p.style.color = panelInk(t, c);   // dark letters on a light pair colour (GS gold)
      p.appendChild(el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') p.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      // the record before the game at a fixed size (em followed the kit's own shrink and came out 5 px)
      else if (t.record) { const r = el('span', 'sc', t.record); r.style.whiteSpace = 'nowrap'; r.style.fontSize = (t.record.length > 3 ? 26 : 32) + 'px'; r.style.marginLeft = 'auto'; r.style.padding = '0 6px 0 12px'; p.appendChild(r); }  // the record before the game
      parts.push(tile, p);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('i'), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    if (g.status === 'pre') root.style.gridTemplateColumns = [TILE, TEAM - PRE_CUT, TILE, TEAM - PRE_CUT, CLOCK].map((v) => v + 'px').join(' ');
    root.append(...parts, ck);
  },
};
