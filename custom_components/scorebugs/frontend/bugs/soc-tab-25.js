// "Tabbed box '25": after MLS on Apple (2025). Reordered to the on-air frame (reference pack SOC0236_mls, Miami v
// Nashville): the match clock on dark grey at the LEFT, then a white bar with the home team's letters, both scores split by a thin rule
// ("0 | 0") and the away team's letters in dark type; each team's colour only fades in at its own far end of the bar. No logos (the
// frame has none). In the playoffs a pale tab over the scores names the round ("2025 MLS CUP"), as in the MLS Cup frame.
import { el, soccerClock, homeFirst, teamColor, FONTS, scoreSlot, fit, withRecord } from '../kit.js';

const CLK = 150, BAR = 700, W = CLK + BAR, TAB = 36, ROW = 60, H = TAB + ROW, SCORES = 142;   // SCORES: both score cells and the rule

export default {
  id: 'soc-tab-25',
  sizedFor: 0.7275,   // sizes were measured in SB Inter Tight; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there are no scores: their cells go and the two names close up on the rule, so the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - SCORES + 2, h: H } : { w: W, h: H }),
  dresses: ['regular', 'playoffs', 'finals'],
  fonts: [FONTS.inter],
  css: `
/* lighter type, as on air (Nov 23 sweep: the frame's strokes are about an eighth of the cap height, Inter Medium's; the clock lighter still) */
.sb-soc-tab-25 { font-family: 'SB Inter V', Arial, sans-serif; font-weight: 500; color: #fff; line-height: 1; }
/* face: Apple MLS: Inter SemiBold */
.sb-soc-tab-25 .tab { position: absolute; left: ${CLK + BAR / 2 - 100}px; width: 200px; box-sizing: border-box; top: 0; height: ${TAB}px; padding: 0 8px; overflow: hidden;
  white-space: nowrap; background: rgba(214,216,220,.94); color: #1b1c1e; display: grid; place-items: center; font-size: 19px; border-radius: 6px 6px 0 0; }
.sb-soc-tab-25 .row { position: absolute; left: 0; top: ${TAB}px; width: ${W}px; height: ${ROW}px; display: grid; grid-template-columns: ${CLK}px ${BAR}px;
  box-shadow: 0 2px 6px rgba(0,0,0,.45); border-radius: 4px; overflow: hidden; }
.sb-soc-tab-25 .clk { background: #2b2c30;   /* flat on air */ display: grid; place-items: center; font-size: 36px; font-weight: 400; font-variant-numeric: tabular-nums; white-space: nowrap; padding: 0 14px; box-sizing: border-box; }
.sb-soc-tab-25 .bar { box-sizing: border-box; display: grid; grid-template-columns: 1fr 70px 2px 70px 1fr; align-items: center; color: #16171a; }
.sb-soc-tab-25 .nm { text-align: center; font-size: 36px; letter-spacing: 2px; white-space: nowrap; }
.sb-soc-tab-25 .s { text-align: center; font-size: 38px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.sb-soc-tab-25 .bar i { height: 60%; background: #9a9ca1; }
`,
  draw(root, g, { time }) {
    const [h, a] = homeFirst(g);
    if (g.dress && g.dress !== 'regular' && g.note) {
      const yr = new Date(g.starts).getFullYear();
      const label = String(g.note).split(/\s+-\s+/)[0].toUpperCase();
      const tb = el('div', 'tab', (g.dress === 'finals' ? yr + ' ' : '') + label);
      if (g.status === 'pre') tb.style.left = (CLK + (BAR - SCORES + 2) / 2 - 100) + 'px';   // over the rule of the closed-up bar
      root.appendChild(tb);
    }
    const row = el('div', 'row'), bar = el('div', 'bar');
    // white, with each team's colour as a solid block at its own far end, a hard edge to the white (as on air: Nashville's navy block; it was a soft fade)
    const ch = teamColor(h, '#9a9ca1'), ca = teamColor(a, '#9a9ca1');
    bar.style.background = `linear-gradient(90deg, ${ch} 0 46px, #f4f4f5 46px calc(100% - 46px), ${ca} calc(100% - 46px))`;
    bar.style.paddingLeft = bar.style.paddingRight = '46px';
    const s = (t) => scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
    const nh = fit(withRecord(el('span', 'nm', (h.abbr || '').toUpperCase()), h, g)), na = fit(withRecord(el('span', 'nm', (a.abbr || '').toUpperCase()), a, g));  // records before kick-off
    if (g.status === 'pre') {
      const bw = BAR - SCORES + 2; row.style.width = (CLK + bw) + 'px'; row.style.gridTemplateColumns = CLK + 'px ' + bw + 'px';
      bar.style.gridTemplateColumns = '1fr 2px 1fr'; bar.append(nh, el('i'), na);
    } else bar.append(nh, s(h), el('i'), s(a), na);
    row.append(fit(el('div', 'clk', soccerClock(g, time))), bar);
    root.appendChild(row);
  },
};
