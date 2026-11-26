// "Thin bar '06": after the Australian football bar shared by the free-to-air and pay-TV networks (2006; frame: Melbourne v Fremantle,
// second quarter, an 852 x 480 upload). One thin black glossy bar across the top: each side's letters in white italics followed by its
// points on a glossy red tab, a short white stub after them, then the quarter and the clock further along ("2ND QTR 16:05").
// measured: name cells 7 % of the width, red tabs 7 %; the white stub
// 1 % at 32 %; the quarter and clock centred at 68 %; black #242526 over #0e0d0e with a lighter foot line; the red a tube (#ff4346 lit at
// the top to #670000 at the foot, step at 50 %); capitals 56 % of the bar (checked by hand: 14 of 25 px); letters a heavy italic sans (slant about 12 deg).
// by hand on a reference frame (the same SD frame, bar 27 px): the red tabs are 2.1 bar
// heights wide (ours were 1.88), rounded at the LEFT end and square at the right (ours the other way round); the white stub touches
// the second tab and is white over its top third, grey falling to its foot below: tabs 105 px, a 10 px stub with no gap before it.
// : the quarter and clock letters spaced as on air (gaps 0.34 of a capital, ours were 0.18): letter-spacing 4 px.
import { el, fit, statusText, FONTS } from '../kit.js';

const W = 1260, H = 50;

export default {
  id: 'afl-seven-06',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi800i],
  css: `
.sb-afl-seven-06 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 800; font-style: italic; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-afl-seven-06 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-afl-seven-06 *, .sb-afl-seven-06 *::before { box-sizing: border-box; }
.sb-afl-seven-06 .bar { position: absolute; inset: 0; background: linear-gradient(#2a2a2e 0%, #302b30 25%, #2a292d 45%, #201f21 55%, #161417 75%, #0e0d0e 92%, #504e4e 100%); display: flex; align-items: stretch; font-size: 40px; line-height: 1; }
.sb-afl-seven-06 .nm { width: 94px; display: flex; align-items: center; justify-content: center; padding: 0 6px; }
.sb-afl-seven-06 .pt { width: 105px; display: flex; align-items: center; justify-content: center; background: linear-gradient(#d1222d 0%, #fa1a2e 10%, #ff4346 25%, #fb3c39 45%, #d92320 55%, #b00008 75%, #670000 92%, #802a2c 100%); }
.sb-afl-seven-06 .pt.rec { font-size: 28px; }
/* the red tabs' left ends round off, their right ends square */
.sb-afl-seven-06 .pt { border-radius: 8px 0 0 8px / 50% 0 0 50%; }
/* the stub white over its top third, then grey falling to its foot */
.sb-afl-seven-06 .stub { width: 10px; background: linear-gradient(#fafafa 0%, #f2f0f0 35%, #b0aaa8 50%, #8a8280 70%, #463c3a 90%, #5a5656 100%); }
.sb-afl-seven-06 .st { position: absolute; left: 700px; width: 320px; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; gap: 18px; white-space: nowrap; letter-spacing: 4px; }
`,
  draw(root, g, { time }) {
    const bar = el('div', 'bar');
    [g.home, g.away].forEach((t) => {
      const pt = el('div', 'pt' + (g.status === 'pre' ? ' rec' : ''));
      // the points; before the bounce each side's record in their place
      pt.appendChild(el('span', '', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''));
      const nm = el('div', 'nm'); nm.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      bar.append(nm, pt);
    });
    bar.appendChild(el('div', 'stub'));
    const st = el('div', 'st');
    if (g.status === 'live') st.append(el('span', '', ((g.period.label || '') + (g.period.suffix || '')).toUpperCase() + ' QTR'), el('span', '', g.clock || ''));
    else st.appendChild(el('span', '', g.status === 'final' ? 'FULL TIME' : statusText(g, time)));
    bar.appendChild(st);
    root.appendChild(bar);
  },
};
