// "Clock ring '22": after NBC's Super Bowl LVI bug (2022). A bar of two team
// panels meeting at a round dark-glass dial with a silver rim in the middle, which holds the network's mark (here the Home Assistant logo),
// the clock and the quarter. Each panel: the team's logo on a lighter slanted tile at the outer end, its letters, its timeouts as white
// dashes under them, and its score on a darker part of its colour next to the dial. Under the team with the ball, the down and distance on
// a tab of its colour. The play clock under the dial needs data the sensor lacks.
// Rework: each panel one run of colour, the team's colour at the outer end, darker through the middle of the letters
// and black towards the dial (measured on the frame along the Rams' panel: full blue to 0.3 of the panel's length from its end, about
// 0.7 as bright at the letters' middle, 0.46, near black #141b21 from 0.64 under the score; the Bengals' the same from the other side);
// the logos much larger on that colour itself (no lighter tile), cut by the panel's end and top and foot; glass over it all.
import { el, logo, statusText, teamColor, shade, inkOn, haMark, marks, scoreSlot, pips, fit, FONTS, GLOSS } from '../kit.js';

const W = 1180, RING = 172, BAR_T = 26, BAR = 108, TAB = 50, H = BAR_T + BAR + TAB, BASE_H = Math.max(RING, BAR_T + BAR) + 4;
const PANEL = (W - RING) / 2 + 30;

export default {
  id: 'nfl-nbc-22',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H : BASE_H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-nbc-22 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 92%; color: #fff; }
.sb-nfl-nbc-22 .pn { position: absolute; top: ${BAR_T}px; height: ${BAR}px; width: ${PANEL}px; display: flex; align-items: stretch; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,.5); }
.sb-nfl-nbc-22 .pn.a { left: 0; border-radius: 6px 0 0 6px; }
.sb-nfl-nbc-22 .pn.h { right: 0; flex-direction: row-reverse; border-radius: 0 6px 6px 0; }
/* the logo on the panel's own colour, about 1.3 times the bar's height (frame: the Rams' A fills the bar and is cut at its end), centred
   a little out towards the end so the panel cuts it there; the kit slides it to its focal point in what shows */
.sb-nfl-nbc-22 .lg { width: 150px; flex: none; position: relative; display: grid; place-items: center; }
.sb-nfl-nbc-22 .lg .sb-logo { width: 190px; height: 140px; flex: none; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); }
.sb-nfl-nbc-22 .pn.a .lg .sb-logo { margin-left: -36px; } .sb-nfl-nbc-22 .pn.h .lg .sb-logo { margin-right: -36px; }
/* glass over each panel: a light reflective top half with a soft horizon, a bright hairline along the top edge, darker at the foot */
.sb-nfl-nbc-22 .pn::after { content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background: linear-gradient(rgba(255,255,255,.3), rgba(255,255,255,.12) 40%, rgba(255,255,255,.04) 49%, rgba(0,0,0,0) 51%, rgba(0,0,0,.22));
  box-shadow: inset 0 2px 0 rgba(255,255,255,.4), inset 0 -2px 0 rgba(0,0,0,.35); }
.sb-nfl-nbc-22 .tx { position: relative; z-index: 2; flex: 1; min-width: 0; display: grid; align-content: center; justify-items: center; gap: 8px; }
/* the letters kept 16 px further from the logo's side, so a wide logo (the Raptors' claw) never reaches them; a wide set (PHX) is
 squeezed to the room left */
