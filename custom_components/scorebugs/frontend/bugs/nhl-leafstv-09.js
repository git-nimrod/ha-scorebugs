// "Night strip '09": after Leafs TV's score strip (late 2000s). One long near-black strip, faintly navy and
// lighter towards the right: the channel's mark at the left (here the Home Assistant logo), the away team's letters, both scores on
// small silver plates leaning forward with dark figures, the home team's letters, then far to the right the clock and the period in
// lighter grey. No team colours and no logos on air.
// measured (crop px of 559 x 19): mark 30-110, away letters 143-185, plates 200-227 and 233-265 (14 tall, lean about 15 deg), home
// letters 285-323, clock 445-492, period 500-525; capitals 0.58 of the strip's height; period letters lighter and grey.
import { el, statusText, haMark, marks, scoreSlot, fit, FONTS } from '../kit.js';

const K = 2.5, W = Math.round(559 * K), H = Math.round(19 * K);
const CAP = 0.58 * H, PX = Math.round(CAP / 0.7);

export default {
  id: 'nhl-leafstv-09',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-nhl-leafstv-09 { font-family: 'SB Montserrat', 'Arial', sans-serif; font-weight: 800; color: #e9e9ec; }
/* the strip: near black, a little navy, a faint lighter streak towards the right (measured #02010d at the left, #0c0b1a at 85%) */
.sb-nhl-leafstv-09 .bar { position: absolute; inset: 0; background: linear-gradient(90deg, #02010d, #03021a 55%, #0d0f2c 78%, #090a22 88%, #01000a),
  linear-gradient(rgba(255,255,255,.05), rgba(0,0,0,0) 50%, rgba(0,0,0,.25)); background-blend-mode: screen; }
.sb-nhl-leafstv-09 .mk { position: absolute; left: ${30 * K}px; width: ${80 * K}px; top: 0; height: ${H}px; display: grid; place-items: center; }
.sb-nhl-leafstv-09 .mk .sb-ha { color: #b7c1d6; }
.sb-nhl-leafstv-09 .ab { position: absolute; top: 0; height: ${H}px; display: flex; align-items: center; justify-content: center; font-size: ${PX}px; line-height: 1; white-space: nowrap; }
.sb-nhl-leafstv-09 .a { left: ${136 * K}px; width: ${56 * K}px; } .sb-nhl-leafstv-09 .h { left: ${278 * K}px; width: ${52 * K}px; }
/* the score plates: silver, leaning forward, dark figures */
.sb-nhl-leafstv-09 .pl { position: absolute; top: ${2.5 * K}px; height: ${14 * K}px; transform: skewX(-15deg); display: grid; place-items: center;
  background: linear-gradient(#fbfbfb, #d9d9db 45%, #a9a9ad 55%, #c9c9cc); box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 1px 2px rgba(0,0,0,.6); }
.sb-nhl-leafstv-09 .pl > span { transform: skewX(15deg); color: #161616; font-size: ${PX * 0.92}px; line-height: 1; max-width: 80%; }
/* a record or a three-figure score keeps clear of the plate's leaning ends */
.sb-nhl-leafstv-09 .pl > span.n3 { font-size: ${PX * 0.72}px; }
.sb-nhl-leafstv-09 .p1 { left: ${200 * K}px; width: ${28 * K}px; } .sb-nhl-leafstv-09 .p2 { left: ${233 * K}px; width: ${32 * K}px; }
.sb-nhl-leafstv-09 .ck { position: absolute; left: ${436 * K}px; width: ${62 * K}px; top: 0; height: ${H}px; display: flex; align-items: center; justify-content: center; font-size: ${PX}px; white-space: nowrap; }
.sb-nhl-leafstv-09 .pd { position: absolute; left: ${498 * K}px; width: ${48 * K}px; top: 0; height: ${H}px; display: flex; align-items: center; justify-content: center; font-size: ${PX * 0.92}px;
  font-weight: 600; color: #9b9ba8; white-space: nowrap; }
.sb-nhl-leafstv-09 .w { left: ${400 * K}px; width: ${146 * K}px; font-size: ${PX * 0.8}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    root.appendChild(el('div', 'bar'));
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(Math.round(H * 0.8))); root.appendChild(mk);
    root.appendChild(fit(el('div', 'ab a', (g.away.abbr || '').toUpperCase())));
    root.appendChild(fit(el('div', 'ab h', (g.home.abbr || '').toUpperCase())));
    [[g.away, 'p1'], [g.home, 'p2']].forEach(([t, c]) => {
      const p = el('div', 'pl ' + c);
      const v = g.status === 'pre' ? '' : t.score != null ? String(t.score) : '';
      p.appendChild(scoreSlot(el('span', v.length > 2 ? 'n3' : '', v), g));
      root.appendChild(p);
    });
    if (live) {
      root.appendChild(el('div', 'ck', g.clock || ''));
      root.appendChild(el('div', 'pd', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()));
    } else root.appendChild(el('div', 'ck w', statusText(g, time)));
  },
};
