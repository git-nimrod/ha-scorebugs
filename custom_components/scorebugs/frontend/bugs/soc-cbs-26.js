// "Header bar '26": after CBS Sports' Liga MX bug (2026 Apertura; frame: reference pack SOC0236-ligamx, Santos v Tigres, 0:04). A dark
// plate in two tiers: a header strip naming the competition ("2026 LIGA MX APERTURA"; in the knockout rounds the game's note), and under
// it a row with the network's mark (the Home Assistant logo here), each team's slab in its colour with its logo, letters and score, a thin
// dark gold line between the two slabs, and the match clock on the plate at the right. Letters on the slabs are a pale tint, not white.
// Measured: plate 352 x 46, header 18 tall with a light line along its top, slabs 126
// / 130 wide and 24 tall, the clock 70 wide; header text cap 0.68 of its strip (#e6e6e6, bold), letters and figures cap 0.62 of a slab
// (tinted #bfeed4 on Santos green), clock 0.58; plate #262a2e, divider #8a7630.
// "add glass element to the top. Time area is technically bordered lightly, same with the top. Each tier (liga top
// bar, score bar below) should have glass elements, but not one large, one per tier. center dividing line is black and smaller".
// Each tier now has its own glass cover (lit top, a step at 40 %, darker foot; the 2017-19 glass numbers, the frame being too small to
// read its own): the header strip, and the score row (plate and both slabs, each in its own colour); the header and the clock cell
// each in a light 1 px border; the line between the slabs black (#0b0c0e) and 4 px (was dark gold, 8).
import { el, logo, soccerClock, homeFirst, haMark, marks, teamColor, teamInk, shade, glassCover, FONTS, scoreSlot, fit } from '../kit.js';

// one glass cover per tier (never one over the whole plate)
const GLASS = { top: 10, mid: 6, horizon: 40, step: 7, foot: -6 }, PLATE = glassCover('#262a2e', GLASS).background;
// the header's own sheen over its plate (NFL glass recipe: pale over the top half, soft edge just above the middle)
const SHEEN = 'linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 44%, rgba(255,255,255,0) 50%)';
const W = 875, H = 125, HH = 45, RT = 55, RH = 60, MK = 52, HS = 317, DV = 4, AS = 319, CK = W - MK - HS - DV - AS - 6;

export default {
  id: 'soc-cbs-26',
  size: { w: W, h: H },
  fonts: [FONTS.roboto],
  css: `
.sb-soc-cbs-26 { font-family: 'SB Roboto', Arial, sans-serif; font-weight: 500; color: #fff; }
.sb-soc-cbs-26 .pl { position: absolute; inset: 0; background: #262a2e; box-shadow: inset 0 3px 0 rgba(255,255,255,.55); }
.sb-soc-cbs-26 .hd { position: absolute; left: 4px; top: 4px; width: ${W - 8}px; height: ${HH}px; background: ${SHEEN}, ${PLATE}; box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), inset 0 1px 0 rgba(255,255,255,.4); display: grid; place-items: center; color: #e6e6e6; font-weight: 700;
  font-size: 36px; line-height: 1; letter-spacing: -.02em; white-space: nowrap; overflow: hidden; padding: 0 20px; box-sizing: border-box; }
.sb-soc-cbs-26 .rw { position: absolute; left: 0; top: ${RT}px; width: ${W}px; height: ${RH}px; background: ${PLATE}; }
.sb-soc-cbs-26 .mk { position: absolute; left: 0; top: ${RT}px; width: ${MK}px; height: ${RH}px; display: grid; place-items: center; color: #fff; }
.sb-soc-cbs-26 .sl { position: absolute; top: ${RT}px; height: ${RH}px; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 10px; box-sizing: border-box; font-size: 52px; line-height: 1; }
.sb-soc-cbs-26 .sl.h { left: ${MK}px; width: ${HS}px; } .sb-soc-cbs-26 .sl.a { left: ${MK + HS + DV}px; width: ${AS}px; }
.sb-soc-cbs-26 .sl .sb-logo { width: 46px; height: 46px; object-fit: contain; flex: none; }
.sb-soc-cbs-26 .sl .ab { flex: 1; white-space: nowrap; overflow: hidden; }
.sb-soc-cbs-26 .sl .s { min-width: .7em !important; text-align: right; font-weight: 600; }
.sb-soc-cbs-26 .dv { position: absolute; left: ${MK + HS}px; top: ${RT}px; width: ${DV}px; height: ${RH}px; background: #0b0c0e; }
.sb-soc-cbs-26 .ck { position: absolute; left: ${MK + HS + DV + AS}px; top: ${RT}px; width: ${CK}px; height: ${RH}px; display: grid; place-items: center; color: #f0f0f0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.25);
  font-size: 49px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; padding: 0 6px; box-sizing: border-box; }
.sb-soc-cbs-26 .ck.when { font-size: 30px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    // the header names the competition: Liga MX's season half from the date (Apertura from July, Clausura before), else the game's note
    const d = new Date(g.starts || Date.now());
    const head = g.note ? g.note.toUpperCase() : g.league === 'LIGAMX' ? d.getFullYear() + ' LIGA MX ' + (d.getMonth() >= 6 ? 'APERTURA' : 'CLAUSURA') : '';
    root.append(el('div', 'pl'), fit(el('div', 'hd', head)), el('div', 'rw'));
    if (mk.ha) { const m = el('div', 'mk'); m.appendChild(haMark(34)); root.appendChild(m); }
    [[h, 'h'], [a, 'a']].forEach(([t, k]) => {
      const c = teamColor(t, '#217d49'), s = el('div', 'sl ' + k);
      // the letters a pale tint of the team's colour on air (#bfeed4 on Santos green), dark on a light slab
      const ink = teamInk(c) === '#ffffff' ? shade(c, 0.78) : '#111111';
      s.style.background = glassCover(c, GLASS).background; s.style.color = ink;
      // before the kick-off the score slot stays empty: the kit puts the team's record in it
      s.append(logo(t, 46), fit(el('span', 'ab', (t.abbr || '').toUpperCase())), scoreSlot(el('span', 's', live && t.score != null ? String(t.score) : ''), g));
      root.appendChild(s);
    });
    const clock = soccerClock(g, time);
    root.append(el('i', 'dv'), el('div', 'ck' + (clock.length > 5 ? ' when' : ''), clock));
  },
};
