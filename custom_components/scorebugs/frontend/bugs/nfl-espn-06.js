// "Banner '06": after ESPN's Monday Night Football bug (2006). A black banner across the top of the screen: a centred row of each team's
// logo, letters and score on grey plates, then the quarter and the clock; under it a dark red band where the show's title sat (here the
// Home Assistant logo and the down and distance).
import { el, logo, statusText, haMark, marks, scoreSlot, FONTS, fit } from '../kit.js';

const W = 900, H = 62,  // the top bar only: the red band with the show's title is left out
  ROW = 50, TEAM = 104,  // smaller team boxes
  SCORE = 56, PER = 70, CLOCK = 130;
const ABBR_PX = 30, SCORE_PX = 34, CLOCK_PX = 30, BAND_PX = 26;

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-espn-06',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  hug: '.rim',   // the stage ends where the bar ends
  // before the kick-off with no records to show, the empty score boxes go and the bar is shorter by their room (the team logos already stand in the bar, so the kit does not put them in the boxes)
  sizeFor: (g) => (closeUp(g) ? { w: W - 2 * (SCORE + 4), h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -23% vs the broadcast, logos -19%; 80 % of the correction
  typeScale: 1.0, logoScale: 1.189,
  fonts: [FONTS.archivo],
  css: `
/* surface sweep to the frame (Ravens at Steelers): the scores in black on white plates, the quarter on black like the
 clock (it was the other way round), each team's plate light grey under its logo running into dark under its letters */
.sb-nfl-espn-06 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 600; font-stretch: 85%; color: #fff; }
.sb-nfl-espn-06 { font-weight: 700; font-stretch: 64%; }   /* narrow and tall, as on air (was 75 %) */
.sb-nfl-espn-06 .bn { position: absolute; inset: 0; display: grid; grid-template-rows: ${ROW + 12}px; }
.sb-nfl-espn-06 .row { display: flex; align-items: center; justify-content: flex-start; padding: 3px 0 0 3px; }
/* thin lines between the parts, a heavier frame all round */
.sb-nfl-espn-06 .rim { display: flex; align-items: center; gap: 2px; padding: 5px; border-radius: 3px; background: linear-gradient(#d9dde2, #8d939a 50%, #c6cbd0); box-shadow: 0 0 0 1px rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,.6); }   /* the thin chrome frame round the row, as on air */
.sb-nfl-espn-06 .row > * { height: ${ROW}px; box-sizing: border-box; }
.sb-nfl-espn-06 .tm { width: ${TEAM}px; display: flex; align-items: center; gap: 8px; padding: 0 10px 0 4px; background: #000; overflow: hidden; }   /* black boxes, true black */
.sb-nfl-espn-06 .tm .sb-logo { width: 70px; height: 70px; margin: -12px -4px -12px -8px; flex: none; object-fit: contain;
  filter: saturate(1.2) contrast(1.1) drop-shadow(0 -1px 0 rgba(255,255,255,.7)) drop-shadow(-1px 0 0 rgba(255,255,255,.35)) drop-shadow(2px 4px 2px rgba(0,0,0,.9)) !important; }
.sb-nfl-espn-06 .tm .ab { flex: 1; text-align: left; font-size: ${ABBR_PX}px; }   /* the letters right after the logo */
/* the letters clear of the logo, which is drawn 1.19 times its box (logoScale) and reached 3 to 8 px past where they began, as the
 kit slides each logo to its focal point; the box as wide as
 before, the letters running on to 4 px from the score plate, and a wider set (WSH) squeezed to that room by the kit (fit) instead of
 cut by the box's end */
.sb-nfl-espn-06 .tm { width: ${TEAM + 6}px; padding-right: 4px; } .sb-nfl-espn-06 .tm .ab { margin-left: 8px; }
.sb-nfl-espn-06 .sc { width: ${SCORE}px; display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 2px #fff; color: #000;   /* pure white, covering the metal round it */
  font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nfl-espn-06 .per { width: ${PER}px; display: grid; place-items: center; background: #000; font-size: ${CLOCK_PX * 0.85}px; }
.sb-nfl-espn-06 .clk { width: ${CLOCK}px; display: grid; place-items: center; background: #000; font-size: ${CLOCK_PX}px; }
.sb-nfl-espn-06 .clk.w { width: ${PER + CLOCK + 4}px; font-size: ${CLOCK_PX * 0.8}px; }
/* every plate as tall as the team boxes, top and foot in line, as on air (ours were 46, 34, 27 and 32 px tall, set by their letters) */
.sb-nfl-espn-06 .tm, .sb-nfl-espn-06 .sc, .sb-nfl-espn-06 .per, .sb-nfl-espn-06 .clk { height: 40px; }
/* glass: the 2006 plates are lit from above, a pale sheen over the top half that
 stops at a soft edge near the middle, a darker foot, and a fine light line along the top edge. Gradients only. */
.sb-nfl-espn-06 .tm, .sb-nfl-espn-06 .per, .sb-nfl-espn-06 .clk {
  background: linear-gradient(180deg, rgba(255,255,255,.30) 0, rgba(255,255,255,.12) 46%, rgba(255,255,255,0) 52%, rgba(0,0,0,.30) 100%), #000;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(0,0,0,.6); }
.sb-nfl-espn-06 .band { display: flex; align-items: center; justify-content: center; gap: 18px; font-size: ${BAND_PX}px; text-transform: uppercase;
  background: linear-gradient(90deg, #1a0204, #6e0a10 50%, #1a0204); border-top: 2px solid #8c1118; }
.sb-nfl-espn-06 .floor { background: repeating-linear-gradient(135deg, #1a0204 0 6px, #2a0508 6px 12px); }
.sb-nfl-espn-06 .band .sb-ha { color: #f2f2f2; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bn = el('div', 'bn'), wrap = el('div', 'row'), row = el('div', 'rim'); wrap.appendChild(row);
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'tm'); tm.append(logo(t, 70), fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      if (closeUp(g)) row.appendChild(tm); else row.append(tm, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
    });
    if (live) row.append(el('span', 'per', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', 'clk', g.clock || ''));
    else row.appendChild(el('span', 'clk w', statusText(g, time)));
    // the red band under the bar (the show's title) is left out: the bug is the bar alone
    bn.append(wrap);
    root.appendChild(bn);
  },
};
