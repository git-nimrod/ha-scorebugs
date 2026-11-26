// "Stacked box '25" (after the NBA bug on Prime Video, 2025-26, frame: reference pack BAS0002, Spurs at Lakers,
// NBA Cup quarterfinal). A wide box: a dark title line naming the occasion with the league's logo; under it each team's panel in its
// own colour (away left, home right) with its logo large and cut by the outer end and a big score towards the middle, a thin light
// rule between the panels; a dark tab across the top middle with the quarter and the clock on a light pill; and a black foot line with
// each team's seed and letters at its own end and the streamer's mark between them (here the Home Assistant logo). seeds before the letters, not records. Measured on the frame (4x grid): box 333 x 116 frame px, everything here the frame's position
// times 1.8: title 43 px, panels 130 px, foot 37 px; tab 292 x 45 from x 140; score cap height 58 px; title cap 23 px.
import { el, logo, ordinal, statusText, teamColor, shade, leagueLogo, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const W = 600, TITLE = 39, PANEL = 130, FOOT = 29, H = TITLE + PANEL + FOOT, MID = 284;

export default {
  id: 'nba-stack-25',
  sizedFor: 0.7275,   // sizes were measured in SB Inter Tight; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-stack-25 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; color: #fff; line-height: 1; }
.sb-nba-stack-25 { font-stretch: 125%; }   /* Prime Video NBA: Archivo wide 800 */
.sb-nba-stack-25 .top { position: absolute; left: 0; right: 0; top: 0; height: ${TITLE}px; background: rgba(30,25,33,.93); border-radius: 0 6px 0 0;
  display: flex; align-items: center; gap: 12px; padding: 0 22px; font-weight: 700; font-size: 34px; font-stretch: 70%; letter-spacing: .2px; white-space: nowrap; overflow: hidden; }   /* the title line is set condensed in the frame, unlike the wide scores */
.sb-nba-stack-25 .top .sb-league { width: 32px; height: 32px; flex: none; }
.sb-nba-stack-25 .pn { position: absolute; top: ${TITLE}px; height: ${PANEL}px; overflow: hidden; }
.sb-nba-stack-25 .pn.away { left: 0; width: ${MID}px; } .sb-nba-stack-25 .pn.home { left: ${MID}px; right: 0; }
.sb-nba-stack-25 .pn .sb-logo { position: absolute; top: 2px; width: 146px; height: 126px; object-fit: contain; }
.sb-nba-stack-25 .pn.away .sb-logo { left: -40px; } .sb-nba-stack-25 .pn.home .sb-logo { right: -26px; }   /* big and cut by the box's ends, as on air */
/* the score centred top to bottom in the room under the clock tab, in every state, and heavier */
.sb-nba-stack-25 .s { position: absolute; top: 45px; height: ${PANEL - 45}px; display: grid; place-items: center; padding-top: 6px; box-sizing: border-box; width: 120px; text-align: center; font-size: 80px; font-weight: 900; font-variant-numeric: tabular-nums; white-space: nowrap;
  text-shadow: 0 2px 3px rgba(0,0,0,.35); }
.sb-nba-stack-25 .pn.away .s { left: 134px; } .sb-nba-stack-25 .pn.home .s { left: 28px; }
.sb-nba-stack-25 .rule { position: absolute; left: ${MID - 1}px; top: ${TITLE + 45}px; width: 3px; height: ${PANEL - 45}px; background: rgba(0,0,0,.8); }
.sb-nba-stack-25 .tab { position: absolute; left: 140px; width: 292px; top: ${TITLE}px; height: 45px; background: rgba(40,42,46,.97); border-radius: 0 0 6px 6px;
  display: flex; align-items: center; justify-content: center; gap: 12px; }
.sb-nba-stack-25 .q { font-weight: 700; font-size: 31px; } .sb-nba-stack-25 .sb-ord { font-size: .62em; vertical-align: .55em; margin-left: 1px; }
.sb-nba-stack-25 .pill { background: linear-gradient(#f6f6f6, #d4d6da); color: #111; border-radius: 5px; padding: 0 12px; font-size: 37px; line-height: 41px;
  font-variant-numeric: tabular-nums; margin-top: 4px; }
.sb-nba-stack-25 .when { font-size: 29px; white-space: nowrap; }
.sb-nba-stack-25 .ft { position: absolute; left: 0; right: 0; top: ${TITLE + PANEL}px; height: ${FOOT}px; background: #050506; border-radius: 0 0 6px 6px;
  display: grid; grid-template-columns: 1fr 60px 1fr; align-items: center; padding: 0 16px; font-size: 24px; letter-spacing: 1px; }
.sb-nba-stack-25 .ft .r { text-align: right; } .sb-nba-stack-25 .ft .sb-ha { color: #f2f2f2; justify-self: center; }
.sb-nba-stack-25 .ft .sd { font-weight: 600; opacity: .8; margin-right: 6px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    const top = el('div', 'top');
    // the title line names the occasion ("QUARTERFINALS", "PLAY-IN TOURNAMENT", a playoff round) or else the league
    top.appendChild(fit(el('span', '', String(g.note || g.league || '').replace(/\s+-\s+.*$/, '').toUpperCase())));
    if (mk.league) top.appendChild(leagueLogo(g, 32, null, true));
    root.appendChild(top);
    [['away', g.away], ['home', g.home]].forEach(([s, t]) => {
      const c = teamColor(t, '#3a3f47'), pn = el('div', 'pn ' + s);
      pn.style.background = 'linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.22) + ')';
      pn.append(logo(t, 146), fit(scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g)));
      root.appendChild(pn);
    });
    root.appendChild(el('div', 'rule'));
    const tab = el('div', 'tab');
    if (live) { tab.appendChild(ordinal(g.period, 'q')); if (g.clock) tab.appendChild(el('span', 'pill', g.clock)); }
    else tab.appendChild(fit(el('span', 'when', statusText(g, time))));
    root.appendChild(tab);
    const ft = el('div', 'ft');
    [g.away, g.home].forEach((t, i) => {
      const sp = fit(el('span', i ? 'r' : 'l'));
      if (t.seed || t.rank) sp.appendChild(el('b', 'sd', String(t.seed || t.rank)));
      sp.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      ft.appendChild(sp);
      if (!i) ft.appendChild(mk.ha ? haMark(28) : el('span'));   // the streamer's mark sat under the scores
    });
    root.appendChild(ft);
  },
};
