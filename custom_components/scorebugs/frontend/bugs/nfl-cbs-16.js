// "Slate blocks '16": after CBS's NFL bug (2016-20; frame: Panthers at Broncos). A dark slate bar: the network's mark at the left (here
// the Home Assistant logo), then each team as a flat block in its colour with its logo and letters (a dot before the team with the ball)
// and its score on a darker part of the block; then the quarter and the clock on the bar.
// Reordered to the frame (pack FOO0031): the down and distance closes the bar at the right end in an orange-red box (it
// was a white capsule after the mark); before and after the game that end stays empty.
import { el, logo, ordinal, pips, statusText, teamColor, shade, haMark, marks, teamInk, scoreSlot, FONTS, TOKENS } from '../kit.js';

const H = 70, MARK = 70, DOWN = 240, TEAM = 210, SCORE = 74, CLOCK = 250, W = MARK + 2 * (TEAM + SCORE) + CLOCK + DOWN;   // the sum of its parts (extra room stood empty)
const DOWN_PX = 36, ABBR_PX = 44, SCORE_PX = 46, CLOCK_PX = 38;  // the letters about 55 % of the bar's height, as on air

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);
// a sport that keeps room for three figures (basketball) widens each score slot past SCORE (scoreSlot): the bar grows by that much, so
// the clock at its right end is not pushed off it
const wider = (g) => 2 * Math.max(0, Math.ceil((TOKENS.scoreDigits[g.sport] || TOKENS.scoreDigits.default) * TOKENS.figure * SCORE_PX - SCORE));

export default {
  id: 'nfl-cbs-16',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off with no records to show, the empty score boxes go and the bar is shorter by their room (the team logos already stand in the bar, so the kit does not put them in the boxes)
  // outside live play there is no down and distance: its room at the right end goes too
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (closeUp(g) ? 2 * SCORE : 0) - (g.status === 'live' && g.football ? 0 : DOWN) + (closeUp(g) ? 0 : wider(g)), h: H }),
  fonts: [FONTS.barlow500, FONTS.barlow600],
  css: `
.sb-nfl-cbs-16 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 500; color: #fff; line-height: 1; }   /* DIN medium on air: a lighter weight than bold */
/* face: CBS NFL 2016-21: Barlow Bold (confirmed) */
/* surface sweep to the frame (Panthers at Broncos): a dark slate bar with square ends; each team a flat block in its
 colour, lighter at the top, its score on a darker part of the same colour, three timeout bars under the logo and letters; the clock
 on the bar itself and the down and distance a block at the right end in the colour of the team with the ball. No capsules, no chrome. */
.sb-nfl-cbs-16 .bar { position: absolute; inset: 0; display: flex; align-items: stretch; padding: 2px; gap: 0; border-radius: 3px; box-sizing: border-box;
  background: linear-gradient(#34404b, #1d252d); box-shadow: 0 3px 6px rgba(0,0,0,.45); }
/* a glassy sheen over the whole bar: a light upper half and a soft horizon */
.sb-nfl-cbs-16 .bar::after { content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.06) 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,.12)); }
.sb-nfl-cbs-16 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; }
.sb-nfl-cbs-16 .mk .sb-ha { color: #f2f4f6; }
.sb-nfl-cbs-16 .cap { flex: none; display: flex; align-items: center; justify-content: center; }
.sb-nfl-cbs-16 .dn { width: ${DOWN}px; font-size: ${DOWN_PX}px; white-space: nowrap; margin-left: auto; }
.sb-nfl-cbs-16 .dn.on { background: linear-gradient(#f4552a, #d23a12); box-shadow: inset 0 0 0 2px rgba(255,190,150,.55); }
.sb-nfl-cbs-16 .tm { position: relative; width: ${TEAM}px; justify-content: space-between; padding: 0 14px 4px 6px; box-sizing: border-box; }
.sb-nfl-cbs-16 .tm .sb-logo { width: 80px; height: 60px; object-fit: contain; }
.sb-nfl-cbs-16.is-live .tm .ab { top: -6px; }
.sb-nfl-cbs-16 .tm .ab { position: relative; font-size: ${ABBR_PX}px; letter-spacing: 1px; }   /* the letters ride high so the timeout dashes along the foot stay clear of them; the logo stays centred */ .sb-nfl-cbs-16 .tm .ab b { font-size: .6em; vertical-align: .3em; margin-right: 6px; }
.sb-nfl-cbs-16 .tm .sb-pips { position: absolute; left: 6px; width: 72px; bottom: 2px; display: flex; gap: 6px; }   /* under the logo, as on air */
.sb-nfl-cbs-16.is-live .tm .sb-logo { height: 56px; margin-top: -10px; }   /* lifted clear of the dashes under it */
.sb-nfl-cbs-16 .tm .sb-pips i { flex: 1; height: 3px; background: rgba(255,255,255,.9); } .sb-nfl-cbs-16 .tm .sb-pips i.used { opacity: .25; }
.sb-nfl-cbs-16 .sc { width: ${SCORE}px; font-size: ${SCORE_PX}px; line-height: 1; margin-right: 0; }
.sb-nfl-cbs-16 .ck { width: ${CLOCK}px; justify-content: space-evenly; font-size: ${CLOCK_PX}px; font-weight: 500; }
.sb-nfl-cbs-16 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-cbs-16 .sb-ord { font-size: .62em; vertical-align: .5em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    if (live) root.classList.add('is-live');   // the letters ride high only while the timeout dashes are there
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(30));
    bar.append(mk);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'cap tm');
      tm.style.background = 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.08) + ')';
      tm.style.color = teamInk(c);
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      const ab = el('span', 'ab');
      if (live && t.hasBall) ab.appendChild(el('b', '', '●'));
      ab.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      tm.append(logo(t, 60), ab);
      const sc = scoreSlot(el('span', 'cap sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      sc.style.background = 'linear-gradient(' + shade(c, -0.08) + ', ' + shade(c, -0.25) + ')'; sc.style.color = teamInk(shade(c, -0.18));
      if (closeUp(g)) bar.appendChild(tm); else bar.append(tm, sc);
    });
    const ck = el('div', 'cap ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', '', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    const dd = live && g.football && g.football.short ? g.football.short : '';
    bar.append(ck);
    if (g.status === 'live' && g.football) {
      const dn = el('span', 'cap dn' + (dd ? ' on' : ''), dd);
      // in the colour of the team with the ball
      const lead = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null;
      if (dd && lead) { const c = teamColor(lead, '#3a3f47'); dn.style.background = 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.12) + ')'; dn.style.boxShadow = 'inset 0 0 0 2px rgba(255,255,255,.3)'; dn.style.color = teamInk(c); }
      bar.append(dn);
    }
    root.appendChild(bar);
  },
};
