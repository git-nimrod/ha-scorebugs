// "Red clock tab '25": after the FA Cup's world-feed bug (2025-26; frame: reference pack SOC0236-facup, Man City v Liverpool, 00:25). Light grey name boxes with dark letters, each with a thin strip of
// the team's colour at its outer end; a dark box with each score beside it; between the scores the competition's trophy (here its logo
// from ESPN) above a red tab that hangs below the bar with the match clock.
// Measured: name boxes 47 / 50 wide and 26 tall, score boxes 26 / 27 wide and
// taller than the names (30), the red tab 77 wide and 25 tall starting two thirds down the score boxes; strips 3-4 px; name boxes
// #d8dcd7 / #eceeed, score boxes #3e3e3e, tab #9d2832.
// "logo needs to be MUCH bigger. Color's aren't aligned to team box, and score should match abbreviation box
// size". The competition's logo now stands over the clock tab about 1.6 times the name boxes' height (the trophy on air rises well above
// the bar, its foot on the tab); each team's colour strip runs the full height of its name box, flush at the outer end; the score boxes
// take the name boxes' top and height.
import { el, soccerClock, homeFirst, leagueLogo, marks, teamColor, contrast, FONTS, scoreSlot, fit } from '../kit.js';

// Y0: room above the bar for the logo
const NM = 108, SC = 60, TAB = 176, W = 2 * NM + 2 * SC + TAB, Y0 = 60, NT = Y0 + 4, NH = 62, TT = Y0 + 42, TH = 58, H = TT + TH, LG = 104;

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-facup-25',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-soc-facup-25 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 600; color: #3c3c3c; }
.sb-soc-facup-25 .nm { position: absolute; top: ${NT}px; width: ${NM}px; height: ${NH}px; display: grid; place-items: center; box-sizing: border-box; padding: 0 12px;
  font-size: 40px; font-weight: 500; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-soc-facup-25 .nm.h { left: 0; background: #d8dcd7; } .sb-soc-facup-25 .nm.a { left: ${W - NM}px; background: #eceeed; }
.sb-soc-facup-25 .nm i { position: absolute; top: 0; bottom: 0; width: 8px; }
.sb-soc-facup-25 .nm.h i { left: 0; } .sb-soc-facup-25 .nm.a i { right: 0; }
.sb-soc-facup-25 .sc { position: absolute; top: ${NT}px; width: ${SC}px; height: ${NH}px; background: #3e3e3e; color: #e4e4e4; display: grid; place-items: center;
  font-size: 54px; line-height: 1; font-weight: 700; min-width: 0 !important; }
.sb-soc-facup-25 .sc.h { left: ${NM}px; } .sb-soc-facup-25 .sc.a { left: ${NM + SC + TAB}px; }
.sb-soc-facup-25 .tab { position: absolute; left: ${NM + SC}px; top: ${TT}px; width: ${TAB}px; height: ${TH}px; background: #9d2832; color: #f4f4f4; display: grid; place-items: center;
  font-size: 46px; line-height: 1; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; padding: 0 10px; box-sizing: border-box; }
.sb-soc-facup-25 .tab.when { font-size: 30px; }
.sb-soc-facup-25 .cup { position: absolute; left: ${NM + SC}px; top: ${TT + 2 - LG}px; width: ${TAB}px; height: ${LG}px; display: grid; place-items: center; z-index: 2; }
.sb-soc-facup-25 .cup .sb-league { width: ${LG}px; height: ${LG}px; object-fit: contain; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    [[h, 'h'], [a, 'a']].forEach(([t, k]) => {
      const n = el('div', 'nm ' + k), strip = el('i');
      // the strip holds no letters, so it takes the team's own colour as listed (Man City's sky blue on air, #b7c8e0 through the blur),
      // not the darker stand-in the kit picks for white letters; a near-white kit, which would vanish on the light box, keeps the stand-in
      const own = t.pairColor || (t.onAir && t.onAir.color) || t.color;
      strip.style.background = /^#[0-9a-f]{6}$/i.test(own || '') && contrast(own, '#e0e3e0') >= 1.4 ? own : teamColor(t, '#9d2832');
      n.append(strip, fit(el('span', '', (t.abbr || '').toUpperCase())));
      // before the kick-off the score boxes stay empty: the kit puts each team's record in them
      root.append(n, scoreSlot(el('div', 'sc ' + k, live && t.score != null ? String(t.score) : ''), g));
    });
    if (mk.league) { const cup = el('div', 'cup'); cup.appendChild(leagueLogo(g, LG)); root.appendChild(cup); }
    const clock = mmss(soccerClock(g, time));
    root.appendChild(el('div', 'tab' + (clock.length > 5 ? ' when' : ''), clock));
  },
};
