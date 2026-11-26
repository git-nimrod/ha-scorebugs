// "Black box '01": after ABC's Monday Night Football bug (2001-02). A glossy black oval with a red rim at the top left (the network's mark beside the clock there; here the Home
// Assistant logo), the quarter on a small red tab at the right, then a black box with each team's letters in white and its score dark on
// a white cell, and the down and distance dark on a white plate under it.
import { el, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 420, TOP = 74, ROW = 60, DOWN = 52, H = TOP + 2 * ROW + 20 + DOWN;

export default {
  id: 'nfl-abc-01',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H : TOP + 2 * ROW + 14 }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-abc-01 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 78%; color: #fff; }
/* more oval at the top: a true ellipse now, its ends pointed as on air; it was the blunter shape below
 the oval's ends were blunter than a true ellipse: on air the left end bends on a circle of radius 29.5 px on a 71 px tall, 201 px wide oval
 (0.42 of its height; a true ellipse that size would bend at 12), the oval level (tilt 1.4 deg); so each end is a quarter ellipse 16.5 %
 of the width across and half the height tall, which gives the same end bend at our size */
.sb-nfl-abc-01 .ov { position: absolute; left: 10px; top: 0; width: 270px; height: ${TOP}px; border-radius: 50%; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 10px;
  background: radial-gradient(ellipse at 50% 30%, #4a4a50, #121214 55%, #000); box-shadow: 0 0 0 4px #b3121c, 0 0 0 6px #5d080d, 0 5px 9px rgba(0,0,0,.6), inset 0 3px 4px rgba(255,255,255,.3);
  font-size: 46px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nfl-abc-01 .ov .sb-ha { color: #fff; }
.sb-nfl-abc-01 .ov .w { font-size: 30px; }
/* the quarter is not on a tab: on air it sits in a dark red glow that comes out of the oval's right end and fades down into the black
   box (frame: red strongest 0.76 of the box's width across and 9 px over its top, half as strong about 45 px to either side, gone 11 px
   into the box); its figures a light pinkish red, their foot just above the box (frame: centre 0.86 of the box's width across) */
/* the glow sits behind the quarter, centred on it, and the quarter is full white; it still reaches back to the
 oval's end and fades into the box's top */
.sb-nfl-abc-01 .gl { position: absolute; left: 190px; top: 9px; width: 230px; height: 92px; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse 80px 46px at 150px 50%, rgba(170,16,26,.95), rgba(130,10,20,.7) 45%, rgba(90,6,14,.3) 75%, transparent),
    radial-gradient(ellipse 70px 34px at 90px 52%, rgba(150,12,22,.75), rgba(110,8,18,.4) 55%, transparent); }
.sb-nfl-abc-01 .q { white-space: nowrap; position: absolute; left: 280px; right: 20px; top: ${TOP - 40}px; height: 42px; display: flex; align-items: center; justify-content: center; z-index: 3; font-size: 36px; line-height: 1;
  color: #fff; text-shadow: 0 2px 2px rgba(0,0,0,.55); }
.sb-nfl-abc-01 .q .sb-ord { font-size: .8em; }
.sb-nfl-abc-01 .bx { position: absolute; left: 20px; right: 20px; top: ${TOP + 6}px; padding: 6px 6px 6px 14px; display: grid; grid-auto-rows: ${ROW - 6}px; gap: 6px;
  background: linear-gradient(#232326, #050506); box-shadow: 0 4px 8px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.14); }
.sb-nfl-abc-01 .ln { display: flex; align-items: center; justify-content: space-between; font-size: 46px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nfl-abc-01 .sc { min-width: 62px; height: 100%; display: grid; place-items: center; background: linear-gradient(#ffffff, #d6d8dc); color: #111; text-shadow: none; }
.sb-nfl-abc-01 .sc.rec { font-size: 28px; padding: 0 8px; }
/* the down plate as long as the box above it (on air both run 238 px, edge to edge) */
.sb-nfl-abc-01 .dn { position: absolute; left: 20px; right: 20px; top: ${TOP + 2 * ROW + 20}px; height: ${DOWN}px; display: grid; place-items: center; color: #111; font-size: 36px; line-height: 1;
  background: linear-gradient(#ffffff, #d8dade); border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,.5), inset 0 -3px 0 #b3121c; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const ov = el('div', 'ov');
    if (marks(opts).ha) ov.appendChild(haMark(38));
    ov.appendChild(el('span', live ? '' : 'w', live ? g.clock || '' : statusText(g, time)));
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      ln.append(el('span', '', (t.abbr || '').toUpperCase()), g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    root.append(bx);
    if (live) root.appendChild(el('div', 'gl'));
    if (live) { const q = el('div', 'q'); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toLowerCase())); root.appendChild(q); }
    root.appendChild(ov);
    if (live && g.football && g.football.short) root.appendChild(el('div', 'dn', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal')));
  },
};
