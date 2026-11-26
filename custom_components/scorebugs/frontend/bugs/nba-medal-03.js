// "Medallion '03": after the NBA score box on TNT (2002-04). A pale blue-silver box: the league's logo in a cell at the left, the two
// teams' letters and scores in dark navy cells, a black pill under it with the clock and the quarter in a small red disc, and a big round
// black medallion with a gold ring set right against the scores, the score cells curving round it. The network's mark in the medallion
// becomes the Home Assistant logo, in red. Drawn soft, with scanlines, the way it looked on a 2003 TV (bug_tv: clean turns that off).
import { el, statusText, leagueLogo, haMark, marks, FONTS, fit, CHROME } from '../kit.js';

// the stage holds the medallion's whole rim (13 px outside its disc): a clipped rim made the logo inside look off centre
// (Nov 23 sweep) measured on the frame: the medallion with its rims about 1.24 times the box's height across (ours was 1.65), its centre
// 3.25 box-heights from the box's left end and level with the box's middle; the score cells show about two thirds of a letter cell
const W = 410, H = 184, MX = 340, MY = 79, MR = 54, DY = 13;
// measured against the frames: the team rows' type and the clock pill's type are smaller (Wizards at Bulls frame)
const ROW_PX = 40, CLOCK_PX = 32;  // the letters and scores fill their cells, caps about 0.65 of the cell, as on air

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  // (the old shifts dropped: letters and scores sit in the middle of their cells' height)
];


// the team letters' width to the frame's
const LETTERS = { stretch: 100, track: 1 };   // tall, not spread (they were squeezed small by their width)

