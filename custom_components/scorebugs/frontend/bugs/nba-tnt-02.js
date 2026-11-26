// "Ring box '02": after the NBA score box on TNT, 2001-02 (frame: Wizards at Hawks, 2nd quarter, from a sheet of TNT's NBA bugs by
// era; rough and blurred: the bar is 87 x 46 px on the sheet, so finish readings are guides). A black box: two team rows, the letters
// on a dark navy cell with a thin light rule under the first, the scores on black, the clock large in a dark grey cell at the right;
// along the foot a grey-blue band, lit along its top edge, with the quarter in mixed case ("2nd Qtr"); over the band's right end a
// thin silver ring round a dark red disc that hangs below the box, holding the network's mark (here the Home Assistant logo). No team
// colours on air. Drawn soft, the way it looked on a 2002 TV.
// measured (87 px frame, x5): rows 45 high at 5 and 65; letter cells 135 wide from 15, score cells 100; clock cell 150 x 80 at 260,20;
// band 400 x 45 at 10,120; the ring fitted as a circle (circle_fit on its bright pixels): centre 0.82 across and just above the band's
// foot (centre at 0.70 of the box), radius 10.5 px = 0.32 of the box's height (55 here), ring about 1.5 px (7 here), silver #d8d4cc; caps 31 px on the rows,
// 45 px in the clock, 25 px in the band. Every other edge fits straight (sag under 1 px).
import { el, statusText, haMark, marks, fit, scoreSlot, FONTS } from '../kit.js';

const W = 435, H = 222, R = 55;
const per = (g) => (g.sport === 'hockey' ? 'Per' : g.league === 'NCAAM' ? 'Half' : 'Qtr');

export default {
  id: 'nba-tnt-02',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-02 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 700; color: #d6d8e0; }
.sb-nba-tnt-02 .box { position: absolute; left: 0; top: 0; right: 25px; height: 168px; background: linear-gradient(#16181d, #07080a); }
.sb-nba-tnt-02 .nm, .sb-nba-tnt-02 .sc { position: absolute; height: 45px; display: flex; align-items: center; line-height: 1; font-size: 46px; white-space: nowrap; }
.sb-nba-tnt-02 .nm { left: 15px; width: 135px; padding: 0 8px; box-sizing: border-box; background: linear-gradient(#262d3e, #1b2130); }
.sb-nba-tnt-02 .sc { left: 150px; width: 100px; padding-right: 12px; box-sizing: border-box; justify-content: flex-end; }
.sb-nba-tnt-02 .sc.rec { font-size: 25px; }
.sb-nba-tnt-02 .rule { position: absolute; left: 15px; top: 54px; width: 130px; height: 4px; background: #a6aab6; }
.sb-nba-tnt-02 .ck { position: absolute; left: 260px; top: 14px; width: 150px; height: 74px; display: grid; place-items: center; background: linear-gradient(#30343b, #25282e);
  font-weight: 600; font-size: 60px; letter-spacing: 4px; line-height: 1; color: #e2e3e8; }
/* a five-figure clock (12:00) closes its spacing and is squeezed to the cell */
.sb-nba-tnt-02 .ck.w { letter-spacing: 0; }
.sb-nba-tnt-02 .band { position: absolute; left: 10px; top: 120px; right: 25px; height: 45px; padding: 0 ${2 * R + 12}px 0 28px; box-sizing: border-box; display: flex; align-items: center;
  background: linear-gradient(#7a809a, #626a86 25%, #555c76); box-shadow: inset 0 3px 0 rgba(220,222,232,.7); font-size: 37px; letter-spacing: 2px; color: #eceaf6; white-space: nowrap; }
.sb-nba-tnt-02 .ck.st { font-size: 28px; letter-spacing: 1px; line-height: 1.1; white-space: nowrap; text-align: center; padding: 0 8px; box-sizing: border-box; }
/* the ring: a circle (border-radius 50%) round the dark red disc, its centre level with the band's foot */
.sb-nba-tnt-02 .ring { position: absolute; right: 22px; top: ${158 - R}px; width: ${2 * R}px; height: ${2 * R}px; box-sizing: border-box; border-radius: 50%;
  border: 7px solid #d8d4cc; background: radial-gradient(circle at 45% 40%, #4a1416, #1a0607 70%); box-shadow: 0 2px 4px rgba(0,0,0,.5), inset 0 0 0 1px rgba(0,0,0,.5);
  display: grid; place-items: center; color: #c8362e; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live';
    root.appendChild(el('div', 'box'));
    const recs = pre && g.away.record && g.home.record;
    [g.away, g.home].forEach((t, i) => {
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      nm.style.top = sc.style.top = (5 + i * 60) + 'px';
      root.append(nm, sc);
    });
    root.appendChild(el('div', 'rule'));
    // before and after the game the start time or FINAL goes in the clock's cell (a long one on two lines) and the band stays plain
    if (live) { if (g.clock) root.appendChild(fit(el('div', 'ck' + (g.clock.length > 4 ? ' w' : ''), g.clock))); }
    else {
      const st = statusText(g, time), m = st.length > 7 && st.match(/^(\S+) (.+)$/), ck = el('div', 'ck st');
      if (m) ck.append(el('div', '', m[1]), el('div', '', m[2])); else ck.textContent = st;
      root.appendChild(ck);
    }
    const p = g.period || {};
    root.appendChild(fit(el('div', 'band', live ? (p.word ? p.label : p.label + (p.suffix || '').toLowerCase() + ' ' + per(g)) : '')));
    const ring = el('div', 'ring');
    if (marks(opts).ha) ring.appendChild(haMark(48));
    root.appendChild(ring);
  },
};
