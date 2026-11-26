// "Olive frame '14": after FOX's MLB score box of 2014-2017. A box in a pale olive-grey frame: each team's row with its letters on its colour and its score
// on a deeper shade of it, and a navy panel at the right with the inning in gold under a small gold arrow, the bases as three outlined
// diamonds (gold when taken), and the count over the outs as two dots (white when made).
// measured: frame 3% of the width, 8 px corners; name cells 36% of the width, score cells 20%, the navy panel 41%; rows
// 45% of the height each; letters semibold, upright, caps 0.18 of the height (measured by hand on the crop's rows), white (scores a light tint); inning and arrow gold; the
// pitcher line above the box needs data the feed lacks and is left out. Not drawn soft.
// the dividing lines barely lighter in weight: 3 px (were 4).
import { el, otherSport, bases, statusText, scoreSlot, teamPair, teamColor, panelInk, shade, FONTS } from '../kit.js';

const W = 552, H = 244;

export default {
  id: 'mlb-fox-14',
  size: { w: W, h: H },
  fonts: [FONTS.titillium],
  css: `
.sb-mlb-fox-14 { font-family: 'SB Titillium', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* the pale olive-grey frame, lit along its top */
.sb-mlb-fox-14 .fr { position: absolute; inset: 0 2px 2px 0; border-radius: 8px; background: linear-gradient(#c4c8b4, #9da38b 50%, #868c74); box-shadow: 0 3px 8px rgba(0,0,0,.45); }
/* light grey lines part the box into six areas: two names, two scores, and the navy panel's top and foot; 3 px
 */
.sb-mlb-fox-14 .in { position: absolute; left: 9px; right: 10px; top: 9px; bottom: 10px; display: grid; grid-template-columns: 196px 108px 1fr; grid-template-rows: 1fr 1fr; gap: 3px; background: #c4c8cc; }
.sb-mlb-fox-14 .nm { display: flex; align-items: center; padding-left: 22px; font-size: 64px; line-height: 1; }
.sb-mlb-fox-14 .s { display: grid; place-items: center; font-size: 64px; line-height: 1; color: #f4e8e0; }
/* the navy panel: the inning, the bases, the count and the outs */
/* the navy darker, as on the frame (about #0c1b2f in the middle, #04101e at the foot) */
.sb-mlb-fox-14 .rt { grid-column: 3; grid-row: 1 / 3; position: relative; background: linear-gradient(#18263e, #0c1a2e 50%, #050f1c); }
.sb-mlb-fox-14 .rt::after { content: ''; position: absolute; left: 0; right: 0; top: calc(50% - 1.5px); height: 3px; background: #c4c8cc; }
.sb-mlb-fox-14 .inn { position: absolute; left: 18px; top: 10px; display: grid; justify-items: center; color: #f2c430; font-size: 48px; line-height: 1; }
.sb-mlb-fox-14 .inn b { font-size: 22px; line-height: 1; }
.sb-mlb-fox-14 .bz { position: absolute; left: 92px; top: 6px; }
.sb-mlb-fox-14 .bz .sb-bases i { background: linear-gradient(135deg, #24344e, #101a2a); border: 3px solid #8a96aa; }
.sb-mlb-fox-14 .bz .sb-bases i.on { background: linear-gradient(135deg, #ffe070, #f2c420 55%, #c89810); border-color: #f6e090; }
.sb-mlb-fox-14 .c { position: absolute; left: 14px; top: 128px; font-size: 54px; line-height: 1; color: #c8cede; }
.sb-mlb-fox-14 .pips { position: absolute; left: 132px; top: 140px; display: flex; gap: 10px; }
.sb-mlb-fox-14 .pips i { width: 20px; height: 20px; border-radius: 50%; box-sizing: border-box; border: 3px solid #c8cede; }
.sb-mlb-fox-14 .pips i.on { background: #f4f6fa; border-color: #f4f6fa; }
/* the start time or FINAL: kept clear of the frame (a long time ran into it) */
.sb-mlb-fox-14 .w { position: absolute; inset: 0 14px; display: grid; place-items: center; font-size: 38px; color: #e8ecf4; white-space: nowrap; }
.sb-mlb-fox-14 .inn.os { top: 0; height: calc(50% - 2px); align-content: center; left: 0; width: 92px; font-size: 44px; }
.sb-mlb-fox-14 .c.os { top: calc(50% + 2px); bottom: 0; left: 0; right: 0; display: grid; place-items: center; }
.sb-mlb-fox-14 .dt { position: absolute; left: 92px; right: 8px; top: 0; height: calc(50% - 2px); display: grid; place-items: center; text-align: center; font-size: 28px; line-height: 1.05; color: #e8ecf4; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const cols = teamPair(g.away, g.home, '#4a505a');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (cols[i].toLowerCase() !== String(teamColor(t, '#4a505a')).toLowerCase() ? panelInk(t, cols[i]) : '#fff'));
    root.appendChild(el('div', 'fr'));
    const box = el('div', 'in');
    [g.away, g.home].forEach((t, i) => {
      const nm = el('span', 'nm', (t.abbr || '').toUpperCase().slice(0, 3));
      nm.style.background = 'linear-gradient(' + shade(cols[i], 0.12) + ', ' + cols[i] + ' 55%, ' + shade(cols[i], -0.12) + ')';
      const s = scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      // the score on a deeper shade of the team's colour
      s.style.background = 'linear-gradient(' + shade(cols[i], -0.3) + ', ' + shade(cols[i], -0.45) + ')';
      if (ink[i] !== '#fff') { nm.style.color = ink[i]; s.style.color = panelInk(t, shade(cols[i], -0.3)); }
      nm.style.gridRow = s.style.gridRow = String(i + 1);
      box.append(nm, s);
    });
    const rt = el('span', 'rt');
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), el('span', '', g.period.label));
      const bz = el('span', 'bz'); bz.appendChild(bases(b.bases, 36));
      const pips = el('span', 'pips'); for (let i = 0; i < 2; i++) pips.appendChild(el('i', i < b.outs ? 'on' : ''));
      rt.append(inn, bz, el('span', 'c', b.balls + '-' + b.strikes), pips);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, one detail where the bases were, the clock in the count's spot (no outs)
      const os = otherSport(g, 7);
      rt.append(el('span', 'inn os', os.period), el('span', 'c os', os.clock));
      if (os.detail) rt.appendChild(el('span', 'dt', os.detail));
    } else rt.appendChild(el('span', 'w', statusText(g, time)));
    box.appendChild(rt);
    root.appendChild(box);
  },
};
