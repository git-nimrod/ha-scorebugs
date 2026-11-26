// "Crimson disc '05": after the NBA score box on TNT, 2005-06 (frame: Rockets at Heat, 4th quarter, from a sheet of TNT's NBA bugs
// by era; rough: the bar is 96 x 32 px on the sheet, so finish readings are guides). A dark panel running from black at its left to
// deep crimson at its right, its left end cut on a slant round the league's logo; two team rows (white letters, pale pink scores) with
// a thin pink-grey rule between them; under them the quarter in pink and the clock white on a black rounded cell; at the right a big
// dark disc in a thin pink ring, set over the panel's end, holding the network's mark (here the Home Assistant logo, white). The shot
// clock (pink, right of the clock) is left out: no data. No team colours on air. Drawn soft, the way it looked on a 2005 TV.
// measured (96 px frame, x5): the disc fitted as a circle (ring.py, circle_fit on the ring's brightest pixels): centre 0.81 across,
// 0.49 down, radius 14.7 px = 0.46 of the crop's height (73 here), ring about 1.2 px (6 here), pink #f0a8aa; panel 8..152 down, left
// end leaning 15 deg; rows 45 high at 10 and 60, bottom row 40 high at 111; caps 31-33 px on the rows, 27 px in the clock; panel
// #0a0a0c to #5a0e14 at 60% to #8a1a22; the clock cell's ends round (radius half its height). Other edges fit straight.
// the panel black through the letters and only then into red (the frame's top edge reads black to 0.38 across, #5c2911 at 0.56, #80241d at 0.65): black to the U's end, full red from 83 %.
// the bug starts at the slanted line: the black
// wedge left of the line (55 px at the top, 56 at the foot) is gone; the panel's own left end is now the 16 deg slant with the light
// line along it, and everything moved 63 px left (the bug is 417 wide, was 480); the colour stops moved with the letters.
import { el, statusText, haMark, marks, fit, scoreSlot, FONTS } from '../kit.js';

const W = 417, H = 160, CX = 324, CY = 79, R = 73;

export default {
  id: 'nba-tnt-05',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nba-tnt-05 { font-family: 'SB Archivo', Arial, sans-serif; font-weight: 800; font-stretch: 96%; color: #fff; }
.sb-nba-tnt-05 .pan { position: absolute; left: 2px; top: 8px; width: ${CX - 2}px; height: 144px; clip-path: polygon(0 0, 100% 0, 100% 100%, 41px 100%);
  background: linear-gradient(90deg, #0a0a0c 44%, #2e0a0d 53%, #5a0e14 66%, #8a1a22 83%); box-shadow: inset 0 2px 0 rgba(255,255,255,.12); }
.sb-nba-tnt-05 .pan::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,0) 45%, rgba(0,0,0,.18)); }
/* the light line (about 16 deg) now lies along the panel's own slanted left end, just inside it */
.sb-nba-tnt-05 .dg { position: absolute; left: 22.6px; top: 8px; width: 3px; height: 144px; transform: skewX(16deg); background: linear-gradient(rgba(246,214,214,.85), rgba(200,150,156,.55)); }
.sb-nba-tnt-05 .nm, .sb-nba-tnt-05 .sc { position: absolute; height: 45px; display: flex; align-items: center; line-height: 1; font-size: 48px; white-space: nowrap; }
.sb-nba-tnt-05 .nm { left: 35px; width: 120px; }
.sb-nba-tnt-05 .sc { left: 143px; width: 96px; justify-content: flex-end; color: #f6d4d4; }
.sb-nba-tnt-05 .sc.rec { font-size: 22px; font-weight: 700; }
.sb-nba-tnt-05 .rule { position: absolute; left: 31px; top: 56px; width: 216px; height: 3px; background: linear-gradient(90deg, rgba(200,150,156,.4), #c8969c 30%, #c8969c 80%, rgba(200,150,156,.3)); }
.sb-nba-tnt-05 .ck { position: absolute; left: 49px; top: 112px; min-width: 118px; height: 36px; padding: 0 14px; box-sizing: border-box; border-radius: 18px; background: #050506;
  display: flex; align-items: center; justify-content: center; font-size: 38px; line-height: 1; white-space: nowrap; box-shadow: inset 0 0 0 1px rgba(255,255,255,.12); }
.sb-nba-tnt-05 .ck.st { font-size: 24px; letter-spacing: 1px; }
/* the period small after the clock, in the scores' pale pink; about
 half the clock's size, so the big quarter number was removed does not come back */
.sb-nba-tnt-05 .ck .pd { margin-left: 10px; font-size: 20px; font-weight: 700; letter-spacing: .5px; color: #f6d4d4; }
/* the disc: a circle (border-radius 50%), its thin pink ring, over the panel's end */
.sb-nba-tnt-05 .disc { position: absolute; left: ${CX - R}px; top: ${CY - R}px; width: ${2 * R}px; height: ${2 * R}px; box-sizing: border-box; border-radius: 50%;
  border: 6px solid #f0a8aa; background: radial-gradient(circle at 42% 35%, #3a1416, #12070a 62%, #060304); box-shadow: 0 0 0 2px rgba(60,10,14,.8), 0 3px 6px rgba(0,0,0,.45);
  display: grid; place-items: center; color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const pre = g.status === 'pre', live = g.status === 'live', mk = marks(opts);
    root.appendChild(el('div', 'pan'));
    // the league's logo is no longer drawn: the player alone would mean drawing the
    // league's own artwork by hand or recolouring ESPN's file with a filter, and the house rules allow neither; the slanted end and its
    // light line stay, so the panel keeps its shape
    root.appendChild(el('div', 'dg'));
    const recs = pre && g.away.record && g.home.record;
    [g.away, g.home].forEach((t, i) => {
      const nm = fit(el('div', 'nm', (t.abbr || '').toUpperCase()));
      const sc = el('div', 'sc' + (recs ? ' rec' : ''), recs ? t.record : !pre && t.score != null ? String(t.score) : '');
      if (!recs) scoreSlot(sc, g);
      nm.style.top = sc.style.top = (10 + i * 50) + 'px';
      root.append(nm, sc);
    });
    root.appendChild(el('div', 'rule'));
    if (live) {
      // no big quarter number: the clock, and the period set small after it in the same cell
      // ('4TH', '2ND', 'OT', 'SO')
      const p = g.period || {}, pd = p.word ? p.label : p.label ? p.label + (p.suffix || '') : '';
      if (g.clock || pd) { const ck = el('div', 'ck', g.clock || ''); if (pd) ck.appendChild(el('span', 'pd', pd)); root.appendChild(ck); }
    } else root.appendChild(fit(el('div', 'ck st', statusText(g, time))));
    const disc = el('div', 'disc');
    if (mk.ha) disc.appendChild(haMark(70));
    root.appendChild(disc);
  },
};
