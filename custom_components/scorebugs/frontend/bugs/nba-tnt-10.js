// "White scores '10": after the NBA score bar on TNT, 2010-12 (frame: Knicks at Bulls, 1st quarter, from a sheet of TNT's NBA bugs by
// era; rough: the bar is 100 x 19 px on the sheet, so finish readings are guides). A slim black bar, its left corners lightly
// rounded, on two lines: the teams' letters in white each followed by its score black on a white box cut on a slant at its right
// end; under them the quarter and the clock. The bar's right end swells into a black disc with a thin silver ring, holding the
// network's mark (here the Home Assistant logo, in the ring's grey). The shot clock (under the second team) is left out: no data. The
// red under the bar on the sheet is the picture behind it. No team colours on air.
// measured (100 px frame, x5): bar rows 1..17 of 19 (5..90 here), left corners r about 3 px (15 here); the disc's ring fitted as a
// circle (ring.py, circle_fit): centre 0.89 across, 0.49 down, r 6.6 px = 0.39 of the bar's height (35 here, read 36 on the registered frame); the black disc round
// it r about 9.5 px (47 here) rising 1 px over the bar's top; score boxes 14-15 px wide, the second's right end cut 35 deg; caps 5 px (25 here)
// on both lines.
import { el, statusText, haMark, marks, fit, scoreSlot, FONTS } from '../kit.js';

const W = 500, H = 95, CX = 446, CY = 47, RD = 47, RR = 35;

export default {
  id: 'nba-tnt-10',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-10 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 700; color: #f2f2f4; }
.sb-nba-tnt-10 .bar { position: absolute; left: 5px; top: 5px; width: ${CX - 5}px; height: 85px; border-radius: 15px 0 0 15px;
  background: linear-gradient(#202022, #0b0b0c 45%, #050505); box-shadow: inset 0 1px 0 rgba(255,255,255,.12); }
/* the right end: a black disc (border-radius 50%) with a thin silver ring round the network's mark */
.sb-nba-tnt-10 .disc { position: absolute; left: ${CX - RD}px; top: ${CY - RD}px; width: ${2 * RD}px; height: ${2 * RD}px; border-radius: 50%; background: radial-gradient(circle at 45% 35%, #1e1e20, #060606 70%); }
.sb-nba-tnt-10 .ring { position: absolute; left: ${CX - RR}px; top: ${CY - RR}px; width: ${2 * RR}px; height: ${2 * RR}px; box-sizing: border-box; border-radius: 50%;
  border: 5px solid #a9a9ad; display: grid; place-items: center; color: #8e8e94; }
.sb-nba-tnt-10 .nm, .sb-nba-tnt-10 .sc { position: absolute; top: 8px; height: 36px; display: flex; align-items: center; line-height: 1; font-size: 37px; white-space: nowrap; }
.sb-nba-tnt-10 .nm { justify-content: center; }
.sb-nba-tnt-10 .sc { justify-content: center; padding: 0 22px 0 4px; box-sizing: border-box; background: linear-gradient(#ffffff, #dedee2); color: #0c0c0e; font-weight: 800;
  clip-path: polygon(0 0, 100% 0, calc(100% - 25px) 100%, 0 100%); }
/* only the second team's box is cut on a slant, leading into the disc; the first team's box ends square (here 25 px over the box's 36) */
.sb-nba-tnt-10 .sc.a { clip-path: none; padding-right: 4px; }
.sb-nba-tnt-10 .sc.rec { font-size: 22px; font-weight: 700; }
.sb-nba-tnt-10 .ln { position: absolute; top: 56px; height: 30px; display: flex; align-items: center; justify-content: center; line-height: 1; font-size: 36px; white-space: nowrap; }
.sb-nba-tnt-10 .ln.st { font-size: 28px; letter-spacing: 1px; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live';
    root.append(el('div', 'bar'), el('div', 'disc'));
    const recs = pre && g.away.record && g.home.record;
    [[g.away, 25, 118], [g.home, 210, 310]].forEach(([t, nx, sx], i) => {
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      nm.style.left = nx + 'px'; nm.style.width = (sx - nx - 12) + 'px';
      const sc = el('div', 'sc' + (i ? '' : ' a') + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      // a long record (10-14-1) is squeezed to its box
      // (the second box is wider by its slant, and a 3-figure score is squeezed to the room left of the slant, never cut by it)
      if (recs) fit(sc); else fit(scoreSlot(sc, g));
      sc.style.left = sx + 'px'; sc.style.width = (recs ? 84 : 80) + (i ? 12 : 0) + 'px';
      root.append(nm, sc);
    });
    if (live) {
      const p = g.period, q = el('div', 'ln', p.word ? p.label : (p.label + (p.suffix || '')).toUpperCase());
      q.style.left = '40px'; q.style.width = '70px';
      const ck = el('div', 'ln', g.clock || '');
      ck.style.left = '160px'; ck.style.width = '100px';
      root.append(q, ck);
    } else {
      const st = fit(el('div', 'ln st', statusText(g, time)));
      st.style.left = '30px'; st.style.width = '360px';
      root.appendChild(st);
    }
    const ring = el('div', 'ring');
    if (marks(opts).ha) ring.appendChild(haMark(40));
    root.appendChild(ring);
  },
};
