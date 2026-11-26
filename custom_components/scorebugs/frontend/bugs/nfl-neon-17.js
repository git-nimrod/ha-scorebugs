// "Neon bar '17": after ESPN's Monday Night Football bar (2017-2022; frame: Seahawks at Bears). A black bar: the down and distance in a
// neon green arrow at the left, each team as its logo on a glossy panel of its colour with its letters and score in italic capitals, then
// the quarter and the clock, and the programme's mark at the right end (here the Home Assistant logo). The play clock in its red box
// needs data the sensor lacks.
// Two bugs had been built from this one frame (Neon bar '17 and Arrow tab '20); merged on the picks: the sections'
// widths, the green arrow and its type from Arrow tab; the team panels, logos and colours, the team type, and the quarter, clock and
// mark from Neon bar. The old id nfl-espn-20 now draws this bug (kit RETIRED).
import { el, logo, pips, statusText, teamColor, shade, haMark, marks, scoreSlot, FONTS, GLOSS } from '../kit.js';

const H = 74, DOWN = 220, TEAM = 320, CLOCK = 200, MARK = 64;
const DOWN_PX = 36, ABBR_PX = 50, SCORE_PX = 52, CLOCK_PX = 42, GAP = 6, SCORE_ROOM = 60;
// the mark right after the clock, no empty run before it
const W = 4 + DOWN + GAP + 2 * TEAM + GAP + GAP + CLOCK + GAP + MARK + 10;

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-neon-17',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // outside live play there is no down and distance, so its arrow's room goes; before the kick-off the score room goes too and the teams
  // close up
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  hug: '.bar',   // the stage ends at the mark
  sizeFor: (g) => ({ w: g.status === 'live' && g.football ? W : closeUp(g) ? W - DOWN - GAP - 2 * SCORE_ROOM : W - DOWN - GAP, h: H }),
  fonts: [FONTS.barlowCond700i, FONTS.saira, FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-nfl-neon-17 { font-family: 'SB Barlow Condensed', 'Arial Black', sans-serif; font-weight: 700; font-style: italic; color: #fff; }
.sb-nfl-neon-17 .bar { position: absolute; inset: 0; display: flex; align-items: stretch; gap: ${GAP}px; padding: 4px 10px 4px 4px; box-sizing: border-box; background: linear-gradient(#26282c, #050506); box-shadow: 0 3px 6px rgba(0,0,0,.5); }
/* the arrow and its type from Arrow tab '20: black at its tail running into neon green at its point, inside a thin bright outline */
.sb-nfl-neon-17 .dn { width: ${DOWN}px; flex: none; display: grid; place-items: center; padding-right: 18px; box-sizing: border-box; font-size: ${DOWN_PX}px;
  font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 900; font-stretch: 76%; position: relative; background: #c9ef4a; clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%); }
.sb-nfl-neon-17 .dn::before { content: ''; position: absolute; inset: 2px 3px 2px 0; clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%);
  background: linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,0) 50%), linear-gradient(90deg, #050605 0%, #0f1a06 30%, #5f8a12 68%, #b9e23a 100%); }
.sb-nfl-neon-17 .dn > span { position: relative; z-index: 1; color: #eef7d2; }
/* the team panels from Neon bar '17: the colour across the whole panel, the logo big and cut at its foot so its top shows */
.sb-nfl-neon-17 .tm { position: relative; width: ${TEAM}px; flex: none; display: flex; align-items: center; gap: 14px; padding: 0 16px 10px 0; box-sizing: border-box; overflow: hidden; }
.sb-nfl-neon-17 .tm .sb-logo { width: 150px; height: 96px; margin: -17px 4px -17px 0; object-fit: cover; }   /* cut by the panel, centred on the logo's focal point */
.sb-nfl-neon-17 .tm .ab { font-size: ${ABBR_PX}px; } .sb-nfl-neon-17 .tm .sc { margin-left: auto; min-width: 40px; text-align: right; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nfl-neon-17 .tm .to { position: absolute; left: 170px; right: 20px; bottom: 3px; display: flex; gap: 10px; } .sb-nfl-neon-17 .tm .to i { flex: 1; height: 4px; background: #f2f2f2; } .sb-nfl-neon-17 .tm .to i.used { opacity: .25; }
/* the quarter, clock and mark from Neon bar '17 */
.sb-nfl-neon-17 .ck { width: ${CLOCK}px; flex: none; display: flex; align-items: center; gap: 18px; padding-left: 14px; box-sizing: border-box; font-weight: 500; font-size: ${CLOCK_PX}px; color: #d9dbde; border-left: 2px solid #3a3c40; }
.sb-nfl-neon-17 .ck .w { font-size: ${CLOCK_PX * 0.85}px; }
.sb-nfl-neon-17 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; } .sb-nfl-neon-17 .mk .sb-ha { color: #e8343a; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    if (live && g.football) { const dn = el('span', 'dn'); dn.appendChild(el('span', '', g.football.short || '')); bar.appendChild(dn); }
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm'); tm.style.background = GLOSS + ', linear-gradient(90deg, ' + shade(c, -0.05) + ', ' + shade(c, -0.6) + ')';
      const lo = logo(t, 120);
      tm.append(lo, el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (closeUp(g)) tm.style.width = (TEAM - SCORE_ROOM) + 'px';
      else tm.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      // the timeouts left as white dashes along the foot of the team panel during play, as on air
      if (live && t.timeouts != null) { const p = pips(t.timeouts, 3); p.classList.add('to'); tm.appendChild(p); }
      bar.appendChild(tm);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', (g.period.label || '') + (g.period.suffix || '')), el('span', '', g.clock || ''));
    else { ck.appendChild(el('span', 'w', statusText(g, time))); ck.style.width = 'auto'; ck.style.paddingRight = '14px'; }  // before and after the game the box fits its text and the mark comes up beside it
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(50));
    bar.append(ck, mk);
    root.appendChild(bar);
  },
};
