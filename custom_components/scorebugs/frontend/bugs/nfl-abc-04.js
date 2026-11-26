// "Red frame '04": after ABC's Monday Night Football bug (2003-04). A
// glossy red oval at the top left with the network's mark and the clock (here the Home Assistant logo), the quarter dark on a gold tab at
// the right; then a box of black rows in a thin dark maroon frame (the gold tab runs down its right side), each a small red marker, the team's name in white, and its score dark on a white
// cell with a red rim; the down and distance dark on a white plate under it.
import { el, statusText, scoreSlot, haMark, marks, fit, FONTS } from '../kit.js';

const W = 420, TOP = 72, ROW = 58, DOWN = 48, H = TOP + 2 * ROW + 6 + DOWN;
// the quarter's tab as wide as on air: 80 of the box's 214 px on the frame, so 146 here; the oval's right end lies over its left part
const TAB = 146;
// the gold runs on left under the oval to the oval's middle, the oval lying over it: the tab starts at the oval's
// centre (145 of its 290 px); what shows of it is the part right of the oval and the gold filling under the oval's right shoulder
const OVW = 290, GOLD_L = OVW / 2;

export default {
  id: 'nfl-abc-04',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H : TOP + 2 * ROW + 14 }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-abc-04 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 78%; color: #fff; }
.sb-nfl-abc-04 .ov { position: absolute; left: 0; top: 0; width: ${OVW}px; height: ${TOP}px; border-radius: 50%; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 10px;
  background: radial-gradient(ellipse at 50% 30%, #e8343c, #b8101a 50%, #7d0810); box-shadow: 0 0 0 4px #2a0204, 0 5px 9px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,196,196,.95), inset 0 0 0 7px rgba(242,96,102,.9), inset 0 3px 5px rgba(255,255,255,.45);
  font-size: 48px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.55); }
.sb-nfl-abc-04 .ov .sb-ha { color: #fff; } .sb-nfl-abc-04 .ov .w { font-size: 30px; }
/* two arcs round the oval, as on air: its outer edge a dark maroon ring
 (2.5 of the frame's 60 px tall oval, 4 px here), and just inside it a lighter, glassy red ring following the same oval (about 4 frame
 px, 7 here) round the deeper red middle */
/* the red oval runs onto the tab: its right end covers the tab's first 30 px (frame: 22 of the tab's 80), so the quarter is centred in the part left showing */
.sb-nfl-abc-04 .q { white-space: nowrap; position: absolute; right: 14px; top: ${TOP - 42}px; left: ${GOLD_L}px; height: 40px; box-sizing: border-box; padding: 0 0 0 ${OVW - GOLD_L}px; display: grid; place-items: center; font-size: 32px; line-height: 1; color: #3b2a05;
  background: linear-gradient(#ffe9a0, #e2b843 55%, #b88a1c); border-radius: 4px 18px 0 0; }
/* the tab's top right corner a px: on the frame a circle of radius 14.5 px on a tab 31 px tall (0.47 of its height) */
/* the rows in a thin dark maroon frame; the gold is the quarter's tab and a strip running down from it along the box's right side */
/* the frame's top line starts 2 px above the oval's foot, so the oval dips a little into it, as on air (frame: the oval's foot about a
 third of the way into the 5 px line) */
.sb-nfl-abc-04 .bx { position: absolute; left: 14px; right: 14px; top: ${TOP - 2}px; padding: 4px; display: grid; grid-auto-rows: ${ROW - 3}px; gap: 4px;
  background: #3a080c; border-right: 14px solid; border-image: linear-gradient(#ffe9a0, #d8ad3c 50%, #a97e16) 1; box-shadow: 0 4px 8px rgba(0,0,0,.55); }
.sb-nfl-abc-04 .ln { display: flex; align-items: center; gap: 10px; padding-left: 10px; background: linear-gradient(90deg, #050506, #1c1c20 70%, #2b2b30); font-size: 42px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nfl-abc-04 .ln .mk { width: 12px; height: 14px; background: #d0141e; flex: none; }
.sb-nfl-abc-04 .ln .nm { flex: 1; min-width: 0; white-space: nowrap; }
.sb-nfl-abc-04 .sc { min-width: 62px; height: 100%; display: grid; place-items: center; background: linear-gradient(#ffffff, #dadcdf); color: #111; text-shadow: none; box-shadow: inset 0 0 0 3px #6a0d14; padding: 0 4px; box-sizing: border-box; }
.sb-nfl-abc-04 .sc.rec { font-size: 26px; padding: 0 8px; }
.sb-nfl-abc-04 .dn { position: absolute; left: 14px; right: 28px; top: ${TOP + 2 * ROW + 6}px; height: ${DOWN}px; display: grid; place-items: center; color: #111; font-size: 34px; line-height: 1;
  background: linear-gradient(#ffffff, #d8dade); border-radius: 0 0 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,.5); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const ov = el('div', 'ov');
    if (marks(opts).ha) ov.appendChild(haMark(38));
    ov.appendChild(el('span', live ? '' : 'w', live ? g.clock || '' : statusText(g, time)));
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      // on air the rows carried a short team name (FINS, JETS): a name of five letters or fewer is shown, else the team's letters
      const nm = t.name && t.name.length <= 5 ? t.name : t.abbr || '';
      ln.append(el('i', 'mk'), fit(el('span', 'nm', nm.toUpperCase())),
        g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    root.append(bx);
    if (live) { const q = el('div', 'q'); q.appendChild(document.createTextNode((g.period.label || '') + (g.period.suffix || '').toLowerCase())); root.appendChild(q); }
    root.appendChild(ov);
    if (live && g.football && g.football.short) root.appendChild(el('div', 'dn', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal')));
  },
};
