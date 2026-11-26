// "Disc bar '12": after CBS's NFL bug (about 2012). A
// round dark disc with a blue rim at the left holds the network's mark (here the Home Assistant logo); then a glossy navy bar with rounded
// blue ends: each team a block in its colour with its logo big and cut at the left and its letters in its second colour, three gold
// timeout lines under it, and its score in its colour on a white plate; then the down and distance on a teal panel, and the quarter and
// the clock on navy blocks.
import { el, logo, statusText, haMark, marks, scoreSlot, teamPair, shade, contrast, fit, sheen, FONTS } from '../kit.js';

const H = 96, BAR = 64, DISC = 96, TEAM = 230, SCORE = 76, DOWN = 270, Q = 130, CLOCK = 150;
// the bar's own padding (34 + 26), its six 6 px gaps and every block: the old sum was 36 px short, so the clock box ran out over the rounded end
const W = DISC - 24 + 60 + 2 * (TEAM + SCORE) + DOWN + Q + CLOCK + 36;

export default {
  id: 'nfl-cbs-12',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: g.status === 'live' && g.football && g.football.short ? W : W - DOWN - 6, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-cbs-12 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 96%; color: #fff; }
.sb-nfl-cbs-12 .bar { position: absolute; left: ${DISC - 24}px; right: 0; top: ${(H - BAR) / 2}px; height: ${BAR}px; display: flex; align-items: stretch; gap: 6px; padding: 5px 26px 5px 34px; box-sizing: border-box;
  border-radius: 10px ${BAR / 2}px ${BAR / 2}px 10px; background: linear-gradient(#2f5fb8, #0f2f7a 40%, #071a4f 60%, #12357e);
  box-shadow: 0 3px 7px rgba(0,0,0,.5), inset -6px 0 0 #2b7de0, inset 0 1px 0 rgba(255,255,255,.35); }
.sb-nfl-cbs-12 .disc { position: absolute; left: 0; top: 0; width: ${DISC}px; height: ${DISC}px; border-radius: 50%; z-index: 2; display: grid; place-items: center;
  /* a glossy sphere, blue over black, as on the frame; ours was a dark grey radial (#171a22,
 4.3x off) */
  background: radial-gradient(ellipse 60% 34% at 50% 26%, rgba(110,150,235,.45), rgba(110,150,235,0)), linear-gradient(#1c3ca3, #033196 30%, #01297e 46%, #000418 52%, #000105 74%, #000000);
  box-shadow: 0 0 0 5px #1d63d6, 0 0 0 8px #0a2c78, 0 4px 9px rgba(0,0,0,.6), inset 0 3px 5px rgba(255,255,255,.3); }
.sb-nfl-cbs-12 .disc .sb-ha { color: #fff; }
.sb-nfl-cbs-12 .tm { width: ${TEAM}px; flex: none; position: relative; display: flex; align-items: center; overflow: hidden; }
.sb-nfl-cbs-12 .tm .lw { width: 96px; align-self: stretch; flex: none; position: relative; overflow: hidden; box-shadow: inset -2px 0 0 rgba(0,0,0,.35), 1px 0 0 rgba(255,255,255,.18); }   /* the logo on its own tile, with an edge before the panel (measured) */
.sb-nfl-cbs-12 .tm .lw .sb-logo { position: absolute; left: -8px; top: 50%; width: 90px; height: 90px; margin-top: -45px; object-fit: contain; }
.sb-nfl-cbs-12 .tm .ab { flex: 1; min-width: 0; text-align: center; font-size: 36px; white-space: nowrap; }
.sb-nfl-cbs-12 .tm .to { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; display: flex; gap: 22px; padding: 0 2px; }
.sb-nfl-cbs-12 .tm .to i { flex: 1; background: #f3c316; } .sb-nfl-cbs-12 .tm .to i.used { opacity: 0; }
.sb-nfl-cbs-12 .sc { width: ${SCORE}px; flex: none; display: grid; place-items: center; background: linear-gradient(#ffffff, #e4e6ea 55%, #c9ccd2); font-size: 38px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.25); }
/* a long record (10-14-1) never breaks at its dashes */
.sb-nfl-cbs-12 .sc.rec { font-size: 20px; white-space: nowrap; }
.sb-nfl-cbs-12 .dn { width: ${DOWN}px; flex: none; display: grid; place-items: center; font-size: 34px; background: ${sheen(50, 0.16)}, linear-gradient(#1f7fa6, #1a77a0); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }   /* a soft sheen band */
/* the down, quarter and clock parted by bright blue lines, as on the frame (#005bb4, about 5 of its 1640 px, before the quarter and before
   the clock: 5 px of the 6 px gap); ours showed the bar's dark navy in the gaps (outline 1 px against the frame's 5) */
.sb-nfl-cbs-12 .q, .sb-nfl-cbs-12 .ck { flex: none; display: grid; place-items: center; font-size: 36px; background: linear-gradient(#1b3f8e, #0a2264 55%, #10307a); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18), -5px 0 0 0 #005bb4; }
/* the clock box ends in a curve inside the bar's rounded end, never over its rim */
.sb-nfl-cbs-12 .ck, .sb-nfl-cbs-12 .w { border-radius: 0 22px 22px 0; }
.sb-nfl-cbs-12 .q { width: ${Q}px; } .sb-nfl-cbs-12 .ck { width: ${CLOCK}px; }
.sb-nfl-cbs-12 .w { width: ${Q + CLOCK + 6}px; flex: none; display: grid; place-items: center; font-size: 28px; background: linear-gradient(#1b3f8e, #0a2264 55%, #10307a); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const bar = el('div', 'bar');
    [g.away, g.home].forEach((t, k) => {
      const c = pair[k];
      const p = el('div', 'tm');
      // lighter towards the foot, but only a little (the foot was +0.3, now +0.14)
      p.style.background = 'linear-gradient(' + shade(c, -0.05) + ', ' + c + ' 55%, ' + shade(c, 0.14) + ')';
      // the letters in the team's second colour when it reads on the block (MIN gold on purple), else white
      // on a dark block (navy, black) the second colour must reach 3:1, as big bold letters need: a red on navy at 2.9 was lost; then white. Every NFL team keeps its letters as before
      const need = contrast('#ffffff', c) >= 7 ? 3.2 : 3;
      const c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') && t.color2.toLowerCase() !== c.toLowerCase() && contrast(t.color2, c) >= need ? t.color2 : '#fff';
      const lw = el('span', 'lw'); lw.appendChild(logo(t, 90));
      const ab = fit(el('span', 'ab', (t.abbr || '').toUpperCase())); ab.style.color = c2; ab.style.textShadow = '0 1px 2px rgba(0,0,0,.6), 0 0 1px rgba(0,0,0,.5)';
      p.append(lw, ab);
      if (live && t.timeouts != null) { const to = el('span', 'to'); for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : '')); p.appendChild(to); }
      const sc = g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      sc.style.color = contrast(c, '#ffffff') >= 2.6 ? c : '#111';
      bar.append(p, sc);
    });
    if (live) {
      if (g.football && g.football.short) bar.appendChild(el('span', 'dn', g.football.short));
      bar.append(el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toUpperCase()), el('span', 'ck', g.clock || ''));
    } else bar.appendChild(el('span', 'w', statusText(g, time)));
    const disc = el('div', 'disc'); if (marks(opts).ha) disc.appendChild(haMark(52));
    root.append(bar, disc);
  },
};
