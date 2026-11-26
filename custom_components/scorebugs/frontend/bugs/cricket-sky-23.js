// "Long strip '23": after the British pay-TV test cricket strip (2023; frame: the Ashes, England 206-2 after 37 overs, 111 behind). One
// thin strip across the bottom between two pale end caps: the batting side's letters and runs-wickets on its colour (two shades), the
// overs and the state of the game on pale boxes in mixed-case navy letters, the batters on a bright blue run, and the bowling side on
// its colour at the right, rising brighter toward the end.
// measured: end caps 0.9 %; name 7.8 %, score 8.2 %, overs 8.7 %,
// state 15.7 %, batters 35.5 %, bowling side 23 %; the blue panels glossy (sampled #2467ae and #1e73cb, lit to a horizon at 62-64 %, a
// 8-11 L step, darker foot), the batters' blue #166bc9 (horizon 45 %, step 9), the bowling green #34951b at its bright end over #0d4d10;
// pale boxes #e2e9e4 and #ebece7, flat; capitals 38 % of the strip; letters a humanist sans, 600.
// Left out: the batters' and bowler's figures (no data): the blue run carries the note or the last ball.
import { el, fit, statusText, cricketState, cricketScore, teamColor, shade, relight, FONTS } from '../kit.js';

const W = 1560, H = 48;

export default {
  id: 'cricket-sky-23',
  size: { w: W, h: H },
  fonts: [FONTS.sans3],
  css: `
.sb-cricket-sky-23 { font-family: 'SB Sans Three', 'Segoe UI', sans-serif; font-weight: 600; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-sky-23 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-sky-23 *, .sb-cricket-sky-23 *::before { box-sizing: border-box; }
.sb-cricket-sky-23 .bar { position: absolute; inset: 0; display: flex; align-items: stretch; font-size: 30px; line-height: 1; }
.sb-cricket-sky-23 .cap { width: 14px; background: linear-gradient(90deg, #c9d1ca, #e3eae4 50%, #c2cac3); }
.sb-cricket-sky-23 .seg { flex: none; min-width: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 0 14px; white-space: nowrap; }
.sb-cricket-sky-23 .nm { width: 121px; }
.sb-cricket-sky-23 .sc { width: 128px; }
.sb-cricket-sky-23 .ov { width: 135px; background: #e2e9e4; color: #14306a; gap: 12px; border-right: 1px solid #b9c0bc; }
.sb-cricket-sky-23 .ov small { font-size: 19px; font-weight: 500; }
.sb-cricket-sky-23 .st { width: 244px; background: #ebece7; color: #14306a; font-size: 27px; font-weight: 500; }
.sb-cricket-sky-23 .bt { width: 553px; justify-content: flex-start; padding-left: 34px; background: linear-gradient(#2c7bca 0%, #3586d7 25%, #257ace 45%, #146bc7 55%, #1069c8 75%, #0f64c5 100%); font-size: 27px; }
.sb-cricket-sky-23 .bw { flex: 1 1 0; justify-content: space-between; padding: 0 16px 0 12px; }
.sb-cricket-sky-23 .bw small { font-size: 26px; font-weight: 600; opacity: .85; }
`,
  draw(root, g, { time }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase();
    const side = g.status === 'pre' ? g.home : c.bat, other = side === g.home ? g.away : g.home;
    const cb = teamColor(side, '#2467ae'), cw = teamColor(other, '#1f7a18');
    // a glossy blue: lit to a horizon at 63 %, a step down, darker foot (sampled on both England panels)
    const glossy = (col) => 'linear-gradient(' + relight(col, -1) + ' 0%, ' + relight(col, 2) + ' 30%, ' + relight(col, 4) + ' 61%, ' + relight(col, -7) + ' 65%, ' + relight(col, -11) + ' 100%)';
    const bar = el('div', 'bar');
    const seg = (cls, kids) => { const s = el('div', 'seg ' + cls); kids.forEach((k) => s.append(k)); return s; };
    const nm = seg('nm', [el('span', '', ab(side))]); nm.style.background = glossy(shade(cb, -0.12));
    const sc = seg('sc', []); sc.style.background = glossy(cb);
    const bw = seg('bw', []);
    // the bowling side: dark at its left, rising to its colour lit at the top at the right end
    bw.style.background = 'linear-gradient(90deg, ' + shade(cw, -0.55) + ', ' + shade(cw, -0.2) + ' 45%, ' + cw + '), linear-gradient(' + relight(cw, 6) + ', ' + cw + ')';
    bw.style.backgroundBlendMode = 'normal';
    const ov = seg('ov', []), st = seg('st', []), bt = seg('bt', []);
    if (g.status === 'pre') {
      sc.appendChild(el('span', '', 'v'));
      ov.appendChild(fit(el('span', '', statusText(g, time))));
      if (g.note) st.appendChild(fit(el('span', '', g.note)));
      bt.appendChild(fit(el('span', '', (side.longName || side.name) + ' v ' + (other.longName || other.name))));
    } else {
      // the British order: runs-wickets ("206-2")
      sc.appendChild(el('span', '', c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.runs + '-' + c.wkts : String(c.runs)));
      if (c.overs) ov.append(el('small', '', 'Overs'), el('span', '', c.overs));
      let line = '';
      if (c.result) line = c.result.text;
      else if (c.need != null) line = 'Need ' + c.need + (c.ballsLeft > 0 ? ' off ' + c.ballsLeft : '');
      else if (c.lead != null) line = c.lead > 0 ? 'Lead by ' + c.lead : c.lead < 0 ? 'Trail by ' + -c.lead : 'Scores level';
      else if (c.rate != null) line = 'Run rate ' + c.rate.toFixed(2);
      st.appendChild(fit(el('span', '', line)));
      const note = g.lastPlay && !/\b(won|beat)\b/i.test(g.lastPlay) ? g.lastPlay : g.note || '';
      if (note) bt.appendChild(fit(el('span', '', note)));
    }
    bw.append(el('span', '', ab(other)), el('small', '', g.status !== 'pre' && other.score != null ? cricketScore(other) : ''));
    bar.append(el('div', 'cap'), nm, sc, ov, st, bt, bw, el('div', 'cap'));
    root.appendChild(bar);
  },
};
