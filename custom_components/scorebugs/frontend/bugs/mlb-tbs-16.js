// "Thin strip '16": after TBS's MLB bug (2016). A dark strip across the bottom: the network's letters at the left (here the Home
// Assistant logo), each team's logo on a cell of its colour with its score on a light grey cell, then the bases as yellow diamonds, the
// half inning as a small arrow over the number, and the outs as yellow dots.
import { el, otherSport, logo, bases, statusText, teamColor, shade, haMark, marks, scoreSlot, FONTS } from '../kit.js';

// the team and score cells fill the strip's height, as on air (3 px of strip above and below); logo cells 1.3 times as wide as tall,
// score cells about square, the bases-inning-outs end about three times the strip's height (frame: 135 / 100 / 310 px on a 105 px strip)
const W = 951, H = 112, MARK = 150, LOGO_W = 137, SCORE = 100;
const SCORE_PX = 58, INN_PX = 34;

export default {
  id: 'mlb-tbs-16',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the light score cells go (the kit's logo in them doubled the team's logo cell) and the strip closes up
  sizeFor: (g) => ({ w: W, h: H }),  // before the game the score tiles hold the records
  fonts: [FONTS.roboto],
  css: `
.sb-mlb-tbs-16 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 600; color: #fff; }
.sb-mlb-tbs-16 { font-weight: 500; font-stretch: 100%; }   /* face: Roboto 500 (low confidence) */
.sb-mlb-tbs-16 .bar { position: absolute; inset: 0; display: flex; align-items: stretch; padding: 3px 14px 3px 0; box-sizing: border-box; background: linear-gradient(#2b2e33, #101113); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-tbs-16 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; } .sb-mlb-tbs-16 .mk .sb-ha { color: #d9dbde; }
.sb-mlb-tbs-16 .lg { width: ${LOGO_W}px; flex: none; display: grid; place-items: center; } .sb-mlb-tbs-16 .lg .sb-logo { width: 94px; height: 94px; object-fit: contain; }
.sb-mlb-tbs-16 .sc { width: ${SCORE}px; flex: none; display: grid; place-items: center; background: linear-gradient(#f4f5f6, #c9ccd0); color: #111; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-mlb-tbs-16 .st { flex: 1; display: flex; align-items: center; justify-content: space-evenly; }
.sb-mlb-tbs-16 .dm { position: relative; width: 92px; height: 92px; display: grid; place-items: center; }   /* the bases sit on a dark diamond with a grey rim, as on air */
.sb-mlb-tbs-16 .dm::before { content: ''; position: absolute; inset: 10px; transform: rotate(45deg); border: 2px solid #5d6066; border-radius: 3px; background: #121315; }
/* bases sized and placed to the frame: each about a quarter of the diamond's height, second base near its top point, first and third at its widest */
/* each base at its own corner of the badge, home a small white plate at the foot, as the frame */
.sb-mlb-tbs-16 .dm .bz { position: absolute; width: 22px; height: 22px; margin: -11px 0 0 -11px; transform: rotate(45deg); box-sizing: border-box; background: #1a1b1e; border: 2px solid #6a6c70; }
.sb-mlb-tbs-16 .dm .bz.on { background: #f2c230; border-color: #f2c230; } .sb-mlb-tbs-16 .dm .bz.hp { width: 12px; height: 12px; margin: -6px 0 0 -6px; background: #f2f2f2; border: 0; }
.sb-mlb-tbs-16 .sb-bases i { background: #1a1b1e; border: 2px solid #6a6c70; } .sb-mlb-tbs-16 .sb-bases i.on { background: #f2c230; border-color: #f2c230; }
.sb-mlb-tbs-16 .inn { display: grid; justify-items: center; font-size: ${INN_PX}px; line-height: .9; } .sb-mlb-tbs-16 .inn b { font-size: .5em; color: #f2c230; } .sb-mlb-tbs-16 .inn b.off { color: #55575c; }
.sb-mlb-tbs-16 .outs { display: flex; gap: 8px; } /* out dots a quarter of the strip's height, as on air (were a sixth) */
.sb-mlb-tbs-16 .outs i { width: 24px; height: 24px; border-radius: 50%; background: #55575c; } .sb-mlb-tbs-16 .outs i.on { background: #f2c230; }
.sb-mlb-tbs-16 .w { font-size: ${INN_PX * 0.85}px; }
.sb-mlb-tbs-16 .dm .dt { position: relative; font-size: 18px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 6);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(60));
    bar.appendChild(mk);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const lg = el('div', 'lg'); lg.style.background = 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.25) + ')'; lg.appendChild(logo(t, 94));
      bar.appendChild(lg);
      bar.appendChild(g.status === 'pre' ? scoreSlot(el('span', 'sc', ''), g) /* empty before the game: the kit puts the record in and sizes it to the box */ : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
    });
    const st = el('div', 'st');
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', b.half === 'top' ? '' : 'off', '▲'), el('span', '', g.period.label || ''), el('b', b.half === 'bot' ? '' : 'off', '▼'));
      const outs = el('span', 'outs'); for (let i = 0; i < 3; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      // the badge is a 72 px square turned on its point, centred at (46, 46): its corners 51 px out. Each base sits inside its corner, not on it:
      // on air a base's outer point stands about a sixth of the way in from the corner (3 of 18 px), so 27 px out from the centre here
      const dm = el('span', 'dm');
      [[1, 46, 19], [2, 19, 46], [0, 73, 46]].forEach(([k, x, y]) => { const z = el('i', 'bz' + (b.bases[k] ? ' on' : '')); z.style.left = x + 'px'; z.style.top = y + 'px'; dm.appendChild(z); });
      const hp = el('i', 'bz hp'); hp.style.left = '46px'; hp.style.top = '74px'; dm.appendChild(hp);
      st.append(dm, inn, outs);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const dm = el('span', 'dm'); if (os.detail) dm.appendChild(el('span', 'dt', os.detail));
      st.append(dm, el('span', 'inn', os.period), el('span', 'inn', os.clock));
    } else st.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(st);
    root.appendChild(bar);
  },
};
