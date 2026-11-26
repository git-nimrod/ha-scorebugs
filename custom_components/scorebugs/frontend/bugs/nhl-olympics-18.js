// "Teal pills '18": after NBC's Olympic hockey bug (PyeongChang 2018; frame: Canada v Germany). Three dark teal rounded rows stacked: each
// team's letters in gold, its badge in a flag-sized white box (here the team's logo, where the broadcast had the country's flag) and its
// score in white; under them a white pill with the clock and the period beside it. The power-play row is left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

const W = 520, H = 360, ROW = 104, GAP = 14;
// type to the frame's size against its row: letters 57 % of the row's height (were 42 %), scores 70 % (were 47 %), the clock and
// period about 58 % (were 36 %)
const ABBR_PX = 78, SCORE_PX = 98, CLOCK_PX = 100;

export default {
  id: 'nhl-olympics-18',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the rows end after the badge and the bar is narrower
  sizeFor: (g) => (noRec(g) ? { w: 340, h: H } : { w: W, h: H }),
  fonts: [FONTS.barlowCond500],
  css: `
.sb-nhl-olympics-18 { font-family: 'SB Barlow Condensed', 'Arial', sans-serif; font-weight: 600; font-stretch: 90%; color: #f4f6f6; }
.sb-nhl-olympics-18 { font-weight: 500; font-stretch: 100%; }   /* face: Barlow Condensed 500 (low confidence) */
.sb-nhl-olympics-18 .st { position: absolute; inset: 0; display: grid; grid-template-rows: ${ROW}px ${ROW}px 1fr; gap: ${GAP}px; }
.sb-nhl-olympics-18 .r { display: flex; align-items: center; gap: 18px; padding: 0 30px 0 24px; border-radius: 18px; box-sizing: border-box;
  background: linear-gradient(#053139, #02272e); box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 0 0 2px rgba(74,128,136,.5); }   /* flat dark teal, a thin lighter rim (frame) */
.sb-nhl-olympics-18 .ab { width: 130px; color: #e4b93c; font-size: ${ABBR_PX}px; line-height: 1; }
.sb-nhl-olympics-18 .fl { width: 128px; height: 80px; display: grid; place-items: center; background: #f4f4f4; box-shadow: 0 1px 3px rgba(0,0,0,.5); }
.sb-nhl-olympics-18 .fl .sb-logo { width: 104px; height: 68px; object-fit: contain; }
.sb-nhl-olympics-18 .sc { flex: 1; text-align: center; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nhl-olympics-18 .lo { display: flex; align-items: center; gap: 24px; padding-right: 30px; border-radius: 18px; box-sizing: border-box;
  background: linear-gradient(#073a40, #04313a); box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 0 0 2px rgba(74,128,136,.5); font-size: ${CLOCK_PX}px; line-height: 1; }
.sb-nhl-olympics-18 .ck { width: 266px; align-self: stretch; margin: 8px 0 8px 8px; display: grid; place-items: center; border-radius: 16px; background: linear-gradient(#f6f8fa, #e4e8ec); color: #1d1f20; box-shadow: 0 0 0 2px #0f1a1c, inset 0 0 0 2px rgba(255,255,255,.7); }   /* a white pill set inside the row, a dark edge (frame) */
.sb-nhl-olympics-18 .pd { flex: 1; text-align: center; text-transform: uppercase; }
.sb-nhl-olympics-18 .pd .sb-ord { font-size: .8em; }
.sb-nhl-olympics-18 .w { flex: 1; text-align: center; font-size: ${CLOCK_PX * 0.7}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const r = el('div', 'r'), fl = el('span', 'fl'); fl.appendChild(logo(t, 104));
      r.append(el('span', 'ab', (t.abbr || '').toUpperCase()), fl);
      if (!noRec(g)) r.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      st.appendChild(r);
    });
    const lo = el('div', 'lo');
    if (live) { const pd = el('span', 'pd'); pd.appendChild(ordinal(g.period)); lo.append(el('span', 'ck', g.clock || ''), pd); }
    else lo.appendChild(el('span', 'w', statusText(g, time)));
    st.appendChild(lo);
    root.appendChild(st);
  },
};
