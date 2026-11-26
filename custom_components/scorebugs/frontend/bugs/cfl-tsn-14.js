// "White slants '14": after the Canadian sports network's CFL bar of the mid-2010s. A row of glossy plates leaning forward, laid straight on the picture: the network's plate in red
// first (here the Home Assistant logo in white), then each team's logo and letters on a white plate with its score on a black one, a
// white plate the network used for its own notes (here the down while a team has the ball, in the same red letters), and the quarter
// and clock on a black plate at the right end. The same family as the network's hockey bars of the time (Grey slants '08), with the
// mark first and the quarter and clock on one plate.
// measured (crop px of 780 x 32): plates y 2-29, leaning 25 deg (top to the right; geomdiff on five plates: 24-27 deg); at mid-height mark 3-104,
// team 105-232, score 233-300, team 300-430, score 431-495, note 495-632, quarter and clock 633-779; seams 2 px; capitals 13-14 px
// (0.5 of a plate), scores 15. Gloss (sample.py): white plates L 94 at the top falling evenly to 80 at the foot; black plates lit
// +25 L over the top quarter with a step at 23-29 %, then near black; the red plate lit over its top quarter, darkest at the foot.
import { el, logo, ordinal, statusText, haMark, marks, abbr3, scoreSlot, setSrc, badge, FONTS } from '../kit.js';

const K = 1170 / 780, P = (x) => Math.round(x * K);
// the plates
// now touch (no seams), each with its corners rounded 4 px (0.1 of a plate, as the 2014 still's dark plates), inside one metallic rim
// that runs round the whole row and its slanted ends (sample.py --outline on the still: 0.19 of the bar's height at the ends, a light
// silver band whose lightness changes 25-75 L along the side, so lit, not flat); glass on every plate from the still's grid samples
// (dark plates: a bright line along the top, +53 L, then lit to a horizon about 45 % down, near black at the foot; white plates lit
// across the middle, L 98 at 45-55 %, 80-85 at the top and foot; the red plate the same glass top as the dark ones)
const H = P(32), RIM = 4, PH = H - 2 * RIM, LEAN = 25, SEAM = 0, RAD = 4;
const MARK = P(101), TEAM = P(128), SC = P(66), NOTE = P(137), CK = P(146);
const SHIFT = Math.round(H * Math.tan(LEAN * Math.PI / 180));
const W = SHIFT + MARK + 2 * (TEAM + SC) + CK + 2 * RIM + P(2);
// loop pass 1: the white plates are lighter on air, L 96-98 over the top and 81-85 at the
// foot (ours read 86 and 73)
const WHITE = 'linear-gradient(#eef1ea, #f3f7f1 15%, #f6fbf8 38%, #f8fdfb 50%, #eef4f0 62%, #d6ddd6 80%, #c4ccc3)';
const BLACK = 'linear-gradient(#b8bcc6, #6a7078 8%, #4f565e 22%, #3c4647 44%, #1d2929 55%, #0b1718 78%, #081318)';
const RED = 'linear-gradient(#ec98a0, #c0222e 9%, #b0101c 24%, #9a0715 44%, #6e0004 62%, #3e0003)';
// the metallic rim: light at the top, a dark band under the middle, a lighter foot (lit from the top, like the still's silver line)
const METAL = 'linear-gradient(#f4f6f7, #c9ced2 22%, #8d969d 48%, #6c757c 62%, #aab2b8 82%, #dde2e5)';

// the CFL's logos come from the league feed; the kit draws ESPN's only for now, so this
// bug loads the feed's own address itself and keeps the letters badge if it fails
const feedLogo = (t, px) => {
  const im = logo(t, px);
  if (/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(t.logo || '')) setSrc(im, t.logo, () => { im.src = badge(t); });
  return im;
};

