// "Twin panels '20": after the 2020 spring league's bug on FOX and FS1 (frames: Los Angeles at Houston, 2nd 14:35, 4TH & 4, play clock
// :19; the same game at 2nd 1:03 with the line and the total under the codes). Two square-cut team panels side by side, each in its
// team's colour, lit at the top and darker to the foot, inside a thick rim in a light tint of that colour (grey round a black team,
// bright red round a red one); the logo at the outer end, the code in wide capitals, the big slanted score at the inner end with a white
// dot after it for the team with the ball; three white timeout bars in a column at each outer end: on a dark plate outside the away
// panel, inside the home panel's rim (as on air). Under them a near-black row: the quarter and the clock on the left, the
// down and distance on the right. The forerunner of the league's 2024-26 look (Mesh panels '24): same plan, flat panels, no lean.
// Measured on the 1080p frame (stage px = 2x frame px): panels 64 tall inside the rim, 288 + a 25 px timeout strip each side, 6 apart;
// the row 47 tall, 4 below the panels; Houston's red runs #ca0b34 at the top to #85011a near the foot over a #d40233 bottom line (3 px);
// the row #272e26 at the top to #0c180c at the foot (column reading; sample.py's box reads L 8 -> 7 on the frame, a darker row moved the registration and lost 8 points, so it stays). Letters (checked with compare.py): codes cap 22, scores 42 (italic), row 26.
// The play clock (yellow, in a darker box) is left out: the sensor has no play clock. So is the small red tab under the panel of the team
// with the ball (seen once, not sure it is the possession).
import { el, logo, statusText, teamColor, relight, fit, scoreSlot, FONTS } from '../kit.js';

// the whole body leans
// as one ("/"), measured on the 1080p still (Houston's panel's right end runs 12 px over its 64 px height: 10.6 deg; the row's ends the
// same), the letters and logos upright inside it; each panel takes a glass cover over its colour (sample.py --grid on Houston's panel:
// lit +5 L at the top falling to -4 at the foot on the soft still; drawn as glass: a light top line, lit to a horizon 45 % down, a
// deeper foot), the row a faint lit top line.
// loop pass, proportions re-measured on the 1080p still by columns: each panel is 76 tall OUTSIDE its rim (the 64
// first measured was the inside), the rim 6 (5 before), the row 46 (45.5), 4 apart; the row runs from the away strip's left line to
// Houston's right line (it stopped 5 px short); the logo box fills the inside height (64) as on air.
const S = 2, STRIP = 25 * S, PANEL = 288 * S, GAP = 6 * S, TOP = 76 * S, VGAP = 4 * S, ROW = 46 * S, LEAN = 10, RIM = 6 * S;
const PRE_CUT = 66 * S;   // before the game there is no score: each panel closes up by the score's room
const IN = 2 * (STRIP + PANEL) + GAP, H = TOP + VGAP + ROW, OVER = Math.ceil((H / 2) * Math.tan((LEAN * Math.PI) / 180)) + 2;
const W = IN + 2 * OVER;
const GLASS = (a) => 'linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,0) 3px), linear-gradient(rgba(255,255,255,' + a + '), rgba(255,255,255,' + a / 2 + ') 43%, rgba(255,255,255,0) 47%, rgba(0,0,0,.1))';

