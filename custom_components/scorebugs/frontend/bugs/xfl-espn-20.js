// "Slate bar '20": after the 2020 spring league's bar on ABC and ESPN (frames: New York v St. Louis, 3rd 3:09, 2nd & 6; the same game
// at 2nd 1:08 and with a yellow FLAG in the down's place). One long dark slate bar across the foot of the picture with a dark red line
// along its bottom: the league's logo at the left end, then for each team a panel with its colour behind the logo at its left end fading
// into the slate and a line of the colour along its top, the code in white italic capitals over the record and three timeout dashes, and
// the big white italic score; a small light arrow points at the score of the team with the ball. After the teams the quarter and the
// clock in white, and the down and distance on a near-black tab with a light outline and a pointed right end. The same plan as the
// league's 2023-24 white bar (White bar '23).
// Measured on the 720p frame (stage px = frame px x 1.5, as the 2023 bar's 1080p frame): the bar 84 tall with a 5 px dark
// red line at its foot; league part 278, team parts 432; the team colour solid to about 100 px in, gone by 200; its top line 6. Sampled
// (sample.py): the slate #525969 at the top to #343b4b by 60 % (a lit top third), the team parts #4a5062 at the top to #2c3042 (L 38 -> 22), the tab
// #14181e. Letters: codes cap 30, records 14, scores 45, all italic.
// Left out (no data): the point spread after the code, the over/under box, the play clock and the FLAG state; the bar closes up where
// they were.
import { el, logo, leagueLogo, statusText, teamColor, vividColor, relight, fit, scoreSlot, stripes, FONTS } from '../kit.js';
// - each team's score area is a glass box: lit +8 L at the top under a light line, a horizon 44 % down, a deeper foot (sample.py --grid on
// the 3rd 3:09 still: the score areas lit +4..+7 L at the top, horizon 42-47 %), parted from the code by a thin light edge;
// - the league's section carries fine diagonal lines (faint, 7 px apart, leaning like the bar's background pattern on air);
// - a triangle at the inner end of each score box, as on every still: white for the team with the ball, a dim slate for the other
// (the reading taken: both boxes carry it, the one with the ball lit);
// - the quarter and clock in a light round geometric face (Outfit 400), closer to the still's thin round figures than Archivo 500.

const H = 84, LG = 278, TEAM = 432, CLK = 270, TAB = 300, END = 30;
const SC_ROOM = 96;   // before the game there is no score: each team part closes up by this
const W = LG + 2 * TEAM + CLK + TAB + END;

