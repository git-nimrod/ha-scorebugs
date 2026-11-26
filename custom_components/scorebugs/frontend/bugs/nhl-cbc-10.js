// "Badge rows '10": after CBC's Hockey Night in Canada score bar of about 2010. A round dark badge at the left
// where the network's gem stood (here the Home Assistant logo, in white), and beside it two rows: a dark strip with the period and
// the clock in light grey, over a silver strip holding each team's logo, its letters in dark type and its score in white on a dark
// rounded box. The network's web address that ran along the top strip is left out (it showed the network, not the game).
// measured (crop px of 204 x 35): badge 0-30 (round, full height), top strip y 5-15 (period 45-60, clock 65-85), silver strip y 15-33
// (logo 32-50, letters 55-80, score box 88-118, logo 118-135, letters 140-165, score box 172-202); capitals 0.28 of the height.
import { el, logo, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 4, W = 204 * K, H = 35 * K;
const X = (v) => Math.round(v * K);
const CAP = 9.5 * K, PX = Math.round(CAP / 0.7);

export default {
  id: 'nhl-cbc-10',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond600],
  css: `
.sb-nhl-cbc-10 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 600; color: #fff; }
.sb-nhl-cbc-10 .c { position: absolute; display: flex; align-items: center; white-space: nowrap; line-height: 1; }
/* the dark top strip and the silver team strip */
.sb-nhl-cbc-10 .top { left: ${X(20)}px; right: 0; top: ${X(4)}px; height: ${X(11)}px; background: linear-gradient(#3a3a3c, #1f1f21); box-shadow: inset 0 1px 0 rgba(255,255,255,.2); gap: ${X(12)}px; padding-left: ${X(25)}px; color: #c4c4c6; font-size: ${PX * 0.8}px; }
.sb-nhl-cbc-10 .ss { left: ${X(20)}px; right: 0; top: ${X(15)}px; height: ${X(18)}px; background: linear-gradient(#f2f2f3, #d2d2d4 50%, #b3b3b6); box-shadow: 0 2px 4px rgba(0,0,0,.45); }
/* the round dark badge with a silver ring */
.sb-nhl-cbc-10 .bd { left: 0; top: 0; width: ${X(32)}px; height: ${H}px; border-radius: 50%; justify-content: center; background: radial-gradient(circle at 45% 35%, #4a4a4d, #161618 70%);
  box-shadow: inset 0 0 0 ${X(1.5)}px #a9abaf, 0 2px 5px rgba(0,0,0,.5); }
.sb-nhl-cbc-10 .bd .sb-ha { color: #f4f4f4; }
.sb-nhl-cbc-10 .lg { top: ${X(16)}px; width: ${X(18)}px; height: ${X(16)}px; justify-content: center; } .sb-nhl-cbc-10 .lg .sb-logo { width: ${X(17)}px; height: ${X(15)}px; object-fit: contain; }
.sb-nhl-cbc-10 .ab { top: ${X(15)}px; height: ${X(18)}px; width: ${X(30)}px; justify-content: center; color: #1c1c1e; font-size: ${PX}px; }
.sb-nhl-cbc-10 .sc { top: ${X(16)}px; height: ${X(16)}px; width: ${X(30)}px; justify-content: center; font-size: ${PX}px; border-radius: ${X(3)}px; background: linear-gradient(#3e3e41, #1a1a1c); box-shadow: inset 0 1px 0 rgba(255,255,255,.18); }
.sb-nhl-cbc-10 .w { font-size: ${PX * 0.72}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const top = el('div', 'c top');
    if (live) top.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else top.appendChild(el('span', 'w', statusText(g, time)));
    // the logos sit inside the silver strip, so the kit sees the silver behind them (a dark logo on the page's dark was turned white)
    const ss = el('div', 'c ss'); root.append(top, ss);
    const bd = el('div', 'c bd'); if (marks(opts).ha) bd.appendChild(haMark(X(20))); root.appendChild(bd);
    [[g.away, 32], [g.home, 117]].forEach(([t, x]) => {
      const lg = el('div', 'c lg'); lg.style.left = X(x - 20) + 'px'; lg.style.top = X(1) + 'px'; lg.appendChild(logo(t, X(17)));
      const ab = fit(el('div', 'c ab', (t.abbr || '').toUpperCase())); ab.style.left = X(x + 20) + 'px';
      const sc = el('div', 'c sc'); sc.style.left = X(x + 56) + 'px'; sc.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      ss.appendChild(lg); root.append(ab, sc);
    });
  },
};
