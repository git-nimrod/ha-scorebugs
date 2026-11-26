// "Blue plates '12": after the YES Network's Yankees bug of the early 2010s. Two rows in a chrome-rimmed
// dark frame. Top: the network's wordmark on a royal blue plate (here the Home Assistant logo), then each team's letters in white on a
// royal blue plate and its score in white on a black one, and the bases as grey diamonds. Under it, inset a little: the inning with
// both half-inning arrows (the current one lit), the count, and the outs, each on a dark plate. Both teams wear the same blue on air
// (the network's), kept here. Left out: the pitch count plate at the right of the lower row (no data).
// measured (crop px of 212 x 47): top row y 0-27 (plates y 5-23: mark 5-48, team 55-88, score 90-115, team 118-152, score 155-178,
// bases 180-210); lower row y 28-47 from x 5 (inning 8-50, count 52-82, outs 84-130); capitals 0.23 of the height.
// read on the crop: the top
// row's inside runs white to black from left to right (lum 250 at x 4, 200 at x 51, 95 at x 88, 75 at x 117, 55 at x 153, 40 at
// x 179, 30 at x 205), its upper half a little lighter (240 over 160 beside the mark); the lower row's plates grey only along their
// top (lum 65-110 at y 29) and black below (lum 10 at y 44), on a black tray.
// the top row's white now falls to mid grey
// by a fifth of the width and near black by 45 % (it reached mid grey at 42 %); the bases' rims black; the blue plates the deep royal
// blue read on the crop (#050a5a-#0a0c62 across the plates, a lighter #1a2580 along their top) where they were a bright #2f55c8.
import { el, otherSport, bases, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 4, W = 212 * K, H = 47 * K;
const X = (v) => Math.round(v * K);
const CAP = 10.5 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'mlb-yes-12',
  size: { w: W, h: H },
  fonts: [FONTS.barlow800],
  css: `
.sb-mlb-yes-12 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 800; color: #fff; }
.sb-mlb-yes-12 .c { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; }
/* the top frame: chrome rim round a dark grey inside */
.sb-mlb-yes-12 .top { left: 0; top: 0; width: ${W}px; height: ${X(27)}px; border-radius: ${X(3)}px;
  background: linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,.08) 46%, rgba(0,0,0,.14) 54%, rgba(0,0,0,.05)),
    linear-gradient(90deg, #f6f6f7 1%, #d6d6d9 9%, #6c6d70 20%, #3a3b3e 30%, #222325 45%, #161618 65%, #0e0e10 97%);
  box-shadow: inset 0 0 0 ${X(1.2)}px #c9cbd0, inset 0 ${X(1.6)}px 0 ${X(1.2)}px rgba(255,255,255,.55), 0 2px 6px rgba(0,0,0,.5); }
.sb-mlb-yes-12 .bot { left: ${X(5)}px; top: ${X(27)}px; width: ${X(127)}px; height: ${X(19)}px; border-radius: 0 0 ${X(2.5)}px ${X(2.5)}px; background: linear-gradient(#141416, #060607);
  box-shadow: inset 0 0 0 ${X(0.7)}px #55565a, 0 2px 6px rgba(0,0,0,.5); }
.sb-mlb-yes-12 .bl { top: ${X(5)}px; height: ${X(18)}px; border-radius: ${X(2)}px; background: linear-gradient(#24339c, #0e1b88 30%, #0a1478 60%, #060d5e); box-shadow: inset 0 0 0 2px rgba(170,190,255,.5); font-size: ${PX}px; }
.sb-mlb-yes-12 .bk { top: ${X(5)}px; height: ${X(18)}px; border-radius: ${X(2)}px; background: linear-gradient(#36373b, #0d0d0f 50%, #000); box-shadow: inset 0 0 0 2px rgba(120,120,125,.5); font-size: ${PX * 1.1}px; }
/* before the game each record as wide as its black box (the kit's em width shrank a long record to a speck) */
.sb-mlb-yes-12 .bk .sb-pre-rec { min-width: 100% !important; }
.sb-mlb-yes-12 .mk { left: ${X(5)}px; width: ${X(43)}px; } .sb-mlb-yes-12 .mk .sb-ha { color: #fff; }
.sb-mlb-yes-12 .ba { left: ${X(180)}px; top: ${X(3)}px; width: ${X(30)}px; height: ${X(22)}px; }
.sb-mlb-yes-12 .ba .sb-bases i { background: linear-gradient(#7a7b80, #4b4c50); box-shadow: inset 0 0 0 ${X(0.8)}px #000; } .sb-mlb-yes-12 .ba .sb-bases i.on { background: linear-gradient(#ffffff, #d7d8dc); box-shadow: inset 0 0 0 ${X(0.8)}px #000; }
/* the lower row: dark plates in a silver tray */
.sb-mlb-yes-12 .dp { top: ${X(28.5)}px; height: ${X(15.5)}px; background: linear-gradient(#4a4b4f, #1c1c1e 22%, #0a0a0b 55%, #050506); box-shadow: inset 0 0 0 1px rgba(110,110,116,.45); font-size: ${PX * 0.95}px; gap: ${X(2)}px; }
.sb-mlb-yes-12 .dp small { font-size: .7em; }
.sb-mlb-yes-12 .ar { display: grid; gap: ${X(1)}px; margin-right: ${X(1)}px; } .sb-mlb-yes-12 .ar i { width: 0; height: 0; border-left: ${X(3)}px solid transparent; border-right: ${X(3)}px solid transparent; }
.sb-mlb-yes-12 .ar .u { border-bottom: ${X(3)}px solid #6d6e72; } .sb-mlb-yes-12 .ar .d { border-top: ${X(3)}px solid #6d6e72; }
.sb-mlb-yes-12 .ar .u.on { border-bottom-color: #f2f2f2; } .sb-mlb-yes-12 .ar .d.on { border-top-color: #f2f2f2; }
.sb-mlb-yes-12 .w { font-size: ${PX * 0.75}px; }
.sb-mlb-yes-12 .ba.dt { font-size: ${PX * 0.5}px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os, b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    root.append(el('div', 'c bot'), el('div', 'c top'));
    const mk = el('div', 'c bl mk'); if (marks(opts).ha) mk.appendChild(haMark(X(14))); root.appendChild(mk);
    [[g.away, 55, 90], [g.home, 118, 155]].forEach(([t, x, sx]) => {
      const ab = fit(el('div', 'c bl', (t.abbr || '').toUpperCase())); ab.style.left = X(x) + 'px'; ab.style.width = X(33) + 'px';
      const sc = el('div', 'c bk'); sc.style.left = X(sx) + 'px'; sc.style.width = X(24) + 'px';
      sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      root.append(ab, sc);
    });
    const plate = (x, w, cls) => { const p = el('div', 'c dp' + (cls ? ' ' + cls : '')); p.style.left = X(x) + 'px'; p.style.width = X(w) + 'px'; root.appendChild(p); return p; };
    // the bases stay at the bar's end before and after the game too, all empty (the end stood bare)
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const ba = el('div', 'c ba');
    if (os) { if (os.detail) { ba.classList.add('dt'); ba.textContent = os.detail; } } else ba.appendChild(bases(live ? b.bases : null, X(7.5)));
    root.appendChild(ba);
    if (live) {
      const inn = plate(8, 42), ar = el('span', 'ar');
      ar.append(el('i', 'u' + (b.half === 'top' ? ' on' : '')), el('i', 'd' + (b.half === 'bot' ? ' on' : '')));
      inn.append(ar, el('span', '', (g.period.label || '') + (g.period.suffix || '').toUpperCase()));
      plate(52, 30).textContent = b.balls + '-' + b.strikes;
      const o = plate(84, 46); o.append(el('span', '', String(b.outs)), el('small', '', b.outs === 1 ? 'OUT' : 'OUTS'));
    } else if (os) { plate(8, 42).textContent = os.period; plate(52, 78).textContent = os.clock; }
    else plate(8, 122, 'w').textContent = statusText(g, time);
  },
};
