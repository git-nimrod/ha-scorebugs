// "Team boxes '25" (id kept: nfl-floating-25): after the 2025 NFL Sunday national package on FOX (frame: Chiefs v Eagles). Rebuilt Nov 22,
// 2026 to the frame. No bar behind it: each team's letters
// big and white on a flat box of its colour at the outer ends, huge silver scores beside them, a small dark rounded box in the middle with
// the clock over the quarter. Under each team box its three timeout bars (light while left, dark once used); over the box of the team
// with the ball, the down and distance on a strip of the same colour. Heavy wide type (Montserrat 900). Before the game the record
// stands in the score's place. No logos, no network marks.
import { el, ordinal, pips, statusText, teamColor, teamInk, shade, fit, contrast, FONTS } from '../kit.js';

// measured on the frame as shares of the box: box 3 : 1, letters' caps 0.8 of the box, score caps 0.9 of it, centre box 0.6 of a team
// box wide and as tall, down strip half the box's height, the dashes centred under the box
// (Nov 23 sweep, measured again: down strip 0.55 of the box tall with a 0.08 gap; timeout bars 0.126 of the box wide, 0.18 of it tall)
const BOX = 250, BOX_H = 84, SCORE = 140, MID = 140, GAP = 20, STRIP = 46, TOP = STRIP + 9;
const W = 2 * BOX + 2 * SCORE + MID + 4 * GAP, H = TOP + BOX_H + 32;
// three-figure scores (a basketball game): the team boxes move out by WIDE each and the scores get that room, both sides alike
const WIDE = 64, big = (g) => g.status !== 'pre' && [g.away.score, g.home.score].some((x) => x != null && x >= 100);

