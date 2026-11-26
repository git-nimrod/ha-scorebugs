// "Bases strip '01": after FOX's MLB score strip of 2001-2004. A see-through black strip across the top of the picture: the bases as three grey tiles hanging
// over its left end with a small white home plate under them, then each team's letters with its score in a yellow box, the half
// inning, the outs, the count, and at the right end the league's logo and the network's mark (here the Home Assistant logo).
// measured: strip 68% of the bug's height, the bases' cluster 12% of the width and flattened (45%) as if seen
// in perspective, hanging below it; score boxes 0.29 of the
// height, yellow with dark figures; letters bold condensed, upright, caps 0.23 of the height, light grey. Drawn soft (bug_tv: clean
// turns it off). The strip hugs what it holds (no empty run before the game or after it).
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, leagueLogo, FONTS } from '../kit.js';

const W = 1242, H = 111;

export default {
  id: 'mlb-fox-01',
  size: { w: W, h: H },
  tv: 'soft',
  hug: '.row',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-fox-01 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 75%; color: #dcdcd4; }
/* the strip: black, see-through, a faint lit top edge */
.sb-mlb-fox-01 .row { position: absolute; left: 0; top: 13px; height: 76px; display: flex; align-items: center; box-sizing: border-box; padding: 0 22px 0 212px;
  background: linear-gradient(rgba(40,40,36,.86), rgba(6,6,6,.86) 30%, rgba(4,4,4,.88)); box-shadow: inset 0 1px 0 rgba(255,255,255,.12); font-size: 37px; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-01 .ab { margin-right: 18px; }
/* the yellow score boxes: lit top, dark figures */
.sb-mlb-fox-01 .s { height: 34px; min-width: 60px; display: grid; place-items: center; margin-right: 22px; border-radius: 3px; color: #2a2208;
  background: linear-gradient(#ffe070, #f2c022 50%, #d8a010); box-shadow: inset 0 1px 0 rgba(255,255,255,.5); }
.sb-mlb-fox-01 .inn { margin-left: 4px; min-width: 104px; } .sb-mlb-fox-01 .inn b { font-size: .6em; margin-right: 8px; vertical-align: 3px; } .sb-mlb-fox-01 .inn .sb-ord { font-size: .7em; }
.sb-mlb-fox-01 .o { margin-left: 92px; } .sb-mlb-fox-01 .c { margin-left: 96px; }
.sb-mlb-fox-01 .lg { margin-left: 66px; display: grid; place-items: center; width: 64px; height: 48px; }
.sb-mlb-fox-01 .mk { margin-left: 56px; display: grid; place-items: center; width: 84px; height: 48px; color: #fff; }
/* the bases: three grey tiles leaning together, lit yellow when taken, a small white plate under them */
/* the tiles seen in perspective: each tile 0.47 as tall as wide on the frame (cluster 51 x 154 at bug scale), so flattened to 45% */
.sb-mlb-fox-01 .bz { position: absolute; left: 17px; top: 25px; transform: scaleY(.45); transform-origin: top; }
.sb-mlb-fox-01 .bz .sb-bases i { background: linear-gradient(135deg, #d4d6d0, #9a9c96 55%, #74766f); border: 2px solid rgba(20,20,20,.55); }
.sb-mlb-fox-01 .bz .sb-bases i.on { background: linear-gradient(135deg, #fff6a8, #f2c822 55%, #c49010); }
.sb-mlb-fox-01 .hp { position: absolute; left: 81px; top: 86px; width: 24px; height: 18px; background: #f2f2ee; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
.sb-mlb-fox-01 .row.os { padding-left: 30px; }
.sb-mlb-fox-01 .dt { margin-right: 40px; font-size: 32px; color: #f2c822; }
.sb-mlb-fox-01 .c.os { margin-left: 40px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const mk = marks(opts);
    const os = otherSport(g);
    const row = el('div', 'row');
    // another sport's game: no bases hanging at the strip's end; one detail of the game opens the strip instead (none: the strip starts
    // at the first team), then the period in the inning's spot and the clock in the count's, no outs
    if (os) { row.classList.add('os'); if (os.detail) row.appendChild(el('span', 'dt', os.detail)); }
    [g.away, g.home].forEach((t) => row.append(el('span', 'ab', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g)));
    const inn = el('span', 'inn');
    if (live) { inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), g.period.label); inn.appendChild(el('span', 'sb-ord', g.period.suffix || '')); }
    else inn.textContent = os ? os.period : statusText(g, time);
    row.appendChild(inn);
    if (live) row.append(el('span', 'o', b.outs + ' OUT'), el('span', 'c', b.balls + '-' + b.strikes));
    else if (os) row.appendChild(el('span', 'c os', os.clock));
    const lg = el('span', 'lg'); if (mk.league) lg.appendChild(leagueLogo(g, 46));
    const m = el('span', 'mk'); if (mk.ha) m.appendChild(haMark(44));
    row.append(lg, m);
    root.appendChild(row);
    if (!os) { const bz = el('div', 'bz'); bz.appendChild(bases(b ? b.bases : null, 50)); root.append(bz, el('div', 'hp')); }
  },
};