// a colour's lightness, L* 0-100
function lightness(hex) {
  const v = (hex || '#000000').replace('#', '').match(/../g).map((x) => { const c = parseInt(x, 16) / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  const y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (24389 / 27) * y;
}

export default {
  id: 'xfl-espn-20',
  size: { w: W, h: H },
  sizeFor: (g) => {
    const live = g.status === 'live', tab = live && g.football && g.football.short;
    return { w: W - (g.status === 'pre' ? 2 * SC_ROOM : 0) - (tab ? 0 : TAB), h: H };
  },
  fonts: [FONTS.archivo, FONTS.archivoItalic, FONTS.outfit],
  css: `
.sb-xfl-espn-20 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-style: italic; color: #f4f6fa; }
.sb-xfl-espn-20 .bar { position: absolute; inset: 0; background: linear-gradient(#5a6170, #525969 10%, #3e4555 40%, #343b4b 62%, #313849 90%, #6b0115 94%, #5a0311); box-shadow: 0 2px 6px rgba(0,0,0,.4); overflow: hidden; }
.sb-xfl-espn-20 .lgz { position: absolute; left: 0; top: 0; width: ${LG}px; height: ${H - 5}px; display: grid; place-items: center; background: ${stripes(7, 120, '#ffffff', 0.06, 2)}; }
/* the glass box behind each score; loop pass 1: its top band reads L 38 on air, ours
 was 47, so the lit top is a little softer (+10 % white, was +17 %) */
.sb-xfl-espn-20 .sg { right: 0; top: 0; width: 132px; height: 100%; background: linear-gradient(rgba(255,255,255,.24), rgba(255,255,255,0) 2px), linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.06) 42%, rgba(255,255,255,0) 46%, rgba(0,0,0,.14));
  box-shadow: inset 1px 0 0 rgba(220,226,236,.35); }
/* a team panel: its colour behind the logo fading into darker slate, a 6 px line of the colour along its top, a thin light outline */
.sb-xfl-espn-20 .tm { position: absolute; top: 2px; height: ${H - 9}px; box-shadow: inset 0 0 0 1px rgba(200,206,220,.35); overflow: hidden; }
.sb-xfl-espn-20 .tm > * { position: absolute; }
.sb-xfl-espn-20 .tile { left: 4px; top: 4px; width: 112px; height: ${H - 15}px; display: grid; place-items: center; }
.sb-xfl-espn-20 .tile .sb-logo { width: 104px; height: 68px; object-fit: contain; }
.sb-xfl-espn-20 .ab { left: 120px; top: 8px; height: 40px; max-width: 170px; display: flex; align-items: center; font-size: 44px; font-weight: 800; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-xfl-espn-20 .rc { left: 122px; top: 50px; font-size: 21px; font-weight: 600; color: #dfe3ea; line-height: 1; white-space: nowrap; }
.sb-xfl-espn-20 .to { left: 172px; top: 55px; display: flex; gap: 9px; }
.sb-xfl-espn-20 .to i { width: 30px; height: 8px; background: var(--tc); transform: skewX(-12deg); }
.sb-xfl-espn-20 .to i.used { background: rgba(200,206,220,.3); }
.sb-xfl-espn-20 .sc { right: 32px; top: 0; height: ${H - 9}px; display: grid; place-items: center end; font-size: 68px; font-weight: 800; line-height: 1; min-width: 0 !important; }
.sb-xfl-espn-20 .ar { right: 6px; top: 19px; width: 0; height: 0; border-top: 18px solid transparent; border-bottom: 18px solid transparent; border-right: 16px solid #6c7486; }
.sb-xfl-espn-20 .ar.on { border-right-color: #f1f3f6; }
.sb-xfl-espn-20 .clk { position: absolute; top: 0; height: ${H - 5}px; display: flex; align-items: center; gap: 26px; padding-left: 24px; font-family: 'SB Outfit', 'SB Archivo', sans-serif; font-style: normal; font-weight: 400; letter-spacing: .5px; white-space: nowrap; line-height: 1; font-size: 42px; }
.sb-xfl-espn-20 .clk .w { font-size: 30px; font-style: italic; font-weight: 600; }
/* the down tab: near black, a light 2 px outline, square at the left and pointed at the right, 16 px deep */
.sb-xfl-espn-20 .tab { position: absolute; top: 16px; width: ${TAB}px; height: 48px; background: #c9ced8; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%); }
.sb-xfl-espn-20 .tab span { position: absolute; inset: 2px 3px 2px 2px; background: #14181e; clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%);
  display: grid; place-items: center; font-weight: 800; font-size: 40px; line-height: 1; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    const T = TEAM - (pre ? SC_ROOM : 0);
    const bar = el('div', 'bar');
    const lgz = el('div', 'lgz'); lgz.appendChild(leagueLogo(g, 70)); bar.appendChild(lgz);
    [g.away, g.home].forEach((t, k) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm'); tm.style.left = LG + k * T + 'px'; tm.style.width = T - 8 + 'px';
      // the team's colour behind the logo, gone into the slate by 200 px; its line along the top (sampled #8e0f22 on New York's red)
      tm.style.background = 'linear-gradient(' + relight(c, -4) + ' 0 6px, transparent 6px), linear-gradient(90deg, ' + c + ' 0, ' + relight(c, -6) + ' 100px, rgba(53,57,77,.85) 200px), linear-gradient(#4a5062, #35394d 30%, #2c3042)';
      const tile = el('div', 'tile'); tile.appendChild(logo(t, 68)); tm.appendChild(tile);
      // the timeout dashes in the team's colour, white where that colour would sink into the slate (St. Louis's navy)
      const v = vividColor(t, '#c9ced8');
      tm.style.setProperty('--tc', lightness(v) < 38 ? '#f1f3f6' : v);
      tm.appendChild(fit(el('div', 'ab', (t.abbr || '').toUpperCase())));
      tm.appendChild(el('div', 'rc', t.record || ''));
      if (live && t.timeouts != null) { const to = el('div', 'to'); for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : '')); tm.appendChild(to); }
      if (!pre) { tm.appendChild(el('i', 'sg')); tm.appendChild(scoreSlot(el('div', 'sc', t.score != null ? String(t.score) : ''), g)); }
      if (live) tm.appendChild(el('i', 'ar' + (t.hasBall ? ' on' : '')));
      bar.appendChild(tm);
    });
    const clk = el('div', 'clk'); clk.style.left = LG + 2 * T + 'px';
    if (live) clk.append(el('span', '', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toLowerCase())), el('span', '', g.clock || ''));
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(clk);
    const dn = live && g.football && g.football.short ? g.football.short.replace(/^(\d)(ST|ND|RD|TH)/, (a, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : '';
    if (dn) { const tab = el('div', 'tab'); tab.style.left = LG + 2 * T + CLK + 'px'; tab.appendChild(el('span', '', dn)); bar.appendChild(tab); }
    root.appendChild(bar);
  },
};
