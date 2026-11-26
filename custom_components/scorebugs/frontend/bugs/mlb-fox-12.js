// "Logo capsule '12": after FOX's MLB score capsule of the 2012 regular season. A capsule like 2011's with a thin white arc inside each round end: each team's glossy panel in its
// colour holds its logo over a big score, and the smoked glass between them holds the inning in gold over a gold arrow, the bases as
// three small spheres (gold when taken), and in gold the figure the frame used for the pitch speed (no speed in the data: the count
// goes there) with the outs as small dots under it.
// measured: capsule 98% of the width and 91% of the height, team panels 21% (away) and 24% (home) of the width; logos
// 36% of the height, scores caps 0.27; inning caps 0.2 in gold; bases 0.1 of the height across. Not drawn soft.
// as 2011's: glossy black fills each end between the rim and the outer glassy arc, which runs from the
// capsule's top line round the end and tucks in behind the rim near the foot; the bases are diamonds (tiles) with home plate, as 2011's.
import { el, fit, otherSport, logo, bases, statusText, scoreSlot, teamPair, teamColor, panelInk, shade, FONTS } from '../kit.js';

const W = 564, H = 135;

export default {
  id: 'mlb-fox-12',
  size: { w: W, h: H },
  fonts: [FONTS.unbounded],
  css: `
.sb-mlb-fox-12 { font-family: 'SB Unbounded', 'Arial Black', sans-serif; font-weight: 700; color: #fff; }
/* the same build as 2011's capsule: the bright white arc is the capsule's own rim at each round end (circle fit on its
 ridge, Nov 25: r 61 px, 0.45 of the height, the end 15 px in from the bug's side), with a dark gap of 6 px between it and the team
 panel, and a second, faint glassy arc about 13 px further out (frame: seen over the middle and lower part of each end).
 The glass between the panels is see-through black */
.sb-mlb-fox-12 .cap { position: absolute; left: 15px; width: 534px; top: 8px; height: 122px; border-radius: 61px; overflow: hidden;
  background: linear-gradient(rgba(150,156,162,.6), rgba(128,134,140,.55) 23%, rgba(0,0,0,.55) 26%, rgba(0,0,0,.62) 70%, rgba(0,0,0,.76)); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
/* ("same thing with the metallic elements" as 2011's), measured on the frame (capsule 41 crop px tall): one gloss over
 the whole capsule, lit from the top to a sharp horizon 26 % down (glass lum 120-145 above it, 30-60 under it; the team panels about
 twice as bright above it, then darkening to the foot: 90, 50 by three quarters, 30 at the foot); the rim white, a little dimmer
 along the top (lum 150-200), full on the round ends (200-230) and fading again low on the ends: drawn over the capsule as one
 stroke with that fade */
.sb-mlb-fox-12 .rim { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.sb-mlb-fox-12 .tp { position: absolute; top: 0; bottom: 7px; width: 121px; display: grid; justify-items: center; align-content: center; gap: 2px; }
.sb-mlb-fox-12 .tp.a { left: 7px; padding-left: 12px; border-radius: 54px 0 0 54px; } .sb-mlb-fox-12 .tp.h { right: 7px; width: 129px; padding-right: 12px; border-radius: 0 54px 54px 0; }
.sb-mlb-fox-12 .arcs { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
/* the band between the rim and the outer arc is glossy black, and the outer arc (circle r 73 px, centre 74 px
 in and 54 down, as 2011's fit: widest over the upper half, about 12 px at the middle) starts at the capsule's top line 18 px in and
 crosses under the rim 118 px down, its foot tucked in behind the capsule; drawn under the capsule so the rim lies on top */
/* the band's shine and the outer arc measured on the frame: the band dark grey at the top (lum 25-65), a glossy light band
 27-44 % down (75-105), black from about half way (20-30); the outer arc bright near the top (lum 200-240), dim over the middle
 (55-65) and a little brighter low down (70-100) where it tucks in */
/* measured per row on the frame, the outer arc keeps
 4-5 crop px outside the rim down to 71 % of the height (right end 5, 4, 5 at 53-71 %; left 5 at 62-71 %) before it closes at the
 foot; ours closed from the middle (3.3 at 63 %, 2.7 at 72 %, 2 at 81 %). Built as nfl-fox-12's brackets: the outer arc is the
 rim's own circle (r 59.5) set 14 px out, so the black band keeps its width, and tucks in under the rim at the foot */
.sb-mlb-fox-12 .tp .sb-logo { width: 48px; height: 48px; object-fit: contain; }
.sb-mlb-fox-12 .tp .s { font-size: 44px; line-height: 1; text-align: center; }
/* the middle as placed on the frame (crop x 3:1): inning centred at 191 clear of the away panel (ends 148), bases count at 362 (the frame's 374 ran into our home panel) */
.sb-mlb-fox-12 .inn { position: absolute; left: 156px; width: 70px; top: 34px; display: grid; justify-items: center; color: #f2c840; font-size: 24px; line-height: 1; white-space: nowrap; }
.sb-mlb-fox-12 .inn .sb-ord { font-size: .7em; } .sb-mlb-fox-12 .inn b { font-size: 18px; margin-top: 8px; }
/* the bases as diamonds (tiles) with home plate under them, as 2011's: centred 260 px across, where the frame has them */
.sb-mlb-fox-12 .bz { position: absolute; left: 223px; top: 33px; }
.sb-mlb-fox-12 .bz .sb-bases i { background: linear-gradient(135deg, #5c6068, #34383e); border: 2px solid #1a1c20; }
.sb-mlb-fox-12 .bz .sb-bases i.on { background: linear-gradient(135deg, #ffe070, #f2c420 55%, #c89810); }
.sb-mlb-fox-12 .hp { position: absolute; left: 252px; top: 90px; width: 16px; height: 12px; background: #7c8088; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
.sb-mlb-fox-12 .c { position: absolute; left: 326px; width: 72px; top: 38px; text-align: center; color: #f2c840; font-size: 30px; line-height: 1; }
.sb-mlb-fox-12 .pips { position: absolute; left: 341px; width: 42px; top: 80px; display: flex; justify-content: space-between; }
.sb-mlb-fox-12 .pips i { width: 10px; height: 10px; border-radius: 50%; background: rgba(160,164,170,.5); }
.sb-mlb-fox-12 .pips i.on { background: #f6e8a0; }
.sb-mlb-fox-12 .w { position: absolute; left: 150px; width: 266px; top: 0; bottom: 0; display: grid; place-items: center; font-size: 24px; white-space: nowrap; }
.sb-mlb-fox-12 .inn.os { top: 0; height: ${H}px; align-content: center; }
.sb-mlb-fox-12 .inn.os { left: 152px; width: 74px; }
.sb-mlb-fox-12 .c.os { top: 0; height: ${H}px; display: grid; place-items: center; left: 226px; width: 104px; }
.sb-mlb-fox-12 .dt { position: absolute; left: 330px; width: 86px; top: 0; height: ${H}px; display: grid; place-items: center; text-align: center; font-size: 14px; line-height: 1.2; color: #fff; white-space: pre-line; }
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
      // glossy team glass: lit above a sharp horizon 26 % down (frame), darkening to the foot
      // 'make sure the grey connects on the top': the panel runs up to the capsule's top line and its top 26 % is the glass's own
      // grey, so one grey band crosses the whole top
      p.style.background = 'linear-gradient(rgba(150,156,162,.6), rgba(128,134,140,.55) 80%) 0 0 / 100% 32px no-repeat, linear-gradient(rgba(255,255,255,.34), rgba(255,255,255,.26) 20%, rgba(255,255,255,0) 22%, rgba(0,0,0,0) 50%, rgba(0,0,0,.38)), linear-gradient(' + shade(cols[i], 0.06) + ', ' + cols[i] + ')';
      if (ink[i] !== '#fff') p.style.color = ink[i];
      p.append(logo(t, 48), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      cap.appendChild(p);
    });
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'arcs'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    // each end: the band (outer arc, then straight in behind the team panel) in glossy black, then the outer arc's glassy line
    const arc = (m) => {
      const x = (v) => (m ? W - v : v);
      // the outer arc is the rim's own circle set 14 px
      // out, as nfl-fox-12's band and silver line share one curve, down to 90 % of the height, then it tucks in under the rim at the foot
      return 'M ' + x(62) + ' 9.5 A 59.5 59.5 0 0 ' + (m ? 1 : 0) + ' ' + x(34) + ' 121.5 Q ' + x(40) + ' 129.5 ' + x(68) + ' 128.5';
    };
    // closed along the capsule's top line and inside it (hidden there by the team panel)
    const band = (m) => arc(m) + ' L ' + (m ? W - 76 : 76) + ' 128.5 L ' + (m ? W - 76 : 76) + ' 9.5 Z';
    svg.innerHTML = '<defs><linearGradient id="f12arc" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="124">' +
      '<stop offset="0" stop-color="rgb(236,242,250)" stop-opacity=".85"/><stop offset=".12" stop-color="rgb(220,234,248)" stop-opacity=".5"/>' +
      '<stop offset=".45" stop-color="rgb(220,234,248)" stop-opacity=".26"/><stop offset="1" stop-color="rgb(220,234,248)" stop-opacity=".4"/></linearGradient>' +
      '<linearGradient id="f12gl" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="130">' +
      '<stop offset="0" stop-color="#8a8e94"/><stop offset=".2" stop-color="#7c8086"/><stop offset=".3" stop-color="#5e6268"/><stop offset=".4" stop-color="#666a70"/>' +
      '<stop offset=".47" stop-color="#1e2023"/><stop offset=".52" stop-color="#08090a"/><stop offset="1" stop-color="#0e0f11"/></linearGradient>' +
      '<linearGradient id="f12rim" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="130">' +
      '<stop offset="0" stop-color="#e8eef6" stop-opacity=".7"/><stop offset=".22" stop-color="#f2f6fb"/><stop offset=".65" stop-color="#eef2f8"/>' +
      '<stop offset="1" stop-color="#dfe6ee" stop-opacity=".7"/></linearGradient></defs>' +
      [0, 1].map((m) => '<path d="' + band(m) + '" fill="url(#f12gl)"/>' +
        '<path d="' + arc(m) + '" fill="none" stroke="url(#f12arc)" stroke-width="3" stroke-linecap="round"/>').join('');
    const rim = document.createElementNS(ns, 'svg');
    rim.setAttribute('class', 'rim'); rim.setAttribute('width', W); rim.setAttribute('height', H); rim.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    rim.innerHTML = '<rect x="16.5" y="9.5" width="531" height="119" rx="59.5" ry="59.5" fill="none" stroke="url(#f12rim)" stroke-width="3"/>';
    root.append(svg, cap, rim);
    if (live) {
      const inn = el('div', 'inn'); const n = el('span', '', g.period.label); n.appendChild(el('span', 'sb-ord', g.period.suffix || ''));
      inn.append(n, el('b', '', b.half === 'bot' ? '▼' : '▲'));
      root.appendChild(inn);
      // the bases as three diamonds (tiles) with home plate under them
      const bz = el('div', 'bz'); bz.appendChild(bases(b.bases, 24)); root.append(bz, el('div', 'hp'));
      const pips = el('div', 'pips'); for (let i = 0; i < 3; i++) pips.appendChild(el('i', i < b.outs ? 'on' : ''));
      root.append(el('div', 'c', b.balls + '-' + b.strikes), pips);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, one detail where the bases were, the clock in the count's spot (no outs)
      const os = otherSport(g, 8);
      root.appendChild(fit(el('div', 'inn os', os.period)));
      if (os.detail) root.appendChild(el('div', 'dt', os.detail));
      root.appendChild(fit(el('div', 'c os', os.clock)));
    } else root.appendChild(el('div', 'w', statusText(g, time)));
  },
};
