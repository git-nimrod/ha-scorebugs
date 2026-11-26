// "Green line bar '24": after UEFA's world-feed bug for the Conference League (2024 on; frame: reference pack SOC0236-uecl, Crystal Palace v Rayo Vallecano, 23:59). The
// competition's trophy (here its logo from ESPN) stands free at the left; the match clock on a black box underlined in the competition's
// green; each team's letters on a near-black box; each score on its own white box, the two set a hair apart, with a small piece of the
// team's kit colours on the score box's outer edge (on air the full height, the kit colour over the second colour). Flat, square corners.
// Measured: clock 75 wide, name boxes 65, score boxes 43-45 with a
// 2 px gap; underline 2 px under the clock; letters and clock cap 0.55 of the bar, figures 0.63. Name boxes #231e20, clock #030203.
// The same UEFA system as the Europa League bug (soc-uel-24): the accent colour and the kit pieces differ.
import { el, soccerClock, homeFirst, leagueLogo, marks, teamColor, FONTS, scoreSlot, fit } from '../kit.js';

const LG = 70, G1 = 12, CK = 176, NM = 152, SC = 103, GAP = 5, BT = 4, BH = 60, UL = 5, H = 72;
const W = LG + G1 + CK + NM + SC + GAP + SC + NM;
const ACCENT = '#42823f';

export default {
  id: 'soc-uecl-24',
  size: { w: W, h: H },
  fonts: [FONTS.outfit],
  css: `
.sb-soc-uecl-24 { font-family: 'SB Outfit', Arial, sans-serif; font-weight: 700; color: #f4f4f4; }
.sb-soc-uecl-24 .lg { position: absolute; left: 0; top: 0; width: ${LG}px; height: ${H - 4}px; display: grid; place-items: center; }
.sb-soc-uecl-24 .lg .sb-league { width: ${LG}px; height: ${H - 4}px; object-fit: contain; }
.sb-soc-uecl-24 .row { position: absolute; left: ${LG + G1}px; top: ${BT}px; height: ${BH}px; display: flex; }
.sb-soc-uecl-24 .row > div { position: relative; height: ${BH}px; display: grid; place-items: center; box-sizing: border-box; white-space: nowrap; overflow: hidden; line-height: 1; }
.sb-soc-uecl-24 .ck { width: ${CK}px; background: #030203; font-size: 43px; font-weight: 600; font-variant-numeric: tabular-nums; padding: 0 8px; box-shadow: 0 ${UL}px 0 ${ACCENT}; overflow: visible !important; }
.sb-soc-uecl-24 .ck.when { font-size: 30px; }
.sb-soc-uecl-24 .nm { width: ${NM}px; background: #231e20; font-size: 43px; font-weight: 600; padding: 0 10px; }
.sb-soc-uecl-24 .sc { width: ${SC}px; background: #faf7f8; color: #0a0a0a; font-size: 52px; min-width: 0 !important; }
.sb-soc-uecl-24 .sc.h { margin-right: ${GAP}px; }
.sb-soc-uecl-24 .sc i { position: absolute; top: 0; width: 12px; height: 100%; }
.sb-soc-uecl-24 .sc.h i { left: 0; } .sb-soc-uecl-24 .sc.a i { right: 0; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const live = g.status !== 'pre';
    if (mk.league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, LG)); root.appendChild(lg); }
    const row = el('div', 'row');
    const clock = soccerClock(g, time);
    row.appendChild(el('div', 'ck' + (clock.length > 5 ? ' when' : ''), clock));
    const name = (t) => { const n = el('div', 'nm'); n.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase()))); return n; };
    const score = (t, k) => {
      // before the kick-off the score box stays empty: the kit puts the team's record in it
      const s = scoreSlot(el('div', 'sc ' + k), g), chip = el('i');
      const c1 = teamColor(t, '#c2263f'), c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') ? t.color2 : c1;
      chip.style.background = 'linear-gradient(' + c1 + ' 50%, ' + c2 + ' 50%)';
      s.append(chip, document.createTextNode(live && t.score != null ? String(t.score) : ''));
      return s;
    };
    row.append(name(h), score(h, 'h'), score(a, 'a'), name(a));
    root.appendChild(row);
  },
};
