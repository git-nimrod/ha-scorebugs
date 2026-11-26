// "Cut-out logos '25": after FOX's college football bug (2025; frame: Oregon vs Northwestern). Two glossy panels in the teams' colours
// meet in the middle, each with the team's name centred in condensed capitals and, under it, three timeout dashes beside the record,
// and a big score centred against the seam. The team logos stand large at the outer ends, tilted towards each other, with the
// mascot's name across their foot; the rank above the logo. A dark box hangs under the seam with the quarter, the clock and the down
// and distance; a yellow bar marks the team with the ball. The play clock and the passing line need data the sensor lacks.
import { el, logo, pips, statusText, teamColor, shade, inkOn, FONTS, fit } from '../kit.js';

// wider panels
const W = 960, H = 190, TOP = 18, PH = 108, LOGO = 150, SCORE_W = 116;  // narrower in play, so the card shows it as big as before the game


// the team letters' width to the frame's
const LETTERS = { stretch: 78 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.pn.a > div.info > span.nm > span.sb-fit', 40.5, -11, 0],
  ['div.pn.h > div.info > span.nm > span.sb-fit', -7.5, -8, 0],
];

// before the kick-off each panel is only as wide as its name needs, so the logos come in close to the names; the same estimate sizes the stage
const nameSizeOf = (g) => { const longest = Math.max(...[g.away, g.home].map((t) => (t.name || t.abbr || '').length)); return Math.min(48, Math.max(24, Math.floor(210 / (Math.min(longest, 14) * 0.47)))); };
const prePanel = (g) => {
  const longest = Math.min(14, Math.max(...[g.away, g.home].map((t) => (t.name || t.abbr || '').length)));
  const textW = longest * 0.47 * nameSizeOf(g);
  return Math.round(Math.max(150, Math.min(W / 2 - 100 - SCORE_W, 64 + textW + 26)));
};

