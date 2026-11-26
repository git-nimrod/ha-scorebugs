// "Lilac plate '99": after the NBA score box on TNT, 1999-2000 (frame: Jazz at Trail Blazers, 2nd quarter, from a sheet of TNT's NBA
// bugs by era; rough: the bar is 110 x 34 px on the sheet, so finish readings are guides). A see-through lilac-grey plate whose right end
// is cut on a slant; on it two team rows (the letters on a grey-mauve cell, the score on a navy cell whose right end is cut on the same
// slant), a thin light rule between them, and under them a near-black band with the quarter in mixed case ("2nd Qtr"). To the right the
// network's mark (here the Home Assistant logo, in the mark's red-orange) over a black clock box with a silver rim. No team colours on
// air: the plate and cells are the network's own greys. Drawn soft, the way it looked on a 1999 TV.
// measured (110 px frame, x4.55): rows 40 high at 6 and 60, band 48 high at 103; letter cells 147 wide, score cells 128 with a
// 25 deg cut; plate's right end leans 24 deg (499 at the top, 429 at the foot; the edge check reads -24.9 deg on the frame) with a dark rim; clock box 130 x 51 at 289,80; caps 28 px on the rows,
// 23 px in the band, 37 px in the clock; plate #a3a1b3, cells #857e88, score cells #27273f, band #0e0e1a.
import { el, statusText, haMark, marks, fit, scoreSlot, FONTS } from '../kit.js';

const W = 500, H = 155;
const per = (g) => (g.sport === 'hockey' ? 'Per' : g.league === 'NCAAM' ? 'Half' : 'Qtr');

export default {
  id: 'nba-tnt-99',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo, FONTS.barlowCond600],
  css: `
.sb-nba-tnt-99 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; font-stretch: 112%; color: #fff; }
/* the plate: lilac grey, a little lighter at the top, its right end cut on a 16 deg slant */
.sb-nba-tnt-99 .rim { position: absolute; inset: 0; clip-path: polygon(0 0, 499px 0, 429px 100%, 0 100%); background: linear-gradient(#3a3a4e, #24243a); }
.sb-nba-tnt-99 .plate { position: absolute; inset: 0; border-radius: 6px 0 0 4px; clip-path: polygon(0 0, 493px 0, 423px 100%, 0 100%);
  background: linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,0) 30%), linear-gradient(#a6a4b5, #9e9cb0 55%, #9a9bb1); }
.sb-nba-tnt-99 .nm, .sb-nba-tnt-99 .sc { position: absolute; height: 40px; display: flex; align-items: center; line-height: 1; }
.sb-nba-tnt-99 .nm { left: 5px; width: 147px; padding: 0 10px; box-sizing: border-box; background: linear-gradient(#8a8590, #827b88);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25); font-size: 41px; color: #dcd9e2; text-shadow: 2px 2px 0 rgba(30,28,40,.6); white-space: nowrap; }
.sb-nba-tnt-99 .sc { left: 152px; width: 128px; padding-right: 34px; box-sizing: border-box; justify-content: flex-end; clip-path: polygon(0 0, 100% 0, calc(100% - 19px) 100%, 0 100%);
  background: linear-gradient(#2e2e46, #24243b); font-size: 41px; text-shadow: 2px 2px 0 rgba(0,0,0,.6); }
.sb-nba-tnt-99 .sc.rec { font-size: 26px; white-space: nowrap; }
.sb-nba-tnt-99 .rule { position: absolute; left: 5px; top: 51px; width: 275px; height: 3px; background: #dcd9e4; }
.sb-nba-tnt-99 .band { position: absolute; left: 5px; top: 103px; width: 244px; height: 48px; padding: 0 30px 0 18px; box-sizing: border-box; display: flex; align-items: center;
  border-radius: 4px 0 0 4px; background: linear-gradient(#1a1a2e, #0d0d18 54%, #07070f);
  font-size: 33px; font-weight: 700; letter-spacing: 1px; white-space: nowrap; }
.sb-nba-tnt-99 .ha { position: absolute; left: 334px; top: 9px; color: #ee4b25; }
.sb-nba-tnt-99 .ck { position: absolute; left: 289px; top: 80px; width: 130px; height: 51px; display: grid; place-items: center; background: #0d0d18;
  box-shadow: inset 0 0 0 2px #c8c8d4, inset 0 0 0 3px #4a4a58; font-family: 'SB Barlow Condensed', Arial, sans-serif; font-weight: 600; font-size: 53px; line-height: 1;
  color: #cfd0dc; letter-spacing: 2px; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live';
    root.append(el('div', 'rim'), el('div', 'plate'));
    const recs = pre && g.away.record && g.home.record;
    [g.away, g.home].forEach((t, i) => {
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      // a long record (10-14-1) is squeezed to its box
      if (recs) fit(sc); else scoreSlot(sc, g);
      nm.style.top = sc.style.top = (6 + i * 54) + 'px';
      root.append(nm, sc);
    });
    root.appendChild(el('div', 'rule'));
    const p = g.period || {};
    root.appendChild(fit(el('div', 'band', live ? (p.word ? p.label : p.label + (p.suffix || '').toLowerCase() + ' ' + per(g)) : statusText(g, time))));
    if (marks(opts).ha) { root.appendChild(haMark(60, 'ha')); }
    if (live && g.clock) root.appendChild(el('div', 'ck', g.clock));
  },
};
