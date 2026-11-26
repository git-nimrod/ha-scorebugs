// "Glass halves '20": after FOX's college football bug (early 2020s). A tall two-row box: on top two smoked-glass panels, each a
// tint of its team's colour with a fine light inner rim, the rank small before the team's name in slanted capitals, its record small
// under it, and its big slanted score at the inner edge, a white dot beside the score of the team with the ball; the timeouts as three
// white bars inside each panel at its outer edge. Under them a dark glass row with the quarter and the clock on the left and the down and
// distance on the right. The FLAG state is left out (no data).
// The timeouts are three bars inside each panel at its outer edge, leaning with the panel.
// Measured and checked with measure.py / compare.py: the panels carry a
// gloss horizon at 42% over their tint, the bottom row is see-through too (about 80%), each team's timeout bars are a pale tint of its
// colour (pale blue on Michigan's navy).
// Measured on the frame with a reference frame: both panels and the row are parallelograms leaning 9.3 deg
// (skewX(-9.3deg)), the letters slant 9.5 deg, the panels are see-through (about 70%) with a light inner rim about 5 px wide.
import { el, statusText, teamPair, shade, inkOn, scoreSlot, fit, gloss, glass, FONTS } from '../kit.js';

const W = 1180, TOP = 126, ROW = 82, H = TOP + ROW + 6;

export default {
  id: 'cfb-fox-20',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond700i, FONTS.barlowCond500],
  css: `
.sb-cfb-fox-20 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; font-style: italic; color: #fff; display: grid; grid-template-rows: ${TOP}px ${ROW}px; gap: 6px; height: ${H}px; padding: 0 26px; box-sizing: border-box; position: relative; }
.sb-cfb-fox-20 .top { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sb-cfb-fox-20 .tm { position: relative; display: flex; align-items: center; padding: 0 44px; gap: 16px; box-shadow: inset 0 0 0 7px var(--rim), 0 3px 8px rgba(0,0,0,.4); overflow: hidden; transform: skewX(-9.3deg); }
.sb-cfb-fox-20 .tm > *, .sb-cfb-fox-20 .row > * { transform: skewX(9.3deg); }
/* the rims: a light tint of the team's colour, not white: Penn State's near-white grey,
 Michigan's light blue; the outer 7 px, the inner rectangle 5 px */
/* a second, lighter rectangle inside the panel, starting just past the timeout bars */
.sb-cfb-fox-20 .tm::before { content: ''; position: absolute; top: 9px; bottom: 9px; left: 36px; right: 9px; box-shadow: inset 0 0 0 5px var(--rim); opacity: .85; pointer-events: none; }
.sb-cfb-fox-20 .tm.h::before { left: 9px; right: 36px; }   /* the panel leans; its letters keep their own italic */
.sb-cfb-fox-20 .tm.h { flex-direction: row-reverse; }
.sb-cfb-fox-20 .id { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.sb-cfb-fox-20 .h .id { align-items: flex-end; }
.sb-cfb-fox-20 .nm { font-size: 60px; line-height: 1; white-space: nowrap; text-transform: uppercase; text-shadow: 0 2px 2px rgba(0,0,0,.35); }
.sb-cfb-fox-20 .nm sup { font-size: .5em; vertical-align: .75em; margin-right: 4px; }
.sb-cfb-fox-20 .rc { font-size: 32px; font-weight: 500; opacity: .85; line-height: 1.1; }
.sb-cfb-fox-20 .sc { font-size: 96px; line-height: 1; text-shadow: 0 3px 3px rgba(0,0,0,.35); }
.sb-cfb-fox-20 .dot { width: 14px; height: 14px; border-radius: 50%; background: #fff; flex: none; }
.sb-cfb-fox-20 .row { transform: skewX(-9.3deg); display: grid; grid-template-columns: 1fr 1fr; align-items: center; background: ${glass('#14191a', 0.8).background}; box-shadow: 0 3px 8px rgba(0,0,0,.45); font-size: 66px; color: #d6d8da; }   /* measured on the frame: capitals 0.22 of the bug's height, light grey */
.sb-cfb-fox-20 .row .l { display: flex; justify-content: space-evenly; } .sb-cfb-fox-20 .row .r { text-align: center; text-transform: uppercase; }
.sb-cfb-fox-20 .row sup { font-size: .6em; vertical-align: .35em; }
.sb-cfb-fox-20 .row .w { grid-column: 1 / 3; text-align: center; font-size: 44px; }
/* the timeouts: three bars in a column just inside the panel's rim at its outer edge; inside the leaning panel, so each bar leans with it
   and the column steps left as it goes down (measured: 13x31 px bars, 4 px apart, 10 px in from the edge) */
.sb-cfb-fox-20 .tm > .to { transform: none; position: absolute; top: 13px; display: flex; flex-direction: column; gap: 4px; }
.sb-cfb-fox-20 .to i { width: 13px; height: 31px; border-radius: 2px; background: linear-gradient(90deg, #ffffff, #e9edf2); box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
.sb-cfb-fox-20 .to i.used { opacity: .18; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const top = el('div', 'top');
    [g.away, g.home].forEach((t, k) => {
      // a light team colour (Penn State's white) turns to mid-grey glass, so the white letters still read, as on air
      const c = inkOn(pair[k]) === '#fff' ? pair[k] : shade(pair[k], -0.42);
      const tm = el('div', 'tm' + (k ? ' h' : ''));
      // smoked glass in the team's colour (a white team reads as light grey glass, as Penn State did)
      tm.style.background = gloss(42, 0.22) + ', ' + glass(c, 0.72).background;
      tm.style.setProperty('--rim', shade(c, 0.55));   // see-through about 70%, a gloss horizon at 42% (measured)
      const id = el('div', 'id'), nm = el('span', 'nm');
      if (t.rank != null && t.rank <= 25) nm.appendChild(el('sup', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.longName && t.name && t.longName.endsWith(t.name) && t.longName !== t.name ? t.longName.slice(0, -t.name.length).trim() : t.abbr || '').toUpperCase()));
      id.append(fit(nm), el('span', 'rc', t.record || ''));
      tm.appendChild(id);
      if (g.status !== 'pre') { if (live && t.hasBall) tm.appendChild(el('i', 'dot')); tm.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g)); }
      if (live && t.timeouts != null) { const to = el('span', 'to'); to.style[k ? 'right' : 'left'] = '12px'; for (let i = 0; i < 3; i++) { const b = el('i', i >= t.timeouts ? 'used' : ''); b.style.background = shade(c, 0.8); to.appendChild(b); } tm.appendChild(to); }   // a pale tint of the panel's colour
      top.appendChild(tm);
    });
    const row = el('div', 'row');
    if (live) {
      const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (!g.period.word && g.period.suffix) q.appendChild(document.createTextNode(g.period.suffix.toUpperCase()));
      const l = el('div', 'l'); l.append(q, el('span', '', g.clock || ''));
      row.append(l, el('div', 'r', g.football && g.football.short ? g.football.short : ''));
    } else row.appendChild(el('div', 'w', statusText(g, time)));
    root.prepend(top); root.insertBefore(row, top.nextSibling);
  },
};
