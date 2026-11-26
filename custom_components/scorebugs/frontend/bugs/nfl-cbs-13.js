// "Dark bar '13": after CBS's Super Bowl XLVII bug (2013). The same layout
// as Blue bar '11 on a charcoal bar: a black round cap at the left (the network's eye there; here the Home Assistant logo), the down and
// distance on a white pill, then each team on a block of its own colour (its logo at the left, a dot before the team with the ball, its
// letters at the right) and its score dark on a silver plate, and the quarter and clock on a navy block at the end. Each team's timeouts
// are yellow dashes above it.
import { el, logo, teamColor, shade, inkOn, statusText, haMark, marks, scoreSlot, fit, pips, FONTS, GLOSS } from '../kit.js';

// the black cap about as wide as the bar is tall; the silver score plates rounded at their right end, as on air
// Curves measured on the frame (its blocks 42 px tall, ours 76): no end is square or a half circle. Each silver score plate
// ends in an arc of radius about 0.6 of its height (22-25 px, bowing 10-12 px), meeting the top and bottom at a corner; the down pill's ends
// are nearly straight, shallow arcs (bowing 4 px over 42: radius 1.2 of the height) with corners rounded over about 8 px, and so are the left ends of the team blocks and of the
// quarter-and-clock block (bowing about 5 px); the clock block's right end bows 8 px over 55 (radius 0.93 of the height). Between the
// blocks a dark gap, narrowest at the middle and opening up towards the top and bottom where two arcs face each other.
// Checked: each team block's right end is an arc too, not a straight cut (frame: the 49ers' red bows 9 px over its 42 px
// height, radius 0.69 of the height, meeting top and bottom at a corner), against the silver plate's nearly straight left edge, so a
// thin dark line (2 px at the middle) opens to about 10 px at the top and bottom.
// the arcing bands between the blocks heavier: 10 px
// (was 6), and 5 px between a team and its own plate (was 3)
// more weight again: on air a band between blocks is about 10 of a block's 45 px (0.22),
// the line between a team and its plate and between the quarter and the clock about 4 (0.09); so 14 px here (was 10) and 7 (was 5)
const PIP = 16, BAR = 84, H = PIP + BAR, CAP = 96, DOWN = 352, TEAM = 268, SC = 98, CLK = 336, GAP = 14, EH = BAR - 8;
const bow = (r) => r - Math.sqrt(r * r - (EH / 2) ** 2);
const R_PILL = Math.round(1.2 * EH), R_LEFT = R_PILL, R_PLATE = Math.round(0.6 * EH), R_CLOCK = Math.round(0.93 * EH);
const R_TEAM = Math.round(0.69 * EH), TGAP = 7;   // the team block's right end, and the dark line before its plate at the middle
// a block's outline: each end an arc bowing out with radius r (or straight, 0), its corners rounded by c (the pill's corners round off
// over about 8 of its 48 px on air)
const f = (v) => v.toFixed(1);
const cut = (w, rl, rr, cl, cr, cave) => {
  // cave: the left end bows in (to the right) on radius cave, the same arc as the block before it, so the dark band between them keeps
  // one width all the way down
  if (cave) {
    const br = rr ? bow(rr) : 0, sr = rr ? EH / 2 / rr : 0, kr = Math.sqrt(1 - sr * sr), xr = w - br, xr2 = xr + cr * sr;
    return "path('M 0 0 H " + f(xr - cr) + ' Q ' + f(xr) + ' 0 ' + f(xr2) + ' ' + f(cr * kr) +
      (rr ? ' A ' + rr + ' ' + rr + ' 0 0 1 ' : ' L ') + f(xr2) + ' ' + f(EH - cr * kr) + ' Q ' + f(xr) + ' ' + EH + ' ' + f(xr - cr) + ' ' + EH +
      ' H 0 A ' + cave + ' ' + cave + " 0 0 0 0 0 Z')";
  }
  const bl = rl ? bow(rl) : 0, br = rr ? bow(rr) : 0;
  const sl = rl ? EH / 2 / rl : 0, sr = rr ? EH / 2 / rr : 0, kl = Math.sqrt(1 - sl * sl), kr = Math.sqrt(1 - sr * sr);
  const xr = w - br, xr2 = xr + cr * sr, xl2 = bl - cl * sl;
  return "path('M " + f(bl + cl) + ' 0 H ' + f(xr - cr) + ' Q ' + f(xr) + ' 0 ' + f(xr2) + ' ' + f(cr * kr) +
    (rr ? ' A ' + rr + ' ' + rr + ' 0 0 1 ' : ' L ') + f(xr2) + ' ' + f(EH - cr * kr) + ' Q ' + f(xr) + ' ' + EH + ' ' + f(xr - cr) + ' ' + EH +
    ' H ' + f(bl + cl) + ' Q ' + f(bl) + ' ' + EH + ' ' + f(xl2) + ' ' + f(EH - cl * kl) +
    (rl ? ' A ' + rl + ' ' + rl + ' 0 0 1 ' : ' L ') + f(xl2) + ' ' + f(cl * kl) + ' Q ' + f(bl) + ' 0 ' + f(bl + cl) + " 0 Z')";
};
// the cap's right end: with the down plate after it, it bows in on the plate's arc, so the band at the plate's left is the same even arc as
// the one at its right (the cap's
// straight end left a lens-shaped gap); with no down plate, it bows out on that arc and the first team block bows in on it
const capCut = (w, inward) => {
  const b = bow(R_PILL), xr = inward ? w : w - b;
  return "path('M 9 0 H " + f(xr) + ' A ' + R_PILL + ' ' + R_PILL + ' 0 0 ' + (inward ? 0 : 1) + ' ' + f(xr) + ' ' + EH + ' H 9 Q 0 ' + EH + ' 0 ' + (EH - 9) + " V 9 Q 0 0 9 0 Z')";
};
const W = CAP + DOWN + 2 * (TEAM + SC) + CLK + 4 * GAP + 8;
const NAVY = 'linear-gradient(#2a3d63, #18284a 50%, #0e1a36 52%, #162644)';
// on air the quarter sits on a dark slate part of the last block and the clock on navy, an arcing dark band between them
const SLATE = 'linear-gradient(#4a5058, #262a30 48%, #16191d 52%, #1e2227)', QW = 150, BAND = 7;

