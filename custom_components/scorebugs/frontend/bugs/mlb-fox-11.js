// "Glass capsule '11": after FOX's MLB score capsule of 2011. A long capsule with a thin pale rim: each team's glossy panel in its colour at an end (letters over a big
// score), and between them dark smoked glass with the inning in gold over a gold arrow for the half, the bases as three tiles (gold
// when taken) over a small grey plate, and the count over three out dots.
// measured: capsule 99% of the width and 89% of the height with fully round ends, team panels 22% of the width each,
// gloss horizon about 45%; letters wide and heavy, caps 0.16 of the height (names) and 0.25 (scores), white; inning and arrow gold;
// out dots dim grey, about a third of a base. Not drawn soft (2011 is high-definition).
// glossy black fills each end between the rim (the inner arc) and the second, glassy arc; that outer arc
// runs from the top of the bug down round the end and tucks in behind the rim near the foot, the rim drawn over it.
import { el, otherSport, bases, statusText, scoreSlot, fit, teamPair, teamColor, panelInk, shade, FONTS } from '../kit.js';

const W = 642, H = 138;

export default {
  id: 'mlb-fox-11',
  size: { w: W, h: H },
  fonts: [FONTS.unbounded],
  css: `
.sb-mlb-fox-11 { font-family: 'SB Unbounded', 'Arial Black', sans-serif; font-weight: 700; color: #fff; }
/* the capsule: a thin pale rim round see-through black glass.
 Its ends (circle fits on the rim's ridge, Nov 25: r 68 and 72 px, 0.49-0.52 of the height, centres 82 px in from each end) bow
 25 px over the 105 px they span, then turn into the top and foot: elliptical corners 47 x 61 px */
.sb-mlb-fox-11 .cap { position: absolute; left: 14px; width: 608px; top: 8px; height: 122px; border-radius: 47px / 61px; box-sizing: border-box;
  background: linear-gradient(rgba(150,156,162,.6), rgba(128,134,140,.55) 23%, rgba(0,0,0,.55) 25%, rgba(0,0,0,.62) 70%, rgba(0,0,0,.76)); box-shadow: 0 3px 8px rgba(0,0,0,.5); overflow: hidden; }
/* ("keep reviewing metallic/glossy elements"), measured on the frame (capsule 41 crop px tall): one gloss across the
 whole capsule, lit from the top to a sharp horizon 24 % down (glass lum 95-110 above it, 40-60 under it, near 20 at the foot; the
 team panels about twice as bright above it as below, then a little darker to the foot); the rim pale blue-white (200,217,238), dim
 along the top (lum 110-150), full from a quarter down (lum 215-240) to the foot (170-200), about 1.5 crop px wide: drawn over the
 capsule as one stroke with that fade */
.sb-mlb-fox-11 .rim { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
/* the second, glassy arc outside each end and glossy black between it and the rim. Circle fits on the
 frame's right end: rim r 34 crop px, the outer arc r 32 with its centre 7.5 px further out and a little higher, so the band is
 widest over the upper half (about 16 px here at the middle) and the outer arc closes on the rim near the foot. Here the outer arc
 is a circle r 81 px, centre 82 px in and 54 down: it starts at the capsule's top line 16 px in, reaches 1.5 px from the side and
 crosses under the rim 118 px down, so its foot tucks in behind the capsule. Drawn under the capsule, so the rim lies on top */
/* measured per row on the frame, the
 outer arc keeps 4-6 crop px outside the rim all the way down to 87 % of the height (right end: 6, 6, 5, 5, 4, 4 px at 43-87 %) and
 only closes on it at the foot; ours closed from 60 % (gap 2 px at 81 %). Built as nfl-fox-12's brackets are: the outer arc is the
 rim's own curve (the same ellipse) set 10 px out, so the black band between them keeps its width, tucking in under the rim at the foot */
/* the band's shine measured on the frame: dark grey at the top (lum 35-45), a glossy light band 27-41 % down (lum 90-120),
 falling to black by 45 % and black to the foot (5-20); the outer arc a dim glassy line, lum 50 at the top, 75-90 at the middle
 and 100-135 low down where it tucks in */
.sb-mlb-fox-11 .arcs { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.sb-mlb-fox-11 .tp { position: absolute; top: 0; bottom: 0; width: 146px; display: grid; justify-items: center; align-content: center; gap: 2px; }
.sb-mlb-fox-11 .tp.a { left: 0; padding-left: 14px; } .sb-mlb-fox-11 .tp.h { right: 0; padding-right: 14px; }
/* bigger letters and scores. Measured on the frame: the letters' capitals 10 of the capsule's 41 crop px (0.245),
 the score's digits 13 (0.32); ours were 22 and 33 of 124 px (0.18, 0.27). Now 41 px type (capitals 30 px) and 54 px (digits 39 px) */
.sb-mlb-fox-11 .tp .n { font-size: 41px; line-height: 1; letter-spacing: 1px; } .sb-mlb-fox-11 .tp .s { font-size: 54px; line-height: 1; text-align: center; }
/* the inning where the frame has it: centred 213 px across, the figure's middle 68 px down, the arrow's 103 */
.sb-mlb-fox-11 .inn { position: absolute; left: 181px; width: 64px; top: 56px; display: grid; justify-items: center; color: #f2cc30; font-size: 26px; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-11 .inn .sb-ord { font-size: .75em; } .sb-mlb-fox-11 .inn b { font-size: 22px; margin-top: 8px; }
.sb-mlb-fox-11 .w { position: absolute; left: 160px; width: 300px; top: 0; bottom: 0; display: grid; place-items: center; font-size: 28px; white-space: nowrap; }
.sb-mlb-fox-11 .bz { position: absolute; left: 244px; top: 18px; }
.sb-mlb-fox-11 .bz .sb-bases i { background: linear-gradient(135deg, #5c6068, #34383e); border: 2px solid #1a1c20; }
.sb-mlb-fox-11 .bz .sb-bases i.on { background: linear-gradient(135deg, #ffe070, #f2c420 55%, #c89810); }
.sb-mlb-fox-11 .hp { position: absolute; left: 286px; top: 92px; width: 22px; height: 16px; background: #7c8088; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
.sb-mlb-fox-11 .c { position: absolute; left: 366px; width: 92px; top: 26px; text-align: center; font-size: 30px; line-height: 1; }
.sb-mlb-fox-11 .pips { position: absolute; left: 372px; width: 80px; top: 74px; display: flex; justify-content: space-between; }
.sb-mlb-fox-11 .pips i { width: 20px; height: 20px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #6a6e76, #3a3e44); }
.sb-mlb-fox-11 .pips i.on { background: radial-gradient(circle at 40% 35%, #fff2a0, #f2c420 60%, #b88a10); }
.sb-mlb-fox-11 .inn.os { top: 0; height: ${H}px; align-content: center; left: 172px; width: 76px; }
.sb-mlb-fox-11 .c.os { top: 0; height: ${H}px; display: grid; place-items: center; left: 360px; width: 104px; }
.sb-mlb-fox-11 .dt { position: absolute; left: 252px; width: 104px; top: 0; height: ${H}px; display: grid; place-items: center; text-align: center; font-size: 20px; line-height: 1.15; color: #fff; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const cols = teamPair(g.away, g.home, '#4a505a');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (cols[i].toLowerCase() !== String(teamColor(t, '#4a505a')).toLowerCase() ? panelInk(t, cols[i]) : '#fff'));
    const cap = el('div', 'cap');
    [g.away, g.home].forEach((t, i) => {
      const p = el('div', 'tp ' + (i ? 'h' : 'a'));
      // glossy team glass: lit above a sharp horizon 24 % down (frame), a little darker to the foot
      // 'make sure the top grey sections connect': the panel's top 30 px (the capsule's grey band) is the glass's own grey, as in mlb-fox-12
      p.style.background = 'linear-gradient(rgba(150,156,162,.6), rgba(128,134,140,.55) 80%) 0 0 / 100% 30px no-repeat, linear-gradient(rgba(255,255,255,.34), rgba(255,255,255,.26) 23%, rgba(255,255,255,0) 25%, rgba(0,0,0,0) 62%, rgba(0,0,0,.3)), linear-gradient(' + shade(cols[i], 0.06) + ', ' + cols[i] + ')';
      if (ink[i] !== '#fff') p.style.color = ink[i];
      p.append(el('span', 'n', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      cap.appendChild(p);
    });
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'arcs'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    // each end: the band (outer arc, then straight in behind the team panel) in glossy black, then the outer arc's glassy line
    const arc = (m) => {
      const x = (v) => (m ? W - v : v);
      // "reference arcing in nfl-fox-12": as on that box the outer arc is the rim's own curve set out (there the band
      // and the silver line are one circle 5.4 px apart), here 10 px out (the frame's 1 crop px from the bug's side at mid height), down to 90 % of the height, then it tucks in
      // under the rim at the foot
      return 'M ' + x(50.95) + ' 6.75 A 48.2 62.2 0 0 ' + (m ? 1 : 0) + ' ' + x(28.5) + ' 124 Q ' + x(35) + ' 132 ' + x(56) + ' 131.5';
    };
    // closed along the capsule's top line and inside it (hidden there by the team panel)
    const band = (m) => arc(m) + ' L ' + (m ? W - 70 : 70) + ' 131.5 L ' + (m ? W - 70 : 70) + ' 6.75 Z';
    svg.innerHTML = '<defs><linearGradient id="f11arc" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="128">' +
      '<stop offset="0" stop-color="rgb(220,234,248)" stop-opacity=".2"/><stop offset=".45" stop-color="rgb(220,234,248)" stop-opacity=".34"/>' +
      '<stop offset="1" stop-color="rgb(230,240,250)" stop-opacity=".55"/></linearGradient>' +
      '<linearGradient id="f11gl" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="130">' +
      '<stop offset="0" stop-color="#8a8e94"/><stop offset=".2" stop-color="#7c8086"/><stop offset=".36" stop-color="#72767c"/>' +
      '<stop offset=".42" stop-color="#2a2c30"/><stop offset=".47" stop-color="#08090a"/><stop offset="1" stop-color="#0e0f11"/></linearGradient>' +
      '<linearGradient id="f11rim" gradientUnits="userSpaceOnUse" x1="0" y1="7" x2="0" y2="131">' +
      '<stop offset="0" stop-color="#c8d9ee" stop-opacity=".5"/><stop offset=".12" stop-color="#c8d9ee" stop-opacity=".62"/><stop offset=".27" stop-color="#e4eefa"/>' +
      '<stop offset=".75" stop-color="#dce8f6"/><stop offset="1" stop-color="#c8d6e8" stop-opacity=".85"/></linearGradient></defs>' +
      [0, 1].map((m) => '<path d="' + band(m) + '" fill="url(#f11gl)"/>' +
        '<path d="' + arc(m) + '" fill="none" stroke="url(#f11arc)" stroke-width="3" stroke-linecap="round"/>').join('');
    const rim = document.createElementNS(ns, 'svg');
    rim.setAttribute('class', 'rim'); rim.setAttribute('width', W); rim.setAttribute('height', H); rim.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    rim.innerHTML = '<rect x="12.75" y="6.75" width="610.5" height="124.5" rx="48.2" ry="62.2" fill="none" stroke="url(#f11rim)" stroke-width="3"/>';
    root.append(svg, cap, rim);
    if (live) {
      // the inning squeezed to its box
      const inn = el('div', 'inn'); const n = fit(el('span', '', g.period.label)); n.appendChild(el('span', 'sb-ord', g.period.suffix || ''));
      inn.append(n, el('b', '', b.half === 'bot' ? '▼' : '▲'));
      const bz = el('div', 'bz'); bz.appendChild(bases(b.bases, 34));
      const pips = el('div', 'pips'); for (let i = 0; i < 3; i++) pips.appendChild(el('i', i < b.outs ? 'on' : ''));
      root.append(inn, bz, el('div', 'hp'), el('div', 'c', b.balls + '-' + b.strikes), pips);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, one detail where the bases were, the clock in the count's spot (no outs)
      const os = otherSport(g, 8);
      root.appendChild(fit(el('div', 'inn os', os.period)));
      if (os.detail) root.appendChild(el('div', 'dt', os.detail));
      root.appendChild(fit(el('div', 'c os', os.clock)));
    } else root.appendChild(el('div', 'w', statusText(g, time)));
  },
};
