// "Red capsule '13": after the UFC's fight clock of 2013 (frames: retro catalogue mma-ufc-13-1 and -2, a Fight Night). A red glass face low on the left of the picture, held between two dark metal crescents, the fight clock in big
// white wide figures, and a near-black glass tab on top holding the round as a silver ordinal ("3RD"). No fighters' names on air; before
// the fight the start time sits in the face and the scheduled rounds in the tab, after it FINAL and the round it ended in.
// Measured again: the whole badge 246 x 128. The red face is not a
// capsule: 217 x 91 with near-upright sides that bow out gently (elliptical corners 24 x 30 at the top, 30 x 34 at the foot). Behind it a
// metal plate 246 x 90 with fully rounded ends (70 x 45) shows as a crescent at each side, 14 px thick at the middle and coming to a
// point at the face's top and foot corners; dark glossy metal (charcoal, lighter at the top) with a bright rim line along its edge. Tab
// 136 wide at the top, 172 at the foot, 38 tall (sides lean out 25 deg, top corners r8), near black with a light band at its top.
// Red face glass (grid of spots on the still): a light line 8 % down (#dd6775), upper band #a22e38 -> #952b33, a step at 38 %
// to #6b060d, foot #470812, a light edge at the very foot. Clock cap 0.47 of the face, round cap 0.7 of the tab.
// the crescents are a band of even width (12-14 px)
// that follows the face's own curve from its top to its foot, not a capsule plate pinched to a point: dark teal-black (#0e1c1f) at
// the outside, lighter towards the face, and a bright line (#eef0f3, 2 px) right against the face (the light is on the inside arc,
// not the outside). The tab is near black inside a grey metal rim (#5e6869, about 9 px) on its leaning sides (24 deg outside, 27
// inside), and its foot is rounded and sits 8 px down into the face, with a lighter foot rim (#434d4e); the face starts 38 down.
import { el, statusText, FONTS, fit, textOutline } from '../kit.js';

const W = 246, H = 128, FT = 38, FH = 89, FW = 217, FL = (W - FW) / 2, TAB = 47;
// the face's corners, and the bands round it: each band is the face's own shape set d px further out, so it keeps its width round the curve
const RAD = (d) => `${24 + d}px ${24 + d}px ${34 + d}px ${34 + d}px / 30px 30px 40px 40px`;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);
const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'TH' : ['TH', 'ST', 'ND', 'RD'][n % 10] || 'TH');

export default {
  id: 'mma-ufc-13',
  size: { w: W, h: H },
  fonts: [FONTS.saira],
  css: `
.sb-mma-ufc-13 { font-family: 'SB Saira', Arial, sans-serif; font-weight: 800; font-stretch: 125%; color: #fff; }
.sb-mma-ufc-13 .pl { position: absolute; left: 0; top: ${FT - 2}px; width: ${W}px; height: ${FH + 2}px; border-radius: ${RAD(14.5)}; background: linear-gradient(#262f33, #1b2427 16%, #121b1e 34%, #0a1214 50%, #080f11 76%, #0e1415 90%, #171d1f); }
/* the crescents' light: lighter towards the face, a bright line against it (the inside arc lit, the outside dark) */
.sb-mma-ufc-13 .pl::before, .sb-mma-ufc-13 .pl::after { content: ''; position: absolute; top: 2px; height: ${FH}px; }
.sb-mma-ufc-13 .pl::before { left: ${FL - 7}px; width: ${FW + 14}px; border-radius: ${RAD(7)}; background: linear-gradient(#8a9a9e, #6c7e82 20%, #42525a 50%, #42525a 80%, #6c6c6c); }
.sb-mma-ufc-13 .pl::after { left: ${FL - 2.5}px; width: ${FW + 5}px; border-radius: ${RAD(2.5)}; background: #e9ecef; }
.sb-mma-ufc-13 .fc { position: absolute; left: ${FL}px; top: ${FT}px; width: ${FW}px; height: ${FH}px; border-radius: ${RAD(0)}; background: linear-gradient(#b8485a, #dd6775 8%, #b03a47 13%, #952b33 24%, #8b2830 35%, #7a1219 38%, #6b060d 42%, #5c080d 65%, #470812 92%, #5a1a20); box-shadow: inset 0 0 0 1px rgba(30,0,4,.7), inset 0 -2px 0 rgba(255,170,170,.18); display: grid; place-items: center; overflow: hidden; box-sizing: border-box; padding: 0 20px; }
.sb-mma-ufc-13 .fc span { position: relative; top: 4px; font-size: 58px; line-height: 1; letter-spacing: .02em; white-space: nowrap; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-mma-ufc-13 .fc.tx span { font-size: 25px; top: 7px; max-width: 100%; }
/* the tab: a grey metal rim on its leaning sides, the near-black glass inside it, both with a rounded foot sitting down into the face */
.sb-mma-ufc-13 .tr { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TAB}px; clip-path: path('M 52 0 L 194 0 Q 202 0 204 5 L 217.5 36 Q 222 51 200 51 L 46 51 Q 24 51 28.5 36 L 42 5 Q 44 0 52 0 Z'); background: linear-gradient(90deg, #0a0f10, #5e6869 6%, #5e6869 94%, #0a0f10); }
/* the tab's rounded foot: a dark shadow on the face just under it */
.sb-mma-ufc-13 .ts { position: absolute; left: 0; top: 0; width: ${W}px; height: 57px; clip-path: path('M 44 40 L 202 40 Q 222 50 204 55 L 42 55 Q 24 50 44 40 Z'); background: linear-gradient(rgba(20,0,4,.0), rgba(20,0,4,.55) 60%, rgba(20,0,4,0)); }
.sb-mma-ufc-13 .tb { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TAB}px; clip-path: path('M 61 0 L 185 0 Q 193 0 195 5 L 207.5 35 Q 212 45 192 45 L 54 45 Q 34 45 38.5 35 L 51 5 Q 53 0 61 0 Z'); background: linear-gradient(#2e3436, #1a2224 12%, #1e2422 50%, #1c2524 80%, #121a1c 92%, #0c1416); display: grid; place-items: center; }
.sb-mma-ufc-13 .tb span { position: relative; top: -1px; font-size: 38px; line-height: 1; letter-spacing: .02em; white-space: nowrap; color: #dfe2e5; text-shadow: ${textOutline(2, '#0d0e10')}, 0 -1px 0 #ffffff; }
.sb-mma-ufc-13 .tb.tx span { font-size: 22px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', clock = g.fightClock || g.clock || '';
    const r = live ? ORD(Number(g.period.label) || 1) : g.status === 'final' ? (g.period.label ? ORD(Number(g.period.label)) : '') : rounds(g) + ' RDS';
    const tb = el('div', 'tb' + (live || g.status === 'final' ? '' : ' tx'));
    tb.appendChild(el('span', '', r));
    const fc = el('div', 'fc' + (live && clock ? '' : ' tx'));
    fc.appendChild(fit(el('span', '', live && clock ? clock : g.status === 'final' ? 'FINAL' : statusText(g, time))));
    // the metal crescents behind, the red glass face, the tab's rim and the tab on top
    root.append(el('div', 'pl'), fc, el('div', 'ts'), el('div', 'tr'), tb);
  },
};
