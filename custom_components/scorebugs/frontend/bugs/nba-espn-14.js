// "Black bar '14": after ESPN's NBA bug (before 2016; frames: Knicks at Bulls, measured in the reference pack, and Bulls at Cavaliers).
// A dark bar with a thin silver rim: the network's chrome box at the left (here the Home Assistant logo), then each team as a panel in a
// muted version of its colour with a soft sheen: its logo large at the left, filling the panel's height and cut by the panel's left edge,
// its letters (lighter, widely spaced) from about 40 % across, its score on a dark plate at the panel's end, its timeouts as yellow dashes along the panel's foot;
// then a light box with the quarter and the clock. The logos are partly see-through, blending into the panel as on air. Under the bar an italic band nearly as tall as the bar carries the game's
// note (the broadcast put the show's title there). The shot clock's red square is left out (the feed has no shot clock).
// Sizes from the pack's spec in 1080p px, times 1.1 (the spec bug is 1053 px wide, ours 1158).
import { el, logo, ordinal, statusText, teamColor, shade, haMark, marks, teamInk, scoreSlot, capSize, FONTS, fit } from '../kit.js';

const W = 1158, H = 124, BAR = 64, BAND = 58, LEFT = 8, MARK = 185, TEAM = 346;
const LOGO_W = 118, LOGO_H = 96,  // smaller, clear of the letters
    // the logo bigger than the panel and cut by it, as on air (Knicks, Bulls heads)
  ABBR_X = 145, PLATE = 112, TIMEOUTS = 7,
  GAP = 8;  // the grey metal bar between the elements: 3 px of the frame's 423 px bug
const ABBR_PX = capSize(FONTS.saira, 28), SCORE_PX = capSize(FONTS.saira, 40), CLOCK_PX = capSize(FONTS.saira, 28), NOTE_PX = capSize(FONTS.saira, 25);
const SHEEN = 'linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,.06) 46%, rgba(0,0,0,0) 54%, rgba(0,0,0,.18))';

/** The team's colour pulled toward a dark grey, as the broadcast mutes it (Knicks blue reads blue-grey, Bulls red reads brick). */
function muted(c, k) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c || ''); if (!m) return c;
  const g = [0x48, 0x4a, 0x52];
  return '#' + m.slice(1).map((h, i) => Math.round(parseInt(h, 16) * (1 - k) + g[i] * k).toString(16).padStart(2, '0')).join('');
}

