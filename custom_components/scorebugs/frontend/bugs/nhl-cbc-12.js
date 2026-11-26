// "Shield strip '12": after CBC's Hockey Night in Canada score strip of the early 2010s. A see-through grey band across the picture with a silver shield standing over it at the left (the network's gem stood in
// it; here the Home Assistant logo, in the gem's red); then for each team its letters in white on a navy panel and its score in
// dark figures on a silver box, the same navy for both teams; the clock in white on black and the period in black on white.
// The navy box at the right that held the network's web address is left out (it showed the network, not the game).
// measured (crop px of 164 x 29): shield 5-28 (full height), band y 3-22, panels y 6-20; letters 30-56 + score 56-68, letters 72-100
// + score 100-112, clock 113-140, period 141-160; capitals about 0.22 of the full height (0.46 of a panel).
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 900 / 164, H = Math.round(29 * K);
const X = (v) => Math.round(v * K);
const C = { lead: X(30), tm: X(27), s: X(12), gap: X(3), ck: X(27), pd: X(19), tail: X(6) };
const W = C.lead + 2 * (C.tm + C.s) + C.ck + C.pd + 4 * C.gap + C.tail;
// the shield's foot: straight sides to 72 %, then curving in (traced on the crop: 74 % of the half width left at 83 % down, half at 90 %,
// 30 % at 95 %) to a blunt point
const SHIELD = 'polygon(0 0, 100% 0, 100% 72%, 87% 83%, 75% 90%, 65% 95%, 56% 99%, 44% 99%, 35% 95%, 25% 90%, 13% 83%, 0 72%)';
const CAP = 6.5 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'nhl-cbc-12',
  size: { w: W, h: H },
  fonts: [FONTS.barlow700],
  css: `
.sb-nhl-cbc-12 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* the see-through grey band with a light line along its top */
.sb-nhl-cbc-12 .band { position: absolute; left: ${X(10)}px; right: 0; top: ${X(3)}px; height: ${X(19)}px; background: linear-gradient(rgba(150,148,154,.62), rgba(110,106,112,.6)); box-shadow: inset 0 2px 0 rgba(255,255,255,.6), inset 0 -2px 0 rgba(255,255,255,.3); }
/* the silver shield standing over the band */
.sb-nhl-cbc-12 .sh { position: absolute; left: ${X(5)}px; top: 0; width: ${X(23)}px; height: ${H}px; background: linear-gradient(90deg, #8d8f94, #f4f4f6 40%, #c9cacf 70%, #7f8186);
  clip-path: ${SHIELD}; display: grid; place-items: center; }
.sb-nhl-cbc-12 .sh > i { position: absolute; inset: ${X(2)}px ${X(2)}px ${X(3)}px; background: linear-gradient(#ffffff, #e8e6e8); clip-path: ${SHIELD}; }
.sb-nhl-cbc-12 .sh .sb-ha { position: relative; color: #c8102e; margin-bottom: ${X(4)}px; }
.sb-nhl-cbc-12 .row { position: absolute; left: ${C.lead}px; top: ${X(6)}px; height: ${X(14)}px; display: flex; gap: ${C.gap}px; }
.sb-nhl-cbc-12 .row > * { flex: none; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; box-shadow: 0 0 0 2px rgba(240,240,245,.7); }
/* a team: navy panel, then its score on a silver box joined to it */
.sb-nhl-cbc-12 .tm { width: ${C.tm + C.s}px; display: flex; box-shadow: 0 0 0 2px rgba(240,240,245,.7); }
.sb-nhl-cbc-12 .tm .ab { width: ${C.tm}px; height: 100%; display: grid; place-items: center; background: linear-gradient(#24247a, #0c0c55 55%, #08084a); }
.sb-nhl-cbc-12 .tm .s { width: ${C.s}px; height: 100%; display: grid; place-items: center; color: #111; background: linear-gradient(#f4f4f6, #cfcfd4 55%, #b4b4ba); }
.sb-nhl-cbc-12 .ck { width: ${C.ck}px; background: linear-gradient(#262626, #050505); }
.sb-nhl-cbc-12 .pd { width: ${C.pd}px; color: #111; background: linear-gradient(#ffffff, #e6e6e9); }
.sb-nhl-cbc-12 .w { font-size: ${PX * 0.6}px; }
/* before and after the game one white box takes the clock's and the period's room (the start time, FINAL) */
.sb-nhl-cbc-12 .row > .w { width: ${C.ck + C.pd + C.gap}px; color: #111; background: linear-gradient(#ffffff, #e6e6e9); }
/* before the game the score boxes widen into that box's room, so a three-part hockey record (10-14-1) stays readable */
.sb-nhl-cbc-12 .row.pre .tm { width: ${C.tm + C.s + X(8)}px; } .sb-nhl-cbc-12 .row.pre .tm .s { width: ${C.s + X(8)}px; }
.sb-nhl-cbc-12 .row.pre > .w { width: ${C.ck + C.pd + C.gap - 2 * X(8)}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.appendChild(el('div', 'band'));
    const sh = el('div', 'sh'); sh.appendChild(el('i')); if (marks(opts).ha) sh.appendChild(haMark(X(13))); root.appendChild(sh);
    const row = el('div', 'row' + (g.status === 'pre' ? ' pre' : ''));
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'tm');
      tm.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), scoreSlot(el('span', 's', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      row.appendChild(tm);
    });
    if (live) row.append(el('div', 'ck', g.clock || ''), el('div', 'pd', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()));
    else row.appendChild(el('div', 'w', statusText(g, time)));
    root.appendChild(row);
  },
};