export default {
  id: 'nfl-cbs-13',
  size: { w: W, h: H },
  // outside live play there is no down: its pill goes and the bar is shorter
  sizeFor: (g) => ({ w: g.status === 'live' && g.football ? W : W - DOWN - GAP, h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-cbs-13 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 88%; color: #fff; }
.sb-nfl-cbs-13 .bar { position: absolute; left: 0; right: 0; top: ${PIP}px; height: ${BAR}px; display: flex; padding: 4px; box-sizing: border-box; border-radius: 12px;
  /* the bands between the blocks glossy: a bright sheen across their top fading into the dark, lit again a little at
 the foot (frame: the bands read about 85 at the top, 20-30 through the middle, 40 low down); a white outline round the bar's outside
 edge (on air a light rim, brightest along the top) */
  /* black outside with a light grey outline (frame: the bar round the blocks
 2-30 of 255, its rim the brightest of it, about 70 on the soft frame, all along the edge): the bands black, only a faint sheen left
 across their top (was a grey gloss, 154 at the top) and the outline a light grey 2 px line (was white at 60 %) */
  background: linear-gradient(#5a6068, #3c4047 10%, #2a2d33 34%, #1e2125 52%, #24272c 80%, #40454c);
  box-shadow: 0 4px 10px rgba(0,0,0,.6), inset 0 0 0 2px #aeb3b9; }
.sb-nfl-cbs-13 .bar > * { flex: none; height: 100%; border-radius: 9px; display: flex; align-items: center; box-sizing: border-box; position: relative; overflow: hidden; margin-left: ${GAP}px; }
.sb-nfl-cbs-13 .bar > .cap { margin-left: 0; }
/* a block whose left end bows in starts that bow early, so the band before it keeps the gap's width all the way down; the block is that
   much wider, so what shows of it stays the same size */
.sb-nfl-cbs-13 .bar > .sc { margin-left: ${TGAP - bow(R_TEAM)}px; width: ${SC + bow(R_TEAM)}px; } .sb-nfl-cbs-13 .bar > .clk { margin-left: ${GAP - bow(R_PLATE)}px; }
.sb-nfl-cbs-13 .cap { width: ${CAP}px; justify-content: center; padding: 2px 0 0; border-radius: 0 !important; clip-path: ${capCut(CAP, false)}; background: radial-gradient(circle at 50% 50%, #050506 0 30px, #8d939a 31px, #2a2d31 34px, #17191c 60%); box-shadow: inset 0 1px 0 rgba(255,255,255,.25); }
.sb-nfl-cbs-13 .cap.in { width: ${CAP + bow(R_PILL)}px; clip-path: ${capCut(CAP + bow(R_PILL), true)}; }
/* the down plate's left end reversed: it bows in, the same
 way as its right end bows (frame: the left edge at 116-117 px at the top and foot, 119 at the middle, so in by 2.5 px of the plate's 45;
 the right edge 360-361 and 364, out by 3.5), and the cap's right end bows out on that arc to meet it with an even band; it had bowed
 out to the left, with the cap's end bowing in */
.sb-nfl-cbs-13 .bar > .dn { margin-left: ${GAP - bow(R_PILL)}px; width: ${DOWN + bow(R_PILL)}px; padding-left: ${16 + Math.round(bow(R_PILL))}px; clip-path: ${cut(DOWN + bow(R_PILL), 0, R_PILL, 0, 14, R_PILL)}; }
.sb-nfl-cbs-13 .cap .sb-ha { color: #fff; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); }
.sb-nfl-cbs-13 .dn { width: ${DOWN}px; justify-content: center; padding: 0 16px; background: linear-gradient(#ffffff, #e4e7eb 50%, #c5cad1); color: #101318; font-size: 50px; line-height: 1; border-radius: 0; clip-path: ${cut(DOWN, R_PILL, R_PILL, 14, 14)}; white-space: pre; }
.sb-nfl-cbs-13 .dn .o { font-size: .78em; }
.sb-nfl-cbs-13 .tm { width: ${TEAM - TGAP}px; justify-content: flex-end; padding: 0 ${20 + Math.round(bow(R_TEAM))}px 0 20px; border-radius: 0; }
/* the team's logo, faint and large, at the block's left */
.sb-nfl-cbs-13 .tm .sb-logo { position: absolute; left: ${6 + Math.round(bow(R_LEFT))}px; top: 50%; transform: translateY(-50%); width: 92px; height: 80px; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.5)); }
/* the logo sits on a darker wedge of the team colour */
.sb-nfl-cbs-13 .tm::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 104px; background: rgba(0,0,0,.28); clip-path: polygon(0 0, 100% 0, 82% 100%, 0 100%); }
/* glass: a pale sheen across each block's top and a light edge at its foot; gradients only */
.sb-nfl-cbs-13 .tm::after, .sb-nfl-cbs-13 .clk::after { content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none; background: linear-gradient(180deg, rgba(255,255,255,.24) 0, rgba(255,255,255,.07) 30%, rgba(255,255,255,0) 46%, rgba(255,255,255,0) 84%, rgba(255,255,255,.16) 100%); }
.sb-nfl-cbs-13 .nm { position: relative; font-size: 54px; line-height: 1; white-space: nowrap; text-shadow: 0 2px 3px rgba(0,0,0,.55); }
.sb-nfl-cbs-13 .nm .ball { display: inline-block; width: 11px; height: 11px; border-radius: 50%; background: #fff; margin-right: 10px; vertical-align: middle; }
.sb-nfl-cbs-13 .nm .sb-rec { font-size: .62em; margin-left: 12px; }
.sb-nfl-cbs-13 .sc { justify-content: center; padding-right: ${Math.round(bow(R_PLATE) * 0.7)}px; padding-left: ${Math.round(bow(R_TEAM))}px; background: linear-gradient(#ffffff, #e2e5e9 45%, #b9bec6); color: #121418; box-shadow: inset 0 -3px 0 rgba(0,0,0,.18); font-size: 58px; line-height: 1; border-radius: 0 !important; clip-path: ${cut(SC + bow(R_TEAM), 0, R_PLATE, 0, 4, R_TEAM)}; }
.sb-nfl-cbs-13 .clk { width: ${CLK + bow(R_PLATE)}px; justify-content: space-between; padding: 0 ${22 + Math.round(bow(R_CLOCK))}px 0 ${22 + Math.round(bow(R_PLATE))}px; border-radius: 0; clip-path: ${cut(CLK + bow(R_PLATE), 0, R_CLOCK, 0, 6, R_PLATE)}; background: ${GLOSS}, ${NAVY}; box-shadow: inset 0 0 0 1.5px rgba(160,180,220,.3); font-size: 54px; line-height: 1; }
.sb-nfl-cbs-13 .clk .sb-ord { font-size: .72em; }
/* live: the quarter on the slate part, the clock on navy past an arcing dark band (the navy's left end bows in on the clock end's arc) */
.sb-nfl-cbs-13 .clk.split { background: ${GLOSS}, ${SLATE}; display: grid; grid-template-columns: ${QW}px 1fr; justify-items: center; padding: 0 ${10 + Math.round(bow(R_CLOCK))}px 0 ${Math.round(bow(R_PLATE))}px; }
.sb-nfl-cbs-13 .clk.split > span { position: relative; z-index: 1; }
/* the clock centred in its navy part: the navy runs from its curved left end (in by
 about two thirds of its bow, on average down the arc) to the block's curved right end */
.sb-nfl-cbs-13 .clk.split > span.ck { position: absolute; top: 0; bottom: 0; display: grid; place-items: center; left: ${QW + bow(R_PLATE) + Math.round(bow(R_CLOCK) * 0.66)}px; right: ${Math.round(bow(R_CLOCK) / 3)}px; }
.sb-nfl-cbs-13 .clk .nv { position: absolute; top: 0; bottom: 0; left: ${QW + bow(R_PLATE)}px; right: 0; background: ${GLOSS}, ${NAVY}; clip-path: ${cut(CLK - QW, 0, 0, 0, 0, R_CLOCK)}; }
.sb-nfl-cbs-13 .clk .nv.dk { left: ${QW + bow(R_PLATE) - BAND}px; background: #08090b; }
/* a basketball game's score plates keep room for three figures: the clock block gives up that width rather than run past the bar */
.sb-nfl-cbs-13 .bar > .clk { flex: 0 1 auto; min-width: 0; }
.sb-nfl-cbs-13 .sc.rec { white-space: nowrap; }
.sb-nfl-cbs-13 .clk .w { flex: 1; text-align: center; font-size: 44px; }
.sb-nfl-cbs-13 .sc.rec { font-size: 32px; }
/* the team with the ball: its colour across the top of its plate */
.sb-nfl-cbs-13 .sc.poss { background: linear-gradient(var(--pc) 0, var(--pc) 9px, rgba(0,0,0,.28) 9px, rgba(0,0,0,0) 13px) 0 0 / 100% 14px no-repeat, linear-gradient(#ffffff, #e2e5e9 45%, #b9bec6); }
/* the timeouts: yellow dashes standing on the bar above each team's block and score */
.sb-nfl-cbs-13 .to { position: absolute; top: 4px; display: flex; gap: 22px; justify-content: center; width: ${TEAM + SC}px; }
.sb-nfl-cbs-13 .to i { width: 52px; height: 8px; border-radius: 2px; background: linear-gradient(#ffe866, #f2c400); box-shadow: 0 1px 2px rgba(0,0,0,.5); }
.sb-nfl-cbs-13 .to i.used { opacity: .0; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const showDown = live && g.football;
    const bar = el('div', 'bar');
    const cap = el('div', 'cap'); if (marks(opts).ha) cap.appendChild(haMark(44));
    bar.appendChild(cap);
    if (showDown) {
      const dn = el('div', 'dn');
      const s = g.football.short || '';
      const m = /^(\d)(ST|ND|RD|TH)(.*)$/.exec(s);
      if (m) dn.append(document.createTextNode(m[1]), el('span', 'o', m[2]), document.createTextNode(m[3])); else dn.textContent = s;
      bar.appendChild(dn);
    }
    let x = 4 + CAP + GAP + (showDown ? DOWN + GAP : 0);
    [g.away, g.home].forEach((t) => {
      const tm = el('div', 'tm');
      const c = teamColor(t, '#4a4f57');
      tm.style.color = inkOn(c) === '#111' ? '#111' : '#fff';
      // the left end bows in on the arc of the block before it (the down pill or the first score plate)
      const prev = t === g.away ? R_PILL : R_PLATE;
      const tw = TEAM - TGAP + bow(prev), clip = cut(tw, 0, R_TEAM, 0, 4, prev);
      // no gloss on a team block: on the Super Bowl XLVII still each block is darkest at its top edge, rises to its fullest colour a little
      // under the middle and darkens again to the foot (the 49ers' red: #5c0d22 at the top, #8f0024 at 45 %, #63 at the foot; the Ravens'
      // purple the same way, flatter), so a soft rounded body, not a glossy top (ours read top L 52-57 against the still's 16-17). That dark
      // top and foot is the block fading to a darker version of its own colour, as on Blue bar '11; and no light line round the block (the still has none; the white inset line is gone)
      tm.style.background = 'linear-gradient(' + shade(c, -0.32) + ', ' + shade(c, -0.12) + ' 45%, ' + shade(c, -0.2) + ' 72%, ' + shade(c, -0.16) + ' 78%, ' + shade(c, -0.42) + ')';
      tm.style.width = tw + 'px'; tm.style.marginLeft = (GAP - bow(prev)) + 'px';
      tm.style.clipPath = clip; tm.style.paddingLeft = (108 + Math.round(bow(prev))) + 'px';
      const lg = logo(t, 92); lg.style.left = (6 + Math.round(bow(prev))) + 'px'; tm.appendChild(lg);
      const nm = el('span', 'nm');
      if (live && t.hasBall) nm.appendChild(el('i', 'ball'));
      nm.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      tm.appendChild(fit(nm));
      // before the kick-off the score box holds the team's record
      const rec = el('div', 'sc rec', t.record || ''); if ((t.record || '').length > 5) rec.style.fontSize = '24px';   // a 10-14-1 record on one line
      const sc = scoreSlot(el('div', 'sc', t.score != null ? String(t.score) : ''), g);
      if (String(t.score || '').length > 2) sc.style.fontSize = '48px';   // three figures clear of the curved ends with the heavier bands
      if (live && t.hasBall) { sc.classList.add('poss'); sc.style.setProperty('--pc', shade(c, 0.1)); }
      bar.append(tm, g.status === 'pre' ? rec : sc);
      if (live && t.timeouts != null) { const to = pips(t.timeouts, 3, 'to'); to.style.left = x + 'px'; root.appendChild(to); }
      x += TEAM + SC + GAP;
    });
    const clk = el('div', 'clk');
    if (live) { clk.classList.add('split'); clk.append(el('i', 'nv dk'), el('i', 'nv')); const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase())); clk.append(q, el('span', 'ck', g.clock || '')); }
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(clk);
    root.prepend(bar);
  },
};
