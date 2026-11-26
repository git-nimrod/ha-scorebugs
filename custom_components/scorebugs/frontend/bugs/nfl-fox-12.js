// "Rounded box '12": after Fox's NFL bug (2012-13; frame: Seahawks at Falcons). A dark rounded box: each team on a row of its colour with
// its letters and score in a wide, square-cornered type; a dark column at the right with the clock over the quarter; and a bottom row with
// the down and distance (the play clock's blue box left out: no data).
import { el, statusText, teamPair, shade, scoreSlot, inkOn, FONTS, pips } from '../kit.js';

// 600 wide: on air the box is 0.37 times as tall as it is wide (985 x 365 px); ours was 0.31. The clock column 28 % of the width, as on air
const W = 600, H = 222, ROW = 78, LOW = 52, RIGHT = 168;  // a lower, narrower foot for the down and distance
const TEAM_PX = 60, CLOCK_PX = 50, LOW_PX = 44, PRE_CUT = 60;  // 60 (was 110): the records kept clear of the letters

// a colour at a set HSL lightness, its hue and saturation kept
const atL = (c, l) => {
  const [r, g, b] = [1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l0 = (mx + mn) / 2;
  const s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l0 - 1));
  const h = mx === mn ? 0 : mx === r ? ((g - b) / (mx - mn) + 6) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
  const C = (1 - Math.abs(2 * l - 1)) * s, X = C * (1 - Math.abs(h % 2 - 1)), m = l - C / 2;
  const [p, q, t] = h < 1 ? [C, X, 0] : h < 2 ? [X, C, 0] : h < 3 ? [0, C, X] : h < 4 ? [0, X, C] : h < 5 ? [X, 0, C] : [C, 0, X];
  return '#' + [p, q, t].map((v) => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('');
};

