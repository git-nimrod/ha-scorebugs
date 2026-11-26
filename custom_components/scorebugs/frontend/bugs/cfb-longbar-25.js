// "Long bar '25": after CBS's college football bug (2025; frame: USC at Oregon). One long, low bar: a dark slot at the left end (the
// network's mark on air; here the Home Assistant logo), then each team in its colour with the logo, a small rank and the name, timeout
// dashes under the name, the record low on the right and a big score; then a white block with the quarter and the clock, and at the
// right end the down and distance in the colour of the team with the ball. The play clock between them needs data the sensor lacks.
import { el, logo, pips, statusText, teamColor, shade, inkOn, accentOn, haMark, marks, FONTS, teamInk, fit } from '../kit.js';

// wider team panels
const GLASS = 'linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,.07) 48%, rgba(0,0,0,.04) 52%, rgba(0,0,0,.2))';
// (Nov 23 sweep) the frame's bar is 0.037 of its width tall and the down box 0.17 of it: H 54 (was 64), the down box about 250 (was 324)
const W = 1340, H = 54, SLOT = 60, TEAM = 400, CLOCK = 220, PRE_CUT = 40;
// measured against the frame, frame size / mine: USC at Oregon
const TYPE = { score: 0.88, letters: 0.87, clock: 0.90, logo: 0.87 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.bar > div.tm > span.sc', 10, -0.5, 0],  // was 20.5 right and 7 outwards: the home score slid under the clock
  ['div.bar > div.tm > span.nm', -4.5, -8, 0],  // up in the bar's top half, the record below it on the right (as on air)
  ['div.bar > div.tm > div.lp > img.sb-logo', 3, 0.5, 0],
];

