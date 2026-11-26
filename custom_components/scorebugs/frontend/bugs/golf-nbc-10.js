// "Chrome board '10": after the national open's leaderboard on its US network, 2008-2011 (frame: the 2010 final round at Pebble Beach;
// retro catalogue golf-nbc-10-2). A full leaderboard on the left of the picture: a chrome title bar with the championship's name in
// white capitals and a glossy yellow strip under it with the round in black; then a row per player on a see-through grey board, each a
// dark chrome bar with the first name in a light weight and the surname bold, an orange box with the score to par and a black box with
// the holes played.
// Measured on the 720p still: title 545 x 47 px, chrome #939293, L 85 at the top to 61 at a horizon 40 %
// down and 47 at the foot; yellow strip #f8dc20, 25 px, darker top line (-8 L); rows 47 px on a 60 px pitch, chrome #333333, L 49 at
// the top, 20 under a horizon 35 % down, 9 at the foot; orange boxes #d98e0b lit from below (62 L top to 80 L foot), 80 x 47 px; black
// boxes #090909 with a lit top (+26 L) and a 2 px grey rim; the board behind the rows #646465 at about 70 %, its top edge chrome.
// : every row starts with a flag tile 71 x 47
// px touching the bar (a white strip 15 px wide with the country's letters stacked upright, then the flag, its top right corner cut at 45 deg, 12 px),
// overhanging the board's left edge by 21 px; the title plate's top right corner is cut at 45 deg (20 px) and the board's top right
// corner at 45 deg (24 px), its top left rounded 10 px. On air the championship's logo stands on a white plate at the
// title's left end: not drawn (a tournament mark), so the title plate runs on to the left edge.
import { el, fit, setSrc, FONTS } from '../kit.js';

// left of the rows' own origin: the flag tiles (79 units) plus a margin. The championship's logo plate is never drawn (house rule:
// tournament and event marks are left out): the title plate runs on to the left edge.
const X0 = 80;
const ccOf = (p) => { const m = /\/countries\/\d+\/(\w+)\.png/i.exec(String(p.flag || '')); return (m ? m[1] : String(p.country || '').slice(0, 3)).toUpperCase(); };
const S = 1.5, W = Math.round(600 * S), TITLE = Math.round(47 * S), YEL = Math.round(25 * S), TOP = Math.round(90 * S), ROW = Math.round(60 * S), RH = Math.round(47 * S), ROWS = 8;
const hFor = (n) => TOP + Math.round(32 * S) + n * ROW - (ROW - RH) + 12;
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const holesOf = (p) => (p.thru === 'F' || Number(p.thru) >= 18 ? 'F' : p.thru ? String(p.thru) : '');

