// "Field of Dreams '21": after FOX's one-off score box for the Field of Dreams game (Aug. 12, 2021). An old ballpark scoreboard in dark green with a
// thin cream rule inside its edge: each team's logo in cream at an end and its score in cream on a darker green tile, a field drawn
// in cream lines between them (the bases as outlined squares at its corners, a mound, and a solid home plate), and a foot row of three
// dark tiles with the half inning in words, the count and the outs. The pitcher and batter line above it needs data the feed lacks and
// is left out.
// measured: rule 2 px, 2% in from the edge; logos 41% of the height; score tiles 16% of the width and 50% of the height,
// figures caps 0.29 of the height; field 23% of the width; foot tiles 29% of the height; letters bold condensed, upright, cream (caps
// 0.15 of the height). Not drawn soft.
import { el, otherSport, logo, statusText, scoreSlot, FONTS } from '../kit.js';

const W = 615, H = 195;

export default {
  id: 'mlb-fox-21',
  size: { w: W, h: H },
  logos: 'white',   // the logos in a light one-colour version on the green, as on air (falls back to the dark, then the plain logo)
  fonts: [FONTS.barlowCond700],
  css: `
.sb-mlb-fox-21 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #e6ecd8; }
/* the board: dark green, a faint lighter middle, a thin cream rule inside its edge */
.sb-mlb-fox-21 .bd { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 40%, #46603e, #34502f 60%, #2a4428); box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-mlb-fox-21 .bd::after { content: ''; position: absolute; inset: 8px 10px; border: 2px solid rgba(226,232,206,.8); }
.sb-mlb-fox-21 .lg { position: absolute; top: 22px; width: 80px; height: 80px; display: grid; place-items: center; }
.sb-mlb-fox-21 .lg .sb-logo { width: 80px; height: 80px; object-fit: contain; opacity: .92; }
.sb-mlb-fox-21 .lg.a { left: 26px; } .sb-mlb-fox-21 .lg.h { left: 504px; }
/* the score tiles: darker green, lit faintly along the top */
.sb-mlb-fox-21 .s { position: absolute; top: 15px; width: 102px; height: 98px; display: grid; place-items: center; font-size: 82px; line-height: 1; background: linear-gradient(#123e26, #0c321e); }
.sb-mlb-fox-21 .s.a { left: 124px; } .sb-mlb-fox-21 .s.h { left: 384px; }
/* the field in cream lines */
.sb-mlb-fox-21 .fd { position: absolute; left: 273px; top: 33px; width: 62px; height: 62px; transform: rotate(45deg); border: 2px solid rgba(226,232,206,.75); box-sizing: border-box; }
.sb-mlb-fox-21 .bs { position: absolute; width: 20px; height: 20px; margin: -10px 0 0 -10px; transform: rotate(45deg); border: 2px solid #e2e8ce; box-sizing: border-box; background: #34502f; }
.sb-mlb-fox-21 .bs.on { background: #e8eed6; }
.sb-mlb-fox-21 .md { position: absolute; left: 294px; top: 54px; width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(226,232,206,.75); box-sizing: border-box; }
.sb-mlb-fox-21 .hp { position: absolute; left: 294px; top: 100px; width: 20px; height: 18px; background: #e2e8ce; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
/* the foot row: three dark tiles */
.sb-mlb-fox-21 .t { position: absolute; top: 122px; height: 56px; display: grid; place-items: center; font-size: 44px; line-height: 1; background: linear-gradient(#173f26, #10341e); white-space: nowrap; }
.sb-mlb-fox-21 .t.i { left: 22px; width: 256px; } .sb-mlb-fox-21 .t.c { left: 324px; width: 82px; } .sb-mlb-fox-21 .t.o { left: 430px; width: 166px; }
.sb-mlb-fox-21 .t.w { left: 22px; width: 574px; }
.sb-mlb-fox-21 .t.c.os { left: 300px; width: 296px; }
.sb-mlb-fox-21 .dt { position: absolute; left: 236px; width: 138px; top: 15px; height: 98px; display: grid; place-items: center; text-align: center; font-size: 32px; line-height: 1.05; white-space: pre-line; }
.sb-mlb-fox-21.big .s { font-size: 62px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    root.appendChild(el('div', 'bd'));
    // three-figure scores (another sport's game) take a smaller size, both alike
    root.classList.toggle('big', [g.away, g.home].some((t) => Number(t.score) >= 100));
    [g.away, g.home].forEach((t, i) => {
      const lg = el('div', 'lg ' + (i ? 'h' : 'a')); lg.appendChild(logo(t, 80));
      root.append(lg, scoreSlot(el('div', 's ' + (i ? 'h' : 'a'), g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
    });
    const os = otherSport(g, 7);
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (os && os.detail) root.appendChild(el('div', 'dt', os.detail));
    if (!os) root.appendChild(el('div', 'fd'));
    // first, second, third at the field's right, top and left corners
    if (!os) [[0, 348, 64], [1, 304, 20], [2, 260, 64]].forEach(([k, x, y]) => { const s = el('i', 'bs' + (b && b.bases[k] ? ' on' : '')); s.style.left = x + 'px'; s.style.top = y + 'px'; root.appendChild(s); });
    if (!os) root.append(el('div', 'md'), el('div', 'hp'));
    if (live) {
      const inn = el('div', 't i', (b.half === 'bot' ? 'BOTTOM ' : 'TOP ') + g.period.label + (g.period.suffix || '').toLowerCase());
      root.append(inn, el('div', 't c', b.balls + '-' + b.strikes), el('div', 't o', b.outs + (b.outs === 1 ? ' OUT' : ' OUTS')));
    } else if (os) root.append(el('div', 't i', os.period), el('div', 't c os', os.clock));
    else root.appendChild(el('div', 't w', statusText(g, time)));
  },
};
