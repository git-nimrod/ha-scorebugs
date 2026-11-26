// "Colour rows '06": after the NBA score box on TNT, 2006-08 (frame: Heat at Nets, from a sheet of TNT's NBA bugs by era; rough and
// blurred: the bar is 100 x 32 px on the sheet, so finish readings are guides). The league's logo at the left; two team rows framed in
// a thin silver rim, each running from black under the letters into the team's colour, letters and scores white and italic; under them
// a black strip rimmed in silver with the clock; at the right a dark disc in a thick red ring with a light outer rim, holding the
// network's mark (here the Home Assistant logo, white). The shot clock (right of the clock) is left out: no data. Drawn soft, the way
// it looked on a 2007 TV.
// measured (100 px frame, x5): the disc fitted as circles (ring.py, circle_fit per row and column): centre 0.83 across, 0.47 down;
// outer edge r 14.3 px = 0.48 of the crop's height (73 here), dark disc r 10.9 = 0.34 (55 here), so the red ring is 0.11 of the height
// (18 here) with a 2 px light rim; rows 45 and 42 high at 10 and 58 inside a 3 px silver rim from 80 to 350; black strip 96..152 (silver top rim); scores smaller than the letters (caps 22 and 30);
// caps about 30 px on the rows, 25 px in the clock; letters slant about 10 deg. Other edges fit straight (sag under 1 px).
import { el, statusText, haMark, marks, fit, scoreSlot, leagueLogo, teamPair, panelInk, shade, FONTS } from '../kit.js';

const W = 500, H = 160, CX = 414, CY = 76, RO = 73, RI = 55, LEAN = 18, K = Math.tan(LEAN * Math.PI / 180);

