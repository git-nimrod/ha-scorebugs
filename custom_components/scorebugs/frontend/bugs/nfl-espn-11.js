// "Chrome bar '11": after ESPN's NFL bug (2011-16; frame: Eagles at Washington). A chrome bar with gold ends: the network's letters at the
// left (here the Home Assistant logo), each team on a dark plate with its logo, letters and its score in a darker box, yellow timeout
// dashes under the plate; then a silver plate with the quarter and clock and a dark plate with the down and distance.
import { el, logo, pips, statusText, haMark, marks, scoreSlot, teamColor, FONTS } from '../kit.js';

// narrower team cells: the score sits close after the letters
const W = 1050, H = 66, BAR = 54, MARK = 120, TEAM = 210, CLOCK = 210;
const ABBR_PX = 36, SCORE_PX = 40, CLOCK_PX = 34, DOWN_PX = 32, SCORE_W = 62, DN = 250;  // a narrower down plate // type at the frame's size; DN: the down plate with its gap

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-espn-11',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off with no records to show, the empty score boxes go and the bar is shorter by their room (the team logos already stand in the bar, so the kit does not put them in the boxes)
  // outside live play the down plate goes (it stood empty)
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (closeUp(g) ? 2 * SCORE_W : 0) - (g.status === 'live' && g.football ? 0 : DN), h: H }),
  fonts: [FONTS.barlow600],
  css: `
.sb-nfl-espn-11 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 600; color: #fff; }
.sb-nfl-espn-11 { font-weight: 600; font-stretch: 100%; }   /* face: Barlow 600 (medium confidence) */
.sb-nfl-espn-11 .bar { position: absolute; left: 0; top: 0; right: 0;   /* the stage width, so the gold end follows a shorter bar */ height: ${BAR}px; display: flex; align-items: stretch; gap: 5px; padding: 5px 12px;   /* heavier chrome lines between the parts */
  box-sizing: border-box;
  background: linear-gradient(#e6e8ea, #8d9197 50%, #b5b9be); border-left: 6px solid #c9a227; border-right: 6px solid #c9a227; box-shadow: 0 3px 6px rgba(0,0,0,.5); }
.sb-nfl-espn-11 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; }   /* the mark stands on the chrome itself, no plate (frame) */
.sb-nfl-espn-11 .mk .sb-ha { color: #f6f6f6; filter: drop-shadow(0 0 1px rgba(0,0,0,.9)) drop-shadow(0 1px 1px rgba(0,0,0,.6)); }
.sb-nfl-espn-11 .tm { position: relative; width: ${TEAM}px; flex: none; display: flex; align-items: center; gap: 8px; padding-left: 6px; box-sizing: border-box; background: linear-gradient(90deg, #2b2d31 0, #0a0b0c 30%, #000 60%); }   /* dark to black at once, no grey */
.sb-nfl-espn-11 .tm .sb-logo { width: 70px; height: 46px; object-fit: contain; } .sb-nfl-espn-11 .tm .ab { flex: 1; font-size: ${ABBR_PX}px; }
.sb-nfl-espn-11 .tm .sc { width: 62px; height: 100%; display: grid; place-items: center; background: #0c0d0f; font-size: ${SCORE_PX}px; font-weight: 700; line-height: 1; }
.sb-nfl-espn-11 .sb-pips { position: absolute; left: 10px; right: 70px; bottom: -14px; display: flex; gap: 10px; } .sb-nfl-espn-11 .sb-pips i { flex: 1; height: 4px; background: #f2c230; border-radius: 3px; }
/* used dashes dark grey pills with a faint rim, not faded yellow (2011-14 stills) */
.sb-nfl-espn-11 .sb-pips i.used { opacity: 1; background: #1e211e; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); }
/* the quarter and the clock in two maroon boxes, glossy (lit top half, a hard line at half, deep red under it) with faint "/" pinstripes,
 chrome between them (the silver plate was the 2010 frame's, the look of Chrome bar '08) */
.sb-nfl-espn-11 .ck { width: ${CLOCK}px; flex: 1 0 auto; display: flex; align-items: stretch; gap: 5px; color: #fff; font-size: ${CLOCK_PX}px; }
.sb-nfl-espn-11 .ck > span { display: grid; place-items: center; flex: 1.7; background: repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 2px, rgba(255,255,255,0) 2px 5px), linear-gradient(#4f2826, #7a4744 46%, #3e0204 50%, #300001 78%, #1e0605); }
.sb-nfl-espn-11 .ck > span:first-child:not(.w) { flex: 1; }
.sb-nfl-espn-11 .ck .w { font-size: ${CLOCK_PX * 0.85}px; }
.sb-nfl-espn-11 .dn { flex: none; width: ${DN - 9}px; display: grid; place-items: center; background: linear-gradient(#1b1c1f, #000); font-size: ${DOWN_PX}px; box-sizing: border-box; }   /* black, edged each side in the colour of the team with the ball */
/* glass across the whole bar: every plate gets the pale sheen over its top half, soft edge near the middle, darker foot,
 fine light top line; the faint "/" pinstripes of the clock boxes run on the team plates and the Home Assistant plate, which is black
 (recipe in lessons/nfl.md). Gradients only. */
.sb-nfl-espn-11 .bar { background: linear-gradient(180deg, rgba(255,255,255,.35) 0, rgba(255,255,255,0) 48%), linear-gradient(#e6e8ea, #8d9197 50%, #b5b9be); }
.sb-nfl-espn-11 .mk { background: repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, rgba(255,255,255,0) 2px 5px), linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), #000; box-shadow: inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(0,0,0,.6); }
.sb-nfl-espn-11 .tm { background: repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, rgba(255,255,255,0) 2px 5px), linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), linear-gradient(90deg, #2b2d31 0, #0a0b0c 30%, #000 60%); box-shadow: inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(0,0,0,.6); }
.sb-nfl-espn-11 .tm .sc { background: linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), #0c0d0f; }
.sb-nfl-espn-11 .dn { background: linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), linear-gradient(#1b1c1f, #000); box-shadow: inset 0 1px 0 rgba(255,255,255,.4); }
/* dividing lines thinner (bar gap 5 px); score boxes the greyish green of the 2011 stills (sampled #30352e to
 #363b35, flat; the glass sheen stays over it); each team plate carries the team's colour on the logo side, fading to the plates' charcoal
 (#3d4246 sampled behind the letters), so "dark to black at once" of Nov 23 is superseded */
.sb-nfl-espn-11 .tm .sc { background: linear-gradient(180deg, rgba(255,255,255,.08) 0, rgba(255,255,255,.03) 46%, rgba(255,255,255,0) 50%), #30352e; }
.sb-nfl-espn-11 .tm { background: repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 2px, rgba(255,255,255,0) 2px 5px), linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), linear-gradient(90deg, var(--tc, #2b2d31) 0, var(--tc, #2b2d31) 30%, #2b2f31 78%, #23282a 100%); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    if (closeUp(g)) bar.style.width = (W - 2 * SCORE_W) + 'px';
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(34));
    bar.appendChild(mk);
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'tm');
      tm.style.setProperty('--tc', teamColor(t, '#2b2d31'));
      tm.append(logo(t, 58), el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (closeUp(g)) tm.style.width = (TEAM - SCORE_W) + 'px'; else tm.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      bar.appendChild(tm);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(ck);
    if (live && g.football) {
      const dn = el('span', 'dn', g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '');
      const lead = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null;
      if (lead) { const c = teamColor(lead, '#3a3f47'); dn.style.borderLeft = dn.style.borderRight = '7px solid ' + c; }
      bar.append(dn);
    }
    root.appendChild(bar);
  },
};
