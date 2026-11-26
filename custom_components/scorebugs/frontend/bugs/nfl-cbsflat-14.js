// "Flat bar '14": after CBS's NFL bug (2014-16; frame: Patriots v Rams). A flat bar: the network's mark on a blue square at the left (here
// the Home Assistant logo), then each team as a panel in its colour, its logo, its letters and its score, timeout dashes under the panel;
// a dark box with the quarter, the clock and the play clock's place; and the down and distance on a panel in the colour of the team with the ball.
import { el, logo, ordinal, pips, statusText, teamColor, shade, haMark, marks, teamInk, scoreSlot, FONTS } from '../kit.js';

const W = 1300, H = 76, MARK = 74, TEAM = 310, CLOCK = 300, SCORE_COL = 86, DOWN = W - MARK - 2 * TEAM - CLOCK;
// before and after the game the grey box only holds the start time or FINAL: it is narrower and the bar ends there
const CLOCK_IDLE = 200;
const ABBR_PX = 46, SCORE_PX = 52, CLOCK_PX = 42, DOWN_PX = 40;  // about 55 % of the bar's height, as on air

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const GLOSS14 = 'linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.07) 47%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.16))';
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-cbsflat-14',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off with no records to show, the empty score boxes go and the bar is shorter by their room (the team logos already stand in the bar, so the kit does not put them in the boxes)
  // outside live play the down and distance's room goes too
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (closeUp(g) ? 2 * SCORE_COL : 0) - (g.status === 'live' && g.football ? 0 : DOWN) - (g.status === 'live' ? 0 : CLOCK - CLOCK_IDLE), h: H }),
  // measured against the frame by the automatic audit: text -13% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  fonts: [FONTS.barlow500],
  css: `
.sb-nfl-cbsflat-14 { font-family: 'SB Barlow', 'Arial Narrow', sans-serif; font-weight: 600; font-stretch: 96%; color: #fff; display: grid; grid-template-columns: ${MARK}px ${TEAM}px ${TEAM}px ${CLOCK}px 1fr; height: ${H}px;
.sb-nfl-cbsflat-14 { font-weight: 500; font-stretch: 100%; }   /* face: Barlow 500 (high confidence) */
  box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-nfl-cbsflat-14 .mk { display: grid; place-items: center; background: linear-gradient(#2c6fc0, #164b8c); } .sb-nfl-cbsflat-14 .mk .sb-ha { color: #fff; }
.sb-nfl-cbsflat-14 .tm { position: relative; display: grid; grid-template-columns: 110px minmax(0, 1fr) 86px; align-items: center; overflow: hidden; }   /* a score never runs into the next team (the kit shrinks a three-figure score to fit) */
.sb-nfl-cbsflat-14 .tm .sb-logo { width: 96px; height: 58px;   /* centred before and after the game; lifted above the timeout dashes during play */ object-fit: contain; justify-self: center; }
.sb-nfl-cbsflat-14.is-live .tm .sb-logo { margin-bottom: 9px; } .sb-nfl-cbsflat-14.is-live .tm .ab { top: -4px; }
.sb-nfl-cbsflat-14 .tm .ab { position: relative; font-size: ${ABBR_PX}px; text-align: center; letter-spacing: 1px; }   /* a little high, clear of the dashes */
.sb-nfl-cbsflat-14 .tm .sc { height: 100%; display: grid; place-items: center; font-size: ${SCORE_PX}px; font-weight: 700; background: rgba(0,0,0,.22); }
.sb-nfl-cbsflat-14 .sb-pips { position: absolute; left: 12px; right: ${SCORE_COL + 12}px; bottom: 3px; display: flex; gap: 10px; } .sb-nfl-cbsflat-14 .sb-pips i { flex: 1; height: 4px;   /* long dashes under the logo and the name, as on air */ background: rgba(255,255,255,.95); }
.sb-nfl-cbsflat-14 .sb-pips i.used { opacity: .25; }
.sb-nfl-cbsflat-14 .ck { display: grid; grid-template-columns: 1fr 1.4fr 0.8fr; align-items: center; justify-items: center; background: linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.07) 47%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.16)), linear-gradient(#3f4248, #232529); font-size: ${CLOCK_PX}px; }
.sb-nfl-cbsflat-14 .ck .w { grid-column: 1 / 4; font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-cbsflat-14 .dd { display: grid; place-items: center; background: linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.07) 47%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.16)), linear-gradient(#df3530, #b31a15); font-size: ${DOWN_PX}px; }
.sb-nfl-cbsflat-14 .dd.off { background: linear-gradient(#46494f, #232529); }   /* the clock box's dark charcoal, as the frame (it was a blue-grey) */
.sb-nfl-cbsflat-14 .sb-ord { font-size: .62em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    if (live) root.classList.add('is-live');   // the logos lift clear of the timeout dashes only while there are dashes
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(42));
    const team = (t) => {
      const c = teamColor(t, '#3a3f47');
      const p = el('div', 'tm');
      p.style.background = GLOSS14 + ', linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.1) + ')';  // glossy on air: a lighter upper half and a soft line across the middle
      p.style.color = teamInk(c);
      p.append(logo(t, 84), el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (closeUp(g)) p.style.gridTemplateColumns = '110px 1fr'; else p.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      if (live && t.timeouts != null) p.appendChild(pips(t.timeouts, 3));
      return p;
    };
    const ck = el('div', 'ck');
    if (live) ck.append(ordinal(g.period), el('span', '', g.clock || ''), el('span'));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    const dd = el('div', 'dd', live && g.football && g.football.short ? g.football.short : '');
    if (!dd.textContent) dd.classList.add('off');
    // the down and distance in the colour of the team with the ball
    const lead = live ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    if (lead && dd.textContent) { const c = teamColor(lead, '#3a3f47'); dd.style.background = GLOSS14 + ', linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.1) + ')'; dd.style.color = teamInk(c); }
    const ckw = live ? CLOCK : CLOCK_IDLE;
    root.style.gridTemplateColumns = MARK + 'px ' + (closeUp(g) ? TEAM - SCORE_COL : TEAM) + 'px ' + (closeUp(g) ? TEAM - SCORE_COL : TEAM) + 'px ' + ckw + 'px 1fr';
    root.append(mk, team(g.away), team(g.home), ck); if (live && g.football) root.append(dd);
  },
};
