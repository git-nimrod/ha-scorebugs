// "White clock '14": after TSN's NHL score bar of the mid-2010s. A white bar with rounded ends: the
// network's mark on the white at the left (here the Home Assistant logo, in the red the network's letters wore), then for each team a
// glossy panel of its colour with its logo on a lighter end and its letters, and its score in white on a black plate; at the right a
// white box with a grey rim holding the period at its left and the clock at its right, in dark letters.
// measured (crop px of 373 x 24): mark 0-55, team 57-125 (logo end 57-85), score 127-158, team 160-230, score 232-263, clock box
// 265-368; the panels 18 px tall (y 3-21); capitals 0.42 of the height, letters of a medium weight.
// curves (circle fit on the crop): the left end is round, r 9.5 px = 0.4 H (sag 7.5 px); the right end lies on the crop's edge and is
// taken as the same; top and foot straight (no sag).
// (a unified
// background"), read on the crop: each team's logo, letters and score sit in one rounded unit (x 58-158 and 163-263) edged by a grey
// hairline (lum 140-160) inside a white rim (lum 220-250 above at y 1-2, below at y 19-20, and 4 px of white between the two units);
// a 1.5 px white line parts the letters from the score; the logo sits on the same team colour as the letters (no lighter end).
// on the crop the Leafs' leaf is 27 px wide and the Sabres' disc 28 px across, both cut
// at the top and foot by the 18 px panel: about 1.55x the panel's height. Ours were held inside the panel (51 px of its 57); now an
// 88 px square (1.55x), cut top and foot by the panel at the logo's focal point, never shrunk to fit.
import { el, logo, statusText, haMark, marks, scoreSlot, fit, teamPair, panelInk, shade, FONTS } from '../kit.js';

const K = 1180 / 373, H = Math.round(24 * K);
// GI: the white line between the letters and the score inside a team's unit
const C = { mk: 174, tm: 216, s: 98, ck: 326 }, GAP = 8, GI = 5;
const W = C.mk + 2 * (C.tm + C.s + GI) + C.ck + 3 * GAP + 12;
const TOP = Math.round(3 * K), PH = Math.round(18 * K);
const CAP = 10 * K, PX = Math.round(CAP / 0.7109);

export default {
  id: 'nhl-tsn-14',
  size: { w: W, h: H },
  // a logo goes white on its own colour only when it is all but one colour (the Leafs' leaf, its lettering white, became a blank white
  // leaf at the kit's 0.85 once the logo end took the panel's colour)
  monoLogos: 0.97,
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-tsn-14 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 500; color: #fff; }
/* the white bar with rounded ends and a grey edge */
.sb-nhl-tsn-14 .row { position: absolute; inset: 0; display: flex; align-items: center; gap: ${GAP}px; padding: 0 6px 0 0; box-sizing: border-box; border-radius: ${Math.round(H * 0.4)}px;
  background: linear-gradient(#ffffff, #f0f0f2 48%, #dcdce0 52%, #ececef); box-shadow: inset 0 0 0 2px #b4b5ba, 0 2px 6px rgba(0,0,0,.5); }
.sb-nhl-tsn-14 .row > * { flex: none; height: ${PH}px; display: flex; align-items: center; }
.sb-nhl-tsn-14 .mk { width: ${C.mk}px; justify-content: center; } .sb-nhl-tsn-14 .mk .sb-ha { color: #c8102e; }
/* a team's unit: logo, letters and score in one rounded shape, a grey hairline inside a white rim */
.sb-nhl-tsn-14 .gr { gap: ${GI}px; border-radius: ${Math.round(3 * K)}px; overflow: hidden; background: #fbfbfc; box-shadow: 0 0 0 2px #8f9197, 0 0 0 6px #ffffff, 0 0 0 7px #c9cace; }
.sb-nhl-tsn-14 .gr > * { flex: none; height: 100%; display: flex; align-items: center; }
.sb-nhl-tsn-14 .tm { width: ${C.tm}px; overflow: hidden; }
.sb-nhl-tsn-14 .tm .le { width: 88px; height: 100%; display: grid; place-items: center; flex: none; }
.sb-nhl-tsn-14 .tm .le .sb-logo { width: 88px; height: 88px; max-height: none; object-fit: contain; }
.sb-nhl-tsn-14 .tm .ab { flex: 1; min-width: 0; text-align: center; font-size: ${PX}px; white-space: nowrap; }
.sb-nhl-tsn-14 .s { width: ${C.s}px; justify-content: center; font-size: ${PX * 1.05}px; font-weight: 700; background: linear-gradient(#4a4b4f, #1a1b1e 48%, #050506 52%, #141417); }
/* the clock box: white, a grey inner rim, dark letters */
.sb-nhl-tsn-14 .ck { width: ${C.ck}px; justify-content: space-between; padding: 0 30px 0 40px; box-sizing: border-box; color: #111; font-size: ${PX * 1.05}px; font-weight: 600;
  background: linear-gradient(#ffffff, #f3f3f5 50%, #e4e4e8); box-shadow: inset 0 0 0 3px #c9cacf, 0 1px 2px rgba(0,0,0,.25); border-radius: 4px; white-space: nowrap; }
.sb-nhl-tsn-14 .ck.w { justify-content: center; padding: 0 10px; font-size: ${PX * 0.85}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live', row = el('div', 'row');
    const pair = teamPair(g.away, g.home, '#2a3f5a');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(PH * 0.8))); row.appendChild(mk);
    [g.away, g.home].forEach((t, i) => {
      const c = pair[i], tm = el('div', 'tm');
      // the team's colour under a glass gloss, its logo on a lighter end of the same colour
      tm.style.background = 'linear-gradient(rgba(255,255,255,.28), rgba(255,255,255,.08) 48%, rgba(0,0,0,.12) 52%, rgba(0,0,0,.25)), linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.15) + ')';
      // the logo on the same colour as the letters (one background for the whole panel)
      const le = el('span', 'le'); le.appendChild(logo(t, 88));
      // white letters unless the colour is too light for them (a gold or pale blue taken against a look-alike opponent): the kit's ink
      const ab = fit(el('span', 'ab', (t.abbr || '').toUpperCase())); ab.style.color = panelInk(t, c);
      tm.append(le, ab);
      const s = el('div', 's'); s.appendChild(scoreSlot(el('span', '', g.status === 'pre' ? '' : t.score != null ? String(t.score) : ''), g));
      const gr = el('div', 'gr'); gr.append(tm, s); row.appendChild(gr);
    });
    const ck = el('div', 'ck' + (live ? '' : ' w'));
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', '', statusText(g, time)));
    row.appendChild(ck);
    root.appendChild(row);
  },
};
