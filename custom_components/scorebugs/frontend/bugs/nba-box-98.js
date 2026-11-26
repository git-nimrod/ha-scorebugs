// "Box '98": after the NBA score box on NBC (1996-98). A small box low in the corner: the league's logo standing tall at the left
// (red over blue), then a steel-blue box with the two teams' names and scores in heavy condensed capitals with black outlines, and a
// bottom row with the quarter on a bright blue tab and the clock in LCD digits in a dark window. The network's mark under the logo
// becomes the Home Assistant logo. Drawn soft, with scanlines, the way it looked on a 1998 TV (bug_tv: clean turns that off).
import { el, statusText, leagueLogo, haMark, marks, fit } from '../kit.js';

const W = 400, H = 170, TALL = 74;

export default {
  id: 'nba-box-98',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [{ family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', desc: { weight: '700' } },
    { family: 'SB DSEG7', file: 'dseg7-classic-bold.woff2', desc: { weight: '700' } }],
  css: `
.sb-nba-box-98 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #f4f4ee; }
.sb-nba-box-98 .tall { position: absolute; left: 0; top: 0; width: ${TALL}px; height: ${H}px; overflow: hidden; border-radius: 6px 0 0 6px;
  background: none; }
/* the whole logo inside its column above the mark, whatever its shape: a square or wide league logo shrinks to fit instead of being cut
 */
.sb-nba-box-98 .tall .sb-league { position: absolute; left: 50%; top: 6px; width: ${TALL - 8}px; height: ${H - 52}px; transform: translateX(-50%); object-fit: contain; }
/* the NBA's tall logo runs top to bottom of its column, as on air: ESPN's
 file is square with the artwork 0.91 of its height and 0.39 of its width, so a 180 px box gives artwork 164 x 70 px, 3 px from the
 top and foot; the Home Assistant logo sits over its foot where the network's mark sat on air. Other leagues keep the fit above. */
.sb-nba-box-98 .tall.full .sb-league { top: 50%; width: 180px; height: 180px; transform: translate(-50%, -50%); }
/* over the logo's foot the mark sits low at the left, as the peacock did on air (frame: lower left, about 0.65 of the column wide),
   on a dark round plate so it reads over the logo's white letters */
.sb-nba-box-98 .tall.full .sb-ha { left: 3px; bottom: 3px; transform: none; padding: 4px; box-sizing: content-box; border-radius: 50%;
  background: radial-gradient(circle at 50% 35%, #2b3550, #0c0f1c 70%); box-shadow: 0 0 0 1.5px rgba(223, 230, 255, .75); }
.sb-nba-box-98 .tall .sb-league-text { left: 0; top: 0; width: 100%; height: 100%; transform: none; display: grid; place-items: center; writing-mode: vertical-rl; }
.sb-nba-box-98 .tall .sb-ha { position: absolute; left: 50%; bottom: 6px; transform: translateX(-50%); color: #fff; filter: drop-shadow(0 1px 1px #000); }
.sb-nba-box-98 .box { position: absolute; left: ${TALL}px; top: 0; right: 0; height: ${H}px; border-radius: 0 6px 6px 0;
  background: linear-gradient(#2a4fc4 0 9px, rgba(0,0,0,0) 9px), repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 2px, rgba(0,0,0,.04) 2px 5px), linear-gradient(#d5d9df, #b3bac4 55%, #9aa3ae);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.6); }
.sb-nba-box-98 .r { position: absolute; left: 10px; right: 10px; margin-top: 4px; display: flex; justify-content: space-between; font-size: 50px; line-height: 50px; letter-spacing: .5px; color: #0c0c0e;
  text-shadow: -1px -1px 0 rgba(255,255,255,.8), 1px 1px 0 rgba(255,255,255,.5), 2px 3px 0 rgba(0,0,0,.25); }
.sb-nba-box-98 .r .n { max-width: 220px; overflow: hidden; white-space: nowrap; }
.sb-nba-box-98 .r .s { min-width: 62px; text-align: right; }
.sb-nba-box-98 .bot { position: absolute; left: 8px; right: 8px; bottom: 8px; height: 46px; display: flex; gap: 10px; }
/* the quarter's blue tab nearly half the bottom row, its word at the left, as on air (Nov 23 sweep: tab 0.45 of the row, window 0.49) */
.sb-nba-box-98 .tab { flex: 0 0 44%; box-sizing: border-box; background: linear-gradient(#3d6cf0, #1f45c9); border: 2px solid #dfe6ff; padding: 0 12px; font-size: 34px; line-height: 42px; text-shadow: 2px 2px 0 #000; }
.sb-nba-box-98 .win { flex: 1; display: flex; justify-content: flex-end; align-items: center; background: #070b2a; border: 2px solid #dfe6ff; padding: 0 12px;
  font-family: 'SB DSEG7', 'SB Barlow Condensed', monospace; font-size: 30px; letter-spacing: 2px; color: #eef3ff; text-shadow: 0 0 6px rgba(160,190,255,.7); }
.sb-nba-box-98 .win.t { font-family: 'SB Barlow Condensed', sans-serif; font-size: 36px; letter-spacing: .5px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const tall = el('div', g.league === 'NBA' ? 'tall full' : 'tall');
    if (mk.league) tall.appendChild(leagueLogo(g, 150));
    if (mk.ha) tall.appendChild(haMark(30));
    const box = el('div', 'box');
    // 90s boxes wrote the city or the short name; the sensor's short name fits best
    const nm = (t) => String(t.name || t.abbr || '').toUpperCase();
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r');
      r.style.top = (8 + i * 50) + 'px';
      r.append(fit(el('span', 'n', nm(t)), (t.abbr || '').toUpperCase()), el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''));
      box.appendChild(r);
    });
    const bot = el('div', 'bot');
    if (g.status === 'live') {
      bot.appendChild(el('span', 'tab', g.period.word ? g.period.label : g.period.label + (g.period.suffix || '').toLowerCase()));
      // DSEG draws "!" as an unlit digit, so a short clock is padded the way the old boards did
      bot.appendChild(el('span', 'win', (g.clock || '').padStart(5, '!')));
    } else bot.appendChild(el('span', 'win t', statusText(g, time)));
    box.appendChild(bot);
    root.append(tall, box);
  },
};
