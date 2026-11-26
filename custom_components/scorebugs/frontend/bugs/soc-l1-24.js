// "Blue tile stack '24": after the Ligue 1 world-feed bug (Ligue 1+ / LFP, 2024-25 on; frame: reference pack SOC0236-ligue1, Brest v
// PSG, 03:13). A big blue square with the league's logo (here from ESPN) over a
// white tile with the match clock; beside the blue square a dark panel with the two teams in rows (home on top), each with its score at
// the right, split by a thin grey rule; a thin bar of each team's colour closes its row at the far right. Flat, square corners.
// Measured: the square 72 x 72, the clock tile 72 x 37 under it, the
// panel 111 wide and as tall as the square, team bars 4 wide; letters and figures cap 0.53 of a row (#ececee, condensed bold), the
// clock cap 0.83 of its tile height (#0c0c0c, tight tracking); square #065ff9, panel #2a2a2a, rule #5d5d5d.
import { el, soccerClock, homeFirst, leagueLogo, marks, teamColor, FONTS, scoreSlot, fit } from '../kit.js';

const SQ = 113, CKH = 57, PW = 183, RH = 60.5, BAR = 8, W = SQ + PW + BAR, H = SQ + CKH;

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-l1-24',
  size: { w: W, h: H },
  fonts: [FONTS.openSans, FONTS.roboto],
  css: `
.sb-soc-l1-24 { font-family: 'SB Open Sans', Arial, sans-serif; font-weight: 800; font-stretch: 80%; color: #ececee; }
.sb-soc-l1-24 .sq { position: absolute; left: 0; top: 0; width: ${SQ}px; height: ${SQ}px; background: #065ff9; display: grid; place-items: center; }
.sb-soc-l1-24 .sq .sb-league { width: 84px; height: 84px; object-fit: contain; }
.sb-soc-l1-24 .ck { position: absolute; left: 0; top: ${SQ}px; width: ${SQ}px; height: ${CKH}px; background: #fafbfb; color: #0c0c0c; display: grid; place-items: center;
  font-family: 'SB Roboto', Arial, sans-serif; font-weight: 700; font-stretch: 85%; font-size: 39px; line-height: 1; letter-spacing: -.04em; font-variant-numeric: tabular-nums;
  white-space: nowrap; overflow: hidden; padding: 0 6px; box-sizing: border-box; }
.sb-soc-l1-24 .ck.when { font-size: 26px; letter-spacing: 0; }
.sb-soc-l1-24 .pn { position: absolute; left: ${SQ}px; top: 0; width: ${PW}px; height: ${SQ}px; background: linear-gradient(#36373c, #2a2a2a 50%, #232326); }
.sb-soc-l1-24 .pn::after { content: ''; position: absolute; left: 13px; right: 24px; top: ${RH - 3}px; height: 2px; background: #5d5d5d; }
.sb-soc-l1-24 .r { position: absolute; left: 0; width: ${PW}px; height: ${RH - 4}px; display: flex; align-items: center; font-size: 41px; line-height: 1; }
.sb-soc-l1-24 .r.h { top: 0; } .sb-soc-l1-24 .r.a { top: ${RH - 4}px; }
.sb-soc-l1-24 .r .ab { flex: 1; padding-left: 13px; white-space: nowrap; overflow: hidden; }
.sb-soc-l1-24 .r .s { width: 46px; min-width: 0 !important; text-align: center; margin-right: 6px; }
.sb-soc-l1-24 .bar { position: absolute; left: ${SQ + PW}px; width: ${BAR}px; }
.sb-soc-l1-24 .bar.h { top: 4px; height: ${RH - 10}px; } .sb-soc-l1-24 .bar.a { top: ${RH - 1}px; height: ${RH - 10}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    const sq = el('div', 'sq');
    // white on the blue square on air: ESPN's version for dark backgrounds
    if (mk.league) sq.appendChild(leagueLogo(g, 84, undefined, true));
    const clock = mmss(soccerClock(g, time));
    const pn = el('div', 'pn');
    [[h, 'h'], [a, 'a']].forEach(([t, k]) => {
      const r = el('div', 'r ' + k);
      // before the kick-off the score slot stays empty: the kit puts the team's record in it
      r.append(fit(el('span', 'ab', (t.abbr || '').toUpperCase())), scoreSlot(el('span', 's', live && t.score != null ? String(t.score) : ''), g));
      pn.appendChild(r);
      const bar = el('i', 'bar ' + k); bar.style.background = teamColor(t, '#c00e1c');
      root.appendChild(bar);
    });
    root.append(sq, el('div', 'ck' + (clock.length > 5 ? ' when' : ''), clock), pn);
  },
};
