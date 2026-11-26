// "Logo strip '03": after Fox's NFL score strip of the 2003 regular season (a 347 x 19 px strip, rough). A thin see-through strip across the
// bottom, dark olive with a dark rule at its top and foot: each team's small logo and its score in white, the clock in white, the
// quarter in pale yellow, then an empty run of strip to the show's mark at the right end (here the Home Assistant logo). No letters for
// the teams: the logos stand for them. The same network's playoff strip of that winter (letters, a down plate) is Green strip '03.
// measured: the strip body #3e432e between rules #1a1e0b two rows deep; the first
// logo at 4-12% of the width, its score at 16-21%, the second logo at 24-30%, its score at 32-37%, the clock at 42-47%, the quarter at
// 50-55% (#e6e2a0), the mark at 74%; the figures 0.57 of the strip's height (by hand: 8.5 of its 15 rows), heavy and upright.
import { el, logo, statusText, scoreSlot, haMark, marks, teamPair, shade, FONTS } from '../kit.js';

const W = 1280, H = 55, PX = 43, LOGO = 40;
// the dividers' lean (his marks on it measure 19-30 deg from
// upright, 25 used here)
const LEAN = 25;

export default {
  id: 'nfl-foxlogo-03',
  size: { w: W, h: H },
  // the strip ends a little after the show's mark, as on air
  hug: '.st',
  fonts: [FONTS.saira],
  css: `
.sb-nfl-foxlogo-03 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; font-stretch: 100%; color: #fbfcf4; }
/* the strip black and see-through: black at 70 %
 through the body with the page showing, 88 % in the two rules (was a dark olive #3e432e) */
/* the strip starts at the first team's leaning left end:
 its left edge is that slant carried to the strip's top and foot (25 deg: 0 px in at the top, 25.6 at the foot), no strip before it
 (there was 64 px of empty strip); it ends 14 px after the mark ("end it on the right of the HA"; was 70) */
.sb-nfl-foxlogo-03 .st { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 14px 0 13px; box-sizing: border-box;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 25.6px 100%);
  background: linear-gradient(rgba(4,4,5,.88) 0%, rgba(4,4,5,.88) 11%, rgba(10,11,12,.7) 17%, rgba(14,15,16,.68) 50%, rgba(10,11,12,.7) 82%, rgba(4,4,5,.88) 88%, rgba(4,4,5,.88) 100%);
  font-size: ${PX}px; line-height: 1; white-space: nowrap; overflow: hidden; }
.sb-nfl-foxlogo-03 .tm { display: flex; align-items: center; align-self: stretch; gap: 14px; }
.sb-nfl-foxlogo-03 .tm + .tm { margin-left: 0; }
/* the room behind each logo in its team's colour, fading to black before the score, its ends leaning with the dividers; the logo upright */
.sb-nfl-foxlogo-03 .lg { width: 100px; padding: 0 28px 0 12px; margin: 6px 0; align-self: stretch; display: grid; place-items: center; transform: skewX(${LEAN}deg); }
.sb-nfl-foxlogo-03 .lg > * { transform: skewX(-${LEAN}deg); }
/* the logo may run the whole 100 px slot (on air the logos are wide, 8% of the strip each): a wide logo grows, a square one stays 40 */
.sb-nfl-foxlogo-03 .sb-logo { width: 100px; height: ${LOGO}px; object-fit: contain; }
.sb-nfl-foxlogo-03 .sc { text-align: left; }
.sb-nfl-foxlogo-03 .ck { margin-left: 60px; }
.sb-nfl-foxlogo-03 .q { margin-left: 34px; color: #e6e2a0; font-size: ${Math.round(PX * 0.82)}px; }
.sb-nfl-foxlogo-03 .w { margin-left: 60px; font-size: ${Math.round(PX * 0.8)}px; }
/* the mark brought left, a short gap after the last divider (it sat after a 230 px empty run); now inside the bar's height: 38 px, inside the
 strip's body between its two dark rules (6 px each), where it was 80 px and cropped top and foot */
.sb-nfl-foxlogo-03 .sp { width: 26px; }
/* each part parted by a thin light line leaning like a backslash, the strip's full body height, as the ALCS strip */
.sb-nfl-foxlogo-03 .dv { align-self: stretch; flex: none; width: 3px; margin: 8px 16px; background: rgba(214,218,206,.8); transform: skewX(${LEAN}deg); }
.sb-nfl-foxlogo-03 .dv + .ck, .sb-nfl-foxlogo-03 .dv + .q, .sb-nfl-foxlogo-03 .dv + .w, .sb-nfl-foxlogo-03 .dv + .tm { margin-left: 0; }
.sb-nfl-foxlogo-03 .sb-ha { color: #fbfcf4; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    const dv = () => el('i', 'dv');
    const cs = teamPair(g.away, g.home, '#4a5560');
    [g.away, g.home].forEach((t, i) => {
      if (i) st.appendChild(dv());
      const tm = el('span', 'tm');
      const lg = el('span', 'lg'); lg.appendChild(logo(t, LOGO));
      const c = cs[i];
      lg.style.background = 'linear-gradient(rgba(255,255,255,.16), rgba(255,255,255,0) 45%, rgba(0,0,0,.18)), linear-gradient(90deg, ' + shade(c, 0.08) + ', ' + c + ' 45%, ' + shade(c, -0.55) + ' 78%, rgba(6,6,7,.9))';
      tm.append(lg, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      st.appendChild(tm);
    });
    if (live) st.append(dv(), el('span', 'ck', (g.clock || '').replace(/^0:/, ':')), dv(), el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')), dv());
    else st.append(dv(), el('span', 'w', statusText(g, time)), dv());
    // the empty run of strip before the show's mark
    st.appendChild(el('span', 'sp'));
    if (marks(opts).ha) st.appendChild(haMark(38));
    root.appendChild(st);
  },
};
