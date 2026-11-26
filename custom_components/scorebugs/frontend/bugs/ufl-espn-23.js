// "White bar '23": after the spring league's bar on ESPN and ABC, 2023-24 (frames: Arlington v DC 2024, 2nd 10:39, 4th & 2; Arlington v
// DC 2023, 3rd 13:25, the week line in the down's place; DC v Vegas 2023). One long white bar across the foot of the picture: the league's
// logo at the left end, then for each team a square tile in its colour holding its logo, the code in heavy wide capitals over the record
// and three timeout dashes in the team's colour, and the big black score; a small arrow in the team's colour points at the score of the
// team with the ball. After the teams a thin dark rule, the quarter and the clock in black, and the down and distance in white italic on
// a dark chevron tab. The team parts are a touch whiter than the rest of the bar, which greys towards its foot.
// Measured on the 1080p frame (stage px = frame px): the bar 80 tall; league part 280; each team part 430, its tile 111 x
// 72 from 2 in; code cap 28 from 120 in; record cap 15; dashes 32 x 7, 8 apart; score cap 45 ending 30 before the part's end; the arrow
// 17 x 38. The tab 300 x 47, its ends cut 11-12 deep (geomdiff: each end bows 8 px on the frame). Sampled: team parts #f9fef8 -> #edf2ec, the rest #e8f0e3 -> #bdc2bc at the foot;
// tab #0d1313.
// Left out (no data): the point spread after the code, the over/under box and the play clock; the bar closes up where they were. The
// small red bar under the first timeout dash (meaning unknown) is left out too.
import { el, logo, leagueLogo, statusText, teamColor, vividColor, fit, scoreSlot, FONTS } from '../kit.js';

const H = 80, LG = 280, TEAM = 430, CLK = 270, TAB = 300, END = 30;
const SC_ROOM = 96;   // before the game there is no score: each team part closes up by this
const W = LG + 2 * TEAM + CLK + TAB + END;

export default {
  id: 'ufl-espn-23',
  size: { w: W, h: H },
  sizeFor: (g) => {
    const live = g.status === 'live', tab = live && g.football && g.football.short;
    return { w: W - (g.status === 'pre' ? 2 * SC_ROOM : 0) - (tab ? 0 : TAB), h: H };
  },
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-ufl-espn-23 { font-family: 'SB Archivo', 'Arial Black', sans-serif; color: #121212; }
.sb-ufl-espn-23 .bar { position: absolute; inset: 0; background: linear-gradient(#e9efe5, #e7efe4 55%, #d7dfd4 70%, #c3c8c2 92%, #c8cdc6); box-shadow: 0 2px 6px rgba(0,0,0,.35); overflow: hidden; }
.sb-ufl-espn-23 .lgz { position: absolute; left: 0; top: 0; width: ${LG}px; height: ${H}px; display: grid; place-items: center; }
.sb-ufl-espn-23 .tm { position: absolute; top: 0; height: ${H}px; background: linear-gradient(#f9fef8, #f9fef8 72%, #edf2ec); }
.sb-ufl-espn-23 .tm > * { position: absolute; }
.sb-ufl-espn-23 .tile { left: 2px; top: 4px; width: 111px; height: 72px; display: grid; place-items: center; overflow: hidden; }
.sb-ufl-espn-23 .tile .sb-logo { width: 100px; height: 66px; object-fit: contain; }
.sb-ufl-espn-23 .ab { left: 120px; top: 10px; height: 44px; max-width: 170px; display: flex; align-items: center; font-size: 41px; font-weight: 800; font-stretch: 100%; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-ufl-espn-23 .rc { left: 124px; top: 51px; font-size: 22px; font-weight: 500; color: #3c3f42; line-height: 1; white-space: nowrap; }
.sb-ufl-espn-23 .to { left: 172px; top: 55px; display: flex; gap: 8px; }
.sb-ufl-espn-23 .to i { width: 32px; height: 7px; background: var(--tc); }
.sb-ufl-espn-23 .to i.used { background: #c9ccc9; }
.sb-ufl-espn-23 .sc { right: 30px; top: 0; height: ${H}px; display: grid; place-items: center end; font-size: 66px; font-weight: 800; font-stretch: 112%; line-height: 1; min-width: 0 !important; }
.sb-ufl-espn-23 .ar { right: 5px; top: 21px; width: 0; height: 0; border-top: 19px solid transparent; border-bottom: 19px solid transparent; border-right: 17px solid var(--tc); }
.sb-ufl-espn-23 .clk { position: absolute; top: 0; height: ${H}px; display: flex; align-items: center; gap: 22px; padding-left: 22px; font-weight: 700; font-stretch: 100%; white-space: nowrap; line-height: 1; }
.sb-ufl-espn-23 .clk::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; background: #3a3d40; }
.sb-ufl-espn-23 .clk .q { font-size: 30px; font-weight: 800; } .sb-ufl-espn-23 .clk .c { font-size: 40px; letter-spacing: .01em; }
.sb-ufl-espn-23 .clk .w { font-size: 30px; font-style: italic; color: #4a4d50; }
/* the down tab: a dark chevron, its left end notched and its right end pointed, 15 px deep */
.sb-ufl-espn-23 .tab { position: absolute; top: 16px; width: ${TAB}px; height: 47px; background: #0d1313; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 11px 50%);
  display: grid; place-items: center; color: #fff; font-style: italic; font-weight: 700; font-size: 40px; line-height: 1; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const T = TEAM - (pre ? SC_ROOM : 0);
    const bar = el('div', 'bar');
    const lgz = el('div', 'lgz'); lgz.appendChild(leagueLogo(g, 76)); bar.appendChild(lgz);
    [g.away, g.home].forEach((t, k) => {
      const tm = el('div', 'tm'); tm.style.left = LG + k * T + 'px'; tm.style.width = T + 'px';
      // the tile in the team's colour (a light first colour gives way to the darker one, as Arlington's black tile)
      const tile = el('div', 'tile'); tile.style.background = teamColor(t, '#3a3f47'); tile.appendChild(logo(t, 66)); tm.appendChild(tile);
      tm.style.setProperty('--tc', vividColor(t, '#3a3f47'));
      tm.appendChild(fit(el('div', 'ab', (t.abbr || '').toUpperCase())));
      tm.appendChild(el('div', 'rc', t.record || ''));
      if (live && t.timeouts != null) { const to = el('div', 'to'); for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : '')); tm.appendChild(to); }
      if (!pre) tm.appendChild(scoreSlot(el('div', 'sc', t.score != null ? String(t.score) : ''), g));
      if (live && t.hasBall) tm.appendChild(el('i', 'ar'));
      bar.appendChild(tm);
    });
    const clk = el('div', 'clk'); clk.style.left = LG + 2 * T + 'px';
    if (live) clk.append(el('span', 'q', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toLowerCase())), el('span', 'c', g.clock || ''));
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(clk);
    const dn = live && g.football && g.football.short ? g.football.short.replace(/^(\d)(ST|ND|RD|TH)/, (a, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '';
    if (dn) { const tab = el('div', 'tab', dn); tab.style.left = LG + 2 * T + CLK + 'px'; bar.appendChild(tab); }
    root.appendChild(bar);
  },
};
