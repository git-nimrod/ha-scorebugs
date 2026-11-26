// "Centre clock '25": after NBC's college football bug (2025; frame: NC State at Notre Dame). Two panels in the teams' colours with a
// dark clock box between them: each panel has the logo at its outer end on a darker square, the rank, name and record, a thin divider
// and a big score next to the clock. The box holds the network's mark (here the Home Assistant logo), the clock large and the quarter
// small; the play clock beside the quarter needs data the sensor lacks. Faint timeout dashes run under the panels, and a dark tab
// below gives the down and distance with an arrow towards the team with the ball.
import { el, logo, pips, statusText, teamColor, shade, inkOn, haMark, marks, FONTS, accentOn, teamInk, fit, glassCover } from '../kit.js';

// wider sides
// (Nov 23 sweep) panels deeper: on the frame a panel is 0.079 of the bar's width tall (58 of 730 px); ours was 0.059 once the bar was widened
const W = 1120, H = 158, TOP = 16, PH = 84, MID = 150;
// measured against the frame, frame size / mine: two frames (NC State at Notre Dame, Villanova at Seton Hall)
const TYPE = { score: 1.06, letters: 1.06, clock: 0.88, logo: 0.87 };
const SIDE = (W - MID) / 2, SCORE_W = 116;

// the team letters' width to the frame's
const LETTERS = { stretch: 105 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  // (the scores' old sideways shifts dropped: each score sits in the middle of its own box)
  ['div.pn.a > div.tx > span.nm', -7.5, 0, 0],
  ['div.pn.h > div.tx > span.nm', -6, 0, 0],
  ['div.mid > span.clk', 1, 2, 0],   // was 12.5 down, measured in the stand-in face; Lexend's taller clock ran it into the period (font matching)
  ['div.pn.a > div.lb > img.sb-logo', 1, -4, 0],
  ['div.pn.h > div.lb > img.sb-logo', 2.5, -3.5, 0],
];

