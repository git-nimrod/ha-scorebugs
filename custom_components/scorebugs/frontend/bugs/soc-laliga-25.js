// "Coral card '25": after LaLiga's world-feed bug (2025-26; frame: reference pack SOC0236-laliga, Levante v Barcelona, 04:06). A square card in three columns: the league's logo on a coral tile over
// the match clock on a white tile; the two teams' letters in rows (home on top) on a near-black column; a thin strip of each team's two
// kit colours, one over the other; both scores in rows on a white column split by a short grey rule. Flat, square corners.
// Measured: logo and clock tiles 92 x 52, the letters column 51, the
// kit strips 4, the score column 56; letters cap 0.38 of a row (white, condensed bold), figures 0.60 (black), clock 0.45; coral
// #ec5149, column #010113, white #eaeaec, rule #aaaaaa. The 2023-24 version (SOC0150) had white crests where the letters are now.
import { el, soccerClock, homeFirst, leagueLogo, marks, teamColor, FONTS, scoreSlot, fit } from '../kit.js';

const TW = 107, RH = 60, NW = 60, KS = 6, SW = 65, W = TW + NW + KS + SW, H = 2 * RH;

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-laliga-25',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond700],
  css: `
.sb-soc-laliga-25 { font-family: 'SB Barlow Condensed', Arial, sans-serif; font-weight: 700; color: #f4f4f4; }
.sb-soc-laliga-25 .lg { position: absolute; left: 0; top: 0; width: ${TW}px; height: ${RH}px; background: #ec5149; display: grid; place-items: center; }
/* ESPN's logo is coral like the tile, so it sits on a small white plate to show (on air it is white on the coral) */
.sb-soc-laliga-25 .lg .pl { width: 52px; height: 48px; border-radius: 8px; background: #fff; display: grid; place-items: center; }
.sb-soc-laliga-25 .lg .sb-league { width: 40px; height: 40px; object-fit: contain; }
.sb-soc-laliga-25 .ck { position: absolute; left: 0; top: ${RH}px; width: ${TW}px; height: ${RH}px; background: #ece9ed; color: #0a0a0a; display: grid; place-items: center;
  font-size: 33px; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; padding: 0 6px; box-sizing: border-box; }
.sb-soc-laliga-25 .ck.when { font-size: 26px; }
.sb-soc-laliga-25 .nc { position: absolute; left: ${TW}px; top: 0; width: ${NW}px; height: ${H}px; background: #010113; }
.sb-soc-laliga-25 .ab { position: absolute; left: ${TW}px; width: ${NW}px; height: ${RH}px; display: grid; place-items: center; font-size: 33px; line-height: 1; white-space: nowrap; overflow: hidden; padding: 0 4px; box-sizing: border-box; }
.sb-soc-laliga-25 .ks { position: absolute; left: ${TW + NW}px; width: ${KS}px; height: ${RH}px; }
.sb-soc-laliga-25 .scol { position: absolute; left: ${TW + NW + KS}px; top: 0; width: ${SW}px; height: ${H}px; background: #eaeaec; }
.sb-soc-laliga-25 .scol::after { content: ''; position: absolute; left: 10px; right: 10px; top: ${RH - 1}px; height: 2px; background: #aaaaaa; }
.sb-soc-laliga-25 .s { position: absolute; left: ${TW + NW + KS}px; width: ${SW}px; height: ${RH}px; display: block; text-align: center; color: #0a0a0a; font-size: 52px; line-height: ${RH}px; white-space: nowrap; overflow: hidden; padding: 0 5px; box-sizing: border-box; min-width: 0 !important; }
.sb-soc-laliga-25 .h { top: 0; } .sb-soc-laliga-25 .a { top: ${RH}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    const lg = el('div', 'lg');
    // on air the logo stands white on the coral tile; ESPN's logo is coral in both its versions and is never recoloured, so it sits on a
    // small white plate
    if (mk.league) { const pl = el('div', 'pl'); pl.appendChild(leagueLogo(g, 40)); lg.appendChild(pl); }
    const clock = mmss(soccerClock(g, time));
    root.append(lg, el('div', 'ck' + (clock.length > 5 ? ' when' : ''), clock), el('div', 'nc'), el('div', 'scol'));
    [[h, 'h'], [a, 'a']].forEach(([t, k]) => {
      root.appendChild(fit(el('div', 'ab ' + k, (t.abbr || '').toUpperCase())));
      const c1 = teamColor(t, '#944353'), c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') ? t.color2 : c1;
      const ks = el('i', 'ks ' + k); ks.style.background = 'linear-gradient(' + c1 + ' 50%, ' + c2 + ' 50%)';
      // before the kick-off the score slot stays empty: the kit puts the team's record in it
      root.append(ks, scoreSlot(el('div', 's ' + k, live && t.score != null ? String(t.score) : ''), g));
    });
  },
};
