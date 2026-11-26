// "Round bar '06": after the Sunday afternoon NFL bug of 2006-2011 (frame: an NFL scorebugs-through-the-years montage, Broncos at
// Chargers). A navy bar with a bright blue rim and small rounded corners. At its left end the two scores stand on full-height white
// plates, one over the other; then the teams' letters (a yellow dot before the team with the ball); a curved blue line; the quarter
// over the clock. One thin line runs across the letters and the clock between the two rows. A big round navy badge with the same blue
// rim overlaps the bar's right end, holding the league's logo over the network's place (here the Home Assistant logo). Wide, heavy
// type. Soft picture by default.
import { el, statusText, leagueLogo, haMark, marks, FONTS, BEVEL } from '../kit.js';

const SCOL = 172;  // the score plates' column: room for two figures before the curve cuts in
const W = 760, H = 144, BT = 16, BH = 112,  // the bar well short of the badge, which stands out above and below it
    // the bar nearly as tall as the badge, as on air
  BADGE = 144, BAR = W - BADGE / 2;
// measured against the frame, frame size / mine: Broncos at Chargers
const TYPE = { score: 1.23, letters: 1.14, clock: 1.17 };


// the team letters' width to the frame's
const LETTERS = { stretch: 109 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  // the scores' old shifts dropped: both sit on one centre line, as on air
  ['div.bx > div.nm > span', 18, -2.5, 0],
];

