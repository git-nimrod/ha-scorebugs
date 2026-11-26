// "Footy bar '26": after the AFL bar on its free-to-air network (2026; frame: GWS v Geelong, first quarter). One long navy bar along the
// bottom: the programme's mark at the left (here the Home Assistant logo), the quarter (and the clock while it runs), then each team as
// its logo on a square of its colour, its letters, the goals and behinds small, and the points in a box. The next-game panel on the right
// on air is left out. Needs the goals and behinds from Scorebugs' own sensors; with other sensors only the points show.
import { el, logo, statusText, teamColor, shade, inkOn, haMark, marks, FONTS, GLOSS, LOGO_HALO } from '../kit.js';

const W = 1240, H = 54;  // the frame's bar against a team panel's width

export default {
  id: 'afl-bar-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-afl-bar-26 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 108%; color: #fff; }
.sb-afl-bar-26 { font-weight: 800; font-stretch: 125%; }   /* face: Archivo 800 at 125% width (low confidence) */
.sb-afl-bar-26 .bar { position: absolute; left: 0; top: 0; bottom: 0; width: max-content; white-space: nowrap; background: linear-gradient(#18234a, #0e1631); display: flex; align-items: stretch; box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.sb-afl-bar-26 .slot { width: 96px; display: grid; place-items: center; background: #fff; } .sb-afl-bar-26 .slot .sb-ha { color: #c8102e; }
.sb-afl-bar-26 .q { width: 120px; display: grid; place-items: center; font-size: 21px; line-height: 1.05; text-align: center; }
.sb-afl-bar-26 .tm { display: flex; align-items: stretch; margin-right: 8px; }
.sb-afl-bar-26 .tm .lg { width: 64px; display: grid; place-items: center; } .sb-afl-bar-26 .tm .lg .sb-logo { width: 50px; height: 46px; object-fit: contain; filter: ${LOGO_HALO}; }
.sb-afl-bar-26 .tm .nm { width: 230px; white-space: nowrap; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; font-size: 29px; }   /* upright on air */
.sb-afl-bar-26 .tm .gb { font-size: 20px; font-style: normal; letter-spacing: 1px; word-spacing: 12px; opacity: .85; }
.sb-afl-bar-26 .tm .pts { width: 86px; display: grid; place-items: center; font-size: 31px; }
.sb-afl-bar-26 .w { font-size: 22px; padding: 0 20px; display: grid; place-items: center; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const slot = el('div', 'slot'); if (mk.ha) slot.appendChild(haMark(46)); bar.appendChild(slot);
    // the quarter as the network writes it (Q3); another sport's game on this bar keeps its own period words (3RD, OT, 2ND HALF) and
    // FINAL
    const afl = g.sport === 'australian-football', per = afl ? 'Q' + (g.period.n || '') : (g.period.label || '') + (g.period.suffix || '');
    const q = el('div', 'q');
    if (live) { q.append(per); if (g.clock) q.append(el('br'), g.clock); }   // text nodes only: the clock comes from ESPN
    else if (g.status === 'final') { if (afl) q.append('FULL', el('br'), 'TIME'); else q.append(statusText(g, time)); }   // on two lines like the quarter and clock (one line ran into the logo)
    if (g.status !== 'pre') bar.appendChild(q);   // before the game the box would stand empty: the start time closes the bar instead
    [g.home, g.away].forEach((t, i) => {
      const c = teamColor(t, '#3a3f47'), light = i === 0;
      const tm = el('div', 'tm');
      const lg = el('div', 'lg'); lg.style.background = shade(c, -0.1); lg.appendChild(logo(t, 54));
      const nm = el('div', 'nm');
      // the first team on a white panel in its colour, the second on its own colour, as on air
      nm.style.background = light ? '#ffffff' : shade(c, -0.15);
      nm.style.color = light ? c : (inkOn(c) === '#111' ? '#111' : '#fff');
      nm.append(el('span', '', (t.abbr || '').toUpperCase()), el('span', 'gb', g.status === 'pre' ? t.record || '' : t.goals != null && t.behinds != null ? t.goals + ' ' + t.behinds : ''));
      // no goals and behinds before the bounce: the record in their place (records before the game, always)
      const pts = el('div', 'pts', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      pts.style.background = light ? shade(c, -0.55) : '#ffffff'; pts.style.color = light ? '#fff' : '#0e1631';
      if (g.status === 'pre') { nm.style.width = t.record ? '230px' : '150px'; tm.append(lg, nm); } else tm.append(lg, nm, pts);  // no empty points box before the game
      bar.appendChild(tm);
    });
    if (g.status === 'pre') bar.appendChild(el('div', 'w', statusText(g, time)));
    root.appendChild(bar);
  },
};
