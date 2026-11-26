// "Eye bar '04": after CBS's NFL bug (2004). A navy glass bar with fine
// light lines across it: a big round disc at the left that stands proud of the bar (the network's eye in it; here the Home Assistant logo),
// the quarter over the clock beside it, then a split and each team's letters and score on its own row. Under the bar, below the clock, the
// down and distance on a navy tab with a thin light rim.
import { el, statusText, haMark, marks, scoreSlot, FONTS } from '../kit.js';

// the bar's left end starts behind the disc, so its top and bottom left corners are tucked inside the circle: on the
// frame the disc is a circle of radius 94 (fit to its rim, 1.6 px rms) on a bar 159 tall, and the bar's top edge meets it 52 px right of its
// centre; here the corners sit at (80, 10) and (80, 166), 10 px inside the disc's edge. The time box gives up those 40 px so the split stays put.
const BAR_L = 80, TIME_W = 320;
// the down tab hangs straight off the bar's foot (no gap) and ends on the right exactly under the time box's right edge, the split
const W = 760, BAR_T = 10, BAR = 156, DISC = 176, TAB = 96, H = BAR_T + BAR + TAB + 8, BASE_H = BAR_T + BAR + 10, PRE_CUT = 70;
// a deep navy, dark at the top, a soft lighter band about two thirds down and near black at the foot (frame: 0,24,50 at the top, 15,41,74
// in the middle, 41,72,93 at the band, 2,12,14 at the foot)
const NAVY = 'linear-gradient(#062148, #001c44 18%, #0c2a52 40%, #0f2d55 56%, #29485e 66%, #12304a 76%, #06141c 94%, #03090c)';
// fine light lines across the navy, as on air
const LINES = 'repeating-linear-gradient(rgba(255,255,255,.05) 0 2px, rgba(255,255,255,0) 2px 7px)';

