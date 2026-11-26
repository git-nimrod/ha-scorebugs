// "Fade bar '12": after the NBA score bar on TNT, 2012-14 (frame: Thunder at Timberwolves, 2nd quarter, from a sheet of TNT's NBA bugs
// by era; rough: the bar is 131 x 24 px on the sheet, so finish readings are guides). A black bar with lightly rounded left corners and
// a round right end: the league's logo at the left; on the top line each team's letters on a wash of its colour that fades into the
// black, then its score black on a white box; on the second line the quarter and the clock; at the right end a silver ring round the
// network's mark (here the Home Assistant logo, white). The shot clock (red, under the second team) is left out: no data.
// measured (131 px frame, x4): bar rows 1..22 of 24 (4..88 here), left corners r about 3 px (12 here); the ring fitted as a circle
// (ring.py, circle_fit): centre 0.90 across, 0.50 down, r 8.6 px = 0.41 of the bar's height (34 here); the bar's right end fitted on
// its dark rim: a circle about the same centre, r 11.6 px, so the end is round (border-radius half the bar's height, 42 here);
// score boxes 16 px wide (64 here); caps 5.6 px on the top line (22 here), 5 px on the second (20 here).
import { el, statusText, haMark, marks, fit, scoreSlot, teamPair, alpha, FONTS } from '../kit.js';

const W = 503, H = 96, CX = 450, CY = 48, RR = 34, BT = 4, BH = 84;

export default {
  id: 'nba-tnt-12',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-12 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; color: #f4f4f6; }
/*: the league's logo is gone, everything moved 21 px
 towards the right end's side (the bug is 503 wide, was 524) and the left end is now round like the right one (a half circle of half
 the bar's height, 42 px; its corners were 12 px) */
.sb-nba-tnt-12 .bar { position: absolute; left: 1px; top: ${BT}px; width: ${CX + BH / 2 - 1}px; height: ${BH}px; border-radius: ${BH / 2}px;
  background: linear-gradient(#1e1e20, #0a0a0b 50%, #030303); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 2px 4px rgba(0,0,0,.4); }
/* each team's colour area glossier and its letters centred in it: the colour holds strong across the area (90 % at the left, 75 % at 60 %, 35 % at the score) under a gloss
 (light top half, a dark edge at the foot); the letters sit in the area's middle (they were set against its right end) */
/* a long name is held inside its colour area: on the frame OKC's
 letters take about 0.62 of their area's width; UTAH here took 99 of the area's 108 px (0.92), edge to edge. Now the letters keep 11 px
 clear of each end, so no name is wider than 86 px (0.80 of the area): UTAH is squeezed to fit, three-letter names are unchanged */
.sb-nba-tnt-12 .nm { position: absolute; top: 12px; height: 34px; display: flex; align-items: center; justify-content: center; padding: 0 11px; box-sizing: border-box;
  font-size: 33px; line-height: 1; white-space: nowrap; box-shadow: inset 0 1px 0 rgba(255,255,255,.35); }
/* a thin light line between the first team's score box and the second team's colour area, in the ring's silver */
.sb-nba-tnt-12 .dv { position: absolute; left: 201px; top: 12px; width: 2px; height: 34px; background: linear-gradient(#e0e0e4, #9c9ca2); }
.sb-nba-tnt-12 .sc { position: absolute; top: 12px; width: 64px; height: 34px; display: flex; align-items: center; justify-content: center; background: linear-gradient(#ffffff, #d8d8dc);
  color: #0a0a0c; font-size: 34px; line-height: 1; }
/* a record keeps the score box's width (it ran 6 px wider, over the dividing line): a long one (10-14-1) is squeezed to it */
.sb-nba-tnt-12 .sc.rec { font-size: 19px; font-weight: 700; white-space: nowrap; padding: 0 3px; box-sizing: border-box; }
.sb-nba-tnt-12 .ln { position: absolute; top: 50px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 29px; line-height: 1; white-space: nowrap; }
.sb-nba-tnt-12 .ln.st { font-size: 24px; letter-spacing: 1px; }
/* the network's mark in a silver ring (border-radius 50%) at the round end */
.sb-nba-tnt-12 .ring { position: absolute; left: ${CX - RR}px; top: ${CY - RR}px; width: ${2 * RR}px; height: ${2 * RR}px; box-sizing: border-box; border-radius: 50%;
  border: 4px solid #c4c4c8; background: radial-gradient(circle at 45% 35%, #222224, #050505 70%); display: grid; place-items: center; color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live', mk = marks(opts);
    root.appendChild(el('div', 'bar'));
    const recs = pre && g.away.record && g.home.record;
    // two look-alike teams: one takes its other colour (kit teamPair)
    const cols = teamPair(g.away, g.home, '#3a3f47');
    [[g.away, 23, 135], [g.home, 205, 329]].forEach(([t, nx, sx], i) => {
      const c = cols[i];
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      nm.style.left = nx + 'px'; nm.style.width = (sx - nx - 4) + 'px';
      // the team's colour strongest at the left, fading into the black bar towards the score
      nm.style.background = 'linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,.08) 48%, rgba(0,0,0,0) 54%, rgba(0,0,0,.22)), linear-gradient(90deg, ' + alpha(c, 0.9) + ', ' + alpha(c, 0.75) + ' 60%, ' + alpha(c, 0.35) + ')';
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      // a long record (10-14-1) is squeezed to its box
      if (recs) fit(sc); else scoreSlot(sc, g);
      sc.style.left = sx + 'px';
      root.append(nm, sc);
    });
    if (live) {
      const p = g.period, q = el('div', 'ln', p.word ? p.label : (p.label + (p.suffix || '')).toUpperCase());
      q.style.left = '49px'; q.style.width = '80px';
      const ck = el('div', 'ln', g.clock || '');
      ck.style.left = '165px'; ck.style.width = '100px';
      root.append(q, ck);
    } else {
      const st = fit(el('div', 'ln st', statusText(g, time)));
      st.style.left = '19px'; st.style.width = '380px';
      root.appendChild(st);
    }
    root.appendChild(el('div', 'dv'));
    const ring = el('div', 'ring');
    if (mk.ha) ring.appendChild(haMark(40));
    root.appendChild(ring);
  },
};
