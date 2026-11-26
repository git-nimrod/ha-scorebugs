// "Chrome bar '15": after ESPN's college volleyball bar of 2015 (frame: retro catalogue vb-15-1, Nebraska v Texas, the 2015
// championship). A silver chrome frame round a row of dark cells: the network's cell at the left (the Home Assistant mark in its place),
// the set ("SET 2"), each team as a serve cell (an outlined arrow for the team serving), its panel dark at the left rising to the team's
// colour at the right with rank and name in white condensed capitals, and its points in a dark cell; a light status box at the right
// ("NEBRASKA LEADS 1 - 0") in black condensed capitals; gold end caps. Timeouts as yellow-green dashes under each team; the round in a
// dark tab with a chrome rim over the middle of the bar.
// Measured: bar 1184 x 64, cells 50 tall inside a 7 px chrome frame with 8-10 px chrome dividers;
// network cell 155, set cell 127, serve cell 37, team panels 175 / 215, score cells 68 / 70, status box 243; names cap 0.6 of the cell,
// figures 0.8; timeout dashes 56 x 7, two per team; round tab 760 x 37 centred over the teams.
// measured on the real stills:
// each team panel is near black on its left and along its top (L 5-13), the colour only in the lower right, and deep there (Nebraska
// #6b0006, L 21; Texas #834e19, L 38); a halftone dot screen shows in the coloured part. Names cap 0.5 of the cell (was 0.6) with a dark
// edge round the letters, figures cap 0.7 (was 0.8). The round tab shows the stage only ("NATIONAL CHAMPIONSHIP", the part of the
// note after its dash) and fits its tab.
// the black lies along the whole top of each panel and the colour fills its
// lower half, a little darker at the left (Nebraska: top #120c08 across, foot #380c10 / #59010b / #680006 left to right; Texas foot
// #342210 / #543314 / #5e3812); the colour was only in the lower right before. The names sit in the middle of their panels, as on air.
import { el, logo, statusText, teamColor, FONTS, fit, scoreSlot, haMark, marks, shade, dots, textOutline } from '../kit.js';

const W = 1184, BAR = 64, HEAD = 37, TO = 9, CELL = 50, F = 7;
const top = (g) => (g.note ? HEAD : 0);
const CHROME = 'linear-gradient(#f4f5f6, #c9ccd0 22%, #8d9298 48%, #5d6268 52%, #a6abb1 78%, #e6e8ea)';
const BARCHROME = 'linear-gradient(#f4f5f6, #c9ccd0 22%, #8d9298 48%, #5d6268 52%, #a6abb1 78%, #2a2c2f 88%, #cfd3d6 93%, #7b8085 96%, #050606)';
const DARK = 'linear-gradient(#45474b, #2b2c2f 45%, #1d1e20 55%, #2a2b2e)';