export default {
  id: 'nfl-floating-25',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: W + (big(g) ? 2 * WIDE : 0), h: H }),
  fonts: [FONTS.montserrat],
  css: `
.sb-nfl-floating-25 { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 900; color: #fff; }
.sb-nfl-floating-25 .bx { position: absolute; top: ${TOP}px; width: ${BOX}px; height: ${BOX_H}px; display: grid; place-items: center; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-nfl-floating-25 .bx .ab { font-size: 94px; line-height: 1; letter-spacing: 1px; max-width: ${BOX - 24}px; text-shadow: 0 2px 2px rgba(0,0,0,.3); }
/* the cell taller than the box: the silver fill is clipped to the text inside the cell only, so the figures must sit wholly inside it */
.sb-nfl-floating-25 .sc { position: absolute; top: ${TOP - 18}px; width: ${SCORE + 2 * GAP}px; margin-left: -${GAP}px; height: ${BOX_H + 36}px; display: grid; place-items: center; font-size: 106px; line-height: 1; letter-spacing: 2px;   /* the figures never touch */
 
  background: linear-gradient(#ffffff 35%, #d2d6da 62%, #f4f5f6 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 3px 3px rgba(0,0,0,.55)); }
.sb-nfl-floating-25 .bx .ab .sb-fit { display: block; line-height: 1; position: relative; top: -0.053em; }   /* the fitting span at line height 1 too, so the caps sit in the box's middle */
.sb-nfl-floating-25 .sc.rec { font-size: 46px; letter-spacing: 0; }
.sb-nfl-floating-25 .sc { white-space: nowrap; }   /* before the game the record stands in the score's place */
.sb-nfl-floating-25 .mid { position: absolute; top: ${TOP}px; width: ${MID}px; height: ${BOX_H}px; display: grid; align-content: center; justify-items: center;
  background: linear-gradient(rgba(44,50,42,.9), rgba(24,28,24,.9)); border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,.4); }
.sb-nfl-floating-25 .clk { font-size: 40px; line-height: 1; } .sb-nfl-floating-25 .per { font-size: 32px; line-height: 1.05; color: #eceef0; white-space: nowrap; }
.sb-nfl-floating-25 .mid .one { font-size: 30px; max-width: ${MID - 16}px; }
.sb-nfl-floating-25 .sb-ord { font-size: .72em; }
.sb-nfl-floating-25 .bx .ab.edge { paint-order: stroke fill; -webkit-text-stroke: 6px var(--edge); }   /* every team's letters rimmed in its second colour, as KC's gold edge on air */
.sb-nfl-floating-25 .dn { position: absolute; top: 2px; width: ${BOX}px; height: ${STRIP}px; display: grid; place-items: center; font-size: 36px; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-nfl-floating-25 .to { position: absolute; top: ${TOP + BOX_H + 10}px; width: ${BOX}px; display: flex; justify-content: center; }
.sb-nfl-floating-25 .sb-pips { display: flex; gap: 9px; }
.sb-nfl-floating-25 .sb-pips i { width: 31px; height: 15px; border-radius: 3px; background: linear-gradient(#ffffff, #c9cdd1); box-shadow: 0 1px 2px rgba(0,0,0,.55); }
.sb-nfl-floating-25 .sb-pips i.used { background: linear-gradient(#3a3e42, #24272a); }
/* on a light page (bug_ink dark): the scores in dark ink; the boxes keep their colours */
.sb-nfl-floating-25.sb-ink-dark .sc { background: linear-gradient(#2c3036 35%, #121418 62%, #2a2e33 100%); -webkit-background-clip: text; background-clip: text; filter: none; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const e = big(g) ? WIDE : 0;
    const x = { aBox: 0, aSc: BOX + GAP, mid: BOX + SCORE + e + 2 * GAP, hSc: BOX + SCORE + e + MID + 3 * GAP, hBox: W + 2 * e - BOX };
    const ord = (s) => { const m = /^(\d+)(ST|ND|RD|TH)(.*)$/i.exec(s); if (!m) return document.createTextNode(s);
      const n = el('span'); n.append(document.createTextNode(m[1]), el('span', 'sb-ord', m[2].toUpperCase()), document.createTextNode(m[3])); return n; };
    [['away', x.aBox, x.aSc], ['home', x.hBox, x.hSc]].forEach(([side, bx, sx]) => {
      const t = g[side], c = teamColor(t, '#3a3f47');
      const b = el('div', 'bx'); b.style.left = bx + 'px';
      b.style.background = 'linear-gradient(' + shade(c, 0.05) + ', ' + shade(c, -0.05) + ')'; b.style.color = teamInk(c);
      const ab = el('span', 'ab', (t.abbr || '').toUpperCase());
      // the letters rimmed in the team's second colour; when that
      // colour is the box's own or the letters' (Saints: black letters, black second colour), the first colour rims them instead
      const ink = teamInk(c), okc = (x) => /^#[0-9a-f]{6}$/i.test(x || '');
      const edge = [t.color2, t.color].filter(okc).find((x) => contrast(x, c) >= 1.4 && contrast(x, ink) >= 1.4);
      if (edge) { ab.classList.add('edge'); ab.style.setProperty('--edge', edge); }
      b.appendChild(fit(ab));
      root.appendChild(b);
      const sc = el('div', 'sc' + (pre ? ' rec' : ''));
      // one line always: a long record (10-14-1) is squeezed to the cell, never broken onto a second line
      const txt = pre ? t.record || '' : t.score != null ? String(t.score) : '';
      sc.textContent = txt; if (pre && txt.length > 5) sc.style.fontSize = Math.round(46 * 5.2 / txt.length) + 'px';   // (the silver fill is clipped to the cell's own text, so it is sized here, not wrapped)
      sc.style.left = sx + 'px'; if (e) sc.style.width = (SCORE + e + 2 * GAP) + 'px'; root.appendChild(sc);
      if (live && g.sport === 'football' && t.timeouts != null) { const to = el('div', 'to'); to.style.left = bx + 'px'; to.appendChild(pips(t.timeouts, 3)); root.appendChild(to); }
      if (live && t.hasBall && g.football && g.football.short) {
        const dn = el('div', 'dn'); dn.appendChild(ord(g.football.short));
        dn.style.left = bx + 'px'; dn.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.06) + ')'; dn.style.color = teamInk(c);
        root.appendChild(dn);
      }
    });
    const mid = el('div', 'mid'); mid.style.left = x.mid + 'px';
    if (live) { if (g.clock) mid.appendChild(el('div', 'clk', g.clock)); const per = el('div', 'per'); per.appendChild(ordinal(g.period)); mid.appendChild(per); }
    else mid.appendChild(fit(el('div', 'per one', statusText(g, time))));
    root.appendChild(mid);
  },
};
