// "Tournament bar '26": after the shared bug of the men's college basketball tournament on CBS, TBS, TNT and truTV (frame: 2026 Final
// Four on TBS). A long, square-cut bar: a dark slot at the left (the network's mark; here the Home Assistant logo), then each team as a
// logo square on a lighter shade, its colour with the seed and name over a row of timeout dashes, and its score in a white box; then a
// dark block with the half, the clock and the shot clock, and a dark plate at the right with the round ("NCAA FINAL FOUR"). Team fouls
// and the possession arrow, under the names on air, need data the sensor lacks; the shot clock too.
import { el, logo, pips, statusText, teamColor, shade, inkOn, haMark, marks, fit, FONTS } from '../kit.js';

const W = 1400, H = 64;
// measured against the frame, frame size / mine: Illinois v UConn
const TYPE = { score: 1.17, letters: 0.91, clock: 1.06, logo: 0.78 };

/** "NCAA Men's Basketball Championship - West Region - Sweet 16" -> "NCAA SWEET 16"; the Final Four and the final as they read on air. */
export function roundPlate(g) {
  const parts = String(g.note || '').split(/\s+-\s+/);
  const last = (parts[parts.length - 1] || '').trim();
  if (!g.note) return g.league || '';
  if (/national championship/i.test(last)) return 'NATIONAL CHAMPIONSHIP';
  // "NCAA" only for a college game; another league's note keeps its own words (it read NCAA ODI, NCAA LIGHT HEAVYWEIGHT)
  return ((!g.league || /^NCAA/.test(g.league) ? 'NCAA ' : '') + last.replace(/^Final Four.*$/i, 'Final Four')).toUpperCase().replace(/(\d)(ST|ND|RD|TH)\b/g, (m, d, s) => d + s.toLowerCase());
}


// the team letters' width to the frame's
const LETTERS = { stretch: 89 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.bar > div.sc', 5, 0, -3.5],  // vertical part removed: it dropped the score below the bar
  ['div.bar > div.tx > span.nm', -6.5, -1, 0],  // was 12.5 up, for the fouls row under the dashes on air; with no fouls data the larger name sits centred
  ['div.bar > div.lg > img.sb-logo', 0, -3, 0],
];

export default {
  id: 'cbb-tourney-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the tip-off the white score boxes go and the bar closes up
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - 140, h: H } : { w: W, h: H }),   // records keep the score boxes
  // measured against the frame by the automatic audit: text -17% vs the broadcast, logos -9%; 80 % of the correction
  typeScale: 1.0, logoScale: 1.081,
  nudge: NUDGE,
  fonts: [FONTS.barlowCond600],
  css: `
.sb-cbb-tourney-26 { font-family: 'SB Anton', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 84%; color: #fff; }
.sb-cbb-tourney-26 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 600; font-stretch: 100%; }   /* a lighter condensed face than Anton, as on air */
.sb-cbb-tourney-26 .bar { position: absolute; inset: 0; display: grid; grid-template-columns: 76px 96px 260px 70px 96px 260px 70px 190px 1fr; grid-template-rows: minmax(0, 1fr); box-shadow: 0 3px 6px rgba(0,0,0,.45); }
.sb-cbb-tourney-26 .slot { background: #2c3036; display: grid; place-items: center; border-radius: 6px 0 0 6px; } .sb-cbb-tourney-26 .slot .sb-ha { color: #f2f2f2; }
.sb-cbb-tourney-26 .lg { display: grid; place-items: center; } .sb-cbb-tourney-26 .lg .sb-logo { width: ${86 * TYPE.logo}px; height: ${62 * TYPE.logo}px; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(0,0,0,.45)); }
.sb-cbb-tourney-26 .tx { display: grid; align-content: center; padding: 0 12px; gap: 3px; }
/* the names are set larger than on air (the frame's fouls row under them has no data, and at card width the frame's size was tiny) */
.sb-cbb-tourney-26 .nm { font-size: 42px; line-height: 1; white-space: nowrap; letter-spacing: .5px; } .sb-cbb-tourney-26 .nm b { font-size: 30px; margin-right: 8px; }
.sb-cbb-tourney-26 .sb-pips { display: flex; gap: 6px; } .sb-cbb-tourney-26 .sb-pips i { flex: 1; height: 3px; background: rgba(255,255,255,.9); }
.sb-cbb-tourney-26 .sb-pips i.used { opacity: .25; }
.sb-cbb-tourney-26 .sc { background: #f4f4f4; color: #111; display: grid; place-items: center; font-size: ${48 * TYPE.score}px; line-height: 1; overflow: hidden; }
/* the half and the clock each in its own glossy black cell with a thin grey rule between them, as on air (Nov 23 sweep) */
.sb-cbb-tourney-26 .clk { background: linear-gradient(#2e3136, #121417 50%, #08090a); display: flex; align-items: stretch; justify-content: space-evenly; font-size: ${36 * TYPE.clock}px; border-left: 2px solid #3a3d42; }
.sb-cbb-tourney-26 .clk > span { display: flex; align-items: center; justify-content: center; flex: 1; } .sb-cbb-tourney-26 .clk > span + span { flex: 1.5; border-left: 2px solid #4a4d52; }
.sb-cbb-tourney-26 .clk .sb-ord { font-size: .7em; } .sb-cbb-tourney-26 .clk .w { font-size: 28px; }
.sb-cbb-tourney-26 .rp { background: linear-gradient(#24272c, #15171a); display: grid; place-items: center; font-size: 30px; letter-spacing: .5px; border-left: 2px solid #3a3d42;
  border-radius: 0 6px 6px 0; white-space: nowrap; }
.sb-cbb-tourney-26 .nm { font-stretch: ${LETTERS.stretch}%; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const recs = g.status === 'pre' && g.away.record && g.home.record;  // records before the game, every time
    if (g.status === 'pre' && !recs) bar.style.gridTemplateColumns = '76px 96px 260px 96px 260px 190px 1fr';
    const slot = el('div', 'slot');
    if (mk.ha) slot.appendChild(haMark(38));
    bar.appendChild(slot);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47'), ink = inkOn(c) === '#111' ? shade(c, -0.8) : '#fff';
      const lg = el('div', 'lg');
      // the logo on the same colour as the name block (the team's own colour, as ESPN lists it)
      lg.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.1) + ')';
      lg.appendChild(logo(t, 86));
      const tx = el('div', 'tx');
      tx.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.1) + ')';
      tx.style.color = ink;
      const nm = fit(el('span', 'nm'), (t.abbr || '').toUpperCase());   // a long name is squeezed to its room
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase().slice(0, 14)));
      tx.appendChild(nm);
      if (live && t.timeouts != null) tx.appendChild(pips(t.timeouts, 4));
      if (recs) { const r = el('div', 'sc', t.record); r.style.fontSize = (t.record.length > 5 ? 18 : 24) + 'px'; bar.append(lg, tx, r); }
      else if (g.status === 'pre') bar.append(lg, tx); else bar.append(lg, tx, el('div', 'sc', t.score != null ? String(t.score) : ''));
    });
    const clk = el('div', 'clk');
    if (live) { const q = el('span', ''); q.append(document.createTextNode(g.period.word ? g.period.label : g.period.label || ''), el('small', 'sb-ord', g.period.word ? '' : g.period.suffix || '')); clk.append(q, el('span', '', g.clock || '')); }
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(clk, el('div', 'rp', roundPlate(g)));
    root.appendChild(bar);
  },
};
