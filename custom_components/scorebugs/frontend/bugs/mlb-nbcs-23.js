// "Split panels '23": after NBC Sports' MLB bug (2020s; frame: Nationals at Phillies). Rebuilt to the frame: a light bar
// with a red top rule, each team in two cells, its letters and then its big score, both in the team's colour (deepened until it reads on
// the light grey); the away cells a shade darker than the home ones, as on air. At the right a dark box: the bases over the inning (a
// yellow arrow) and the outs as dots, the count beside them. The pitcher and batter strip under the bar and the pitch clock are left
// out (no data).
import { el, otherSport, bases, statusText, scoreSlot, teamColor, shade, contrast, FONTS } from '../kit.js';

const NAME = 230, SCORE = 150, RT = 300, H = 136, TOP = 6;
const W = 2 * (NAME + SCORE) + RT;
const NAME_PX = 92, SCORE_PX = 124, RT_PX = 50;  // bigger type

/** The team's colour deepened until it reads on the light cells. */
function inkFor(t) {
  let c = teamColor(t, '#3a3f47');
  for (let i = 0; i < 12 && contrast(c, '#e6e7e9') < 4; i++) c = shade(c, -0.1);
  return c;
}

export default {
  id: 'mlb-nbcs-23',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.saira],
  css: `
.sb-mlb-nbcs-23 { font-family: 'SB Saira', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 88%; color: #fff; }   /* squared semi-condensed bold, closer to the frame's letters than Barlow Condensed */
.sb-mlb-nbcs-23 .bar { position: absolute; left: 0; top: 0; width: ${2 * (NAME + SCORE)}px; height: ${H}px; display: grid; grid-template-columns: ${NAME}px ${SCORE}px ${NAME}px ${SCORE}px;
  border-top: ${TOP}px solid #d22a2f; box-sizing: border-box; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-mlb-nbcs-23 .c { display: grid; place-items: center; line-height: 1; white-space: nowrap; }
.sb-mlb-nbcs-23 .c.a { background: linear-gradient(#dcdde0, #c4c6ca); } .sb-mlb-nbcs-23 .c.h { background: linear-gradient(#f4f4f5, #dfe0e3); }
.sb-mlb-nbcs-23 .c.sc.a { background: linear-gradient(#cfd0d3, #b6b8bc); } .sb-mlb-nbcs-23 .c.sc.h { background: linear-gradient(#e9eaec, #d3d4d7); }
.sb-mlb-nbcs-23 .nm { font-size: ${NAME_PX}px; letter-spacing: 1px; } .sb-mlb-nbcs-23 .sc { font-size: ${SCORE_PX}px; }
.sb-mlb-nbcs-23 .rt { position: absolute; right: 0; top: 0; width: ${RT - 8}px; height: ${H}px; box-sizing: border-box; border-radius: 0;   /* flush with the bar, top and foot */ background: linear-gradient(#2a2c31, #0e0f12); box-shadow: 0 3px 8px rgba(0,0,0,.45);
  display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; place-items: center; font-size: ${RT_PX}px; }
.sb-mlb-nbcs-23 .rt .sb-bases i { background: transparent; border: 3px solid #d7d8db; } .sb-mlb-nbcs-23 .rt .sb-bases i.on { background: #f2c230; border-color: #f2c230; }
.sb-mlb-nbcs-23 .rt .inn b { color: #f2c230; font-size: .6em; margin-right: 8px; vertical-align: .2em; }
.sb-mlb-nbcs-23 .rt .outs { display: flex; gap: 8px; } .sb-mlb-nbcs-23 .rt .outs i { width: 26px; height: 26px; border-radius: 50%; box-sizing: border-box; border: 3px solid #e8e9eb; } .sb-mlb-nbcs-23 .rt .outs i.on { background: #e8e9eb; }
.sb-mlb-nbcs-23 .rt .w { grid-column: 1 / 3; grid-row: 1 / 3; font-size: ${RT_PX * 0.8}px; }
.sb-mlb-nbcs-23 .rt .dt { font-size: 36px; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 9);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bar = el('div', 'bar');
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k]) => {
      const ink = inkFor(t);
      const nm = el('span', 'c nm ' + k, (t.abbr || '').toUpperCase()); nm.style.color = ink;
      // before the first pitch the record in the score's cell, smaller
      const sc = g.status === 'pre' ? el('span', 'c sc ' + k, t.record || '') : scoreSlot(el('span', 'c sc ' + k, t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre') sc.style.fontSize = ((t.record || '').length > 5 ? 36 : 46) + 'px';
      sc.style.color = ink;
      bar.append(nm, sc);
    });
    const rt = el('div', 'rt');
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      const outs = el('span', 'outs'); for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      rt.append(bases(b.bases, 30), el('span', '', b.balls + '-' + b.strikes), inn, outs);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      // (the period and the clock on one line, the detail under them; no detail: the two take both lines)
      const p = el('span', 'inn', os.period), c = el('span', '', os.clock);
      if (os.detail) { const d = el('span', 'dt', os.detail); d.style.gridColumn = '1 / 3'; rt.append(p, c, d); }
      else { p.style.gridRow = c.style.gridRow = '1 / 3'; rt.append(p, c); }
    } else rt.appendChild(el('span', 'w', statusText(g, time)));
    root.append(bar, rt);
  },
};
