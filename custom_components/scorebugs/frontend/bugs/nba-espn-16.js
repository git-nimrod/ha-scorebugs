// "Colour panels '16": after ESPN's NBA bug (2016; frame: Knicks at Rockets). Each team a panel in its colour, its logo faint behind its
// slanted letters and its score at the panel's end, and under it a dark strip with its timeouts left ("TIMEOUTS: 7"); then a dark box with
// the quarter and the clock, and a wide dark panel where the network named the night (here the Home Assistant logo and the game's note).
// The shot clock and the bonus are left out (no data).
import { el, logo, statusText, teamColor, teamPair, panelInk, shade, haMark, marks, teamInk, scoreSlot, fit, FONTS } from '../kit.js';

// height and top row from the frame against a team panel's width
const H = 79, TOP = 54, TEAM = 260, CLOCK = 190, PRE_CUT = 72, NOTE = 250;
// the note box only as wide as its text needs: the bar ends there
const W = 2 * TEAM + CLOCK + NOTE + 3 * 3 + 6;   // before the tip-off each team panel loses its empty score room
const ABBR_PX = 40, SCORE_PX = 40, CLOCK_PX = 30, SUB_PX = 17, NOTE_PX = 28;

export default {
  id: 'nba-espn-16',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the game there is no score: each team panel closes up on its letters and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -26% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  fonts: [FONTS.sairaItalic, FONTS.saira, FONTS.inter],
  css: `
.sb-nba-espn-16 { font-family: 'SB Inter V', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; display: grid; grid-template-columns: ${TEAM}px ${TEAM}px ${CLOCK}px 1fr; grid-template-rows: minmax(0, 1fr); height: ${H}px; gap: 3px;
/* face: ESPN NBA 2016 package: Inter 600 */
  background: #0d0e10; padding: 3px; box-sizing: border-box; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nba-espn-16 .tm { position: relative; display: grid; grid-template-rows: ${TOP - 6}px 1fr; overflow: hidden; }
.sb-nba-espn-16 .top { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 12px 0 16px; }
.sb-nba-espn-16 .top { overflow: hidden; }
.sb-nba-espn-16 .top .sb-logo { position: absolute; left: -14px; top: 50%; width: 74px; height: 74px; margin-top: -37px; object-fit: contain; opacity: .55; }   /* bigger than its row and cut by the panel's left edge, as on air (Knicks) */
.sb-nba-espn-16 .top .sb-logo.sb-logo-outlined { opacity: .9; }   /* a logo in its own panel's colour would vanish at the faint setting: stronger, with its outline */
/* a lighter, medium-weight italic for the letters, set further from the logo; upright medium figures, as on air */
.sb-nba-espn-16 .ab { position: relative; padding-left: 64px; font-family: 'SB Saira Italic', sans-serif; font-weight: 500; font-size: ${ABBR_PX}px; font-stretch: 95%; }
.sb-nba-espn-16 .sc { font-family: 'SB Saira', sans-serif; font-weight: 600; font-size: ${SCORE_PX}px; line-height: 1; font-stretch: 95%; }
.sb-nba-espn-16 .sub { display: flex; align-items: center; justify-content: space-between; padding: 0 10px; background: rgba(0,0,0,.2);   /* the frame's strip is the team colour a shade darker, not black */ font-size: ${SUB_PX}px; font-weight: 600; letter-spacing: .5px; }
.sb-nba-espn-16 .ck { display: flex; align-items: center; justify-content: center; gap: 18px; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.28)), linear-gradient(#25272b, #0b0c0e); box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6); font-size: ${CLOCK_PX}px; font-stretch: 85%; font-weight: 500; }   /* the clock reads lighter than the letters on air */
.sb-nba-espn-16 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nba-espn-16 .nt { display: flex; align-items: center; justify-content: center; gap: 14px; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.28)), linear-gradient(#23252a, #101113); box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6); padding: 0 16px; box-sizing: border-box; font-size: ${NOTE_PX}px; font-stretch: 80%; white-space: nowrap; overflow: hidden; text-transform: uppercase; }
.sb-nba-espn-16 .nt .sb-ha { color: #e32b26; flex: none; }
/* the night's name squeezed to its box (NBA WEDNESDAY ran out of it) */
.sb-nba-espn-16 .nt [data-fit] { display: block; min-width: 0; max-width: 100%; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');  // never two alike panels (GS keeps its gold against DET)
    const team = (t) => {
      const c = pair[t === g.away ? 0 : 1];
      const p = el('div', 'tm');
      // flat colour with only a soft lift at the top, as in the frame (no hard gloss horizon)
      p.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6)';
      p.style.background = 'linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(' + shade(c, 0.08) + ', ' + shade(c, -0.1) + ')';
      p.style.color = panelInk(t, c);   // dark letters on a light pair colour (GS gold)
      const top = el('div', 'top');
      top.append(logo(t, 54), el('span', 'ab', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') top.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      const sub = el('div', 'sub');
      sub.appendChild(el('span', '', live && t.timeouts != null ? 'TIMEOUTS: ' + t.timeouts : t.record || ''));
      sub.style.color = '#fff';
      p.append(top, sub);
      return p;
    };
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    const nt = el('div', 'nt');
    if (marks(opts).ha) nt.appendChild(haMark(36));
    // the game's own league before the weekday (it read NBA SUNDAY over an NFL game)
    nt.appendChild(fit(el('span', '', g.note || (g.league || 'NBA') + ' ' + ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date(g.starts).getDay()])));
    if (g.status === 'pre') root.style.gridTemplateColumns = (TEAM - PRE_CUT) + 'px ' + (TEAM - PRE_CUT) + 'px ' + CLOCK + 'px 1fr';
    root.append(team(g.away), team(g.home), ck, nt);
  },
};
