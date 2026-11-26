// "Night bar '25": after the AFL bar on the pay-TV football channel (2025; frame: a Friday night game, Sydney v Hawthorn, final quarter).
// A dark, see-through bar: the programme's mark at the left (here the Home Assistant logo), the quarter and the clock, then each team on
// a panel of its colour with its logo, its letters, the goals and behinds, and the points on a darker block at the end.
import { el, logo, statusText, teamColor, shade, inkOn, haMark, marks, FONTS, GLOSS, LOGO_HALO } from '../kit.js';

// loop pass, read by eye on the only frame (half covered by a replay wipe and dimmed, so no measuring tool can read it): the
// team pieces are inset in the black bar, 0.78 of its height (the frame: bar rows 8-52, panels 13-47, so 5 px bands of 44), and each club's logo is big
// and cut by its own square at the panel's left end (Sydney's swan fills the whole square height), not a small whole logo floating in the panel.
const W = 1240, H = 68;

export default {
  id: 'afl-dark-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -13% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  fonts: [FONTS.archivo],
  css: `
.sb-afl-dark-25 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 92%; color: #fff; }
.sb-afl-dark-25 { font-weight: 800; font-stretch: 125%; }   /* face: Archivo 800 at 125% width (low confidence) */
.sb-afl-dark-25 .bar { position: absolute; left: 0; top: 0; bottom: 0; width: max-content; white-space: nowrap; background: rgba(8,10,13,.92); display: flex; align-items: stretch; border-radius: 4px; overflow: hidden; }
.sb-afl-dark-25 .slot { width: 110px; display: grid; place-items: center; } .sb-afl-dark-25 .slot .sb-ha { color: #e8e8e8; }
.sb-afl-dark-25 .q { width: 220px; display: flex; align-items: center; justify-content: center; gap: 18px; font-size: 26px; } .sb-afl-dark-25 .q b { font-size: 34px; }
.sb-afl-dark-25 .tm { flex: 1 1 0; min-width: 0; display: flex;   /* both halves always the same width, whatever they hold */ align-items: center; gap: 12px; padding-left: 0; margin: 8px 0 8px 6px; }
.sb-afl-dark-25 .tm .lg { width: 52px; align-self: stretch; flex: none; overflow: hidden; display: grid; place-items: center; }
.sb-afl-dark-25 .tm .sb-logo { width: 100%; height: 100%; object-fit: cover; }
.sb-afl-dark-25 .tm .nm { flex: 1; font-size: 34px; } .sb-afl-dark-25 .tm .gb { min-width: 96px; font-size: 24px; letter-spacing: 1px; word-spacing: 14px; opacity: .9; }   /* the gap between the numbers, not inside them ("13 10", not "1 3 1 0"; review, Nov 22) */
.sb-afl-dark-25 .tm .pts { width: 96px; align-self: stretch; display: grid; place-items: center; font-size: 38px; }
.sb-afl-dark-25 .w { font-size: 24px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const bar = el('div', 'bar');
    const slot = el('div', 'slot'); if (mk.ha) slot.appendChild(haMark(56)); bar.appendChild(slot);
    // the quarter as the network writes it (Q3); another sport's game on this bar keeps its own period words (3RD, OT, 2ND HALF) and
    // FINAL
    const afl = g.sport === 'australian-football', per = afl ? 'Q' + (g.period.n || '') : (g.period.label || '') + (g.period.suffix || '');
    const q = el('div', 'q');
    if (g.status === 'live') q.append(el('span', '', per), el('b', '', g.clock || ''));
    else q.appendChild(el('span', 'w', g.status === 'final' && afl ? 'FULL TIME' : statusText(g, time)));
    bar.appendChild(q);
    [g.home, g.away].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm');
      tm.style.background = 'linear-gradient(90deg, ' + shade(c, -0.2) + ', ' + shade(c, 0.05) + ')';
      tm.style.color = inkOn(c) === '#111' ? '#111' : '#fff';
      const pts = el('span', 'pts', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      pts.style.background = shade(c, -0.5); pts.style.color = '#fff';
      const lg = el('span', 'lg'); lg.style.background = shade(c, -0.3); lg.appendChild(logo(t, 58));
      tm.append(lg, el('span', 'nm', (t.abbr || '').toUpperCase()), el('span', 'gb', g.status === 'pre' ? t.record || '' : t.goals != null && t.behinds != null ? t.goals + ' ' + t.behinds : ''));
      // no goals and behinds before the bounce: the record in their place (records before the game, always)
      if (g.status !== 'pre') tm.appendChild(pts);  // nor an empty points block
      bar.appendChild(tm);
    });
    root.appendChild(bar);
  },
};
