// "Flat bar '18": after NBC's Sunday Night Football bar (2017-2022; frames: Eagles v Patriots, Super Bowl LII, during play and at the
// end). A dark bar: the network's mark on a light plate at the left (here the Home Assistant logo), each team as a slanted panel that runs
// from its colour into the dark with its logo, letters and score, then the quarter and clock (the play clock's place left out: no data)
// and the down and distance on a panel in the colour of the team with the ball.
// Two bugs had been built from this one look (Flat bar '18 and Dark teal '20); merged on the picks: the slanted
// panels and the teams' own parts, and the teal down-and-distance colour, from Dark teal; the logos (brighter, lit edge and shadow), the
// type and the down-and-distance panel's width from Flat bar. The old id nfl-nbc-20 now draws this bug (kit RETIRED).
import { el, logo, statusText, teamColor, shade, teamInk, haMark, marks, scoreSlot, fit, pips, FONTS } from '../kit.js';

// the stripe along the top of a team's panel (on air PHI's
// panel has a light teal line, NE's and the down panel a red one, about 4 px of 49): the team's other colour when it is a real colour (not
// grey, black or white), brightened to a visible stripe; else the panel's own colour brightened
const lum = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return 0; const v = m.slice(1).map((x) => parseInt(x, 16)); return (Math.max(...v) + Math.min(...v)) / 510; };
const sat = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return 0; const v = m.slice(1).map((x) => parseInt(x, 16)); return (Math.max(...v) - Math.min(...v)) / 255; };
// the colour kept as it is but brightened to a visible stripe (its strongest channel raised to 205: navy becomes a clear blue, a dark teal a bright teal)
const bright = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return hex; const v = m.slice(1).map((x) => parseInt(x, 16)), k = Math.max(1, 205 / Math.max(...v, 1)); return '#' + v.map((x) => Math.min(255, Math.round(x * Math.max(1, k))).toString(16).padStart(2, '0')).join(''); };
function stripe(t, c) {
  const other = [t.color2, t.color].find((x) => /^#[0-9a-f]{6}$/i.test(x || '') && x.toLowerCase() !== String(c).toLowerCase() && sat(x) > 0.25 && Math.abs(lum(x) - lum(c)) > 0.05);
  return bright(other || c);
}
const withStripe = (bg, s) => 'linear-gradient(' + s + ', ' + s + ' ' + STRIPE + 'px, rgba(0,0,0,0) ' + STRIPE + 'px), ' + bg;

const H = 60, MARK = 96, TEAM = 250, CLOCK = 210, DOWN = 286, GAP = 3;   // DOWN: the down and distance panel, Flat bar's width
// every box leans by the same SLANT px, so neighbours nest with one even gap
const SLANT = 12, STRIPE = 4;
const W = 10 + MARK + 2 * TEAM + CLOCK + DOWN + 4 * (GAP - SLANT), DOWN_ROOM = DOWN + GAP - SLANT;
const ABBR_PX = 36, SCORE_PX = 42, CLOCK_PX = 34, DOWN_PX = 34;

export default {
  id: 'nfl-flat-18',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // the teal down-and-distance panel only while the game is on (it stood empty before and after); before the kick-off the score room
  // goes too and both team panels close up on their letters
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (g.status === 'live' && g.football ? 0 : DOWN_ROOM), h: H }),  // before the game the records stand in the scores' place
  fonts: [FONTS.barlow600],
  css: `
.sb-nfl-flat-18 { font-family: 'SB Barlow', Arial, sans-serif; font-weight: 600; font-style: normal; color: #fff; }   /* Flat bar's upright type */
.sb-nfl-flat-18 .bar { position: absolute; inset: 0; display: flex; align-items: stretch; gap: ${GAP}px; padding: 5px; box-sizing: border-box; border-radius: 4px;
  background: linear-gradient(#3a3c41, #1b1c1f); box-shadow: 0 3px 6px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.25); }   /* grey */
.sb-nfl-flat-18 .bar > * { clip-path: polygon(${SLANT}px 0, 100% 0, calc(100% - ${SLANT}px) 100%, 0 100%); margin-right: -${SLANT}px; }
/* loop pass 2: the bar's two outer ends lean like every join (on air the mark plate's
 left edge and the down panel's right edge lean the same 12 px); only the last box drops its negative margin */
.sb-nfl-flat-18 .bar > :last-child { margin-right: 0; }
.sb-nfl-flat-18 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; background: linear-gradient(#ffffff, #c9ced3); } .sb-nfl-flat-18 .mk .sb-ha { color: #1b1d21; }
.sb-nfl-flat-18 .tm { width: ${TEAM}px; flex: none; display: flex; align-items: center; padding: 0 ${8 + SLANT}px 0 ${SLANT}px; box-sizing: border-box; gap: 8px; }
.sb-nfl-flat-18 .tm .sb-logo { flex: none; width: 90px; height: 76px; margin: 0 -8px 0 -14px; object-fit: contain; opacity: .72;   /* a little faded into its panel, as Dark teal had it */
 
  filter: drop-shadow(0 -1px 0 rgba(255,255,255,.35)) drop-shadow(2px 3px 2px rgba(0,0,0,.75)); }   /* big and cut by the slanted cell, but clear: Flat bar's lit edge and shadow */
.sb-nfl-flat-18 .tm .ab { flex: 1; text-align: right; font-size: ${ABBR_PX}px; } .sb-nfl-flat-18 .tm .sc { flex: none; font-size: ${SCORE_PX}px; font-weight: 700; line-height: 1; text-align: right; }
/* timeout dashes: white bars along the panel's foot under the logo and the letters, as on air (they were missing) */
.sb-nfl-flat-18 .tm { position: relative; }
.sb-nfl-flat-18 .tm .sb-pips { position: absolute; left: ${SLANT + 8}px; right: 84px; bottom: 2px; display: flex; gap: 8px; }
.sb-nfl-flat-18 .tm .sb-pips i { flex: 1; height: 4px; background: rgba(240,244,246,.95); }
.sb-nfl-flat-18 .tm .sb-pips i.used { opacity: .25; }
.sb-nfl-flat-18 .ck { width: ${CLOCK}px; flex: none; display: flex; align-items: center; justify-content: space-evenly; padding: 0 ${SLANT}px; box-sizing: border-box; font-size: ${CLOCK_PX}px; background: linear-gradient(#62646b, #3b3c42 50%, #26272c); }   /* the time box is black falling from a dark grey top to near-black (the still's box reads #363a41 on average, L 40 at the top, 20 at the foot) */
.sb-nfl-flat-18 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-flat-18 .dn { width: ${DOWN}px; flex: none; display: grid; place-items: center; font-size: ${DOWN_PX}px; background: linear-gradient(#56585e, #303135); }   /* in the colour of the team with the ball */
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(36));
    bar.appendChild(mk);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      // the colour fading softly into the dark, a faint sheen over the top
      const tm = el('div', 'tm'); tm.style.background = withStripe('linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 50%, rgba(0,0,0,.15)), linear-gradient(90deg, ' + shade(c, -0.08) + ', ' + shade(c, -0.55) + ' 80%)', stripe(t, c));
      tm.append(logo(t, 124), fit(el('span', 'ab', (t.abbr || '').toUpperCase())));   // the letters give way, never the score
      if (g.status !== 'pre') tm.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      // the record before the game at a fixed size (em followed the kit's own shrink and came out 5 px)
      else if (t.record) { const r = el('span', 'sc', t.record); r.style.whiteSpace = 'nowrap'; r.style.fontSize = (t.record.length > 4 ? 22 : 28) + 'px'; tm.appendChild(r); }
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      bar.appendChild(tm);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(ck);
    if (live && g.football) {
      const dn = el('span', 'dn', g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '');
      const lead = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null;
      if (lead) { const c = shade(teamColor(lead, '#3a3f47'), -0.1); dn.style.background = withStripe('linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 50%, rgba(0,0,0,.15)), ' + c, stripe(lead, c)); dn.style.color = teamInk(c); }
      bar.append(dn);
    }
    root.appendChild(bar);
  },
};