.sb-nfl-nbc-22 .pn.a .tx { padding-left: 16px; } .sb-nfl-nbc-22 .pn.h .tx { padding-right: 16px; }
/* the letters wide and low and the scores big, as on air (frame: LAR about 1.3 cap heights per letter; the score's capitals 0.69 of the bar) */
.sb-nfl-nbc-22 .nm { font-size: 54px; font-stretch: 125%; line-height: 1; white-space: nowrap; text-shadow: 0 2px 3px rgba(0,0,0,.5); }
.sb-nfl-nbc-22 .tx .sb-rec { font-size: 32px; line-height: 1; }
.sb-nfl-nbc-22 .to { display: flex; gap: 12px; } .sb-nfl-nbc-22 .to i { width: 34px; height: 5px; background: rgba(255,255,255,.95); } .sb-nfl-nbc-22 .to i.used { opacity: .22; }
.sb-nfl-nbc-22 .sc { position: relative; z-index: 2; width: 150px; flex: none; display: grid; place-items: center; font-size: 96px; line-height: 1; text-shadow: 0 2px 3px rgba(0,0,0,.5); }
.sb-nfl-nbc-22 .pn.a .sc { padding-right: 30px; } .sb-nfl-nbc-22 .pn.h .sc { padding-left: 30px; }
/* a thin light line between the letters and the score, brightest at the middle and fading out towards the top and the foot (on air the line between LAR and 13) */
.sb-nfl-nbc-22 .sc::before { content: ''; position: absolute; top: 10%; bottom: 10%; width: 2px; background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.75) 50%, rgba(255,255,255,0)); }
.sb-nfl-nbc-22 .pn.a .sc::before { left: 0; } .sb-nfl-nbc-22 .pn.h .sc::before { right: 0; }
/* the dial: dark glass in a silver ring, over the panels' inner ends */
.sb-nfl-nbc-22 .ring { position: absolute; left: ${(W - RING) / 2}px; top: 0; width: ${RING}px; height: ${RING}px; border-radius: 50%; z-index: 2; display: grid; justify-items: center; align-content: center; gap: 2px;
  /* the dial's glass a tad darker: #1f2429 to #0d1013 (was #2b3138 to #15191e) */
  background: radial-gradient(circle at 50% 30%, rgba(255,255,255,.15), rgba(255,255,255,0) 55%), radial-gradient(circle, #1f2429 0 60%, #0d1013);
  box-shadow: 0 0 0 5px #c9ced4, 0 0 0 7px #6d737a, 0 5px 12px 6px rgba(0,0,0,.45), inset 0 3px 6px rgba(255,255,255,.2); }
.sb-nfl-nbc-22 .ring .sb-ha { color: #fff; opacity: .9; }
.sb-nfl-nbc-22 .ring .clk { font-size: 44px; line-height: 1; }
.sb-nfl-nbc-22 .ring .q { font-size: 30px; line-height: 1; } .sb-nfl-nbc-22 .ring .q .sb-ord { font-size: .72em; }
.sb-nfl-nbc-22 .ring .w { font-size: 28px; line-height: 1.05; text-align: center; padding: 0 16px; }
/* the down tab runs from the outer end of the team with the ball to the dial, its panel's run of colour carried on through it */
.sb-nfl-nbc-22 .dn { position: absolute; top: ${BAR_T + BAR}px; height: ${TAB}px; width: ${PANEL}px; display: grid; place-items: center; font-size: 38px; line-height: 1; border-radius: 0 0 6px 6px; box-shadow: 0 4px 8px rgba(0,0,0,.45); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const cols = {};
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k]) => {
      const c = teamColor(t, '#3a3f47'); cols[k] = c;
      const pn = el('div', 'pn ' + k);
      const run = 'linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, 0.08) + ', ' + c + ' 26%, ' + shade(c, -0.3) + ' 46%, ' +
        shade(c, -0.68) + ' 60%, #0c0d0f 72%, #050506)';
      cols[k + 'run'] = run;
      pn.style.background = run;
      // the letters sit where the colour has darkened: white there unless that is still light (a white or gold team)
      pn.style.color = inkOn(shade(c, -0.3)) === '#111' ? shade(c, -0.85) : '#fff';
      const lg = el('div', 'lg'); lg.appendChild(logo(t, 190));
      const tx = el('div', 'tx');
      tx.appendChild(fit(el('span', 'nm', (t.abbr || '').toUpperCase())));
      if (g.status === 'pre' && t.record) tx.appendChild(el('span', 'sb-rec', t.record));
      if (live && t.timeouts != null) tx.appendChild(pips(t.timeouts, 3, 'to'));
      const sc = scoreSlot(el('div', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      sc.style.color = '#fff';   // on the black end of the panel
      pn.append(lg, tx, sc);
      root.appendChild(pn);
    });
    const ring = el('div', 'ring');
    if (marks(opts).ha) ring.appendChild(haMark(36));
    if (live) {
      const q = el('span', 'q'); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase()));
      ring.append(el('span', 'clk', g.clock || ''), q);
    } else ring.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(ring);
    // the down tab, in the colour of the team with the ball, under its letters
    if (live && g.football && g.football.short) {
      const k = g.home.hasBall ? 'h' : 'a', c = cols[k];
      const dn = el('div', 'dn', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal'));
      dn.style.background = 'linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,.3)), ' + cols[k + 'run'];
      // the words sit about half way along, where the run has darkened: white with a soft shadow on every colour
      dn.style.color = '#fff'; dn.style.textShadow = '0 2px 3px rgba(0,0,0,.6)';
      dn.style[k === 'a' ? 'left' : 'right'] = '0';
      dn.style.borderRadius = k === 'a' ? '0 0 6px 6px' : '0 0 6px 6px';
      root.appendChild(dn);
    }
  },
};
