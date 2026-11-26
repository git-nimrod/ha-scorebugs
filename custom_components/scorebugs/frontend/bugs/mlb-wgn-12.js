// "Red tab '12": after WGN's Cubs and White Sox bug of the early 2010s. A red tab with rounded top
// corners sits on the box where the network's wordmark stood (here the Home Assistant logo); the box is dark charcoal with a silver
// rim: the two teams in rows, each marked by a thin chip of its colour at the left, its letters and score in white, a fine rule between
// the rows; the bases as outlined diamonds on a lighter grained panel (yellow when taken); at the right the half-inning arrow and the
// inning over the count and the outs.
// measured (crop px of 164 x 43): tab x 25-128, y 0-10; box y 10-43; colour chips 2-5, letters 10-45, scores 50-60, rows y 12-26 and
// 27-41; bases panel 68-103; inning, count and outs 103-160; capitals 0.23 of the height.
// read on the crop: the rim is 2 px of white to light grey (lum 255 at the
// top, 180 down the sides, 185 along the foot) round a 33 px box (0.06 of the height); the rule between the rows (y 25-26) runs from
// the rim (x 4) to the bases panel (x 64); the panels are a fine black mesh (lum 14-30), the bases panel a lighter grey mesh.
import { el, otherSport, statusText, haMark, marks, scoreSlot, fit, teamColor, FONTS } from '../kit.js';

const K = 4, W = 164 * K, H = 43 * K;
const X = (v) => Math.round(v * K);
const CAP = 10 * K, PX = Math.round(CAP / 0.7);
// "space bases out equally more". On the crop the second base sits at (85, 21), third and first at (77, 29) and
// (92.5, 29): 7.75 px apart across and 8 down, each about 9 px corner to corner, so a clear gap of about 2 px between them (the
// kit's bases sit 0.82 of a base apart and touch). Drawn here with the step 1.19 of a base's side, the same for all three.
const spacedBases = (on, s, step) => {
  const box = el('span', 'sb-bases');
  box.style.cssText = 'position:relative;display:inline-block;flex:none;width:' + (2 * step + s) + 'px;height:' + (step + s) + 'px';
  [[1, step, 0], [2, 0, step], [0, 2 * step, step]].forEach(([k, x, y]) => {
    const b = el('i', on && on[k] ? 'on' : '');
    b.style.cssText = 'position:absolute;box-sizing:border-box;left:' + x + 'px;top:' + y + 'px;width:' + s + 'px;height:' + s + 'px;transform:rotate(45deg)';
    box.appendChild(b);
  });
  return box;
};

