// "White tag '96": after ESPN's NHL bug (1995-97; frame: Avalanche at Red Wings). A dark box: a white tag across the top where the network's
// wordmark sat (here the Home Assistant logo), each team's letters and score below it, and a column at the right with the period over the
// clock.
import { el, ordinal, statusText, scoreSlot, haMark, marks, FONTS, fit } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

// the score sits well right of the letters, just before the clock column; the clock about the letters' size
const W = 600, H = 210, TAG = 62, LEFT = 400, PX = 54, PRE_CUT = 160;

export default {
  id: 'nhl-espn-96',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the letters' side loses the score's room and the box is narrower
  sizeFor: (g) => (noRec(g) ? { w: W - PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -27% vs the broadcast; 80 % of the correction
  typeScale: 1.289,
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-espn-96 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #f2f2f2; text-shadow: 2px 2px 0 rgba(0,0,0,.6); }
.sb-nhl-espn-96 { font-weight: 700; font-stretch: 115%; }   /* face: Archivo 700 at 115% width (low confidence) */
.sb-nhl-espn-96 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LEFT}px 1fr; grid-template-rows: ${TAG}px 1fr 1fr; background: rgba(26,26,30,.9); box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-nhl-espn-96 .tag { margin: 6px 10px 2px 34px; display: grid; place-items: center start; padding-left: 14px; background: linear-gradient(#ffffff, #d9dadd); border: 2px solid #555; }
.sb-nhl-espn-96 .tag .sb-ha { color: #1b1b1d; }
.sb-nhl-espn-96 .ln { display: flex; justify-content: space-between; align-items: center; padding: 0 8px 0 30px; font-size: ${PX}px; line-height: 1; }
.sb-nhl-espn-96 .pd { display: grid; place-items: center end; padding-right: 22px; font-size: ${PX * 0.9}px; line-height: 1; } .sb-nhl-espn-96 .pd .sb-ord { font-size: .85em; text-transform: lowercase; }
/* a five-character clock (19:51, 12:00) squeezes into its column, the same room each side */
.sb-nhl-espn-96 .ck { grid-row: 2 / 4; display: grid; place-items: center; font-size: ${PX}px; line-height: 1; min-width: 0; padding: 0 10px; box-sizing: border-box; }
.sb-nhl-espn-96 .ck.w { grid-row: 1 / 4; font-size: ${PX * 0.55}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (noRec(g)) bx.style.gridTemplateColumns = (LEFT - PRE_CUT) + 'px 1fr';
    const tag = el('span', 'tag'); if (marks(opts).ha) tag.appendChild(haMark(38));
    bx.appendChild(tag);
    if (live) { const p = el('span', 'pd'); p.appendChild(ordinal(g.period)); bx.appendChild(p); }
    [g.away, g.home].forEach((t, i) => {
      const ln = el('div', 'ln'); ln.style.cssText = 'grid-column:1;grid-row:' + (i + 2);
      // four letters (UTAH) squeeze into their room; they pushed the score under the clock panel
      ln.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      if (!noRec(g)) ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    const ck = el('span', live ? 'ck' : 'ck w', live ? g.clock || '' : statusText(g, time)); ck.style.gridColumn = '2';
    if (live) fit(ck);
    bx.appendChild(ck);
    root.appendChild(bx);
  },
};