const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-cbs-04',
  size: { w: W, h: H },
  // the down tab's room only while a football game runs; before the kick-off without records the score room goes
  sizeFor: (g) => ({ w: closeUp(g) ? W - PRE_CUT : W, h: g.status === 'live' && g.football ? H : BASE_H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-cbs-04 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 96%; color: #fff; }
.sb-nfl-cbs-04 .bar { position: absolute; left: ${BAR_L}px; right: 0; top: ${BAR_T}px; height: ${BAR}px; border-radius: 6px; display: flex; overflow: hidden;
  background: ${LINES}, ${NAVY}; box-shadow: 0 4px 10px rgba(0,0,0,.55), inset 0 0 0 2px rgba(160,190,235,.35); }
/* the disc: a dark ring with a light blue rim, the mark in its middle, standing out over the bar's top and bottom */
.sb-nfl-cbs-04 .disc { position: absolute; left: 0; top: ${BAR_T + BAR / 2 - DISC / 2}px; width: ${DISC}px; height: ${DISC}px; border-radius: 50%; display: grid; place-items: center; z-index: 2;
  background: radial-gradient(circle at 50% 50%, #0a1430 0 50%, #a9c8f0 53%, #3a68ad 57%, #0d1e42 66%, #1d3f7c 88%, #6f9bd8 95%, #1d3a6e 100%);
  box-shadow: 0 4px 10px rgba(0,0,0,.6), inset 0 3px 4px rgba(255,255,255,.35); }
.sb-nfl-cbs-04 .disc .sb-ha { color: #fff; filter: drop-shadow(0 2px 2px rgba(0,0,0,.5)); }
.sb-nfl-cbs-04 .time { width: ${TIME_W}px; flex: none; display: grid; align-content: center; justify-items: end; padding-right: 30px; box-sizing: border-box; line-height: 1.02; font-size: 62px; text-shadow: 0 2px 3px rgba(0,0,0,.55); }
.sb-nfl-cbs-04 .time .sb-ord { font-size: .85em; text-transform: lowercase; }
.sb-nfl-cbs-04 .time .w { font-size: 36px; margin-right: -12px; }   /* the start time clear of the disc now the time box is 40 px shorter */
/* a start time with its day goes on two lines, the day over the time, as the quarter stands over the clock ('FRI 12:25 PM' ran under the disc) */
.sb-nfl-cbs-04 .time .w2 { font-size: 42px; text-align: right; line-height: 1.08; }
/* the split: a thin dark line with a light edge, the full height */
.sb-nfl-cbs-04 .split { width: 6px; flex: none; background: linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.55) 50%, rgba(190,210,240,.35) 50%); }
.sb-nfl-cbs-04 .teams { flex: 1; display: grid; grid-template-rows: 1fr 1fr; align-content: center; padding: 6px 36px 6px 38px; }
.sb-nfl-cbs-04 .ln { display: flex; align-items: center; justify-content: space-between; font-size: 62px; line-height: 1; text-shadow: 0 2px 3px rgba(0,0,0,.55); }
.sb-nfl-cbs-04 .ln .sc { text-align: right; }
.sb-nfl-cbs-04 .ln .sb-rec { font-size: 40px; }
/* the ball mark sits in the gap before the letters, so the team with the ball keeps its letters lined up with the other team's
 */
.sb-nfl-cbs-04 .ln > span:first-child { position: relative; }
.sb-nfl-cbs-04 .ln .ball { position: absolute; left: -26px; top: 50%; margin-top: -6px; width: 12px; height: 12px; border-radius: 50%; background: #fff; box-shadow: 0 0 6px rgba(255,255,255,.7); }
/* the down tab joined to the split: its right edge runs on
 straight down from the split, the split's full 6 px included, so the divider and the tab's rim are one line; between bar and tab a light
 rule along the bar's whole foot, silver at the ends and gold where it meets the split and the tab (frame: 8 px, about 120,130,135 under
 the clock, a copper gold 136,99,91 round the split, back to a grey blue at the right end) */
.sb-nfl-cbs-04 .ft { position: absolute; left: ${BAR_L - 10}px; right: 0; top: ${BAR_T + BAR - 4}px; height: 8px; z-index: 1; border-radius: 0 0 4px 0;
  background: linear-gradient(rgba(255,255,255,.25), rgba(0,0,0,.2)), linear-gradient(90deg, #8b969e, #a9b2b8 22%, #d8a45c 42%, #e0b060 47%, #c9955a 56%, #9aa3ab 72%, #6f8094); }
.sb-nfl-cbs-04 .dn { position: absolute; left: 70px; width: ${BAR_L + TIME_W + 6 - 70}px; top: ${BAR_T + BAR + 4}px; height: ${TAB - 4}px; display: grid; place-items: center; border-radius: 0 0 4px 4px; font-size: 64px; line-height: 1;
  background: ${LINES}, ${NAVY}; box-shadow: 0 4px 10px rgba(0,0,0,.55), inset 0 0 0 2px rgba(200,215,240,.55); text-shadow: 0 2px 3px rgba(0,0,0,.55); }
.sb-nfl-cbs-04 .dn:empty { display: none; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const disc = el('div', 'disc'); if (marks(opts).ha) disc.appendChild(haMark(104));
    const tm = el('div', 'time');
    if (live) {
      const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix));
      tm.append(q, el('span', '', g.clock || ''));
    } else {
      const st = statusText(g, time), m = /^(\S+) (\d.*)$/.exec(st);
      if (m) tm.append(el('span', 'w2', m[1]), el('span', 'w2', m[2]));
      else tm.appendChild(el('span', 'w', st));
    }
    const teams = el('div', 'teams');
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      const nm = el('span', '');
      if (live && t.hasBall) nm.appendChild(el('i', 'ball'));
      nm.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      let sc;
      if (g.status !== 'pre') sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      else if (!closeUp(g)) sc = el('small', 'sb-rec', t.record);
      ln.appendChild(nm); if (sc) ln.appendChild(sc);
      if (!sc) ln.style.justifyContent = 'center';
      teams.appendChild(ln);
    });
    bar.append(tm, el('i', 'split'), teams);
    const dn = el('div', 'dn', live && g.football && g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '');
    root.append(bar, disc, dn);
    if (live && g.football) root.insertBefore(el('i', 'ft'), disc);
  },
};
