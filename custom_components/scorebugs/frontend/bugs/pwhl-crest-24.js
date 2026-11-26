// "Crest tabs '24": after the women's pro hockey league's own world feed of its second season (2024-25). A low bug at the foot of the picture, centred: a silver plate wider at its foot holding the two
// scores in dark grey either side of the league's logo, which stands up out of the plate; a smaller silver plate hanging under it with
// the period and the clock; and at each side a flat panel of the team's colour, its edge leaning with the plate's, the team's crest
// standing tall out of it and the city on a darker tab across its foot.
// measured (crop px of 880 x 205): plate y 52-157, 370 wide at the top (255-625) and 450 at the foot (215-665), sides leaning 21 deg;
// team panels y 52-150, 202 wide at the top, 5 px from the plate; crests about 175 px tall from the top of the picture to the panel's
// foot; city tabs y 145-172, reaching 30 px past the panel's outer end, capitals 20 px; scores centred 77 px in from the plate's top
// corners, capitals 75 px (#3f4142); league logo 200 x 126 from y 22; clock plate y 157-205, 340 wide narrowing 12 px a side to its foot,
// capitals 30 px. Surfaces (sample.py): the plate L 90 at the top to 82 at its foot, the clock plate a little lighter, panels flat.
// measured on the 1080p frame with sample.py: the team panels run straight up to the plate's slanted sides (a 2 px dark seam, no gap)
// and darken towards it (Montreal L 24 at the crest to 11 at the seam over about 30 px) and a little to their foot; the plate is lit
// in the middle and falls off to its slanted ends (L 91 at the top centre, 80 near the sides, 72-79 along them) and to its foot (85);
// a dark 2 px rule (L 30) between the plate and the white clock plate under it (L 92); the league logo's ink 192 x 122 (ours was 95 x
// 65) with a white glowing rim round its purple.
// loop pass 1: the clock plate's sides lean 29.5 deg on air (geomdiff on the 1080p frame; ours leaned 14) and its lower
// corners are rounded (r 10-11): it narrows 26 px a side to its foot, so the white of the plate above runs down into it as one shape.
import { el, logo, ordinal, statusText, teamColor, shade, relight, leagueLogo, marks, scoreSlot, FONTS } from '../kit.js';

const W = 880, H = 205, TOP = 52, FOOT = 157, LEAN = 0.4;
const city = (t) => {
  const n = String(t.name || ''), l = String(t.longName || '');
  const c = l && n && l.length > n.length && l.endsWith(n) ? l.slice(0, -n.length).trim() : (t.abbr || n);
  return c.toUpperCase();
};

