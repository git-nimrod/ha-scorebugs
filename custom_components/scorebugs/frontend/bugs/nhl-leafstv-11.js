// "Glass band '11": after Leafs TV's score band of the early 2010s. A see-through navy band across the
// picture, clearer at its left end where a pale glass streak cuts across it: the channel's mark (here the Home Assistant logo), the
// away team's letters, both scores in dark figures on small silver plates, the home team's letters, and far to the right the clock and
// the period in a box ruled in white. No team colours and no logos on air.
// measured (crop px of 369 x 29, the band y 5-27): streak 0-35, mark 40-95, letters 112-145, plates 148-168 and 170-188 (9 px tall),
// letters 190-213, clock 293-333, period box 337-360; capitals 8 px of the 22 px band (counted by hand); the arena shows through at about 15-45 % (more at the left end).
import { el, statusText, haMark, marks, scoreSlot, fit, ordinal, FONTS } from '../kit.js';

const K = 3.2, W = Math.round(369 * K), H = Math.round(22 * K);
const CAP = 8 * K, PX = Math.round(CAP / 0.7);
const X = (v) => Math.round(v * K);

export default {
  id: 'nhl-leafstv-11',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-nhl-leafstv-11 { font-family: 'SB Montserrat', 'Arial', sans-serif; font-weight: 800; color: #fff; }
/* the band: navy glass, clearer at the left end, a thin light line along its top */
.sb-nhl-leafstv-11 .band { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(40,38,62,.55), rgba(30,25,64,.86) 27%, rgba(32,28,78,.9) 70%, rgba(28,26,60,.86) 92%, rgba(40,38,52,.7));
  box-shadow: inset 0 2px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(0,0,0,.4); }
/* the pale glass streak across the left end */
.sb-nhl-leafstv-11 .st { position: absolute; left: 0; top: 0; width: ${X(36)}px; height: ${H}px; background: linear-gradient(160deg, rgba(255,255,255,0) 30%, rgba(210,225,235,.45) 46%, rgba(255,255,255,0) 60%); }
.sb-nhl-leafstv-11 .c { position: absolute; top: 0; height: ${H}px; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; line-height: 1; }
.sb-nhl-leafstv-11 .mk { left: ${X(40)}px; width: ${X(55)}px; } .sb-nhl-leafstv-11 .mk .sb-ha { color: #f2f2f6; }
/* the home letters start 2 px after the second plate, as on air (they touched it) */
.sb-nhl-leafstv-11 .a { left: ${X(106)}px; width: ${X(40)}px; } .sb-nhl-leafstv-11 .h { left: ${X(190.5)}px; width: ${X(42)}px; justify-content: flex-start; }
/* the score plates: silver, dark figures */
.sb-nhl-leafstv-11 .pl { top: ${X(6)}px; height: ${X(10)}px; color: #151515; background: linear-gradient(#f6f6f6, #d6d6d8 50%, #a8a8ac); box-shadow: inset 0 1px 0 #fff; }
.sb-nhl-leafstv-11 .p1 { left: ${X(148)}px; width: ${X(20)}px; } .sb-nhl-leafstv-11 .p2 { left: ${X(170)}px; width: ${X(18)}px; }
/* a three-figure score (a basketball game) a size smaller, inside its plate */
.sb-nhl-leafstv-11 .pl .n3 { font-size: ${PX * 0.66}px; }
.sb-nhl-leafstv-11 .ck { left: ${X(290)}px; width: ${X(46)}px; }
/* before the game the plates widen outwards so the records (a three-part hockey record: 10-14-1) can be read */
.sb-nhl-leafstv-11.pre .a { left: ${X(96)}px; } .sb-nhl-leafstv-11.pre .p1 { left: ${X(138)}px; width: ${X(30)}px; }
.sb-nhl-leafstv-11.pre .p2 { width: ${X(28)}px; } .sb-nhl-leafstv-11.pre .h { left: ${X(200.5)}px; }
/* the period in a box ruled in white */
.sb-nhl-leafstv-11 .pd { left: ${X(337)}px; width: ${X(23)}px; top: ${X(6)}px; height: ${X(10)}px; box-sizing: border-box; border: 3px solid #f2f2f2; border-radius: 3px; background: rgba(10,10,20,.6); font-size: ${PX * 0.8}px; }
.sb-nhl-leafstv-11 .pd .sb-ord { font-size: .62em; }
.sb-nhl-leafstv-11 .w { left: ${X(258)}px; width: ${X(102)}px; font-size: ${PX * 0.8}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.classList.toggle('pre', g.status === 'pre');
    root.append(el('div', 'band'), el('i', 'st'));
    const mk = el('div', 'c mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.66))); root.appendChild(mk);
    root.append(fit(el('div', 'c a', (g.away.abbr || '').toUpperCase())), fit(el('div', 'c h', (g.home.abbr || '').toUpperCase())));
    [[g.away, 'p1'], [g.home, 'p2']].forEach(([t, c]) => {
      const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : '';
      const p = el('div', 'c pl ' + c); p.appendChild(scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g)); root.appendChild(p);
    });
    if (live) {
      root.appendChild(el('div', 'c ck', g.clock || ''));
      const pd = el('div', 'c pd'); pd.appendChild(g.period.word ? document.createTextNode(g.period.label) : ordinal(g.period)); root.appendChild(pd);
    } else root.appendChild(el('div', 'c w', statusText(g, time)));
  },
};
