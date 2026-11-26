// "Teal panel '26": after NBC's Olympic hockey bug (Milan Cortina 2026; frame: Sweden v Germany). A teal see-through panel: each team's
// letters, its badge in a flag-sized box (here the team's logo, where the broadcast had the country's flag) and its score, and a darker
// column at the right with the clock over the period. The shots column
// and the power-play line are left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS, fit } from '../kit.js';

const TAB = 0, W = 560, H = 230, ROW = 96;  // no title tab over the panel
const ABBR_PX = 52, SCORE_PX = 56, RT_PX = 46;
// the panel a bluer teal and its score and clock columns darker, as measured on the frame (panel about 13,69,80; columns 7,46,53 and
// 7,49,58)
const SC_W = 96;   // the score's darker column (frame: a darker block behind the scores, panel top to bottom)

export default {
  id: 'nhl-olympics-26',
  size: { w: W, h: H },
  // before the face-off there is no score: its column goes and the panel closes up on the clock column
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - SC_W, h: H } : { w: W, h: H }),   // records keep the column
  // measured against the frame by the automatic audit: text -35% vs the broadcast; 80 % of the correction
  typeScale: 1.067,
  fonts: [FONTS.saira],
  css: `
.sb-nhl-olympics-26 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 500; color: #eef6f5; }
.sb-nhl-olympics-26 .pn { position: absolute; inset: ${TAB}px 0 0 0; display: grid; grid-template-columns: 1fr 170px; column-gap: 0; grid-template-rows: ${ROW}px ${ROW}px; row-gap: 6px; padding: 12px 12px 12px 22px; box-sizing: border-box;
  border-radius: 10px; background: linear-gradient(rgba(20,86,100,.92), rgba(8,58,70,.92)); box-shadow: 0 3px 8px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.18); }
.sb-nhl-olympics-26 .r { display: flex; align-items: center; gap: 18px; }
.sb-nhl-olympics-26 .ab { width: 104px; flex: none; white-space: nowrap; font-size: ${ABBR_PX}px; line-height: 1; }   /* four letters (UTAH) fit their room (team sweep) */
.sb-nhl-olympics-26 .fl { width: 118px; height: 72px; display: grid; place-items: center; background: #f4f4f4; box-shadow: 0 0 0 2px rgba(0,0,0,.35); }
.sb-nhl-olympics-26 .fl .sb-logo { width: 100px; height: 62px; object-fit: contain; }
.sb-nhl-olympics-26 .sc { flex: none; width: ${SC_W}px; align-self: stretch; display: grid; place-items: center; font-size: ${SCORE_PX}px; line-height: 1; background: rgba(0,20,26,.5); }
.sb-nhl-olympics-26 .r.a .sc { margin: -12px 0 -3px; } .sb-nhl-olympics-26 .r.h .sc { margin: -3px 0 -12px; }   /* one dark block from the panel's top to its foot (frame) */
.sb-nhl-olympics-26 .rt { grid-column: 2; display: grid; place-items: center; background: rgba(0,20,26,.55); font-size: ${RT_PX}px; line-height: 1; }
.sb-nhl-olympics-26 .rt .sb-ord { font-size: .8em; text-transform: uppercase; }
.sb-nhl-olympics-26 .rt.w { grid-row: 1 / 3; font-size: ${RT_PX * 0.6}px; padding: 0 12px; text-align: center; }   /* a long start time kept off the column's edges */
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const pn = el('div', 'pn');
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r ' + (i ? 'h' : 'a')), fl = el('span', 'fl'); fl.appendChild(logo(t, 100)); r.style.gridRow = String(i + 1);
      r.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), fl);
      if (g.status !== 'pre') r.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (g.away.record && g.home.record) { const rc = el('span', 'sc', t.record); rc.style.fontSize = Math.round(SCORE_PX * (t.record.length > 4 ? 0.32 : 0.42)) + 'px'; r.appendChild(rc); }  // records before the game, every time
      pn.appendChild(r);
    });
    if (live) {
      const ck = el('span', 'rt', g.clock || ''); ck.style.gridRow = '1';
      const pd = el('span', 'rt'); pd.style.gridRow = '2'; pd.appendChild(ordinal(g.period));
      pn.append(ck, pd);
    } else pn.appendChild(el('span', 'rt w', statusText(g, time)));
    root.appendChild(pn);
  },
};
