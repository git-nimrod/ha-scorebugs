// "Dash bar '22": after an NBA regional broadcast's bug of the early 2020s (a 407 x 107 px box, fair). A flat box ruled in thin white lines: on top the two
// teams side by side, each a panel of its colour darkening towards the middle with a big logo cut by the panel's top and bottom at the
// outer end and the score in white towards the middle; under them a black band with a white dash for each timeout left under each
// team; under that black cells with the quarter and the clock. Left out (no data): the shot clock's cell at the right of the bottom row.
// The bug carries no network mark, so there is no Home Assistant logo either.
// measured (x2.5 here): panels 0.44 of the height, the dash band 0.18, the bottom row 0.32, white rules
// 3 px (frame) between them and 2 px round the box; the scores' capitals 0.59 of the panel, upright, condensed; dashes 13 x 6 px on
// the frame with a 5 px gap, the first under each team's left end; the quarter's cell 0.33 of the width.
// logos: on the frame the Lakers' logo is 2.35 panel heights wide (109 of 46.5 px), its
// ball cut at top and foot with the word a little above the middle; the Bulls' horns run off the top with the eyes at 0.46 of the panel.
// So 268 px (2.35 x 114, was 196) in a window as wide, 6 px from the panel's end, cut by the panel and set on its focal point (the kit).
// focal points: the window is the panel itself (it reached 50 px above it, which put every logo's middle high
// and cut the Lions' head and the Bucs' skull), and the kit centres the logo's face (its sharpest detail, eyes, skull, lettering) in it.
import { el, logo, statusText, teamPair, panelInk, shade, scoreSlot, pips, ordinal, FONTS } from '../kit.js';

const W = 1018, H = 268, RIM = 4, PAN = 114, RULE = 7, DASH = 46, LOGO = 268;
const BOT = H - 2 * RIM - PAN - DASH - 2 * RULE, QCELL = 335;

const band = (g) => g.status === 'live' && (g.away.timeouts != null || g.home.timeouts != null);

export default {
  id: 'nba-dashbar-22',
  size: { w: W, h: H },
  // the timeout band only while the game is on and the feed gives timeouts: else the box closes up (no empty band)
  sizeFor: (g) => ({ w: W, h: band(g) ? H : H - DASH - RULE }),
  fonts: [FONTS.barlowSemi600],
  css: `
.sb-nba-dashbar-22 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 600; color: #fff; box-sizing: border-box;
  padding: ${RIM}px; display: grid; grid-template-rows: ${PAN}px ${DASH}px ${BOT}px; row-gap: ${RULE}px; background: #e9e9ea; }
.sb-nba-dashbar-22 .top, .sb-nba-dashbar-22 .dash { display: grid; grid-template-columns: 1fr 1fr; column-gap: 6px; }
.sb-nba-dashbar-22 .dash { column-gap: 0; background: #070707; }
.sb-nba-dashbar-22 .pan { position: relative; display: flex; align-items: center; justify-content: space-between; padding-right: 46px; min-width: 0; }
/* a flat sheen: a touch lighter at the top */
.sb-nba-dashbar-22 .pan::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,.08), rgba(255,255,255,0) 40%, rgba(0,0,0,.1)); pointer-events: none; }
/* the logo's window is the panel's height: the kit slides the logo so its face sits in the middle of it */
.sb-nba-dashbar-22 .lg { width: ${LOGO}px; height: ${PAN}px; align-self: stretch; display: grid; place-items: center;
  overflow: hidden; margin-left: 6px; flex: none; }
.sb-nba-dashbar-22 .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain; flex: none; }
.sb-nba-dashbar-22 .sc { font-size: 96px; line-height: 1; text-align: right; letter-spacing: 1px; position: relative; z-index: 1; }
.sb-nba-dashbar-22 .dash > span { display: flex; align-items: center; padding-left: 16px; }
.sb-nba-dashbar-22 .sb-pips { display: flex; gap: 12px; }
.sb-nba-dashbar-22 .sb-pips i { width: 33px; height: 15px; background: #f2f2f2; }
/* a used timeout leaves no mark on the frame (six dashes, nothing in the seventh place) */
.sb-nba-dashbar-22 .sb-pips i.used { opacity: 0; }
.sb-nba-dashbar-22 .bot { display: grid; grid-template-columns: ${QCELL}px 1fr; column-gap: 5px; }
.sb-nba-dashbar-22 .bot > span { display: grid; place-items: center; background: linear-gradient(#0c0c0c, #050505); font-size: 82px; line-height: 1; }
.sb-nba-dashbar-22 .bot .ck { justify-items: start; padding-left: 112px; letter-spacing: 1px; }
.sb-nba-dashbar-22 .bot .w { grid-column: 1 / -1; font-size: 64px; }
.sb-nba-dashbar-22 .sb-ord { font-size: .7em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    // never two look-alike panels (two navies), and dark letters on a light panel (GS gold)
    const [ca, ch] = teamPair(g.away, g.home, '#4a5560');
    const top = el('div', 'top'), dash = el('div', 'dash');
    [[g.away, ca], [g.home, ch]].forEach(([t, c]) => {
      const pan = el('div', 'pan');
      pan.style.color = panelInk(t, c);
      pan.style.background = 'linear-gradient(90deg, ' + shade(c, 0.04) + ', ' + c + ' 40%, ' + shade(c, -0.38) + ')';
      const lg = el('div', 'lg'); lg.dataset.focus = 'face'; lg.dataset.keep = '0.75'; lg.appendChild(logo(t, LOGO));
      pan.append(lg, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      top.appendChild(pan);
      const d = el('span', '');
      if (live && t.timeouts != null) d.appendChild(pips(t.timeouts, 7));
      dash.appendChild(d);
    });
    const bot = el('div', 'bot');
    if (live) bot.append(el('span', 'q', '').appendChild(ordinal(g.period, 'pq')).parentNode, el('span', 'ck', g.clock || ''));
    else bot.appendChild(el('span', 'w', statusText(g, time)));
    if (band(g)) root.append(top, dash, bot);
    else { root.style.gridTemplateRows = PAN + 'px ' + BOT + 'px'; root.append(top, bot); }
  },
};
