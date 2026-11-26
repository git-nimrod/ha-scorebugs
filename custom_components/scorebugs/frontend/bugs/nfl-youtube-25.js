// "White bar '25": after the NFL game on YouTube (2025; frame: Chiefs at Chargers). A white bar with each team's logo at its end, cut by
// the bar's edge on a pale panel; the team's letters in its own colour, tall and condensed, a dot before the team with the ball; black
// scores towards the middle, where the network's mark sat (here the Home Assistant logo). Timeout bars under the letters. Under the bar a
// dark row: the quarter, the clock and the play clock's place in the middle, and the down with an arrow towards the team with the ball.
import { el, logo, ordinal, pips, statusText, teamColor, contrast, shade, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const W = 1100, H = 156, ROW = 100, LOW = 52, END = 130;
const PRE_CUT = 90;   // the score's room in each half, left out before the kick-off
const ABBR_PX = 66, SCORE_PX = 66, CLOCK_PX = 36;
const INK_MIN = 3;   // a team's letters are in its own colour on white, unless that colour is too light to read there (then a darker shade)

export default {
  id: 'nfl-youtube-25',
  size: { w: W, h: H },
  // before the kick-off there is no score: both halves close up on the middle mark, so the bar is shorter
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * PRE_CUT : W, h: H }),
  // measured against the frame by the automatic audit: text -21% vs the broadcast; 80 % of the correction
  typeScale: 1.209,
  fonts: [FONTS.saira],
  css: `
.sb-nfl-youtube-25 { font-family: 'SB Saira', 'Arial Narrow', sans-serif; font-weight: 700; color: #141414; }
.sb-nfl-youtube-25 { font-stretch: 87.5%; }   /* YouTube NFL 2025: Saira Semi Condensed Bold, the face kept at its semi-condensed width */
.sb-nfl-youtube-25 .top { position: absolute; left: 0; top: 0; width: 100%; height: ${ROW}px; background: linear-gradient(#ffffff, #eceef0); display: grid;
  grid-template-columns: ${END}px minmax(0, 1fr) 150px minmax(0, 1fr) ${END}px; align-items: center; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-nfl-youtube-25 .lp { position: relative; height: 100%; overflow: hidden; background: #f3f3f3; }
.sb-nfl-youtube-25 .lp .sb-logo { position: absolute; top: -10px; left: 50%; width: ${ROW + 20}px; height: ${ROW + 20}px; margin-left: -${(ROW + 20) / 2}px; object-fit: contain; }   /* on its team's colour, a little bigger than the tile and centred in it, cut evenly top and bottom */
.sb-nfl-youtube-25 .tm { position: relative; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; }
.sb-nfl-youtube-25 .ab { font-size: ${ABBR_PX}px; font-stretch: 72%; line-height: 1; letter-spacing: -.5px; }
.sb-nfl-youtube-25 .ab b { font-size: .5em; vertical-align: .45em; margin-right: 8px; }
/* a long record (45-34, 10-14-1) squeezes into its half instead of pushing the letters into the logo */
.sb-nfl-youtube-25 .rec { font-size: 40px; color: #6b7078; margin: 0 14px; white-space: nowrap; flex: 0 1 auto; min-width: 0; }
.sb-nfl-youtube-25 .ab { flex: none; }
.sb-nfl-youtube-25 .sc { font-size: ${SCORE_PX}px; line-height: 1; font-stretch: 90%; }
.sb-nfl-youtube-25 .sc { position: relative; }
/* the timeouts as three short bars centred under the score, at the white bar's foot */
.sb-nfl-youtube-25 .sc .sb-pips { position: absolute; left: 50%; transform: translateX(-50%); top: calc(100% + ${(ROW - SCORE_PX) / 2 - 16}px); display: flex; gap: 8px; }
.sb-nfl-youtube-25 .sb-pips i { width: 30px; height: 5px; background: #9aa0a8; } .sb-nfl-youtube-25 .sb-pips i.used { opacity: .3; }
.sb-nfl-youtube-25 .md { display: grid; place-items: center; } .sb-nfl-youtube-25 .md .sb-ha { color: #262626; }
/* the bar a flat light grey, not white, and the mark on its own tile with a fine grey seam each side, as on air (frame: #e5e7e6 with
 #d1d3d2 seams) */
.sb-nfl-youtube-25 .top { background: linear-gradient(#eceeed, #e2e4e3); }
.sb-nfl-youtube-25 .md { align-self: stretch; box-shadow: inset 2px 0 0 #d0d2d1, inset -2px 0 0 #d0d2d1; }
.sb-nfl-youtube-25 .low { position: absolute; left: 0; top: ${ROW}px; width: 100%; height: ${LOW}px; background: linear-gradient(#2e3329, #1c1f19); color: #f2f2f2;
  display: grid; grid-template-columns: 1fr 330px 330px; align-items: center; font-size: ${CLOCK_PX}px; }
.sb-nfl-youtube-25 .low .ck { grid-column: 2; display: flex; justify-content: center; align-items: center; gap: 18px; border-left: 2px solid rgba(255,255,255,.18); border-right: 2px solid rgba(255,255,255,.18); height: 100%; }
.sb-nfl-youtube-25 .low .dd { grid-column: 3; text-align: center; font-size: ${CLOCK_PX * 0.86}px; }
.sb-nfl-youtube-25 .low .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-youtube-25 .sb-ord { font-size: .62em; vertical-align: .55em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const top = el('div', 'top');
    const end = (t, k) => { const p = el('div', 'lp ' + k); const c = teamColor(t, '#3a3f47'); p.style.background = 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.2) + ')'; p.appendChild(logo(t, 150)); return p; };
    const half = (t, k) => {
      const h = el('div', 'tm ' + k);
      const c = teamColor(t, '#3a3f47');
      const ab = el('span', 'ab');
      if (live && t.hasBall) ab.appendChild(el('b', '', '●'));
      ab.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      ab.style.color = contrast(c, '#ffffff') >= INK_MIN ? c : shade(c, -0.45);
      // before the kick-off the record beside the letters, small and grey
      if (g.status === 'pre') { const r = fit(el('span', 'rec', t.record || '')); if (Math.max(g.away.record.length, g.home.record.length) > 4) r.style.fontSize = '30px'; if (k === 'a') h.append(ab, r); else h.append(r, ab); }
      else { const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g); if (k === 'a') h.append(ab, sc); else h.append(sc, ab); if (live && t.timeouts != null) sc.appendChild(pips(t.timeouts, 3)); }
      return h;
    };
    const md = el('div', 'md');
    if (marks(opts).ha) md.appendChild(haMark(58));
    top.append(end(g.away, 'a'), half(g.away, 'a'), md, half(g.home, 'h'), end(g.home, 'h'));
    const low = el('div', 'low'), ck = el('div', 'ck');
    if (g.status === 'pre') low.style.gridTemplateColumns = '1fr 330px 1fr';   // no down before the game: the start time stands in the middle
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', '', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    // the down, with an arrow the way the team with the ball is going: "◀ 1st & 10" when the home team (right) has it, as on air (frame: LAC)
    const dd = el('div', 'dd', live && g.football && g.football.short ? (g.home.hasBall ? '◀ ' : '') + g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()) + (g.away.hasBall ? ' ▶' : '') : '');
    low.append(el('span'), ck, dd);
    root.append(top, low);
  },
};
