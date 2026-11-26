// "Blue slants '14": after NBC's Olympic hockey bug (Sochi 2014; frame: USA v Sweden). Slanted blue tabs that fade to white along the
// bottom edge: each team's letters and its badge in a slanted box (here the team's logo, where the broadcast had the country's waving
// flag) with its score in italics; under them a white slanted tab with the clock and a blue one with the period. The power-play tab at the
// right is left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS, fit } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

// hold, measured on the frame and a 2014 still (USA v Russia): along each row the navy (#14274a) starts to
// lighten from about 45 % across and runs smoothly into the bright blue (#004893 to #004c9a, L 30) with no hard edge; the rows nearly
// touch (a 3-6 px light rim between rows about 42 px tall, about a tenth); the clock's silver runs into the navy period along a curve
// (its edge sweeps from the top right down to the left), not a straight slant.
const W = 560, H = 320, ROW = 98, GAP = 3, SKEW = -16;
// type as on air: letters about half a row tall, the score and the clock about three quarters
const ABBR_PX = 60, SCORE_PX = 84, LOW_PX = 76;
const CAP = 26;   // room kept past the score at the row's end
// each row: a lighter blue at its left end, navy, then from about 45 % across a smooth blend into the lighter blue the score sits on,
// and a thin light rim along its foot (frame, upscaled)
const ROW_BG = 'linear-gradient(90deg, #2f6091 0, #17345e 12%, #14284b 30%, #15294d 45%, #10386f 60%, #0a4a95 74%, #0058ab 88%, #0063b9)';
// loop pass 1, the same note: the period tab's navy blends into the lighter blue over its last tenth (on air the bottom
// row stays navy under 2ND and ends in a short bright-blue cap, #1e477b at its end), and the pre/final status row takes the rows' blend
const PT_BG = 'linear-gradient(90deg, #15294d 0, #16305a 80%, #123f7a 91%, #0b52a0)';
// loop pass, his note "needs gradient outlines": a 2 px outline on every row that is itself a gradient, a pale blue at the
// top easing to a mid blue at the middle and back to pale at the foot (still: the rows are ringed in light blue, brightest top and foot)
const OUT = 'linear-gradient(180deg, #b9cfe8 0, #5f87b9 45%, #3f6aa0 60%, #9dbbdc 100%)';
const ring = (fill) => fill + ' padding-box, ' + OUT + ' border-box';

export default {
  id: 'nhl-olympics-14',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the rows lose the score's room and the bar is narrower
  sizeFor: (g) => (noRec(g) ? { w: W - 110, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-nhl-olympics-14 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 82%; color: #fff; }   /* upright, condensed (frame) */
.sb-nhl-olympics-14 { font-weight: 600; font-stretch: 70%; font-style: italic; }   /* face: Archivo 600 at 70% width italic (low confidence) */
.sb-nhl-olympics-14 .st { position: absolute; inset: 4px 22px; display: grid; grid-template-rows: ${ROW}px ${ROW}px ${ROW}px; row-gap: ${GAP}px; align-content: center; }
.sb-nhl-olympics-14 .tb { display: flex; align-items: center; transform: skewX(${SKEW}deg); border-radius: 12px; box-shadow: 0 3px 6px rgba(0,0,0,.5);
  border: 2px solid transparent; background: ${ring(ROW_BG)}; line-height: 1; }
.sb-nhl-olympics-14 .tb::after { content: ''; position: absolute; left: 6px; right: 6px; bottom: 0; height: 4px; border-radius: 0 0 8px 8px; background: #cfe2f5; }
.sb-nhl-olympics-14 .tb { position: relative; overflow: hidden; }
.sb-nhl-olympics-14 .tb > * { display: inline-block; transform: skewX(${-SKEW}deg); }   /* inline-block: a transform skips plain inline boxes (the fitted status leaned) */
.sb-nhl-olympics-14 .tb > .sb-fit > span { display: inline-block; transform: skewX(${-SKEW}deg); }   /* the kit's fitting wrapper takes the text's place (and its own transform): the text inside is set upright instead */
.sb-nhl-olympics-14 .r { padding: 0 ${CAP + 6}px 0 24px; gap: 22px; }   /* the score sits just short of the bright cap (frame) */   /* the gap clears the badge's slant (the letters ran into it) */
.sb-nhl-olympics-14 .ab { width: 96px; flex: none; white-space: nowrap; font-size: ${ABBR_PX}px; text-shadow: 0 2px 2px rgba(0,0,0,.4); }
.sb-nhl-olympics-14 .fl { width: 110px; height: 60px; display: grid; place-items: center; background: #f4f4f4; transform: skewX(${SKEW - 6}deg) !important; box-shadow: 0 1px 3px rgba(0,0,0,.5); }
.sb-nhl-olympics-14 .fl .sb-logo { width: 92px; height: 52px; object-fit: contain; transform: skewX(${-SKEW + 6}deg); }
.sb-nhl-olympics-14 .sc { margin-left: auto; min-width: 1.1em; text-align: center; font-size: ${SCORE_PX}px; text-shadow: 0 2px 2px rgba(0,0,0,.4); }
.sb-nhl-olympics-14 .lo { display: grid; grid-template-columns: 250px 1fr; column-gap: 0; font-size: ${LOW_PX}px; }   /* the silver clock runs straight into the navy period (frame) */
.sb-nhl-olympics-14 .lo .pt { background: ${ring(PT_BG)}; margin-left: -150px; padding-left: 150px; }   /* the navy runs on under the silver clock (his note: it flows under the white) */
.sb-nhl-olympics-14 .lo .tb { justify-content: center; }
.sb-nhl-olympics-14 .lo .wt { background: linear-gradient(#e6edf6, #b4c2da 60%, #a9b8d2); color: #10275a; z-index: 1; border: 0; margin-right: -64px; padding-right: 64px; border-radius: 0;
  clip-path: path('M12 0 L314 0 C262 4 252 ${Math.round(ROW * 0.8)} 196 ${ROW} L12 ${ROW} Q0 ${ROW} 0 ${ROW - 12} L0 12 Q0 0 12 0 Z'); }
.sb-nhl-olympics-14 .lo .wt::after { display: none; }
.sb-nhl-olympics-14 .lo .sb-ord { font-size: .85em; }
.sb-nhl-olympics-14 .lo .w { grid-column: 1 / 3; background: ${ring(ROW_BG)}; font-size: ${LOW_PX * 0.6}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const r = el('div', 'tb r'), fl = el('span', 'fl'); fl.appendChild(logo(t, 92));
      r.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), fl);
      if (!noRec(g)) r.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      st.appendChild(r);
    });
    const lo = el('div', 'lo');
    if (live) {
      const ck = el('span', 'tb wt'); ck.appendChild(el('span', '', g.clock || ''));
      const pd = el('span', 'tb pt'); const p = el('span', ''); p.appendChild(ordinal(g.period)); pd.appendChild(p);
      lo.append(ck, pd);
    } else { const w = el('span', 'tb w'); w.appendChild(el('span', '', statusText(g, time))); lo.appendChild(w); }
    st.appendChild(lo);
    root.appendChild(st);
  },
};
