// "Top ticker '10": after the stock-car ticker on its US broadcast of 2007-2014 (frame: the 2010 Bristol night race, lap 7; retro
// catalogue nas-espn-10-1). A black band across the top: a chequered strip fading in from the left, the network's mark (the Home
// Assistant mark here), the lap in white bold capitals, a raised grey tab in the middle with the car on board (its number on a slanted
// plate, its driver and place), and the series' logo on the right. Under a thin red line, the running order on black: the position in
// black on a slanted light plate, the car number in italics on a slanted plate in the car's colour, and the surname in white capitals.
// Measured on the 720p still: band 52 px (its upper third a dark lit strip), ticker 29 px, a 2 px red line (#c4161c) between them; the chequer 10 px squares
// fading to nothing over 200 px; plates lean 18 deg; an entry every 253 px; the on-board tab #2a2a2c to #141416, its top edge lit.
// : the band's finish: a light top line, dark to 35 %, a lit strip rising to
// L 46 at 62 %, then black from 66 %, a little lighter on the left (sample by columns at x 200 / 1000 / 1200); the red line a deep #8c0b1a (was #c4161c);
// the chequer bright to 55 % of its run before it fades.
// The on-board car is the followed driver (the leader without one). Left out (no data): the race distance ("OF 500"), the flag light.
import { el, fit, haMark, inkOn, leagueLogo, marks, statusText, FONTS } from '../kit.js';

const S = 1.5, W = 1800, TOP = Math.round(52 * S), TK = Math.round(29 * S), RL = 3, ENTRY = 360, N = 5;
const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'TH' : ['TH', 'ST', 'ND', 'RD'][n % 10] || 'TH');
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return { s: s + suf, first: p[0] || '' }; };