export default {
  id: 'nfl-fox-12',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score and no down: the score room goes and the empty bottom row with it, so the box closes up; after the game the empty down row goes too
  // the down foot only for a football game while it runs (another sport's game left it empty)
  sizeFor: (g) => ({ w: g.status === 'pre' ? W - PRE_CUT : W, h: g.status === 'live' && g.football ? H : H - LOW + 6 }),
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-12 { font-family: 'SB Saira', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 100%; color: #fff; }   /* squarer, as on air (DET, 0); was Barlow */
.sb-nfl-fox-12 .tm { text-shadow: 0 0 2px rgba(0,0,0,.9), 0 2px 2px rgba(0,0,0,.6); }   /* the white letters edged dark, as on air */
/* face: FOX 2013: Barlow Semi Condensed Bold */
.sb-nfl-fox-12 .bx { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) ${RIGHT}px; grid-template-rows: ${ROW}px ${ROW}px 1fr; padding: 8px 34px 6px 0; box-sizing: border-box;
  /* the frame's silhouette: wide at the top, its sides chrome brackets bowing out down the rows, then slanting in under
 the down and distance to a narrower foot; a chrome layer with the dark body inset inside it */
  clip-path: var(--shape); filter: drop-shadow(0 3px 6px rgba(0,0,0,.5)); }
/* the brackets: two arcs following each curved side, measured on the frame (box 155 px wide):
 an outer near-black band, then a thin glassy silver line the same circle (radius 39.5 frame px both, fit within 0.3 and 0.1 px) set
 5.4 px in; laid over the rows, so the team colours run to the line and are cut by its curve. Was straight upright metal stripes that
 did not follow the curve. */
.sb-nfl-fox-12 .bx > .rim { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.sb-nfl-fox-12 .rim.band { background: linear-gradient(#24272c, #101114 60%, #17191c); }
/* the line dim at the top, brightest a third of the way down, a little dimmer at the foot, as on air (glass catching the light) */
.sb-nfl-fox-12 .rim.line { background: linear-gradient(#7d838a, #f4f6f8 38%, #e3e6ea 55%, #aab0b7); }
/* the body black, so the clock and quarter sit on black (frame: 20-33 of 255 under
 the clock and the quarter, 19-30 in the foot; was a dark grey 42,45,51 to 12,13,16) */
.sb-nfl-fox-12 .bx::before { content: ''; position: absolute; inset: 0; clip-path: var(--shape); background: linear-gradient(#141617, #0b0c0c 50%, #070808); z-index: 0; }
.sb-nfl-fox-12 .bx > * { position: relative; z-index: 1; }
.sb-nfl-fox-12 .rt > span:first-child:not(.w) { color: #e8c93a; }   /* the clock in yellow, the quarter white, as on air */
/* the yellow mark of the team with the ball lines up with the left bracket's arc: a band just inside the silver
 line, following its curve down that team's row (frame: about 5 of the box's 155 px wide, from the line in), drawn in draw */
.sb-nfl-fox-12 .rim.poss { background: linear-gradient(#f6e65a, #f2dc3a 50%, #d9bf22); z-index: 3; }
/* a light grey rim along the box's top edge, as on air (about 100 against the 36 of the body just under it). It runs only from one
 bracket's silver line to the other's, and the brackets' black lies over it (frame: the top row dark, 32-47, over the bracket, grey 120-125 between the lines) */
.sb-nfl-fox-12 .rim.top { background: linear-gradient(#8d949b, #5d636a); z-index: 1; }   /* 6 px (was 3 px; same colours, a brighter grey took the clock's contrast on a light page below 2:1) */
.sb-nfl-fox-12 .tm { display: flex; align-items: center; justify-content: space-between; padding: 0 40px 0 84px; border-radius: 0;   /* the colour runs to the bracket, which cuts it */ font-size: ${TEAM_PX}px; line-height: 1; }
.sb-nfl-fox-12 .tm + .tm { margin-top: 2px; }
.sb-nfl-fox-12 .tm { position: relative; } .sb-nfl-fox-12 .tm .sb-pips { position: absolute; left: 84px; bottom: 4px; display: flex; gap: 6px; }
/* lines, not ovals */
.sb-nfl-fox-12 .tm .sb-pips i { width: 28px; height: 5px; border-radius: 1px; background: #f2c230; }
.sb-nfl-fox-12 .tm .sb-pips i.used { opacity: .2; }   /* the timeouts as dashes under the letters, as on air */
.sb-nfl-fox-12 .rt { grid-column: 2; grid-row: 1 / 3; display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; font-size: ${CLOCK_PX}px; font-weight: 600; font-stretch: 90%; }
.sb-nfl-fox-12 .rt .w { grid-row: 1 / 3; font-size: ${CLOCK_PX * 0.5}px; text-align: center; line-height: 1.15; padding: 0 4px; }   /* a start time like TUE 1:46 AM ran into the metal at.6 */
/* the down and distance lighter and light grey, as on air (3RD & 9); centred on the foot, which is centred on the box */
.sb-nfl-fox-12 .lo { grid-column: 1 / 3; margin-right: -34px; display: grid; place-items: center; font-size: ${LOW_PX}px; font-weight: 600; font-stretch: 100%; color: #d5d8dd; }
.sb-nfl-fox-12 .sb-ord { font-size: .7em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    // the silhouette in px from the top: the bracketed sides down the rows (ROWS px), then (while the down row shows) the foot slanting in
    const rowsH = 8 + 2 * ROW + 2, foot = g.status === 'live' && g.football ? LOW : 6;
    // the outsides measured on the frame (frame box 155 x 53 px): each side down the rows is one circle arc (radius 37 px,
    // 0.70 of the box's height, fit within 0.4 px) whose widest point is 29 % of the way down, not half way: 2 % in at the top, flush from
    // 13 to 38 % down, 4.5 % in at the foot of the rows; then a small step in (to 7 %) and the foot slants in at 27 deg from upright to 11 %
    // at the bottom (ours slanted to 17 % before)
    const sx = W / 155, sy = rowsH / 39, arc = (y) => sx * (37.1 - Math.sqrt(37.1 ** 2 - Math.min((y / sy - 15.5) ** 2, 37.1 ** 2)));
    const side = [];
    for (let k = 0; k <= 12; k++) { const y = Math.round(rowsH * k / 12); side.push([+(100 * arc(y) / W).toFixed(2), y]); }
    const hasFoot = g.status === 'live' && g.football;
    const tail = hasFoot ? [[7, rowsH + 4], [7 + +(100 * Math.tan(27 * Math.PI / 180) * (foot - 4) / W).toFixed(2), rowsH + foot]]
      : [[+(100 * arc(rowsH + foot) / W).toFixed(2), rowsH + foot]];
    const left = side.concat(tail).map(([x, y]) => x + '% ' + y + 'px');
    const right = side.concat(tail).map(([x, y]) => (100 - x).toFixed(2) + '% ' + y + 'px');
    bx.style.setProperty('--shape', 'polygon(' + left.concat(right.reverse()).join(', ') + ')');
    // the two arcs of each bracket, down the rows to the step: the band from the outer edge to the line, the line 18 to 24 px in (the
    // frame's 4.6 and 6.2 px of 155): both the outer arc moved straight in, as on air (the gap stays 5-6 px down the whole side)
    const ring = (d0, d1, flip) => {
      const ys = side.map(([x, y]) => [x, y]).concat([[side[side.length - 1][0], rowsH + 4]]);
      const at = (x, d) => flip ? 'calc(' + (100 - x).toFixed(2) + '% - ' + d + 'px)' : 'calc(' + x + '% + ' + d + 'px)';
      const pts = ys.map(([x, y]) => at(x, d0) + ' ' + y + 'px').concat(ys.slice().reverse().map(([x, y]) => at(x, d1) + ' ' + y + 'px'));
      return 'polygon(' + pts.join(', ') + ')';
    };
    [false, true].forEach((flip) => {
      const band = el('i', 'rim band'); band.style.clipPath = ring(-2, 19, flip);
      const line = el('i', 'rim line'); line.style.clipPath = ring(18, 24, flip);
      bx.append(band, line);
    });
    // the top rim: a light grey line along the top edge from one bracket's silver line to the other's (18 px in from the outer edge),
    // under the brackets' black
    const top = el('i', 'rim top'); top.style.clipPath = 'polygon(calc(' + side[0][0] + '% + 18px) 0, calc(' + (100 - side[0][0]) + '% - 18px) 0, calc(' + (100 - side[0][0]) + '% - 18px) 6px, calc(' + side[0][0] + '% + 18px) 6px)'; bx.appendChild(top);
    // the possession band down one row, following the left bracket's arc just inside its silver line (24 to 43 px in)
    const band = (y0, y1) => {
      const ys = []; for (let k = 0; k <= 8; k++) ys.push(y0 + (y1 - y0) * k / 8);
      const pts = ys.map((y) => 'calc(' + (100 * arc(y) / W).toFixed(2) + '% + 24px) ' + y.toFixed(1) + 'px')
        .concat(ys.slice().reverse().map((y) => 'calc(' + (100 * arc(y) / W).toFixed(2) + '% + 43px) ' + y.toFixed(1) + 'px'));
      return 'polygon(' + pts.join(', ') + ')';
    };
    // two look-alike teams (red on red) part by one taking its other colour
    const pair = teamPair(g.away, g.home, '#3a3f47');
    [g.away, g.home].forEach((t, i) => {
      const c = pair[i];
      const tm = el('div', 'tm' + (live && t.hasBall ? ' ball' : '')); tm.style.gridRow = String(i + 1);
      // a muted, deeper version of the colour, lit at the top and darkening to the right, as on air (Lions slate blue, Eagles teal)
      // second pass: dark smoked glass tinted with the colour, as the frame's slate and teal rows, a glossy horizon over it
      const m = shade(c, -0.5), rgba = (x, a) => 'rgba(' + [1, 3, 5].map((j) => parseInt(x.slice(j, j + 2), 16)).join(', ') + ', ' + a + ')';
      // colours: on air the rows are the team's colour itself, not a smoked dark
      // glass: darker at the very top, brightest about a third down (the Eagles' teal 16,100,87), then falling to under half as bright at
      // the foot (8,49,31), the same across the row's length; a too-light colour (gold, white) is deepened so the white letters read
      // a near-black team (Raiders, Texans) is lifted to a charcoal, so its row still reads against the box's now black body
      const dark = /^#[0-9a-f]{6}$/i.test(c) && Math.max(...[1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16))) < 48;
      // every team's row brought to the same depth (measured on four 2013 stills, Lions at
      // Eagles): on air the Lions' row peaks at #075675 (its listed blue #0076b6 taken darker) and the Eagles' at #05786b (its listed
      // #004c54 taken lighter), both at the same HSL lightness, 0.24; ours ran the listed colours, so the Lions' row was half as bright
      // again as on air and the Eagles' two thirds as bright. The hue and saturation stay the team's
      const b = dark ? '#454b54' : atL(c, 0.245);
      // the dividing lines a fade to black: on air each row darkens to
      // near black at its foot (the Lions' blue 99 a third down, 38 at the foot, 27 in the line between the rows) and at its right end
      // against the clock column (over the last 2-3 of the box's 155 px, so 12 px here); was a 2 px dark grey gap
      tm.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) calc(100% - 12px), #050606), linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 40%), linear-gradient(' + shade(b, -0.45) + ', ' + b + ' 30%, ' + shade(b, -0.15) + ' 55%, ' + shade(b, -0.62) + ' 88%, ' + shade(b, -0.82) + ')'; tm.style.color = '#fff';
      void m; void rgba;
      tm.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      if (g.status !== 'pre') tm.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (t.record) { const r = el('span', 'sc', t.record); r.style.whiteSpace = 'nowrap'; r.style.fontSize = t.record.length > 5 ? '.46em' : '.6em'; r.style.marginLeft = '14px'; tm.appendChild(r); }  // the record before the game
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      bx.appendChild(tm);
      // the mark the full height of its team's row, from the top of the row (frame: the yellow runs the PHI row's whole height, rows 27 to 45 of 65); it stopped 4 px short each end
      // (put in before the rows, so it lies over them by its z-index only: drawn after the away row it counted as covering that row's
      // score, and a three-figure score was cut to a third of its size)
      if (live && t.hasBall) { const p = el('i', 'rim poss'); p.style.clipPath = band(8 + i * (ROW + 2), 8 + i * (ROW + 2) + ROW); bx.insertBefore(p, bx.querySelector(':scope > .tm')); }
    });
    const rt = el('div', 'rt');
    if (live) rt.append(el('span', '', g.clock || ''), el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')));
    else rt.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(rt);
    if (live) bx.appendChild(el('div', 'lo', g.football && g.football.short ? g.football.short : ''));
    root.appendChild(bx);
  },
};
