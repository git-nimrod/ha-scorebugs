// "Light bar '16": after ESPN's college basketball bug (2016-17; frame: Oklahoma v Kansas). A light grey bar: each team's logo on a block of
// its colour, its rank and name in mixed case, its score, and timeout dashes in its colour under the name; then the half, the clock and the
// shot clock in red at the right (the shot clock is left out: no data), with a dark line under it naming the team with the possession arrow
// when there is one.
import { el, logo, statusText, scoreSlot, teamColor, shade, FONTS, fit } from '../kit.js';

const W = 1100, H = 72, TEAM = 420, LG = 70, BAR = 50, PRE_CUT = 86;   // before the tip-off each team block loses its empty score room
const NAME_PX = 32, SCORE_PX = 43, RT_PX = 28;
// bar 50 tall on a 1100 bar (frame: 27 of 615), the possession line under it 22 (frame 12); the score's capitals about 0.7 of the bar, the name's 0.52

export default {
  id: 'cbb-espn-16',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the game there is no score: each team block closes up on its name and the bar is shorter
  // outside play there is no possession line: the bug is only the bar (its empty row under it went)
  sizeFor: (g) => ({ w: g.status === 'pre' && !(g.away.record && g.home.record) ? W - 2 * PRE_CUT : W, h: g.status === 'live' ? H : BAR }),
  // measured against the frame by the automatic audit: text -22% vs the broadcast, logos -14%; 80 % of the correction
  typeScale: 1.0, logoScale: 1.136,
  fonts: [FONTS.workSans],
  css: `
.sb-cbb-espn-16 { font-family: 'SB Work Sans', 'Arial', sans-serif; font-weight: 600; color: #2a2c30; }
/* face: ESPN college basketball c.2016: Work Sans 800 */
.sb-cbb-espn-16 .bar { position: absolute; left: 0; right: 0; top: 0; height: ${BAR}px; display: grid; grid-template-columns: ${TEAM}px ${TEAM}px 1fr; gap: 4px; background: #9a9da3; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-cbb-espn-16 .tm { position: relative; display: grid; grid-template-columns: ${LG}px 1fr auto; align-items: center; column-gap: 12px; padding-right: 16px; background: linear-gradient(#ffffff, #dfe1e5); }
.sb-cbb-espn-16 .lg { align-self: stretch; display: grid; place-items: center; } .sb-cbb-espn-16 .lg .sb-logo { width: 44px; height: 38px; object-fit: contain; }
.sb-cbb-espn-16 .nm { font-size: ${NAME_PX}px; line-height: 1; position: relative; top: -4px; font-weight: 500; white-space: nowrap; overflow: hidden; min-width: 0; }   /* squeezed to its room, not clipped (font matching) */ .sb-cbb-espn-16 .nm small { font-size: .8em; margin-right: 6px; }
.sb-cbb-espn-16 .sc { font-size: ${SCORE_PX}px; font-weight: 700; line-height: 1; }
.sb-cbb-espn-16 .rec { font-size: ${SCORE_PX * 0.6}px; font-weight: 700; line-height: 1; white-space: nowrap; }
.sb-cbb-espn-16 .to { position: absolute; left: ${LG + 12}px; bottom: 4px; display: flex; gap: 6px; } .sb-cbb-espn-16 .to i { width: 24px; height: 6px; } .sb-cbb-espn-16 .to i.used { opacity: .2; }
.sb-cbb-espn-16 .rt { display: flex; align-items: center; justify-content: space-around; background: linear-gradient(#ffffff, #dfe1e5); font-size: ${RT_PX}px; line-height: 1; }
.sb-cbb-espn-16 .ps { position: absolute; right: 0; top: ${BAR}px; width: calc(100% - ${TEAM * 2 + 8}px); height: ${H - BAR}px; display: grid; place-items: center end; padding-right: 12px; box-sizing: border-box;
  background: #2a2c30; color: #f2f2f2; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.sb-cbb-espn-16 .ps:empty { visibility: hidden; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const recs = g.status === 'pre' && g.away.record && g.home.record;  // records before the game, every time
    if (g.status === 'pre' && !recs) bar.style.gridTemplateColumns = (TEAM - PRE_CUT) + 'px ' + (TEAM - PRE_CUT) + 'px 1fr';
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#5a5e66');
      const tm = el('span', 'tm'), lg = el('span', 'lg'); lg.style.background = c; lg.appendChild(logo(t, 50));
      const nm = fit(el('span', 'nm')); if (t.rank && t.rank <= 25) nm.appendChild(el('small', '', String(t.rank)));
      nm.appendChild(document.createTextNode(t.name || t.abbr || ''));
      const to = el('span', 'to');
      if (live && t.timeouts != null) for (let i = 0; i < 4; i++) { const d = el('i', i >= t.timeouts ? 'used' : ''); d.style.background = shade(c, -0.05); to.appendChild(d); }
      tm.append(lg, nm, g.status === 'pre' ? (recs ? el('span', 'rec', t.record) : el('span')) : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g), to);
      bar.appendChild(tm);
    });
    const rt = el('span', 'rt');
    if (live) rt.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else rt.appendChild(el('span', '', statusText(g, time)));
    bar.appendChild(rt);
    const ball = live ? [g.away, g.home].find((t) => t.hasBall) : null;
    root.appendChild(bar); if (live) root.appendChild(el('div', 'ps', ball ? 'Poss: ' + (ball.name || ball.abbr || '') : ''));
  },
};
