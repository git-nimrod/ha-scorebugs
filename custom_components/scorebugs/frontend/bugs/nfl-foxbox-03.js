// "Box '03": after the Sunday national NFL box of about 2001-2005 (frame: an NFL scorebugs-through-the-years montage, Buccaneers at Jaguars). A dark tab on top
// with the quarter, a red dot and the clock; under it a silver block where the network's mark sat (here the Home Assistant logo) beside
// a white panel with the two teams' letters and scores in black. Soft picture by default.
import { el, statusText, haMark, marks, FONTS, fit } from '../kit.js';

const W = 460, H = 228;


// the team letters' width to the frame's
const LETTERS = { stretch: 106, track: 0 };  // narrow enough that three letters fit unsqueezed, so both rows match

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.body > div.sc > div > span > span.sb-fit', -1, -0.5, 7],
];

export default {
  id: 'nfl-foxbox-03',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -26% vs the broadcast; 80 % of the correction
  typeScale: 1.15,
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-foxbox-03 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 100%; color: #111; }
.sb-nfl-foxbox-03 { font-weight: 700; font-stretch: 100%; }   /* face: Archivo 700 (medium confidence) */
.sb-nfl-foxbox-03 .tab { position: absolute; left: 70px; top: 0; right: 70px; height: 62px; background: linear-gradient(#f4f4f4, #b9bcc0); color: #111; border-radius: 12px 12px 0 0;
  display: flex; align-items: center; justify-content: space-evenly; font-size: 38px; }
.sb-nfl-foxbox-03 .tab i { width: 14px; height: 14px; border-radius: 50%; background: #e33; display: inline-block; }
.sb-nfl-foxbox-03 .body { position: absolute; left: 0; top: 62px; right: 0; bottom: 0; display: grid; grid-template-columns: 170px 1fr; border-radius: 26px; overflow: hidden; padding: 8px 24px 8px 0;   /* the silver capsule shows past the black panel's right end, as on air */ background: linear-gradient(#eeeeee, #a4a8ad); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nfl-foxbox-03 .mk { display: grid; place-items: center; } .sb-nfl-foxbox-03 .mk .sb-ha { color: #1c1e21; }
.sb-nfl-foxbox-03 .sc { background: #0a0a0a; color: #f4f4f4; display: grid; grid-template-rows: 1fr 1fr; grid-template-columns: minmax(0, 1fr); padding: 4px 20px; }
.sb-nfl-foxbox-03 .sc div { display: flex; justify-content: space-between; align-items: center; gap: 18px; font-size: 56px; line-height: 1; }   /* gap: three letters never touch a two-figure score (team sweep: 'HOU10') */
.sb-nfl-foxbox-03 .sc div > span:first-child { font-stretch: ${LETTERS.stretch}%; letter-spacing: ${LETTERS.track}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const tab = el('div', 'tab');
    if (g.status === 'live') tab.append(el('span', '', (g.period.label || '') + (g.period.suffix || '')), el('i'), el('span', '', g.clock || ''));
    else tab.appendChild(el('span', '', g.status === 'final' ? 'FINAL' : statusText(g, time)));
    const body = el('div', 'body'), m = el('div', 'mk'); if (mk.ha) m.appendChild(haMark(132));
    const sc = el('div', 'sc');
    // before the game each team's record stands in the score's place, smaller
    [g.away, g.home].forEach((t) => { const r = el('div'); const s = el('span', '', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''); s.style.flex = 'none'; if (g.status === 'pre') s.style.fontSize = '.55em'; r.append(fit(el('span', '', (t.abbr || '').toUpperCase())), s); sc.appendChild(r); });
    body.append(m, sc);
    root.append(tab, body);
  },
};
