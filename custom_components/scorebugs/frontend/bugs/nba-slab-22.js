// "Slab panels '22": after an NBA regional broadcast's bug of the early 2020s (a 330 x 162 px box, fair). Two tall flat panels side by side, each in its team's
// colour with its logo at the left and its score in big heavy white figures, and along the panel's foot the timeouts left ("TO: 4") in
// white italic capitals, and the team fouls this quarter ("FOULS:1") at the foot's left end (Scorebugs' sensors, live NBA and WNBA games); under both a light grey bar with the quarter and the clock in dark grey. Left out (no data): the shot clock in
// its darker box at the bar's right end. The bug carries no network mark, so
// there is no Home Assistant logo either. On the frame the Jazz wore black (an on-air alternate, not copied: the kit's colour stands).
// measured (x3 here): panels 0.71 of the height (the foot line the last 0.12 of it), a 3 px dark gap, the
// grey bar 0.26 (#eeeeee to #dcdcdc); the logo at the panel's left, the scores' figures 0.27 of the bug's height (0.45
// of the panel's score part), heavy and upright; the foot's capitals 14 px on the frame, italic about 10 deg; the bar's figures #484848,
// medium weight, the quarter written "4th".
// checked Nov 24: the logo stands 0.56 of the panel's height on the frame (Kings 215 of 385 px at review scale): 195 here, was 150.
// glass (the frame sampled in a grid, Nov 25): each tier its own glass cover. The team panels: a bright top line (+8 to +11 L in the top
// tenth) over the team colour, easing to a horizon and a deeper foot; the foot line with the fouls and timeouts 10 L darker than the
// panel on the Kings' purple (26 -> 15 L; the Jazz's black 8 -> 5), under its own lighter top. The time bar: light grey lit at the top
// and falling 6-7 L to its foot (93 -> 86 L), a light line along its top edge.
import { el, logo, statusText, teamPair, panelInk, shade, glassCover, scoreSlot, FONTS } from '../kit.js';

const W = 990, H = 486, PAN = 345, FOOT = 62, GAP = 9, BAR = H - PAN - GAP, LOGO = 195, PX = 180;

export default {
  id: 'nba-slab-22',
  size: { w: W, h: H },
  fonts: [FONTS.roboto, FONTS.robotoItalic],
  css: `
.sb-nba-slab-22 { font-family: 'SB Roboto', 'Arial', sans-serif; color: #fff; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: ${PAN}px ${BAR}px;
  row-gap: ${GAP}px; background: #1a1b1c; }
.sb-nba-slab-22 .pan { display: grid; grid-template-rows: 1fr ${FOOT}px; min-width: 0; }
.sb-nba-slab-22 .main { display: flex; align-items: center; gap: 16px; padding: 0 22px 0 10px; overflow: hidden; }
.sb-nba-slab-22 .main .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain; flex: none; }
/* the score set right after the logo (a third figure is shrunk to fit by the kit, the logo does not move) */
.sb-nba-slab-22 .sc { flex: 1; min-width: 0 !important; font-weight: 800; font-size: ${PX}px; line-height: 1; letter-spacing: 2px; text-align: left; }
/* the foot line: the team fouls at its left end, the timeouts left at its right end, white italic capitals */
.sb-nba-slab-22 .foot { display: flex; align-items: center; justify-content: space-between; padding: 0 34px; font-style: italic; font-weight: 700; font-size: 58px; letter-spacing: 1px; }
.sb-nba-slab-22 .bar { grid-column: 1 / -1; display: flex; align-items: center; gap: 84px; padding: 0 0 0 90px; background: ${glassCover('#e4e6e8', { top: 5, mid: 2, horizon: 42, step: 3, foot: -6 }).background};
  box-shadow: inset 0 2px 0 rgba(255,255,255,.75);
  color: #484848; font-weight: 500; font-size: 100px; line-height: 1; letter-spacing: 1px; }
.sb-nba-slab-22 .bar .w { flex: 1; text-align: center; padding: 0; font-size: 84px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    // never two look-alike panels (two navies), and dark letters on a light panel (GS gold)
    const [ca, ch] = teamPair(g.away, g.home, '#4a5560');
    [[g.away, ca], [g.home, ch]].forEach(([t, c]) => {
      const pan = el('div', 'pan');
      pan.style.color = panelInk(t, c);
      pan.style.background = c;
      const main = el('div', 'main');
      // the frame's glass: a bright band along the top (+9 L at the edge, gone by 10 % down)
      // with a light line on the top edge, then nearly flat to a faint deeper foot (Kings 36 -> 27 -> 26 L, Jazz 21 -> 7 -> 6)
      const gm = glassCover(c, { top: 9, mid: 1, horizon: 12, step: 1, foot: -2, line: 10 });
      main.style.background = gm.background; main.style.boxShadow = gm.shadow;
      main.append(logo(t, LOGO), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      const foot = el('div', 'foot');
      // the foot line is the panel's colour taken toward black, not only darker: the frame's Kings foot #311c48 under #552c79 and the
      // Jazz's #051016 under #0b181e are both about 0.6 of the panel's channels (11 L darker and greyer), and flat on air
      const fc = shade(c, -0.4), gf = glassCover(fc, { top: 1, mid: 0, horizon: 40, step: 1, foot: -1 });
      foot.style.background = gf.background; foot.style.color = panelInk(t, fc);
      foot.append(el('span', 'fl', live && t.fouls != null ? 'FOULS:' + t.fouls : ''), el('span', 'to', live && t.timeouts != null ? 'TO: ' + t.timeouts : ''));
      pan.append(main, foot);
      root.appendChild(pan);
    });
    const bar = el('div', 'bar');
    if (live) bar.append(el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', 'ck', g.clock || ''));
    else bar.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(bar);
  },
};
