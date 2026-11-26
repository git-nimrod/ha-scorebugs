// "Quarter band '00": after the NBA score box on TNT in 2000 (frame: Knicks at Heat, 2nd quarter, from a sheet of TNT's NBA bugs by
// era; rough: the bar is 101 x 42 px on the sheet, so finish readings are guides). A black box: two team rows, the letters on a dark
// navy cell with a thin light rule under the first, the scores on black; at the right the network's mark over the clock in a framed
// black box (here the Home Assistant logo, in the mark's gold-orange); along the foot a raised grey-blue band, cut on a slant at both
// ends, with the quarter written out ("2nd Quarter"). No team colours on air. Drawn soft, the way it looked on a 2000 TV.
// measured (101 px frame, x4.5): rows 48 high at 4 and 63; letter cells 179 wide from 6, score cells 103; clock box 136 x 55 at
// 292,58 with a grey rim; band 450 x 50 at 2,119, ends cut on a slant; caps 37-39 px on the rows and clock, 28 px in the band;
// cells #1b2233, scores #060608, band #8a90a2 to #5a5f72 with a light top edge.
import { el, statusText, haMark, marks, fit, scoreSlot, FONTS } from '../kit.js';

const W = 455, H = 180;
const word = (g) => (g.sport === 'hockey' ? 'Period' : g.league === 'NCAAM' ? 'Half' : 'Quarter');

export default {
  id: 'nba-tnt-00',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-00 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 700; color: #ecedf2; background: linear-gradient(#15161b, #050507); border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
.sb-nba-tnt-00 .nm, .sb-nba-tnt-00 .sc { position: absolute; height: 48px; display: flex; align-items: center; line-height: 1; font-size: 54px; white-space: nowrap; }
.sb-nba-tnt-00 .nm { left: 6px; width: 179px; padding: 0 8px; box-sizing: border-box; background: linear-gradient(#232b40, #171d2c); }
.sb-nba-tnt-00 .sc { left: 185px; width: 103px; padding-right: 16px; box-sizing: border-box; justify-content: flex-end; background: #060608; }
.sb-nba-tnt-00 .sc.rec { font-size: 28px; letter-spacing: 0; }
.sb-nba-tnt-00 .rule { position: absolute; left: 6px; top: 54px; width: 179px; height: 4px; background: linear-gradient(#c4c8d4, #8c90a0); }
.sb-nba-tnt-00 .ha { position: absolute; left: 347px; top: 1px; color: #e9a23b; }
/* a five-figure clock (12:00) closes its spacing and is squeezed to the box */
.sb-nba-tnt-00 .ck.w { letter-spacing: 2px; }
.sb-nba-tnt-00 .div { position: absolute; left: 295px; top: 60px; width: 3px; height: 53px; background: #9a9eaa; }
/* the clock's box and its figures centred under the mark; the letter spacing's trailing
 gap evened by as much padding on the left, so the ink is centred too
: both now centred in the space right of the scores, from the
 rule after the scores (298) to the box's right edge less the same 6 px margin the rows keep on the left (449): middle 375 (the mark's
 and the clock's ink sat at 363.5, 11 px left of it); the clock's box 148 wide (was 134) so it fills that space as on air */
.sb-nba-tnt-00 .ck { position: absolute; left: 301px; top: 58px; width: 148px; height: 55px; box-sizing: border-box; padding-left: 7px; display: grid; place-items: center; background: #050507;
  box-shadow: inset 0 0 0 2px #8e929e; font-weight: 500; font-size: 54px; letter-spacing: 7px; line-height: 1; color: #d4d6de; }
/* the band: raised grey-blue, lit along its top edge, both ends cut on the same slant, leaning like '/' (the frame's right end measures 11-15 deg) */
.sb-nba-tnt-00 .band { position: absolute; left: 2px; top: 119px; width: 450px; height: 50px; padding: 0 30px; box-sizing: border-box; display: flex; align-items: center;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%); background: linear-gradient(#a0a5b5, #868b9c 14%, #747989 60%, #6a6f80);
  box-shadow: inset 0 2px 0 rgba(255,255,255,.55); font-size: 41px; letter-spacing: 3px; color: #f0f1f5; text-shadow: 2px 2px 0 rgba(0,0,0,.7); white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live';
    const recs = pre && g.away.record && g.home.record;
    [g.away, g.home].forEach((t, i) => {
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      nm.style.top = sc.style.top = (4 + i * 59) + 'px';
      root.append(nm, sc);
    });
    root.appendChild(el('div', 'rule'));
    if (marks(opts).ha) root.appendChild(haMark(56, 'ha'));
    if (live && g.clock) root.append(el('div', 'div'), fit(el('div', 'ck' + (g.clock.length > 4 ? ' w' : ''), g.clock)));
    const p = g.period || {};
    root.appendChild(fit(el('div', 'band', live ? (p.word ? (p.label === 'OT' ? 'Overtime' : p.label) : p.label + (p.suffix || '').toLowerCase() + ' ' + word(g)) : statusText(g, time))));
  },
};
