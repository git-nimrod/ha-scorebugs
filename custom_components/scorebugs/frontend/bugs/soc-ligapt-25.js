// "Navy stack '25": after Liga Portugal's 2025-26 bug as it is on air. Three square tiles side by side, touching: a white tile per team with its score over its
// letters, a dark clock tile between them, and a short team-colour strip, square-ended, standing on each white tile's outer
// edge (half in, half out). No gloss, no rims, no shadow.
// "Rebuild" from these stills; his earlier calls stand: the red sponsor tile is dropped, no sponsor or league
// marks are drawn (the old bug's league logo square is gone with the old layout).
// Measured: home tile 86 wide, clock 106, away 88 (1.13 /
// 1.39 / 1.16 of the height); strips 7 wide and 65 tall (0.09 / 0.86 of the height), centred down, centred on the tile's edge;
// tiles #fefefe, clock #282828, both flat; score figures cap 0.37 of the height, centred 0.33 down; letters cap 0.24, centred 0.76
// down; clock figures cap 0.33, centred; in added time the clock moves up to the score row and the added minutes go under it at
// the letters' row. Ink #222 on white, #f5f5f5 on the clock; a condensed bold face with square-cut ends (Roboto, narrowed).
import { el, soccerClock, homeFirst, teamPair, FONTS, scoreSlot, fit } from '../kit.js';

const H = 114, TH = 129, CK = 159, TA = 132, SO = 5, SW = 10, SH = 98, W = SO + TH + CK + TA + SO;

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-ligapt-25',
  size: { w: W, h: H },
  fonts: [FONTS.roboto],
  css: `
.sb-soc-ligapt-25 { font-family: 'SB Roboto', Arial, sans-serif; font-weight: 700; font-stretch: 85%; color: #222; }
.sb-soc-ligapt-25 *, .sb-soc-ligapt-25 *::before { box-sizing: border-box; }
.sb-soc-ligapt-25 .tl { position: absolute; top: 0; height: ${H}px; background: #fefefe; }
.sb-soc-ligapt-25 .tl.h { left: ${SO}px; width: ${TH}px; padding: 0 4px 0 10px; }
.sb-soc-ligapt-25 .tl.a { left: ${SO + TH + CK}px; width: ${TA}px; padding: 0 16px 0 4px; }
/* the score row and the letters' row, each a line box centred on its measured cap centre */
.sb-soc-ligapt-25 .s { position: absolute; left: 0; right: 0; top: 9px; height: 59px; display: flex; align-items: center; justify-content: center;
  font-size: 59px; line-height: 1; padding: inherit; min-width: 0 !important; }
.sb-soc-ligapt-25 .ab { position: absolute; left: 0; right: 0; top: 69px; height: 38px; padding: inherit; display: flex; justify-content: center; }
.sb-soc-ligapt-25 .ab span { display: block; font-size: 38px; font-weight: 650; font-stretch: 75%; line-height: 1; white-space: nowrap; overflow: hidden; }
/* the team strip: square-ended, on the tile's outer edge, half in, half out */
.sb-soc-ligapt-25 .st { position: absolute; top: ${(H - SH) / 2}px; width: ${SW}px; height: ${SH}px; }
.sb-soc-ligapt-25 .st.h { left: 0; }
.sb-soc-ligapt-25 .st.a { left: ${W - SW}px; }
.sb-soc-ligapt-25 .ck { position: absolute; left: ${SO + TH}px; top: 0; width: ${CK}px; height: ${H}px; background: #282828; color: #f5f5f5; }
.sb-soc-ligapt-25 .ck i { position: absolute; left: 0; right: 0; display: block; font-style: normal; text-align: center; line-height: 1; white-space: nowrap;
  font-variant-numeric: tabular-nums; overflow: hidden; padding: 0 6px; }
.sb-soc-ligapt-25 .ck .m { top: 33px; font-size: 50px; font-stretch: 75%; }
.sb-soc-ligapt-25 .ck .m.when { top: 43px; font-size: 28px; }
/* added time: the clock up at the score row, the added minutes under it at the letters' row */
.sb-soc-ligapt-25 .ck.plus .m { top: 12px; }
.sb-soc-ligapt-25 .ck .x { top: 62px; font-size: 45px; font-stretch: 75%; }
`,
  draw(root, g, { time }) {
    const [h, a] = homeFirst(g);
    const [ch, ca] = teamPair(h, a, '#3a3f47');
    const live = g.status !== 'pre';
    [[h, 'h', ch], [a, 'a', ca]].forEach(([t, k, c]) => {
      const tile = el('div', 'tl ' + k);
      // before the kick-off the score slot stays empty: the kit puts the team's record in it
      const ab = el('div', 'ab');
      ab.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      tile.append(scoreSlot(el('div', 's', live && t.score != null ? String(t.score) : ''), g), ab);
      const st = el('div', 'st ' + k);
      st.style.background = c;
      root.append(tile, st);
    });
    // in added time the feed gives the minute and the added minutes ("90'+5'"): two lines, as on air
    const raw = soccerClock(g, time), m = /^(\d+'?)\s*(\+\s*\d+'?)$/.exec(String(raw).trim());
    const ck = el('div', 'ck' + (m ? ' plus' : ''));
    if (m) ck.append(el('i', 'm', m[1].replace(/'?$/, "'")), el('i', 'x', m[2].replace(/\s/g, '').replace(/'?$/, "'")));
    else {
      const clock = mmss(raw);
      ck.appendChild(fit(el('i', 'm' + (clock.length > 5 ? ' when' : ''), clock)));
    }
    root.append(ck);
  },
};