export default {
  id: 'cfl-tsn-14',
  size: { w: W + NOTE + SEAM, h: H },
  // the note plate only while a team has the ball (it carries the down); otherwise the row closes up
  sizeFor: (g) => ({ w: W + (g.status === 'live' && g.football && g.football.short ? NOTE + SEAM : 0), h: H }),
  fonts: [FONTS.roboto],
  css: `
.sb-cfl-tsn-14 { font-family: 'SB Roboto', Arial, sans-serif; font-weight: 700; color: #111; }
.sb-cfl-tsn-14 .row { position: absolute; left: ${Math.round(SHIFT / 2) + 1}px; top: 0; height: ${PH}px; padding: ${RIM}px; display: flex; gap: ${SEAM}px;
  transform: skewX(-${LEAN}deg); background: ${METAL}; border-radius: ${RAD + 2}px; box-shadow: 0 1px 3px rgba(0,0,0,.45); }
/* the plates lean with the row (the row is slanted as one); their contents stand upright */
.sb-cfl-tsn-14 .pl { height: ${PH}px; display: flex; align-items: center; justify-content: center; border-radius: ${RAD}px; box-shadow: inset 0 -1px 0 rgba(0,0,0,.35); }
.sb-cfl-tsn-14 .pl > * { transform: skewX(${LEAN}deg); }
.sb-cfl-tsn-14 .mk { width: ${MARK}px; background: ${RED}; }
.sb-cfl-tsn-14 .mk .sb-ha { color: #fff4e5; }
.sb-cfl-tsn-14 .tm { width: ${TEAM}px; background: ${WHITE}; justify-content: flex-start; padding-left: ${P(6)}px; box-sizing: border-box; gap: ${P(3)}px; }
.sb-cfl-tsn-14 .tm .sb-logo { width: ${P(44)}px; height: ${P(27)}px; object-fit: contain; flex: 0 0 auto; }
.sb-cfl-tsn-14 .tm .ab { flex: 1 1 auto; text-align: center; font-size: ${P(15.5 / 0.711)}px; line-height: 1; letter-spacing: 0; padding-right: ${P(6)}px; }
.sb-cfl-tsn-14 .sc { width: ${SC}px; background: ${BLACK}; color: #f2f3f5; font-size: ${P(17 / 0.711)}px; line-height: 1; min-width: 0 !important; }
.sb-cfl-tsn-14 .nt { width: ${NOTE}px; background: ${WHITE}; color: #a00915; font-size: ${P(14 / 0.711)}px; line-height: 1; white-space: nowrap; }
.sb-cfl-tsn-14 .ck { width: ${CK}px; background: ${BLACK}; color: #eef0f2; font-size: ${P(14 / 0.711)}px; line-height: 1; white-space: nowrap; }
.sb-cfl-tsn-14 .ck > span { display: flex; gap: ${P(12)}px; align-items: baseline; }
.sb-cfl-tsn-14 .ck .sb-ord { font-size: .7em; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    const row = el('div', 'row');
    const m = el('div', 'pl mk');
    m.appendChild(mk.ha ? haMark(P(20)) : el('span'));
    row.appendChild(m);
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'pl tm');
      tm.append(feedLogo(t, P(44)), el('span', 'ab', abbr3(t)));
      const sc = el('div', 'pl sc');
      sc.appendChild(scoreSlot(el('span', 'n', !pre && t.score != null ? String(t.score) : ''), g));
      row.append(tm, sc);
    });
    const f = g.football;
    if (live && f && f.short) {
      const nt = el('div', 'pl nt');
      nt.appendChild(el('span', '', /goal/i.test(f.text) ? f.short.replace(/&\s*\S+$/, '& GOAL') : f.short));
      row.appendChild(nt);
    }
    const ck = el('div', 'pl ck');
    const s = el('span');
    if (live) s.append(ordinal(g.period, 'pd'), el('span', '', g.clock || ''));
    else s.appendChild(el('span', 'w', statusText(g, time)));
    ck.appendChild(s);
    row.appendChild(ck);
    root.appendChild(row);
  },
};
