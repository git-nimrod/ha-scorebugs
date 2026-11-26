// "Ball bar '16": after the Australian T20 league's bar on free-to-air TV (2016; frame: Sydney Thunder chasing, a 640 x 480 upload, so
// the finish readings are guides). Along the bottom: a ball in the batting side's colour with its logo, overlapping two rows. The top
// row: a pale chrome box with wickets/runs ("6/172"), a black box with the overs, then a dark navy glass band holding outlined boxes
// ("TO WIN", "5 RUNS", "OFF 8 BALLS") and a long empty one, and a pale box at the right (a web address on air: the Home Assistant logo
// here). The bottom row: the side's name on a band of its colour, then a dark green row of figures.
// measured: top row 46 % of the bar, bottom 33 %; ball 85 % of the
// bar's height; runs box #c2cdc2 with a dark top edge; overs box black lit at the top (+54 L line); navy band #042231 lit +43 L at the top
// down to 22 %; outlined boxes 1 px light grey, corners 3 px; bottom row #071209 with a light top line; letters condensed bold.
// Left out: the batters' figures (no data): the bottom row carries the other side's score and the run rate.
// measured on the two 2016 final stills: the boxes of the top row are one joined strip split by light metal
// lines that bow out to the right by about a tenth of the row's height, with a dark line beside each; the 6/172 box and the name band
// start behind the ball (its left end is hidden by the ball's circle, no navy gap); the ball is far lighter than the team colour
// (L 82-93 against the side's L 70: lime #b3de53 for a lime side), lit low on the right, with a silver ring about 4 % of its width (850 px
// still; the soft frame read it dark) and a dark edge outside it; the name band is lit in the middle (+17 L) and darker at the ends. The colour: the 850 px still of the
// same season (BBL05 on Ten, Strikers v Sixers) shows the band a navy blue, not the teal the soft 640 px frame read: #0e1b3a to
// #080f2d with a steel-blue lit top (#5a728c, down to 23 %), the figures row a neutral near black (#121011), the runs box a neutral
// silver (#e9e8e9 to #b8bcbe) and the overs box plain black; all were drawn with a green-teal cast.
// the same note's colour, element by element on the 850 px still: the band and pills now match (#0c1733 vs
// #0e1b39); the pale box at the right still had the green-grey chrome cast and a dark band at 78 % (#8d8f89) where on air it is near
// white (#efe8ec) with a thin grey foot rim, and it stood 5 px in from the row's top and foot (2 px on air).
import { el, fit, logo, haMark, marks, statusText, cricketState, cricketScore, teamColor, shade, FONTS } from '../kit.js';

const W = 1180, H = 102;

