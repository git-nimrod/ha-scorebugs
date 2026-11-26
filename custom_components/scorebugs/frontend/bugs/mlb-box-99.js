// "Diamond box '99": after the MLB score box on FOX (1998 playoffs to 2000). A small see-through slate box with a light grey edge in the top
// corner: a top line of grey plates with the half inning (the network's plate at its left now holds the Home Assistant logo), a big diamond of white bases at the left, the
// two teams' letters and scores in bold condensed type at the right, and a bottom line with the count and outs (on air, often the pitch
// speed). Drawn soft, with scanlines, the way it looked on a 1999 TV (bug_tv: clean turns that off).
import { el, otherSport, bases, statusText, haMark, marks, FONTS, GLOSS, LOGO_HALO, fit, BEVEL } from '../kit.js';

const W = 330, H = 218;

// the team letters' width to the frame's
const LETTERS = { stretch: 101 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.bx > div.r > span.s', 2, 0.5, 0],
  ['div.bx > div.r > span', -1.5, -0.5, 0],
];

export default {
  id: 'mlb-box-99',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -32% vs the broadcast; 80 % of the correction
  typeScale: 1.2,
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-box-99 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 76%; color: #f4f4f0; }
.sb-mlb-box-99 { font-weight: 800; font-stretch: 85%; }   /* face: Archivo 800 at 85% width (low confidence) */
.sb-mlb-box-99 .bx { position: absolute; inset: 0; background: #000; border: 3px solid #b9bbbf; border-radius: 3px; box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-mlb-box-99 .t { position: absolute; left: 6px; right: 6px; top: 6px; height: 40px; display: flex; gap: 6px; font-size: 34px; letter-spacing: 1px; }
.sb-mlb-box-99 .t > span { display: grid; place-items: center; border-radius: 2px; line-height: 1; padding-bottom: 3px; box-sizing: border-box; }
.sb-mlb-box-99 .t .slot { width: 70px; background: linear-gradient(#e6e7e9, #a9acb1); color: #26282d; }
.sb-mlb-box-99 .t .arr { width: 40px; background: #26282d; font-size: 22px; box-shadow: inset 0 0 0 2px #8d9094; }
.sb-mlb-box-99 .t .inn { flex: 1; padding-right: 46px; background: linear-gradient(#e6e7e9, #a9acb1); color: #26282d; }
.sb-mlb-box-99 .dia { position: absolute; left: 6px; top: 54px; padding: 4px 3px; border-radius: 3px; background: linear-gradient(#ffffff, #dfe1e4 55%, #a9acb1); box-shadow: ${BEVEL}; }   /* a white bevelled tile (surface pass, frame) */
.sb-mlb-box-99 .sb-bases i { background: linear-gradient(135deg, #3a3c42, #0d0e11); border: 3px solid #5c5f66; } .sb-mlb-box-99 .sb-bases i.on { background: #f7f7f2; border-color: #26282d; }
.sb-mlb-box-99 .r { position: absolute; left: 132px; right: 10px; display: flex; justify-content: space-between; font-size: 54px; line-height: 54px; letter-spacing: 1px; text-shadow: 2px 2px 0 #000; }
.sb-mlb-box-99 .r .s { padding: 0 6px; min-width: 40px; text-align: right; }
.sb-mlb-box-99 .b { position: absolute; left: 6px; right: 6px; bottom: 6px; height: 40px; display: flex; align-items: center; justify-content: center; gap: 26px;
  background: #000; font-size: 34px; letter-spacing: 1px; text-shadow: 2px 2px 0 #000; }
.sb-mlb-box-99 .r > span:first-child { font-stretch: ${LETTERS.stretch}%; }
/* before the game the record takes the score's place: the letters keep a 6 px gap from it and squeeze to fit (stress, Nov 25: MIN ran
   into 12-7) */
.sb-mlb-box-99 .r:has(.sb-pre-rec) { gap: 6px; } .sb-mlb-box-99 .r:has(.sb-pre-rec) > span:first-child { display: block; min-width: 0; flex: 1 1 auto; }
.sb-mlb-box-99 .dia.dt { width: 117px; height: 89px; box-sizing: border-box; padding: 0 6px; display: grid; place-items: center; text-align: center; color: #26282d; font-size: 24px; line-height: 1.05; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball; // a baseball bug forced onto another sport's game shows only the scores
    const mk = marks(opts);
    const bx = el('div', 'bx');
    const t = el('div', 't');
    // the network's grey box at the left now holds the Home Assistant logo
    const slot = el('span', 'slot');
    if (mk.ha) slot.appendChild(haMark(32));
    t.appendChild(slot);
    const half = live && g.baseball.half;
    if (live) t.appendChild(el('span', 'arr', half === 'top' ? '▲' : half === 'bot' ? '▼' : '•'));
    const os = otherSport(g, 6);
    t.appendChild(el('span', 'inn', live ? g.period.label + (g.period.suffix || '') : os ? os.period : statusText(g, time)));
    bx.appendChild(t);
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (!os) { const dia = el('div', 'dia'); dia.appendChild(bases(live ? g.baseball.bases : null, 36)); bx.appendChild(dia); }
    else if (os.detail) bx.appendChild(el('div', 'dia dt', os.detail));
    [g.away, g.home].forEach((tm, i) => {
      const r = el('div', 'r');
      r.style.top = (54 + i * 56) + 'px';
      r.append(fit(el('span', '', (tm.abbr || '').toUpperCase().slice(0, 3))), el('span', 's', g.status !== 'pre' && tm.score != null ? String(tm.score) : ''));
      bx.appendChild(r);
    });
    const b = el('div', 'b');
    if (live) b.append(el('span', '', g.baseball.balls + '-' + g.baseball.strikes), el('span', '', g.baseball.outs + ' OUT'));
    else if (os) b.appendChild(el('span', '', os.clock));
    bx.appendChild(b);
    root.appendChild(bx);
  },
};
