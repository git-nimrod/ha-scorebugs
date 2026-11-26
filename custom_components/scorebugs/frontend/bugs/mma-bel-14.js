// "Silver tab clock '14": after Bellator's fight clock on Spike of 2014 (frame: retro catalogue mma-bel-14-1). A stack low on the left of
// the picture: a white plate with the promotion's logo on air (the league's logo from ESPN here), a silver tab with the round in black condensed capitals, its left end cut on a slant, and a black clock box with a chrome rim and rounded foot, the fight clock
// in big white figures, a warm gold light along its foot and a small gold pill hanging under it. No fighters' names on air; before the
// fight the start time sits in the clock box and the scheduled rounds in the tab, after it FINAL and the round it ended in.
// Measured: stack 305 wide; plate 46 tall, tab 254 x 40 (left end cut 12), clock box 223 x 87 (radius 12
// at the foot, rim 3), pill 53 x 17; clock cap 0.54 of its box, round cap 0.5 of the tab.
// Re-measured: the white plate is 30 tall (46 counted the promotion's
// arc badge sticking up above it), tab 40, clock box 80, the plate under the box 20 x 156; the tab is a mid grey band with a lighter
// lower third (L 70 / 82) between dark lines, not lit at the top; the clock box dark grey to 44 % then black (L 3-9), a warm flare at
// its foot left of centre in place of a gold band.
import { el, leagueLogo, marks, statusText, FONTS, fit } from '../kit.js';

const W = 305, PL = 30, TAB = 40, CK = 80, PILL = 20;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);

export default {
  id: 'mma-bel-14',
  size: { w: W, h: PL + TAB + CK + PILL },
  fonts: [FONTS.barlowCond700, FONTS.barlowSemi700],
  css: `
.sb-mma-bel-14 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; }
.sb-mma-bel-14 .pl { position: absolute; left: 0; top: 0; width: ${W}px; height: ${PL}px; border-radius: 15px 6px 6px 15px; background: linear-gradient(#ffffff, #eef0f1 55%, #d3d6d9); box-shadow: 0 2px 4px rgba(0,0,0,.35); display: grid; place-items: center; }
.sb-mma-bel-14 .pl .sb-league { width: 72px; height: 72px; margin: -21px 0; object-fit: contain; }
.sb-mma-bel-14 .tb { position: absolute; left: 51px; top: ${PL}px; width: 254px; height: ${TAB}px; clip-path: polygon(0 0, 100% 0, 100% 100%, 12px 100%); background: linear-gradient(#4a4b46, #4a4b46 4%, #a9a8a4 8%, #b0afab 50%, #cdccc8 60%, #cdccc8 90%, #93928e 96%, #6e6d6a); color: #0d0d0e; display: grid; place-items: center; font-size: 30px; letter-spacing: .01em; line-height: 1; white-space: nowrap; }
.sb-mma-bel-14 .ck { position: absolute; left: 75px; top: ${PL + TAB}px; width: 223px; height: ${CK}px; box-sizing: border-box; border: 3px solid #8e949a; border-top: 0; border-bottom: 6px solid #6d6a6d; border-radius: 0 0 12px 12px; background: radial-gradient(36px 6px at 30% 100%, #fff3ca, #e6b07a 45%, rgba(176, 120, 70, 0)), linear-gradient(#0c0c0c, #141414 20%, #1a1a1a 44%, #030303 50%, #000); color: #fff; display: grid; place-items: center; overflow: hidden; }
.sb-mma-bel-14 .ck span { font-family: 'SB Barlow Semi Condensed', sans-serif; font-size: 68px; line-height: 1; white-space: nowrap; position: relative; top: -1px; }
.sb-mma-bel-14 .ck.tx span { font-size: 36px; }
.sb-mma-bel-14 .pi { position: absolute; left: 125px; top: ${PL + TAB + CK}px; width: 156px; height: ${PILL}px; border-radius: 0 0 12px 12px / 0 0 9px 9px; background: linear-gradient(250deg, #a9a8a4, #9c9b97 55%, #92918d); }
/* the dark inset under the clock box with its two pale lamps (measured on the 1080p still) */
.sb-mma-bel-14 .pi::before { content: ''; position: absolute; left: 50px; top: 4px; width: 82px; height: 12px; border-radius: 6px; background: radial-gradient(8px 6px at 8px 50%, #fbf8cc 40%, rgba(251, 248, 204, 0)), radial-gradient(15px 6px at 64px 50%, #fdfacb 50%, rgba(253, 250, 203, 0)), #5a574d; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', clock = g.fightClock || g.clock || '', n = rounds(g);
    const pl = el('div', 'pl'); if (marks(opts).league) pl.appendChild(leagueLogo(g, 38));
    const r = live ? 'ROUND ' + (g.period.label || '1') + ' OF ' + n : g.status === 'final' ? (g.period.label ? 'ROUND ' + g.period.label + ' OF ' + Math.max(n, Number(g.period.label)) : '') : n + ' ROUNDS';
    const ck = el('div', 'ck' + (live && clock ? '' : ' tx'));
    ck.appendChild(fit(el('span', '', live && clock ? clock : g.status === 'final' ? 'FINAL' : statusText(g, time))));
    root.append(pl, el('div', 'tb', r), ck, el('div', 'pi'));
  },
};
