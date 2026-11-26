// "Capsule bar '11": after Sportsnet's NHL score bar of the early 2010s. A grey metal frame closed by
// short silver cylinders at both ends, round a dark grained bar: each team's letters in white, each score in black on a white capsule,
// the period in white, the clock in black on a wider white capsule, and the network's wordmark at the right end (here the Home
// Assistant logo).
// measured (crop px of 454 x 30): end caps 0-8 and 446-454, the dark bar 8-446 and y 3-27; team 10-75, capsule 77-103, team 105-170,
// capsule 171-197, period 198-245, clock capsule 246-305, network 307-440; capitals 0.43 of the height.
// (bars on the tops and bottoms of the time and score areas; review the end caps"),
// read on the crop, columns through each part:
// frame rim light at y 4-5 and 28-29; the bar inside y 6-27: a grey band along its top (y 6-9, #8a878a / #6d6a6d), near black
// below (#151316 - #3c393c, y 10-23), dark grey along the foot (#464548, y 24-27)
// over each score and clock capsule a white bar (y 6-8, lum 250) and a thin grey line (y 9, lum 185); the capsule y 9.5-24.5
// (15 px, 0.5 of the height; it was 20); under it a grey bar (y 25-27, #737373 rising to #b2b2b2)
// end caps x 1.5-7, y 4-28.5: chrome with a blue tint, white along the top (y 4-8, #f8fcff), pale blue-grey below (#9eb1ba -
// #b0cce0), a dark band low down (y 23-24, #484f5a) and a light foot; a bright streak down the middle (x 3, #edf7fd)
// the whole bar measured again against the crop, column by column:
// the crop's rows 0-2 are the sheet's white, not the bug: the bug is 27 px tall (y 3-29), so ours is 27 crop px (it was 30, which
// made the metal over the bar twice as thick as on air: 5.6 px against 3); the edge a dark line (lum 90) over a light rim (205,
// 245), the bar y 6-27 (a dark line at its foot, lum 34), then the rim (146, 216)
// the capsules' white top bars are narrower than the capsules (score 77-103 under a bar 80-99; clock 246-305 under 249-303: 3 px in
// from each end) and sit straight on them, a thin grey line (lum 185) between and no dark gap; the grey foot bars (y 25-26, lum
// 70-140, then 140-200 at y 27) 1.5 px in from each end
// the grain: dark and light lines every 2 px across the bar (lum 25 / 45 alternating), stronger than ours was
// letters, capsules, period and clock: sizes and places match (TOR 118-154 on air, 119-154 ours; caps 12 px on both)
// the capsules' figures: 12 px tall on air (0.8 of the capsule) and heavy, ours were 10.4 px and bold: now 12 px, heaviest weight;
// each capsule ringed by a thin dark line as on air
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 1180 / 454, H = Math.round(27 * K);
const C = { end: 21, tm: 169, s: 68, pd: 122, ck: 153, mk: 346 }, GAP = 4;
const W = 2 * C.end + 2 * (C.tm + C.s) + C.pd + C.ck + C.mk + 8 * GAP + 6;
const CAP = 13 * K, PX = Math.round(CAP / 0.7109), IN = Math.round(3 * K), INB = Math.round(2 * K);
const PRE = 2 * 30 + 24 + 40;

