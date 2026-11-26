// "Team bar '14": after the NBA score bar on TNT, 2014-22 (frame: Mavericks at Spurs, 2nd quarter, from a sheet of TNT's NBA bugs by
// era; rough: the bar is 131 x 22 px on the sheet, so finish readings are guides). The square-ended successor of Fade bar '12: a flat
// black bar, on the top line each team's letters on a solid panel of its colour, then its score black
// on a white box; on the second line the quarter on a dark grey cell under the first team and the clock; near the right end a silver
// ring round the network's mark (here the Home Assistant logo, white). The shot clock (red cell under the second team) is left out:
// no data. The sheet notes the network's and the league's logos changed in 2016-17; only the league logo is drawn (the current one).
// measured (131 px frame, x4): bar rows 1..21 of 22 (4..84 here), square left end; the right end round about the ring; the ring fitted as a circle
// (ring.py, circle_fit): centre 0.90 across, 0.54 down, r 8.6 px = 0.43 of the bar's height (34 here); team panels 26 and 30 px wide
// (104, 120 here), score boxes 17 px (68 here); caps 5.6 px on the top line (22 here), 5 px on the second (20 here).
import { el, statusText, haMark, marks, fit, scoreSlot, teamPair, panelInk, contrast, shade, FONTS } from '../kit.js';

const W = 480, H = 88, CX = 425, CY = 44, RR = 34, BT = 4, BH = 80;

export default {
  id: 'nba-tnt-14',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-14 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; color: #f4f4f6; }
/* the bar's right end rounds round the ring: a half circle of half the bar's height about the ring's centre, the
 ring centred top to bottom in the bar (it sat 3 px low) */
.sb-nba-tnt-14 .bar { position: absolute; left: 1px; top: ${BT}px; width: ${CX + BH / 2 - 1}px; height: ${BH}px; border-radius: 2px ${BH / 2}px ${BH / 2}px 2px;
  background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.28)), linear-gradient(#1a1a1c, #0a0a0b 50%, #050505); box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6), 0 2px 4px rgba(0,0,0,.4); }
/*: the player alone would mean drawing the
 league's own artwork by hand or recolouring ESPN's file with a filter, and the house rules allow neither, so the league's logo is gone
 and the bar closes up instead: everything moved 44 px left (the bug is 480 wide, was 524), the first team's panel 7 px in from the
 bar's left end as it is 6 px below its top */
.sb-nba-tnt-14 .nm { position: absolute; top: 10px; height: 36px; display: flex; align-items: center; justify-content: center; padding: 0 6px; box-sizing: border-box;
  font-size: 33px; line-height: 1; white-space: nowrap; }
.sb-nba-tnt-14 .sc { position: absolute; top: 10px; width: 68px; height: 36px; display: flex; align-items: center; justify-content: center; box-sizing: border-box; background: linear-gradient(180deg, rgba(255,255,255,.5) 0, rgba(255,255,255,.2) 45%, rgba(255,255,255,0) 51%), linear-gradient(#ffffff, #d8d8dc); box-shadow: inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(0,0,0,.25);
  color: #0a0a0c; font-size: 34px; line-height: 1; }
/* a record keeps the score box's width (it ran 2 px wider, over the dividing line): a long one (10-14-1) is squeezed to it */
.sb-nba-tnt-14 .sc.rec { font-size: 19px; font-weight: 700; white-space: nowrap; padding: 0 3px; box-sizing: border-box; }
/*: a 4 px pure-black line fills the gap
 between the first score box and the second team's panel (the bar's dark grey showed there) */
.sb-nba-tnt-14 .dv { position: absolute; left: 184px; top: 10px; width: 4px; height: 36px; background: #000; }
/*: a 2 px silver line, the ring's colour, down both
 lines between the second score box (ends at 376) and the ring (starts at 391) */
/* the line now touches the score box: it stood 6 px
 off (382); now it starts where the box ends (376) */
/*: the line's top was near white (#e0e0e4), so beside the white
 score box it vanished into the box and the line seemed to start under it; now a mid silver from top to foot (L 66-60 against the
 box's 100-86), so it reads as a grey line the whole way down, still touching the box */
/*: the silver line that stood between the right score box and the ring is removed */
.sb-nba-tnt-14 .ln { position: absolute; top: 48px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 29px; line-height: 1; white-space: nowrap; }
.sb-nba-tnt-14 .ln.q { background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(#3a3b3f, #26272a); box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6); top: 48px; height: 32px; }
.sb-nba-tnt-14 .ln.st { font-size: 24px; letter-spacing: 1px; }
/* the network's mark in a silver ring (border-radius 50%) at the round end, the same centre */
.sb-nba-tnt-14 .ring { position: absolute; left: ${CX - RR}px; top: ${CY - RR}px; width: ${2 * RR}px; height: ${2 * RR}px; box-sizing: border-box; border-radius: 50%;
  border: 4px solid #c4c4c8; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), radial-gradient(circle at 45% 35%, #222224, #050505 70%); box-shadow: inset 0 1px 0 rgba(255,255,255,.3); display: grid; place-items: center; color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live', mk = marks(opts);
    root.appendChild(el('div', 'bar'));
    const recs = pre && g.away.record && g.home.record;
    // two look-alike teams: one takes its other colour (kit teamPair); a near-black team gets a dark grey panel so it shows on the
    // black bar, as on air (the Spurs' panel is grey on the frame)
    const cols = teamPair(g.away, g.home, '#3a3f47').map((c) => (contrast(c, '#000000') < 1.6 ? '#4a4e52' : c));
    [[g.away, 8, 116], [g.home, 188, 308]].forEach(([t, nx, sx], i) => {
      const c = cols[i];
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      nm.style.left = nx + 'px'; nm.style.width = (sx - nx) + 'px';
      // a solid panel of the team's colour, a little lighter at the top
      nm.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6)';
      nm.style.background = 'linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%), linear-gradient(' + shade(c, 0.1) + ', ' + c + ' 50%, ' + shade(c, -0.15) + ')';
      // dark letters on a light colour (GS gold)
      nm.style.color = panelInk(t, c);
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      // a long record (10-14-1) is squeezed to its box
      if (recs) fit(sc); else scoreSlot(sc, g);
      sc.style.left = sx + 'px';
      root.append(nm, sc);
    });
    if (live) {
      const p = g.period, q = el('div', 'ln q', p.word ? p.label : (p.label + (p.suffix || '')).toUpperCase());
      // the quarter's cell exactly under the first team's panel: same left and
      // width (108; it was 104, 4 px short of the panel's right side)
      q.style.left = '8px'; q.style.width = '108px';
      const ck = el('div', 'ln', g.clock || '');
      ck.style.left = '142px'; ck.style.width = '100px';
      root.append(q, ck);
    } else {
      const st = fit(el('div', 'ln st', statusText(g, time)));
      st.style.left = '4px'; st.style.width = '372px';
      root.appendChild(st);
    }
    root.append(el('div', 'dv'));
    const ring = el('div', 'ring');
    if (mk.ha) ring.appendChild(haMark(40));
    root.appendChild(ring);
  },
};
