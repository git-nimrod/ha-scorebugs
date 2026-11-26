// "Lower case '95": after ESPN2's NHL bug (1995-99; frame: Islanders at Rangers). A dark see-through box: a black band with the period and
// the clock, then each team's letters in lower case with its score at the right, in heavy white type.
import { el, ordinal, statusText, scoreSlot, FONTS, fit } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

const W = 420, H = 220, BAND = 64, PX = 58;

export default {
  id: 'nhl-espn2-95',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score: the box closes up on the letters
  sizeFor: (g) => (noRec(g) ? { w: W - 110, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -25% vs the broadcast; 80 % of the correction
  typeScale: 1.269,
  fonts: [FONTS.figtree],
  css: `
.sb-nhl-espn2-95 { font-family: 'SB Figtree', 'Arial Black', sans-serif; font-weight: 800; color: #f4f4f4; text-shadow: 3px 3px 0 rgba(0,0,0,.85); }   /* the heavy dark drop shadow of the frame */
.sb-nhl-espn2-95 { font-weight: 800; font-stretch: 100%; }   /* face: Figtree 800 (low confidence) */
.sb-nhl-espn2-95 .bx { position: absolute; inset: 0; display: grid; grid-template-rows: ${BAND}px minmax(0, 1fr) minmax(0, 1fr); background: rgba(52,52,54,.86); box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-nhl-espn2-95 .hd { display: flex; justify-content: space-between; align-items: center; padding: 0 20px; background: rgba(28,27,31,.92); font-size: ${PX * 0.78}px; line-height: 1; }
.sb-nhl-espn2-95 .hd .sb-ord { text-transform: lowercase; font-size: .9em; }
.sb-nhl-espn2-95 .hd .w { flex: 1; text-align: center; font-size: ${PX * 0.5}px; }
.sb-nhl-espn2-95 .ln { display: flex; justify-content: space-between; align-items: center; padding: 0 36px 14px 20px; font-size: ${PX}px; line-height: 1; text-transform: lowercase; }   /* lifted so the lower-case tails (y, j, g) stay inside the box */
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx'), hd = el('div', 'hd');
    if (live) { const p = el('span', ''); p.appendChild(ordinal(g.period)); hd.append(p, el('span', '', g.clock || '')); }
    else hd.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(hd);
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      // four letters (UTAH) squeeze into their room; they pushed the score under the clock panel
      ln.appendChild(fit(el('span', '', (t.abbr || '').toLowerCase())));
      if (!noRec(g)) ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    root.appendChild(bx);
  },
};
