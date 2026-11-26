// "Cream box '04": after ABC's NHL bug (2004 Stanley Cup Final; frame: Flames at Lightning, Game 7). A cream rounded box: the clock on a white
// pill at the top with a black tab for the period, each team's letters on black with its score on a cream cell, a black disc at the left
// where the network's round mark sat (here the Home Assistant logo), and a pill at the bottom with the game of the series when the note
// names one.
import { el, ordinal, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 560, H = 300, DISC = 120, PX = 58;

export default {
  id: 'nhl-abc-04',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-abc-04 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; color: #111; }
.sb-nhl-abc-04 { font-weight: 800; font-stretch: 115%; }   /* face: Archivo 800 at 115% width (low confidence) */
.sb-nhl-abc-04 .bx { position: absolute; left: 134px; right: 0; top: 0; bottom: 0; display: grid; grid-template-columns: 1fr 120px; grid-template-rows: 78px 1fr 1fr 58px; gap: 3px; padding: 14px 6px 5px 6px; box-sizing: border-box;
  border-radius: 22px; background: linear-gradient(#a98a55, #7d6035); box-shadow: 0 0 0 3px #b8964f, 0 3px 8px rgba(0,0,0,.5); }   /* on air the cells touch, parted by thin gold-brown rules (#806343 to #a6887d), the box ringed in gold (2004 Final still) */
.sb-nhl-abc-04 .ck { display: grid; place-items: center; border-radius: 30px; background: linear-gradient(#ffffff, #e7e3d6); font-size: ${PX}px; line-height: 1; }
.sb-nhl-abc-04 .pd { display: grid; place-items: center; border-radius: 8px; background: #111; color: #ecebdf; font-size: ${PX * 0.85}px; line-height: 1; } .sb-nhl-abc-04 .pd .sb-ord { text-transform: lowercase; font-size: .85em; }
.sb-nhl-abc-04 .ck.w { grid-column: 1 / 3; font-size: ${PX * 0.6}px; }
.sb-nhl-abc-04 .tm { display: grid; place-items: center; background: #0d0d0e; color: #f2f2f2; font-size: ${PX}px; line-height: 1; }
.sb-nhl-abc-04 .sc { display: grid; place-items: center; background: linear-gradient(#f4f3ea, #dcdccc); font-size: ${PX}px; line-height: 1; }
.sb-nhl-abc-04 .nt { grid-column: 1 / 3; display: grid; place-items: center; border-radius: 30px; background: linear-gradient(#fffdf4, #e9e2c8); font-size: ${PX * 0.85}px; line-height: 1; text-transform: uppercase; letter-spacing: .04em; }
.sb-nhl-abc-04 .nt { margin-top: 6px; }   /* a thicker gold rule between the teams and the game pill on air */
.sb-nhl-abc-04 .nt:empty { visibility: hidden; }
.sb-nhl-abc-04 .disc { position: absolute; left: 0; top: ${(H - DISC) / 2}px; width: ${DISC * 1.25}px; height: ${DISC}px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(#2c2c2e, #050505 70%); box-shadow: 0 0 0 4px #b8964f, 0 3px 6px rgba(0,0,0,.5); }
.sb-nhl-abc-04 .disc .sb-ha { color: #f2f2f2; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    if (live) { const p = el('span', 'pd'); p.appendChild(ordinal(g.period)); bx.append(el('span', 'ck', g.clock || ''), p); }
    else bx.appendChild(el('span', 'ck w', statusText(g, time)));
    [g.away, g.home].forEach((t) => {
      bx.append(el('span', 'tm', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
    });
    const m = /game\s*(\d+)/i.exec(g.note || '');
    bx.appendChild(el('span', 'nt', m ? 'Game ' + m[1] : ''));
    const disc = el('div', 'disc'); if (marks(opts).ha) disc.appendChild(haMark(70));
    root.append(bx, disc);
  },
};
