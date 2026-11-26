// "Navy boxes '02": after NBC's Olympic hockey bug (Salt Lake City 2002; frame: USA v Canada). Each team's badge in a box with its letters
// spaced out underneath (here the team's logo, where the broadcast had the country's flag) and its score on a navy box beside it; under
// them an orange box with the period and a white box with the clock. The power-play boxes at the right are left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

// surfaces (frame, upscaled): flat navy score boxes with a pale lavender band along the top, a flat orange box and a flat white one
const W = 400, H = 316, GAP = 8, FLAG = 150, ROW = 108;
// type to the frame's size against the box's width: the spaced letters 7 % (were 4 %), scores and the period and clock 16 % (were 10-13 %)
const ABBR_PX = 34, SCORE_PX = 88, LOW_PX = 78;

export default {
  id: 'nhl-olympics-02',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score (and the kit no longer puts the logos in the empty plates when the badges already show them):
  // the score plates go and the box closes up
  sizeFor: (g) => (noRec(g) ? { w: FLAG + 2 * GAP + 20, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-olympics-02 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-nhl-olympics-02 { font-weight: 700; font-stretch: 75%; }   /* face: Archivo 700 at 75% width (low confidence) */
.sb-nhl-olympics-02 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${FLAG}px 1fr; grid-template-rows: ${ROW}px ${ROW}px 1fr; gap: ${GAP}px; padding: ${GAP}px; box-sizing: border-box;
  background: #0d0d10; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-olympics-02 .fl { display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; padding-top: 6px; }
/* the badge's box fills its column's width, as the flags do on air */
.sb-nhl-olympics-02 .fl .sb-logo { width: 146px; height: 68px; object-fit: contain; background: #f2f2f2; padding: 4px; box-sizing: border-box; }
.sb-nhl-olympics-02 .fl .ab { font-size: ${ABBR_PX}px; letter-spacing: .55em; margin-right: -.55em; line-height: 1.3; color: #d8dbe2; }
.sb-nhl-olympics-02 .sc { display: grid; place-items: center; background: #282b62; box-shadow: inset 0 7px 0 #9191ad, inset 0 9px 0 #1a1d52; font-size: ${SCORE_PX}px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-nhl-olympics-02 .pd { display: grid; place-items: center; background: linear-gradient(#dea53a, #d4962b); color: #111; font-size: ${LOW_PX}px; line-height: 1; }
.sb-nhl-olympics-02 .pd .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-nhl-olympics-02 .ck { display: grid; place-items: center; background: linear-gradient(#f6f6f7, #e6e6e8); color: #111; font-size: ${LOW_PX}px; line-height: 1; }
.sb-nhl-olympics-02 .ck.w { grid-column: 1 / 3; font-size: ${LOW_PX * 0.6}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (noRec(g)) bx.style.gridTemplateColumns = '1fr';
    [g.away, g.home].forEach((t) => {
      const fl = el('span', 'fl'); fl.append(logo(t, 120), el('span', 'ab', (t.abbr || '').toUpperCase()));
      bx.appendChild(fl);
      if (!noRec(g)) bx.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
    });
    if (live) { const p = el('span', 'pd'); p.appendChild(ordinal(g.period)); bx.append(p, el('span', 'ck', g.clock || '')); }
    else { const w = el('span', 'ck w', statusText(g, time)); if (noRec(g)) w.style.gridColumn = '1'; bx.appendChild(w); }
    root.appendChild(bx);
  },
};