export default {
  id: 'cricket-ten-16',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond700],
  css: `
.sb-cricket-ten-16 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-ten-16 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-ten-16 *, .sb-cricket-ten-16 *::before { box-sizing: border-box; }
.sb-cricket-ten-16 .top { position: absolute; left: 46px; right: 0; top: 7px; height: 47px; display: flex; gap: 4px; background: linear-gradient(#8ea2b4 0%, #5a728c 9%, #3a5270 19%, #0e1b3a 25%, #0a1430 55%, #080f2d 82%, #192735 100%); box-shadow: inset 0 1px 0 rgba(220,235,240,.6); }
.sb-cricket-ten-16 .bot { position: absolute; left: 46px; right: 0; top: 58px; height: 37px; display: flex; background: linear-gradient(#2c2e30 0%, #121011 16%, #0d0c0d 55%, #0a0a0b 100%); box-shadow: inset 0 1px 0 rgba(150,170,170,.6); }
.sb-cricket-ten-16 .ball { position: absolute; left: 12px; top: 13px; width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; overflow: hidden; box-shadow: inset 0 0 0 2px rgba(255,255,230,.35), 0 0 0 3px #dfe6ea, 0 0 0 9px #060708, 0 0 0 11px #b4bec4, 0 0 0 12px #2c3338; }
.sb-cricket-ten-16 .ball .sb-logo { width: 54px; height: 54px; object-fit: contain; }
.sb-cricket-ten-16 .runs { width: 162px; display: grid; place-items: center; padding-left: 44px !important; background: linear-gradient(#8a8c8e 0%, #e9e8e9 12%, #dcdcde 40%, #cfcfd0 70%, #b8bcbe 100%); color: #1d2420; font-size: 38px; line-height: 1; padding: 0 8px; }
.sb-cricket-ten-16 .ov { width: 84px; display: grid; place-items: center; background: linear-gradient(#44453f 0%, #262622 10%, #000 25%, #000 75%, #3a3f42 100%); font-size: 32px; line-height: 1; }
.sb-cricket-ten-16 .pills { flex: 1; min-width: 0; display: flex; align-items: stretch; margin: 2px 4px; box-shadow: inset 0 1.5px 0 rgba(170,190,200,.7), inset 0 -1.5px 0 rgba(150,170,180,.6), inset 2px 0 0 rgba(170,190,200,.7); }
/* each box ends in a light metal line bowed out to the right (about a tenth of the row's height), a dark line just inside it */
.sb-cricket-ten-16 .pill { position: relative; display: grid; place-items: center; padding: 0 14px; font-size: 28px; line-height: 1; white-space: nowrap; }
.sb-cricket-ten-16 .pill::after { content: ''; position: absolute; right: -2px; top: 0; bottom: 0; width: 7px; border-right: 3px solid #c3d0d4; border-radius: 0 100% 100% 0 / 0 50% 50% 0; box-shadow: inset -2px 0 0 #071620; }
.sb-cricket-ten-16 .pill.long { flex: 1; min-width: 0; justify-content: start; }
/* the pale box at the right: near white with a faint violet-grey cast, #ebecea to
 #fef8fe left to right at the top, #f6f4f5 to #fffffd at the foot, a 2-3 px grey rim (#8e8c8c) along its foot; nearly the row's height */
.sb-cricket-ten-16 .site { width: 166px; margin: 2px 0; display: grid; place-items: center; background: linear-gradient(90deg, rgba(40,30,40,.07), rgba(40,30,40,0) 70%), linear-gradient(#f6f3f5 0%, #ece7eb 50%, #f7f5f6 85%, #fbf9fa 100%); box-shadow: inset 0 -2.5px 0 #8e8c8c, inset 0 1px 0 #c9c7c8; color: #1e2a30; }
.sb-cricket-ten-16 .name { width: 228px; padding-left: 54px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #f3f8e4; }
.sb-cricket-ten-16 .figs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 46px; padding: 0 22px; font-size: 26px; color: #d8dcd6; font-weight: 600; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase(), mk = marks(opts);
    const side = g.status === 'pre' ? g.home : c.bat, other = side === g.home ? g.away : g.home;
    const col = teamColor(side, '#5a8f1e');
    // the ball is the side's own colour, lighter (on air L 82-93 for a lime side); a grey or missing colour falls back to the lime
    const raw = /^#[0-9a-f]{6}$/i.test(side.color || '') && !/^#(d3d3d3|a9a9a9)$/i.test(side.color) ? side.color : '#8fbf2a';
    const top = el('div', 'top'), bot = el('div', 'bot'), ball = el('div', 'ball');
    // the ball: the side's colour, lit from the top left
    ball.style.background = 'radial-gradient(circle at 62% 70%, ' + shade(raw, 0.38) + ', ' + shade(raw, 0.2) + ' 40%, ' + shade(raw, 0.06) + ' 75%, ' + shade(raw, -0.2) + ')';
    ball.appendChild(logo(side, 54));
    const pills = el('div', 'pills');
    const pill = (txt, long) => { const p = el('div', 'pill' + (long ? ' long' : '')); p.appendChild(long ? fit(el('span', '', txt)) : el('span', '', txt)); return p; };
    if (g.status === 'pre') {
      top.append(Object.assign(el('div', 'runs'), { textContent: ab(g.home) }));
      pills.append(pill('V ' + ab(g.away)), pill(statusText(g, time)), pill('', true));
    } else {
      // the Australian order: wickets/runs ("6/172")
      const runs = c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.wkts + '/' + c.runs : String(c.runs);
      const rb = el('div', 'runs'); rb.appendChild(fit(el('span', '', runs)));
      top.append(rb, Object.assign(el('div', 'ov'), { textContent: c.overs }));
      if (c.result) pills.append(pill(c.result.text, true));
      else if (c.need != null) pills.append(pill('TO WIN'), pill(c.need + (c.need === 1 ? ' RUN' : ' RUNS')), ...(c.ballsLeft > 0 ? [pill('OFF ' + c.ballsLeft + (c.ballsLeft === 1 ? ' BALL' : ' BALLS'))] : []), pill('', true));
      else if (c.lead != null) pills.append(pill(c.lead >= 0 ? 'LEAD' : 'TRAIL'), pill(Math.abs(c.lead) + ' RUNS'), pill('', true));
      else pills.append(pill('RUN RATE'), pill(c.rate != null ? c.rate.toFixed(2) : '-'), pill('', true));
    }
    top.appendChild(pills);
    const site = el('div', 'site'); if (mk.ha) site.appendChild(haMark(30)); top.appendChild(site);
    const name = el('div', 'name');
    // a side too light for white letters: its own colour deepened (on air the lime side's band is #507608, L 45), not its second colour
    const band = col.toLowerCase() !== raw.toLowerCase() && raw !== '#8fbf2a' && side.color && side.color.toLowerCase() === raw.toLowerCase() ? shade(raw, -0.4) : col;
    name.style.background = 'radial-gradient(ellipse 60% 120% at 55% 50%, ' + shade(band, 0.22) + ', ' + band + ' 70%, ' + shade(band, -0.18) + ')';
    name.appendChild(fit(el('span', '', (side.name || side.abbr || '').toUpperCase())));
    const figs = el('div', 'figs');
    if (g.status === 'pre') figs.appendChild(el('span', '', ((side.longName || side.name) + ' v ' + (other.longName || other.name)).toUpperCase()));
    else {
      if (other.score != null) figs.appendChild(el('span', '', 'V ' + ab(other) + ' ' + cricketScore(other, '/', true)));
      if (c.rate != null) figs.appendChild(el('span', '', 'RUN RATE ' + c.rate.toFixed(2)));
      if (c.need != null && c.ballsLeft > 0 && !c.result) figs.appendChild(el('span', '', 'REQ. RATE ' + (c.need * 6 / c.ballsLeft).toFixed(2)));
    }
    bot.append(name, figs);
    root.append(top, bot, ball);
  },
};
