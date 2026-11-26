// "Slant tabs '06": after NBC's Olympic hockey bug (Turin 2006; frame: USA v Sweden). Slanted tabs edged in navy: each team's badge with its
// letters spaced out underneath (here the team's logo, where the broadcast had the country's flag) and its score in italics on a silver
// tab; under them a silver tab with the clock and a blue one with the period. The power-play tabs at the right are left out (no data).
import { el, logo, statusText, scoreSlot, FONTS } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

// STEP: each row sits further left than the one above, so the stack leans like its tabs (frame: about a third of the row pitch)
const W = 600, H = 300, ROW = 82, GAP = 10, FLAG = 210, SKEW = -14, STEP = 30;
const ABBR_PX = 22, SCORE_PX = 62, LOW_PX = 54;

export default {
  id: 'nhl-olympics-06',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the score tabs go and the bar closes up on the badges
  sizeFor: (g) => (noRec(g) ? { w: 310 + 2 * STEP, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-nhl-olympics-06 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-style: italic; color: #fff; }
.sb-nhl-olympics-06 { font-weight: 800; font-stretch: 112%; font-style: italic; }   /* face: Archivo 800 at 112% width italic (low confidence) */
.sb-nhl-olympics-06 .st { position: absolute; inset: 6px 20px 6px 20px; display: grid; grid-template-rows: ${ROW}px ${ROW}px ${ROW}px; row-gap: ${GAP}px; align-content: center; }
.sb-nhl-olympics-06 .st > :nth-child(1) { margin-left: ${2 * STEP}px; }
.sb-nhl-olympics-06 .st > :nth-child(2) { margin-left: ${STEP}px; margin-right: ${STEP}px; }
.sb-nhl-olympics-06 .st > :nth-child(3) { margin-right: ${2 * STEP}px; }
.sb-nhl-olympics-06 .r { display: grid; grid-template-columns: ${FLAG}px 1fr; column-gap: 8px; }
.sb-nhl-olympics-06 .fl { position: relative; isolation: isolate; display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: end; }
.sb-nhl-olympics-06 .fl::before { content: ''; position: absolute; inset: -4px -4px -4px 0; z-index: -1; transform: skewX(${SKEW}deg); border-radius: 6px;
  background: linear-gradient(#1b1d2a, #0a0b12); box-shadow: 0 2px 5px rgba(0,0,0,.5); }   /* the dark slanted band behind each badge and its letters (frame) */
.sb-nhl-olympics-06 .fl .sb-logo { width: 150px; height: 52px; object-fit: contain; background: #f2f2f2; transform: skewX(${SKEW}deg); box-shadow: 0 1px 3px rgba(0,0,0,.6); }
.sb-nhl-olympics-06 .fl .ab { font-size: ${ABBR_PX}px; font-style: normal; letter-spacing: .5em; margin-right: -.5em; line-height: 1.25; text-shadow: 0 1px 2px #000; }
.sb-nhl-olympics-06 .tb { display: grid; place-items: center; transform: skewX(${SKEW}deg); border-radius: 8px; border: 4px solid #1c2c78; box-shadow: 0 3px 6px rgba(0,0,0,.5);
  background: linear-gradient(#f6f7f9, #b9bdc6 55%, #9097a3); color: #10103a; line-height: 1; }   /* figures in a near-black navy (frame) */
.sb-nhl-olympics-06 .tb > span { display: inline-block; transform: skewX(${-SKEW}deg); }
.sb-nhl-olympics-06 .tb > .sb-fit > span { display: inline-block; transform: skewX(${-SKEW}deg); }   /* the kit's fitting wrapper takes the text's place (and its own transform): the text inside is set upright instead */
.sb-nhl-olympics-06 .sc { font-size: ${SCORE_PX}px; position: relative; left: -6px; }   /* the italic leans right: pulled back so the ink sits centred */
.sb-nhl-olympics-06 .lo { display: grid; grid-template-columns: 2fr 1fr; column-gap: 6px; font-size: ${LOW_PX}px; }
.sb-nhl-olympics-06 .lo .bl { background: linear-gradient(#4a72e0, #1f3fa8 60%, #18318a); color: #fff; }
.sb-nhl-olympics-06 .lo .w { grid-column: 1 / 3; font-size: ${LOW_PX * 0.6}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const r = el('div', 'r'), fl = el('span', 'fl'); fl.append(logo(t, 150), el('span', 'ab', (t.abbr || '').toUpperCase()));
      const tb = el('span', 'tb'); tb.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      r.append(fl); if (!noRec(g)) r.appendChild(tb); st.appendChild(r);
    });
    const lo = el('div', 'lo'), tab = (cls, text) => { const b = el('span', 'tb ' + cls); b.appendChild(el('span', '', text)); return b; };
    if (live) lo.append(tab('', g.clock || ''), tab('bl', g.period.word ? g.period.label : String(g.period.label || '')));
    else lo.appendChild(tab('w', statusText(g, time)));
    if (noRec(g)) lo.style.gridTemplateColumns = '1fr';
    st.appendChild(lo);
    root.appendChild(st);
  },
};
