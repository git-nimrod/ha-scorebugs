// "Black bar '16": after ESPN's Monday Night Football bug (2016). A thin
// glossy black bar across the screen: the show's mark at the left (here the Home Assistant logo, in red), then each team as its logo
// large and half faded into a wash of its colour behind its letters, timeouts as dashes of its colour under them, and its score in white
// on the black; then the quarter and the clock in grey, and the down and distance on a navy block at the right. The red play clock box
// needs data the sensor lacks.
import { el, logo, statusText, teamColor, vividColor, shade, haMark, marks, scoreSlot, pips, fit, FONTS } from '../kit.js';

const W = 1560, H = 70, MARK = 250, TEAM = 280, SC = 100, CLK = 250;

// the 2016 frame's Broncos panel and dashes are blue; the kit's on-air colour for DEN is the orange of other looks, so this bug asks for
// the blue itself
const BLUE = { DEN: { wash: '#0b2a52', dash: '#3f78c4' } };

export default {
  id: 'nfl-espn-16',
  size: { w: W, h: H },
  fonts: [FONTS.roboto],
  css: `
.sb-nfl-espn-16 { font-family: 'SB Roboto', 'Arial', sans-serif; font-weight: 500; font-stretch: 90%; color: #fff; }
.sb-nfl-espn-16 .bar { position: absolute; inset: 0; display: flex; align-items: stretch;
  background: linear-gradient(#2c2f33, #121315 45%, #050506 55%, #0d0e10); box-shadow: 0 3px 8px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18); }
.sb-nfl-espn-16 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; } .sb-nfl-espn-16 .mk .sb-ha { color: #e5232b; filter: drop-shadow(0 0 4px rgba(229,35,43,.45)); }
.sb-nfl-espn-16 .tm { width: ${TEAM}px; flex: none; position: relative; display: grid; align-content: center; justify-items: end; padding-right: 16px; box-sizing: border-box; overflow: hidden; gap: 4px; }
/* the logo, big and cut by the bar, fading into the wash of its colour */
.sb-nfl-espn-16 .tm .sb-logo { position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 150px; height: 96px; object-fit: contain; opacity: .85;
  -webkit-mask-image: linear-gradient(90deg, #000 62%, transparent 100%); mask-image: linear-gradient(90deg, #000 62%, transparent 100%); }
.sb-nfl-espn-16 .nm { position: relative; color: #dfe2e6; font-size: 40px; line-height: 1; letter-spacing: .5px; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.7); }
.sb-nfl-espn-16 .nm .sb-rec { font-size: .6em; margin-left: 8px; color: #c9cdd2; }
.sb-nfl-espn-16 .to { position: relative; display: flex; gap: 8px; } .sb-nfl-espn-16 .to i { width: 32px; height: 4px; } .sb-nfl-espn-16 .to i.used { opacity: .2; }
/* scores at the frame's size: caps 0.36 of the bar (ours were 0.51) */
.sb-nfl-espn-16 .sc { width: ${SC}px; flex: none; display: grid; place-items: center; font-size: 36px; font-weight: 700; line-height: 1; }
.sb-nfl-espn-16 .clk { width: ${CLK}px; flex: none; display: flex; align-items: center; justify-content: space-around; color: #c3c7cc; font-size: 34px; border-left: 1px solid rgba(255,255,255,.08); }
.sb-nfl-espn-16 .clk .sb-ord { font-size: .7em; }
/* the down block a deeper navy, near black on the frame */
.sb-nfl-espn-16 .dn { flex: 1; display: grid; place-items: center; margin: 6px 10px 6px 0; background: linear-gradient(#0d1a30, #060d1a); box-shadow: inset 0 0 0 1px rgba(120,150,200,.18); font-size: 34px; font-weight: 400; }
.sb-nfl-espn-16 .w { flex: 1; display: grid; place-items: center; font-size: 34px; color: #c3c7cc; }
/* glass: the black bar is lit from above, a pale sheen over its top half with a soft edge near
 the middle, a darker foot and a fine light top line; the down block takes it too (recipe in lessons/nfl.md). Gradients only. */
.sb-nfl-espn-16 .bar { background: linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), linear-gradient(#2c2f33, #121315 45%, #050506 55%, #0d0e10); box-shadow: 0 3px 8px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(0,0,0,.7); }
.sb-nfl-espn-16 .dn { background: linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 50%, rgba(0,0,0,.28) 100%), linear-gradient(#0d1a30, #060d1a); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(50));
    bar.appendChild(mk);
    [g.away, g.home].forEach((t) => {
      const b = BLUE[(t.abbr || '').toUpperCase()], c = b ? b.wash : teamColor(t, '#3a3f47'), v = b ? b.dash : vividColor(t, '#8a9099');
      const tm = el('div', 'tm');
      // a soft wash of the colour under the black, strongest behind the logo
      tm.style.background = 'linear-gradient(90deg, ' + shade(c, -0.35) + 'cc, ' + shade(c, -0.6) + '66 55%, rgba(0,0,0,0) 100%)';
      tm.appendChild(logo(t, 150));
      const nm = el('span', 'nm', (t.abbr || '').toUpperCase());
      if (g.status === 'pre' && t.record) nm.appendChild(el('small', 'sb-rec', t.record));
      tm.appendChild(fit(nm));
      if (live && t.timeouts != null) { const to = pips(t.timeouts, 3, 'to'); to.querySelectorAll('i').forEach((i) => { i.style.background = v; }); tm.appendChild(to); }
      bar.append(tm, scoreSlot(el('div', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
    });
    if (live) {
      const clk = el('div', 'clk');
      const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toLowerCase()));
      clk.append(q, el('span', '', g.clock || ''));
      bar.append(clk, el('div', 'dn', g.football && g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : ''));
    } else bar.appendChild(el('div', 'w', statusText(g, time)));
    root.appendChild(bar);
  },
};
