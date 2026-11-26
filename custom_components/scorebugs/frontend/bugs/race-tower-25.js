// "Timing tower '25": after the Formula 1 world feed's timing tower (frame: a 2025 race, lap 44 of 58). A dark, see-through column down
// the left of the screen: the series' logo at the top over the lap (or the session's name), then a row per car with the position, a
// mark in its team's colour, and the driver's three letters; the leader's position sits in a red box, the followed driver's row is lit.
// The race's name (from the sensor) sits under the logo. The gaps to the car ahead and the team badges need data the sensor lacks: the team's colour stands in for its badge.
import { el, leagueLogo, marks, fit, FONTS } from '../kit.js';

const W = 300, ROWH = 38, ROWS = 20, TOP = 184;   // the head: the series' logo, the race's name, the circuit, the lap
// the host country's flag behind the head, from the same ESPN image server as the drivers' flags; the sensor names
// the country as ESPN writes it in the circuit's address
const FLAG = { usa: 'usa', 'united states': 'usa', mexico: 'mex', brazil: 'bra', canada: 'can', monaco: 'mon', spain: 'esp', austria: 'aut',
  'united kingdom': 'gbr', 'great britain': 'gbr', uk: 'gbr', england: 'gbr', hungary: 'hun', belgium: 'bel', netherlands: 'ned', italy: 'ita',
  azerbaijan: 'aze', singapore: 'sgp', japan: 'jpn', china: 'chn', 'saudi arabia': 'ksa', bahrain: 'bhr', qatar: 'qat',
  'united arab emirates': 'uae', uae: 'uae', 'abu dhabi': 'uae', australia: 'aus', france: 'fra', germany: 'ger', portugal: 'por', argentina: 'arg' };
const flagOf = (c) => { const k = String(c || '').trim().toLowerCase(); const code = FLAG[k] || (/^[a-z]{3}$/.test(k) ? k : '');
  return code ? 'https://a.espncdn.com/i/teamlogos/countries/500/' + code + '.png' : ''; };
const SESSION = { Race: 'RACE', Qual: 'QUALIFYING', FP1: 'PRACTICE 1', FP2: 'PRACTICE 2', FP3: 'PRACTICE 3', Sprint: 'SPRINT', SQ: 'SPRINT QUALI' };

