// "Framed box '09": after FOX's MLB score box of 2009-2010. A dark box in a rounded silver frame: two rows, each team's letters on its colour and its score on a
// white-to-grey cell, then a black column with the half inning (a gold arrow) over the count and outs, and at the right a grey cell
// with the bases as three tiles (gold when taken) over a small home plate.
// measured: frame rim 3% of the height with 14 px corners (sides straight); name cells 25% of the width, score cells 12%, the black
// column 33%, the bases' cell 19%; rows 34% of the height each with a 4% gap; letters bold condensed, upright, caps 0.21 of the height,
// white on the team colours (deepened about a third, as on air), black on the score cells, the inning in gold. Drawn soft (bug_tv: clean turns it off).
// a little shorter (150 tall, was 165: 9% tighter) and every letter bigger: names caps about 0.27 of the
// height (were 0.21; the frame's PHI 0.24), scores and the middle column the same step up.
import { el, otherSport, bases, statusText, scoreSlot, teamPair, teamColor, panelInk, shade, FONTS } from '../kit.js';

const W = 654, H = 150;

export default {
  id: 'mlb-fox-09',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.barlowCond700],
  css: `
.sb-mlb-fox-09 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* the silver frame: lit top, darker under the middle, lit foot */
/* the frame's sides are straight with round corners: a circle fit on its left side (r 123 px, rms 2.4 crop px) read the rim's
 shadow, and drawing it as a bow lowered the score from 61 to 54, so the corners stay 14 px */
.sb-mlb-fox-09 .fr { position: absolute; inset: 0 0 4px 0; border-radius: 14px; background: linear-gradient(#e6e8ea, #a8acb0 45%, #6c7074 55%, #b8bcc0); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-fox-09 .in { position: absolute; left: 10px; right: 10px; top: 10px; bottom: 14px; border-radius: 6px; background: #121214; display: grid;
  grid-template-columns: 164px 82px 212px 6px 1fr; grid-template-rows: 1fr 1fr; gap: 6px 4px; padding: 6px; box-sizing: border-box; }
.sb-mlb-fox-09 .nm { display: grid; place-items: center; font-size: 58px; line-height: .9; letter-spacing: 1px; }
/* the gradients run up and down, light at the top and darker toward the foot (frame: score cell white 248 at the top
 to grey 170 at the foot, team cells brightest about 40% down and about half as bright at the foot, bases cell 220 to 80) */
.sb-mlb-fox-09 .s { display: grid; place-items: center; font-size: 60px; line-height: .9; color: #111; background: linear-gradient(#ffffff, #ececec 40%, #a8a8a8); }
.sb-mlb-fox-09 .md { display: flex; align-items: center; justify-content: center; gap: 14px; background: linear-gradient(#1c1c1e, #000 50%, #0a0a0c); font-size: 53px; line-height: .9; white-space: nowrap; }
.sb-mlb-fox-09 .md.inn { color: #f0c860; } .sb-mlb-fox-09 .md.inn b { font-size: .6em; color: #f2b830; }
.sb-mlb-fox-09 .md small { font-size: .72em; color: #e0e0e0; }
/* the start time or FINAL keeps the earlier size, so a long time (FRI 12:25 PM) stays clear of the column's sides */
.sb-mlb-fox-09 .md.w { grid-row: 1 / 3; grid-column: 3; color: #fff; font-size: 44px; }
.sb-mlb-fox-09 .dv { grid-row: 1 / 3; grid-column: 4; background: linear-gradient(#e6e8ea, #8a8e92); }
.sb-mlb-fox-09 .bc { grid-row: 1 / 3; grid-column: 5; position: relative; display: grid; place-items: center; background: linear-gradient(#dcdedf, #9c9ea0 40%, #4e5052); }
.sb-mlb-fox-09 .bc .sb-bases { position: relative; top: -4px; }
/* the tiles packed together, touching along a dark line: each tile grown until it meets its neighbours */
.sb-mlb-fox-09 .bc .sb-bases i { background: linear-gradient(135deg, #6a6c6e, #3c3e40); border: 3px solid #1a1a1c; transform: rotate(45deg) scale(1.16) !important; }
.sb-mlb-fox-09 .bc .sb-bases i.on { background: linear-gradient(135deg, #ffd878, #f2b430 55%, #c08414); }
.sb-mlb-fox-09 .hp { position: absolute; left: 50%; bottom: 6px; width: 16px; height: 13px; margin-left: -8px; background: #8a8c8e; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
.sb-mlb-fox-09 .bc.dt { color: #111; font-size: 36px; line-height: 1.05; text-align: center; white-space: pre-line; padding: 0 8px; }
.sb-mlb-fox-09 .in.big .s { font-size: 46px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const cols = teamPair(g.away, g.home, '#5a5e66');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (cols[i].toLowerCase() !== String(teamColor(t, '#5a5e66')).toLowerCase() ? panelInk(t, cols[i]) : '#fff'));
    root.appendChild(el('div', 'fr'));
    const box = el('div', 'in');
    // three-figure scores (another sport's game) take a smaller size, both alike
    if ([g.away, g.home].some((t) => Number(t.score) >= 100)) box.classList.add('big');
    [g.away, g.home].forEach((t, i) => {
      const nm = el('span', 'nm', (t.abbr || '').toUpperCase().slice(0, 3));
      // the team's colour deepened, as on air (the frame's red and orange are about a third darker than the teams' own)
      nm.style.background = 'linear-gradient(' + shade(cols[i], -0.5) + ', ' + shade(cols[i], -0.3) + ' 40%, ' + shade(cols[i], -0.65) + ')';
      // a light switched colour is not deepened into grey: it stays light, with the team's own letters on it
      if (ink[i] !== '#fff') { nm.style.background = 'linear-gradient(' + cols[i] + ', ' + shade(cols[i], -0.08) + ' 40%, ' + shade(cols[i], -0.25) + ')'; nm.style.color = ink[i]; }
      nm.style.gridRow = String(i + 1); nm.style.gridColumn = '1';
      const s = scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      s.style.gridRow = String(i + 1); s.style.gridColumn = '2';
      box.append(nm, s);
    });
    if (live) {
      const inn = el('span', 'md inn'); inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), el('span', '', g.period.label + (g.period.suffix || '')));
      inn.style.gridRow = '1'; inn.style.gridColumn = '3';
      const c = el('span', 'md'); const o = el('span', '', String(b.outs)); o.appendChild(el('small', '', 'OUT'));
      c.append(el('span', '', b.balls + '-' + b.strikes), o); c.style.gridRow = '2'; c.style.gridColumn = '3';
      box.append(inn, c);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      // (no detail: the period and the clock take the bases' room too)
      const os = otherSport(g, 8);
      const inn = el('span', 'md inn', os.period), c = el('span', 'md', os.clock);
      inn.style.gridRow = '1'; c.style.gridRow = '2'; inn.style.gridColumn = c.style.gridColumn = os.detail ? '3' : '3 / 6';
      box.append(inn, c);
      if (os.detail) box.append(el('span', 'dv'), el('span', 'bc dt', os.detail));
    } else box.appendChild(el('span', 'md w', statusText(g, time)));
    if (!otherSport(g)) {
      box.appendChild(el('span', 'dv'));
      const bc = el('span', 'bc'); bc.append(bases(b ? b.bases : null, 40), el('i', 'hp'));
      box.appendChild(bc);
    }
    root.appendChild(box);
  },
};
