// "Grey slants '08": after TSN's NHL score bar of the late 2000s. A grey metal bar holding a row of glossy
// plates leaning forward: each team's logo and letters on a silver plate, its score on a black one, the period on silver, the clock
// on black, and the network's plate in red at the right end (here the Home Assistant logo on the red plate).
// measured (crop px of 462 x 29): plates 18 px tall inside the 29 px bar (inset 6 top, 5 foot), lean about 20 deg; team 5-90, score
// 90-133, team 135-218, score 218-260, period 260-318, clock 318-385, network 385-455; every plate washed light over its top half.
// the grey gaps between the plates measured across the lean at mid-height are 3.5-4 px
// (lum 100-125 between plates at 180-210 and 40-50: x 89-92, 133-137, 218-221, 261-264, 317-320, 387-389), 0.13 of the height; they
// were 1.6 px: now 3.9.
// the metal bar's two ends lean with the plates (20 deg, top to the
// right: 27 px across the bar's height) where they were square; on the crop the light rim at the right end leans the same way. The
// plates move 10 px further in from each end so the first and last keep the frame's 5 px of metal beside them.
import { el, logo, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 1180 / 462, H = Math.round(29 * K);
const PW = { tm: 214, s: 108, pd: 146, ck: 170, mk: 176 }, GAP = 10, PAD = 24;
const W = PAD * 2 + 2 * (PW.tm + PW.s) + PW.pd + PW.ck + PW.mk + 6 * GAP;
const PH = Math.round(18 * K), TOP = Math.round(6 * K);
const CAP = 10 * K, PX = Math.round(CAP / 0.7109);
const LEAN = Math.round(Math.tan(20 * Math.PI / 180) * H);

export default {
  id: 'nhl-tsn-08',
  size: { w: W, h: H },
  // before the game the period's plate goes (the start time stands on the clock's); after it the clock's plate goes beside FINAL
  // (the start time's plate 40 px wider than the clock's, so it clears the leaning ends)
  sizeFor: (g) => (g.status === 'final' ? { w: W - PW.ck - GAP, h: H } : g.status === 'pre' ? { w: W - PW.pd - GAP + 40, h: H } : { w: W, h: H }),
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-tsn-08 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; color: #f2f2f2; }
/* the grey metal bar, darker rim (measured #838589 across the middle, #605e5d at the ends), its ends leaning with the plates */
.sb-nhl-tsn-08 .bg { position: absolute; top: 0; bottom: 0; left: ${LEAN / 2}px; right: ${LEAN / 2}px; transform: skewX(-20deg);
  background: linear-gradient(#a3a5a9, #84868a 45%, #6a6c70 55%, #7d7f83); box-shadow: inset 0 0 0 2px #55575b, 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-tsn-08 .row { position: absolute; inset: 0; display: flex; gap: ${GAP}px; padding: ${TOP}px ${PAD}px ${H - TOP - PH}px; box-sizing: border-box; }
.sb-nhl-tsn-08 .p { flex: none; transform: skewX(-20deg); display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 1px 2px rgba(0,0,0,.45); }
.sb-nhl-tsn-08 .p > * { transform: skewX(20deg); }
/* silver plates (dark letters) and black ones (white figures), both washed light over the top half */
.sb-nhl-tsn-08 .lt { background: linear-gradient(#ffffff, #e2e3e5 46%, #b9bbbf 54%, #d6d7da); color: #1d1e20; }
.sb-nhl-tsn-08 .dk { background: linear-gradient(#5d5f63, #303236 46%, #121315 54%, #26282c); }
.sb-nhl-tsn-08 .rd { background: linear-gradient(#c8384c, #9e1426 46%, #760a1a 54%, #8a1022); }
.sb-nhl-tsn-08 .tm { width: ${PW.tm}px; justify-content: space-between; padding: 0 22px 0 16px; box-sizing: border-box; }
.sb-nhl-tsn-08 .tm .sb-logo { width: 64px; height: 40px; object-fit: contain; flex: none; }
/* the team letters a medium weight, as on air (the figures stay bold) */
.sb-nhl-tsn-08 .tm span { font-size: ${PX}px; font-weight: 500; white-space: nowrap; min-width: 0; }
.sb-nhl-tsn-08 .s { width: ${PW.s}px; font-size: ${PX * 1.1}px; } .sb-nhl-tsn-08 .pd { width: ${PW.pd}px; font-size: ${PX}px; font-weight: 500; }
.sb-nhl-tsn-08 .ck { width: ${PW.ck}px; font-size: ${PX * 1.05}px; white-space: nowrap; } .sb-nhl-tsn-08 .mk { width: ${PW.mk}px; } .sb-nhl-tsn-08 .mk .sb-ha { color: #fff; }
/* the start time or FINAL (class st: the kit squeezes any .w box itself, which here would undo the plate's counter-slant) */
.sb-nhl-tsn-08 .st { font-size: ${PX * 0.76}px; } .sb-nhl-tsn-08 .ck.st { width: ${PW.ck + 40}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    root.appendChild(el('i', 'bg'));
    // the text sits one span deeper than the counter-slant, so the kit's squeeze of a long status never undoes it
    const plate = (cls, child) => { const p = el('div', 'p ' + cls); const s = el('span'); s.style.cssText = 'display:flex;align-items:center;gap:12px;min-width:0;max-width:100%'; if (child) { const t = el('span'); t.style.display = 'inline-block'; t.appendChild(child); s.appendChild(t); } p.appendChild(s); return p; };
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'p lt tm');
      tm.append(logo(t, 64), fit(el('span', '', (t.abbr || '').toUpperCase())));
      row.appendChild(tm);
      const s = el('div', 'p dk s'); s.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      row.appendChild(s);
    });
    const per = g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase();
    if (g.status !== 'pre') row.appendChild(plate('lt pd' + (live ? '' : ' st'), document.createTextNode(live ? per : statusText(g, time))));
    if (g.status !== 'final') row.appendChild(plate('dk ck' + (live ? '' : ' st'), document.createTextNode(live ? g.clock || '' : statusText(g, time))));
    row.appendChild(plate('rd mk', marks(opts).ha ? haMark(Math.round(PH * 0.72)) : null));
    root.appendChild(row);
  },
};
