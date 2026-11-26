// "Navy panel '10": after NBC's Olympic hockey bug (Vancouver 2010; frame: Finland v China). A deep navy panel: each team's letters, its
// badge in a flag-sized box (here the team's logo, where the broadcast had the country's flag) and its score; under them a white box with
// the clock and the period beside it. The power-play line at the right is left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

const W = 460, H = 330, ROW = 98;
// type as on air: capitals about 0.18 of the panel's height, the score and the clock about 0.25, very narrow
const ABBR_PX = 82, SCORE_PX = 104, LOW_PX = 96;

export default {
  id: 'nhl-olympics-10',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the panel ends after the badges and is narrower
  sizeFor: (g) => (noRec(g) ? { w: 300, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-olympics-10 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 600; font-stretch: 80%; color: #f4f6fb; }
.sb-nhl-olympics-10 { font-weight: 600; font-stretch: 62%; }   /* face: Archivo 600 at 68% width (low confidence) */
.sb-nhl-olympics-10 .bx { position: absolute; inset: 0; display: grid; grid-template-rows: ${ROW}px ${ROW}px 1fr; padding: 10px 14px 14px; box-sizing: border-box; border-radius: 0 8px 8px 0;
  background: linear-gradient(90deg, #1b1c6e, #24267f 60%, #1b1c6e); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-olympics-10 .r { display: flex; align-items: center; gap: 14px; }
.sb-nhl-olympics-10 .ab { width: 112px; font-size: ${ABBR_PX}px; line-height: 1; }
.sb-nhl-olympics-10 .fl { width: 124px; height: 76px; display: grid; place-items: center; background: #f4f4f4; }
.sb-nhl-olympics-10 .fl .sb-logo { width: 104px; height: 66px; object-fit: contain; }
.sb-nhl-olympics-10 .sc { flex: 1; text-align: center; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nhl-olympics-10 .lo { display: flex; align-items: center; gap: 22px; margin-top: 6px; font-size: ${LOW_PX}px; line-height: 1; }
.sb-nhl-olympics-10 .ck { width: 230px; align-self: stretch; display: grid; place-items: center; border-radius: 6px; background: linear-gradient(#ffffff, #dfe1e6); color: #111426; box-shadow: inset 0 0 0 3px #b9bdd0; }
.sb-nhl-olympics-10 .pd { text-transform: uppercase; } .sb-nhl-olympics-10 .pd .sb-ord { font-size: .85em; }
.sb-nhl-olympics-10 .w { flex: 1; text-align: center; font-size: ${LOW_PX * 0.6}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t) => {
      const r = el('div', 'r'), fl = el('span', 'fl'); fl.appendChild(logo(t, 104));
      r.append(el('span', 'ab', (t.abbr || '').toUpperCase()), fl);
      if (!noRec(g)) r.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(r);
    });
    const lo = el('div', 'lo');
    if (live) { const pd = el('span', 'pd'); pd.appendChild(ordinal(g.period)); lo.append(el('span', 'ck', g.clock || ''), pd); }
    else lo.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(lo);
    root.appendChild(bx);
  },
};
