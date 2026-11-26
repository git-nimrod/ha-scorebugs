// "Chrome bar '11": after ESPN's college basketball bug (2011-16; frames: Arkansas State at Mississippi State, Alcorn State at Iowa). A
// silver chrome bar with a gold rim: the network's box at the left (here the Home Assistant logo), then each team as a panel in its
// colour with its logo on a small dark tile and its name, its score on a black plate, and its timeouts as yellow dashes along the bar's
// foot; then a white box with the half | the clock. The shot clock's red square and the possession line are left out (no data).
import { el, logo, statusText, teamColor, teamPair, shade, haMark, marks, teamInk, scoreSlot, fit, FONTS } from '../kit.js';

// the bar is exactly as long as its parts: mark, two names, two scores, the clock, the gaps, padding and rim
// loop pass 1 (real stills: ESPN 2013-14 thumbnails, Michigan St v Kentucky and Syracuse v Louisville, 54 px bars, x1.34
// here): the network's box 111 px on air (148 here, was 118), the score plates 41-46 px (60 here, was 74); the bar's rim a 2 px
// silver-white line along the top and foot and a cream-gold cap 6-7 px wide at each end only (9 here), not a gold line all round
const END = 2, PADX = 6, MARK = 148, NAME = 300, SCORE = 60, CLOCK = 210, TIMEOUTS = 5;
const W = MARK + 2 * (NAME + SCORE) + CLOCK + 5 * 4 + 2 * (END + PADX), H = 72, BAR = 58;
const NAME_PX = 28, RANK_PX = 18, SCORE_PX = 36, CLOCK_PX = 30;

export default {
  id: 'cbb-chrome-11',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.workSans],
  css: `
.sb-cbb-chrome-11 { font-family: 'SB Work Sans', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* face: ESPN college basketball c.2016: Work Sans 800 */
.sb-cbb-chrome-11 .bar { position: absolute; left: 0; top: 0; width: ${W}px; height: ${BAR}px; box-sizing: border-box; padding: 4px ${PADX}px; border-style: solid; border-width: 2px ${END}px;
  border-color: #b08a3a; border-radius: 4px;
  background: linear-gradient(#f1f2f3, #a9adb2 48%, #cfd2d6 52%, #8f949a); display: grid; grid-template-columns: ${MARK}px ${NAME}px ${SCORE}px ${NAME}px ${SCORE}px ${CLOCK}px; gap: 4px; grid-template-rows: minmax(0, 1fr);
  box-shadow: 0 3px 6px rgba(0,0,0,.5); }
.sb-cbb-chrome-11 .mk { display: grid; place-items: center; background: linear-gradient(#3d4046, #1d1f23); } .sb-cbb-chrome-11 .mk .sb-ha { color: #f2f2f2; }
.sb-cbb-chrome-11 .tm { display: grid; grid-template-columns: 62px minmax(0, 1fr); align-items: center; }
.sb-cbb-chrome-11 .tile { height: 100%; display: grid; place-items: center; background: linear-gradient(#45484e, #1f2125); }
.sb-cbb-chrome-11 .tile .sb-logo { width: 58px; height: 44px; object-fit: contain; }
.sb-cbb-chrome-11 .nm { text-align: center; font-size: ${NAME_PX}px; font-stretch: 90%; white-space: nowrap; letter-spacing: .3px; }
.sb-cbb-chrome-11 .nm b { font-size: ${RANK_PX}px; margin-right: 6px; opacity: .9; }
.sb-cbb-chrome-11 .sc { display: grid; place-items: center; background: linear-gradient(#26282c, #050506); font-size: ${SCORE_PX}px; line-height: 1; }
.sb-cbb-chrome-11 .ck { display: flex; align-items: center; justify-content: center; gap: 14px; background: linear-gradient(#ffffff, #dfe1e4); color: #111; font-size: ${CLOCK_PX}px; }
.sb-cbb-chrome-11 .ck i { width: 2px; height: 28px; background: #555; }
.sb-cbb-chrome-11 .ft { position: absolute; left: 2px; top: ${BAR}px; width: ${W - 4}px; height: ${H - BAR}px; background: linear-gradient(#1c1d20, #0b0b0c); }   /* the dark strip the timeouts run along (frame sweep) */
.sb-cbb-chrome-11 .to { position: absolute; top: ${BAR + 3}px; display: flex; gap: 8px; }
.sb-cbb-chrome-11 .to i { width: 34px; height: 5px; background: #f2c400; } .sb-cbb-chrome-11 .to i.used { background: #5a5a4c; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(34));
    const pair = teamPair(g.away, g.home, '#3a3f47');  // never two alike panels
    const team = (t) => {
      const c = pair[t === g.away ? 0 : 1];
      const p = el('div', 'tm');
      // a deeper shade of the team colour under the name, as on air
      p.style.background = 'linear-gradient(' + shade(c, -0.32) + ', ' + shade(c, -0.55) + ')';
      p.style.color = teamInk(c);
      // the logo on a deeper shade of the team's own colour, as on air (the W on purple, UCLA on blue)
      // the logo in its own box, a slightly lighter shade than the name's panel
      const tile = el('span', 'tile'); tile.style.background = 'linear-gradient(' + shade(c, -0.08) + ', ' + shade(c, -0.3) + ')'; tile.style.boxShadow = 'inset -2px 0 0 rgba(0,0,0,.35)'; tile.appendChild(logo(t, 58));
      const nm = fit(el('span', 'nm'), (t.abbr || '').toUpperCase());
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase()));
      p.append(tile, nm);
      return [p, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g)];
    };
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('i'), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(mk, ...team(g.away), ...team(g.home), ck);
    root.append(el('div', 'ft'), bar);
    // the timeouts along the bar's foot, under each team's name
    [g.away, g.home].forEach((t, i) => {
      // during play the yellow dashes are always drawn; a feed without timeout counts shows them all lit
      // only sports that have timeouts draw them
      if (!live || !['basketball', 'football'].includes(g.sport)) return;
      const to = el('span', 'to'); to.style.left = (END + PADX + MARK + 4 + i * (NAME + SCORE + 8) + 70) + 'px';
      for (let k = 0; k < TIMEOUTS; k++) to.appendChild(el('i', t.timeouts != null && k >= t.timeouts ? 'used' : ''));
      root.appendChild(to);
    });
  },
};
