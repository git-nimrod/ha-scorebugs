// "Dark capsule '25": after TNT Sports' college football bug (2025; frame: Coastal Carolina at West Virginia). Built on the same structure
// as TNT's college basketball bar (Pill '25), as the two are one family: a black rounded bar; each team a pill of its
// colour with fine diagonal lines and a gloss, its logo at the outer end, its name (the record under it before the game) and timeout
// dashes under the name; its score in an oval at the inner end, running in under the black clock oval in the middle, which holds the
// quarter and the clock over the down and distance. A small arrow beside the score of the team with the ball. The conference's mark at
// the far right is left out; the play clock needs data the sensor lacks.
import { el, logo, pips, statusText, teamColor, shade, inkOn, fit, FONTS, GLOSS } from '../kit.js';

// the black clock oval 0.19 of the bar's width, as on air (frame: 135 px of the 710 px bar left of the conference mark we leave out; was
// 250, 0.21)
const W = 1180, H = 74, MID = 226, OVER = 30, TEAM = (W - MID) / 2 + OVER, PRE_CUT = 96, SINK = H / 2;

export default {
  id: 'cfb-tnt-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: each team pill closes up on the clock oval and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * PRE_CUT, h: H } : { w: W, h: H }),
  typeScale: 1.05,
  fonts: [FONTS.anton],
  css: `
.sb-cfb-tnt-25 { font-family: 'SB Anton', 'Arial Narrow', sans-serif; font-weight: 400; font-stretch: 84%; color: #fff; }
.sb-cfb-tnt-25 .bar { position: absolute; inset: 0; border-radius: ${H / 2}px; overflow: hidden; display: flex; background: #121316; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-cfb-tnt-25 .tm { width: ${TEAM}px; flex: none; display: flex; align-items: center; gap: 14px; padding: 0 ${OVER + 14}px 0 10px; box-sizing: border-box; margin: 3px -${OVER}px 3px 0; border-radius: ${H / 2}px 0 0 ${H / 2}px; }
.sb-cfb-tnt-25 .tm.h { flex-direction: row-reverse; padding: 0 10px 0 ${OVER + 14}px; margin: 3px 0 3px -${OVER}px; border-radius: 0 ${H / 2}px ${H / 2}px 0; }
.sb-cfb-tnt-25 .tm .sb-logo { width: 66px; height: 60px; object-fit: contain; flex: none; filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
.sb-cfb-tnt-25 .tx { flex: 1; min-width: 0; display: grid; gap: 4px; justify-items: center; }
.sb-cfb-tnt-25 .nm { font-size: 38px; line-height: 1; white-space: nowrap; letter-spacing: .5px; text-shadow: 0 1px 2px rgba(0,0,0,.4); }
.sb-cfb-tnt-25 .rec { font-size: 22px; line-height: 1; opacity: .92; }
.sb-cfb-tnt-25 .sb-pips { display: flex; gap: 6px; } .sb-cfb-tnt-25 .sb-pips i { width: 26px; height: 4px; background: rgba(255,255,255,.92); } .sb-cfb-tnt-25 .sb-pips i.used { opacity: .25; }
/* each score in its own oval, a light see-through tint over the team colour (the pill's full height) with a lit rim, running in under the clock oval;
   names and scores a light cool grey, as on air (frame: score 57 % of the bar, letters 40 %) */
/* the oval's inner end runs on under the black clock oval past its curve (square there, so no rounding shows): on air the glass fills
   right up to the black's round end (that end a half circle, radius about half the bar's height), and the oval's own round end shows
   only at the outer side (a half circle, radius half the oval's height) */
.sb-cfb-tnt-25 .sc { position: relative; flex: none; min-width: 66px; height: 66px; display: grid; place-items: center; box-sizing: content-box; border-radius: 33px 0 0 33px; padding: 0 ${OVER + 8 + SINK}px 0 16px; margin-right: -${OVER + 12 + SINK}px;
  background: linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.1) 45%, rgba(255,255,255,.16)); box-shadow: inset 0 0 0 2px rgba(255,255,255,.42); font-size: 58px; line-height: 1; font-stretch: 95%; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-cfb-tnt-25 .tm.h .sc { margin-right: 0; margin-left: -${OVER + 12 + SINK}px; padding: 0 16px 0 ${OVER + 8 + SINK}px; border-radius: 0 33px 33px 0; }
.sb-cfb-tnt-25 .sc .ar { position: absolute; top: 50%; margin-top: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; }
.sb-cfb-tnt-25 .tm.a .sc .ar { left: 2px; border-right: 10px solid #fff; } .sb-cfb-tnt-25 .tm.h .sc .ar { right: 2px; border-left: 10px solid #fff; }
.sb-cfb-tnt-25 .mid { position: relative; z-index: 2; width: ${MID}px; flex: none; display: grid; justify-items: center; align-content: center; gap: 2px; background: ${GLOSS}, #0d0e10; border-radius: ${H / 2}px; box-shadow: inset 0 0 0 2px rgba(255,255,255,.22); }
.sb-cfb-tnt-25 .mid .top { display: flex; align-items: baseline; gap: 12px; } .sb-cfb-tnt-25 .mid .q { font-size: 22px; } .sb-cfb-tnt-25 .mid .clk { font-size: 40px; line-height: .95; }
.sb-cfb-tnt-25 .mid .dn { font-size: 20px; line-height: 1; } .sb-cfb-tnt-25 .mid .w { font-size: 30px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const team = (t, k) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm ' + k);
      // a rounded pill with fine diagonal lines through the colour and a soft light top, as Pill '25
      tm.style.background = 'linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,0) 55%), repeating-linear-gradient(' + (k === 'a' ? '120deg' : '60deg') + ', rgba(255,255,255,.07) 0 2px, rgba(255,255,255,0) 2px 10px), linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, -0.25) + ', ' + shade(c, 0.06) + ' 50%, ' + shade(c, -0.12) + ')';
      tm.style.color = inkOn(c) === '#111' ? shade(c, -0.8) : '#dfe5ea';
      const tx = el('div', 'tx');
      tx.appendChild(fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase()));
      if (g.status === 'pre' && t.record) tx.appendChild(el('span', 'rec', t.record));
      if (live && t.timeouts != null) tx.appendChild(pips(t.timeouts, 3));
      tm.append(logo(t, 66), tx);
      if (g.status === 'pre') tm.style.width = (TEAM - PRE_CUT) + 'px';
      else { const sc = el('span', 'sc', t.score != null ? String(t.score) : ''); if (live && t.hasBall) sc.appendChild(el('i', 'ar')); tm.appendChild(sc); }
      return tm;
    };
    const mid = el('div', 'mid');
    if (live) {
      const top = el('div', 'top'); top.append(el('span', 'q', (g.period.label || '') + (g.period.suffix || '').toUpperCase()), el('span', 'clk', g.clock || ''));
      mid.appendChild(top);
      if (g.football && g.football.short) mid.appendChild(el('span', 'dn', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase())));
    } else mid.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(team(g.away, 'a'), mid, team(g.home, 'h'));
    root.appendChild(bar);
  },
};
