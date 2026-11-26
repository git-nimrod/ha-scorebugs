// "Fade slabs '25": after the Eredivisie bug on ESPN in the Netherlands (2025-26; frame: reference pack SOC0236-ered, Fortuna Sittard
// v Go Ahead Eagles, 51:13, 1-1). Each team's letters on a slab that fades from near black at its outer end
// to the team's colour by the scores; both scores on a taller light block in two halves, each half lit at its left and darker at its
// right; the two slabs lie on top of the block's ends; the clock on its own light box, touching the away slab.
// "No white line in middle, have bugs on top of white area with gradient. Move time over to touch the team area."
// Measured on the 1080p still (slabs 41 px there, so x 1.463 here): slabs 132 / 126 wide, the score block 127 wide and
// 58 tall (1.41 of a slab), reaching 8.5 px above and below the slabs; the home slab covers its left 14 px, the away slab its right 10;
// its halves 63 / 64 wide, each running #cccccc at its left to #acacac at its right (a hard step where they meet, no bar); the clock
// box 116 wide, slab height, flush against the away slab. Letters and figures cap 0.57 of a slab, clock 0.54 with open tracking.
// The away fade runs #961438 by the scores to #29161c at the outer end (Ajax red): the team colour darkened about 75-85 %.
import { el, soccerClock, homeFirst, teamColor, shade, FONTS, scoreSlot, fit } from '../kit.js';

const ST = 12, SH = 60, H = 85;
// left edges and widths: home slab, score block (two halves), away slab, clock
const HS = [0, 193], BL = [173, 185], HALF = 92, AS = [344, 184], CK = [528, 170];
const W = CK[0] + CK[1];

// MM:SS with a leading zero, as on air ("03:13")
const mmss = (s) => (/^\d:\d\d$/.test(s) ? '0' + s : s);

export default {
  id: 'soc-ered-25',
  size: { w: W, h: H },
  fonts: [FONTS.barlow600],
  css: `
.sb-soc-ered-25 { font-family: 'SB Barlow', Arial, sans-serif; font-weight: 600; color: #f4f4f4; }
.sb-soc-ered-25 .tm { position: absolute; top: ${ST}px; height: ${SH}px; display: grid; place-items: center; box-sizing: border-box; padding: 0 14px;
  font-size: 52px; line-height: 1; white-space: nowrap; overflow: hidden; text-shadow: 0 1px 2px rgba(0,0,0,.35); z-index: 2; }
.sb-soc-ered-25 .tm.h { left: ${HS[0]}px; width: ${HS[1]}px; } .sb-soc-ered-25 .tm.a { left: ${AS[0]}px; width: ${AS[1]}px; }
/* each half of the block lit at its left and darker at its right (#ccc -> #acacac on air, read as video levels: #dcdcde -> #b6b6b8) */
.sb-soc-ered-25 .s { position: absolute; top: 0; height: ${H}px; display: grid; place-items: center; color: #141414; font-size: 46px; line-height: 1;
  background: linear-gradient(90deg, rgba(220, 220, 222, .92), rgba(182, 182, 184, .92)); box-sizing: border-box; padding-bottom: 4px; }
.sb-soc-ered-25 .s.h { left: ${BL[0]}px; width: ${HALF}px; padding-left: ${HS[1] - BL[0]}px; }
.sb-soc-ered-25 .s.a { left: ${BL[0] + HALF}px; width: ${BL[1] - HALF}px; padding-right: ${BL[0] + BL[1] - AS[0]}px; }
.sb-soc-ered-25 .ck { position: absolute; top: ${ST}px; left: ${CK[0]}px; width: ${CK[1]}px; height: ${SH}px; background: #f8f7f7; color: #141414; display: grid; place-items: center;
  font-size: 44px; line-height: 1; font-weight: 600; letter-spacing: .07em; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; padding: 0 8px; box-sizing: border-box; }
.sb-soc-ered-25 .ck.when { font-size: 30px; letter-spacing: 0; }
`,
  draw(root, g, { time }) {
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    // before the kick-off the score halves stay empty: the kit puts each team's record in them
    // the figure (or the record) in its own box inside the half, so the record is fitted to the half's open part, not to the
    // whole half that the slab lies over (the kit shrank it to a fifth when the half itself was the slot)
    const half = (k, v) => { const d = el('div', 's ' + k); d.appendChild(scoreSlot(el('span', '', v), g)); return d; };
    root.append(half('h', live && h.score != null ? String(h.score) : ''), half('a', live && a.score != null ? String(a.score) : ''));
    [[h, 'h', '90deg'], [a, 'a', '270deg']].forEach(([t, k, dir]) => {
      const c = teamColor(t, '#5c5a57'), n = el('div', 'tm ' + k);
      // near black at the outer end, the team's colour by the scores (frames: #282006 -> #fae02d, #29161c -> #961438)
      n.style.background = 'linear-gradient(' + dir + ', ' + shade(c, -0.85) + ', ' + shade(c, -0.45) + ' 40%, ' + c + ')';
      n.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      root.appendChild(n);
    });
    const clock = mmss(soccerClock(g, time));
    root.appendChild(el('div', 'ck' + (clock.length > 5 ? ' when' : ''), clock));
  },
};
