// "Black bar '22": after ESPN's NBA regular-season bug (2022-24). A compact smoked-black bar: the network's mark at the left (here the Home
// Assistant logo), then the away team in a block of its colour and the home team in a white block in its colour's ink, each with its
// letters and a heavy score; then the quarter and the clock dark on a white pill. Under it, on the same smoked band, each team's record
// under its block and the night under the clock, the league's logo between the words. The conference rank and the shot clock are left
// out (no data). On the frame the home team sat on white; one frame only, so the reviewer should check other games.
import { el, statusText, teamColor, panelInk, contrast, shade, haMark, marks, scoreSlot, leagueLogo, fit, FONTS } from '../kit.js';

// measured off the frame: the mark's room 12% of the bar, each team block 27%
const ROW = 60, SUB = 34, H = ROW + SUB + 8, MARK = 112, TEAM = 252, CLOCK = 308, W = MARK + 2 * TEAM + CLOCK + 8;
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default {
  id: 'nba-espn-22',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nba-espn-22 { font-family: 'SB Archivo', 'Arial', sans-serif; color: #fff; display: grid; height: ${H}px; padding: 4px; box-sizing: border-box;
  grid-template-columns: ${MARK}px ${TEAM}px ${TEAM}px ${CLOCK}px; grid-template-rows: ${ROW}px ${SUB}px;
  background: linear-gradient(rgba(22,23,26,.9), rgba(8,8,10,.82)); box-shadow: 0 3px 10px rgba(0,0,0,.45); }
.sb-nba-espn-22 .mk { display: grid; place-items: center; } .sb-nba-espn-22 .mk .sb-ha { color: #fff; }
.sb-nba-espn-22 .tm { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 0 16px; min-width: 0; font-weight: 800; font-stretch: 108%; }
.sb-nba-espn-22 .tm { box-shadow: inset 0 0 0 2px rgba(255,255,255,.2); }   /* a thin inner border on each block */
.sb-nba-espn-22 .tm.h { box-shadow: inset 0 0 0 2px rgba(0,0,0,.14), inset 0 -3px 0 rgba(0,0,0,.12); }
.sb-nba-espn-22 .ab { font-size: 34px; white-space: nowrap; letter-spacing: .5px; }
/* the score set against the block's right end, as on air (a two-figure score no longer floats in the middle of its room) */
.sb-nba-espn-22 .sc { font-size: 50px; line-height: 1; letter-spacing: .5px; text-align: right; }
.sb-nba-espn-22 .ck { display: flex; align-items: center; justify-content: center; gap: 16px; font-weight: 500; font-size: 32px; font-stretch: 105%; }
.sb-nba-espn-22 .ck sup { font-size: .55em; vertical-align: .7em; }
.sb-nba-espn-22 .pill { padding: 3px 26px; border-radius: 999px; background: linear-gradient(#ffffff, #e3e4e6); color: #121214; font-weight: 800; font-size: 36px; line-height: 1.1; white-space: nowrap; }
.sb-nba-espn-22 .pill.w { font-size: 26px; padding: 5px 20px; }
.sb-nba-espn-22 .rc { display: flex; align-items: center; padding: 0 16px; font-size: 22px; font-weight: 700; letter-spacing: 1px; color: #e6e6e8; white-space: nowrap; }
.sb-nba-espn-22 .nt { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 22px; font-weight: 600; letter-spacing: 2px; white-space: nowrap; }
.sb-nba-espn-22 .nt img, .sb-nba-espn-22 .nt .sb-league { width: 26px; height: 26px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(46));
    const block = (t, home) => {
      const c = teamColor(t, '#3a3f47');
      const b = el('div', 'tm' + (home ? ' h' : ''));
      if (home) { b.style.background = 'linear-gradient(#ffffff, #e4e5e8)'; b.style.color = [c, t.color2].find((x) => /^#[0-9a-f]{6}$/i.test(x || '') && contrast(x, '#ffffff') >= 3) || '#121214'; }
      else { b.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.08) + ')'; b.style.color = panelInk(t, c); }
      b.appendChild(fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      if (g.status !== 'pre') b.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      return b;
    };
    const ck = el('div', 'ck');
    if (live) {
      const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (!g.period.word && g.period.suffix) q.appendChild(el('sup', '', g.period.suffix.toUpperCase()));
      ck.append(q, el('span', 'pill', g.clock || ''));
    } else ck.appendChild(el('span', 'pill w', statusText(g, time)));
    const nt = el('div', 'nt');
    nt.append(el('span', '', g.league || 'NBA'), leagueLogo(g, 26), el('span', '', DAYS[new Date(g.starts).getDay()]));
    root.append(mk, block(g.away, false), block(g.home, true), ck, el('span', ''), el('div', 'rc', g.away.record || ''), el('div', 'rc', g.home.record || ''), nt);
  },
};