export default {
  id: 'pwhl-crest-24',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-pwhl-crest-24 { font-family: 'SB Montserrat', Arial, sans-serif; font-weight: 700; color: #3f4142; }
.sb-pwhl-crest-24 .seam { position: absolute; left: 212px; top: ${TOP}px; width: 456px; height: ${FOOT - TOP + 2}px; background: #2a1f26;
  clip-path: polygon(40px 0, 416px 0, 100% 100%, 0 100%); }
.sb-pwhl-crest-24 .plate { position: absolute; left: 215px; top: ${TOP}px; width: 450px; height: ${FOOT - TOP}px;
  background: linear-gradient(90deg, rgba(40,44,52,.2) 4%, rgba(40,44,52,.07) 14%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(40,44,52,.07) 86%, rgba(40,44,52,.2) 96%),
    radial-gradient(60% 90% at 50% 0%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%),
    linear-gradient(#e2e4e6, #d8dcdd 45%, #d1d5d6 80%, #cdd0d3);
  clip-path: polygon(40px 0, 410px 0, 100% 100%, 0 100%); }
.sb-pwhl-crest-24 .pn { position: absolute; top: ${TOP}px; width: 222px; height: 98px; }
.sb-pwhl-crest-24 .pn.a { left: 48px; clip-path: polygon(0 0, 100% 0, calc(100% - 39px) 100%, 0 100%); }
.sb-pwhl-crest-24 .pn.h { right: 48px; clip-path: polygon(0 0, 100% 0, 100% 100%, 39px 100%); }
.sb-pwhl-crest-24 .crest { position: absolute; top: 0; width: 176px; height: 148px; object-fit: contain; object-position: 50% 100%; }
.sb-pwhl-crest-24 .crest.a { left: 52px; } .sb-pwhl-crest-24 .crest.h { right: 52px; }
.sb-pwhl-crest-24 .tab { position: absolute; top: 145px; height: 27px; width: 214px; display: grid; place-items: center; color: #fff; font-size: ${Math.round(20 / 0.7)}px; font-weight: 700; line-height: 1; white-space: nowrap; letter-spacing: .3px; }
.sb-pwhl-crest-24 .tab.a { left: 18px; clip-path: polygon(0 0, 100% 0, calc(100% - 11px) 100%, 0 100%); padding-right: 8px; box-sizing: border-box; }
.sb-pwhl-crest-24 .tab.h { right: 18px; clip-path: polygon(0 0, 100% 0, 100% 100%, 11px 100%); padding-left: 8px; box-sizing: border-box; }
.sb-pwhl-crest-24 .sc { position: absolute; top: ${TOP}px; height: ${FOOT - TOP}px; width: 120px; display: grid; place-items: center; font-size: ${Math.round(75 / 0.7)}px; font-weight: 600; line-height: 1; min-width: 0 !important; }
.sb-pwhl-crest-24 .sc.a { left: 232px; } .sb-pwhl-crest-24 .sc.h { right: 232px; }
.sb-pwhl-crest-24 .sc.sb-pre-rec { font-weight: 700; }
.sb-pwhl-crest-24 .lg { position: absolute; left: 270px; top: -14px; width: 340px; height: 204px; display: grid; place-items: center; }
.sb-pwhl-crest-24 .lg .sb-league { width: 340px; height: 204px; object-fit: contain; filter: drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 4px rgba(255,255,255,.7)); }
.sb-pwhl-crest-24 .lg .sb-league:not(img) { width: auto; height: auto; color: #5a24a0; font-size: 44px; font-weight: 800; }
.sb-pwhl-crest-24 .ck { position: absolute; left: 270px; top: ${FOOT}px; width: 340px; height: ${H - FOOT}px; background: linear-gradient(#edefee, #e6e9e7 55%, #dcdfde); box-shadow: inset 0 2px 0 #4b4549;
  clip-path: path('M0 0 L340 0 L318.8 39.2 Q314 48 304 48 L36 48 Q26 48 21.2 39.2 Z'); display: flex; align-items: center; justify-content: center; gap: 42px; font-size: ${Math.round(30 / 0.7)}px; line-height: 1; white-space: nowrap; }
.sb-pwhl-crest-24 .ck .sb-ord { font-size: .72em; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, s]) => {
      const c = teamColor(t, '#4b3a6e');
      // shaded in 3D: darker towards the plate (it stands over the panel) and a little towards the foot
      const pn = el('div', 'pn ' + s), inner = s === 'a' ? '90deg' : '270deg';
      pn.style.background = 'linear-gradient(rgba(255,255,255,.05), rgba(0,0,0,.12)), linear-gradient(' + inner + ', ' + c + ' 0%, ' + c + ' 62%, ' + relight(c, -6) + ' 80%, ' + relight(c, -13) + ' 100%)';
      const tab = el('div', 'tab ' + s, city(t)); tab.style.background = shade(c, -0.22);
      root.append(pn, logo(t, 176, 'sb-logo crest ' + s), tab);
    });
    root.append(el('div', 'seam'), el('div', 'plate'));
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, s]) => {
      const sc = scoreSlot(el('div', 'sc ' + s, !pre && t.score != null ? String(t.score) : ''), g);
      // two or three figures (other sports on this bug) step down so they keep clear of the league logo and the crests
      const k = sc.textContent.length; if (k > 1) sc.style.fontSize = Math.round(75 / 0.7 * (k > 2 ? 0.5 : 0.66)) + 'px';
      root.appendChild(sc);
    });
    // the league's logo stands up out of the plate, as on air (its letters where there is none)
    const lg = el('div', 'lg');
    if (mk.league) lg.appendChild(leagueLogo(g, 200));
    root.appendChild(lg);
    const ck = el('div', 'ck');
    if (live) ck.append(ordinal(g.period, 'pd'), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(ck);
  },
};
