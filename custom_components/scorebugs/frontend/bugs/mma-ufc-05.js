// "Octagon clock '05": after the UFC's fight clock on Spike of 2005 (frames: retro catalogue mma-ufc-05-1 and -2, the first TUF finale,
// 720p). A near-black octagon low on the left of the picture: the league's logo at the top (UFC's, from ESPN), the fight clock in big
// white condensed figures, the round under it in smaller ones. No fighters' names on air; before the fight the start time stands in
// the clock's place and the scheduled rounds under it, after it FINAL and the round it ended in.
// Measured: octagon 135 x 165, corners cut 33 at the top and bottom; logo 66 x 24 at 0.16 down;
// clock cap 0.35 of the octagon (white, heavy condensed), round cap 0.18; fill #141414, nearly opaque (no rim, no gloss).
import { el, leagueLogo, marks, statusText, FONTS, fit } from '../kit.js';

const W = 135, H = 165, C = 33;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);

export default {
  id: 'mma-ufc-05',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond700],
  css: `
.sb-mma-ufc-05 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-mma-ufc-05 .oc { position: absolute; inset: 0; background: rgba(18,18,18,.94); clip-path: polygon(${C}px 0, ${W - C}px 0, 100% ${C}px, 100% ${H - C}px, ${W - C}px 100%, ${C}px 100%, 0 ${H - C}px, 0 ${C}px); display: flex; flex-direction: column; align-items: center; }
.sb-mma-ufc-05 .lg { height: 36px; margin-top: 16px; display: grid; place-items: center; }
.sb-mma-ufc-05 .lg .sb-league { width: 76px; height: 76px; margin: -20px 0; object-fit: contain; }
.sb-mma-ufc-05 .ck { margin-top: 8px; font-size: 76px; line-height: .8; letter-spacing: -.01em; white-space: nowrap; max-width: ${W - 12}px; overflow: hidden; }
.sb-mma-ufc-05 .ck.tx { font-size: 40px; line-height: 1; margin-top: 18px; }
.sb-mma-ufc-05 .rd { margin-top: 12px; font-size: 42px; line-height: .8; white-space: nowrap; }
.sb-mma-ufc-05 .rd.tx { font-size: 22px; line-height: 1; letter-spacing: .04em; margin-top: 14px; }
`,
  draw(root, g, { time, opts }) {
    const oc = el('div', 'oc'), lg = el('div', 'lg');
    if (marks(opts).league) lg.appendChild(leagueLogo(g, 34));
    const live = g.status === 'live', clock = g.fightClock || g.clock || '';
    const ck = live && clock ? el('div', 'ck', clock) : fit(el('div', 'ck tx', g.status === 'final' ? 'FINAL' : statusText(g, time)));
    const rd = live ? el('div', 'rd', g.period.label || '1') : el('div', 'rd tx', g.status === 'final' ? (g.period.label ? 'ROUND ' + g.period.label : '') : rounds(g) + ' ROUNDS');
    oc.append(lg, ck, rd);
    root.appendChild(oc);
  },
};
