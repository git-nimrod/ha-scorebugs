// "Two columns '10": after Fox's NFL bug (2010; frame: Patriots at Falcons). An upright box: each team as a column of its colour with its
// letters over a big score, yellow timeout bars down the outer edge; under them a navy band with the quarter and the clock, and below the
// box the down and distance on a navy plate.
import { el, statusText, teamColor, shade, scoreSlot, inkOn, FONTS } from '../kit.js';

const W = 340, H = 352, COL = 168, TOP = 196, BAND = 54, DOWN = 74, GAP = 10;
// letters 13 % of the box's width tall, scores 18 %, as on air (frame: NE 50 and 28 70 on a 385 px box); were 11 % and 21 %
const ABBR_PX = 48, SCORE_PX = 72, BAND_PX = 36, DOWN_PX = 38, PRE_TOP = 72;   // the columns' height with the letters only

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-fox-10',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off the columns hold the letters only and close up on the band; outside live play the down plate's room goes too
  // the down band's room only for a football game while it runs
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football ? H : closeUp(g) ? PRE_TOP + BAND : TOP + BAND }),
  // measured against the frame by the automatic audit: text -19% vs the broadcast; 80 % of the correction
  typeScale: 1.189,
  fonts: [FONTS.barlowSemi700, FONTS.barlowSemi600],   // the 600 file too: the frame's type is lighter than bold (only 700 was loaded, so 500 drew as 700)
  css: `
.sb-nfl-fox-10 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 600; color: #fff; }
/* face: FOX Team Box 2010: Barlow Semi Condensed Bold */
.sb-nfl-fox-10 .bx { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TOP + BAND}px; display: grid; grid-template-columns: ${COL}px ${COL}px; grid-template-rows: ${TOP}px ${BAND}px; column-gap: 4px;
  border-radius: 8px; overflow: hidden; background: #0d2440; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nfl-fox-10 .col::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(rgba(255,255,255,.06), rgba(0,0,0,0) 40%, rgba(0,0,0,.14)); }   /* flat colour, as on air */
.sb-nfl-fox-10 .col > .ab, .sb-nfl-fox-10 .col > .sc { position: relative; z-index: 1; }
.sb-nfl-fox-10 .col { position: relative; display: grid; grid-template-rows: auto 1fr; justify-items: center; padding-top: 12px; box-sizing: border-box; }
.sb-nfl-fox-10 .col .ab { font-size: ${ABBR_PX}px; line-height: 1.1; } .sb-nfl-fox-10 .col .sc { align-self: center; font-size: ${SCORE_PX}px; font-weight: 600; line-height: 1; }
.sb-nfl-fox-10 .tos { position: absolute; top: 14px; bottom: 14px; width: 8px; display: flex; flex-direction: column; gap: 8px; }
.sb-nfl-fox-10 .col.a .tos { left: 4px; } .sb-nfl-fox-10 .col.h .tos { right: 4px; }
.sb-nfl-fox-10 .tos i { flex: 1; background: #f2c230; } .sb-nfl-fox-10 .tos i.used { opacity: .2; }
.sb-nfl-fox-10 .band { grid-column: 1 / 3; display: flex; align-items: center; justify-content: space-around; background: linear-gradient(#173a63, #0b1f3a); font-size: ${BAND_PX}px; }
.sb-nfl-fox-10 .band .w { font-size: ${BAND_PX * 0.8}px; }
/* the quarter, clock and down in a light cool grey, as on air (not white) */
.sb-nfl-fox-10 .band, .sb-nfl-fox-10 .dn { color: #d3d9e0; }
.sb-nfl-fox-10 .dn { position: absolute; left: 0; right: 0; top: ${TOP + BAND + GAP}px; height: ${DOWN}px; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(#173a63, #0b1f3a); box-shadow: 0 3px 8px rgba(0,0,0,.5); font-size: ${DOWN_PX}px; }
.sb-nfl-fox-10 .dn:empty { display: none; }
.sb-nfl-fox-10 .sb-ord { font-size: .7em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (closeUp(g)) { bx.style.height = (PRE_TOP + BAND) + 'px'; bx.style.gridTemplateRows = PRE_TOP + 'px ' + BAND + 'px'; }
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k]) => {
      const c = teamColor(t, '#3a3f47');
      const col = el('div', 'col ' + k);
      col.style.background = 'linear-gradient(' + shade(c, 0.08) + ', ' + shade(c, -0.15) + ')'; col.style.color = inkOn(shade(c, -0.05));
      col.appendChild(el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (!closeUp(g)) col.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      const tos = el('span', 'tos');
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) tos.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      col.appendChild(tos);
      bx.appendChild(col);
    });
    const band = el('div', 'band');
    if (live) band.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')), el('span', '', g.clock || ''));
    else band.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(band);
    root.append(bx, el('div', 'dn', live && g.football && g.football.short ? g.football.short : ''));
  },
};