export default {
  id: 'nba-espn-14',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  lower: BAND,   // the band under the bar, which the card can hide (bug_lower)
  // the band's note in true italic, as on air (the italic face was never loaded, so the note stood upright)
  fonts: [FONTS.roboto, FONTS.robotoItalic],
  css: `
.sb-nba-espn-14 { font-family: 'SB Roboto', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-nba-espn-14 { font-stretch: 75%; }   /* ESPN NBA pre-2016: Roboto at its condensed width */
.sb-nba-espn-14 .bar { position: absolute; left: 0; top: 0; width: ${W}px; height: ${BAR}px; display: grid; grid-template-columns: ${MARK}px ${TEAM}px ${TEAM}px 1fr; column-gap: ${GAP}px;
  padding: 4px 4px 4px ${LEFT}px; box-sizing: border-box; background: linear-gradient(#a2a4a7, #75777b 40%, #505256 60%, #85878b); border: 4px solid; border-image: linear-gradient(#f1efe6, #b7b3a2 45%, #7d7a6c 55%, #d6d3c6) 1; border-bottom: 0;   /* a polished metal rim (surface pass) */ box-shadow: 0 3px 8px rgba(0,0,0,.5); }
/* each element framed in grey metal, as on air: the bar behind them is a brushed grey (frame: about 85 grey above and below each element, 150 at the
 dividers' middle) showing 4 px above and below and 8 px between them, each element edged by a dark line */
.sb-nba-espn-14 .mk, .sb-nba-espn-14 .tm, .sb-nba-espn-14 .ck { box-shadow: 0 0 0 1px rgba(0,0,0,.7); }
/* the Home Assistant box and the score plates nearer black: the frame's
 network box reads about 34 grey (42 at its top, 20 at its foot), ours was 89 on average (a grey metal fade); now near-black from 44
 at the top to 8 at the foot with a thin lit top edge; the plates keep only a faint sheen (was a strong white one that read grey) */
.sb-nba-espn-14 .mk { display: grid; place-items: center; background: linear-gradient(#2c2d2c, #141514 45%, #070707); box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 0 0 1px rgba(0,0,0,.7); }
.sb-nba-espn-14 .mk .sb-ha { color: #f4f4f4; }
.sb-nba-espn-14 .tm { position: relative; overflow: hidden; }
.sb-nba-espn-14 .tm .sb-logo { position: absolute; left: -6px; top: 50%; transform: translateY(-50%); width: ${LOGO_W}px; height: ${LOGO_H}px; object-fit: cover; object-position: 50% 45%; opacity: 1;
  filter: drop-shadow(0 -1px 0 rgba(255,255,255,.5)) drop-shadow(3px 3px 2px rgba(0,0,0,.85)) !important; }   /* 3D: a lit top edge and a drop shadow */   /* taller than the panel: cut at its top, foot and left, as on air */
.sb-nba-espn-14 .tm .ab { position: absolute; left: ${ABBR_X - 30}px; right: ${PLATE + 10}px; top: 0; bottom: 0; display: grid; align-items: center; justify-items: end; white-space: nowrap;   /* ends clear of the score plate (team sweep: 'DEN' lost its N) */ font-size: ${ABBR_PX}px; font-weight: 600; font-stretch: 90%; letter-spacing: 5px; line-height: 1; color: #e9edf2; }
.sb-nba-espn-14 .tm .sc { position: absolute; right: 0; top: 0; bottom: 0; width: ${PLATE}px; display: grid; place-items: center; line-height: 1; color: #fff;   /* always white on the black plate (team sweep: the Warriors' and Blazers' scores took the panel's dark ink) */
  background: linear-gradient(rgba(255,255,255,.09), rgba(255,255,255,.02) 46%, rgba(0,0,0,0) 54%, rgba(0,0,0,.2)), linear-gradient(#151618, #030304); font-size: ${SCORE_PX}px; font-stretch: 96%;
  box-shadow: -1px 0 0 rgba(0,0,0,.75), inset 1px 0 0 rgba(255,255,255,.16); }
/* the score centred in its plate both ways (ink measured: within half a pixel), and the plate's own edge drawn (a dark
 line, a faint light one inside) so the plate reads as its own box on a dark team's panel too, as on air, and the score sits in its middle */
.sb-nba-espn-14 .ck { display: flex; align-items: center; justify-content: space-evenly; background: linear-gradient(#f4f5f5, #c8c9c8); color: #0b0b0c; font-size: ${CLOCK_PX}px; }
.sb-nba-espn-14 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nba-espn-14 .to { position: absolute; top: ${BAR + 2}px; display: flex; gap: 8px; z-index: 1; } .sb-nba-espn-14 .to i { width: 28px; height: 5px; background: #f2c400; } .sb-nba-espn-14 .to i.used { background: #4e4a3c; }
.sb-nba-espn-14 .band { position: absolute; left: 0; right: 0; top: ${BAR}px; height: ${BAND}px; background: var(--sb-strip, linear-gradient(#2e3034, #141518)); color: #e0dcda;   /* the strip under the bar: charcoal by default, or the card's strip colour */
  border: 3px solid #a3a5a8; border-top: 0;
  border-radius: 0 0 0 14px; box-sizing: border-box; display: grid; place-items: center; font-size: ${NOTE_PX}px; font-style: italic; letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
.sb-nba-espn-14.sb-no-lower .band { display: none; } .sb-nba-espn-14.sb-no-lower .bar { border-bottom: 4px solid #8f8c80; }
.sb-nba-espn-14 .sb-ord { font-size: .62em; vertical-align: .55em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(42));
    const tos = [];
    const team = (t, i) => {
      const c = muted(teamColor(t, '#3a3f47'), 0.45);
      const p = el('div', 'tm');
      // the colour fading slowly into black towards the score plate
      p.style.background = SHEEN + ', linear-gradient(90deg, ' + shade(c, 0.04) + ' 0%, ' + shade(c, -0.15) + ' 35%, ' + shade(c, -0.5) + ' 65%, #050506 100%)';
      p.style.color = teamInk(c);
      // before the game the record on the score's plate, smaller
      const sc = g.status === 'pre' ? el('span', 'sc', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      // (the record's ink sat 2 px high on the plate: nudged down so it is centred both ways too)
      if (g.status === 'pre') { sc.style.fontSize = ((t.record || '').length > 5 ? 22 : 28) + 'px'; sc.style.paddingTop = '4px'; }
      const lo = logo(t, LOGO_H); lo.dataset.crop = 'own';
      p.append(lo, fit(el('span', 'ab', (t.abbr || '').toUpperCase())), sc);
      if (live && t.timeouts != null) {
        const to = el('span', 'to'); to.style.left = (LEFT + 3 + MARK + (i + 1) * GAP + i * TEAM + 2) + 'px';
        for (let k = 0; k < TIMEOUTS; k++) to.appendChild(el('i', k >= t.timeouts ? 'used' : '')); tos.push(to);
      }
      return p;
    };
    const ck = el('div', 'ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', '', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(mk, team(g.away, 0), team(g.home, 1), ck);
    // the band under the bar: the game's note, else the league and the day of the game ("NBA WEDNESDAY", as on air); never empty
    const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const note = g.note || ((g.league || '') + ' ' + DAYS[time.parts(new Date(g.starts)).wd]).trim();
    root.append(el('div', 'band', note), bar, ...tos);
  },
};
