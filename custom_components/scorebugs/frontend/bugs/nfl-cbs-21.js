// "Dark chrome '21": after CBS's NFL bug (2021-23; frames: Titans at Texans, Chiefs at Buccaneers). A dark grey bar: the network's mark
// on a near-black square at the left (here the Home Assistant logo), then each team as one flat block in its colour with its logo,
// letters (a dot before the team with the ball) and score; then the quarter and the clock on a near-black box, and the play clock's
// small box (left out: no data).
// Reordered to the frames (pack FOO0005, Super Bowl LV): the down and distance closes the bar at the right end, white
// on the dark chrome behind a thin rule (it was a white capsule after the mark); before and after the game that end stays empty.
import { el, logo, ordinal, pips, statusText, teamColor, shade, haMark, marks, teamInk, scoreSlot, FONTS } from '../kit.js';

// team block (logo to score) 262 px, about 4.2 times the bar's height as on air (Chiefs block 127 of a 30 px bar); was 306
const H = 62, MARK = 60, DOWN = 260, TEAM = 192, SCORE = 70, CLOCK = 250, W = MARK + 2 * (TEAM + SCORE) + CLOCK + DOWN;   // the sum of its parts (an extra 58 px stood empty)
const DOWN_PX = 30, ABBR_PX = 34, SCORE_PX = 38, CLOCK_PX = 34;

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-cbs-21',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off with no records to show, the empty score boxes go and the bar is shorter by their room (the team logos already stand in the bar, so the kit does not put them in the boxes)
  // outside live play there is no down and distance: its room at the right end goes too
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (closeUp(g) ? 2 * SCORE : 0) - (g.status === 'live' && g.football ? 0 : DOWN), h: H }),
  fonts: [FONTS.figtree],
  css: `
.sb-nfl-cbs-21 { font-family: 'SB Figtree', 'Arial', sans-serif; font-weight: 700; font-stretch: 90%; color: #fff; }
/* face: CBS NFL 2021-23: Figtree (confirmed) */
/* surface sweep to the frame (Chiefs at Buccaneers): a dark grey bar with square ends; the network's mark on a near-black
 square; each team one flat block in its colour holding the logo (big, standing out over the top), letters and score, three timeout
 bars along its foot; the quarter and clock on a near-black box. No silver plates, no fade to dark. */
.sb-nfl-cbs-21 .bar { position: absolute; inset: 0; display: flex; align-items: stretch; gap: 0; padding: 0; border-radius: 2px;
  background: linear-gradient(#45484d, #2e3135); box-shadow: 0 3px 6px rgba(0,0,0,.5); }
.sb-nfl-cbs-21 .mk { width: ${MARK + 10}px; flex: none; display: grid; place-items: center; background: #141517; }
.sb-nfl-cbs-21 .mk .sb-ha { color: #e8e9eb; }
.sb-nfl-cbs-21 .dn { width: ${DOWN}px; flex: none; display: grid; place-items: center; font-size: ${DOWN_PX}px; white-space: nowrap; margin-left: auto; }
.sb-nfl-cbs-21 .dn.on { border-left: 2px solid rgba(255,255,255,.25); }
.sb-nfl-cbs-21 .tm { position: relative; width: ${TEAM}px; flex: none; display: flex; align-items: center; justify-content: space-between; padding: 0 14px 4px 6px; box-sizing: border-box; overflow: hidden; }
/* bigger logos running down behind the timeout dashes and cut off there, as on air */
.sb-nfl-cbs-21 .tm .sb-logo { width: 84px; height: 72px; object-fit: contain; object-position: 50% 0; margin: 2px 0 -22px; align-self: flex-start; filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
/* during play the logo stops hard at the dashes' line: nothing of it shows below them */
.sb-nfl-cbs-21.is-live .tm .sb-logo { clip-path: inset(0 0 15px 0); }   /* cut right at the dashes' top edge */
.sb-nfl-cbs-21.is-live .tm .ab { top: -6px; }
.sb-nfl-cbs-21 .tm .ab { position: relative; font-size: ${ABBR_PX}px; letter-spacing: 1px; }   /* the letters ride high so the timeout dashes along the foot stay clear of them; the logo stays centred */ .sb-nfl-cbs-21 .tm .ab b { font-size: .55em; vertical-align: .3em; margin-right: 6px; }
.sb-nfl-cbs-21 .sb-pips { position: absolute; left: 10px; right: ${SCORE + 10}px; bottom: 2px; display: flex; gap: 8px; z-index: 1; }
.sb-nfl-cbs-21 .sb-pips i { flex: 1; height: 3px; background: rgba(255,255,255,.85); } .sb-nfl-cbs-21 .sb-pips i.used { opacity: .25; }
.sb-nfl-cbs-21 .sc { width: ${SCORE}px; flex: none; display: grid; place-items: center; font-size: ${SCORE_PX}px; line-height: 1; padding-bottom: 4px; box-sizing: border-box; }
.sb-nfl-cbs-21 .ck { width: ${CLOCK}px; flex: none; display: flex; align-items: center; justify-content: space-evenly; font-size: ${CLOCK_PX}px; background: #141517; }
.sb-nfl-cbs-21 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-cbs-21 .sb-ord { font-size: .62em; vertical-align: .5em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    if (live) root.classList.add('is-live');   // the letters ride high only while the timeout dashes are there
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(28));
    bar.append(mk);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm');
      // one flat block for the team, logo to score (the frame), a little lighter at the top
      const blk = el('div', 'blk');
      blk.style.cssText = 'display:flex;flex:none;position:relative;background:linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.06) + ');color:' + teamInk(c);
      const ab = el('span', 'ab');
      if (live && t.hasBall) ab.appendChild(el('b', '', '●'));
      ab.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      tm.append(logo(t, 56), ab);
      if (closeUp(g)) blk.appendChild(tm); else blk.append(tm, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      if (live && t.timeouts != null) blk.appendChild(pips(t.timeouts, 3));
      bar.append(blk);
    });
    const ck = el('div', 'ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', '', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    const dd = live && g.football && g.football.short ? g.football.short : '';
    bar.append(ck); if (g.status === 'live' && g.football) bar.append(el('span', 'dn' + (dd ? ' on' : ''), dd));
    root.appendChild(bar);
  },
};
