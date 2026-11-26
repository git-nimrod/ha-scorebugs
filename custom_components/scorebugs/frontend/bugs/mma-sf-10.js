// "Red clock box '10": after Strikeforce's fight clock on Showtime of 2010 (frame: retro catalogue mma-sf-10-2, standard definition).
// A small box low on the right of the picture, its ends pointed: the fight clock in white figures on a deep red glossy face over a black
// tab with the round. No fighters' names on air; before the fight the start time sits
// in the red face and the scheduled rounds in the tab, after it FINAL and the round it ended in.
// Measured: box 263 wide, red face 72 tall, tab 59, ends pointed 12; clock cap 0.5 of the face,
// tab words cap 0.34, numbers 0.5; red face deep and dull, #7c1212 at the top to #340505 at the foot, with a dark rim; clock
// figures a warm white #f4ddd6; tab near black, its letters light grey.
// the red face is nearly black at its top (L 4-8) and lights toward the
// foot (L 17, base #4d0b00), darker at both ends; the clock figures 0.67 of the face (ours 0.55) in a pinker white (#ecc4b4 read, soft);
// the tab's words ROUND and OF nearly as tall as its numbers (29 px against 40, were 26).
import { el, statusText, FONTS, fit } from '../kit.js';

const W = 263, RED = 72, TAB = 59, P = 12;
const rounds = (g) => (/title|championship|main event/i.test(g.note || '') ? 5 : 3);

export default {
  id: 'mma-sf-10',
  size: { w: W, h: RED + TAB + 4 },
  fonts: [FONTS.barlowSemi700, FONTS.saira],
  css: `
.sb-mma-sf-10 { font-family: 'SB Saira', Arial, sans-serif; font-weight: 700; color: #f2eeee; }
.sb-mma-sf-10 .bx { position: absolute; inset: 0; clip-path: polygon(${P}px 0, ${W - P}px 0, 100% 50%, ${W - P}px 100%, ${P}px 100%, 0 50%); background: #0b0b0b; }
.sb-mma-sf-10 .rf { position: absolute; left: ${P}px; right: ${P}px; top: 3px; height: ${RED - 3}px; background: linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,0) 9%, rgba(0,0,0,0) 91%, rgba(0,0,0,.55)), linear-gradient(#170400, #2c0600 10%, #470a00 35%, #560b00 55%, #5d0b00 75%, #4f0d00 87%, #1e0b00); box-shadow: inset 0 1px 0 rgba(255,140,140,.25); display: grid; place-items: center; overflow: hidden; }
.sb-mma-sf-10 .rf span { font-size: 64px; font-weight: 600; font-stretch: 92%; color: #ecc4b4; line-height: 1; letter-spacing: .02em; white-space: nowrap; }
.sb-mma-sf-10 .rf.tx span { font-size: 32px; }
.sb-mma-sf-10 .tb { position: absolute; left: ${P}px; right: ${P}px; top: ${RED + 4}px; height: ${TAB - 4}px; display: flex; align-items: baseline; justify-content: center; gap: 8px; font-family: 'SB Barlow Semi Condensed', sans-serif; white-space: nowrap; padding-top: 6px; box-sizing: border-box; color: #d9d9d9; }
.sb-mma-sf-10 .tb small { font-size: 29px; }
.sb-mma-sf-10 .tb b { font-size: 40px; font-weight: 700; line-height: 1; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', clock = g.fightClock || g.clock || '', n = rounds(g);
    const bx = el('div', 'bx');
    const rf = el('div', 'rf' + (live && clock ? '' : ' tx'));
    rf.appendChild(fit(el('span', '', live && clock ? clock : g.status === 'final' ? 'FINAL' : statusText(g, time))));
    const tb = el('div', 'tb');
    if (live || (g.status === 'final' && g.period.label)) tb.append(el('small', '', 'ROUND'), el('b', '', g.period.label || '1'), el('small', '', 'OF'), el('b', '', String(Math.max(n, Number(g.period.label) || 0))));
    else tb.append(el('b', '', String(n)), el('small', '', 'ROUNDS'));
    root.append(bx, rf, tb);
  },
};
