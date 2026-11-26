// "Chrome bar '08": after the Monday night NFL bar of 2008-2011 (frame: an NFL scorebugs-through-the-years montage, Falcons at
// Saints). A long bar in a brushed chrome frame: the network's mark at the left (here the Home Assistant logo), each team on a dark
// panel with a strip of its colour at the left, its letters and score over a thin row of timeout dashes in yellow, then the quarter
// and the clock together on a pale plate, the down and distance, and the programme's mark at the right end (here the league's logo).
// Compact, with thin chrome between parts. Soft picture by default, like an HD broadcast seen on an old set.
import { el, pips, statusText, leagueLogo, haMark, marks, teamColor, shade, FONTS, fit } from '../kit.js';

const W = 1060, H = 58, DD = 297;   // DD: the down and distance plate (with its gap)
// measured against the frame, frame size / mine: Falcons at Saints
const TYPE = { clock: 0.95 };
// a three-figure score (basketball, a football shoot-out): each team plate and its score box 20 px wider and the bar with them, so the
// score keeps its size
const BIG = 20, big = (g) => g.status !== 'pre' && [g.away.score, g.home.score].some((v) => v != null && v >= 100);  // review: the clock was too small against the frame

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.fr > div.tm > span.ab', 6, 0, 0],  // was 20.5: it ran WSH into its score and squeezed the pre-game records
];

export default {
  id: 'nfl-chrome-08',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -11% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.barlow600],
  css: `
.sb-nfl-chrome-08 { font-family: 'SB Barlow', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 108%; color: #fff; }
.sb-nfl-chrome-08 { font-weight: 600; font-stretch: 100%; }   /* face: Barlow 600 (medium confidence) */
.sb-nfl-chrome-08 .fr { position: absolute; inset: 0; border-radius: 7px; padding: 4px; box-sizing: border-box; background: linear-gradient(#f2f3f4, #a7adb3 45%, #e3e6e8 55%, #8b9197);
  box-shadow: 0 3px 8px rgba(0,0,0,.5); display: flex; gap: 3px; }
.sb-nfl-chrome-08 .fr > * { background: linear-gradient(#4a4d52, #1d1f22 55%, #121315); border-radius: 3px; display: flex; align-items: center; justify-content: center; }
.sb-nfl-chrome-08 .slot { width: 104px; } .sb-nfl-chrome-08 .slot .sb-ha { color: #e6e6e6; }
.sb-nfl-chrome-08 .tm.pre .s { width: 70px; }   /* before the game the record needs room to read */
.sb-nfl-chrome-08 .tm { width: 160px; justify-content: space-between !important; padding: 0 0 0 20px; position: relative; overflow: hidden; box-sizing: border-box; }
.sb-nfl-chrome-08 .tm .strip { position: absolute; left: 0; top: 0; bottom: 0; width: 12px; }
.sb-nfl-chrome-08 .tm .ab { position: relative; font-size: 38px; margin-right: 6px; } .sb-nfl-chrome-08.is-live .tm .ab { top: -4px; }   /* about 55 % of the bar; lifted clear of the dashes only during play */   /* clear of the score (team sweep: 'WSH10') */ .sb-nfl-chrome-08 .tm .s { align-self: stretch; width: 48px; display: grid; place-items: center; font-size: 40px; line-height: 1; padding-top: 2px; box-sizing: border-box; background: linear-gradient(#7a7e84, #4a4d52 55%, #3a3d42); box-shadow: inset 2px 0 0 rgba(0,0,0,.4); }
.sb-nfl-chrome-08 .tm .sb-pips { position: absolute; left: 20px; bottom: 2px; display: flex; gap: 8px; } .sb-nfl-chrome-08 .tm .sb-pips i { width: 24px; height: 4px; background: #e6c83a; }
.sb-nfl-chrome-08 .tm .sb-pips i.used { opacity: .2; }
/* the team plates smoky dark chrome, not black: a bright reflection a fifth of the way down, then mid grey darkening to the foot, the
 score on the same plate behind a faint dark seam (frame: #d5d4d2 at the band, #6b6766 mid, #52494a at the foot) */
.sb-nfl-chrome-08 .fr > .tm { background: linear-gradient(#8a888a, #d0cfcf 18%, #807d7f 34%, #66626a 58%, #4c4749); }
.sb-nfl-chrome-08 .tm .s { background: none; box-shadow: inset 2px 0 0 rgba(0,0,0,.3); }
.sb-nfl-chrome-08 .ck { width: 230px; background: linear-gradient(#ffffff, #dfe2e5 50%, #c3c8cc) !important; color: #16181b; font-size: ${32 * TYPE.clock}px; justify-content: space-evenly !important; }
.sb-nfl-chrome-08 .ck i { width: 2px; height: 30px; background: #9aa0a6; }
.sb-nfl-chrome-08 .dd { flex: 1; font-size: 30px; } .sb-nfl-chrome-08 .pm { width: 86px; } .sb-nfl-chrome-08 .pm .sb-league { width: 44px; height: 44px; }
`,
  // outside live play the down and distance plate goes (it stood empty); before the game each team plate widens for its record
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (g.status === 'live' && g.football ? 0 : DD) + (g.status === 'pre' ? 2 * 22 : 0) + (big(g) ? 2 * BIG : 0), h: H }),
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live';
    if (live) root.classList.add('is-live');
    const fr = el('div', 'fr');
    const slot = el('div', 'slot'); if (mk.ha) slot.appendChild(haMark(38)); fr.appendChild(slot);
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'tm' + (g.status === 'pre' ? ' pre' : '')); if (g.status === 'pre') tm.style.width = '182px';
      if (big(g)) tm.style.width = (160 + BIG) + 'px';
      const st = el('i', 'strip'); const c = teamColor(t, '#555'); st.style.background = 'linear-gradient(' + shade(c, 0.15) + ', ' + shade(c, -0.25) + ')';
      tm.append(st, el('span', 'ab', (t.abbr || '').toUpperCase()), (() => { const n = el('span', 's scn', g.status !== 'pre' && t.score != null ? String(t.score) : ''); if (big(g)) n.style.width = (48 + BIG) + 'px'; return n; })());
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      fr.appendChild(tm);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toLowerCase())), el('i'), el('span', '', g.clock || '')); else ck.appendChild(el('span', '', statusText(g, time)));
    fr.append(ck); if (live && g.football) fr.append(
      el('div', 'dd', live && g.football && g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()) : ''));   // FINAL already stands on the clock plate (it showed twice)
    const pm = el('div', 'pm'); if (mk.league) pm.appendChild(leagueLogo(g, 50, null, true)); fr.appendChild(pm);
    root.appendChild(fr);
    // the kit sizes a three-figure score down when it does not fit, first while the face is still loading (a wider stand-in face) and
    // again once it has; the second pass starts from the first one's size, so a score that fits in the real face stayed small. Once
    // the faces are in, the scores go back to their own size before that second pass (this runs first: it was asked for first)
    // (the kit's face matching set every size a touch smaller first: the letters' 38 px became the share kept here, and the scores take it too)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { const ab = root.querySelector('.ab'), k = (ab && parseFloat(ab.style.fontSize) / 38) || 1;
      root.querySelectorAll('.scn').forEach((n) => { if (n.style.getPropertyPriority('font-size')) n.style.setProperty('font-size', (40 * k).toFixed(2) + 'px'); }); }, () => {});
  },
};
