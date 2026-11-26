// "Stacked panels '22": after the NBA score box on TNT, 2022-25 (frame: 76ers at Celtics, 2nd quarter, from a sheet of TNT's NBA bugs by
// era; rough: the bar is 95 x 23 px on the sheet, so finish readings are guides). A black box: the league's logo in its own cell at the
// left; the two teams stacked, each on a panel of its colour with its letters in a light tint of that colour, its score black on a
// white cell; a dotted rule; the clock large over the quarter (a small ordinal, "2nd"); at the right a white disc holding the network's
// mark (here the Home Assistant logo, black). The shot clock (a red cell beside the quarter) is left out: no data. The sheet notes the
// network's logo changed in 2023; neither is drawn.
// measured (95 px frame, x5): box rows 1..21 of 23 (5..105 here), square corners; logo cell 8 px (42 here); team panels 21 px wide
// (104 here), 9 px high each (45 here), deep shades of the team colour; score cells 17 px (84 here); the disc fitted as a circle (ring.py, circle_fit on its edge):
// centre 0.88 across, 0.45 down, r 7.3-8 px = 0.38 of the box's height (40 here); caps 6 px on the rows and the clock (30 here).
import { el, statusText, haMark, marks, fit, scoreSlot, leagueLogo, teamPair, shade, FONTS } from '../kit.js';

const W = 475, H = 112, CX = 417, CY = 55, R = 40;

export default {
  id: 'nba-tnt-22',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-22 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; color: #fff; }
.sb-nba-tnt-22 .box { position: absolute; left: 5px; top: 5px; width: 465px; height: 102px; background: linear-gradient(#141416, #070708); box-shadow: 0 2px 5px rgba(0,0,0,.4); }
.sb-nba-tnt-22 .lg { position: absolute; left: 9px; top: 10px; width: 38px; height: 92px; overflow: hidden; }
.sb-nba-tnt-22 .lg .sb-league { position: absolute; left: 50%; top: 50%; width: 96px; height: 96px; max-width: none; transform: translate(-50%, -50%); }
.sb-nba-tnt-22 .tm { position: absolute; left: 54px; width: 104px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 40px; line-height: 1; letter-spacing: 1px; white-space: nowrap; }
.sb-nba-tnt-22 .sc { position: absolute; left: 160px; width: 84px; height: 45px; display: flex; align-items: center; justify-content: center; background: linear-gradient(#ffffff, #e2e2e6);
  color: #0a0a0c; font-size: 42px; line-height: 1; }
.sb-nba-tnt-22 .sc.rec { font-size: 20px; font-weight: 700; }
.sb-nba-tnt-22 .rule { position: absolute; left: 250px; top: 14px; width: 3px; height: 84px; background: repeating-linear-gradient(#d8d8dc 0 3px, transparent 3px 6px); opacity: .8; }
.sb-nba-tnt-22 .ck { position: absolute; left: 258px; top: 12px; width: 108px; height: 42px; display: flex; align-items: center; justify-content: center; font-size: 44px; line-height: 1; white-space: nowrap; }
.sb-nba-tnt-22 .q { position: absolute; left: 258px; top: 60px; width: 108px; height: 38px; display: flex; align-items: center; justify-content: center; font-size: 30px; line-height: 1; white-space: nowrap; }
.sb-nba-tnt-22 .q sup { font-size: .6em; vertical-align: .55em; }
/* the start time's two lines are squeezed to the cell, clear of the dotted rule and the disc */
.sb-nba-tnt-22 .ck.st > div { width: 100%; display: flex; justify-content: center; }
.sb-nba-tnt-22 .ck.st { top: 30px; height: 50px; font-size: 26px; letter-spacing: 1px; line-height: 1.1; flex-direction: column; }
/* the network's mark on a white disc (border-radius 50%) */
.sb-nba-tnt-22 .disc { position: absolute; left: ${CX - R}px; top: ${CY - R}px; width: ${2 * R}px; height: ${2 * R}px; border-radius: 50%; background: radial-gradient(circle at 45% 35%, #ffffff, #e6e6ea 75%);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.2); display: grid; place-items: center; color: #0b0b0c; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live', mk = marks(opts);
    root.appendChild(el('div', 'box'));
    if (mk.league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, 96)); root.appendChild(lg); }
    const recs = pre && g.away.record && g.home.record;
    // two look-alike teams: one takes its other colour (kit teamPair)
    const cols = teamPair(g.away, g.home, '#3a3f47');
    [g.away, g.home].forEach((t, i) => {
      const c = cols[i];
      const tm = fit(el('div', 'tm', (t.abbr || '').toUpperCase()));
      // the team's colour, darker at the foot; the letters a light tint of it, as on air
      tm.style.background = 'linear-gradient(' + shade(c, -0.3) + ', ' + shade(c, -0.5) + ')';
      tm.style.color = shade(c, 0.72);
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      tm.style.top = sc.style.top = (10 + i * 47) + 'px';
      root.append(tm, sc);
    });
    root.appendChild(el('div', 'rule'));
    if (live) {
      root.appendChild(fit(el('div', 'ck', g.clock || '')));
      const p = g.period, q = el('div', 'q');
      q.appendChild(document.createTextNode(p.label || ''));
      if (!p.word && p.suffix) q.appendChild(el('sup', '', p.suffix.toLowerCase()));
      root.appendChild(q);
    } else {
      // the start time (the day over the time) or FINAL where the clock goes
      const st = statusText(g, time), m = st.length > 7 && st.match(/^(\S+) (.+)$/), ck = el('div', 'ck st');
      if (m) ck.append(fit(el('div', '', m[1])), fit(el('div', '', m[2]))); else ck.appendChild(fit(el('div', '', st)));
      root.appendChild(ck);
    }
    const disc = el('div', 'disc');
    if (mk.ha) disc.appendChild(haMark(50));
    root.appendChild(disc);
  },
};
