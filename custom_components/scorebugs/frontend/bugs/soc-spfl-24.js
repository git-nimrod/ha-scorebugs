// "Logo slabs '24": after the Scottish Premiership's world-feed bug (2024-25; frame: reference pack SOC0236-spfl, Hibernian v Hearts,
// 12:52). The league's logo on a light grey tile, then the home team's
// letters on a slab of its colour, both scores on a dark see-through block, the away team's slab, and the clock on a dark see-through
// block. The team slabs are a little see-through too (the pitch tints them on air). Flat, square corners, white letters.
// Measured: tiles 45 / 65 / 68 / 66 / 77 wide; letters cap
// 0.46 of the bar, figures and clock the same; dark blocks #323b34 over grass (black at about 75 %), slabs muted (team colour at 88 %).
// "This gets a glass element all the way across. Have the logo's on the inside fade to black QUICKLY. Outer parts
// should be more transparent backgrounds with the glass." Read as: one glass cover over the whole bar (lit top to a horizon 38 % down,
// darker foot; the 2017-19 glass numbers, the frame is too small to read its own); each team slab keeps its colour over its outer
// three quarters and drops to black over the last quarter by the scores; the outer ends (the league tile, the clock) more see-through
// (60 % and 55 %) under the same glass.
import { el, soccerClock, homeFirst, leagueLogo, marks, teamColor, teamInk, alpha, FONTS, scoreSlot, fit } from '../kit.js';

// the glass over the whole bar, laid under the letters of every tile (all one height, so it runs on unbroken): a light top down to a
// horizon at 38 %, a step, then darker to the foot
const GL = 'linear-gradient(rgba(255,255,255,.26), rgba(255,255,255,.12) 36%, rgba(255,255,255,0) 40%, rgba(0,0,0,.08) 41%, rgba(0,0,0,.26))';
const H = 60, LG = 76, TM = 110, SC = 115, AW = 112, CK = 130, W = LG + TM + SC + AW + CK;

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-spfl-24',
  size: { w: W, h: H },
  fonts: [FONTS.outfit],
  css: `
.sb-soc-spfl-24 { font-family: 'SB Outfit', Arial, sans-serif; font-weight: 800; color: #f4f4f4; }
.sb-soc-spfl-24 .row { position: absolute; left: 0; top: 0; height: ${H}px; display: flex; }
.sb-soc-spfl-24 .row > div { height: ${H}px; box-shadow: inset 0 1px 0 rgba(255,255,255,.4); display: grid; place-items: center; box-sizing: border-box; white-space: nowrap; overflow: hidden; }
.sb-soc-spfl-24 .lg { width: ${LG}px; background: ${GL}, rgba(198, 202, 206, .6); }
.sb-soc-spfl-24 .lg .sb-league { width: 52px; height: 52px; object-fit: contain; }
/* letters: cap 0.46 of the bar (27.4 px / Outfit's 0.676) */
.sb-soc-spfl-24 .tm { padding: 0 8px; font-size: 40px; line-height: 1; }
.sb-soc-spfl-24 .tm.h { width: ${TM}px; } .sb-soc-spfl-24 .tm.a { width: ${AW}px; }
.sb-soc-spfl-24 .sc { width: ${SC}px; background: ${GL}, rgba(20, 26, 22, .78); display: flex !important; align-items: center; justify-content: center; gap: 26px; font-size: 40px; line-height: 1; font-weight: 700; }
.sb-soc-spfl-24 .sc .sb-num { min-width: .7em !important; }
.sb-soc-spfl-24 .ck { width: ${CK}px; background: ${GL}, rgba(20, 24, 14, .55); font-size: 40px; line-height: 1; font-weight: 700; font-variant-numeric: tabular-nums; padding: 0 8px; }
.sb-soc-spfl-24 .ck.when { font-size: 26px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const row = el('div', 'row');
    const lg = el('div', 'lg');
    if (mk.league) lg.appendChild(leagueLogo(g, 52));
    const team = (t, k) => {
      const c = teamColor(t, '#3a3f47'), n = el('div', 'tm ' + k);
      // the team's colour over the outer three quarters, then quickly to black by the scores
      const dir = k === 'h' ? '90deg' : '270deg';
      n.style.background = GL + ', linear-gradient(' + dir + ', ' + alpha(c, 0.6) + ' 72%, ' + alpha('#000000', 0.88) + ')'; n.style.color = teamInk(c);
      n.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      return n;
    };
    const live = g.status !== 'pre';
    const sc = el('div', 'sc');
    // before the kick-off the figure slots stay empty: the kit puts each team's record in them
    sc.append(scoreSlot(el('span', '', live && h.score != null ? String(h.score) : ''), g), scoreSlot(el('span', '', live && a.score != null ? String(a.score) : ''), g));
    const clock = mmss(soccerClock(g, time));
    row.append(lg, team(h, 'h'), sc, team(a, 'a'), el('div', 'ck' + (clock.length > 5 ? ' when' : ''), clock));
    root.appendChild(row);
  },
};