export default {
  id: 'cfb-centre-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score boxes go and both panels close up on the clock, so the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -15% vs the broadcast, logos -16%; 80 % of the correction
  typeScale: 1.0,
  texture: 'lines',  // fine diagonal lines through the panels by default; the card's Panel texture can change it
  nudge: NUDGE,
  fonts: [FONTS.lexend],
  css: `
.sb-cfb-centre-25 { font-family: 'SB Lexend', Arial, sans-serif; font-weight: 800; font-stretch: 112%; color: #fff; }
/* face: NBC national package: Lexend Bold */
/* the card's Panel texture over the team panels; the selected pattern is now laid in the panel itself, between the team's
 colour and the glass (it was an overlay blend on top, which the glass's light top washed out), so it runs through the lit top and the
 darker foot alike and stays the card's choice (lines by default, mesh, carbon, plays... or none); the down tab, in the same colour,
 carries it too */
.sb-cfb-centre-25 .pn { position: absolute; top: ${TOP}px; height: ${PH}px; width: ${SIDE}px; display: flex; align-items: center; box-shadow: 0 3px 6px rgba(0,0,0,.45); }
.sb-cfb-centre-25 .pn.a { left: 0; border-radius: 6px 0 0 6px; } .sb-cfb-centre-25 .pn.h { right: 0; flex-direction: row-reverse; border-radius: 0 6px 6px 0; }
.sb-cfb-centre-25 .lb { width: 112px; height: 100%; display: grid; place-items: center; flex: none; }
.sb-cfb-centre-25 .lb .sb-logo { width: 96px; height: ${PH - 8}px; margin: 0; object-fit: contain;   /* inside the panel, never out past its edge */
  filter: drop-shadow(0 2px 2px rgba(0,0,0,.5)); }
.sb-cfb-centre-25 .tx { flex: 1; min-width: 0; overflow: hidden; display: grid; padding: 0 10px; }
.sb-cfb-centre-25 .pn.a .tx { justify-items: end; } .sb-cfb-centre-25 .pn.h .tx { justify-items: start; }
.sb-cfb-centre-25 .nm { font-size: ${30 * TYPE.letters}px; font-stretch: 96%; letter-spacing: .5px; white-space: nowrap; line-height: 1.05; min-width: 0; overflow: hidden; }
.sb-cfb-centre-25 .nm b { font-size: 20px; margin-right: 6px; }
.sb-cfb-centre-25 .rec { font-size: 21px; font-weight: 700; opacity: .9; line-height: 1.1; }
.sb-cfb-centre-25 .sc { width: 116px; flex: none; display: grid; place-items: center; font-size: ${66 * TYPE.score}px; font-stretch: 100%; height: 100%; line-height: 1; padding-bottom: 4px; box-sizing: border-box; text-shadow: 0 2px 3px rgba(0,0,0,.45); }
.sb-cfb-centre-25 .pn.a .sc { border-left: 2px solid rgba(255,255,255,.3); } .sb-cfb-centre-25 .pn.h .sc { border-right: 2px solid rgba(255,255,255,.3); }
.sb-cfb-centre-25 .pn.a .sc, .sb-cfb-centre-25 .pn.h .sc { background-clip: padding-box; }
.sb-cfb-centre-25 .mid { position: absolute; left: ${SIDE}px; top: ${TOP - 6}px; width: ${MID}px; height: ${PH + 12}px; background: ${glassCover('#1b1e22', { top: 16, mid: 9, horizon: 30, step: 8, foot: -3 }).background};
  border-radius: 4px; display: grid; justify-items: center; align-content: center; box-shadow: 0 3px 8px rgba(0,0,0,.55); z-index: 1; }
/* the clock box under the same glass: lit +16 L at the top, falling to its colour by 30 % down (Navy v Notre Dame frame) */
.sb-cfb-centre-25 .mid .clk { font-size: ${34 * TYPE.clock}px; line-height: 1; } .sb-cfb-centre-25 .mid .q { font-size: 18px; line-height: 1; margin-top: 3px; }   /* Lexend's taller line box ran the period into the clock (font matching) */ .sb-cfb-centre-25 .mid .sb-ha { color: #f0f0f0; }
.sb-cfb-centre-25 .mid .w { font-size: 19px; text-align: center; line-height: 1.15; }
.sb-cfb-centre-25 .to { position: absolute; top: ${TOP + PH + 2}px; z-index: 2; }
.sb-cfb-centre-25 .sb-pips { display: flex; gap: 8px; } .sb-cfb-centre-25 .sb-pips i { width: 30px; height: 5px; background: rgba(255,255,255,.92); }   /* white dashes under the bar, as on air */
.sb-cfb-centre-25 .sb-pips i.used { opacity: .3; }
/* a light line along the tab's top edge (+11 L on the Navy v Notre Dame frame) */
/* the down and distance hangs straight off its team's panel in the same colour, its outer foot corner rounded */
.sb-cfb-centre-25 .tab { position: absolute; top: ${TOP + PH}px; left: 0; width: ${SIDE}px; height: 34px; background: linear-gradient(#1f2a44, #121a2c);
  border-radius: 0; box-shadow: inset 0 1px 0 rgba(255,255,255,.27), 0 3px 6px rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 22px; font-weight: 700; }
.sb-cfb-centre-25 .tab i { font-style: normal; color: #f2c230; font-size: 18px; }
.sb-cfb-centre-25 .nm { font-stretch: ${LETTERS.stretch}%; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    [['away', 'a'], ['home', 'h']].forEach(([side, k]) => {
      const t = g[side], c = teamColor(t, '#4a4f57');
      const pn = el('div', 'pn ' + k);
      // one colour from the logo to the score, fine diagonal lines through it and a strong black glossy sheen over it
      // the team's colour almost flat, a soft diagonal sheen and a little shade at the foot
      // a little see-through, as on air (the referee's stripes show through the Notre Dame panel in the frame)
      const glass = 'rgba(' + [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)).join(', ') + ', .9)';
      // the glass cover: measured on that frame (sample.py) the
      // panels are lit +12 (white) to +22 L (navy) at the top, a step about 28 % down, then flat to the foot; laid over the see-through
      // team colour as white light, so every team takes the same glass
      pn.style.background = 'linear-gradient(rgba(255,255,255,.25), rgba(255,255,255,.16) 26%, rgba(255,255,255,0) 30%, rgba(0,0,0,.06)), linear-gradient(' + (side === 'away' ? '115deg' : '245deg') + ', rgba(255,255,255,0) 30%, rgba(255,255,255,.09) 46%, rgba(255,255,255,0) 62%), var(--sb-tex, none), ' + glass;
      pn.style.backgroundSize = 'auto, auto, var(--sb-tex-size, auto), auto';
      pn.style.color = teamInk(shade(c, -0.15));   // the names sit on the panel's lighter part
      const lb = el('div', 'lb');
      lb.appendChild(logo(t, 74));
      const tx = el('div', 'tx'), nm = el('span', 'nm');
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase().slice(0, 15)));
      const rec = el('span', 'rec', t.record || ''); rec.style.color = teamInk(shade(c, -0.5));   // the record sits in the gloss's dark lower half
      fit(nm);  // a long name (NOTRE DAME) is squeezed to its room instead of cut off
      tx.append(nm, rec);
      const sc = el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      sc.style.color = teamInk(shade(c, -0.5));   // the score sits on the darker end, under the gloss's dark half
      if (g.status === 'pre') { pn.style.width = (SIDE - SCORE_W) + 'px'; pn.append(lb, tx); } else pn.append(lb, tx, sc);
      root.appendChild(pn);
      if (live && t.timeouts != null) {
        const to = el('div', 'to');
        to.style[side === 'away' ? 'left' : 'right'] = (SIDE - 111) + 'px';   // under the score, next to the centre box, as on air
        to.appendChild(pips(t.timeouts, 3));
        root.appendChild(to);
      }
    });
    const mid = el('div', 'mid');
    if (g.status === 'pre') mid.style.left = (SIDE - SCORE_W) + 'px';
    if (mk.ha) mid.appendChild(haMark(24));
    if (live) mid.append(el('span', 'clk', g.clock || ''), el('span', 'q', (g.period.label || '') + (g.period.suffix || '')));
    else mid.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(mid);
    if (live && g.football && g.football.short) {
      // the down and distance hangs under the team with the ball only, in its colour
      const tab = el('div', 'tab'), bt = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null;
      if (g.home.hasBall) tab.style.left = (SIDE + MID) + 'px'; else tab.style.left = '0';   // the full width of the team's panel, as on air
      if (bt) { const bc = teamColor(bt, '#1f2a44'); tab.style.background = 'linear-gradient(rgba(0,0,0,.18), rgba(0,0,0,.3)), var(--sb-tex, none), rgba(' + [1, 3, 5].map((i) => parseInt(bc.slice(i, i + 2), 16)).join(', ') + ', .9)'; tab.style.backgroundSize = 'auto, var(--sb-tex-size, auto), auto'; tab.style.color = teamInk(bc); }
      tab.style.borderRadius = g.home.hasBall ? '0 0 10px 0' : '0 0 0 10px';
      tab.append(el('i', '', g.away.hasBall ? '◀' : g.home.hasBall ? '▶' : ''), el('span', '', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase())));
      root.appendChild(tab);
    }
  },
};