export default {
  id: 'vb-espn-15',
  size: { w: W, h: HEAD + BAR + TO },
  sizeFor: (g) => ({ w: W, h: top(g) + BAR + (g.status === 'live' ? TO : 0) }),
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-vb-espn-15 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-vb-espn-15 .hd { position: absolute; top: 0; left: 226px; width: 760px; height: ${HEAD + 2}px; box-sizing: border-box; padding: 3px 3px 0; border-radius: 7px 7px 0 0; background: ${CHROME}; }
.sb-vb-espn-15 .hd > span { display: grid; place-items: center; height: 100%; border-radius: 5px 5px 0 0; background: ${DARK}; font-size: 30px; letter-spacing: .03em; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-vb-espn-15 .bar { position: absolute; left: 0; width: ${W}px; height: ${BAR}px; box-sizing: border-box; padding: ${F}px 8px; display: flex; gap: 9px; border-radius: 3px; background: ${BARCHROME}; box-shadow: inset 0 1px 0 rgba(255,255,255,.8); }
/* the black strip under the bar: the timeouts sit in it (the stills show the bar's foot black with the dashes in it) */
.sb-vb-espn-15 .bk { position: absolute; left: 0; width: ${W}px; height: ${TO}px; background: linear-gradient(#0b1210, #050606); border-radius: 0 0 3px 3px; }
.sb-vb-espn-15 .bar::before, .sb-vb-espn-15 .bar::after { content: ''; position: absolute; top: 0; bottom: 0; width: 6px; background: linear-gradient(#e9d48a, #a8892f 50%, #6e5a1c 52%, #c9ab4f); }
.sb-vb-espn-15 .bar::before { left: 0; border-radius: 3px 0 0 3px; } .sb-vb-espn-15 .bar::after { right: 0; border-radius: 0 3px 3px 0; }
.sb-vb-espn-15 .c { flex: none; height: ${CELL}px; display: flex; align-items: center; justify-content: center; background: ${DARK}; box-shadow: inset 0 0 0 1px rgba(0,0,0,.6); white-space: nowrap; overflow: hidden; line-height: 1; }
.sb-vb-espn-15 .net { width: 155px; color: #e8e9eb; }
.sb-vb-espn-15 .st { width: 127px; font-size: 40px; }
/* the serving arrow sits in the team's own panel, at its left, with no cell of its own */
.sb-vb-espn-15 .tm .sv { position: absolute; left: 8px; top: 50%; margin-top: -16px; width: 28px; height: 32px; }
.sb-vb-espn-15 .tm .sv i { width: 0; height: 0; border-top: 16px solid transparent; border-bottom: 16px solid transparent; border-left: 26px solid #b8bbbf; position: relative; left: 2px; display: block; }
.sb-vb-espn-15 .sv i::after { content: ''; position: absolute; left: -23px; top: -11px; border-top: 11px solid transparent; border-bottom: 11px solid transparent; border-left: 18px solid #2f3033; }
.sb-vb-espn-15 .tm { justify-content: flex-end; gap: 7px; padding: 0 10px 0 40px; box-sizing: border-box; position: relative; }
.sb-vb-espn-15 .tm::after { content: ''; position: absolute; inset: 0; background-image: var(--dots); background-size: var(--dots-size); pointer-events: none; }
.sb-vb-espn-15 .tm > * { position: relative; z-index: 1; }
.sb-vb-espn-15 .tm .sb-logo { display: none; }
.sb-vb-espn-15 .tm .rk { font-size: 24px; flex: none; text-shadow: ${textOutline(1.5, '#000')}; }
.sb-vb-espn-15 .tm .nm { font-size: 36px; letter-spacing: .01em; min-width: 0; overflow: hidden; text-shadow: ${textOutline(1.5, '#000')}, 0 2px 3px rgba(0,0,0,.6); }
.sb-vb-espn-15 .sc { width: 69px; font-size: 46px; }
.sb-vb-espn-15 .sc .sb-num { min-width: 0 !important; }
.sb-vb-espn-15 .ms { flex: 1; min-width: 0; margin-left: 8px; justify-content: flex-start; padding: 0 10px; box-sizing: border-box; background: linear-gradient(#ffffff, #eceeef 45%, #d9dcde 55%, #c7cacd); color: #0c0c0d; font-size: 32px; font-stretch: 80%; letter-spacing: -.01em; box-shadow: inset 0 0 0 1px rgba(0,0,0,.35); }
.sb-vb-espn-15 .ms .sb-rec { font-size: .8em; }
.sb-vb-espn-15 .to { position: absolute; z-index: 2; height: 7px; display: flex; gap: 12px; }
.sb-vb-espn-15 .to i { width: 56px; height: 7px; background: linear-gradient(#e4ec6a, #b9c62a); }
.sb-vb-espn-15 .to i.used { opacity: .2; }
`,
  draw(root, g, { time, opts }) {
    const y = top(g), live = g.status === 'live';
    // the stage only: "NCAA Women's Volleyball Championship - National Championship" shows as NATIONAL CHAMPIONSHIP, as on air
    if (g.note) { const hd = el('div', 'hd'); hd.appendChild(fit(el('span', '', String(g.note).split(/\s+-\s+/).pop().toUpperCase()))); root.appendChild(hd); }
    const bar = el('div', 'bar'); bar.style.top = y + 'px';
    const net = el('div', 'c net');
    if (marks(opts).ha) net.appendChild(haMark(40));
    const set = el('div', 'c st', live ? 'SET ' + (g.period.label || '1') : g.status === 'final' ? 'FINAL' : statusText(g, time));
    bar.append(net, fit(set));
    // the big figure: the points of the set being played; after the match, the sets won
    const pts = (t) => (live ? ((t.sets || []).length ? t.sets[t.sets.length - 1] : t.score) : g.status === 'final' ? t.score : null);
    const xs = [];
    [[g.away, 175], [g.home, 215]].forEach(([t, w]) => {
      const c = teamColor(t, '#5a5d63');
      const tm = el('div', 'c tm'); tm.style.width = (w + 37) + 'px';
      // near black on the left and along the top, the team's colour (deepened) only in the lower right, a halftone dot screen over it
      tm.style.background = 'linear-gradient(rgba(14,11,9,.78), rgba(14,11,9,.7) 22%, rgba(14,11,9,.08) 40%, rgba(14,11,9,0) 56%, rgba(0,0,0,.06) 76%, rgba(0,0,0,.38)), '
        + 'linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.25) 16%, rgba(0,0,0,.08) 40%, rgba(0,0,0,0) 70%), ' + shade(c, -0.3);
      const dt = dots(4, '#000000', 0.3);
      tm.style.setProperty('--dots', dt.image); tm.style.setProperty('--dots-size', dt.size);
      if (live && t.hasBall) { const sv = el('div', 'sv'); sv.appendChild(el('i')); tm.appendChild(sv); }
      if (t.rank && t.rank <= 25) tm.appendChild(el('span', 'rk', String(t.rank)));
      tm.appendChild(fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase()));
      const v = pts(t), sc = el('div', 'c sc');
      sc.appendChild(scoreSlot(el('span', '', v != null ? String(v) : ''), g));
      bar.append(tm, sc);
      xs.push(w);
    });
    // the status box: who leads the match (sets won) while it runs; "BEST OF 5" before it
    // a long school name gives way to its code, so the status box keeps its size
    const nm = (t) => ((t.name || '').length <= 10 ? t.name : t.abbr || t.name || '').toUpperCase();
    let msg = 'BEST OF 5';
    if (live) {
      const a = g.away.score || 0, h = g.home.score || 0, lead = a > h ? g.away : h > a ? g.home : null;
      msg = lead ? nm(lead) + ' LEADS ' + Math.max(a, h) + ' - ' + Math.min(a, h) : 'MATCH TIED ' + a + ' - ' + h;
    } else if (g.status === 'final') {
      const w = g.away.winner ? g.away : g.home.winner ? g.home : null;
      msg = w ? nm(w) + ' WINS ' + Math.max(w.score || 0, 0) + ' - ' + Math.min(g.away.score || 0, g.home.score || 0) : 'FINAL';
    }
    const ms = el('div', 'c ms'); ms.appendChild(fit(el('span', '', msg)));
    bar.appendChild(ms);
    root.appendChild(bar);
    if (live) { const bk = el('div', 'bk'); bk.style.top = (y + BAR) + 'px'; root.appendChild(bk); }
    // timeouts: yellow-green dashes under each team's panel, only while the match runs and the feed gives them
    if (live) [[g.away, 8 + 155 + 9 + 127 + 9 + 37], [g.home, 8 + 155 + 9 + 127 + 9 + 37 + 175 + 9 + 69 + 9 + 37]].forEach(([t, x], i) => {
      if (t.timeouts == null) return;
      const to = el('div', 'to'); to.style.left = (x + 12) + 'px'; to.style.top = (y + BAR + 1) + 'px';
      for (let k = 0; k < 2; k++) to.appendChild(el('i', k >= t.timeouts ? 'used' : ''));
      root.appendChild(to);
    });
  },
};
