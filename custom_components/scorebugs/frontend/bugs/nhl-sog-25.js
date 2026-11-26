// "Shots box '25": after the NHL bug on TNT Sports (2021 on, seen in the 2026 playoffs). A compact box in the top corner (no title strip, as
// in the frame): the two teams in rows (logo, letters, score) on dark tints of their colours, a narrow column with each team's shots on
// goal and "SOG" between them, and a black block with the period over the clock. The trophy and network badge at the left end become
// the league's logo over the Home Assistant logo.
import { el, logo, statusText, teamColor, shade, leagueLogo, haMark, marks, abbr3, cupMark, FONTS } from '../kit.js';

// (Nov 23 sweep) the frame's box is about 4.9 times as wide as tall (ours was 4.05): the badge and the clock block each about 1.1 of the
// box's height wide, the score 0.66, the shots column 0.47
const ROW = 74, TOP = 0, W = 700, H = 2 * ROW, BADGE = 160, PRE_CUT = 98;  // no title strip over the rows, so the box is only the rows high
// measured against the frames: bigger scores and team letters (Kings at Avalanche frame)
const ABBR_PX = 57, SCORE_PX = 82;

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [  // the logo and letters' old shifts (towards each other) dropped: they crowded the letters
  // the score cell's old shift dropped: it opened a black gap between the row and its score
];

// the team letters' width to the frame's
const LETTERS = { stretch: 98 };

