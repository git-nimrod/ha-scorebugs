// "Barrels '07": after ESPN's Sunday/Monday night NFL bug (2006-07). Glossy black barrels lying on their side: each team's barrel holds its letters over its score on a darker inset,
// its outer end capped in its colour; between them a taller black block with the network's mark on a tab at the top (here the Home
// Assistant logo), the clock and the quarter on a small inset. During play the down and distance sits in a further black barrel centred
// under the bug.
import { el, statusText, haMark, marks, scoreSlot, vividColor, shade, fit, FONTS } from '../kit.js';

// the barrels as tall for their length as on air and the middle block nearly square (frame: barrels 235 tall on a 970 bug, the middle
// 305 x 295, end caps 65 wide)
// Curves measured on the frame (barrels 110 px tall): the top and bottom edges are straight (the barrels' dark runs rows 45-155
// at every column). Each coloured end cap is a slice of a circle, not a half ellipse: radius 47 px (0.43 of the barrel's height, fit within
// 0.6 px), standing 30 px out from the barrel (0.27 of its height), so its base covers 0.8 of the barrel's height and the barrel's own
// corners round off above and below it (radius about 0.14 of its height). The middle block 1.19 times the barrels' height, corners round
// over 0.06 of its height.
// Checked: the middle was 1.14 times as wide as tall (on air 1.03) and the barrels 1.21 times as long as tall (on air 1.14),
// so the bug was 6 % too long: middle 262, barrels 235.
const H = 262, BT = 28, BH = 206, CAP = 56, BAR = 235, MID = 262, DOWN = 400, DH = 72, DGAP = 8;
const W = 2 * (CAP + BAR) + MID;
const CR = Math.round(0.43 * BH), CB = Math.sqrt(CR * CR - (CR - CAP) ** 2);   // the cap's circle (89 px) and half its base (82 px)
// "the round edges with the team colors on the extremeties go underneath the broader bug": each cap runs OV px in under
// its barrel (the barrel is drawn over it), so the colour shows only as the round end behind the bar
const OV = 30;
const CAPCUT = (k) => k === 'a'
  ? "path('M " + CAP + ' ' + (BH / 2 - CB).toFixed(1) + ' A ' + CR + ' ' + CR + ' 0 0 0 ' + CAP + ' ' + (BH / 2 + CB).toFixed(1) + ' L ' + (CAP + OV) + ' ' + (BH / 2 + CB).toFixed(1) + ' L ' + (CAP + OV) + ' ' + (BH / 2 - CB).toFixed(1) + " Z')"
  : "path('M " + OV + ' ' + (BH / 2 - CB).toFixed(1) + ' A ' + CR + ' ' + CR + ' 0 0 1 ' + OV + ' ' + (BH / 2 + CB).toFixed(1) + ' L 0 ' + (BH / 2 + CB).toFixed(1) + ' L 0 ' + (BH / 2 - CB).toFixed(1) + " Z')";
// glass: a pale sheen over each section's top half with a soft edge just above the middle, on
// the barrel's own light and dark bands (recipe in lessons/nfl.md). Gradients only.
const SHEEN = 'linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 44%, rgba(255,255,255,0) 50%)';
const BARREL = SHEEN + ', linear-gradient(#4a4d52, #1b1c1f 18%, #0a0a0b 50%, #000 62%, #1a1b1e 86%, #3d4045)';
// darker outlines round every section: on air each barrel, the middle
// block and the down barrel are edged in near black (frame: 2-4 of the 136 px bug, about #1a1a1a, before the lit band at the top), where
// ours had faint light lines; 4 px here (the bug is 1.9x the frame), and the faint light inset lines on the middle and down barrel go dark
const EDGE = '0 0 0 4px #070707';
// the chrome ring at each barrel's cap end (frame, middle row: from the cap a near-black band 11 px, then a lit grey ring 15 px peaking
// #7c817a (its green the grass behind: drawn neutral grey), then the barrel; 0.08 and 0.11 of the bug's height): 20 px dark and 26 px ring here, so the cap reads as a separate 3D piece
const RING = (deg) => 'linear-gradient(' + deg + 'deg, #0a0a0a 0, #0a0a0a 20px, #2a2b2c 24px, #5e6162 30px, #7d8081 36px, #5a5c5d 42px, #242526 46px, rgba(0,0,0,0) 47px)';

