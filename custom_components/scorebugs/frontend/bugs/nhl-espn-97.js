// "Black tab '97": after ESPN's NHL bug (1997-98; frame: Sabres at Capitals). A light frame: a white strip at the top where the network's
// wordmark sat (here the Home Assistant logo) with a black tab for the period at the right; then a dark panel with each team's letters
// and score and the clock in large type beside them. The note strip under it (shots on the power play) is left out (no data).
import { el, ordinal, statusText, scoreSlot, haMark, marks, FONTS, fit } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

// a wider frame (nearly three times as wide as tall), a taller white strip, the score well clear of the letters
const W = 600, H = 210, TOP = 72, LEFT = 348, PX = 52, PRE_CUT = 110;

export default {
  id: 'nhl-espn-97',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the letters' panel loses the score's room and the frame is narrower
  sizeFor: (g) => (noRec(g) ? { w: W - PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -30% vs the broadcast; 80 % of the correction
  typeScale: 1.35,
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-espn-97 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #f2f2f2; }
.sb-nhl-espn-97 { font-weight: 700; font-stretch: 112%; }   /* face: Archivo 700 at 112% width (low confidence) */
.sb-nhl-espn-97 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LEFT}px 1fr; grid-template-rows: ${TOP}px 1fr 1fr; padding: 6px; box-sizing: border-box;
  background: linear-gradient(#e9eaec, #c6c8cc); box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-nhl-espn-97 .tag { display: grid; place-items: center start; padding-left: 10px; background: #fff; } .sb-nhl-espn-97 .tag .sb-ha { color: #111; }
.sb-nhl-espn-97 .pd { display: grid; place-items: center; background: #0b0b0c; font-size: ${PX * 0.9}px; line-height: 1; } .sb-nhl-espn-97 .pd .sb-ord { text-transform: lowercase; font-size: .85em; }
.sb-nhl-espn-97 .ln { grid-column: 1; display: flex; justify-content: space-between; align-items: center; padding: 0 26px 0 14px; background: #2a2b2e; font-size: ${PX}px; line-height: 1; }
.sb-nhl-espn-97 .ck { grid-column: 2; grid-row: 2 / 4; display: grid; place-items: center; background: #2a2b2e; font-size: ${PX * 1.2}px; line-height: 1; border-left: 3px solid #111; }
/* a five-character clock (11:08, 12:00) squeezes into its panel, the same room each side; letters and a three-figure score keep a
 gap between them */
.sb-nhl-espn-97 .ck { min-width: 0; padding: 0 10px; box-sizing: border-box; } .sb-nhl-espn-97 .ln { gap: 20px; }
.sb-nhl-espn-97 .ck.w { grid-row: 1 / 4; font-size: ${PX * 0.55}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (noRec(g)) bx.style.gridTemplateColumns = (LEFT - PRE_CUT) + 'px 1fr';
    const tag = el('span', 'tag'); if (marks(opts).ha) tag.appendChild(haMark(44));
    bx.appendChild(tag);
    if (live) { const p = el('span', 'pd'); p.appendChild(ordinal(g.period)); bx.appendChild(p); }
    [g.away, g.home].forEach((t, i) => {
      const ln = el('div', 'ln'); ln.style.gridRow = String(i + 2);
      // four letters (UTAH) squeeze into their room; they pushed the score under the clock panel
      ln.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      if (!noRec(g)) ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    const ck = el('span', live ? 'ck' : 'ck w', live ? g.clock || '' : statusText(g, time)); if (live) fit(ck);
    bx.appendChild(ck);
    root.appendChild(bx);
  },
};