export default {
  id: 'mlb-wgn-12',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi600],
  css: `
.sb-mlb-wgn-12 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 600; color: #fff; }
.sb-mlb-wgn-12 .c { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; line-height: 1; }
/* the red tab on top, in the same heavy white outline as the box (its foot runs under the box's rim) */
.sb-mlb-wgn-12 .tab { left: ${X(25)}px; top: 0; width: ${X(103)}px; height: ${X(12)}px; border-radius: ${X(5)}px ${X(5)}px 0 0; background: linear-gradient(#e0414a, #b51c25 55%, #8a1119);
  box-shadow: inset 0 0 0 ${X(1.6)}px #f6f7f9, inset 0 0 0 ${X(2.2)}px rgba(90,10,15,.6), 0 -1px 3px rgba(0,0,0,.4); padding-bottom: ${X(1)}px; box-sizing: border-box; }
.sb-mlb-wgn-12 .tab .sb-ha { color: #fff; }
/* the black mesh every panel sits on, inside a heavy white outline (2 px) */
.sb-mlb-wgn-12 .bx { left: 0; top: ${X(10)}px; width: ${W}px; height: ${X(33)}px; border-radius: ${X(2)}px;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,.055) 0 1.5px, transparent 1.5px 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,.055) 0 1.5px, transparent 1.5px 4px), linear-gradient(#19191b, #0b0b0c 55%, #070708);
  box-shadow: inset 0 0 0 ${X(2)}px #f6f7f9, inset 0 0 0 ${X(2.6)}px #2a2b2e, 0 2px 6px rgba(0,0,0,.5); }
.sb-mlb-wgn-12 .ch { left: ${X(3)}px; width: ${X(3)}px; height: ${X(13)}px; }
.sb-mlb-wgn-12 .ab { left: ${X(8)}px; width: ${X(38)}px; height: ${X(14)}px; font-size: ${PX}px; }
.sb-mlb-wgn-12 .sc { left: ${X(47)}px; width: ${X(17)}px; height: ${X(14)}px; font-size: ${PX * 1.05}px; }
/* "scores should be black": a black cell behind each score (crop x 44-66: lum 11-17 against the letters' mesh at
 30-55, a darker line at each side) */
.sb-mlb-wgn-12 .sp { left: ${X(44.5)}px; width: ${X(21.5)}px; height: ${X(14)}px; background: linear-gradient(#0a0a0b, #030304); box-shadow: inset ${X(0.6)}px 0 0 #000, inset -${X(0.6)}px 0 0 #000; }
.sb-mlb-wgn-12 .rule { left: ${X(2.6)}px; top: ${X(26)}px; width: ${X(64.4)}px; height: ${X(1)}px; background: #9a9ca1; }
/* the bases panel: a grey mesh */
.sb-mlb-wgn-12 .bp { left: ${X(67)}px; top: ${X(12.6)}px; width: ${X(36)}px; height: ${X(27.8)}px;
  background: repeating-linear-gradient(45deg, rgba(255,255,255,.09) 0 1.5px, transparent 1.5px 4px), repeating-linear-gradient(-45deg, rgba(0,0,0,.16) 0 1.5px, transparent 1.5px 4px), linear-gradient(#7a7b7f, #56575b); }
.sb-mlb-wgn-12 .bp .sb-bases i { background: #3a3b3e; box-shadow: inset 0 0 0 ${X(0.8)}px #d8d9dc; } .sb-mlb-wgn-12 .bp .sb-bases i.on { background: #f2e33a; }
.sb-mlb-wgn-12 .in { left: ${X(104)}px; top: ${X(12)}px; width: ${X(57)}px; height: ${X(14)}px; font-size: ${PX}px; gap: ${X(5)}px; }
/* the count and the outs with a clear gap between them, squeezed together to fit inside the rim (0-0 0 OUT ran together) */
.sb-mlb-wgn-12 .cn { left: ${X(104)}px; top: ${X(27)}px; width: ${X(56)}px; height: ${X(14)}px; font-size: ${PX}px; }
.sb-mlb-wgn-12 .cn .o { margin-left: ${X(4)}px; }
/* before the game each record as wide as its score box (the kit's em width shrank a long record to a speck) */
.sb-mlb-wgn-12 .sc .sb-pre-rec { min-width: 100% !important; }
.sb-mlb-wgn-12 .w { left: ${X(67)}px; top: ${X(12)}px; width: ${X(94)}px; height: ${X(29)}px; font-size: ${PX * 0.8}px; }
.sb-mlb-wgn-12 .bp.dt { font-size: ${PX * 0.5}px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 6);
    const live = g.status === 'live' && !os, b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const tab = el('div', 'c tab'); if (marks(opts).ha) tab.appendChild(haMark(X(8))); root.appendChild(tab);
    root.appendChild(el('div', 'c bx'));
    [g.away, g.home].forEach((t, i) => {
      const y = X(12 + i * 15) + 'px';
      const ch = el('div', 'c ch'); ch.style.top = X(12.5 + i * 15) + 'px'; ch.style.background = teamColor(t, '#5a5f68');
      const ab = fit(el('div', 'c ab', (t.abbr || '').toUpperCase())); ab.style.top = y;
      const sc = el('div', 'c sc'); sc.style.top = y; sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      const sp = el('div', 'c sp'); sp.style.top = X(i ? 27 : 12.2) + 'px';
      root.append(ch, sp, ab, sc);
    });
    root.appendChild(el('div', 'c rule'));
    if (live) {
      const bp = el('div', 'c bp'); bp.appendChild(spacedBases(b.bases, X(6.5), X(7.75))); root.appendChild(bp);
      root.appendChild(el('div', 'c in', (b.half === 'top' ? '▲ ' : b.half === 'bot' ? '▼ ' : '') + (g.period.label || '') + (g.period.suffix || '').toLowerCase()));
      const cn = fit(el('div', 'c cn')); cn.append(el('span', '', b.balls + '-' + b.strikes), el('span', 'o', b.outs + ' OUT')); root.appendChild(cn);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      if (os.detail) root.appendChild(el('div', 'c bp dt', os.detail));
      root.append(fit(el('div', 'c in', os.period)), el('div', 'c cn', os.clock));
    } else root.appendChild(el('div', 'c w', statusText(g, time)));
  },
};
