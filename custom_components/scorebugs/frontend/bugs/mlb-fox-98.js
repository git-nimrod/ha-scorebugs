// "Red can '98": after FOX's MLB score box of the 1998 regular season. An upright box between two red cylinder ends, with four small grey points sticking out
// round it, one each way: the points are the bases (first lit yellow on the frame) and home plate. Inside: the network's mark (here the Home
// Assistant logo) and the inning on a dark top row, both teams on silver rows with a small red arrow at the batting team, and the
// count and outs on a black foot.
// measured: the four points 97% of the bug apart across and 88% down, each about 12% wide; box 66% wide, 68% tall; rows 16/32/17% of the bug's height;
// letters heavy, upright, caps 0.1 of the height on the team rows (dark on silver), 0.11 on the top row and 0.14 on the foot,
// where OUT is set small beside a big figure.
// Drawn soft (bug_tv: clean turns it off).
// the three side points are bases (diamonds, 60 px across, their inner halves behind the red ends and the
// top row, so the outer point shows where the triangle's was) and the bottom one is home plate (flat top under the foot row, point down).
import { el, otherSport, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 366, H = 264;

export default {
  id: 'mlb-fox-98',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-fox-98 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 90%; color: #f2f2f2; }
/* four see-through grey shapes round the box, one each way: the bases as diamonds (yellow when taken), each
 60 px across with its inner part behind the red end so its outer point shows where the frame's does (6 px from the bug's sides);
 second 46 px across over the top row, most of it showing so it reads as a diamond; and home plate at the foot: flat top hidden under the foot row, square sides, a point at the bottom */
.sb-mlb-fox-98 .tip { position: absolute; width: 60px; height: 60px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); background: linear-gradient(rgba(220,226,226,.85), rgba(150,158,158,.82)); }
.sb-mlb-fox-98 .tip.on { background: linear-gradient(#fff6a0, #f2d230 55%, #c89a10); }
.sb-mlb-fox-98 .tip.b1 { left: 300px; top: 91px; }
.sb-mlb-fox-98 .tip.b3 { left: 6px; top: 91px; }
.sb-mlb-fox-98 .tip.b2 { left: 160px; top: 2px; width: 46px; height: 46px; }
.sb-mlb-fox-98 .tip.hm { left: 162px; top: 196px; width: 42px; height: 50px; clip-path: polygon(0 0, 100% 0, 100% 48%, 50% 100%, 0 48%); }
/* the red cylinder ends: a lit stripe down the middle; their tops and feet curve as seen from a little above (circle fits: r 21-27
   px, sag 4-6 px over the end's 27-33 px width) */
.sb-mlb-fox-98 .cap { position: absolute; top: 34px; width: 26px; height: 184px; border-radius: 13px / 5px;
  background: linear-gradient(90deg, #8c1418, #e04a4e 40%, #ff8a88 52%, #d83c40 66%, #901418); box-shadow: 0 2px 5px rgba(0,0,0,.45); }
.sb-mlb-fox-98 .cap.cl { left: 52px; } .sb-mlb-fox-98 .cap.cr { left: 292px; }
.sb-mlb-fox-98 .top { position: absolute; left: 76px; width: 218px; top: 39px; height: 42px; background: linear-gradient(#4c4c4c, #2c2c2c); }
/* every text centred in its own part both ways, measured on the ink: the mark in the top row's left part (76-182),
 the inning in its black cell (it sat 2-3 px low), the name and the score each in their half of a team row, the count and the outs
 each in their half of the foot (they sat 6 px low) */
.sb-mlb-fox-98 .ha { position: absolute; left: 111px; top: 42px; width: 36px; height: 36px; color: #fff; }
.sb-mlb-fox-98 .inn { position: absolute; left: 182px; width: 104px; top: 41px; height: 39px; display: grid; place-items: center; background: #0c0c0c; font-size: 44px; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-98 .inn .sb-ord { font-size: .62em; } .sb-mlb-fox-98 .inn > span { position: relative; top: -2px; }
/* the silver team rows: light top, a grey line between them */
.sb-mlb-fox-98 .r { position: absolute; left: 76px; width: 218px; height: 41px; display: grid; grid-template-columns: 140px 78px; align-items: center; justify-items: center; box-sizing: border-box;
  background: linear-gradient(#ffffff, #e2e4e8 45%, #c4c6cc); color: #26282c; font-size: 38px; line-height: 1; }
.sb-mlb-fox-98 .r .s { min-width: 1.4em; text-align: center; }
.sb-mlb-fox-98 .r.bat::before { content: ''; position: absolute; left: 6px; top: 13px; border: 8px solid transparent; border-left: 12px solid #f05a28; border-right: 0; }
.sb-mlb-fox-98 .ft { position: absolute; left: 76px; width: 218px; top: 165px; height: 46px; display: grid; grid-template-columns: 1fr 1fr; align-items: center; justify-items: center; box-sizing: border-box; padding-bottom: 6px;
  background: linear-gradient(#1a1a1a, #050505); font-size: 52px; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-98 .ft small { font-size: .55em; }
/* before and after the game the start time or FINAL takes the black foot row (it stood empty; the top row crowded the time) */
.sb-mlb-fox-98 .ft.idle { grid-template-columns: 1fr; padding-bottom: 0; font-size: 32px; }
.sb-mlb-fox-98 .ft .dt { font-size: 20px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const os = otherSport(g, 7);
    // another sport's game: no bases (the points round the box); the period in the inning's spot, the clock in the count's and one
    // detail where the outs were
    if (!os) [['b3', 2], ['b2', 1], ['b1', 0]].forEach(([c, k]) => root.appendChild(el('div', 'tip ' + c + (b && b.bases[k] ? ' on' : ''))));
    if (!os) root.appendChild(el('div', 'tip hm'));
    root.append(el('div', 'cap cl'), el('div', 'cap cr'), el('div', 'top'));
    const ha = el('div', 'ha'); if (marks(opts).ha) ha.appendChild(haMark(36)); root.appendChild(ha);
    const inn = el('div', 'inn');
    if (live) { const n = el('span', '', g.period.label); n.appendChild(el('span', 'sb-ord', g.period.suffix || '')); inn.appendChild(n); }
    if (os) inn.appendChild(el('span', '', os.period));
    if (live || os) root.appendChild(inn);
    [g.away, g.home].forEach((t, i) => {
      // the small red arrow points at the team at bat
      const r = el('div', 'r' + (live && t.hasBall ? ' bat' : '')); r.style.top = (82 + i * 42) + 'px';
      r.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      root.appendChild(r);
    });
    const ft = el('div', 'ft');
    if (os) { ft.append(el('span', '', os.clock), el('span', 'dt', os.detail)); if (!os.detail) ft.classList.add('idle'); }
    else if (b) { const o = el('span', '', String(b.outs)); o.appendChild(el('small', '', 'OUT')); ft.append(el('span', '', b.balls + '-' + b.strikes), o); }
    else { ft.classList.add('idle'); ft.appendChild(el('span', '', statusText(g, time))); }
    root.appendChild(ft);
  },
};