export default {
  id: 'cfb-longbar-25',
  sizedFor: 0.7275,   // sizes were measured in SB Inter Tight; the matched face keeps those cap heights
  size: { w: W, h: H },
  nudge: NUDGE,
  fonts: [FONTS.barlow700],
  css: `
.sb-cfb-longbar-25 { font-family: 'SB Barlow', Arial, sans-serif; font-weight: 700; color: #fff; }
/* face: CBS: Barlow Bold */
/* a dark outline round the bar and every part in it, as on air */
.sb-cfb-longbar-25 .bar { position: absolute; inset: 0; display: flex; box-shadow: 0 0 0 2px #0a0a0b, 0 3px 6px rgba(0,0,0,.45); border-radius: 4px; }
.sb-cfb-longbar-25 .bar > * { box-shadow: inset 0 0 0 2px rgba(10,10,11,.9); }
.sb-cfb-longbar-25 .slot { width: ${SLOT}px; background: linear-gradient(#202124, #121315);   /* matte on air, no gloss */ display: grid; place-items: center; flex: none; border-radius: 4px 0 0 4px; }
.sb-cfb-longbar-25 .slot .sb-ha { color: #f2f2f2; }
/* the card's Panel texture over the team panels */
.sb-cfb-longbar-25 .tm::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: var(--sb-tex, none); background-size: var(--sb-tex-size, auto); mix-blend-mode: overlay; }
.sb-cfb-longbar-25 .tm { width: ${TEAM}px; flex: none; position: relative; display: flex; align-items: center; border-top: 2px solid rgba(255,255,255,.35); }
.sb-cfb-longbar-25 .tm .lp { width: 70px; height: 100%; flex: none; display: grid; place-items: center; margin-right: 8px; }
.sb-cfb-longbar-25 .tm .sb-logo { width: 66px; height: 50px;   /* the bar's full height, as on air */ object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.6)) drop-shadow(0 0 2px rgba(255,255,255,.35)); }
.sb-cfb-longbar-25 .tm .nm { font-size: ${30 * TYPE.letters}px; white-space: nowrap; line-height: 1; max-width: calc(100% - 78px - 104px); }   /* ends clear of the score; the record sits under its end, lower down */ .sb-cfb-longbar-25 .tm .nm b { font-size: 21px; margin-right: 6px; }
.sb-cfb-longbar-25 .tm .sb-pips { position: absolute; left: 80px; bottom: 5px; display: flex; gap: 6px; }
.sb-cfb-longbar-25 .tm .sb-pips i { width: 22px; height: 3px; background: #f2f2f2; } .sb-cfb-longbar-25 .tm .sb-pips i.used { opacity: .25; }
.sb-cfb-longbar-25 .tm .rec { position: absolute; right: 94px; bottom: 4px; font-size: 18px; }
.sb-cfb-longbar-25 .tm .rec.pre { right: 22px; bottom: auto; font-size: 24px; }   /* before the game the record takes the score's place */
.sb-cfb-longbar-25 .tm .nm.pre { max-width: calc(100% - 78px - 70px); }
.sb-cfb-longbar-25 .tm .sc { position: absolute; right: 24px;   /* clear of the panel's edge */ font-size: ${50 * TYPE.score}px; font-weight: 700; letter-spacing: -1px; }
.sb-cfb-longbar-25 .clk { width: ${CLOCK}px; flex: none; background: linear-gradient(#ffffff, #dcdcdc); color: #151515; display: flex; align-items: center; }
.sb-cfb-longbar-25 .clk span { flex: 1; text-align: center; font-size: ${32 * TYPE.clock}px; } .sb-cfb-longbar-25 .clk span + span { border-left: 2px solid #9a9a9a; flex: 1.3; }
.sb-cfb-longbar-25 .clk .sb-ord { font-size: .7em; } .sb-cfb-longbar-25 .clk .w { font-size: 24px; }
.sb-cfb-longbar-25 .dd { flex: 1; margin-left: 6px; display: grid; place-items: center; font-size: 30px; border-top: 2px solid rgba(255,255,255,.55); border-radius: 0 4px 4px 0; }
`,
  // before the game the score room goes (the record takes its place) and there is no down tab: the bar ends at the clock box
  sizeFor: (g) => (g.status === 'pre' ? { w: SLOT + 2 * (TEAM - PRE_CUT) + CLOCK, h: H } : g.status === 'final' ? { w: SLOT + 2 * TEAM + CLOCK, h: H } : { w: W, h: H }),
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const slot = el('div', 'slot');
    if (mk.ha) slot.appendChild(haMark(36));
    bar.appendChild(slot);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const tm = el('div', 'tm');
      // glassy: a light upper half over the team colour, a soft horizon, deeper at the foot
      tm.style.background = GLASS + ', linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.14) + ')';  // flat on air: a soft fall and the light rim on top, no glossy horizon
      tm.style.color = teamInk(c);
      const nm = fit(el('span', 'nm'), (t.rank ? t.rank + ' ' : '') + (t.abbr || '').toUpperCase());
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase().slice(0, 18)));
      // the logo on a dark glossy plate, so a logo in the team's own colour still shows
      const lp = el('div', 'lp'); lp.style.background = 'transparent'; lp.appendChild(logo(t, 60));
      if (g.status === 'pre') { tm.style.width = (TEAM - PRE_CUT) + 'px'; nm.classList.add('pre'); const rp = el('span', 'rec pre', t.record || ''); if ((t.record || '').length > 4) { rp.style.fontSize = '18px'; nm.style.maxWidth = 'calc(100% - 78px - 96px)'; } tm.append(lp, nm, rp); }   // a long record smaller, and the name kept clear of it
      else tm.append(lp, nm, el('span', 'rec', t.record || ''), el('span', 'sc', t.score != null ? String(t.score) : ''));
      if (live && t.timeouts != null) tm.appendChild(pips(t.timeouts, 3));
      bar.appendChild(tm);
    });
    const clk = el('div', 'clk');
    if (live) { const q = el('span', ''); q.append(document.createTextNode(g.period.label || ''), el('small', 'sb-ord', g.period.suffix || '')); clk.append(q, el('span', '', g.clock || '')); }
    else clk.appendChild(el('span', 'w', statusText(g, time)));
    bar.appendChild(clk);
    // the down and distance, in the colour of the team with the ball
    const lead = live ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    const dd = el('div', 'dd', live && g.football && g.football.short ? g.football.short : '');   // FINAL already stands in the clock box
    const dc = lead ? teamColor(lead, '#3a3f47') : '#2b2d31';
    dd.style.background = GLASS + ', linear-gradient(' + shade(dc, 0.06) + ', ' + shade(dc, -0.16) + ')';
    dd.style.color = teamInk(dc);
    if (dd.textContent) bar.appendChild(dd);
    root.appendChild(bar);
  },
};
