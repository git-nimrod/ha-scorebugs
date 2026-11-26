// "Starball bar '25": after the Champions League's own world-feed bug (2025-26; frame: Arsenal vs PSG on CBS) and CBS's knockout corner
// (2026 semi-final). A small square with the competition's emblem (here its logo from ESPN), the match clock on white, a thin strip in
// the home team's colours, then a deep blue bar with the home team, both scores and the away team. In the knockout rounds a dark corner
// plate names the round ("CHAMPIONS LEAGUE / SEMIFINAL"); on air the network's name sits under it, here the Home Assistant logo.
import { el, logo, soccerClock, homeFirst, leagueLogo, haMark, marks, teamColor, FONTS, LOGO_HALO, fit, withRecord } from '../kit.js';

// loop pass, read on the 1080p CBS still (Atletico v Bayern 80:24, grade A, 551 x 48): the team bar is deep indigo, dark in the middle
// (#0a0042 at 44 %) and lit at both ends (#270093 left, #1400a4 right), not royal blue lit from the top; the emblem tile is flat bright blue (#0e2cf0)
// with the ball filling it; the bar is 11.5 long for its height (ours 10.5): 64 -> 58 px.
const W = 900, H = 120, BAR = 58, SCORE_W = 70;
// measured against the frame, frame size / mine: Arsenal v PSG: every text 13 % larger
const TYPE = { type: 1.13 };
const ROUND = { 'KNOCKOUT PLAYOFFS': 'KNOCKOUT PLAY-OFFS', SEMIFINALS: 'SEMIFINAL', QUARTERFINALS: 'QUARTERFINAL', FINAL: 'FINAL', 'ROUND OF 16': 'ROUND OF 16' };


// the team letters' width to the frame's
const LETTERS = { stretch: 90 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.bar > div.tm > span.s', 1.5, 0.5, -1.5],
  ['div.bar > div.tm > span.ab > span.sb-fit', 5.5, 1.5, -10.5],
  // (the clock's -13.5 px nudge is gone: it slid the white clock over the emblem's square and cut the logo)
];

export default {
  id: 'soc-ucl-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there are no scores: both score cells go and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -31% vs the broadcast; 80 % of the correction
  // (was 1.302)
  typeScale: 1.0,
  nudge: NUDGE,
  dresses: ['regular', 'playoffs', 'conf-finals', 'finals'],
  fonts: [FONTS.openSans],
  css: `
.sb-soc-ucl-25 { font-family: 'SB Open Sans', Arial, sans-serif; font-weight: 500; font-stretch: 100%; color: #fff; }
/* face: UCL 2024-: Open Sans */
.sb-soc-ucl-25 .bar { position: absolute; left: 0; top: 0; height: ${BAR}px; display: flex; align-items: stretch; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-soc-ucl-25 .em { width: ${BAR}px; flex: none; background: linear-gradient(#0d1050, #0e2cf0 16%);   /* flat on air, no gloss (surface sweep); a darker top edge, 4 px */ display: grid; place-items: center; }
.sb-soc-ucl-25 .em .sb-league { width: 54px; height: 54px; filter: brightness(0) invert(1); }
.sb-soc-ucl-25 .clk { width: 150px; background: linear-gradient(#ffffff, #e9ebf2); color: #10183f; display: grid; place-items: center; font-size: ${38 * TYPE.type}px; letter-spacing: .5px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sb-soc-ucl-25 .clk.when { font-size: 28px; letter-spacing: 0; }
.sb-soc-ucl-25 .kit { width: 10px; flex: none; display: grid; grid-template-rows: 1fr 1fr; }
.sb-soc-ucl-25 .tm { width: 440px; display: flex; align-items: center; background: linear-gradient(90deg, #270093, #130099 14%, #1a0585 28%, #0c0058 36%, #0a0042 44%, #0e0046 52%, #140062 64%, #120071 71%, #150080 78%, #140092 85%, #1400a4); font-size: ${38 * TYPE.type}px; letter-spacing: 1px; }
.sb-soc-ucl-25 .tm .sb-logo { width: 42px; height: 42px; object-fit: contain; flex: none; filter: ${LOGO_HALO}; }
.sb-soc-ucl-25 .tm .sep { width: 16px; height: 46px; flex: none; box-sizing: border-box; border: 2px solid rgba(255,255,255,.28); border-width: 0 2px 0 0; border-radius: 0 50% 50% 0 / 0 50% 50% 0; }
.sb-soc-ucl-25 .tm .sep.r { border-width: 0 0 0 2px; border-radius: 50% 0 0 50% / 50% 0 0 50%; }
.sb-soc-ucl-25 .tm span { text-align: center; } .sb-soc-ucl-25 .tm .ab { width: 130px; } .sb-soc-ucl-25 .tm .s { width: 70px; }
.sb-soc-ucl-25 .plate { position: absolute; right: 0; top: 0; width: 230px; height: ${H}px; background: linear-gradient(#0d1a52, #08113a); display: grid; justify-items: center;
  align-content: center; gap: 2px; text-align: center; border-radius: 4px; }
.sb-soc-ucl-25 .plate .c { font-size: 19px; line-height: 1.1; letter-spacing: .5px; } .sb-soc-ucl-25 .plate .r { font-size: 17px; letter-spacing: 1px; border-bottom: 2px solid #fff; padding-bottom: 6px; margin-bottom: 4px; }
.sb-soc-ucl-25 .plate .sb-ha { color: #fff; }
.sb-soc-ucl-25 .tm .ab { font-stretch: ${LETTERS.stretch}%; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const bar = el('div', 'bar');
    const em = el('div', 'em');
    if (mk.league) em.appendChild(leagueLogo(g, 54));
    const kit = el('div', 'kit');
    const c1 = teamColor(h, '#c8102e'), c2 = h.color2 && /^#[0-9a-f]{6}$/i.test(h.color2) ? h.color2 : '#ffffff';
    kit.append(Object.assign(el('i'), { style: 'background:' + c1 }), Object.assign(el('i'), { style: 'background:' + c2 }));
    const tm = el('div', 'tm');
    const sc = (t) => (g.status !== 'pre' && t.score != null ? String(t.score) : '');
    // each team's logo by its letters, a thin curved line between the letters and the score
    const ah = fit(withRecord(el('span', 'ab', (h.abbr || '').toUpperCase()), h, g, false)), aa = fit(withRecord(el('span', 'ab', (a.abbr || '').toUpperCase()), a, g));  // records before kick-off
    if (g.status === 'pre') { tm.style.width = (440 - 2 * SCORE_W) + 'px'; tm.append(ah, el('i', 'sep'), el('i', 'sep r'), aa); }
    else tm.append(ah, el('i', 'sep'), el('span', 's', sc(h)), el('span', 's', sc(a)), el('i', 'sep r'), aa);
    // the away team's kit colour closes the bar at its far end, as the home team's opens it (the yellow edge in the frame)
    const kitA = el('div', 'kit'), d1 = teamColor(a, '#ffd200'), d2 = a.color2 && /^#[0-9a-f]{6}$/i.test(a.color2) ? a.color2 : d1;
    kitA.append(Object.assign(el('i'), { style: 'background:' + d1 }), Object.assign(el('i'), { style: 'background:' + d2 }));
    const clock = soccerClock(g, time);
    bar.append(em, el('div', 'clk' + (clock.length > 5 ? ' when' : ''), clock), kit, tm, kitA);
    root.appendChild(bar);
  },
};
