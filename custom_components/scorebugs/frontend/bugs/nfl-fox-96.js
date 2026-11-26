// "Dark box '96": after Fox's NFL bug (1996-97; frame: Packers at 49ers). A dark rounded box with a light rim: the quarter, a small arrow
// and the clock along the top; the network's letters large at the left (here the Home Assistant logo); and each team's letters and score.
import { el, ordinal, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

// the dark box about two and a half times as wide as tall; the team letters a size under the scores
const W = 520, H = 212, TOP = 60, MARK = 170, PX = 52, SC_ROOM = 96;

export default {
  id: 'nfl-fox-96',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score column goes and the box closes up on the letters
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - SC_ROOM : W, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-fox-96 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #ececec; text-shadow: 2px 2px 0 rgba(0,0,0,.55); }
.sb-nfl-fox-96 { font-weight: 800; font-stretch: 100%; }   /* face: Archivo 800 (low confidence) */
.sb-nfl-fox-96 .bx { position: absolute; inset: 8px; display: grid; grid-template-columns: ${MARK}px 1fr; grid-template-rows: ${TOP}px 1fr 1fr; padding: 6px 26px 14px 14px; box-sizing: border-box;
  border-radius: 16px; background: linear-gradient(#3a3c3e, #1d1e20); box-shadow: 0 0 0 4px #c9cbc8, 0 0 0 8px #8f918e, inset 0 2px 0 rgba(255,255,255,.12), 0 4px 8px rgba(0,0,0,.5); }   /* a thick light rim with a darker outer step, as the frame's raised edge (surface pass) */
.sb-nfl-fox-96 .hd > span:last-child:not(.w) { justify-self: end; }
.sb-nfl-fox-96 .hd { grid-column: 1 / 3; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; column-gap: 24px; padding-left: 20px; font-size: ${PX * 0.85}px; line-height: 1; }
.sb-nfl-fox-96 .hd b { font-size: .6em; } .sb-nfl-fox-96 .hd .w { grid-column: 1 / 4; text-align: center; font-size: ${PX * 0.6}px; }
.sb-nfl-fox-96 .mk { grid-row: 2 / 4; display: grid; place-items: center; } .sb-nfl-fox-96 .mk .sb-ha { color: #e9e9e9; }
.sb-nfl-fox-96 .ln { display: flex; align-items: center; justify-content: space-between; padding-left: 10px; font-size: ${PX}px; line-height: 1; }
.sb-nfl-fox-96 .ln > span:first-child { font-size: .82em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx'), hd = el('div', 'hd');
    if (live) { const p = el('span', ''); p.appendChild(ordinal(g.period)); hd.append(p, el('b', '', '▶'), el('span', '', g.clock || '')); }
    else hd.appendChild(el('span', 'w', statusText(g, time)));
    const mk = el('span', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(100));
    bx.append(hd, mk);
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      ln.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    root.appendChild(bx);
  },
};
