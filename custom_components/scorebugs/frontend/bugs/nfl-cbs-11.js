// "Blue bar '11": after CBS's NFL bug (2011). One long dark-navy glass bar
// in rounded blocks: a bright blue bevelled cap at the left (the network's eye there; here the Home Assistant logo), the down and distance
// on a white pill, then each team on a blue block (its logo faint at the left, its letters at the right, a dot before the team with the
// ball) and its score in a dark box, and the quarter and clock in a dark box at the end. Each team's timeouts are yellow dashes above its
// block.
import { el, logo, statusText, haMark, marks, scoreSlot, fit, pips, teamPair, panelInk, shade, FONTS, GLOSS } from '../kit.js';

// the blue cap about as wide as the bar is tall and the quarter-and-clock box wider, as on air (frame: cap 6 %, clock box 27 % of the bar)
// Curves measured on the frame (frame bar 76 px tall, its blocks 58): no block is square-ended. The lines between blocks are
// arcs all bowing the same way, to the right (radius 55-62 px, about the block's height; they bow 7-8 px, 0.13 of the height, and meet the
// top and bottom at about 29 deg). The bar's two ends are rounder arcs (radius 52 px, 0.68 of the bar's height). So each block's right end
// is an arc bowing out and its left end the same arc bowing in, a thin even gap between them; the down and distance stays a pill.
const PIP = 16, BAR = 84, H = PIP + BAR, CAP = 96, DOWN = 352, TEAM = 268, SC = 98, CLK = 376, EH = BAR - 8;
const R = EH, B = R - Math.sqrt(R * R - (EH / 2) ** 2);          // the dividers' arc (radius = the block's height) and its bow (about 10 px)
const RB = Math.round(0.68 * BAR), BB = RB - Math.sqrt(RB * RB - (BAR / 2) ** 2);   // the bar's ends (57 px radius, bow 18.5)
const RC = RB - 4, BC = RC - Math.sqrt(RC * RC - (EH / 2) ** 2);  // the first block's left end and the last one's right end, inside the bar's end
const M = 6 - B;                                                  // a block's step in over the one before, leaving a 6 px gap
const W = Math.round(CAP + DOWN + 2 * (TEAM + SC) + CLK + 6 - BC + 5 * M + 8), NODOWN = Math.round(W - DOWN - 6 + BC);
// a block's outline: its right end bows out (the divider's arc, or the bar's end), its left end bows in (or out, at the bar's left end);
// right 'in': the right end bows in, on the bar end's arc, so the down
// pill's left end, which bows out on that same arc, sits in it with the same even gap
const outline = (w, left, right) => {
  const [rr, br] = right === 'end' ? [RC, BC] : right === 'in' ? [RC, 0] : [R, B];
  const [xl, rl, sw] = left === 'end' ? [BC, RC, 1] : [0, R, 0];
  return 'M ' + xl.toFixed(1) + ' 0 H ' + (w - br).toFixed(1) + ' A ' + rr + ' ' + rr + ' 0 0 ' + (right === 'in' ? 0 : 1) + ' ' + (w - br).toFixed(1) + ' ' + EH + ' H ' + xl.toFixed(1) + ' A ' + rl + ' ' + rl + ' 0 0 ' + sw + ' ' + xl.toFixed(1) + ' 0 Z';
};
const cut = (w, left, right) => "path('" + outline(w, left, right) + "')";
// the blue outline round every block, following its curved ends (on
// air each block has a thin light blue rim, about 2 px of its 58; the old inset rim ran straight and was cut off at the curved ends)
// no grey or light outlines any more: each block's edge
// fades, over about 6 px, into a darker shade of its own colour, following its curved ends
const rim = (w, left, right, c) => 'url("data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + EH + "'><g fill='none' stroke='" + c + "'><path d='" + outline(w, left, right) + "' stroke-width='12' stroke-opacity='.3'/><path d='" + outline(w, left, right) + "' stroke-width='7' stroke-opacity='.45'/><path d='" + outline(w, left, right) + "' stroke-width='3' stroke-opacity='.7'/></g></svg>") + '")';
const RIM = '#000';
// the scores and the quarter-and-clock are black, not navy: near black with only a faint lift low in the glass
// (was a grey-blue 30,38,48 low down)
const DARK = 'linear-gradient(#000000, #060708 40%, #141619 62%, #0e1012)';
// the quarter-and-clock box grows with its text: the clock sits further in from the bar's round end (54 px from the box's right edge, was 38) and a longer quarter and
// clock than football's '3RD 12:00' (hockey's 'OT 20:00', basketball's '2OT 12:00', a soccer clock with added time) widen the box and
// the bar by what they need, from the letters' widths in this face (figures 0.56 of the size, capitals 0.66, the colon 0.3)
const CLK_PAD_L = 22 + B, CLK_PAD_R = 38 + BC, CLK_GAP = 36;
const textW = (s, px) => [...String(s || '')].reduce((a, ch) => a + px * (/[0-9]/.test(ch) ? 0.56 : /[:.']/.test(ch) ? 0.3 : /\s/.test(ch) ? 0.26 : /[A-Z]/.test(ch) ? 0.66 : 0.5), 0);
const clkW = (g) => {
  if (g.status !== 'live') return CLK;
  const p = g.period || {};
  const need = textW(p.label, 54) + textW((p.suffix || '').toUpperCase(), 54 * 0.72) + textW(g.clock, 54) + CLK_GAP + CLK_PAD_L + CLK_PAD_R;
  return Math.max(CLK, Math.ceil(need));
};

export default {
  id: 'nfl-cbs-11',
  size: { w: W, h: H },
  // outside live play there is no down: its pill goes and the bar is shorter
  sizeFor: (g) => ({ w: (g.status === 'live' && g.football ? W : NODOWN) + clkW(g) - CLK, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-cbs-11 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 88%; color: #fff; }
.sb-nfl-cbs-11 .bar { position: absolute; left: 0; right: 0; top: ${PIP}px; height: ${BAR}px; display: flex; padding: 4px; box-sizing: border-box;
  /* the blue between the blocks kept, a clearer blue */
  /* the blue matched to the frame: a greyer steel blue, dark at the very top, a lit
 line just under it (about 65,110,147), a deeper middle (25,62,91), lit again low down (43,95,145) and dark at the foot (16,53,71);
 ours was a brighter, purer blue fading down to navy */
  background: linear-gradient(#1c3c5c, #41709a 10%, #2a587c 24%, #1a4a6c 55%, #2b5f8f 84%, #3a6a94 90%, #10364a); }
.sb-nfl-cbs-11 .bar > * { flex: none; height: 100%; display: flex; align-items: center; box-sizing: border-box; position: relative; overflow: hidden; margin-left: ${M}px; }
.sb-nfl-cbs-11 .bar > .cap { margin-left: 0; } .sb-nfl-cbs-11 .bar > .dn { margin-left: 6px; }
.sb-nfl-cbs-11 .cap { width: ${CAP}px; justify-content: center; padding-right: ${B}px; background: ${rim(CAP, 'end', 'arc', '#0a2c55')}, linear-gradient(#2e629e, #4a8fd0 40%, #4b97e5 50%, #0f5ca4 58%, #0c5090 75%, #2a63a6 88%, #46789f); }
.sb-nfl-cbs-11 .cap.in { background: ${rim(CAP, 'end', 'in', '#0a2c55')}, linear-gradient(#2e629e, #4a8fd0 40%, #4b97e5 50%, #0f5ca4 58%, #0c5090 75%, #2a63a6 88%, #46789f); }
.sb-nfl-cbs-11 .cap .sb-ha { color: #fff; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); }
/* the down and distance bigger: 60 px (was 50), capitals 0.55 of the pill's height as on air; squeezed to fit */
/* its left end bows out on the bar end's arc, as the cap's left end, and its right end on the dividers' arc, as between a team and its
 score; it was a round-ended pill, which left a wide gap at the top and foot of each end */
.sb-nfl-cbs-11 .dn { width: ${DOWN}px; justify-content: center; padding: 0 ${18 + B}px 0 ${18 + BC}px; margin-left: ${6 - BC}px !important; background: ${rim(DOWN, 'end', 'arc', '#7d8792')}, linear-gradient(#ffffff, #e4e7eb 50%, #c5cad1); color: #101318; font-size: 60px; line-height: 1; white-space: pre; }
.sb-nfl-cbs-11 .dn .o { font-size: .78em; }
/* each team's block in its own colour as glass, deeper than the raw colour (frame: the Jets' block 39,62,52, the Colts' a mid blue) */
.sb-nfl-cbs-11 .tm { width: ${TEAM}px; justify-content: flex-end; padding: 0 ${20 + B}px 0 20px; }
/* the team's logo, faint and large, at the block's left, turned away in depth (frame: the Jets' oval reads 70 x 45 px against its own
 1.9 : 1, so it is turned about 35 deg, its far side towards the letters), and tilted a little up, 9 deg */
.sb-nfl-cbs-11 .tm .sb-logo { position: absolute; left: ${6 + B}px; top: 50%; transform: translateY(-50%) perspective(220px) rotateY(35deg) rotate(-9deg); width: 92px; height: 80px; object-fit: contain; opacity: .35; filter: saturate(.6); }
.sb-nfl-cbs-11 .nm { position: relative; font-size: 54px; line-height: 1; white-space: nowrap; text-shadow: 0 2px 3px rgba(0,0,0,.55); }
.sb-nfl-cbs-11 .nm .ball { display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: #fff; margin-right: 10px; vertical-align: middle; }
.sb-nfl-cbs-11 .nm .sb-rec { font-size: .62em; margin-left: 12px; }
.sb-nfl-cbs-11 .sc { width: ${SC}px; justify-content: center; padding-left: ${B}px; background: ${rim(SC, 'arc', 'arc', RIM)}, ${DARK}; font-size: 56px; line-height: 1; text-shadow: 0 2px 3px rgba(0,0,0,.6); }
.sb-nfl-cbs-11 .clk { justify-content: space-between; gap: ${CLK_GAP}px; padding: 0 ${CLK_PAD_R}px 0 ${CLK_PAD_L}px; font-size: 54px; line-height: 1; }
.sb-nfl-cbs-11 .clk .sb-ord { font-size: .72em; }
.sb-nfl-cbs-11 .clk .w { flex: 1; text-align: center; font-size: 44px; }
.sb-nfl-cbs-11 .sc.rec { font-size: 32px; white-space: nowrap; }
/* the timeouts: yellow dashes standing on the bar above each team's block */
.sb-nfl-cbs-11 .to { position: absolute; top: 2px; display: flex; gap: 14px; justify-content: center; width: ${TEAM}px; }
.sb-nfl-cbs-11 .to i { width: 52px; height: 8px; border-radius: 2px; background: linear-gradient(#ffe866, #f2c400); box-shadow: 0 1px 2px rgba(0,0,0,.5); }
.sb-nfl-cbs-11 .to i.used { opacity: .0; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const showDown = live && g.football;
    const bar = el('div', 'bar');
    const cw = clkW(g), bw = (showDown ? W : NODOWN) + cw - CLK;
    bar.style.clipPath = "path('M " + BB.toFixed(1) + ' 0 H ' + (bw - BB).toFixed(1) + ' A ' + RB + ' ' + RB + ' 0 0 1 ' + (bw - BB).toFixed(1) + ' ' + BAR + ' H ' + BB.toFixed(1) + ' A ' + RB + ' ' + RB + ' 0 0 1 ' + BB.toFixed(1) + " 0 Z')";
    const pair = teamPair(g.away, g.home, '#1f5aa8');
    const cap = el('div', 'cap'); if (marks(opts).ha) cap.appendChild(haMark(60));
    // with the down pill after it the cap's right end bows in, its round end sitting in it; without, it bows out like the other dividers
    cap.style.clipPath = cut(CAP, 'end', showDown ? 'in' : 'arc');
    if (showDown) cap.classList.add('in');
    bar.appendChild(cap);
    if (showDown) {
      const dn = el('div', 'dn');
      const s = g.football.short || '';
      const m = /^(\d)(ST|ND|RD|TH)(.*)$/.exec(s);
      const tx = el('span', '');
      if (m) tx.append(document.createTextNode(m[1]), el('span', 'o', m[2]), document.createTextNode(m[3])); else tx.textContent = s;
      dn.appendChild(fit(tx));
      dn.style.clipPath = cut(DOWN, 'end', 'arc');
      bar.appendChild(dn);
    }
    let x = 4 + CAP + (showDown ? DOWN + 6 - BC : 0) + M;
    [g.away, g.home].forEach((t, k) => {
      const tm = el('div', 'tm');
      const c = pair[k];
      tm.style.background = GLOSS + ', linear-gradient(' + shade(c, 0.12) + ', ' + shade(c, -0.12) + ' 45%, ' + shade(c, -0.32) + ' 55%, ' + shade(c, -0.22) + ')';
      tm.style.clipPath = cut(TEAM, 'arc', 'arc');
      tm.style.backgroundImage = rim(TEAM, 'arc', 'arc', shade(c, -0.6)) + ', ' + tm.style.backgroundImage;
      tm.style.color = panelInk(t, c);  // dark letters on a too-light block (Saints gold)
      tm.appendChild(logo(t, 92));
      const nm = el('span', 'nm');
      if (live && t.hasBall) nm.appendChild(el('i', 'ball'));
      nm.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      tm.appendChild(fit(nm));
      // before the kick-off the score box holds the team's record
      const sc = g.status === 'pre' ? el('div', 'sc rec', t.record || '') : scoreSlot(el('div', 'sc', t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre' && (t.record || '').length > 5) sc.style.fontSize = '24px';  // a 10-14-1 record on one line
      if (g.status !== 'pre' && String(t.score || '').length > 2) sc.style.fontSize = '44px';  // three figures clear of the curved ends
      sc.style.clipPath = cut(SC, 'arc', 'arc');
      bar.append(tm, sc);
      if (live && t.timeouts != null) { const to = pips(t.timeouts, 3, 'to'); to.style.left = x + 'px'; root.appendChild(to); }
      x += TEAM + SC + 2 * M;
    });
    const clk = el('div', 'clk');
    clk.style.width = cw + 'px'; clk.style.background = rim(cw, 'arc', 'end', RIM) + ', ' + DARK;
    clk.style.clipPath = cut(cw, 'arc', 'end');
    if (live) { const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase())); clk.append(q, el('span', '', g.clock || '')); }
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(clk);
    root.prepend(bar);
  },
};
