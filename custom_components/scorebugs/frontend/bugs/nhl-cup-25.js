// "Smoked glass '25": after the NHL bug on ESPN and ABC (2021 on, seen in the 2026 playoffs). A smoked-glass box (no title line
// and no light rim, as in the frame): the period over a rule over the clock in a column at the left, and the two teams in rows to the
// right, each with its logo very large on the team's colour and cut by its cell, the row running from its first colour into its second towards a big score (as on
// air: Avalanche maroon into blue), a thin light line between the rows. The trophy and the network mark at the left become the league's logo
// over the Home Assistant logo, on a near-black box as on air; the period and clock sit on a flat grey column (frame HOC0007, upscaled).
import { el, logo, statusText, teamColor, shade, leagueLogo, haMark, marks, abbr3, cupMark, FONTS, teamInk, scoreSlot, contrast, fit, inkOn } from '../kit.js';

const SHEEN = 'linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,.03) 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,.14))';

const ROW = 80, TOP = 0, W = 670, H = 2 * ROW + 6, SIDE = 110;  // no title strip over the rows, so the box is only the rows high
// measured against the frames: bigger scores, letters and clock (Senators at Hurricanes frame)
const ABBR_PX = 54, SCORE_PX = 82, CLOCK_PX = 50;
const TILE = 118, LOGO = 118, LOGO_W = TILE;  // the logo as wide as its tile: whole from side to side, only its top and bottom cut by the row // each row starts with a logo tile about 1.35x the row high, the logo about 1.6x the tile, cropped evenly
const SCORE_GAP = 8, SCORE_PAD = 12;   // the score slot (two figures wide) already holds the room the frame leaves between letters and score

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.gl > div.r > span.s.sb-num', -3, -0.5, 0],
];