export default {
  id: 'nba-medal-03',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nba-medal-03 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; font-stretch: 106%; color: #fff; }
.sb-nba-medal-03 { font-weight: 900; font-stretch: 110%; }   /* face: Archivo 900 at 110% width (low confidence) */
.sb-nba-medal-03 .box { position: absolute; left: 0; top: ${10 + DY}px; width: 350px; height: 104px;
  -webkit-mask-image: radial-gradient(circle at ${MX}px ${MY - 10 - DY}px, transparent ${MR + 8}px, #000 ${MR + 9}px); mask-image: radial-gradient(circle at ${MX}px ${MY - 10 - DY}px, transparent ${MR + 8}px, #000 ${MR + 9}px); border-radius: 4px; background: ${CHROME};   /* silver frame */
  box-shadow: 0 2px 4px rgba(0,0,0,.5); }
.sb-nba-medal-03 .lg { position: absolute; left: 6px; top: 6px; width: 44px; height: 92px; overflow: hidden; background: linear-gradient(#cdd8ec, #8ea2c6);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); }
.sb-nba-medal-03 .lg .sb-league { position: absolute; left: 50%; top: 50%; width: 92px; height: 92px; transform: translate(-50%, -50%) scale(1.05); }
.sb-nba-medal-03 .lg .sb-league-text { color: #142251; writing-mode: vertical-rl; }
.sb-nba-medal-03 .r { position: absolute; left: 56px; right: 6px; height: 44px; display: grid; grid-template-columns: 128px 1fr; gap: 4px; }   /* the letters' cell wide enough for tall letters (they were squeezed small) */
/* the cells only (.r > span): the letters' own fitting span inside took the cell's frame too and drew a chip round them */
.sb-nba-medal-03 .r > span { background: linear-gradient(#2c2d30, #060607);   /* black cells, as on air */ display: flex; align-items: center; font-size: ${ROW_PX}px; letter-spacing: .5px; padding: 0 8px; justify-content: center; box-shadow: inset 0 0 0 1px rgba(255,255,255,.35); }
/* the scores right-aligned like the letters, ending clear of the medallion's curve */
/* line height 1 in the cells and their fitting spans: the font's default line box put the capitals low in each row */
.sb-nba-medal-03 .r > span, .sb-nba-medal-03 .r > span .sb-fit { line-height: 1; }
.sb-nba-medal-03 .r .s { justify-content: flex-end; padding-right: 74px; }
.sb-nba-medal-03 .r > span:first-child { justify-content: flex-end; padding-right: 12px; }   /* the letters right-aligned in their cells, as on air */
/* the clock: a black box under the rows whose bottom edge curves upward at its right end into a red disc with the quarter, the disc
 tucked against the medallion */
.sb-nba-medal-03 .pill { position: absolute; left: 60px; top: ${116 + DY}px; width: 246px; height: 48px; box-sizing: border-box; padding-right: 30px; border-radius: 0 0 46px 20px / 0 0 40px 20px;
  background: linear-gradient(#2b2b2b, #050505); box-shadow: inset 0 0 0 2px #9aa3ad; display: flex; align-items: center; justify-content: center; font-size: ${CLOCK_PX}px; letter-spacing: 1px; }
.sb-nba-medal-03 .pill .q { position: absolute; right: -20px; top: 0; width: 46px; height: 46px; font-size: 30px; }   /* the disc as tall as the box, its centre on the box's end */
.sb-nba-medal-03 .q { width: 38px; height: 38px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #ff5a4f, #c2140c 70%); box-shadow: 0 0 0 2px #f2f2f2;
  display: grid; place-items: center; font-size: 26px; letter-spacing: 0; }
.sb-nba-medal-03 .med { position: absolute; left: ${MX - MR}px; top: ${MY - MR}px; width: ${2 * MR}px; height: ${2 * MR}px; border-radius: 50%; background: radial-gradient(circle at 45% 35%, #3a3a3a, #0b0b0b 65%);
  box-shadow: 0 0 0 6px #b8a246, 0 0 0 8px #6b5c1c, 0 0 0 12px #dde1e5, 0 0 0 13px #7a8088, 0 3px 8px 13px rgba(0,0,0,.35);   /* gold ring inside a silver rim */ display: grid; place-items: center; text-align: center; color: #f2d36b; }
.sb-nba-medal-03 .med .sb-ha { display: block; color: #e8322b; filter: drop-shadow(0 2px 2px #000); translate: 0 -4px; }   /* lifted: a house's weight sits low, so its true middle looks low */   /* a block, so no text baseline pushes it off centre */
/* a heavy white line under the bottom row, all the way along, as along the top */
.sb-nba-medal-03 .box::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: #f4f4f4; }
.sb-nba-medal-03 .med .w { font-size: 21px; line-height: 1.1; padding: 0 10px; }
.sb-nba-medal-03 .r > span:first-child { font-stretch: ${LETTERS.stretch}%; letter-spacing: ${LETTERS.track}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const box = el('div', 'box');
    if (mk.league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, 92)); box.appendChild(lg); }
    else box.style.width = '262px';
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r');
      r.style.top = (6 + i * 48) + 'px';
      if (!mk.league) r.style.left = '6px';
      // before the game the record in the score's cell, sized by its length to keep clear of the medallion's curve
      const recs = g.status === 'pre' && g.away.record && g.home.record;
      const sv = el('span', 's', recs ? t.record : g.status !== 'pre' && t.score != null ? String(t.score) : '');
      if (recs) { sv.style.fontSize = (Math.max(g.away.record.length, g.home.record.length) > 6 ? 17 : Math.max(g.away.record.length, g.home.record.length) > 5 ? 20 : 26) + 'px'; sv.style.whiteSpace = 'nowrap'; }   // one line, never broken at a hyphen
      r.append(fit(el('span', '', (t.abbr || '').toUpperCase())), sv);
      box.appendChild(r);
    });
    const live = g.status === 'live';
    const med = el('div', 'med');
    if (!live) {   // the medallion is round: a long status goes on two lines ("SUN" over "1:22 AM") rather than one squeezed line
      const st = statusText(g, time), m = st.length > 7 && st.match(/^(\S+) (.+)$/), w = el('div', 'w');
      if (m) w.append(el('div', '', m[1]), el('div', '', m[2])); else w.textContent = st;
      med.appendChild(w);
    }
    else if (mk.ha) med.appendChild(haMark(84));
    root.appendChild(box);
    if (live) {
      const pill = el('div', 'pill');
      if (g.clock) pill.appendChild(el('span', '', g.clock));
      pill.appendChild(el('span', 'q', g.period.word ? g.period.label.slice(0, 2) : g.period.label));
      root.appendChild(pill);
    }
    root.appendChild(med);   // over the clock's curved end
  },
};