export default {
  id: 'nhl-sog-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score (and the kit no longer puts the logos in the empty plates when the badges already show them):
  // the score plates go and the box closes up
  sizeFor: (g) => (g.status === 'pre' ? { w: W - PRE_CUT + 76, h: H } : { w: W, h: H }),   // the records widen the team rows before the game
  nudge: NUDGE,
  dresses: ['regular', 'playoffs', 'finals'],
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-sog-25 { font-family: 'SB Roboto', Arial, sans-serif; font-weight: 600; font-stretch: 88%; color: #fff; }
/* face: TNT NHL 2021: Roboto Bold */
.sb-nhl-sog-25 .badge { position: absolute; left: 0; top: 0; width: ${BADGE}px; height: ${H}px; background: #08090b; border-radius: 6px 0 0 6px; display: grid;
  grid-template-rows: 1fr 50px; justify-items: center; align-items: center; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-sog-25 .badge .sb-logo, .sb-nhl-sog-25 .badge .sb-league { width: 88px; height: 88px; margin-top: 8px; } .sb-nhl-sog-25 .badge .sb-cup { filter: drop-shadow(0 2px 3px rgba(0,0,0,.6)); }
.sb-nhl-sog-25 .badge .sb-ha { color: #f2f2f2; }
.sb-nhl-sog-25 .body { position: absolute; left: var(--l, 0); right: 0; top: ${TOP}px; height: ${2 * ROW}px; background: #08090b; border-radius: 6px; overflow: hidden; display: grid; grid-template-columns: 204px 98px 70px 1fr;
  grid-template-rows: ${ROW}px ${ROW}px; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-sog-25 .tm { display: flex; align-items: center; gap: 8px; padding-left: 8px; font-size: ${ABBR_PX}px; letter-spacing: .5px; }
.sb-nhl-sog-25 .tm .sb-logo { width: 54px; height: 48px; object-fit: contain; margin-right: 6px; }   /* about the letters' height with a gap, as on air (it crowded the letters) */
.sb-nhl-sog-25 .tm .rec { margin-left: auto; padding-right: 16px; font-size: 26px; white-space: nowrap; }
.sb-nhl-sog-25 .sc { display: grid; place-items: center; font-size: ${SCORE_PX}px; line-height: 1; }   /* no hard line: the cell's own glow does the parting */
.sb-nhl-sog-25 .sog { grid-column: 3; grid-row: 1 / 3; display: grid; grid-template-rows: 1fr 30px 1fr; border-left: 2px solid #3a3c40; border-right: 2px solid #3a3c40; }
.sb-nhl-sog-25 .sog span { display: grid; place-items: center; font-size: 30px; }
.sb-nhl-sog-25 .sog .l { font-size: 17px; color: #cfd2d6; border-top: 2px solid #3a3c40; border-bottom: 2px solid #3a3c40; }
.sb-nhl-sog-25 .pc { grid-column: 4; grid-row: 1 / 3; display: grid; align-content: center; justify-items: center; gap: 4px; }
.sb-nhl-sog-25 .pc .p { font-size: 38px; } .sb-nhl-sog-25 .pc .c { font-size: 50px; }
.sb-nhl-sog-25 .pc .w { font-size: 26px; text-align: center; line-height: 1.15; padding: 0 4px; }
.sb-nhl-sog-25 .tm > span { font-stretch: ${LETTERS.stretch}%; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    // no title strip
    const body = el('div', 'body');
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tint = shade(c, -0.12);   // flat, as on air (frame: Flyers orange from top to foot, no sheen)
      const tm = el('div', 'tm');
      tm.style.background = tint;
      tm.append(logo(t, 54), el('span', '', abbr3(t)));
      if (g.status === 'pre' && t.record) { const r = el('span', 'rec', t.record); if (t.record.length > 5) r.style.fontSize = '20px'; tm.appendChild(r); }  // records before the game, every time
      const sc = el('div', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      if (g.status === 'pre') sc.classList.add('sb-num');   // empty before the game: the kit puts the records here
      // the score cell brighter in its middle, darker towards its edges, as on air
      sc.style.background = 'radial-gradient(ellipse farthest-side at 50% 50%, ' + shade(c, 0.1) + ', ' + shade(c, -0.12) + ' 65%, ' + shade(c, -0.34) + ')';
      body.append(tm, sc);
      if (g.status === 'pre') sc.style.display = 'none';
    });
    const sog = el('div', 'sog');
    const shot = (t) => (t.shots != null && g.status !== 'pre' ? String(t.shots) : '');
    sog.append(el('span', '', shot(g.away)), el('span', 'l', 'SOG'), el('span', '', shot(g.home)));
    sog.style.gridRow = '1 / 3';
    const pc = el('div', 'pc');
    pc.style.gridRow = '1 / 3';
    if (live) { pc.appendChild(el('span', 'p', g.period.label + (g.period.suffix || ''))); if (g.clock) pc.appendChild(el('span', 'c', g.clock)); }
    else pc.appendChild(el('span', 'w', statusText(g, time)));
    // grid rows: away team + score in row 1, home in row 2, the shots and period columns span both
    body.children[0].style.gridRow = body.children[1].style.gridRow = '1';
    body.children[2].style.gridRow = body.children[3].style.gridRow = '2';
    if (g.status === 'pre') { body.style.gridTemplateColumns = '290px 1fr'; pc.style.gridColumn = '2'; body.append(pc); }   // no shots before the game: the SOG column goes, the time takes its room
    // a game with no shots on goal (basketball, football on this hockey bug): the SOG column goes and the score box shifts over into its
    // room, so three-figure scores fit
    else if (g.away.shots == null && g.home.shots == null) { body.style.gridTemplateColumns = '204px 168px 1fr'; pc.style.gridColumn = '3'; body.append(pc); }
    else body.append(sog, pc);
    // the trophy and the network's badge stood at the left end: here the league's logo over the Home Assistant logo
    if (mk.league || mk.ha) {
      const badge = el('div', 'badge');
      // in the playoffs the cup stands here, as on air (a plain drawn cup); otherwise the league's logo
      const top = g.dress && g.dress !== 'regular' && g.league === 'NHL' ? cupMark(92) : mk.league ? leagueLogo(g, 88, null, true) : el('span');
      badge.append(top, mk.ha ? haMark(40) : el('span'));
      root.appendChild(badge);
      root.style.setProperty('--l', BADGE + 'px');
      body.style.borderRadius = '0 6px 6px 0';
    }
    root.appendChild(body);
  },
};