export default {
  id: 'nfl-round-06',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-round-06 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 118%; color: #fff; }
.sb-nfl-round-06 { font-weight: 700; font-stretch: 125%; }   /* face: Archivo 700 at 125% width (low confidence) */
/* the glass cover: measured with
 sample.py on the frame, the bar is lit about +34 L over its top sixth with a quick fall below it, the rest near its colour, a little darker
 at the foot; ours had +9 in a slow fade. The colours (black into royal blue) are the and stay. */
.sb-nfl-round-06 .bx { position: absolute; left: 8px; top: ${BT}px; width: ${BAR - 8}px; height: ${BH}px; box-sizing: border-box; border: 4px solid #2166d2; border-radius: 46px 0 0 46px / ${BH / 2}px 0 0 ${BH / 2}px;   /* the left end one wide curve */
  overflow: hidden; background: linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,.05) 6%, rgba(255,255,255,0) 10%, rgba(255,255,255,0) 60%, rgba(0,0,0,.2)), linear-gradient(90deg, #010205 0%, #01061c 34%, #020a3e 48%, #03105a 62%, #041572 100%);   /* black through the letters, into a deep pure blue across the clock side */
  box-shadow: -8px 0 0 0 #d23a2c, 0 3px 8px rgba(0,0,0,.5); display: grid;   /* a red band outside the blue rim round the left end, as on air */ grid-template-columns: 172px 1fr 210px ${BADGE / 2 + 6}px; grid-template-rows: minmax(0, 1fr) minmax(0, 1fr); }   /* rows keep their height; the bigger type fits inside its cap height */
/* the blue deepened: sampled in a 5x3 grid on the
 montage frame (left cells #020311 / #02050a, middle #02063e, right #02075c / #020959, L 1 -> 8) and on a 720p still of the same bar
 (Super Bowl XLI on CBS, Colts v Bears: letters #00060b -> #000934, L 1-4; clock side #000843 -> #000c65, L 4-11): near-black through the
 letters into a deep, saturated pure blue (hue about 236 deg), not royal blue. Ours was #2457d8 (L 42, hue 222) on the right; now the
 still's own cells, the brightest kept (#041572, L 13). The rim measured #1f66d3 / #1c5ec2 (6 px): ours #3d8ff2 deepened to #2166d2. */
/* deeper again over the top: on the 720p Super Bowl XLI still the bar is deep navy right under
 its lit rim (#002258 three rows under it, #000b3a / #000d56 after), with no sheen below; ours washed its top third with the glass sheen
 (white.3 ->.17 at 16 % -> 0 at 45 %: #2e4177 / #334b8f, L 28-33, against the still's #00083a / #010e61, L 3-9). The sheen now only a
 thin light band at the very top (.14 ->.05 at 6 % -> 0 at 10 %), so the glass stays and the blue is deep from the top down. */
/* the scores: white plates the full height of each row, flush to the left end */
.sb-nfl-round-06 .s { grid-column: 1; display: grid; place-items: center; background: linear-gradient(#ffffff, #eef1f5 44%, #c9d0da 56%, #eef1f5); box-shadow: ${BEVEL}; color: #0a0a0a; font-size: ${44 * TYPE.score}px; line-height: 1; overflow: hidden; }   /* 44: both scores sit inside their white boxes, as on air (clip scan) */
.sb-nfl-round-06 .s.r2 { border-top: 2px solid #8d98a8; }
/* the plates' right edges make one curve, top plate bowing down, bottom plate bowing up, as on air */
/* the two plates make one curve on their right, the same "(" as the line before the clock: it runs the bar's height, furthest in at the
 middle, and the white fills right up to it. Each plate is half of it: an ellipse 40 px across (the middle line's own), centred at the
 column's right edge on the bar's middle line, is cut out of both */
.sb-nfl-round-06 .s { padding-right: 26px; -webkit-mask-image: radial-gradient(42px 115% at 100% 100%, transparent 96%, #000 100%); mask-image: radial-gradient(42px 115% at 100% 100%, transparent 96%, #000 100%); box-shadow: none; }   /* no bevel edge against the black: it left a faint line */
.sb-nfl-round-06 .s.r2 { -webkit-mask-image: radial-gradient(42px 115% at 100% 0, transparent 98%, #000 100%); mask-image: radial-gradient(42px 115% at 100% 0, transparent 98%, #000 100%); }
.sb-nfl-round-06 .nm { grid-column: 2; display: flex; align-items: center; gap: 12px; padding-left: 30px; font-size: ${46 * TYPE.letters}px; line-height: 1; }
.sb-nfl-round-06 .nm { position: relative; } .sb-nfl-round-06 .nm i { position: absolute; left: 8px; top: 50%; margin-top: -6px; width: 13px; height: 13px; border-radius: 50%; background: #e9e34a; box-shadow: 0 0 6px rgba(233,227,74,.7); }
.sb-nfl-round-06 .ck { grid-column: 3; display: grid; place-items: center; font-size: ${46 * TYPE.clock}px; line-height: 1; }
/* the curved line between the letters and the clock, and the line between the two rows */
.sb-nfl-round-06 .arc { position: absolute; top: -4px; bottom: -4px; width: 40px; border-left: 4px solid #2166d2; border-radius: 100% 0 0 100% / 50% 0 0 50%; }
.sb-nfl-round-06 .mid { display: none; }   /* no line across the rows */
.sb-nfl-round-06 .bd { position: absolute; right: 0; top: 0; width: ${BADGE}px; height: ${BADGE}px; border-radius: 50%; box-sizing: border-box; border: 6px solid #2166d2;
  background: radial-gradient(circle at 50% 35%, #173c86, #071a45 70%); box-shadow: 0 0 0 3px #e3e7ec, 0 0 0 5px #8a929c, inset 0 4px 6px rgba(255,255,255,.25), 0 3px 8px rgba(0,0,0,.5);   /* chrome rim round the disc (surface pass) */ display: grid; place-items: center; align-content: center; gap: 4px; }
.sb-nfl-round-06 .bd .sb-league { width: 74px; height: 74px; } .sb-nfl-round-06 .bd .sb-ha { color: #e8eef8; }
.sb-nfl-round-06 .nm span { font-stretch: ${LETTERS.stretch}%; }
/* the first face kept for the letters and the clock; the scores heavier, as on air */
.sb-nfl-round-06 .s { font-weight: 900; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live';
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t, i) => {
      const s = el('span', 's' + (i ? ' r2' : ''), g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : '');
      if (g.status === 'pre') { s.style.fontSize = ((t.record || '').length > 5 ? 19 : 26) + 'px'; s.style.whiteSpace = 'nowrap'; }   // the record on the white plate before the game, readable
      s.style.gridRow = String(i + 1);
      const nm = el('div', 'nm'); nm.style.gridRow = String(i + 1);
      if (live && t.hasBall) nm.appendChild(el('i'));
      nm.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      bx.append(s, nm);
    });
    const top = el('span', 'ck'), bot = el('span', 'ck');
    top.style.gridRow = '1'; bot.style.gridRow = '2';
    if (live) { top.textContent = (g.period.label || '') + (g.period.suffix || ''); bot.textContent = g.clock || ''; }
    else { top.textContent = statusText(g, time); top.style.gridRow = '1 / 3'; top.classList.add('w'); top.style.padding = '0 26px 0 34px'; }   // fitted inside the curve and clear of the badge
    bx.append(top);
    if (live) bx.appendChild(bot);
    const arc = el('i', 'arc'); arc.style.left = (BAR - 16 - BADGE / 2 - 6 - 210 - 6) + 'px';
    // the row line runs on to the plates' curve, while the game is on
    const mid = el('i', 'mid'); mid.style.left = (172 - 40) + 'px'; mid.style.right = (BADGE / 2 + 6) + 'px';
    // the line between the rows only while the clock fills both rows: before and after the game it would run through the time or FINAL
    // a thin blue line along the plates' curve, the same curve as the one before the clock (as on air)
    const parc = el('i', 'arc'); parc.style.left = (172 - 40 - 2) + 'px';
    if (live) bx.append(arc, parc, mid); else bx.append(arc, parc);
    const bd = el('div', 'bd'); if (mk.league) bd.appendChild(leagueLogo(g, 74, null, true)); if (mk.ha) bd.appendChild(haMark(30));
    root.append(bx, bd);
  },
};
