// "Shield box '24" (after MLB Network's bug, 2024, frame: reference pack BAS0007, Royals at Orioles). A black box
// of two rows. The top row: the away logo on a band of its colour, its score on a light plate, the home logo on its colour, its score on
// a light plate. The lower row, on black: the bases as three small grey diamonds (yellow when occupied), the outs as two large dots
// (yellow for an out), the count in light squared figures and the half inning as a yellow triangle with the inning number. The pitcher
// and batter lines under it are left out (no data); the frame shows no network mark, so none is drawn. Measured on the frame (5x grid):
// box 227 x 66 frame px, everything here the frame's position times 3: top row 96 px, cells 213 / 135 / 201 / 132 wide, score cap
// height 57 px, count cap 45 px, out dots 48 px, base side 30 px.
import { el, otherSport, logo, bases, statusText, teamColor, contrast, shade, scoreSlot, fit, FONTS } from '../kit.js';

const W = 681, ROW1 = 96, ROW2 = 102, H = ROW1 + ROW2;
const YEL = '#e6d43c', GREY = '#8b8c8e';

export default {
  id: 'mlb-mlbn-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  logos: 'dark',   // the logos' versions for dark grounds (the Royals' light KC on blue, as on air)
  fonts: [FONTS.kanit600, FONTS.saira],
  css: `
.sb-mlb-mlbn-24 { font-family: 'SB Kanit', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 100%; color: #fff; line-height: 1; }
.sb-mlb-mlbn-24 { font-weight: 600; }   /* MLB Network: Kanit SemiBold */
.sb-mlb-mlbn-24 .bx { position: absolute; inset: 0; border-radius: 3px; background: #050506; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 0 0 2px #26272a; }
.sb-mlb-mlbn-24 .r1 { position: absolute; left: 0; right: 0; top: 0; height: ${ROW1}px; display: grid; grid-template-columns: 213px 135px 201px 132px; }
.sb-mlb-mlbn-24 .tm { display: grid; place-items: center; overflow: hidden; } .sb-mlb-mlbn-24 .tm .sb-logo { width: 88px; height: 84px; object-fit: contain; }
.sb-mlb-mlbn-24 .sc { display: grid; place-items: center; background: linear-gradient(#fbfbfb, #dedfe1);   /* a flat light tile filling its cell edge to edge, no curved shading at its ends */ color: #111; font-size: 82px;
  font-variant-numeric: tabular-nums; white-space: nowrap; }
.sb-mlb-mlbn-24 .r2 { position: absolute; left: 0; right: 0; top: ${ROW1}px; height: ${ROW2}px; display: grid; grid-template-columns: 180px 180px 170px 1fr;
  align-items: center; justify-items: center; }
.sb-mlb-mlbn-24 .sb-bases i { background: ${GREY}; } .sb-mlb-mlbn-24 .sb-bases i.on { background: ${YEL}; }
.sb-mlb-mlbn-24 .outs { display: flex; gap: 8px; } .sb-mlb-mlbn-24 .outs i { width: 46px; height: 46px; border-radius: 50%; background: ${GREY}; }
.sb-mlb-mlbn-24 .outs i.on { background: ${YEL}; }
/* the count and inning in light, wide, squared figures, as on air (frame: strokes about an eighth of the figure's height; ours were a fifth) */
.sb-mlb-mlbn-24 .ct, .sb-mlb-mlbn-24 .inn { font-family: 'SB Saira', 'Arial', sans-serif; font-size: 64px; font-weight: 400; font-stretch: 112%; color: #f0f0f0; font-variant-numeric: tabular-nums; }
.sb-mlb-mlbn-24 .inn { display: flex; align-items: center; gap: 14px; }
.sb-mlb-mlbn-24 .inn i { width: 0; height: 0; border-left: 21px solid transparent; border-right: 21px solid transparent; }
.sb-mlb-mlbn-24 .inn i.bot { border-top: 24px solid ${YEL}; } .sb-mlb-mlbn-24 .inn i.top { border-bottom: 24px solid ${YEL}; }
.sb-mlb-mlbn-24 .w { grid-column: 1 / 5; font-size: 50px; font-weight: 600; white-space: nowrap; }
.sb-mlb-mlbn-24 .dt { font-size: 44px; white-space: nowrap; }
.sb-mlb-mlbn-24 .r2 .dt ~ .ct, .sb-mlb-mlbn-24 .r2 .dt ~ .inn { font-size: 52px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball;   // a baseball bug forced onto another sport's game shows only the scores
    const b = g.baseball;
    const bx = el('div', 'bx'), r1 = el('div', 'r1'), r2 = el('div', 'r2');
    [g.away, g.home].forEach((t) => {
      // each team's own colour behind its logo: the first that is not near black (Marlins blue, Orioles orange)
      const c = [t.color, t.color2].find((x) => /^#[0-9a-f]{6}$/i.test(x || '') && contrast(x, '#000000') >= 2.2) || teamColor(t, '#3a3f47'), tm = el('div', 'tm');
      tm.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.12) + ')';
      tm.appendChild(logo(t, 88));
      // before the first pitch the light plate is left without fit()'s inner box, so the kit can put the team's logo (or record) in it
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      r1.append(tm, g.status === 'pre' ? sc : fit(sc));
    });
    if (live) {
      const outs = el('span', 'outs');
      for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      const inn = el('span', 'inn');
      if (b.half === 'top' || b.half === 'bot') inn.appendChild(el('i', b.half));
      inn.appendChild(document.createTextNode(g.period.label || ''));
      r2.append(bases(b.bases, 30), outs, el('span', 'ct', b.balls + '-' + b.strikes), inn);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const os = otherSport(g), d = el('span', 'dt', os.detail), ct = el('span', 'ct', os.clock), inn = el('span', 'inn', os.period);
      d.style.gridColumn = '1 / 3'; ct.style.gridColumn = '3'; inn.style.gridColumn = '4';
      r2.append(d, ct, inn);
    } else r2.appendChild(fit(el('span', 'w', g.status === 'live' ? g.period.label || '' : statusText(g, time))));
    bx.append(r1, r2);
    root.appendChild(bx);
  },
};
