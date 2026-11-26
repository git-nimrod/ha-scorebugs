// "Cup '26": after the 2026 World Cup world feed. Reordered to the frames: the clock (MM:SS) in a dark box at the LEFT, then a black bar in a rim of the
// match's bright pink-to-purple colour: each team's flag, a dot in its colour and its letters, its score in a cyan box, the tournament's
// emblem standing taller in the middle; added time in a red chip closing the bar at the right. No title tab (neither frame has one).
import { el, soccerClock, logo, homeFirst, leagueLogo, marks, statusText, teamColor, FONTS, fit, withRecord } from '../kit.js';

const CLK = 170, GAP = 10, BAR = 640, ADD = 96, W = CLK + GAP + BAR + ADD, ROW = 76, H = ROW + 28, SC = 72;   // (Nov 23 sweep) room above and below for the taller emblem tile
// the rim in the tournament's bright bands (design sheet SOC0017): coral, red, cyan round the scores, green, purple
// before the kick-off each name column keeps this much of its score box's room for the record beside the name (the names were
// squeezed and ran into their colour dots)
const PRE_KEEP = 48;
const RIM = 'linear-gradient(90deg, #ff7d74 0, #ff6f91 18%, #ff2d3c 32%, #22d3ee 40%, #22d3ee 60%, #7ed321 70%, #8b4dff 84%)';

export default {
  id: 'soc-cup-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there are no scores: the two cyan boxes go and the bar closes up on the emblem
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * (SC - PRE_KEEP), h: H } : { w: W, h: H }),
  fonts: [FONTS.openSans],
  css: `
.sb-soc-cup-26 { font-family: 'SB Open Sans', Arial, sans-serif; font-weight: 800; font-stretch: 100%; color: #fff; line-height: 1; }
/* face: FIFA World Cup 2026: Open Sans Bold (confirmed) */
.sb-soc-cup-26 .clk { position: absolute; left: 0; top: 14px; width: ${CLK}px; height: ${ROW}px; box-sizing: border-box; background: #141518; border-radius: 14px;
  display: grid; place-items: center; font-size: 46px; font-variant-numeric: tabular-nums; white-space: nowrap; padding: 0 16px; }
.sb-soc-cup-26 .rim { position: absolute; left: ${CLK + GAP}px; top: 14px; width: ${BAR}px; height: ${ROW}px; border-radius: 18px; background: ${RIM}; }
.sb-soc-cup-26 .bar { position: absolute; inset: 9px;   /* a thick band, as on the sheet (it was a thin line) */ background: #0e0f11; border-radius: 14px; display: grid; grid-template-rows: minmax(0, 1fr);
  grid-template-columns: 66px 28px 108px 72px 76px 72px 108px 28px 66px; align-items: center; }
.sb-soc-cup-26 .fl { display: grid; place-items: center; align-self: stretch; } .sb-soc-cup-26 .fl .sb-logo { width: 60px; height: 44px; object-fit: contain; }
.sb-soc-cup-26 .dot { width: 22px; height: 22px; border-radius: 50%; justify-self: center; box-shadow: 0 0 0 2px #fff; }
.sb-soc-cup-26 .ab { font-size: 44px; text-align: center; letter-spacing: 1px; font-stretch: 75%; }
.sb-soc-cup-26 .sc { font-stretch: 75%; }   /* every surface flat and the letters and figures tall and narrow, as in both frames */
.sb-soc-cup-26 .sc { height: 56px; display: grid; place-items: center; font-size: 50px; padding: 0 4px; background: #22d3ee; color: #0b0c0e; border-radius: 10px; font-variant-numeric: tabular-nums; }
/* the light blue runs on under the emblem's tile, as on air: one block 149 px wide on the frame with the tile laid over its middle, so the
 inner ends of the two score boxes tuck 30 px under the tile and only their outer corners are round (frame: radius 12 on a block 75 tall,
 0.16 of its height, so 9 here) */
.sb-soc-cup-26 .sc.h { margin-right: -30px; padding-right: 34px; border-radius: 9px 0 0 9px; }
.sb-soc-cup-26 .sc.a { margin-left: -30px; padding-left: 34px; border-radius: 0 9px 9px 0; }
/* the emblem's tile upright, as on the sheet: about 0.95 of the rim's height wide and 1.33 of it tall (it was nearly square) */
.sb-soc-cup-26 .em { position: relative; z-index: 1; height: ${ROW + 24}px; margin: -21px 0; background: #0e0f11; border-radius: 14px; border: 3px solid #fff; display: grid; place-items: center; box-sizing: border-box; }
.sb-soc-cup-26 .em .sb-league { width: 62px; height: 62px; }
.sb-soc-cup-26 .add { position: absolute; left: ${CLK + GAP + BAR - 12}px; top: 14px; width: ${ADD + 12}px; height: ${ROW}px; padding-left: 12px; box-sizing: border-box;
  background: #e3262e; border-radius: 0 18px 18px 0; display: grid; place-items: center; font-size: 42px; }   /* drawn before the bar, so the bar laps over its left end */
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status === 'live';
    // the clock: the minute while live (the added time in its own chip), FT at the end, the kick-off before
    const minute = live ? String(soccerClock(g, time)).replace(/\+\d+'?$/, '') : g.status === 'final' ? 'FT' : statusText(g, time);
    root.appendChild(fit(el('div', 'clk', minute)));
    const added = live && g.soccer && g.soccer.added ? '+' + g.soccer.added : '';
    if (added) root.appendChild(el('div', 'add', added));
    const rim = el('div', 'rim'), bar = el('div', 'bar');
    const fl = (t) => { const d = el('div', 'fl'); d.appendChild(logo(t, 60)); return d; };
    const dot = (t) => { const d = el('i', 'dot'); d.style.background = teamColor(t, '#888'); return d; };
    const s = (t) => (g.status !== 'pre' && t.score != null ? String(t.score) : '');
    const em = el('div', 'em');
    if (mk.league) em.appendChild(leagueLogo(g, 62));
    const abH = fit(withRecord(el('span', 'ab', (h.abbr || '').toUpperCase()), h, g)), abA = fit(withRecord(el('span', 'ab', (a.abbr || '').toUpperCase()), a, g, false));  // records before kick-off
    if (g.status === 'pre') {
      rim.style.width = (BAR - 2 * (SC - PRE_KEEP)) + 'px';
      bar.style.gridTemplateColumns = '66px 28px ' + (108 + PRE_KEEP) + 'px 76px ' + (108 + PRE_KEEP) + 'px 28px 66px';
      bar.append(fl(h), dot(h), abH, em, abA, dot(a), fl(a));
    } else bar.append(fl(h), dot(h), abH, fit(el('span', 'sc sb-num h', s(h))), em, fit(el('span', 'sc sb-num a', s(a))), abA, dot(a), fl(a));
    rim.appendChild(bar);
    root.appendChild(rim);
  },
};