export default {
  id: 'nfl-espn-07',
  size: { w: W, h: H + DGAP + DH },
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H + DGAP + DH : H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-espn-07 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 92%; color: #fff; }
.sb-nfl-espn-07 .row { position: absolute; left: 0; top: 0; height: ${H}px; display: flex; align-items: center; filter: drop-shadow(0 5px 6px rgba(0,0,0,.55)); }
.sb-nfl-espn-07 .cap { width: ${CAP + OV}px; height: ${BH}px; flex: none; position: relative; z-index: 0; } .sb-nfl-espn-07 .cap.a { margin-right: -${OV}px; } .sb-nfl-espn-07 .cap.h { margin-left: -${OV}px; } .sb-nfl-espn-07 .bl, .sb-nfl-espn-07 .mid { position: relative; z-index: 1; }
.sb-nfl-espn-07 .cap.a { clip-path: ${CAPCUT('a')}; } .sb-nfl-espn-07 .cap.h { clip-path: ${CAPCUT('h')}; }
/* each barrel's cap end: the dark band and the chrome ring, and the letters and score inset kept clear of them */
.sb-nfl-espn-07 .bl.a { background: ${RING(90)}, ${BARREL}; padding-left: 52px; } .sb-nfl-espn-07 .bl.h { background: ${RING(270)}, ${BARREL}; padding-right: 52px; }
.sb-nfl-espn-07 .bl { width: ${BAR}px; height: ${BH}px; flex: none; display: grid; grid-template-rows: 74px 1fr; justify-items: center; padding: 12px 16px 18px; box-sizing: border-box; background: ${BARREL}; box-shadow: ${EDGE}; }
.sb-nfl-espn-07 .bl.a { border-radius: ${Math.round(0.14 * BH)}px 0 0 ${Math.round(0.14 * BH)}px; } .sb-nfl-espn-07 .bl.h { border-radius: 0 ${Math.round(0.14 * BH)}px ${Math.round(0.14 * BH)}px 0; }
.sb-nfl-espn-07 .nm { font-size: 64px; line-height: 74px; text-shadow: 0 2px 2px rgba(0,0,0,.7); white-space: nowrap; }
.sb-nfl-espn-07 .sc { width: 100%; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(#0b0b0c, #000); box-shadow: inset 0 0 0 2px rgba(255,255,255,.12), inset 0 3px 6px rgba(0,0,0,.8); font-size: 100px; line-height: 1; }
.sb-nfl-espn-07 .sc.rec { font-size: 44px; }
/* the middle block stands taller than the barrels */
.sb-nfl-espn-07 .mid { width: ${MID}px; height: ${H - 8}px; flex: none; display: grid; grid-template-rows: 62px 1fr 60px; justify-items: center; align-items: center; padding: 6px 0 12px; box-sizing: border-box; border-radius: 14px;
  background: ${BARREL}; box-shadow: ${EDGE}, inset 0 0 0 2px rgba(0,0,0,.6); }
.sb-nfl-espn-07 .mid .tab { padding: 2px 22px; border-radius: 6px; background: linear-gradient(#2a2b2e, #08080a); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.25); } .sb-nfl-espn-07 .mid .sb-ha { color: #fff; }
.sb-nfl-espn-07 .clk { font-size: 80px; line-height: 1; font-weight: 600; } .sb-nfl-espn-07 .clk.w { font-size: 36px; text-align: center; padding: 0 10px; }   /* a start time clear of the narrower middle's sides */
.sb-nfl-espn-07 .q { padding: 3px 18px; border-radius: 4px; background: #000; box-shadow: inset 0 0 0 2px rgba(255,255,255,.3); font-size: 42px; line-height: 1; }
/* the down barrel: a short black barrel centred under the bug, its ends rounded like the barrels' corners */
.sb-nfl-espn-07 .dn { position: absolute; left: ${(W - DOWN) / 2}px; top: ${H + DGAP}px; width: ${DOWN}px; height: ${DH}px; display: grid; place-items: center; background: ${BARREL}; border-radius: ${Math.round(0.43 * DH)}px; box-shadow: ${EDGE}, 0 4px 6px rgba(0,0,0,.5), inset 0 0 0 2px rgba(0,0,0,.6); font-size: 46px; line-height: 1; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const row = el('div', 'row');
    const barrel = (t, k) => {
      const v = vividColor(t, '#c8101a');
      const cap = el('i', 'cap ' + k);
      // the end cap in the team's colour, lit like a curved surface but deep, as on air (it was brighter than the colour itself)
      // and 3D: a dome, not a flat strip. On air the red cap is brightest
      // in a spot in its outer part (#8c5b55 at 0.7 of the way out, #672c20 at its rim, near black at the barrel), the blue one in its
      // middle: a radial light at 40 % across from the outer edge and 38 % down, deep at the rim and black where it meets the barrel
      cap.style.background = 'linear-gradient(180deg, rgba(255,255,255,.34) 0, rgba(255,255,255,.12) 44%, rgba(255,255,255,0) 50%), radial-gradient(ellipse 95% 62% at ' + (k === 'a' ? '40%' : '60%') + ' 38%, ' + shade(v, -0.12) + ', ' + shade(v, -0.38) + ' 45%, ' + shade(v, -0.62) + ' 78%, ' + shade(v, -0.82) + ')';
      const bl = el('div', 'bl ' + k);
      bl.append(fit(el('span', 'nm', (t.abbr || '').toUpperCase())), g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      return k === 'a' ? [cap, bl] : [bl, cap];
    };
    const mid = el('div', 'mid');
    const tab = el('span', 'tab'); if (marks(opts).ha) tab.appendChild(haMark(44)); mid.appendChild(tab);
    if (live) {
      mid.appendChild(el('span', 'clk', g.clock || ''));
      mid.appendChild(el('span', 'q', (g.period.label || '') + (g.period.suffix || '').toUpperCase()));
    } else { mid.appendChild(el('span', 'clk w', statusText(g, time))); mid.appendChild(el('span', '')); }
    const away = barrel(g.away, 'a'), home = barrel(g.home, 'h');
    row.append(...away, mid, ...home);
    root.appendChild(row);
    if (live && g.football && g.football.short) root.appendChild(el('div', 'dn', g.football.short));
  },
};
