// "Team blocks '25": after the 2025 NFL Sunday package on CBS. A strip of three parts: each team a block in its own colour with the logo
// and a big bold score (three timeout dashes under it), and a centre panel: a grey top band and a black band with the quarter | clock.
// The centre's top band carries the down and distance in the colour of the team with the ball. Glossy blocks, logos with a raised
// shadow, scores as tall as the bar allows; before the game the record stands beside the logo.
import { el, logo, ordinal, pips, statusText, teamColor, shade, teamInk, FONTS } from '../kit.js';

const W = 800, H = 112;
// measured against the frame: logos are cut to their artwork, so the box is the artwork's
const LOGO_W = 124, LOGO_H = 90,  // bigger logos
  SCORE_PX = 88, CLOCK_PX = 30, SCORE_COL = 124, REC_COL = 96;
// (Nov 23 sweep) the frame's parts measured across the bar: each team block 0.32 of it, the centre 0.36
const TEAM = 256, MID = W - 2 * TEAM;

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.team.away > div.score', 2.5, 0.5, 0],
  ['div.team.home > div.score', 9, -2, 0],
];

export default {
  id: 'nfl-blocks-25',
  sizedFor: 0.7,   // sizes were measured in SB Montserrat Heavy; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score columns go and both blocks close up on the centre panel
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * (SCORE_COL - REC_COL), h: H } : { w: W, h: H }),
  nudge: NUDGE,
  fonts: [FONTS.barlow800],
  css: `
.sb-nfl-blocks-25 { font-family: 'SB Barlow', 'Montserrat', 'Arial Black', sans-serif; color: #fff; display: flex; height: ${H}px; filter: drop-shadow(0 3px 6px rgba(0,0,0,.5)); }
.sb-nfl-blocks-25 { font-weight: 800; }   /* CBS Eyebar 2024-25: Barlow ExtraBold */
.sb-nfl-blocks-25 .team { position: relative; width: ${TEAM}px; display: grid; grid-template-columns: 1fr 124px; align-items: center; background-image: linear-gradient(rgba(255,255,255,.05), rgba(0,0,0,.05)); overflow: hidden; }   /* matte, as the frame */
.sb-nfl-blocks-25 .team.home .sb-logo { justify-self: center; margin: 0; }
.sb-nfl-blocks-25 .team.away { border-radius: 8px 0 0 8px; } .sb-nfl-blocks-25 .team.home { border-radius: 0 8px 8px 0; }
.sb-nfl-blocks-25 .sb-logo { width: ${LOGO_W}px; height: ${LOGO_H}px; object-fit: contain; justify-self: center; margin: 0;   /* centred in its own column at the outer end, clear of the score, as on air */ filter: drop-shadow(2px 3px 0 rgba(0,0,0,.35)) drop-shadow(0 0 2px rgba(0,0,0,.45)); }
.sb-nfl-blocks-25 .rec.pre { position: static; align-self: center; justify-self: center; font-size: 34px; font-weight: 800; color: inherit; }
.sb-nfl-blocks-25 .score { position: relative; height: 100%; display: grid; place-items: center; font-weight: 900; font-size: ${SCORE_PX}px; line-height: 1; padding-bottom: 8px; box-sizing: border-box; }
.sb-nfl-blocks-25 .sb-pips { position: absolute; left: 0; right: 0; bottom: 9px; display: flex; justify-content: center; gap: 10px; }
.sb-nfl-blocks-25 .sb-pips i { width: 28px; height: 4px; background: #fff; border-radius: 1px; } .sb-nfl-blocks-25 .sb-pips i.used { opacity: .25; }
.sb-nfl-blocks-25 .ball { position: absolute; top: 8px; right: 122px; width: 0; height: 0; border-top: 7px solid transparent; border-bottom: 7px solid transparent; border-left: 11px solid #fff; }
.sb-nfl-blocks-25 .team.home .ball { right: auto; left: 10px; }
.sb-nfl-blocks-25 .mid { width: ${MID}px; display: grid; grid-template-rows: 1fr 1fr; border-left: 6px solid #08090a; border-right: 6px solid #08090a; box-sizing: border-box; }   /* black dividers between the teams and the centre, as on air */
.sb-nfl-blocks-25 .top { background: #3c3e42; display: grid; place-items: center; font-weight: 800; font-size: 30px; letter-spacing: .5px; color: #f2f2f2; }
.sb-nfl-blocks-25 .bot { background: #0e0e0f; display: flex; align-items: center; justify-content: center; gap: 16px; font-weight: 800; font-size: ${CLOCK_PX}px; }
.sb-nfl-blocks-25 .bar { width: 2px; height: 30px; background: #7a7c80; }
.sb-nfl-blocks-25 .sb-ord { font-size: .62em; }
`,
  draw(root, g, { time }) {
    const team = (t, side) => {
      const c = teamColor(t, '#2f3236');
      const b = el('div', 'team ' + side);
      b.style.backgroundColor = c;
      b.style.color = teamInk(c);
      const sc = el('div', 'score', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      if (g.sport === 'football' && g.status === 'live') sc.appendChild(pips(t.timeouts, 3));
      if (side === 'home') b.style.gridTemplateColumns = SCORE_COL + 'px 1fr';
      if (g.status === 'pre') {  // before the game: the logo and the record
        b.style.width = (TEAM - SCORE_COL + REC_COL) + 'px'; b.style.gridTemplateColumns = side === 'home' ? REC_COL + 'px 1fr' : '1fr ' + REC_COL + 'px';
        const lg = logo(t, 104); lg.style.justifySelf = 'center'; lg.style.margin = '0';
        // a long record (10-14-1) a step smaller in px:.75em of the block's own size made it a speck
        const r = el('span', 'rec pre', t.record || ''); r.style.whiteSpace = 'nowrap'; if ((t.record || '').length > 5) r.style.fontSize = '24px'; b.append(...(side === 'home' ? [r, lg] : [lg, r]));
      }
      else if (side === 'home') b.append(sc, logo(t, 104)); else b.append(logo(t, 104), sc);
      // no record in the corner during and after the game: the frame has none, and at that size it could not be read
      return b;
    };
    const mid = el('div', 'mid');
    const top = el('div', 'top', g.status === 'live' && g.football && g.football.short ? g.football.short : g.status === 'live' ? '' : g.league);
    const ballTeam = g.status === 'live' ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    if (ballTeam) { const c = teamColor(ballTeam, '#3c3e42'); top.style.background = 'linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.04) + ')'; top.style.color = teamInk(c); }   // flat, as the frame; dark text on a light colour (Saints gold)
    mid.appendChild(top);
    const bot = el('div', 'bot');
    if (g.status === 'live') {
      bot.appendChild(ordinal(g.period));
      if (g.clock) { bot.appendChild(el('span', 'bar')); bot.appendChild(el('span', '', g.clock)); }
    } else bot.appendChild(el('span', '', statusText(g, time)));
    mid.appendChild(bot);
    root.append(team(g.away, 'away'), mid, team(g.home, 'home'));
  },
};
