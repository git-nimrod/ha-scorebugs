// "Big figures '25": after TV Globo's Brasileirão scoreboard (March 2025 on; frame: reference pack SOC0346-globo, Palmeiras v Botafogo,
// 1T 04:27). Two blocks in the teams' colours meet in the middle, each with its letters at the outer end and its score in big white
// figures at the inner end, so the two scores stand side by side; a grey tab over the middle holds the half and the running clock
// ("1T 04:27", Portuguese for first half). The league's own wordmark strip under it on air is left out (league art).
// Measured: blocks 168 / 146 wide and 76 tall, the tab 136 wide and 42 tall
// sitting on the blocks over the middle; figures cap 0.86 of a block, letters 0.35 (white, bold), clock text about 0.5 of the tab;
// tab #686a62 (slightly see-through over the crowd).
// "it fades to a lighter color on the outsides on each side (lime and white, respectively). Bottom bar is present
// on each, with a neon-ish element on the PAL". Each block now runs from its team colour by the scores to a lighter tint of it at its
// outer end (Palmeiras green to lime; a black or grey team to a light grey), over the outer 55 %; along the foot of each block a bar
// 0.09 of its height in that light tint, glowing like a lit tube (neon) where the tint is a real colour (Palmeiras' lime); under a black,
// grey or white team the bar is plain white (the frame's white bar under Botafogo).
import { el, soccerClock, homeFirst, teamColor, teamInk, relight, shade, neon, FONTS, scoreSlot, fit, withRecord } from '../kit.js';

// the lighter tint at a block's outer end: the colour lit up (green to lime); a colour with little hue goes towards white
const sat = (c) => { const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); return (Math.max(...v) - Math.min(...v)) / 255; };
const tint = (c) => (sat(c) > 0.25 ? relight(c, 26) : shade(c, 0.4));
const HW = 134, AW = 117, GAP = 3, TT = 34, BH = 61, W = HW + GAP + AW, H = TT + BH, TW = 109, TL = HW - 57;

export default {
  id: 'soc-globo-25',
  size: { w: W, h: H },
  fonts: [FONTS.figtree],
  css: `
.sb-soc-globo-25 { font-family: 'SB Figtree', Arial, sans-serif; font-weight: 800; color: #f4f4f4; }
.sb-soc-globo-25 .bk { position: absolute; top: ${TT}px; height: ${BH}px; display: flex; align-items: center; box-sizing: border-box; }
.sb-soc-globo-25 .bk.h { left: 0; width: ${HW}px; padding-left: 10px; }
.sb-soc-globo-25 .bk.a { left: ${HW + GAP}px; width: ${AW}px; flex-direction: row-reverse; padding-right: 8px; }
.sb-soc-globo-25 .ab { flex: 1; text-align: center; font-size: 30px; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-soc-globo-25 .s { min-width: .62em !important; padding: 0 2px; text-align: center; font-weight: 700; font-size: 74px; line-height: 1; }
.sb-soc-globo-25 .ab .sb-rec { font-size: .6em; }
.sb-soc-globo-25 .bk > i { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; }
.sb-soc-globo-25 .tab { position: absolute; left: ${TL}px; top: 0; width: ${TW}px; height: ${TT}px; background: rgba(104, 106, 98, .92); color: #e8e8e8; display: grid; place-items: center;
  font-size: 23px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; padding: 0 6px; box-sizing: border-box; }
.sb-soc-globo-25 .tab.when { font-size: 17px; }
`,
  draw(root, g, { time }) {
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    [[h, 'h'], [a, 'a']].forEach(([t, k]) => {
      const c = teamColor(t, '#484949'), b = el('div', 'bk ' + k);
      const lt = tint(c), bar = el('i');
      b.style.background = 'linear-gradient(' + (k === 'h' ? '270deg' : '90deg') + ', ' + c + ' 45%, ' + lt + ')'; b.style.color = teamInk(c);
      bar.style.background = sat(c) > 0.25 ? lt : '#f2f2f2';
      if (sat(c) > 0.25) bar.style.boxShadow = neon(lt, 8, false);
      b.appendChild(bar);
      // before the kick-off no score figures: the block holds the letters with the team's record beside them (the big figure room would
      // squeeze the letters out)
      if (live) b.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), scoreSlot(el('span', 's', t.score != null ? String(t.score) : ''), g));
      else b.append(fit(withRecord(el('span', 'ab', (t.abbr || '').toUpperCase()), t, g)));
      root.appendChild(b);
    });
    let clock = soccerClock(g, time);
    // the half before the running clock, MM:SS with a leading zero, as on air ("1T 04:27"; "PR" in extra time)
    if (live && /^\d{1,2}:\d\d$/.test(clock)) {
      const n = (g.period && g.period.n) || 1;
      clock = (n <= 2 ? n + 'T' : 'PR') + ' ' + clock.padStart(5, '0');
    }
    root.appendChild(el('div', 'tab' + (clock.length > 8 ? ' when' : ''), clock));
  },
};
