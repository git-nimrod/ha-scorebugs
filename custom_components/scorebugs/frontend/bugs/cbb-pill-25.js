// "Pill '25": after TNT's college basketball bug (2025; frame: Arizona vs Florida). A black rounded bar: each team as a pill of its
// colour with fine diagonal lines and a gloss, holding its logo, rank, name and record (in brackets) with timeout dashes under the
// name, and its score at the inner end, where the colour runs into the black clock oval in the middle (clock over the half). The
// network's mark and the event mark at the ends are left out. Fouls, the possession arrow and the shot clock need data the sensor
// lacks.
import { el, logo, pips, statusText, teamColor, shade, relight, inkOn, haMark, marks, fit, FONTS } from '../kit.js';

const MK = 84, W = 1110 + MK, H = 64, TEAM = 470, MID = 230, PRE_CUT = 90;  // MK: the network's round spot at the left end (frame BAS0009)


// the team letters' width to the frame's
const LETTERS = { stretch: 67 };
const lightness = (hex) => { const f = (i) => { const v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const y = 0.2126 * f(1) + 0.7152 * f(3) + 0.0722 * f(5); return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : y * 24389 / 27; };
const deep = (hex) => (/^#[0-9a-f]{6}$/i.test(hex || '') ? relight(hex, -Math.min(22, Math.max(0, lightness(hex) - 21))) : hex);

export default {
  id: 'cbb-pill-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the tip-off there is no score: each team pill closes up on the clock oval and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -27% vs the broadcast, logos -12%; 80 % of the correction
  typeScale: 1.05, logoScale: 1.113,
  fonts: [FONTS.anton],
  css: `
.sb-cbb-pill-25 { font-family: 'SB Anton', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 84%; color: #fff; }
.sb-cbb-pill-25 { font-weight: 400; }   /* TNT college basketball 2025-26: Anton */
.sb-cbb-pill-25 .bar { position: absolute; inset: 0; border-radius: ${H / 2}px; overflow: hidden; display: flex; background: #121316; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-cbb-pill-25 .tm { width: ${TEAM}px; flex: none; display: flex; align-items: center; gap: 12px; padding: 0 44px 0 18px; box-sizing: border-box; margin: 3px -30px 3px 0; border-radius: ${H / 2}px 0 0 ${H / 2}px; }
.sb-cbb-pill-25 .tm.h { flex-direction: row-reverse; padding: 0 18px 0 44px; margin: 3px 0 3px -30px; border-radius: 0 ${H / 2}px ${H / 2}px 0; }
.sb-cbb-pill-25 .mid { position: relative; z-index: 2; }
.sb-cbb-pill-25 .mk { width: ${MK}px; flex: none; display: grid; place-items: center; background: #0d0e10; } .sb-cbb-pill-25 .mk .sb-ha { color: #f2f2f2; }
.sb-cbb-pill-25 .tm .sb-logo { width: 64px; height: 54px; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
.sb-cbb-pill-25 .tm.a .sb-logo { margin-right: 26px; } .sb-cbb-pill-25 .tm.h .sb-logo { margin-left: 26px; }   /* clear space between logo and name, as on air */
.sb-cbb-pill-25 .tx { display: grid; gap: 3px; } .sb-cbb-pill-25 .tm.h .tx { justify-items: end; }
.sb-cbb-pill-25 .nm { font-size: 38px; line-height: 1; white-space: nowrap; } .sb-cbb-pill-25 .nm b { font-size: 20px; vertical-align: 12px; margin-right: 4px; }
.sb-cbb-pill-25 .nm small { font-size: 18px; vertical-align: 12px; margin-left: 6px; opacity: .85; }
.sb-cbb-pill-25 .sb-pips { display: flex; gap: 5px; } .sb-cbb-pill-25 .sb-pips i { width: 24px; height: 3px; background: rgba(255,255,255,.9); } .sb-cbb-pill-25 .sb-pips i.used { opacity: .25; }
/* the score is the inner end of the team's pill, where its colour runs into the black of the clock oval */
/* each score sits in its own oval, a deeper shade of the team colour with a thin light rim, running in under the clock */
.sb-cbb-pill-25 .sc { margin-left: auto; min-width: 70px; height: 52px; display: grid; place-items: center; box-sizing: content-box; border-radius: 26px; padding: 0 34px 0 18px; margin-right: -40px;
  background: rgba(0,0,0,.24); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.3); font-size: 50px; line-height: 1; font-stretch: 95%; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-cbb-pill-25 .tm.h .sc { margin-left: -40px; margin-right: auto; padding: 0 18px 0 34px; }
/* the clock oval on air is near black with only a faint lit top (L 18 at its top, ours was 38 under the kit's gloss) */
.sb-cbb-pill-25 .mid { width: ${MID}px; flex: none; display: grid; justify-items: center; align-content: center; background: linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 50%), #0d0e10; border-radius: ${H / 2}px; z-index: 2; }
/* the half and the clock side by side on one line */
.sb-cbb-pill-25 .mid.live { grid-auto-flow: column; align-items: baseline; justify-content: center; column-gap: 12px; }
.sb-cbb-pill-25 .mid .clk { font-size: 40px; line-height: .95; } .sb-cbb-pill-25 .mid .q { font-size: 28px; letter-spacing: .5px; } .sb-cbb-pill-25 .mid .w { font-size: 28px; }
.sb-cbb-pill-25 .nm { font-stretch: ${LETTERS.stretch}%; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    // the word after the period: halves in men's college basketball, quarters in football, basketball and Australian football; a hockey
    // period, a set, a round or an innings shown on this bug gets none
    const half = g.league === 'NCAAM' ? ' HALF' : /^(football|basketball|australian-football)$/.test(g.sport) ? ' QTR' : '';
    const team = (t, k) => {
      // the pill's colour is the team's taken deep, as on air: each team's colour darkened to L 21, by at most 22 L, so a light team
      // (gold, white) only deepens a little and keeps its own ink
      const c = deep(teamColor(t, '#3a3f47'));
      const tm = el('div', 'tm ' + k);
      // a rounded pill with fine diagonal lines through the colour and a gloss over it
      // the colour runs full to the score oval (it does not fade to black); a soft light top, no hard gloss horizon
      // the light top kept faint: on air the pill's top is no lighter than its middle (L 20 / 21)
      tm.style.background = 'linear-gradient(rgba(255,255,255,.05), rgba(255,255,255,0) 55%), repeating-linear-gradient(' + (k === 'a' ? '120deg' : '60deg') + ', rgba(255,255,255,.07) 0 2px, rgba(255,255,255,0) 2px 10px), linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, -0.25) + ', ' + shade(c, 0.06) + ' 50%, ' + shade(c, -0.12) + ')';
      tm.style.color = inkOn(c) === '#111' ? shade(c, -0.8) : '#fff';
      const nm = fit(el('span', 'nm'));   // the whole name, squeezed to its room (it was cut at 13 letters: "BOSTON COLLEG")
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase()));
      if (t.record) nm.appendChild(el('small', '', '(' + t.record + ')'));
      const tx = el('div', 'tx');
      tx.appendChild(nm);
      if (live && t.timeouts != null) tx.appendChild(pips(t.timeouts, 4));
      tm.append(logo(t, 62), tx);
      if (g.status === 'pre') tm.style.width = (TEAM - PRE_CUT) + 'px'; else tm.appendChild(el('span', 'sc', t.score != null ? String(t.score) : ''));
      return tm;
    };
    const ta = team(g.away, 'a'), th = team(g.home, 'h');
    const mid = el('div', 'mid');
    if (live) { mid.classList.add('live'); mid.append(el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toUpperCase()), el('span', 'clk', g.clock || '')); }
    else mid.appendChild(el('span', 'w', statusText(g, time)));
    const spot = el('div', 'mk'); if (mk.ha) spot.appendChild(haMark(40));   // where the network's mark sits on air
    bar.append(spot, ta, mid, th);
    root.appendChild(bar);
  },
};