export default {
  id: 'race-tower-25',
  sizedFor: 0.7,   // sizes were measured in SB Archivo Expanded; the matched face keeps those cap heights
  size: { w: W, h: TOP + ROWS * ROWH + 10 },
  // the tower is only as tall as the drivers it lists (a short field, or a sensor that gives only the top ten)
  sizeFor: (g) => ({ w: W, h: TOP + Math.max(1, Math.min(ROWS, (g.rows || []).length)) * ROWH + 10 }),
  fonts: [FONTS.kanit600],
  css: `
.sb-race-tower-25 { font-family: 'SB Kanit', 'Arial Black', sans-serif; font-weight: 800; color: #fff; }
.sb-race-tower-25 { font-weight: 600; }   /* FOM F1 tower: Kanit SemiBold (confirmed) */
.sb-race-tower-25 .col { position: absolute; inset: 0; background: linear-gradient(rgba(46,43,51,.9), rgba(34,33,39,.9) 18%, rgba(26,25,30,.9)); border-radius: 12px; border: 4px solid rgba(190,193,198,.9); box-shadow: inset 0 0 0 2px #c8231b; }
/* the sharp 2023 still's column is a warm charcoal (#222127 at the top rows to #1a191e at the foot), not the blue-black (#12121a) it was */   /* a light grey rim with a thin red line inside it, as on air */
.sb-race-tower-25 .lg { position: absolute; left: 0; right: 0; top: 10px; height: 56px; display: grid; place-items: center; }
.sb-race-tower-25 .lg .sb-league { width: 190px; height: 190px; margin: -67px 0; pointer-events: none; filter: brightness(0) invert(1); }   /* the file is square with the mark across its middle: a big square, cropped by its own empty top and bottom, so the mark spans the head as on air (it was a 50 px sliver; the file has wide empty margins all round) */
.sb-race-tower-25 .fg { position: absolute; left: 0; right: 0; top: 0; height: 132px; border-radius: 8px 8px 0 0; background-size: 128% auto; background-position: center; opacity: .55; }   /* the flag file has empty margins: enlarged so the flag fills the head */
.sb-race-tower-25 .fg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(18,18,26,.25), rgba(18,18,26,.85)); }   /* dimmed so the white type reads on any flag */
.sb-race-tower-25 .ci { position: absolute; left: 12px; right: 12px; top: 100px; height: 26px; display: grid; place-items: center; font-size: 15px; font-weight: 500; color: #c2c2cc; letter-spacing: .5px; white-space: nowrap; overflow: hidden; }
.sb-race-tower-25 .ev { position: absolute; left: 12px; right: 12px; top: 70px; height: 30px; display: grid; place-items: center; font-size: 19px; color: #d7d7de; letter-spacing: .5px; white-space: nowrap; overflow: hidden; }
.sb-race-tower-25 .lap { position: absolute; left: 0; right: 0; top: 132px; height: 44px; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: 22px; color: #d7d7de; border-bottom: 2px solid #3a3a46; }
.sb-race-tower-25 .lap b { font-size: 30px; color: #fff; margin: 0 6px; }
.sb-race-tower-25 .rw { position: absolute; left: 8px; right: 8px; height: ${ROWH - 4}px; display: grid; grid-template-columns: 40px 22px 1fr 56px; align-items: center; font-size: 18px; }
.sb-race-tower-25 .rw .p { text-align: center; font-size: 16px; } .sb-race-tower-25 /* (no red box on the leader: the sharp 2023 still shows none; the 2022 frame the bug was built from did) */
.sb-race-tower-25 .rw .mk { width: 6px; height: 18px; transform: skewX(-18deg); justify-self: center; }
.sb-race-tower-25 .rw .c { letter-spacing: 1px; padding-left: 8px; } .sb-race-tower-25 .rw .n { text-align: right; font-size: 12px; color: #9a9aa8; }
.sb-race-tower-25 .rw.me { background: rgba(255,255,255,.18); border-radius: 4px; }
`,
  draw(root, g, { opts }) {
    const mk = marks(opts);
    const col = el('div', 'col');
    const fl = flagOf(g.country);
    if (fl) { const fg = el('div', 'fg'); fg.style.backgroundImage = 'url("' + fl + '")'; col.appendChild(fg); }
    const lg = el('div', 'lg'); if (mk.league) lg.appendChild(leagueLogo(g, 52)); col.appendChild(lg);
    const lap = el('div', 'lap');
    if (g.status === 'live' && g.session === 'Race' && g.lap) { lap.append(document.createTextNode('LAP'), el('b', '', String(g.lap))); }
    else lap.textContent = (SESSION[g.session] || g.session || '') + (g.status === 'final' ? ' · FINAL' : '');
    // the race's name, as the sensor gives it (the series' own title, sponsor and all: "MSC Cruises United States GP")
    if (g.event) col.appendChild(fit(el('div', 'ev', g.event.toUpperCase())));
    // the circuit under it, with its city when the name does not already say it
    const where = g.circuit ? g.circuit + (g.city && g.circuit.indexOf(g.city) < 0 ? ', ' + g.city : '') : g.city;
    if (where) col.appendChild(fit(el('div', 'ci', where)));
    col.appendChild(lap);
    (g.rows || []).slice(0, ROWS).forEach((r, i) => {
      const rw = el('div', 'rw' + (i === 0 ? ' first' : '') + (g.player && g.player.id === r.id ? ' me' : ''));
      rw.style.top = (TOP + i * ROWH) + 'px';
      const m = el('i', 'mk'); m.style.background = r.color || '#8a8a96';
      rw.append(el('span', 'p', String(r.pos || i + 1)), m, el('span', 'c', r.code || ''), el('span', 'n', r.number ? '#' + r.number : ''));
      col.appendChild(rw);
    });
    root.appendChild(col);
  },
};
