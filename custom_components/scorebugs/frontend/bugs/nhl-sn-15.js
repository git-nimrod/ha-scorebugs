// "Stripe panels '15": after Sportsnet's NHL score bar of the mid-2010s. A dark bar: the network's tile at the left (here the Home Assistant logo), a chrome seam, then each team on one deep panel of
// its colour, its logo at the outer end parted from its letters by two pale slashes; both scores in dark figures on silver tiles in the
// middle; then the period and the clock on dark grey tiles.
// measured (crop px of 356 x 22): mark 0-27, seam 27-33, panel 33-123 (logo 35-60, slashes 60-75, letters 75-115), scores 124-155 and
// 156-187, panel 188-275 (letters 190-230, slashes 235-245, logo 245-275), period 278-310, clock 312-353; capitals 0.5 of the height;
// the team panels are very deep shades (the Rangers' and the Leafs' blues read near navy).
// read on the crop:
// logos about 1.5x the panel's height, cut at the top and bottom by it (the Rangers' shield shows from under its lettering), at
// the panel's outer end (centres 15 px in from it)
// one pale line between logo and letters, about 2 px wide and leaning 33 deg from upright, the two mirrored: the away panel's
// leans like a backslash (x 67.5 at y 12, 72 at y 19), the home panel's like a slash (x 243 at y 12, 238.5 at y 19)
// the dividing lines: a light grey line about 2 px wide (lum 120-160) with a dark edge (lum 10-25) before the period's tile
// (x 276-279), before the clock's (x 310-312) and after it (x 353-355); a darker grey line between the two score tiles (x 154-
// 156, lum 70-150); the chrome seam after the network's tile (x 27-32)
// on the crop each logo runs right up to the pale line and is cut
// along it (the Rangers' shield from x 35 to the line at 67-72, the Leafs' leaf from the line at 238-243 to 275), washed into the
// panel. So the logo grows to 1.85x the panel's height (it was 1.5x; the shield on air is cut top and bottom and still reaches the
// line) and its centre moves 20 px nearer the line (70 px in from the panel's end), so it runs on past the line; it is cut along the
// line's far edge so it passes behind it, and it fades into the panel towards the line (full at its outer end).
import { el, logo, statusText, haMark, marks, scoreSlot, fit, teamPair, shade, ordinal, FONTS } from '../kit.js';

const K = 1180 / 356, H = Math.round(24 * K);
const C = { mk: 89, seam: 20, tm: 296, s: 102, pd: 106, ck: 136 }, GAP = 6;
const W = C.mk + C.seam + 2 * (C.tm + C.s) + C.pd + C.ck + 7 * GAP + GAP;
// the logo square (1.5x the panel's height, cut by it), its centre 50 px in from the panel's outer end; the pale line 122 px in
const LG = 140, LC = 70, SL = 122;
// the line's lean across the panel: tan 33 deg times half the panel's height (76 px) either side of its middle
const LEAN = Math.round(Math.tan(33 * Math.PI / 180) * 38);
const CAP = 11 * K, PX = Math.round(CAP / 0.7109);
const GL = 'linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,.05) 48%, rgba(0,0,0,.1) 52%, rgba(0,0,0,.25))';

