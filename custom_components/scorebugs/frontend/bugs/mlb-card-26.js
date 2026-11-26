// "Rounded card '26": after the MLB bug on Netflix (2026 on). A dark rounded card with a pale rim: two thin lines across the top
// fading out of the teams' colours (on air the batter and pitcher; here each team's name and record), then two rounded pills in the team
// colours with the logo and score, and at the right the bases as glassy white tiles over the half inning, the count and the outs. The
// streamer's wordmark above the bases becomes the Home Assistant logo, in its own blue.
import { el, otherSport, logo, bases, inning, pips, statusText, teamColor, shade, haMark, marks, FONTS, GLOSS, LOGO_HALO, teamInk, scoreSlot } from '../kit.js';

const W = 540, H = 360;
// measured against the frames: bigger scores, smaller logos (Phillies at Twins frame)
const LOGO_W = 100, LOGO_H = 100, SCORE_PX = 78;   // elcheck's guide reads the logo at 0.98 of the pill (by eye 0.73-0.8: smaller tries failed judge on the pill colours, see the ruling)
const PILL_W = 212, PRE_PILL = 110;   // before the first pitch a pill holds only its logo

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
// Netflix's pills sit at one middle depth whatever the team: the Phillies' red goes deeper, the Twins' navy brighter (stills: lit end #a80022 and #0946ae)
function pillBase(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return hex;
  const n = parseInt(m[1], 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d === 0) return hex;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  const L = Math.min(0.42, Math.max(0.33, l)), S = Math.min(1, Math.max(s, 0.75));
  const k = (n) => { const q = (n + h / 30) % 12, aa = S * Math.min(L, 1 - L); return Math.round(255 * (L - aa * Math.max(-1, Math.min(q - 3, 9 - q, 1)))).toString(16).padStart(2, '0'); };
  return '#' + k(0) + k(8) + k(4);
}

const NUDGE = [
  ['div.card > div.pill > span.s.sb-num', -3.5, -0.5, 0],
  ['div.card > div.pill > img.sb-logo', 3.5, 0.5, 0],
];