export default {
  id: 'nhl-cup-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  nudge: NUDGE,
  dresses: ['regular', 'playoffs'],
  fonts: [FONTS.roboto],
  css: `
.sb-nhl-cup-25 { font-family: 'SB Roboto', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 115%; color: #fff; }
/* face: ESPN/ABC NHL 2021: Roboto Bold */
.sb-nhl-cup-25 .gl { position: absolute; inset: 0; box-sizing: border-box; border: 3px solid rgba(58,59,56,.9); background: linear-gradient(rgba(70,72,76,.86), rgba(36,37,40,.9)); box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-nhl-cup-25 .side { position: absolute; left: 3px; top: ${TOP}px; width: ${SIDE}px; height: ${2 * ROW}px; display: grid; grid-template-rows: 1fr 44px; justify-items: center; align-items: center; }
.sb-nhl-cup-25 .side { background: linear-gradient(#24231f, #121210); }
.sb-nhl-cup-25 .side .sb-league { width: 96px; height: 100px; } .sb-nhl-cup-25 .side .sb-cup { filter: drop-shadow(0 2px 3px rgba(0,0,0,.6)); }
.sb-nhl-cup-25 .side .sb-ha { color: #f2f2f2; }
.sb-nhl-cup-25 .pc { position: absolute; left: var(--l, 3px); top: ${TOP}px; width: 172px; height: ${2 * ROW}px; display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; }
.sb-nhl-cup-25 .pc { background: linear-gradient(#45464a, #34353a); }
.sb-nhl-cup-25 .pc > span { font-size: 40px; font-weight: 600; color: #e4e4e4; } .sb-nhl-cup-25 .pc > span:last-child { font-size: ${CLOCK_PX}px; }   /* direct children only: the kit's fitting wrapper inside the status was taking the clock's size (status ran into the logo) */
.sb-nhl-cup-25 .pc::after { content: ''; position: absolute; left: 22px; right: 22px; top: 50%; height: 2px; background: #c9c9c9; }
.sb-nhl-cup-25 .pc span.w { grid-row: 1 / 3; font-size: 30px; text-align: center; line-height: 1.2; padding: 0 12px; }
.sb-nhl-cup-25 .pc.w::after { display: none; }
.sb-nhl-cup-25 .r { position: absolute; left: calc(var(--l, 3px) + 172px); right: 3px; height: ${ROW - 2}px; overflow: hidden; display: flex; align-items: center; justify-content: flex-end; gap: ${SCORE_GAP}px; padding-right: ${SCORE_PAD}px; }
.sb-nhl-cup-25 .r .lt { position: absolute; left: 0; top: 0; bottom: 0; width: ${TILE}px; box-sizing: border-box; }   /* the logo tile: no divider line; every tile ends at the same place */
.sb-nhl-cup-25 .r .lw { position: absolute; inset: 0; overflow: hidden;
}   /* a clean edge at the tile's end, the same for both rows */
/* no outline round the cut logos: the tile's edge cut the rim into a hard line */
.sb-nhl-cup-25 .r .lw .sb-logo { filter: none !important; }
/* a logo all in its row's colour (Washington's navy on navy) goes plain white as the kit draws it, no rim, so it does not vanish */
.sb-nhl-cup-25 .r .lw .sb-logo.sb-logo-mono { filter: brightness(0) invert(1) !important; }
.sb-nhl-cup-25 .r .lw .sb-logo { position: absolute; left: ${(TILE - LOGO) / 2}px; top: ${(ROW - 2 - LOGO) / 2}px; width: ${LOGO}px; height: ${LOGO}px; object-fit: cover; }   /* zoomed about 1.6x the tile and cropped evenly; the kit slides it to its focal point */
.sb-nhl-cup-25 .r .ab { position: relative; margin-left: ${TILE + 22}px; margin-right: auto; font-size: ${ABBR_PX}px; letter-spacing: 1px; text-shadow: 0 2px 2px rgba(0,0,0,.4); }   /* the letters just after the logo, the score alone at the right end, as on air */
.sb-nhl-cup-25 .r .s { font-size: ${SCORE_PX}px; text-align: right; }
/* three-figure scores (or a basketball game): the score a size smaller (0.85) and the letters a little nearer the logo tile, squeezed
 if need be, so they stay clear of the logo (PHX ran over the Suns' logo; 98 / 103 shrank to 0.65) */
.sb-nhl-cup-25 .r .ab { min-width: 0; } .sb-nhl-cup-25 .wide .r .ab { margin-left: ${TILE + 12}px; }
.sb-nhl-cup-25 .wide .r .s.sb-num { min-width: 0 !important; } .sb-nhl-cup-25 .big .r .s.sb-num { font-size: ${Math.round(SCORE_PX * 0.85)}px; }
.sb-nhl-cup-25 .r .s.sb-pre-rec { font-size: ${Math.round(SCORE_PX * 0.5)}px; } .sb-nhl-cup-25 .r .s.sb-pre-rec.long { font-size: ${Math.round(SCORE_PX * 0.36)}px; }   /* a record before the game: smaller, clear of the name (nudged 24 px right) */
/* a record stays on one line, a little clear of the letters (an NBA record such as 45-34 broke onto two) */
.sb-nhl-cup-25 .r .s.sb-pre-rec { white-space: nowrap; flex: none; margin-left: 10px; }
`,
  draw(root, g, { time, opts }) {
    root.dataset.focus = 'face';  // each cut logo centred on its sharpest detail: the orca's head, the duck's eyes
    const mk = marks(opts);
    const live = g.status === 'live';
    const gl = el('div', 'gl');
    const big = g.status !== 'pre' && [g.away, g.home].some((t) => String(t.score == null ? '' : t.score).length > 2);
    if (big || (g.sport === 'basketball' && g.status !== 'pre')) gl.classList.add('wide'); if (big) gl.classList.add('big');
    // no title strip
    // the trophy and the network's mark stood at the left: here the league's logo over the Home Assistant logo
    if (mk.league || mk.ha) {
      const side = el('div', 'side');
      // in the playoffs the cup stands here, as on air (a plain drawn cup); otherwise the league's logo
      const top = g.dress && g.dress !== 'regular' && g.league === 'NHL' ? cupMark(112) : mk.league ? leagueLogo(g, 96, null, true) : el('span');
      side.append(top, mk.ha ? haMark(34) : el('span'));
      gl.appendChild(side);
      gl.style.setProperty('--l', (SIDE + 3) + 'px');
    }
    const pc = el('div', 'pc');
    if (live) { pc.append(el('span', '', g.period.label + (g.period.suffix || '')), el('span', '', g.clock || '')); }
    else { pc.classList.add('w'); pc.appendChild(el('span', 'w', statusText(g, time))); }
    gl.appendChild(pc);
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#4a4f57');
      const r = el('div', 'r');
      r.style.top = (TOP + i * ROW) + 'px';
      // as on air: the logo on the team's colour, the row running from the first colour into the second (a dark shade when the second is
      // missing or near white), a soft sheen over it, a thin light line above the second row
      // a second colour that takes white letters only; one too light for white (gold) keeps the row on its first colour lifted 10 %, one missing or near white gives a dark shade
      const ok2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '');
      const c2 = ok2 && inkOn(t.color2) === '#fff' ? t.color2 : ok2 && contrast(t.color2, '#ffffff') > 1.6 ? shade(c, 0.1) : shade(c, -0.5);
      r.style.background = SHEEN + ', linear-gradient(90deg, ' + c + ' ' + TILE + 'px, ' + c + ' 40%, ' + c2 + ' 92%)';   // the team's colour into its second, left to right (frame: Avalanche maroon into blue)
      if (i === 1) r.style.boxShadow = 'inset 0 2px 0 rgba(225,225,225,.8)';
      r.style.color = teamInk(c);
      // before the game the record in the score's place, a size smaller so the name keeps its spot (the kit leaves a shown record alone)
      const sv = g.status === 'pre' ? el('span', 's sb-pre-rec', t.record || '') : scoreSlot(el('span', 's', t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre' && (t.record || '').length > 5) sv.classList.add('long');   // "48-25-9": a size smaller again
      const lt = el('div', 'lt'), lw = el('div', 'lw');
      // no fill of its own: the row's gradient runs on behind the logo, as on air
      lw.appendChild(logo(t, 190)); lt.appendChild(lw);
      r.append(lt, fit(el('span', 'ab', abbr3(t))), sv);
      r.lastChild.style.color = teamInk(c2);   // the score sits on the row's second colour
      gl.appendChild(r);
    });
    root.appendChild(gl);
  },
};