export default {
  id: 'race-espn-10',
  size: { w: W, h: TOP + RL + TK },
  fonts: [FONTS.barlowCond700, FONTS.barlowCond700i],
  css: `
.sb-race-espn-10 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-race-espn-10 .bd { position: absolute; left: 0; right: 0; top: 0; height: ${TOP}px; background: linear-gradient(to right, rgba(255,255,255,.025), rgba(255,255,255,0) 45%, rgba(0,0,0,.1)), linear-gradient(#3c3c3c, #3c3c3c 2%, #121212 3.5%, #0e0e0e 35%, #2e2e2e 62%, #060606 66%, #000); }
/* the chequer: 15 px squares, fading out to the right into the black band */
.sb-race-espn-10 .ck { position: absolute; left: 0; top: ${Math.round(TOP * 0.5)}px; width: 300px; height: ${Math.round(TOP * 0.3)}px;
  background: linear-gradient(to right, rgba(0,0,0,.25), rgba(0,0,0,0) 30%, rgba(0,0,0,.3) 70%, #000), conic-gradient(#d8d8d8 25%, #1a1a1a 0 50%, #d8d8d8 0 75%, #1a1a1a 0) 0 0 / 15px 15px; }
.sb-race-espn-10 .mk { position: absolute; left: 315px; top: ${Math.round(TOP * 0.3)}px; height: ${Math.round(TOP * 0.7)}px; width: 90px; display: grid; place-items: center; }
.sb-race-espn-10 .lp { position: absolute; left: 420px; top: ${Math.round(TOP * 0.3) - 3}px; height: ${Math.round(TOP * 0.7)}px; display: grid; place-items: center; font-size: 40px; font-style: italic; white-space: nowrap; }
/* the on-board tab: raised, lit along its top, sloping ends */
.sb-race-espn-10 .ob { position: absolute; left: 790px; width: 480px; top: ${Math.round(TOP * 0.12)}px; height: ${Math.round(TOP * 0.88)}px; display: flex; align-items: center; gap: 10px; padding: 8px 40px 0; box-sizing: border-box;
  background: linear-gradient(#3a3a3e, #2a2a2c 30%, #161618); clip-path: polygon(0 100%, 26px 0, calc(100% - 26px) 0, 100% 100%); white-space: nowrap; font-size: 30px; }
.sb-race-espn-10 .ob::before { content: ''; position: absolute; left: 26px; right: 26px; top: 0; height: 3px; background: linear-gradient(to right, rgba(255,255,255,.15), rgba(255,255,255,.55), rgba(255,255,255,.15)); }
.sb-race-espn-10 .ob .nm { min-width: 0; overflow: hidden; font-size: 30px; }
.sb-race-espn-10 .pl { flex: none; display: grid; place-items: center; transform: skewX(-18deg); }
.sb-race-espn-10 .pl > b { transform: skewX(18deg); font-style: italic; }
.sb-race-espn-10 .ob .pl { width: 66px; height: 38px; font-size: 34px; }
.sb-race-espn-10 .lg { position: absolute; right: 40px; top: ${Math.round(TOP * 0.2)}px; width: 120px; height: ${Math.round(TOP * 0.8)}px; display: grid; place-items: center; }
.sb-race-espn-10 .lg .sb-league { width: 52px; height: 52px; object-fit: contain; }
.sb-race-espn-10 .lg .sb-league-text { font-size: 30px !important; display: grid; place-items: center; width: auto; font-weight: 700; font-style: italic; letter-spacing: 1px; }
.sb-race-espn-10 .rl { position: absolute; left: 0; right: 0; top: ${TOP}px; height: ${RL}px; background: #8c0b1a; }
.sb-race-espn-10 .tk { position: absolute; left: 0; right: 0; top: ${TOP + RL}px; height: ${TK}px; background: linear-gradient(#0d0d0e, #000); display: flex; overflow: hidden; }
.sb-race-espn-10 .e { width: ${ENTRY}px; flex: none; display: flex; align-items: center; gap: 4px; padding-left: 16px; box-sizing: border-box; white-space: nowrap; overflow: hidden; }
.sb-race-espn-10 .e .p { width: 50px; height: ${TK - 4}px; background: linear-gradient(#f4f4f4, #c9c9cc); color: #111; font-size: 32px; }
.sb-race-espn-10 .e .p > b { font-style: normal; }
.sb-race-espn-10 .e .c { width: 62px; height: ${TK - 4}px; font-size: 38px; margin-right: 8px; }
.sb-race-espn-10 .e .n { min-width: 0; overflow: hidden; font-size: 40px; padding-right: 12px; }
`,
  draw(root, g, { opts, time }) {
    const mk = marks(opts);
    root.appendChild(el('div', 'bd')); root.appendChild(el('div', 'ck'));
    if (mk.ha) { const m = el('div', 'mk'); m.appendChild(haMark(40)); root.appendChild(m); }
    const race = !g.session || g.session === 'Race';
    root.appendChild(fit(el('div', 'lp', g.status === 'live' && race && g.lap ? 'LAP ' + g.lap : g.status === 'final' ? 'FINAL' : g.status === 'pre' ? statusText(g, time) : String(g.session || '').toUpperCase())));
    const plate = (r, cls) => { const p = el('span', 'pl ' + cls); p.appendChild(el('b', '', r.number || '')); const c = r.color || '#d8d8d8'; p.style.background = 'linear-gradient(' + c + ', ' + c + ')'; p.style.color = inkOn(c); return p; };
    const on = g.player || (g.rows || [])[0];
    if (on) {
      const ob = el('div', 'ob'); const n = surname(on);
      const pos = Number(on.pos) || 0;
      ob.append(el('span', '', 'ON BOARD:'), plate(on, 'on'), fit(el('span', 'nm', ((n.first ? n.first.slice(0, 2).toUpperCase() + '. ' : '') + n.s).toUpperCase() + (pos && g.status !== 'pre' ? '-' + ORD(pos) : ''))));
      root.appendChild(ob);
    }
    if (mk.league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, 52)); root.appendChild(lg); }
    root.appendChild(el('div', 'rl'));
    const tk = el('div', 'tk');
    (g.rows || []).slice(0, N).forEach((r, i) => {
      const e = el('span', 'e');
      const p = el('span', 'pl p'); p.appendChild(el('b', '', String(r.pos || i + 1)));
      e.append(p, plate(r, 'c'), fit(el('span', 'n', surname(r).s.toUpperCase())));
      tk.appendChild(e);
    });
    root.appendChild(tk);
  },
};