export default {
  id: 'golf-nbc-10',
  size: { w: W + Math.round(X0 * S), h: hFor(ROWS) },
  sizeFor: (g) => ({ w: W + Math.round(X0 * S), h: hFor(Math.max(1, Math.min(ROWS, (g.rows || []).length + (g.player && !(g.rows || []).some((p) => p.id === g.player.id) && (g.rows || []).length < ROWS ? 1 : 0)))) }),
  fonts: [FONTS.archivo],
  css: `
.sb-golf-nbc-10 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* chrome: light top, a horizon about 40 % down, darker foot */
.sb-golf-nbc-10 .tt { position: absolute; left: 0; width: ${Math.round(545 * S)}px; top: ${Math.round(5 * S)}px; height: ${TITLE}px; display: grid; align-items: center; padding: 0 ${Math.round(16 * S)}px; box-sizing: border-box;
  background: linear-gradient(#e0dfe0, #c4c3c4 12%, #9d9c9d 38%, #6f6e6f 42%, #5d5c5d 80%, #747374); border-radius: 0 ${Math.round(10 * S)}px 0 0; box-shadow: inset 0 0 0 ${S}px rgba(0,0,0,.6), inset 0 ${2 * S}px 0 rgba(255,255,255,.6);
  font-size: ${Math.round(31 * S)}px; letter-spacing: ${0.5 * S}px; white-space: nowrap; text-shadow: 0 ${S}px ${2 * S}px rgba(0,0,0,.75); }
.sb-golf-nbc-10 .yl { position: absolute; left: 0; width: ${Math.round(545 * S)}px; top: ${Math.round(53 * S)}px; height: ${YEL}px; display: grid; place-items: center end; padding-right: ${Math.round(10 * S)}px; box-sizing: border-box;
  background: linear-gradient(#c9a90f, #f8dc20 18%, #fbe94e 40%, #f8dc20 70%, #e9c812); border-radius: 0 0 ${Math.round(10 * S)}px 0; box-shadow: inset 0 -${S}px 0 rgba(0,0,0,.35);
  color: #111; font-size: ${Math.round(17 * S)}px; letter-spacing: ${0.5 * S}px; }
.sb-golf-nbc-10 .bd { position: absolute; left: 0; width: ${Math.round(578 * S)}px; top: ${TOP}px; bottom: 0; background: linear-gradient(#8b8b8c, #646465 ${Math.round(6 * S)}px) ; opacity: .78; border-radius: 0 ${Math.round(12 * S)}px ${Math.round(12 * S)}px 0;
  box-shadow: inset 0 ${2 * S}px 0 rgba(255,255,255,.4); }
.sb-golf-nbc-10 .rw { position: absolute; left: 0; height: ${RH}px; width: ${Math.round(595 * S)}px; }
/* loop pass 4 (the end bars are the ends of the full-width bar, not on top of it; THRU boxy): on air ONE dark bar runs from the flag to the tab outside the board, a hair shorter than the boxes (the boxes stand 2 px over its top and
 foot) and edged by a thin silver line all round; the tab is just its last 18 px, seen between the holes box and the end. The holes box is square. */
.sb-golf-nbc-10 .rw .bar { position: absolute; left: 0; top: ${Math.round(2 * S)}px; bottom: ${Math.round(2 * S)}px; width: ${Math.round(595 * S)}px; display: grid; align-items: center; padding-left: ${Math.round(4 * S)}px; padding-right: ${Math.round(203 * S)}px; box-sizing: border-box;
  background: linear-gradient(#7b7b7b, #4a4a4a 12%, #2e2e2e 33%, #1d1d1d 37%, #121212 75%, #0a0a0a); border-radius: 0 ${Math.round(1.5 * S)}px ${Math.round(1.5 * S)}px 0; box-shadow: inset 0 0 0 1px #9a9a9a;
  font-size: ${Math.round(28 * S)}px; letter-spacing: ${0.5 * S}px; white-space: nowrap; overflow: hidden; }
.sb-golf-nbc-10 .rw .bar i { font-style: normal; font-weight: 500; color: #e4e4e4; margin-right: ${Math.round(7 * S)}px; }
.sb-golf-nbc-10 .rw .sc { position: absolute; left: ${Math.round(400 * S)}px; width: ${Math.round(80 * S)}px; top: 0; bottom: 0; display: grid; place-items: center; color: #111;
  background: linear-gradient(#c97f08, #d98e0b 30%, #e7a428 70%, #f3c35a); border-radius: ${Math.round(3 * S)}px; box-shadow: inset 0 0 0 ${S}px rgba(90,50,0,.6), inset 0 ${S}px 0 rgba(255,255,255,.35); font-size: ${Math.round(30 * S)}px; }
.sb-golf-nbc-10 .rw .th { position: absolute; left: ${Math.round(497 * S)}px; width: ${Math.round(78 * S)}px; top: 0; bottom: 0; display: grid; place-items: center;
  border: ${2 * S}px solid transparent; box-sizing: border-box; background: linear-gradient(#4a4a4a, #1a1a1a 22%, #090909 30%, #050505) padding-box, linear-gradient(#b9b9b9, #8e8e8e 40%, #666) border-box; border-radius: 0; font-size: ${Math.round(30 * S)}px; }
/* the rows' frame of reference, moved right of the logo plate and the flag tiles */
.sb-golf-nbc-10 .in { position: absolute; top: 0; bottom: 0; width: ${W}px; }
/* the title plate's top right corner cut at 45 deg; with no logo plate it runs on over the flag column */
.sb-golf-nbc-10 .tt { border-radius: 0; clip-path: polygon(0 0, calc(100% - ${Math.round(20 * S)}px) 0, 100% ${Math.round(20 * S)}px, 100% 100%, 0 100%); }
.sb-golf-nbc-10 .nolg .tt, .sb-golf-nbc-10 .nolg .yl { left: -${Math.round(79 * S)}px; width: ${Math.round((545 + 79) * S)}px; }
.sb-golf-nbc-10 .nolg .tt { padding-left: ${Math.round(14 * S)}px; }
/* the board: top left rounded, top right cut at 45 deg, from under the flag tiles */
.sb-golf-nbc-10 .bd { left: -${Math.round(58 * S)}px; width: ${Math.round((578 + 58) * S)}px; border-radius: ${Math.round(10 * S)}px 0 ${Math.round(12 * S)}px 0;
  clip-path: polygon(0 0, calc(100% - ${Math.round(24 * S)}px) 0, 100% ${Math.round(24 * S)}px, 100% 100%, 0 100%); }
/* a flag tile per row: the country's letters stacked upright on a white strip, then the flag; its top right corner cut at 45 deg */
.sb-golf-nbc-10 .rw .fl { position: absolute; left: -${Math.round(73 * S)}px; width: ${Math.round(71 * S)}px; top: 0; bottom: 0; display: grid; grid-template-columns: ${Math.round(15 * S)}px 1fr; background: #f4f4f4;
  clip-path: polygon(0 0, calc(100% - ${Math.round(12 * S)}px) 0, 100% ${Math.round(12 * S)}px, 100% 100%, 0 100%); box-shadow: inset 0 0 0 ${S}px #2a2a2a; }
.sb-golf-nbc-10 .rw .fl b { writing-mode: vertical-rl; text-orientation: upright; font-size: ${Math.round(9 * S)}px; font-weight: 700; color: #333; letter-spacing: -${S}px; display: grid; place-items: center; line-height: 1; }
.sb-golf-nbc-10 .rw .fl img { width: 100%; height: 100%; object-fit: cover; box-shadow: inset 0 0 0 ${S}px #2a2a2a; }
.sb-golf-nbc-10 .rw.me .bar { background: linear-gradient(#8a8f9a, #565c68 12%, #383e4a 33%, #252a34 37%, #181c24 75%, #0e1118); }
`,
  draw(root0, g) {
    const root = el('div', 'in nolg'); root.style.left = Math.round(X0 * S) + 'px'; root0.appendChild(root);
    root.appendChild(el('div', 'bd'));
    root.appendChild(fit(el('div', 'tt', String(g.event || '').toUpperCase().replace(/\s+PRESENTED BY .*$/, ''))));
    const rd = g.roundNo || 1;
    root.appendChild(el('div', 'yl', g.status === 'final' && rd >= 4 ? 'FINAL ROUND' : g.status === 'final' ? 'ROUND ' + rd + ' COMPLETE' : rd >= 4 ? 'FINAL ROUND' : 'ROUND ' + rd));
    const rows = (g.rows || []).slice(0, ROWS);
    if (g.player && !rows.some((p) => p.id === g.player.id)) rows[Math.min(ROWS, rows.length + 1) - 1] = g.player;
    rows.forEach((p, i) => {
      const rw = el('div', 'rw' + (g.player && g.player.id === p.id ? ' me' : '')); rw.style.top = (TOP + Math.round(32 * S) + i * ROW) + 'px';
      // "Davis Love III": first name DAVIS, surname LOVE III
      const parts = String(p.name || p.short || '').trim().split(/\s+/);
      const k = parts.length > 2 && SUF.test(parts[parts.length - 1]) ? 2 : 1;
      const last = parts.slice(-k).join(' ').toUpperCase();
      const first = parts.length > k ? parts.slice(0, -k).join(' ').toUpperCase() : '';
      const bar = el('span', 'bar');
      const nm = el('span', '');
      if (first) nm.appendChild(el('i', '', first));
      nm.appendChild(document.createTextNode(last));
      bar.appendChild(fit(nm, last));
      const fl = el('span', 'fl'); fl.appendChild(el('b', '', ccOf(p)));
      // no flag address: the tile keeps its letters on white, with no empty picture
      if (p.flag) { const fi = el('img'); fi.alt = ''; setSrc(fi, p.flag); fl.appendChild(fi); }
      rw.append(fl, bar, el('span', 'sc', p.score || ''), el('span', 'th', g.status === 'pre' ? '' : holesOf(p)));
      root.appendChild(rw);
    });
  },
};