export default {
  id: 'cfb-cutout-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  balanceLogos: true,
  texture: 'plays',  // football plays drawn faintly over the panels by default; the card's Panel texture can change it // a wide logo (Razorbacks) beside a tall one (the trident) is scaled to the same visual weight
  // before the kick-off there is no score: the score room goes and both panels close up on the seam, so the bug is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: 200 + 2 * prePanel(g), h: H } : { w: W, h: H }),
  nudge: NUDGE,
  fonts: [FONTS.bigShoulders, FONTS.bangers],
  css: `
.sb-cfb-cutout-25 { font-family: 'SB Big Shoulders', 'Arial Narrow', sans-serif; font-weight: 800;   /* thicker */
  font-stretch: 76%; color: #fff; }
/* face: FOX CFB 2023-: Big Shoulders Display 800 */
.sb-cfb-cutout-25 .pn { position: absolute; top: ${TOP}px; height: ${PH}px; width: ${W / 2 - 100}px; box-shadow: 0 3px 6px rgba(0,0,0,.4), inset 0 -4px 0 #f2f2f2; overflow: hidden; }   /* a white line along the foot */
.sb-cfb-cutout-25 .pn.a { left: 100px; } .sb-cfb-cutout-25 .pn.h { right: 100px; }
.sb-cfb-cutout-25 .pn::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: var(--sb-tex, none), repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 2px, transparent 2px 9px); background-size: var(--sb-tex-size, auto), auto; mix-blend-mode: overlay; }
/* the card's Panel texture over the team panels, under the pinstripes */
/* the name against the score, centred in the panel's height above the timeout row, which runs along the panel's foot */
.sb-cfb-cutout-25 .info { position: absolute; top: 0; bottom: 0; display: grid; grid-template-rows: 1fr auto; z-index: 1; }
.sb-cfb-cutout-25 .pn.a .info { left: 64px; right: 120px; justify-items: end; } .sb-cfb-cutout-25 .pn.h .info { left: 120px; right: 64px; justify-items: start; }
.sb-cfb-cutout-25 .nm { align-self: center; padding-top: 4px; }
.sb-cfb-cutout-25 .ln { display: flex; align-items: center; gap: 12px; padding-bottom: 10px; }
.sb-cfb-cutout-25 .nm { font-size: 46px; line-height: 1; letter-spacing: .5px; text-shadow: 0 2px 2px rgba(0,0,0,.3); white-space: nowrap; }
.sb-cfb-cutout-25 .rec { font-size: 26px; line-height: 1; opacity: .95; }   /* readable at card width */
.sb-cfb-cutout-25.sb-pre .rec, .sb-cfb-cutout-25 .rec.pre { font-size: 32px; }
.sb-cfb-cutout-25 .sb-pips { display: flex; gap: 10px; }
.sb-cfb-cutout-25 .sb-pips i { width: 30px; height: 8px; border-radius: 4px; background: #f2f2f2; } .sb-cfb-cutout-25 .sb-pips i.used { opacity: .25; }
.sb-cfb-cutout-25 .sc { position: absolute; top: 0; height: ${PH - 10}px; width: 116px; display: grid; place-items: center; font-weight: 700; font-stretch: 82%; font-size: 92px; line-height: 1; z-index: 1; text-shadow: 0 3px 2px rgba(0,0,0,.3); }
.sb-cfb-cutout-25 .ball { position: absolute; bottom: 4px; height: 7px; width: 74px; background: #f5c400; z-index: 1; }
.sb-cfb-cutout-25 .lg { position: absolute; top: 0; width: ${LOGO}px; height: ${LOGO - 18}px; display: grid; place-items: center; }
/* a white outline round every logo, so it never sinks into its own team's panel */
.sb-cfb-cutout-25 .lg .sb-logo { width: ${LOGO}px; height: ${LOGO}px; object-fit: contain;
  filter: drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(0 3px 3px rgba(0,0,0,.45)) !important; }
.sb-cfb-cutout-25 .lg.a { transform: rotate(-9deg); } .sb-cfb-cutout-25 .lg.h { transform: rotate(9deg); }
.sb-cfb-cutout-25 .masc { position: absolute; top: ${LOGO - 50}px; width: ${LOGO}px; text-align: center; font-family: 'SB Bangers', 'Impact', sans-serif; font-weight: 400; font-size: 34px; letter-spacing: 1px; color: #fff; -webkit-text-stroke: 6px var(--mc, #222); paint-order: stroke; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); z-index: 2; text-transform: uppercase; }
.sb-cfb-cutout-25 .rk { position: absolute; top: 2px; font-size: 36px; font-weight: 800; font-style: italic; color: #111; -webkit-text-stroke: 5px #fff; paint-order: stroke; z-index: 3; }
.sb-cfb-cutout-25 .box { position: absolute; left: 50%; top: ${TOP + PH + 4}px; transform: translateX(-50%); height: 60px; min-width: 470px; justify-content: center; display: flex; align-items: center; gap: 60px; padding: 0 30px; box-sizing: border-box;
  background: #212222; border: 1px solid #8c8c8c; border-bottom: 5px solid #d6d6d6; font-size: 40px; letter-spacing: .5px; white-space: nowrap; }
.sb-cfb-cutout-25 .box small { font-size: 31px; }
.sb-cfb-cutout-25 .nm { font-stretch: ${LETTERS.stretch}%; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const ball = live ? (g.away.hasBall ? 'away' : g.home.hasBall ? 'home' : null) : null;
    // both names at one size, the size the longer name needs ("NORTHWESTERN")
    const longest = Math.max(...[g.away, g.home].map((t) => (t.name || t.abbr || '').length));
    // the room between the score and the logo is about 150 px; a long name is set small enough to stay inside it
    // both names at one size, the size the longer one needs to fit the ~210 px between the logo and the score
    const nameSize = nameSizeOf(g);
    [['away', 'a'], ['home', 'h']].forEach(([side, k]) => {
      const t = g[side], c = teamColor(t, '#4a4f57');
      const pn = el('div', 'pn ' + k);
      pn.style.background = 'linear-gradient(' + shade(c, -0.1) + ', ' + shade(c, -0.26) + ')';  // matte on air with a faint texture, no glossy horizon
      pn.style.color = inkOn(c) === '#111' ? shade(c, -0.8) : '#fff';
      const info = el('div', 'info');
      // long names are set smaller so they stay between the logo and the score, as on air ("NORTHWESTERN")
      const name = (t.name || t.abbr || '').toUpperCase().slice(0, 14), nm = fit(el('span', 'nm', name), (t.abbr || '').toUpperCase());
      nm.style.fontSize = nameSize + 'px';
      // under the name: the timeout dashes and the record side by side (the record on the outer side)
      const ln = el('div', 'ln'), rec = el('span', 'rec' + (g.status === 'pre' ? ' pre' : ''), t.record || ''), tp = live && t.timeouts != null ? pips(t.timeouts, 3) : null;
      if (side === 'away') ln.append(...(tp ? [tp] : []), rec); else ln.append(rec, ...(tp ? [tp] : []));
      info.append(nm, ln);
      const sc = el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      // the name runs from the logo towards the seam; the score sits against the seam
      if (side === 'away') sc.style.right = '4px'; else sc.style.left = '4px';
      if (g.status === 'pre') { pn.style.width = prePanel(g) + 'px'; info.style[side === 'away' ? 'right' : 'left'] = '16px'; pn.append(info); }
      else pn.append(info, sc);
      if (ball === side) { const b = el('span', 'ball'); b.style[side === 'away' ? 'right' : 'left'] = '25px'; pn.appendChild(b); }
      root.appendChild(pn);
      const lg = el('div', 'lg ' + k);
      lg.style[side === 'away' ? 'left' : 'right'] = '20px';
      lg.appendChild(logo(t, LOGO));
      root.appendChild(lg);
      // the mascot's name runs across the foot of the logo, tilted with it ("DUCKS", "WILDCATS")
      // the long name's words after the school's own ("Alcorn State Braves" for "Alcorn St": BRAVES); nothing when they do not line up
      const nw = (t.name || '').split(/\s+/).filter(Boolean), lw = (t.longName || '').split(/\s+/).filter(Boolean);
      let wi = 0; while (wi < nw.length && wi < lw.length - 1 && lw[wi].toLowerCase().startsWith(nw[wi].toLowerCase().replace(/\.$/, ''))) wi++;
      // else the long name's words past as many as the short name has ("Abilene Christian Wildcats" for "Abilene Chrstn": WILDCATS), so
      // every team's mascot is listed
      const masc = nw.length && wi === nw.length ? lw.slice(wi).join(' ') : lw.length > nw.length && nw.length ? lw.slice(nw.length).join(' ') : '';
      if (masc && masc.length <= 12) { const m = el('span', 'masc', masc); m.style.setProperty('--mc', shade(c, -0.15)); m.style[side === 'away' ? 'left' : 'right'] = '20px'; if (masc.length > 9) m.style.fontSize = Math.round(34 * 9 / masc.length) + 'px';   /* a long one ("MOUNTAINEERS") a size smaller, so it stays inside the bug (team sweep) */ m.style.transform = 'rotate(' + (side === 'away' ? -9 : 9) + 'deg)'; root.appendChild(m); }
      if (t.rank) { const rk = el('span', 'rk', '#' + t.rank); rk.style[side === 'away' ? 'left' : 'right'] = '6px'; rk.style.transform = 'rotate(' + (side === 'away' ? -9 : 9) + 'deg)'; root.appendChild(rk); }
    });
    const box = el('div', 'box');
    if (live) {
      box.append(el('span', '', (g.period.label || '') + (g.period.suffix || '')), el('span', '', g.clock || ''));
      if (g.football && g.football.short) box.appendChild(el('span', '', g.football.short));
    } else box.appendChild(el('span', '', statusText(g, time)));
    root.appendChild(box);
  },
};
