// "Stadium bar": after Stadium's college football bug (late 2010s). A long smoky black bar: the away team's logo on a pale tile of its colour, its name in slanted capitals on its
// colour with its timeouts as white lines under it, and its score in white; in the middle the quarter and the clock in slanted white, and
// a blue chevron pointing at the team with the ball; then the home team mirrored, and the network's mark at the right (here the Home
// Assistant logo).
import { el, logo, statusText, teamPair, panelInk, shade, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

// measured off the frame: wide pale logo tiles and narrow name tiles; the bar's top and bottom edges are
// straight (line fit: 0.0 deg, under 0.2 px off) with square ends. The frame's empty dark lead-in at the left and its two blank cells
// before the quarter are left out; during play the down and
// distance has one cell of its own, there only when there is a down to show
const H = 64, LEAD = 10, TILE = 140, NAME = 100, SCORE = 72, CELL1 = 110, MID = 220, MARK = 160;
const W = LEAD + 2 * (TILE + NAME + SCORE) + CELL1 + MID + MARK + 10;
const hasDown = (g) => g.status === 'live' && !!(g.football && g.football.short);

export default {
  id: 'cfb-stadium-19',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: hasDown(g) ? W : W - CELL1, h: H }),
  fonts: [FONTS.barlowCond700i, FONTS.barlowCond700],
  css: `
.sb-cfb-stadium-19 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; display: flex; align-items: stretch; height: ${H}px; padding: 6px 10px 6px ${LEAD}px; box-sizing: border-box;
  background: radial-gradient(ellipse 9% 90% at 3% 50%, rgba(255,255,255,.16), transparent), linear-gradient(#2a2b2e, #0c0c0d 50%, #1b1b1d); box-shadow: 0 3px 8px rgba(0,0,0,.55); }
.sb-cfb-stadium-19 .tile { width: ${TILE}px; flex: none; display: grid; place-items: center; overflow: hidden; }
.sb-cfb-stadium-19 .tile .sb-logo { width: 70px; height: 48px; object-fit: contain; }
.sb-cfb-stadium-19 .nm { width: ${NAME}px; flex: none; position: relative; display: grid; place-items: center; font-style: italic; font-size: 32px; text-transform: uppercase; letter-spacing: .5px; }
.sb-cfb-stadium-19 .nm .to { position: absolute; left: 8px; right: 8px; bottom: 3px; display: flex; gap: 6px; } .sb-cfb-stadium-19 .nm .to i { flex: 1; height: 3px; background: #fff; } .sb-cfb-stadium-19 .nm .to i.used { opacity: .15; }
.sb-cfb-stadium-19 .sc { width: ${SCORE}px; flex: none; display: grid; place-items: center; font-size: 40px; font-weight: 700; font-style: normal; }
.sb-cfb-stadium-19 .sc.rec { font-size: 20px; }
.sb-cfb-stadium-19 .cell { flex: none; display: grid; place-items: center; font-style: italic; font-size: 24px; border-left: 1px solid rgba(255,255,255,.14); }
.sb-cfb-stadium-19 .mid { border-left: 1px solid rgba(255,255,255,.14); width: ${MID}px; flex: none; display: flex; align-items: center; justify-content: center; gap: 0; font-style: italic; font-size: 28px; }
.sb-cfb-stadium-19 .mid > span { white-space: nowrap; padding: 0 12px; border-left: 1px solid rgba(255,255,255,.14); } .sb-cfb-stadium-19 .mid > span:first-child { border: 0; }
.sb-cfb-stadium-19 .mid .pz { color: #2aa8f0; font-style: normal; font-size: 30px; width: 22px; padding: 0; border: 0; }
.sb-cfb-stadium-19 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; } .sb-cfb-stadium-19 .mk .sb-ha { color: #d8dade; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const side = (t, k) => {
      const c = pair[k];
      // the logo tile only a little lighter than the name tile, still clearly the team's colour (frame: Navy's name tile 2,45,68, its logo
      // tile 4,61,93; Maine's logo tile a strong sky blue, not near white)
      const tile = el('div', 'tile'); tile.style.background = 'linear-gradient(' + shade(c, 0.2) + ', ' + shade(c, 0.08) + ')'; tile.appendChild(logo(t, 48));
      const nm = el('div', 'nm'); nm.style.background = 'linear-gradient(' + shade(c, 0.12) + ', ' + shade(c, -0.12) + ')';
      nm.style.color = panelInk(t, c);  // white letters unless the tile is too light for them (Cal gold)
      nm.appendChild(fit(el('span', '', t.abbr && t.abbr.length > 4 ? t.abbr : t.name && t.name.length <= 7 ? t.name : t.abbr || '')));
      if (live && t.timeouts != null) { const to = el('span', 'to'); for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : '')); nm.appendChild(to); }
      const sc = g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      return k ? [sc, nm, tile] : [tile, nm, sc];
    };
    const mid = el('div', 'mid');
    if (live) {
      mid.appendChild(el('span', 'pz', g.away.hasBall ? '«' : ''));
      // the sport's own word: hockey plays periods, men's college basketball halves
      mid.append(el('span', '', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toUpperCase() + (g.sport === 'hockey' ? ' PER' : g.league === 'NCAAM' ? ' HALF' : ' QTR'))), el('span', '', g.clock || ''));
      mid.appendChild(el('span', 'pz', g.home.hasBall ? '»' : ''));
    } else mid.appendChild(el('span', '', statusText(g, time)));
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(36));
    const cells = [];
    if (hasDown(g)) { const c1 = el('div', 'cell', g.football.short); c1.style.width = CELL1 + 'px'; cells.push(c1); }
    root.append(...side(g.away, 0), ...cells, mid, ...side(g.home, 1), mk);
  },
};
