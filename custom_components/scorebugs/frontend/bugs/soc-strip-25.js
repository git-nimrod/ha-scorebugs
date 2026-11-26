// "Title strip '25": after CBS's NWSL bug (2025; frame: the 2025 NWSL Championship, Washington vs Gotham). A dark strip on top names the
// league or, in the playoffs, the round ("NWSL CHAMPIONSHIP"); under it a dark slot (the network's mark on air; here the Home Assistant
// logo), then each team with its logo, its letters on a panel of its colour and its score, and the match clock on white. The sponsor
// plate at the right end on air is left out.
import { el, logo, soccerClock, homeFirst, teamColor, shade, inkOn, haMark, marks, FONTS, LOGO_HALO, fit, withRecord } from '../kit.js';

// (Nov 23 sweep) measured on the frame: the row about 1 : 15.8 of the bar without the sponsor plate, the title strip as tall as the row,
// its capitals about half the row's height
const W = 910, H = 116, TOP = 58, ROW = 58;  // the strip ends at the clock: no empty plate after it
// measured against the frame, frame size / mine: Washington v Gotham
const TYPE = { type: 1.22, clock: 1.17 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.row > div.tm > span', -3.5, -1.5, -3],
  ['div.row > div.clk', 3, -0.5, 0],
];

// the round's name when the game is a championship or a final ("NWSL Championship", "MLS Cup Final"); '' for any other game
const title = (g) => { const t = (g.round || {}).label || g.note || ''; return /champion|\bfinal\b|cup final/i.test(t) && !/semi|quarter/i.test(t) ? t : ''; };

export default {
  id: 'soc-strip-25',
  size: { w: W, h: H },
  // the title strip only for a championship or final, named by the game's own note; otherwise the bar alone
  sizeFor: (g) => (title(g) ? { w: W, h: H } : { w: W, h: ROW }),
  // measured against the frame by the automatic audit: text -9% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  nudge: NUDGE,
  dresses: ['regular', 'playoffs', 'finals'],
  fonts: [FONTS.interTight],
  css: `
.sb-soc-strip-25 { font-family: 'SB Inter Tight', Arial, sans-serif; font-weight: 800; color: #fff; }
.sb-soc-strip-25 .ttl { position: absolute; left: 0; top: 0; width: 910px; box-sizing: border-box; height: ${TOP}px; background: rgba(28,29,32,.92); display: grid; place-items: center; font-size: 36px; letter-spacing: 1px; }
.sb-soc-strip-25 .row { position: absolute; left: 0; top: ${TOP}px; height: ${ROW}px; display: grid; grid-template-columns: 62px 84px 260px 84px 260px 160px; box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-soc-strip-25 .slot { background: #101113; display: grid; place-items: center; } .sb-soc-strip-25 .slot .sb-ha { color: #fff; }
.sb-soc-strip-25 .lg { background: #1d1e21; display: grid; place-items: center; } .sb-soc-strip-25 .lg .sb-logo { width: 64px; height: ${ROW - 12}px; margin: 0; object-fit: contain; filter: ${LOGO_HALO}; }
.sb-soc-strip-25 .tm { display: flex; align-items: center; justify-content: space-between; padding: 0 22px; font-size: ${38 * TYPE.type}px; font-weight: 700; }   /* bold, not black, on air */
.sb-soc-strip-25 .clk { background: #f4f4f4; padding: 0 14px; box-sizing: border-box; color: #111; display: grid; place-items: center; font-size: ${38 * TYPE.clock}px; font-variant-numeric: tabular-nums; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const tt = title(g);
    if (tt) root.appendChild(el('div', 'ttl', tt.toUpperCase()));
    const row = el('div', 'row');
    if (!tt) row.style.top = '0';
    const slot = el('div', 'slot');
    if (mk.ha) slot.appendChild(haMark(36));
    row.appendChild(slot);
    [h, a].forEach((t) => {
      const lg = el('div', 'lg');
      lg.appendChild(logo(t, 80));
      const c = teamColor(t, '#2b2c30');
      const tm = el('div', 'tm');
      // flat on air, and the logo stands on the team's own colour, not on a dark box of its own
      tm.style.background = 'linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.08) + ')';
      lg.style.background = tm.style.background;   // the same gradient as the panel, so no tile shows behind the logo (review, Nov 22)
      tm.style.color = inkOn(c) === '#111' ? shade(c, -0.85) : '#fff';
      tm.append(withRecord(el('span', '', (t.abbr || '').toUpperCase()), t, g), el('span', '', g.status !== 'pre' && t.score != null ? String(t.score) : ''));  // the record beside the letters before kick-off
      row.append(lg, tm);
    });
    row.appendChild(fit(el('div', 'clk', soccerClock(g, time))));
    root.appendChild(row);
  },
};