export default {
  id: 'nhl-sn-15',
  size: { w: W, h: H },
  // only an almost one-colour logo goes white: at this size the Leafs' leaf on its own deep blue turned into a blank white leaf (on air
  // it keeps its own colours, washed into the panel)
  monoLogos: 0.97,
  // before and after the game the start time or FINAL stands on one tile across the period's and the clock's room (on one tile
  // alone it had to be set very small)
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-sn-15 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-nhl-sn-15 .row { position: absolute; inset: 0; display: flex; gap: ${GAP}px; background: #0c0c0d; box-shadow: inset 0 0 0 1px #6b6c70, 0 2px 6px rgba(0,0,0,.5); padding: 2px ${GAP}px 2px 0; box-sizing: border-box; }
.sb-nhl-sn-15 .row > * { flex: none; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: ${PX}px; overflow: hidden; }
.sb-nhl-sn-15 .mk { width: ${C.mk}px; background: ${GL}, linear-gradient(#4a4a4e, #2a2a2d); } .sb-nhl-sn-15 .mk .sb-ha { color: #fff; }
.sb-nhl-sn-15 .seam { width: ${C.seam}px; background: linear-gradient(90deg, #3a3b3e, #c9ccd0 30%, #6d7074 50%, #c9ccd0 70%, #3a3b3e); }
.sb-nhl-sn-15 .tm { width: ${C.tm}px; position: relative; justify-content: space-between; }
.sb-nhl-sn-15 .tm .sb-logo { position: absolute; top: calc(50% - ${LG / 2}px); width: ${LG}px; height: ${LG}px; object-fit: contain; }
.sb-nhl-sn-15 .tm.a .sb-logo { left: ${LC - LG / 2}px; } .sb-nhl-sn-15 .tm.h .sb-logo { right: ${LC - LG / 2}px; }
/* the logo's own layer, cut along the far edge of the pale line and fading into the panel towards it */
.sb-nhl-sn-15 .tm .lw { position: absolute; inset: 0; opacity: .9; }
.sb-nhl-sn-15 .tm.a .lw { clip-path: polygon(0 0, ${SL + 3 - LEAN}px 0, ${SL + 3 + LEAN}px 100%, 0 100%);
  -webkit-mask-image: linear-gradient(90deg, #000 ${LC}px, rgba(0,0,0,.3) ${SL + LEAN}px); mask-image: linear-gradient(90deg, #000 ${LC}px, rgba(0,0,0,.3) ${SL + LEAN}px); }
.sb-nhl-sn-15 .tm.h .lw { clip-path: polygon(100% 0, calc(100% - ${SL + 3 - LEAN}px) 0, calc(100% - ${SL + 3 + LEAN}px) 100%, 100% 100%);
  -webkit-mask-image: linear-gradient(270deg, #000 ${LC}px, rgba(0,0,0,.3) ${SL + LEAN}px); mask-image: linear-gradient(270deg, #000 ${LC}px, rgba(0,0,0,.3) ${SL + LEAN}px); }
.sb-nhl-sn-15 .tm .ab { flex: 1; min-width: 0; text-align: center; position: relative; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-nhl-sn-15 .tm.a .ab { padding: 0 10px 0 ${SL + 12}px; } .sb-nhl-sn-15 .tm.h .ab { padding: 0 ${SL + 12}px 0 10px; }
/* one heavier pale line between the logo and the letters, leaning 33 deg: a backslash on the away panel, a slash on the home one */
.sb-nhl-sn-15 .tm .sl { position: absolute; top: -10%; height: 120%; width: 8px; margin-left: -4px; background: linear-gradient(90deg, rgba(220,232,240,.4), rgba(236,242,247,.92) 28% 72%, rgba(220,232,240,.4)); }
.sb-nhl-sn-15 .tm.a .sl { left: ${SL}px; transform: skewX(33deg); } .sb-nhl-sn-15 .tm.h .sl { right: ${SL}px; margin: 0 -4px 0 0; transform: skewX(-33deg); }
.sb-nhl-sn-15 .s { width: ${C.s}px; color: #1b1c1e; background: linear-gradient(#f2f2f3, #cfcfd1 48%, #b9b9bc 52%, #d3d3d5); }
/* the dividing lines in the gaps: a darker grey one between the score tiles, light grey ones before the period, the clock and after */
.sb-nhl-sn-15 .s + .s { box-shadow: -${GAP - 1}px 0 0 #6a6b6e; }
.sb-nhl-sn-15 .pd, .sb-nhl-sn-15 .ck { box-shadow: -${GAP - 2}px 0 0 #a2a3a6; }
.sb-nhl-sn-15 .row > :last-child { box-shadow: -${GAP - 2}px 0 0 #a2a3a6, ${GAP - 2}px 0 0 #a2a3a6; }
.sb-nhl-sn-15 .pd, .sb-nhl-sn-15 .ck { background: ${GL}, linear-gradient(#18181a, #0b0b0c 50%, #060607); }
.sb-nhl-sn-15 .pd { width: ${C.pd}px; } .sb-nhl-sn-15 .ck { width: ${C.ck}px; }
/* a five-character clock (10:00) squeezes a little inside its tile instead of running to the bug's end */
.sb-nhl-sn-15 .ck { padding: 0 8px; box-sizing: border-box; } .sb-nhl-sn-15 .sb-ord { font-size: .66em; }
.sb-nhl-sn-15 .w { font-size: ${PX * 0.7}px; width: ${C.pd + C.ck + GAP}px; padding: 0 10px; box-sizing: border-box; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    const pair = teamPair(g.away, g.home, '#2a3f5a');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.55))); row.append(mk, el('i', 'seam'));
    const panel = (t, c, home) => {
      const tm = el('div', 'tm ' + (home ? 'h' : 'a'));
      // one deep shade of the team's colour, the logo's end a little lighter
      tm.style.background = GL + ', linear-gradient(' + (home ? '270deg' : '90deg') + ', ' + shade(c, -0.25) + ', ' + shade(c, -0.55) + ' 32%, ' + shade(c, -0.6) + ')';
      const ab = fit(el('span', 'ab', (t.abbr || '').toUpperCase()));
      const lw = el('i', 'lw'); lw.appendChild(logo(t, LG));
      tm.append(lw, el('i', 'sl'), ab);
      return tm;
    };
    const score = (t) => { const s = el('div', 's'); s.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g)); return s; };
    row.append(panel(g.away, pair[0], false), score(g.away), score(g.home), panel(g.home, pair[1], true));
    if (live) { const pd = el('div', 'pd'); pd.appendChild(g.period.word ? document.createTextNode(g.period.label) : ordinal(g.period)); row.appendChild(pd); }
    if (live) row.appendChild(fit(el('div', 'ck', g.clock || '')));
    else row.appendChild(fit(el('div', 'ck w', statusText(g, time))));
    root.appendChild(row);
  },
};