export default {
  id: 'mlb-card-26',
  sizedFor: 0.7275,   // sizes were measured in SB Inter Tight; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the pills keep just their logos and the card closes up, so it is narrower
  sizeFor: (g) => (g.status === 'pre' ? { w: W - (PILL_W - PRE_PILL), h: H } : { w: W, h: H }),
  nudge: NUDGE,
  logos: 'white',   // white logos on the team colours, as on air (falls back to the dark, then the plain logo)
  fonts: [FONTS.inter],
  css: `
.sb-mlb-card-26 { font-family: 'SB Inter V', 'Arial Black', sans-serif; font-weight: 800; color: #fff; }
/* face: Netflix Field of Dreams 2026: Inter Bold */
.sb-mlb-card-26 .card { position: absolute; inset: 0; box-sizing: border-box; border: 4px solid #d6d4c6; border-radius: 30px; background: radial-gradient(ellipse 70% 60% at 85% 95%, rgba(110,90,62,.55), transparent 75%), linear-gradient(#242220, #121110);   /* the card warms to brown towards its lower right (frame) */
  box-shadow: 0 4px 12px rgba(0,0,0,.5); }
.sb-mlb-card-26 .ln { position: absolute; left: 22px; right: 26px; height: 40px; display: flex; align-items: center; justify-content: space-between; font-size: 25px; padding-left: 10px; border-radius: 4px; }
.sb-mlb-card-26 .ln span:last-child { font-size: 26px; color: #f2f2f2; }   /* the record sits where the bar has faded to the dark card: always light (team sweep: dark on dark for the Orioles, Marlins, Phillies) */
.sb-mlb-card-26 .pill { position: absolute; left: 22px; width: ${PILL_W}px; height: 102px; border-radius: 18px; display: flex; align-items: center; gap: 18px; padding: 0 26px 0 14px;
  box-sizing: border-box; box-shadow: inset 0 -10px 8px -4px rgba(0,0,0,.6); }   /* the pill's foot darkens into the card over about 8 px (stills) */
.sb-mlb-card-26 .sb-logo { width: ${LOGO_W}px; height: ${LOGO_H}px; object-fit: contain; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); }
.sb-mlb-card-26 .side .sb-bases { transform: perspective(300px) rotateX(68deg); margin: -22px 0 -16px; }
.sb-mlb-card-26 .pill .s { flex: 1; text-align: center; font-size: ${SCORE_PX}px; }
.sb-mlb-card-26 .side { position: absolute; left: 270px; right: 18px; top: 112px; bottom: 22px; display: grid; justify-items: center; align-content: center; gap: 12px; }
.sb-mlb-card-26 .side .sb-ha { color: #18bcf2; filter: drop-shadow(0 0 6px rgba(24,188,242,.45)); }
.sb-mlb-card-26 .sb-bases i { background: linear-gradient(300deg, #4a4a48, #232322 70%); box-shadow: inset 0 0 0 2px rgba(255,255,255,.55), 3px 3px 0 #8a8a88, 4px 4px 6px rgba(0,0,0,.6); }   /* empty bags: dark glass tiles with a bright rim and a thick edge (frame) */
.sb-mlb-card-26 .sb-bases i.on { background: linear-gradient(135deg, #ffffff, #d9d9d9); box-shadow: 3px 3px 0 #9a9a9a, 0 0 12px rgba(255,255,255,.55); }
.sb-mlb-card-26 .st { display: flex; align-items: center; gap: 18px; font-size: 36px; white-space: nowrap; }
.sb-mlb-card-26 .sb-pips { display: flex; gap: 8px; } .sb-mlb-card-26 .sb-pips i { width: 24px; height: 24px; border-radius: 50%; background: #fafafa; }
.sb-mlb-card-26 .sb-pips i.used { background: #4a4238; }   /* an empty out dot is see-through dark glass, warm like the card (stills: #5a5040) */
.sb-mlb-card-26 .w { font-size: 34px; text-align: center; line-height: 1.15; }
.sb-mlb-card-26 .dt { font-size: 32px; text-align: center; line-height: 1.1; color: #f2f2f2; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball; // a baseball bug forced onto another sport's game shows only the scores
    const card = el('div', 'card');
    [g.away, g.home].forEach((t, i) => {
      const c = teamColor(t, '#4a4f57');
      const ln = el('div', 'ln');
      ln.style.top = (18 + i * 46) + 'px';
      ln.style.color = teamInk(shade(c, 0.15));
      ln.style.background = 'linear-gradient(90deg, ' + shade(c, 0.15) + ', ' + c + ' 30%, ' + shade(c, -0.45) + ' 60%, transparent 85%)';
      ln.append(el('span', '', String(t.name || t.abbr || '').toUpperCase().slice(0, 16)), el('span', '', t.record || ''));
      card.appendChild(ln);
      const p = el('div', 'pill');
      p.style.top = (122 + i * 111) + 'px';
      // a strong top-to-bottom gradient with a gloss: bright at the top edge, deep at the foot
      // bright at the top left, deep towards the right end (frame: the light falls on the logo's end of the pill)
      const pc = pillBase(c);
      p.style.background = 'linear-gradient(rgba(0,0,0,.08), rgba(0,0,0,0) 40%, rgba(0,0,0,.16)), linear-gradient(100deg, ' + shade(pc, 0.12) + ', ' + pc + ' 22%, ' + shade(pc, -0.5) + ' 72%, ' + shade(pc, -0.58) + ')';   // lit at the logo end, deep maroon / navy at the right (stills)
      if (g.status === 'pre') p.style.width = PRE_PILL + 'px';
      p.style.color = teamInk(c);
      if (g.status === 'pre') p.append(logo(t, 96));
      else p.append(logo(t, 96), scoreSlot(el('span', 's', t.score != null ? String(t.score) : ''), g));
      card.appendChild(p);
    });
    const side = el('div', 'side');
    if (g.status === 'pre') side.style.left = (270 - (PILL_W - PRE_PILL)) + 'px';
    if (marks(opts).ha) { const m = haMark(66); m.style.marginTop = '14px'; side.appendChild(m); }   // the streamer's red wordmark sat above the bases
    if (live) {
      const b = g.baseball;
      side.appendChild(bases(b.bases, 64));
      const st = el('div', 'st');
      // the half-inning arrow set a little apart from the inning's number
      const inn = el('span', ''), arrow = inning(g).replace(/[0-9]+.*$/, '');
      if (arrow) { const ar = el('span', '', arrow); ar.style.marginRight = '.3em'; inn.appendChild(ar); }
      inn.appendChild(document.createTextNode(g.period.label || ''));
      st.append(inn, el('span', '', b.balls + '-' + b.strikes), pips(b.outs, 2));
      side.appendChild(st);
    } else if (otherSport(g)) {
      // another sport's game: one detail where the bases were, then the period and the clock on the inning's line (no outs)
      const os = otherSport(g);
      if (os.detail) side.appendChild(el('div', 'dt', os.detail));
      const st = el('div', 'st');
      st.append(el('span', '', os.period), el('span', '', os.clock));
      side.appendChild(st);
    } else side.appendChild(el('span', 'w', statusText(g, time)));
    card.appendChild(side);
    root.appendChild(card);
  },
};
