// "Slash panels '20": after ESPN/ABC's college football bug (early 2020s). A long flat bar: each team a panel lit in its colour with its
// rank and name in white capitals, its record small under the name, its logo at the panel's inner end, then a few white slashes and its
// score in white on a darker cut of its colour, a small white arrow pointing at the team with the ball; then a black block with the quarter
// in gold, the clock in white and the play clock, and the down and distance dark on a pale grey plate. A line of the game's note sits in
// small white capitals over the clock and the down, inside the bar (the clock row moves down under it). The play clock is left out (no data).
// Measured with register.py: the score's capitals are 0.73 of the bar's height, the names 0.33, the records 0.22.
import { el, logo, statusText, teamPair, panelInk, shade, alpha, scoreSlot, fit, timeoutCount, FONTS, TOKENS } from '../kit.js';

// loop pass, measured on the 2022 720p still (Georgia at Mississippi State, the bar cut to its 51 px body plus its foot
// line): the score figures are 0.63 of the bar's height (ours 0.77: font 68 -> 56); each score cell is dark grey, not a dark cut of the
// team's colour (#382323 / #302a26, L 13 at the top to 20 at the foot, the team's colour only along its left side); and a light line
// runs along the whole foot of the bar (3 px of 51 on air, L 83-94: 4 px here).
// loop pass:
// the slanted marks between a team's logo and its score are the TIMEOUTS: one separate white parallelogram per timeout (3 in football),
// each rising to the right about 35 degrees (measured on the 2022 still: 12.5 x 8.8 px, 5.5 px thick, 14 px apart, on a black column
// 14 px wide outside the team's panel); a used timeout is dimmer. No timeouts (before the game, after it, a feed without them): no column.

const H = 64, BAR = 64, TEAM = 380, SCORE = 110, CLOCK = 290, DOWN = 300, TOC = 16;
const W = 2 * (TEAM + SCORE) + 28 + CLOCK + DOWN + 12;
// the black timeout column outside each team's panel, only while the game is on and the feed gives that team's timeouts
const hasTo = (g, t) => g.status === 'live' && t.timeouts != null;
const cols = (g) => (hasTo(g, g.away) ? TOC : 0) + (hasTo(g, g.home) ? TOC : 0);
// a sport that keeps room for three figures (basketball) widens each score slot past SCORE (scoreSlot): the bar grows by that much, so
// the clock block is not pushed off its end
const wider = (g) => (g.status === 'pre' ? 0 : 2 * Math.max(0, Math.ceil((TOKENS.scoreDigits[g.sport] || TOKENS.scoreDigits.default) * TOKENS.figure * 56 - SCORE)));