export default {
  id: 'nhl-sn-11',
  size: { w: W, h: H },
  // before the game the period goes (the start time stands in the clock's capsule, a little wider and set off from the last score
  // capsule, and the score capsules widen for the records: PRE extra); after it the clock's capsule goes and FINAL takes the
  // clock's width (FINAL/OT touched the last score capsule in the period's narrower place)
  sizeFor: (g) => (g.status === 'pre' ? { w: W - C.pd - GAP + PRE, h: H } : g.status === 'final' ? { w: W - C.pd - GAP, h: H } : { w: W, h: H }),
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-sn-11 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* the grey metal frame round the dark bar */
.sb-nhl-sn-11 .fr { position: absolute; inset: 0; border-radius: 4px; background: linear-gradient(#5d5f63 0, #5d5f63 3.7%, #cfd1d4 3.7%, #f4f5f6 11%, #8d9093 45%, #5a5c5f 55%, #929496 92.6%, #d8d9db 100%); box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-sn-11 .row { position: absolute; left: ${C.end}px; right: ${C.end}px; top: ${IN}px; bottom: ${INB}px; display: flex; align-items: center; gap: ${GAP}px; padding: 0 3px;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,.065) 0 ${K.toFixed(2)}px, transparent ${K.toFixed(2)}px ${(2 * K).toFixed(2)}px),
    linear-gradient(#8a878a 0%, #7a777a 10%, #524f52 15%, #737073 19%, #6d6a6d 22%, #2a282b 27%, #141215 40%, #1a181b 78%, #2e2d30 82%, #464548 88%, #333335 95%, #1f1f21);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.6); }
.sb-nhl-sn-11 .row > * { flex: none; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; }
/* the chrome end caps: blue-tinted, white along the top, a dark band low down, a bright streak down the middle */
.sb-nhl-sn-11 .cy { position: absolute; top: ${Math.round(1 * K)}px; bottom: ${Math.round(1.5 * K)}px; width: ${C.end - 4}px; border-radius: 6px;
  background: linear-gradient(90deg, rgba(40,50,60,.25), rgba(255,255,255,.6) 32%, rgba(255,255,255,0) 58%, rgba(30,40,50,.28)),
    linear-gradient(#f8fcff 0%, #eff5f9 16%, #c2cad0 22%, #98a6af 32%, #a6b9c5 50%, #9bb7cb 64%, #8ea0ae 72%, #4b4f5a 80%, #727580 86%, #b2b3b9 91%, #e2e1e6 96%, #c2bfc2); }
.sb-nhl-sn-11 .cy.l { left: 2px; } .sb-nhl-sn-11 .cy.r { right: 2px; }
.sb-nhl-sn-11 .tm { width: ${C.tm}px; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
/* the white capsules: black figures, rounded ends; a white bar over each and a grey bar under it, as wide as the capsule */
.sb-nhl-sn-11 .s, .sb-nhl-sn-11 .ck { position: relative; height: ${Math.round(15 * K)}px; margin-top: ${Math.round(0.4 * K)}px; color: #111; border-radius: ${Math.round(4.5 * K)}px; background: linear-gradient(#ffffff, #f0f0f2 50%, #d4d4d8); box-shadow: inset 0 -2px 2px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.5); }
.sb-nhl-sn-11 .s::before, .sb-nhl-sn-11 .ck::before, .sb-nhl-sn-11 .s::after, .sb-nhl-sn-11 .ck::after { content: ''; position: absolute; }
.sb-nhl-sn-11 .s::before, .sb-nhl-sn-11 .ck::before { left: ${Math.round(3 * K)}px; right: ${Math.round(3 * K)}px; top: -${Math.round(3.4 * K)}px; height: ${Math.round(3.4 * K)}px; background: linear-gradient(#ffffff, #f8f8f9 70%, #bdbdbf 86%, #a9a9ab); }
.sb-nhl-sn-11 .s::after, .sb-nhl-sn-11 .ck::after { left: ${Math.round(1.5 * K)}px; right: ${Math.round(1.5 * K)}px; top: 100%; height: ${Math.round(3.1 * K)}px; background: linear-gradient(#6e6e70, #8a8a8c 45%, #b9b9bb 72%, #c9c9cb); }
/* figures 0.8 of the capsule's height, heavy (the frame's 0 and 10:21 are 12 px tall in its 15 px capsule) */
.sb-nhl-sn-11 .s, .sb-nhl-sn-11 .ck { font-size: ${Math.round(PX * 0.97)}px; font-weight: 900; }
.sb-nhl-sn-11 .s { width: ${C.s}px; } .sb-nhl-sn-11 .ck { width: ${C.ck}px; } .sb-nhl-sn-11 .pd { width: ${C.pd}px; }
.sb-nhl-sn-11 .mk { width: ${C.mk}px; } .sb-nhl-sn-11 .mk .sb-ha { color: #f2f2f2; }
.sb-nhl-sn-11 .w { font-size: ${PX * 0.62}px; }
.sb-nhl-sn-11 .pd.w { width: ${C.ck}px; padding: 0 8px; box-sizing: border-box; }
.sb-nhl-sn-11 .row.pre .s { width: ${C.s + 30}px; } .sb-nhl-sn-11 .row.pre .ck { width: ${C.ck + 40}px; margin-left: 24px; }
.sb-nhl-sn-11 .s > span { max-width: 88%; } .sb-nhl-sn-11 .s > .n3 { font-size: ${PX * 0.64}px; }
/* three-figure scores: both score capsules a little wider (taken from the empty room round the logo at the right end) and the figures
 near their usual size, squeezed sideways if need be (they were drawn at 0.64) */
.sb-nhl-sn-11 .row.wide .s { width: ${C.s + 24}px; } .sb-nhl-sn-11 .row.wide .mk { width: ${C.mk - 48}px; }
.sb-nhl-sn-11 .row.wide .s > .n3 { font-size: ${Math.round(PX * 0.84)}px; min-width: 0 !important; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.append(el('div', 'fr'), el('i', 'cy l'), el('i', 'cy r'));
    const row = el('div', 'row' + (g.status === 'pre' ? ' pre' : ''));
    if (g.status !== 'pre' && [g.away, g.home].some((t) => String(t.score == null ? '' : t.score).length > 2)) row.classList.add('wide');
    [g.away, g.home].forEach((t) => {
      row.appendChild(fit(el('div', 'tm', (t.abbr || '').toUpperCase())));
      const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : '';
      const s = el('div', 's'); const n = scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g); s.appendChild(v.length > 2 ? fit(n) : n); row.appendChild(s);
    });
    const per = g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase();
    if (g.status !== 'pre') row.appendChild(live ? el('div', 'pd', per) : fit(el('div', 'pd w', statusText(g, time))));
    // after the game FINAL stands in the period's place and the clock's capsule goes
    if (g.status !== 'final') row.appendChild(el('div', 'ck' + (live ? '' : ' w'), live ? g.clock || '' : statusText(g, time)));
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(30 * K * 0.6))); row.appendChild(mk);
    root.appendChild(row);
  },
};
