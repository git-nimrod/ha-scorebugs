// "White rows '03": after TBS's Braves bug (2003; frame: Pirates at Braves). A white banner on top where the league's and the channel's marks
// sat (here the Home Assistant logo), each team's letters in navy on a white row with its score on a navy slanted end, a black diamond at
// the left with the bases on it and the inning, and a navy strip along the bottom with the outs.
// Review: no navy box round it all: the banner and the white rows sit on the picture with a thin navy line between rows,
// and only the outs strip is navy, ending in a slant on its right.
import { el, otherSport, statusText, scoreSlot, haMark, marks, leagueLogo, FONTS, GLOSS } from '../kit.js';

const W = 560, H = 360, TOP = 74, ROW = 98, LOW = 64, PX = 66;

export default {
  id: 'mlb-tbs-03',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -31% vs the broadcast; 80 % of the correction
  typeScale: 1.356,
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-tbs-03 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #1c2160; }
.sb-mlb-tbs-03 { font-weight: 800; font-stretch: 82%; }   /* heavy and a little narrow, as on air (was Archivo 600 at full width) */
.sb-mlb-tbs-03 .bx { position: absolute; inset: 0; display: grid; grid-template-rows: ${TOP}px ${ROW}px ${ROW}px 1fr; row-gap: 6px; padding: 8px; box-sizing: border-box; }
.sb-mlb-tbs-03 .hd, .sb-mlb-tbs-03 .ln { box-shadow: 0 0 0 3px #161a4c, 0 3px 8px rgba(0,0,0,.45); }
.sb-mlb-tbs-03 .hd { display: flex; align-items: center; justify-content: space-between; padding: 0 22px;   /* the league's logo at the left, the network's mark at the right, as on air */
  border-radius: 6px; background: linear-gradient(#ffffff, #d9dbe2); } .sb-mlb-tbs-03 .hd .sb-ha { color: #1c2160; }
.sb-mlb-tbs-03 .ln { display: grid; grid-template-columns: 1fr 130px; background: ${GLOSS}, linear-gradient(#ffffff, #c9ccd5); }   /* glossy, as on air */
.sb-mlb-tbs-03 .ln .nm { display: grid; place-items: center; padding-left: 110px; font-size: ${PX}px; line-height: 1; }
.sb-mlb-tbs-03 .ln .sc { display: grid; place-items: center; clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%); padding-left: 20px; background: ${GLOSS}, linear-gradient(#2e3593, #1c2160); color: #e9ecf6; font-size: ${PX}px; line-height: 1; }
.sb-mlb-tbs-03 .lo { display: grid; place-items: center; margin-right: 60px; clip-path: polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%); background: linear-gradient(#262b78, #12153f); color: #f0f0f0; font-size: ${PX * 0.55}px; line-height: 1; }   /* about half the rows' letters, inside its strip (it filled it) */
/* the diamond centred on the line between the two rows (it sat 10 px high) */
.sb-mlb-tbs-03 .dia { position: absolute; left: 10px; top: ${TOP + 40}px; width: 150px; height: 150px; display: grid; place-items: center; }
.sb-mlb-tbs-03 .dia::before { content: ''; position: absolute; inset: 18px; transform: rotate(45deg); background: #0b0c10; box-shadow: 0 2px 6px rgba(0,0,0,.6); }
/* each base out at its own corner of the diamond, as on air: second at the top point, third at the left, first at the right; the inning
 in the middle between them */
.sb-mlb-tbs-03 .dia .bz { position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; transform: rotate(45deg); background: #6b6e78; }
.sb-mlb-tbs-03 .dia .bz.on { background: #e9e9e9; }
.sb-mlb-tbs-03 .dia .n { position: absolute; left: 0; right: 0; text-align: center; top: 50%; transform: translateY(-50%);
  color: #e9e9e9; font-size: ${PX * 0.45}px; line-height: 1; }
.sb-mlb-tbs-03 .lo.os { grid-auto-flow: column; gap: 40px; }
.sb-mlb-tbs-03 .lo.os { gap: 28px; padding-right: 30px; } .sb-mlb-tbs-03 .lo.os span + span { font-size: .8em; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false] };
    const mk = marks(opts), bx = el('div', 'bx'), hd = el('div', 'hd');
    hd.appendChild(mk.league ? leagueLogo(g, 92, null, true) : el('span', ''));
    if (mk.ha) hd.appendChild(haMark(56));
    bx.appendChild(hd);
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      ln.append(el('span', 'nm', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const lo = el('div', 'lo', live ? b.outs + ' OUT' : os ? '' : statusText(g, time));
    if (os) { lo.classList.add('os'); lo.appendChild(el('span', '', os.clock)); if (os.detail) lo.appendChild(el('span', '', os.detail)); }
    bx.appendChild(lo);
    // the diamond is a square of 114 px turned on its point, centred at (75, 75): its corners 80 px from the centre; each base sits 26 px in from its corner
    const dia = el('div', 'dia'), on = live ? b.bases : [false, false, false];
    if (!os) [[1, 75, 21], [2, 21, 75], [0, 129, 75]].forEach(([k, x, y]) => { const z = el('i', 'bz' + (on[k] ? ' on' : '')); z.style.left = x + 'px'; z.style.top = y + 'px'; dia.appendChild(z); });
    if (live || os) dia.appendChild(el('span', 'n', os ? os.period : g.period.label || ''));
    root.append(bx, dia);
  },
};
