// "Blue cells '24": after Marquee Sports Network's Cubs bug (2020s; frame: Brewers at Cubs). A grid of blue cells ruled in light grey:
// each team's logo on blue with its score on white beside it; to the right the bases as three white-outlined diamonds and the inning
// (an arrow and the number), and under them the count and the outs. The pitcher and batter lines under the box are left out (no data).
import { el, otherSport, logo, bases, statusText, scoreSlot, teamColor, shade, FONTS } from '../kit.js';

const W = 470, H = 168, RULE = 4, LOGO = 92, SCORE = 100, BASES = 140;
const SCORE_PX = 62, INN_PX = 48, LOW_PX = 34;

export default {
  id: 'mlb-marquee-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -25% vs the broadcast; 80 % of the correction
  typeScale: 1.2,
  logos: 'dark',   // the logos' versions for team-colour grounds (frame: the Nationals' white W on red); the Phillies' red P was lost on red
  fonts: [FONTS.titillium],
  css: `
.sb-mlb-marquee-24 { font-family: 'SB Titillium', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: Marquee: Titillium Web Bold */
.sb-mlb-marquee-24 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: ${LOGO}px ${SCORE}px ${BASES}px 1fr; grid-template-rows: 1fr 1fr; gap: ${RULE}px; padding: ${RULE}px; box-sizing: border-box;
  background: #c9ced8; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-mlb-marquee-24 .lg { display: grid; place-items: center; background: linear-gradient(#24499f, #173a86); }
.sb-mlb-marquee-24 .lg .sb-logo { width: 88px; height: 74px; object-fit: contain; }   /* fills its tile edge to edge, as on air (Phase 2b) */
.sb-mlb-marquee-24 .sc { display: grid; place-items: center; background: linear-gradient(#ffffff, #e4e7ec); color: #0b0b0d; font-size: ${SCORE_PX}px; font-weight: 800; line-height: 1; }
.sb-mlb-marquee-24 .rt { grid-column: 3 / 5; grid-row: 1 / 3; display: grid; grid-template-columns: ${BASES}px 1fr; grid-template-rows: 1fr 52px; gap: ${RULE}px; }
.sb-mlb-marquee-24 .rt > span { display: flex; align-items: center; justify-content: center; white-space: nowrap; background: linear-gradient(#2a56b4, #1d4498); }
.sb-mlb-marquee-24 .rt .sb-bases i { border: 3px solid #fff; background: transparent; } .sb-mlb-marquee-24 .rt .sb-bases i.on { background: #fff; }
.sb-mlb-marquee-24 .inn { font-size: ${INN_PX}px; line-height: 1; } .sb-mlb-marquee-24 .inn b { font-size: .62em; margin-right: 10px; vertical-align: .14em; }
.sb-mlb-marquee-24 .lo { font-size: ${LOW_PX}px; line-height: 1; } .sb-mlb-marquee-24 .lo small { font-size: .62em; margin-left: 4px; }
.sb-mlb-marquee-24 .rt .w { grid-column: 1 / 3; grid-row: 1 / 3; font-size: ${LOW_PX}px; }
.sb-mlb-marquee-24 .rt .dt { font-size: 28px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const lg = el('span', 'lg'); lg.style.gridRow = String(i + 1); lg.appendChild(logo(t, 76));
      // each logo stands on its own team's colour (frame: the Nationals' red tile over the Cubs' blue one)
      const c = teamColor(t, '#1d4498'); lg.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.08) + ')';
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g); sc.style.gridRow = String(i + 1);
      bx.append(lg, sc);
    });
    const rt = el('div', 'rt');
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      const outs = el('span', 'lo'); outs.append(document.createTextNode(String(b.outs)), el('small', '', 'OUT'));
      rt.append(el('span', ''), inn, el('span', 'lo', b.balls + '-' + b.strikes), outs);
      rt.firstChild.appendChild(bases(b.bases, 38));
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const ck = el('span', 'lo', os.clock); ck.style.gridColumn = '1 / 3';
      rt.append(el('span', 'dt', os.detail), el('span', 'inn', os.period), ck);
    } else rt.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(rt);
    root.appendChild(bx);
  },
};
