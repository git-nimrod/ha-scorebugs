// "Grey box '00": after CTV Sportsnet's NHL score box of about 2000.
// A light grey box: along its top the period in dark letters on pale grey and the clock in white on a dark grey panel; under it a
// steel-blue grey panel where the network's swoosh stood at the left (here the Home Assistant logo) and the two teams' letters and
// scores in white at the right, one row each. Soft picture by default.
// Left out: the power-play strip under the box and the arrow by the team on the power play (no power-play data in the feed).
// measured (crop px of 103 x 56): top row y 2-17 (period 2-35, clock 38-102), team rows y 18-32 and 33-47 (letters 49-73, scores
// centred at 92), mark spot 0-38; capitals about 8.5 px, 0.18 of the box's height (0.6 of a row; confirmed on the registered frame).
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS, TEXT_90S } from '../kit.js';

const K = 4, W = 103 * K, H = 48 * K;
const X = (v) => Math.round(v * K);
const CAP = 8.5 * K, PX = Math.round(CAP / 0.686);

export default {
  id: 'nhl-sn-00',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-sn-00 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 88%; color: #fff; }
.sb-nhl-sn-00 .bx { position: absolute; inset: 0; background: linear-gradient(#dcdcde, #b9babd); box-shadow: inset 0 0 0 2px #eeeeef, 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-sn-00 .c { position: absolute; display: flex; align-items: center; white-space: nowrap; line-height: 1; }
.sb-nhl-sn-00 .pd { left: ${X(2)}px; top: ${X(2)}px; width: ${X(33)}px; height: ${X(15)}px; justify-content: center; color: #2a2a2c; font-size: ${PX * 0.8}px; background: linear-gradient(#e8e8ea, #c9c9cc); }
.sb-nhl-sn-00 .ck { left: ${X(38)}px; top: ${X(2)}px; width: ${X(63)}px; height: ${X(15)}px; justify-content: flex-end; padding-right: ${X(3)}px; box-sizing: border-box; font-size: ${PX * 0.9}px;
  background: linear-gradient(#77787b, #4f5053 55%, #444548); text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-nhl-sn-00 .w { left: ${X(2)}px; width: ${X(99)}px; justify-content: center; padding: 0; font-size: ${PX * 0.62}px; }
/* the team panel: steel-blue grey, lighter at the top */
.sb-nhl-sn-00 .tp { left: ${X(2)}px; top: ${X(18)}px; width: ${X(99)}px; height: ${X(29)}px; background: linear-gradient(#8c96a2, #6c737c 50%, #5c6168); }
.sb-nhl-sn-00 .mk { left: ${X(2)}px; top: ${X(18)}px; width: ${X(36)}px; height: ${X(29)}px; justify-content: center; } .sb-nhl-sn-00 .mk .sb-ha { color: #e9edf2; }
.sb-nhl-sn-00 .ab { left: ${X(40)}px; width: ${X(34)}px; height: ${X(14)}px; justify-content: flex-end; font-size: ${PX}px; text-shadow: ${TEXT_90S}; }
.sb-nhl-sn-00 .sc { left: ${X(86)}px; width: ${X(14)}px; height: ${X(14)}px; justify-content: center; font-size: ${PX}px; text-shadow: ${TEXT_90S}; }
.sb-nhl-sn-00 .sc.rec { left: ${X(76)}px; width: ${X(25)}px; justify-content: flex-end; padding-right: ${X(1)}px; box-sizing: border-box; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.append(el('div', 'bx'), el('div', 'c tp'));
    if (live) root.append(el('div', 'c pd', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('div', 'c ck', g.clock || ''));
    else root.appendChild(el('div', 'c ck w', statusText(g, time)));
    const mk = el('div', 'c mk'); if (marks(opts).ha) mk.appendChild(haMark(X(20))); root.appendChild(mk);
    [g.away, g.home].forEach((t, i) => {
      const y = X(18.5 + i * 14.5) + 'px';
      const ab = fit(el('div', 'c ab', (t.abbr || '').toUpperCase())); ab.style.top = y;
      // before the game the score place reaches back to the letters, so a three-part record (10-14-1) is not a speck
      const sc = el('div', 'c sc' + (g.status === 'pre' ? ' rec' : '')); sc.style.top = y; sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      root.append(ab, sc);
    });
  },
};
