// "Big clock '01": after the NBA score box on TNT, 2000-01 (frame: Raptors at Knicks, 4th quarter, from a sheet of TNT's NBA bugs
// by era; rough: the bar is 81 x 34 px on the sheet, so finish readings are guides). A black box: two team rows, the letters on a
// dark slate cell with a thin light rule under the first, the scores on black; at the right a grey panel as tall as both rows holding
// the clock large in its own black box; along the foot a grey-blue band, its left end cut on a slant, with the quarter in mixed case
// ("4th Qtr") and the network's mark at its right end (here the Home Assistant logo, in the mark's red-orange). No team colours on
// air. Drawn soft, the way it looked on a 2001 TV.
// measured (81 px frame, x5.5): rows 55 high at 3 and 69; letter cells 143 wide from 17, score cells 104; clock panel 154 x 121
// at 270,3 (#33373c), clock box 127 x 50 inside it; band 420 x 44 at 5,130 (#5b6070 with a light top edge); caps 34 px on the
// rows, 36 px in the clock, 27 px in the band; letters pale grey #c8ccd4. The band's ends lean like '/' about 15 deg.
import { el, statusText, haMark, marks, fit, scoreSlot, FONTS } from '../kit.js';

const W = 430, H = 176;
const per = (g) => (g.sport === 'hockey' ? 'Per' : g.league === 'NCAAM' ? 'Half' : 'Qtr');

export default {
  id: 'nba-tnt-01',
  size: { w: W, h: H },
  // before and after the game there is no clock: the clock panel goes and the box closes up to the scores
  sizeFor: (g) => ({ w: g.status === 'live' ? W : 310, h: H }),
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-01 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 700; color: #c8ccd4; background: linear-gradient(#141619, #060708); }
.sb-nba-tnt-01 .nm, .sb-nba-tnt-01 .sc { position: absolute; height: 55px; display: flex; align-items: center; line-height: 1; font-size: 50px; white-space: nowrap; }
.sb-nba-tnt-01 .nm { left: 17px; width: 143px; padding: 0 8px; box-sizing: border-box; background: linear-gradient(#30343e, #252830); }
.sb-nba-tnt-01 .sc { left: 160px; width: 104px; padding-right: 12px; box-sizing: border-box; justify-content: flex-end; font-weight: 600; }
.sb-nba-tnt-01 .sc.rec { font-size: 26px; }
.sb-nba-tnt-01 .rule { position: absolute; left: 17px; top: 60px; width: 137px; height: 4px; background: #9a9ea8; }
.sb-nba-tnt-01 .pan { position: absolute; left: 270px; top: 3px; width: 154px; height: 121px; background: linear-gradient(#3a3e44, #2e3236); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); }
.sb-nba-tnt-01 .ck { position: absolute; left: 13px; top: 36px; width: 127px; height: 50px; display: grid; place-items: center; background: #08090a;
  font-weight: 600; font-size: 52px; letter-spacing: 3px; line-height: 1; color: #dcdee4; }
/* a five-figure clock (12:00) closes its spacing and is squeezed to the box */
.sb-nba-tnt-01 .ck.w { letter-spacing: 0; }
/* the band's ends both lean like '/' (top to the right), as on air: measured on the frame
 the left end runs 2.2 px over the band's 8 (about 15 deg) and the right end 2 px over 6 (about 18 deg); here 12 px over 44 (15 deg).
 The right end's top lines up with the clock panel's right edge (424), as on air */
.sb-nba-tnt-01 .band { position: absolute; left: 5px; top: 130px; width: calc(100% - 11px); height: 44px; padding: 0 70px 0 30px; box-sizing: border-box; display: flex; align-items: center;
  clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); background: linear-gradient(#7c8190, #5e6372 20%, #555a69);
  box-shadow: inset 0 2px 0 rgba(255,255,255,.4); font-size: 40px; letter-spacing: 2px; color: #e4e6ec; white-space: nowrap; }
.sb-nba-tnt-01 .band.st { font-size: 28px; padding-left: 24px; padding-right: 66px; letter-spacing: 1px; }
.sb-nba-tnt-01 .ha { position: absolute; right: 38px; top: 132px; color: #e2512c; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live';
    const recs = pre && g.away.record && g.home.record;
    [g.away, g.home].forEach((t, i) => {
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      nm.style.top = sc.style.top = (3 + i * 66) + 'px';
      root.append(nm, sc);
    });
    root.appendChild(el('div', 'rule'));
    if (live) { const pan = el('div', 'pan'); if (g.clock) pan.appendChild(fit(el('div', 'ck' + (g.clock.length > 4 ? ' w' : ''), g.clock))); root.appendChild(pan); }
    const p = g.period || {};
    root.appendChild(fit(el('div', 'band' + (live ? '' : ' st'), live ? (p.word ? p.label : p.label + (p.suffix || '').toLowerCase() + ' ' + per(g)) : statusText(g, time))));
    if (marks(opts).ha) root.appendChild(haMark(40, 'ha'));
  },
};