export default {
  id: 'cfb-espn-20',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: (g.status === 'live' && g.football && g.football.short ? W : W - DOWN) + wider(g) - 2 * TOC + cols(g), h: H }),
  fonts: [FONTS.archivo],
  css: `
.sb-cfb-espn-20 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 90%; color: #fff; }
.sb-cfb-espn-20 .bar { position: absolute; left: 0; right: 0; bottom: 0; height: ${BAR}px; display: flex; align-items: stretch; padding-left: 6px; background: #111214; box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 4px 0 0 #2a2b2e; }
.sb-cfb-espn-20 .tm { width: ${TEAM - TOC}px; flex: none; position: relative; display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 0 6px 0 12px; box-sizing: border-box; overflow: hidden; }
.sb-cfb-espn-20 .tm .id { min-width: 0; flex: 1; display: flex; flex-direction: column; align-items: flex-end; }
.sb-cfb-espn-20 .tm .nm { font-size: 32px; line-height: 1; white-space: nowrap; text-transform: uppercase; }
.sb-cfb-espn-20 .tm .nm small { font-size: .75em; margin-right: 8px; }
.sb-cfb-espn-20 .tm .rc { font-size: 20px; font-weight: 600; opacity: .9; }
.sb-cfb-espn-20 .tm .sb-logo { width: 66px; height: 56px; object-fit: contain; flex: none; }
/* the timeouts: a black column, each timeout its own white parallelogram rising to the right (16 x 19 box, 7 px thick, 18 px apart; the still's 12.5 x 8.8 x 5.5 px, 14 apart, at our 1.3 times) */
.sb-cfb-espn-20 .sl { width: ${TOC}px; align-self: stretch; flex: none; position: relative; background: #15120f; box-shadow: inset 1px 0 0 rgba(255,255,255,.3); }
.sb-cfb-espn-20 .sl i { position: absolute; left: 0; width: 16px; height: 19px; background: linear-gradient(#f4f4f6, #d8d8da); clip-path: polygon(0 100%, 0 62.1%, 100% 0, 100% 37.9%); }
.sb-cfb-espn-20 .sl i.used { opacity: .3; }
.sb-cfb-espn-20 .sc { width: ${SCORE}px; flex: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 56px; font-weight: 800; line-height: 1; position: relative; }
.sb-cfb-espn-20 .sc.rec { font-size: 0; }
/* the light line along the whole foot of the bar */
.sb-cfb-espn-20 .bar::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: rgba(238,240,238,.88); pointer-events: none; }
.sb-cfb-espn-20 .pz { position: absolute; right: -2px; top: 50%; margin-top: -11px; width: 0; height: 0; border: 11px solid transparent; border-right: 11px solid #fff; border-left-width: 0; }
.sb-cfb-espn-20 .rb { flex: none; display: flex; flex-direction: column; margin-left: 28px; }
.sb-cfb-espn-20 .rw { flex: 1; min-height: 0; display: flex; align-items: stretch; }
.sb-cfb-espn-20 .ck { width: ${CLOCK}px; flex: none; display: flex; align-items: center; justify-content: space-evenly; font-size: 44px; }
.sb-cfb-espn-20 .rb.n .ck { font-size: 34px; } .sb-cfb-espn-20 .rb.n .ck .q { font-size: 24px; }
.sb-cfb-espn-20 .ck .q { color: #e9c44a; font-size: 30px; } .sb-cfb-espn-20 .ck .w { font-size: 30px; }
.sb-cfb-espn-20 .dn { width: ${DOWN}px; flex: none; margin: 4px 6px 5px 6px; display: grid; place-items: center; color: #111; font-size: 36px; font-weight: 800; text-transform: uppercase; background: linear-gradient(#f4f5f6, #cfd2d6); }
.sb-cfb-espn-20 .nt { height: 22px; flex: none; display: grid; place-items: center; padding: 0 14px; font-size: 16px; text-transform: uppercase; letter-spacing: .3px; white-space: nowrap; overflow: hidden; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const bar = el('div', 'bar');
    [g.away, g.home].forEach((t, k) => {
      const c = pair[k];
      // dark at the left end, rising to the full colour by the middle of the panel
      const tm = el('div', 'tm'); tm.style.background = 'linear-gradient(90deg, ' + shade(c, -0.6) + ', ' + shade(c, -0.25) + ' 10%, ' + c + ' 45%, ' + c + ')';
      // the name and record dark on a light colour a team took to part from a look-alike; every usual team colour keeps white letters
      tm.style.color = panelInk(t, c);
      // the school, as ESPN's short form reads on air: "MISSISSIPPI ST", "GEORGIA" (frame: Georgia v Mississippi State)
      const school = (t.longName && t.name && t.longName.endsWith(t.name) && t.longName !== t.name ? t.longName.slice(0, -t.name.length).trim() : t.abbr || '').replace(/ State$/, ' St');
      const nm = el('span', 'nm'); if (t.rank != null && t.rank <= 25) nm.appendChild(el('small', '', String(t.rank))); nm.appendChild(document.createTextNode(school));
      const id = el('div', 'id'); id.append(fit(nm), el('span', 'rc', t.record || ''));
      tm.append(id, logo(t, 56));
      const sc = g.status === 'pre' ? el('span', 'sc rec', '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      sc.style.background = 'linear-gradient(90deg, ' + alpha(c, 0.3) + ', ' + alpha(c, 0) + ' 55%), linear-gradient(#1f1e1f, #37383a)';
      if (live && t.hasBall) sc.appendChild(el('i', 'pz'));
      bar.append(tm);
      if (hasTo(g, t)) {
        // one parallelogram per timeout of this sport (football 3), centred on the body, the used ones dimmer; not counted again by the kit
        const n = timeoutCount(g), sl = el('span', 'sl'), pitch = n > 3 ? 54 / n : 18;
        for (let i = 0; i < n; i++) { const b = el('i', i >= t.timeouts ? 'used' : ''); b.style.top = (BAR - 4) / 2 + (i - (n - 1) / 2) * pitch - 9.5 + 'px'; if (n > 3) b.style.transform = 'scaleY(' + (pitch / 18).toFixed(2) + ')'; sl.appendChild(b); }
        bar.appendChild(sl);
      }
      bar.append(sc);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', 'q', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toUpperCase())), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    const rb = el('div', 'rb' + (g.note ? ' n' : '')), rw = el('div', 'rw');
    rw.appendChild(ck);
    if (live && g.football && g.football.short) rw.appendChild(el('span', 'dn', g.football.short));
    if (g.note) rb.appendChild(fit(el('div', 'nt', g.note)));
    rb.appendChild(rw); bar.appendChild(rb);
    root.appendChild(bar);
  },
};
