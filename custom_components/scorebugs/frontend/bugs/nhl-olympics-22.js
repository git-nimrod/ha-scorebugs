// "Pale rows '22": after NBC's Olympic hockey bug (Beijing 2022; frame: Finland v USA). Pale blue-grey rows with dark navy type: each team's
// letters, its badge in a flag-sized box (here the team's logo, where the broadcast had the country's flag) and its score; under them a
// pale box with the clock and a navy one with the period. The power-play bar at the right is left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS, fit } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

// the jersey-colour tab the broadcast shows at each row's left end is left out
// panel about 1.25 times as wide as tall; letters, score and clock all about half a row tall, in a narrow cut
const W = 412, H = 330, ROW = 96, GAP = 10;
const ABBR_PX = 62, SCORE_PX = 62, LOW_PX = 62;

export default {
  id: 'nhl-olympics-22',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the rows end after the badge and the bar is narrower
  sizeFor: (g) => (noRec(g) ? { w: 292, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -30% vs the broadcast, logos -10%; 80 % of the correction
  typeScale: 1.044, logoScale: 1.09,
  fonts: [FONTS.openSans],
  css: `
.sb-nhl-olympics-22 { font-family: 'SB Open Sans', 'Arial', sans-serif; font-weight: 500; color: #1a2a6c; }
.sb-nhl-olympics-22 { font-weight: 500; font-stretch: 78%; }   /* face: Open Sans 500 (medium confidence) */
.sb-nhl-olympics-22 .st { position: absolute; inset: 0; display: grid; grid-template-rows: ${ROW}px ${ROW}px 1fr; row-gap: ${GAP}px; }
.sb-nhl-olympics-22 .r { display: flex; align-items: center; gap: 12px; padding: 0 32px 0 24px; background: linear-gradient(#d4deef, #c4d0e4); box-shadow: 0 2px 6px rgba(0,0,0,.35); }
.sb-nhl-olympics-22 .ab { width: 104px; flex: none; white-space: nowrap; font-size: ${ABBR_PX}px; line-height: 1; }   /* four letters (UTAH) fit their room (team sweep) */
.sb-nhl-olympics-22 .fl { width: 120px; height: 70px; display: grid; place-items: center; background: #ffffff; box-shadow: 0 0 0 1px #9aa8c4; }
.sb-nhl-olympics-22 .fl .sb-logo { width: 100px; height: 60px; object-fit: contain; }
.sb-nhl-olympics-22 .sc { flex: 1; text-align: right; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nhl-olympics-22 .lo { display: grid; grid-template-columns: 59fr 41fr; font-size: ${LOW_PX}px; line-height: 1; box-shadow: 0 2px 6px rgba(0,0,0,.35); }   /* the clock and the period run to the right end (frame) */
.sb-nhl-olympics-22 .ck { display: grid; place-items: center; background: linear-gradient(#d4deef, #c4d0e4); border-radius: 5px 0 0 5px; }
.sb-nhl-olympics-22 .pd { display: grid; place-items: center; background: linear-gradient(#22348c, #172569); color: #e9eefa; text-transform: uppercase; } .sb-nhl-olympics-22 .pd .sb-ord { font-size: .85em; }
.sb-nhl-olympics-22 .w { grid-column: 1 / 3; display: grid; place-items: center; background: linear-gradient(#d4deef, #c4d0e4); border-radius: 5px 0 0 5px; font-size: ${LOW_PX * 0.6}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      const r = el('div', 'r'), fl = el('span', 'fl'); fl.appendChild(logo(t, 100));
      r.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), fl);
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
