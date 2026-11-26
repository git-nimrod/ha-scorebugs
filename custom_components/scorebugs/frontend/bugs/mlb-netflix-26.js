// "Big box '26" (after Netflix's second MLB look, 2026, frame: reference pack BAS0004, Yankees v Giants). A tall
// rounded box with a rim in the two team colours (away left, home right). Each team's panel shades from its colour at the outer edge to
// near-black, with a tall condensed white score at the top and its logo large and half off the outer edge below it. The bases are three
// flattened diamonds (seen in perspective) on a dark hump that rises between the panels; under them a chevron over the inning number
// (under it in the bottom half), the count at the left and the outs as two dots at the right. A thin rule, then the line where the
// pitch type and speed sat: here each team's record at its own side and the network's place in the middle (the Home Assistant logo).
// The pitcher and batter lines at the top of the frame are left out (no data). Measured on the frame (4x grid, 10 px cells): box
// 212 x 233 frame px less the 45 px header; everything below is the frame's position times 1.8.
import { el, otherSport, logo, bases, statusText, teamColor, shade, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const W = 380, H = 344;
const PANEL_TOP = 18, PANEL_H = 196, BAND = 194;
// the dark band's triangle, measured on the frame: it starts at the team panels' foot at both outer edges and rises to a
// point in the middle at half the panels' height
const TRI_EDGE = PANEL_TOP + PANEL_H - 4, TRI_PEAK = PANEL_TOP + PANEL_H - Math.round(PANEL_H / 2);

export default {
  id: 'mlb-netflix-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  logos: 'dark',   // the logos' versions for dark grounds (the Yankees' white NY on blue, as on air)
  fonts: [FONTS.inter, FONTS.saira],
  css: `
.sb-mlb-netflix-26 { font-family: 'SB Inter V', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 78%; color: #fff; line-height: 1; }
/* the count, inning, records and start time in the same narrow face as the score (on air every figure is narrow: 1-2, 94 MPH) */
.sb-mlb-netflix-26 { font-family: 'SB Saira', 'Arial Narrow', sans-serif; font-stretch: 72%; }
/* face: Netflix MLB 2026: Inter SemiBold */
.sb-mlb-netflix-26 .bx { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,.55); }
.sb-mlb-netflix-26 .in { position: absolute; inset: 5px; border-radius: 16px; overflow: hidden; background: linear-gradient(#2a2c31, #141518); }
.sb-mlb-netflix-26 .pn { position: absolute; top: ${PANEL_TOP}px; height: ${PANEL_H}px; width: 168px; border-radius: 8px 8px 0 0; overflow: hidden;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.1); }
.sb-mlb-netflix-26 .pn.a { left: 8px; } .sb-mlb-netflix-26 .pn.h { right: 8px; }
.sb-mlb-netflix-26 .pn .sb-logo { position: absolute; top: 92px; width: 96px; height: 96px; object-fit: contain; }
.sb-mlb-netflix-26 .pn.a .sb-logo { left: -22px; } .sb-mlb-netflix-26 .pn.h .sb-logo { right: -22px; }
/* the score in tall, narrow figures, as on air (frame: the 0 is 20 px wide and 45 tall, under half as wide as tall, and 45 % of the panel's
   height); a narrow Saira, since Inter has no narrow widths */
.sb-mlb-netflix-26 .sc { position: absolute; top: 4px; left: 0; right: 0; text-align: center; font-size: 140px; font-family: 'SB Saira', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 56%; font-variant-numeric: tabular-nums;
  text-shadow: 0 0 3px #000, 0 3px 5px rgba(0,0,0,.6); white-space: nowrap; }
.sb-mlb-netflix-26 .band { position: absolute; left: 0; right: 0; top: ${TRI_PEAK}px; bottom: 0; background: linear-gradient(#1b1c20, #101114);
  clip-path: polygon(0 ${TRI_EDGE - TRI_PEAK}px, 50% 0, 100% ${TRI_EDGE - TRI_PEAK}px, 100% 100%, 0 100%); }   /* one steep triangle rising from both sides to a point in the middle */
.sb-mlb-netflix-26 .bs { position: absolute; left: 50%; top: 134px; transform: translateX(-50%) scaleY(.6); transform-origin: 50% 0; }
.sb-mlb-netflix-26 .bs .sb-bases i { background: rgba(255,255,255,.22); } .sb-mlb-netflix-26 .bs .sb-bases i.on { background: #fff; }
.sb-mlb-netflix-26 .inn { position: absolute; left: 50%; transform: translateX(-50%); top: 184px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.sb-mlb-netflix-26 .inn .n { font-size: 52px; }
.sb-mlb-netflix-26 .chev { width: 40px; height: 40px; border: 6px solid #fff; border-right: 0; border-bottom: 0; transform: scaleY(.55) rotate(45deg); margin: -12px 0 -14px; }
.sb-mlb-netflix-26 .chev.dn { transform: scaleY(.55) rotate(225deg); margin: -14px 0 -12px; }
.sb-mlb-netflix-26 .ct { position: absolute; left: 52px; top: 240px; font-size: 40px; font-variant-numeric: tabular-nums; }
.sb-mlb-netflix-26 .outs { position: absolute; right: 64px; top: 244px; display: flex; gap: 8px; }
.sb-mlb-netflix-26 .outs i { width: 19px; height: 19px; border-radius: 50%; background: rgba(255,255,255,.22); } .sb-mlb-netflix-26 .outs i.on { background: #fff; }
.sb-mlb-netflix-26 .st { position: absolute; left: 20px; right: 20px; top: 236px; height: 36px; display: grid; place-items: center; font-size: 34px; white-space: nowrap; }
.sb-mlb-netflix-26 .rule { position: absolute; left: 16px; right: 16px; top: 278px; height: 2px; background: rgba(255,255,255,.16); }
.sb-mlb-netflix-26 .ft { position: absolute; left: 22px; right: 22px; top: 288px; height: 40px; display: grid; grid-template-columns: 1fr 48px 1fr;
  align-items: center; font-size: 26px; color: #c9cbcf; font-stretch: 85%; }
.sb-mlb-netflix-26 .ft .r { text-align: right; } .sb-mlb-netflix-26 .ft .sb-ha { color: #e50914; justify-self: center; }
.sb-mlb-netflix-26 .dt { position: absolute; left: 196px; right: 26px; top: 240px; height: 40px; display: grid; place-items: center end; font-size: 30px; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false] };
    // a near-black first colour gives way to the second (the Giants' panel is orange on air, not black)
    const lum = (c) => { const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const col = (t) => { const c = teamColor(t, '#3a3f47'), c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') ? t.color2 : '';
      return lum(c) < 0.06 && c2 && lum(c2) >= 0.08 && lum(c2) < 0.8 ? c2 : c; };
    const ca = col(g.away), ch = col(g.home);
    const bx = el('div', 'bx'), inner = el('div', 'in');
    bx.style.background = `linear-gradient(90deg, ${ca} 50%, ${ch} 50%)`;   // the rim: each team's colour on its own half
    [[g.away, 'a', ca], [g.home, 'h', ch]].forEach(([t, k, c]) => {
      const pn = el('div', 'pn ' + k);
      // the colour only at the outer side and a hint of it at the inner edge, black through the middle
      pn.style.background = `linear-gradient(${k === 'a' ? '90deg' : '270deg'}, ${shade(c, 0.04)} 0%, ${shade(c, -0.22)} 20%, ${shade(c, -0.45)} 42%, ${shade(c, -0.62)} 60%, ${shade(c, -0.55)} 80%, ${shade(c, -0.35)} 100%)`;  // one long soft fall into a deep shade of the colour, no black band
      // before the first pitch the record in the score's place, sized to fit its box
      const sv = g.status === 'pre' ? el('span', 'sc', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre') { sv.style.fontSize = ((t.record || '').length > 4 ? 44 : 56) + 'px'; sv.style.whiteSpace = 'nowrap'; }
      pn.append(logo(t, 96), fit(sv));
      inner.appendChild(pn);
    });
    inner.append(el('div', 'band'));
    const bs = el('div', 'bs'); bs.appendChild(bases(live ? b.bases : [false, false, false], 44)); if (live) inner.appendChild(bs);  // the bases only while the game is on
    if (live) {
      const inn = el('div', 'inn'), up = b.half !== 'bot';
      if (b.half && up) inn.appendChild(el('i', 'chev'));
      inn.appendChild(el('span', 'n', g.period.label || ''));
      if (b.half === 'bot') inn.appendChild(el('i', 'chev dn'));
      const outs = el('span', 'outs'); for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      inner.append(inn, el('span', 'ct', b.balls + '-' + b.strikes), outs);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail where the outs were, no outs
      const os = otherSport(g);
      const inn = el('div', 'inn'); inn.appendChild(el('span', 'n', os.period));
      inner.append(inn, el('span', 'ct', os.clock));
      if (os.detail) inner.appendChild(fit(el('span', 'dt', os.detail)));
    } else inner.appendChild(fit(el('span', 'st', g.status === 'live' ? g.period.label || '' : statusText(g, time))));
    // the records along the foot once the game is on (before it they go in the empty score boxes, put there by the kit)
    const rec = (t) => (g.status === 'pre' ? '' : t.record || '');
    const ft = el('div', 'ft');
    ft.append(fit(el('span', 'l', rec(g.away))), marks(opts).ha ? haMark(34) : el('span'), fit(el('span', 'r', rec(g.home))));
    inner.append(el('div', 'rule'), ft);
    bx.appendChild(inner);
    root.appendChild(bx);
  },
};