// a colour's lightness, L* 0-100
function lightness(hex) {
  const v = (hex || '#000000').replace('#', '').match(/../g).map((x) => { const c = parseInt(x, 16) / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  const y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (24389 / 27) * y;
}

export default {
  id: 'xfl-fox-20',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - 2 * PRE_CUT : W, h: H }),
  fonts: [FONTS.saira, FONTS.sairaItalic],
  css: `
.sb-xfl-fox-20 { font-family: 'SB Saira', 'Arial Black', sans-serif; color: #eceeea; }
.sb-xfl-fox-20 .lean { position: absolute; left: ${OVER}px; right: ${OVER}px; top: 0; height: ${H}px; transform: skewX(-${LEAN}deg); }
.sb-xfl-fox-20 .pn > *:not(.strip), .sb-xfl-fox-20 .strip i { transform: skewX(${LEAN}deg); }
.sb-xfl-fox-20 .blk { position: absolute; top: 0; height: ${TOP}px; display: flex; }
.sb-xfl-fox-20 .blk.h { flex-direction: row-reverse; }
/* the timeout strip: a darker band at the outer end holding three white bars in a column */
.sb-xfl-fox-20 .strip { width: ${STRIP}px; flex: none; background: rgba(16,17,16,.9); box-shadow: 0 3px 8px rgba(0,0,0,.4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${3 * S}px; }
.sb-xfl-fox-20 .strip i { width: ${5 * S}px; height: ${14 * S}px; background: #f1f1ee; }
.sb-xfl-fox-20 .strip i.used { opacity: .14; }
/* the rim: 5 px, a light tint of the team's colour (measured: #7b7b73 round Los Angeles's black, a bright red round Houston's) */
.sb-xfl-fox-20 .pn { position: relative; flex: 1; min-width: 0; overflow: hidden; box-shadow: inset 0 0 0 ${RIM}px var(--rim), 0 3px 8px rgba(0,0,0,.45); }
.sb-xfl-fox-20 .pn > .strip { top: 0; bottom: 0; right: ${RIM}px; background: none; box-shadow: none; }
.sb-xfl-fox-20 .pn > * { position: absolute; }
/* loop pass 2: the logo box is wider (86 px of the frame, was 66) and runs the whole inside height
 plus 2 px under the rim each side; the logo sits against its OUTER edge (object-position), not centred in the box */
.sb-xfl-fox-20 .lg { top: ${RIM - 2 * S}px; width: ${86 * S}px; height: ${TOP - 2 * RIM + 4 * S}px; display: grid; place-items: center; }
.sb-xfl-fox-20 .lg .sb-logo { width: ${86 * S}px; height: ${TOP - 2 * RIM + 4 * S}px; object-fit: contain; object-position: left center; }
.sb-xfl-fox-20 .h .lg .sb-logo { object-position: right center; }
.sb-xfl-fox-20 .ab { top: 0; height: ${TOP}px; width: ${80 * S}px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: ${32 * S}px; font-weight: 700; font-stretch: 100%; line-height: 1; white-space: nowrap; overflow: hidden; }
/* before the game the record sits small under the code (the frame's small line under the code holds the total or the spread) */
.sb-xfl-fox-20 .ab small { font-size: .55em; font-weight: 500; margin-top: ${2 * S}px; opacity: .9; }
.sb-xfl-fox-20 .sc { top: 0; height: ${TOP}px; display: grid; place-items: center end; font-family: 'SB Saira Italic', 'SB Saira', sans-serif; font-style: italic; font-weight: 800; font-size: ${60 * S}px; line-height: 1; min-width: 0 !important; color: #f4f4f0; }
.sb-xfl-fox-20 .h .sc { justify-items: start; }
.sb-xfl-fox-20 .dot { top: ${TOP / 2 - 4 * S}px; width: ${8 * S}px; height: ${8 * S}px; border-radius: 50%; background: #f4f4f0; }
/* the row: near black, faintly green, darker towards the foot */
.sb-xfl-fox-20 .row { position: absolute; top: ${TOP + VGAP}px; left: 0; right: 0; height: ${ROW}px; background: linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,0) 2px), linear-gradient(#272e26, #1c261e 35%, #141e15 70%, #0c180c);
  box-shadow: 0 3px 8px rgba(0,0,0,.4); font-family: 'SB Saira Italic', 'SB Saira', sans-serif; font-style: italic; font-weight: 700; font-size: ${36 * S}px; color: #e2e4e0; line-height: 1; }
.sb-xfl-fox-20 .row > * { position: absolute; top: 0; height: ${ROW}px; display: flex; align-items: center; justify-content: center; transform: translateX(-50%) skewX(${LEAN}deg); white-space: nowrap; }
.sb-xfl-fox-20 .row .q { color: #c9d0d2; }
.sb-xfl-fox-20 .row small { font-size: .8em; }
.sb-xfl-fox-20 .row .w { left: 50%; font-size: ${26 * S}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const P = PANEL - (pre ? PRE_CUT : 0);
    const lean = el('div', 'lean');
    [[g.away, 'a', 0], [g.home, 'h', STRIP + P + GAP]].forEach(([t, k, x]) => {
      const c = teamColor(t, '#3a3f47');
      const blk = el('div', 'blk ' + k); blk.style.left = x + 'px'; blk.style.width = STRIP + P + 'px';
      const strip = el('div', 'strip');
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) strip.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      const pn = el('div', 'pn');
      // lit at the top, darker to the foot (Houston: #ca0b34 -> #85011a); the rim lifted to about L 52 (Los Angeles's black reads charcoal, L 12, so a dark team keeps the round-6 light: the deepening grows with the colour's lightness)
      const L = lightness(c);
      pn.style.background = GLASS(Math.round((0.16 - 0.00125 * L) * 1000) / 1000) + ', linear-gradient(' + relight(c, 2 - 0.2 * L) + ', ' + relight(c, -9 - 0.15 * L) + ' 45%, ' + relight(c, -14 - 0.17 * L) + ')';
      pn.style.setProperty('--rim', relight(c, Math.max(2, 52 - L)));
      const out = k === 'a' ? 'left' : 'right', inn = k === 'a' ? 'right' : 'left';
      const lg = el('div', 'lg'); lg.style[out] = (k === 'a' ? RIM - 2 * S : STRIP - 2 * S) + 'px'; lg.appendChild(logo(t, 80 * S)); pn.appendChild(lg);
      const ab = el('div', 'ab'); ab.style[out] = (k === 'a' ? 92 * S : 92 * S + STRIP - 4 * S) + 'px'; ab.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase()))); if (pre && t.record) ab.appendChild(el('small', '', t.record)); pn.appendChild(ab);
      if (!pre) {
        const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
        // three figures on either side: both scores smaller, so they clear the code
        if (Math.max(g.away.score || 0, g.home.score || 0) >= 100) sc.style.fontSize = 48 * S + 'px'; sc.style[inn] = 26 * S + 'px'; pn.appendChild(sc);
        if (live && t.hasBall) { const d = el('i', 'dot'); d.style[inn] = 76 * S + 'px'; pn.appendChild(d); }
      }
      if (k === 'a') blk.append(strip, pn); else { pn.appendChild(strip); blk.appendChild(pn); }
      lean.appendChild(blk);
    });
    const row = el('div', 'row');
    if (live) {
      // measured places along the row (centres): quarter 10 %, clock 29 %, down 77 %; with no down, quarter 40 % and clock 58 %
      const dn = g.football && g.football.short ? g.football.short : '';
      const at = (n, x) => { n.style.left = x + '%'; row.appendChild(n); };
      const q = el('div', 'q'); q.append(document.createTextNode(g.period.label || ''), el('small', '', g.period.word ? '' : g.period.suffix || ''));
      at(q, dn ? 10 : 40); at(el('div', '', g.clock || ''), dn ? 29 : 58);
      if (dn) { const d = el('div', ''); const m = /^(\d)(ST|ND|RD|TH)(.*)$/.exec(dn); if (m) { const r = el('span', '', m[3]); r.style.whiteSpace = 'pre'; d.append(m[1], el('small', '', m[2]), r); } else d.textContent = dn; at(d, 77); }
    } else row.appendChild(el('div', 'w', statusText(g, time)));
    lean.appendChild(row);
    root.appendChild(lean);
  },
};
