// "Cup bar '12": after NBC's NHL bug (2012 Stanley Cup Final). The network's mark stands at the left, off the bar (here the Home Assistant logo); then a long glossy black bar
// with small chrome clips at its ends and between its parts: each team a panel lit in its colour, the logo big at the panel's left and cut
// by it, the letters, and the score on its own glossy grey box faintly tinted by the team; then the period and the clock. Every part
// wears the same hard glass gloss (measured on the frame, Nov 23 2026: the top 42% washed light, near black from 46% down). Beside the bar a black box with a fine light rim
// names the round and the series ("CUP FINAL / LA LEADS 2-0"); outside the playoffs it shows the league and the night.
import { el, logo, statusText, haMark, marks, teamPair, shade, scoreSlot, fit, FONTS } from '../kit.js';

const H = 80, BAR = 60, MARK = 96, TEAM = 236, CLIP = 14, CLOCK = 290, BOX = 186, GAP = 22;
const W = MARK + 3 * CLIP + 2 * TEAM + CLIP + CLOCK + CLIP + GAP + BOX;
// the hard glass gloss over every part: light over the top 42%, then near black (measured column by column on the frame)
const GLASS = 'linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.1) 42%, rgba(0,0,0,.62) 46%, rgba(0,0,0,.78) 72%, rgba(0,0,0,.6))';
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v * t + y[i] * (1 - t)).toString(16).padStart(2, '0')).join(''); };
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default {
  id: 'nhl-nbc-12',
  size: { w: W, h: H },
  fonts: [FONTS.archivo],
  css: `
.sb-nhl-nbc-12 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 600; font-stretch: 92%; color: #fff; display: flex; align-items: center; height: ${H}px; }
.sb-nhl-nbc-12 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; } .sb-nhl-nbc-12 .mk .sb-ha { color: #fff; filter: drop-shadow(0 2px 3px rgba(0,0,0,.6)); }
.sb-nhl-nbc-12 .bar { height: ${BAR}px; display: flex; align-items: stretch; background: linear-gradient(#5f5d5c, #4b4c4a 40%, #1b1e1b 46%, #090b09 66%, #14171a 90%, #2a282d);
  box-shadow: 0 3px 8px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.12); }
/* the chrome clips at the ends and between the parts */
.sb-nhl-nbc-12 .clip { width: ${CLIP}px; flex: none; background: linear-gradient(90deg, #6d7177, #f2f3f5 40%, #9da2a8 60%, #4d5156); margin: 0; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,.6); }
.sb-nhl-nbc-12 .tm { width: ${TEAM}px; flex: none; position: relative; display: flex; align-items: center; overflow: hidden; margin: 3px 0; }
.sb-nhl-nbc-12 .tm .lw { width: 86px; align-self: stretch; flex: none; position: relative; overflow: hidden; }
.sb-nhl-nbc-12 .tm .lw .sb-logo { position: absolute; left: -6px; top: 50%; width: 84px; height: 84px; margin-top: -42px; object-fit: contain; }
.sb-nhl-nbc-12 .tm .ab { flex: 1; min-width: 0; padding-left: 6px; font-size: 40px; font-weight: 600; white-space: nowrap; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-nhl-nbc-12 .tm .sc { width: 62px; align-self: stretch; flex: none; display: grid; place-items: center; font-size: 42px; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-nhl-nbc-12 .tm .sc.rec { width: auto; padding: 0 8px; font-size: 20px; white-space: nowrap; }
.sb-nhl-nbc-12 .ck { width: ${CLOCK}px; flex: none; display: flex; align-items: center; justify-content: space-evenly; font-size: 40px; font-weight: 600; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nhl-nbc-12 .ck .w { font-size: 30px; }
.sb-nhl-nbc-12 .bx { width: ${BOX}px; height: ${H - 6}px; margin-left: ${GAP}px; flex: none; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px; padding: 0 8px; box-sizing: border-box;
  background: #020103; box-shadow: inset 0 0 0 2px rgba(220,222,226,.55), 0 3px 8px rgba(0,0,0,.6); font-stretch: 80%; text-transform: uppercase; }
.sb-nhl-nbc-12 .bx span { font-size: 26px; line-height: 1.05; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(60));
    const bar = el('div', 'bar');
    const team = (t, k) => {
      const c = pair[k];
      const p = el('div', 'tm');
      // lit in the team's colour by the logo, darkening towards the score, which sits on a still darker inset
      // the team colour under the same glass gloss as the whole bar
      p.style.background = GLASS + ', linear-gradient(90deg, ' + shade(c, 0.05) + ', ' + shade(c, -0.25) + ' 62%, ' + shade(c, -0.45) + ')';
      const lw = el('span', 'lw'); lw.appendChild(logo(t, 84));
      const sc = g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      // the score's box is the bar's own glossy grey with a little of the team in it (the Devils' reads grey, a blue team's bluish)
      sc.style.background = GLASS + ', linear-gradient(' + mix(c, '#5c5856', 0.22) + ', ' + mix(c, '#3e3a39', 0.22) + ')';
      p.append(lw, fit(el('span', 'ab', (t.abbr || '').toUpperCase())), sc);
      return p;
    };
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(el('i', 'clip'), team(g.away, 0), el('i', 'clip'), team(g.home, 1), el('i', 'clip'), ck, el('i', 'clip'));
    const r = g.round || {}, bx = el('div', 'bx');
    // "STANLEY CUP FINAL" read "CUP FINAL" on air
    const label = (r.label || '').replace(/^STANLEY\s+/, '');
    if (label) { bx.appendChild(fit(el('span', '', label))); if (g.series) bx.appendChild(fit(el('span', '', g.series.replace(/\s*series\s*/i, ' ')))); }
    else { bx.appendChild(el('span', '', g.league || 'NHL')); bx.appendChild(el('span', '', DAYS[new Date(g.starts).getDay()])); }
    root.append(mk, bar, bx);
  },
};
