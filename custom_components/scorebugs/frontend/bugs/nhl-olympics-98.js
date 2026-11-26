// "Maroon clock '98": after the Olympic hockey bug from Nagano (1998; frame: Finland v Canada). Two rows, one per team: its badge filling
// a box at the left with its letters over the bottom edge (here the team's logo, where the broadcast had the country's flag) and its
// score, the first row on gold and the second on dark teal; at the right a maroon column with the period over the clock. The power-play
// row is left out (no data).
import { el, logo, ordinal, statusText, scoreSlot, FONTS } from '../kit.js';
// before the game the score boxes stay when both teams have a record: the kit puts the records in them
const noRec = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

const W = 680, H = 210, RULE = 6, FLAG = 210, SCORE = 150;
// letters 52: on air FIN stands over a third of its row's height (ours were under a quarter)
const ABBR_PX = 52, SCORE_PX = 78, RT_PX = 70;

export default {
  id: 'nhl-olympics-98',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the face-off there is no score (and the kit no longer puts the logos in the empty plates when the badges already show them):
  // the score plates go and the box closes up
  sizeFor: (g) => (noRec(g) ? { w: W - SCORE - RULE, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-olympics-98 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 92%; color: #f6f6f2; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nhl-olympics-98 { font-weight: 600; font-stretch: 70%; }   /* face: Archivo 600 at 70% width (low confidence) */
.sb-nhl-olympics-98 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${FLAG}px ${SCORE}px 1fr; grid-template-rows: 1fr 1fr; gap: ${RULE}px; padding: ${RULE}px; box-sizing: border-box;
  background: #111; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nhl-olympics-98 .fl { position: relative; display: grid; place-items: center; overflow: hidden; }
/* the badge bigger, filling most of its box as the flag does on air, the letters over its lower edge */
.sb-nhl-olympics-98 .fl .sb-logo { position: absolute; left: 10px; top: 4px; width: 140px; height: 80px; object-fit: contain; object-position: left center; opacity: .92; }
.sb-nhl-olympics-98 .fl .ab { position: absolute; right: 10px; bottom: 2px; font-size: ${ABBR_PX}px; letter-spacing: .18em; line-height: 1; }
.sb-nhl-olympics-98 .sc { display: grid; place-items: center; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-nhl-olympics-98 .a { background: linear-gradient(#7f6a22, #776220); } .sb-nhl-olympics-98 .h { background: linear-gradient(#18333c, #0f2c34); }   /* flat, as on air (frame) */
.sb-nhl-olympics-98 .rt { grid-column: 3; grid-row: 1 / 3; display: grid; grid-template-rows: 1fr 1fr; justify-items: end; align-items: center; padding: 0 22px;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,0) 0 86px, rgba(255,255,255,.03) 86px 92px), linear-gradient(#481b2f, #3f1527 40%, #521830); font-size: ${RT_PX}px; line-height: 1; }
.sb-nhl-olympics-98 .rt .sb-ord { font-size: .75em; text-transform: lowercase; }
.sb-nhl-olympics-98 .rt .w { grid-row: 1 / 3; justify-self: center; font-size: ${RT_PX * 0.5}px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (noRec(g)) bx.style.gridTemplateColumns = FLAG + 'px 1fr';
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k], i) => {
      const fl = el('span', 'fl ' + k); fl.style.gridRow = String(i + 1);
      fl.append(logo(t, 150), el('span', 'ab', (t.abbr || '').toUpperCase()));
      const sc = scoreSlot(el('span', 'sc ' + k, g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.appendChild(fl); if (!noRec(g)) bx.appendChild(sc);
    });
    const rt = el('div', 'rt');
    if (noRec(g)) rt.style.gridColumn = '2';
    if (live) { const p = el('span', ''); p.appendChild(ordinal(g.period)); rt.append(p, el('span', '', g.clock || '')); }
    else rt.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(rt);
    root.appendChild(bx);
  },
};