export default {
  id: 'nba-tnt-06',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivoItalic],
  css: `
.sb-nba-tnt-06 { font-family: 'SB Archivo', Arial, sans-serif; font-style: italic; font-weight: 800; color: #fff; }
/* everything at the left leans like '\' (top to the left), as on air: measured on the
 frame the rows' left edge runs 7 px over 21 (18 deg from upright) and the clock strip's left end carries on along the same line; the
 league's logo leans with it (sheared 18 deg) */
/*: on the frame the league's tile runs the bug's whole
 height and sits right against the rows' slanted left edge. Here the tile's artwork is 146 tall, from the rows' top (6) to the strip's
 foot (152), and 56 wide (it was 126 tall, 17 to 142, with a 6-13 px gap to the rows); its slot's right side lies on the rows' leaning
 edge (x = 80 + 0.325 * (y - 6): 103.7 at the middle height), so the tile touches the rows and the strip all the way down. ESPN's file has
 a margin round the tile (the tile is 0.9 of the file's height), so the file is drawn 162 tall to make the tile 146 */
.sb-nba-tnt-06 .lg { position: absolute; left: ${80 + K * 73 - 56}px; top: 6px; width: 56px; height: 146px; display: grid; place-items: center; overflow: hidden; z-index: 1;
  transform: skewX(${LEAN}deg); }
.sb-nba-tnt-06 .lg .sb-league { position: absolute; left: 50%; top: 50%; width: 162px; height: 162px; max-width: none; transform: translate(-50%, -50%); }
/* a wide league logo (NFL's or NHL's shield, when the bug shows another sport) is drawn whole at the slot's width */
.sb-nba-tnt-06 .lg.wide .sb-league { width: 54px; height: 54px; }
.sb-nba-tnt-06 .strip { position: absolute; left: ${80 + K * 90}px; top: 96px; width: ${CX - 80 - K * 90}px; height: 56px; clip-path: polygon(0 0, 100% 0, 100% 100%, ${K * 56}px 100%);
  background: linear-gradient(#2c0d10, #120708 55%, #070404); box-shadow: inset 0 3px 0 #d2cccc; }
/* the rows run on under the disc, so the ring meets them at every
 height, as on air; the scores stay where they were, 23-27 px clear of the ring (frame: about 5 px of 100) */
.sb-nba-tnt-06 .rows { position: absolute; left: 80px; top: 6px; width: ${CX - 80}px; height: 98px; box-sizing: border-box; border: 3px solid #d2cccc; background: #d2cccc;
  display: grid; grid-template-rows: 1fr 1fr; gap: 3px; clip-path: polygon(0 0, 100% 0, 100% 100%, ${K * 98}px 100%); }
.sb-nba-tnt-06 .r { display: flex; align-items: center; justify-content: space-between; padding: 0 93px 0 16px; font-size: 44px; line-height: 1; white-space: nowrap; min-width: 0; }
/* each row cut along the lean inside the silver rim, the second row's letters starting further in */
.sb-nba-tnt-06 .r.a { clip-path: polygon(${K * 3}px 0, 100% 0, 100% 100%, ${K * 47.5}px 100%); }
.sb-nba-tnt-06 .r.h { clip-path: polygon(${K * 50.5}px 0, 100% 0, 100% 100%, ${K * 95}px 100%); padding-left: 30px; }
.sb-nba-tnt-06 .r .sc { text-align: right; font-size: 36px; }
.sb-nba-tnt-06 .r .sc.rec { font-size: 22px; font-weight: 700; }
/* the quarter moved 10 px further from the strip's slanted end: its foot was 2.5 px
 from the slant, now 12.5; the clock moves with it and still ends 28 px clear of the disc in overtime */
.sb-nba-tnt-06 .ql { position: absolute; left: 136px; top: 108px; height: 38px; display: flex; align-items: center; gap: 10px; }
.sb-nba-tnt-06 .ck { position: absolute; left: 136px; top: 110px; min-width: 120px; height: 34px; padding: 0 14px; box-sizing: border-box; background: #060606;
  border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 36px; line-height: 1; white-space: nowrap; }
.sb-nba-tnt-06 .ck.st { font-size: 24px; letter-spacing: 1px; }
/* the quarter and the clock side by side, so OT never runs under the clock */
.sb-nba-tnt-06 .ql .ck { position: static; }
.sb-nba-tnt-06 .q { height: 38px; display: flex; align-items: center; font-size: 32px; color: #ffb0b4; }
/* the disc: circles (border-radius 50%): light outer rim, red ring, dark centre */
.sb-nba-tnt-06 .disc { position: absolute; left: ${CX - RO}px; top: ${CY - RO}px; width: ${2 * RO}px; height: ${2 * RO}px; box-sizing: border-box; border-radius: 50%;
  border: ${RO - RI - 2}px solid #9e2329; box-shadow: 0 0 0 2px #efc9c2, 0 3px 6px rgba(0,0,0,.45), inset 0 0 0 2px #5a0c10;
  background: radial-gradient(circle at 42% 35%, #2a3634, #101816 62%, #070a09); display: grid; place-items: center; color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live', mk = marks(opts);
    if (mk.league) { const tall = /^W?NBA$/.test(g.league || ''); const lg = el('div', tall ? 'lg' : 'lg wide'); lg.appendChild(leagueLogo(g, tall ? 162 : 54)); root.appendChild(lg); }
    root.appendChild(el('div', 'strip'));
    const rows = el('div', 'rows');
    const recs = pre && g.away.record && g.home.record;
    // two look-alike teams: one takes its other colour (kit teamPair)
    const cols = teamPair(g.away, g.home, '#3a3f47');
    [g.away, g.home].forEach((t, i) => {
      const c = cols[i];
      const r = el('div', i ? 'r h' : 'r a');
      // black under the letters, rising into the team's colour towards the score, as on air
      r.style.background = 'linear-gradient(90deg, #070707 6%, ' + shade(c, -0.35) + ' 31%, ' + c + ' 57%, ' + shade(c, 0.12) + ' 81%)';
      const sc = el('span', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      // the score sits on the bright end of the row: dark letters on a light colour (GS gold)
      sc.style.color = panelInk(t, shade(c, 0.12));
      r.append(fit(el('span', '', (t.abbr || '').toUpperCase())), sc);
      rows.appendChild(r);
    });
    root.appendChild(rows);
    if (live) {
      const ql = el('div', 'ql');
      ql.appendChild(el('div', 'q', g.period.label));
      if (g.clock) ql.appendChild(el('div', 'ck', g.clock));
      root.appendChild(ql);
    } else root.appendChild(fit(el('div', 'ck st', statusText(g, time))));
    const disc = el('div', 'disc');
    if (mk.ha) disc.appendChild(haMark(64));
    root.appendChild(disc);
  },
};
