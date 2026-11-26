// "Header blocks '25": after USA Network's college football bug (2025; frame: Wyoming at Colorado State). Each team a block in its colour
// with its logo large and faint behind its name, its score in white towards the middle with three timeout dashes under it; the middle a
// black column with the network's mark (here the Home Assistant logo), the clock and the quarter. Above, a dark header row: the down and
// distance over the team with the ball and the conference or the game's note over the middle.
import { el, logo, ordinal, statusText, teamColor, shade, haMark, marks, teamInk, scoreSlot, fit, FONTS } from '../kit.js';

const W = 1100, H = 140, HEAD = 40, MID = 150, SHUT = 70;   // SHUT: what each block gives up before the game (half the score column: the faint logo keeps clear of the name)
const HEAD_PX = 24, NAME_PX = 32, SCORE_PX = 60, CLOCK_PX = 30, SUB_PX = 22;

export default {
  id: 'cfb-usa-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score columns go and both blocks close up on the middle
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SHUT, h: H } : { w: W, h: H }),
  fonts: [FONTS.archivo, FONTS.barlowCond700],
  css: `
.sb-cfb-usa-25 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; font-stretch: 90%; color: #fff; display: grid; grid-template-columns: 1fr ${MID}px 1fr; grid-template-rows: ${HEAD}px minmax(0, 1fr); height: ${H}px;
.sb-cfb-usa-25 { font-weight: 800; font-stretch: 125%; }   /* face: Archivo 800 at 125% width (low confidence) */
  box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-cfb-usa-25 .hd { display: grid; place-items: center; background: #15171b; font-size: ${HEAD_PX}px; }
.sb-cfb-usa-25 .hd.md { background: #0a0b0c; letter-spacing: 1px; }
.sb-cfb-usa-25 .tm { position: relative; overflow: hidden; display: grid; grid-template-columns: minmax(0, 1fr) 140px; align-items: center; padding-left: 24px; }
.sb-cfb-usa-25 .tm.h { grid-template-columns: 140px minmax(0, 1fr); padding: 0 24px 0 0; }
/* the logo faint and in one tone, not full colour: a pale ghost of it in the block (the frame's Wyoming cowboy) */
.sb-cfb-usa-25 .tm .sb-logo { position: absolute; top: 6px; width: 140px; height: 88px; object-fit: contain; opacity: .3; filter: grayscale(1) brightness(1.8) contrast(.8) !important; }
.sb-cfb-usa-25 .tm.a .sb-logo { left: 0; right: 140px; margin: 0 auto; } .sb-cfb-usa-25 .tm.h .sb-logo { left: 140px; right: 0; margin: 0 auto; }
/* the logo centred in the name's half of the block, the name centred over it */
.sb-cfb-usa-25 .tm .nm { justify-self: center; text-align: center; }
/* a tiny football beside the name of the team with the ball */
.sb-cfb-usa-25 .fb { display: inline-block; width: 26px; height: 16px; margin: 0 8px; vertical-align: .12em; border-radius: 50%; background: radial-gradient(ellipse at 40% 35%, #b4652e, #6e3412 70%); box-shadow: 0 1px 2px rgba(0,0,0,.6);
  -webkit-mask: none; position: relative; }
.sb-cfb-usa-25 .fb::after { content: ''; position: absolute; left: 7px; right: 7px; top: 7px; height: 2px; background: #fff; box-shadow: 3px -3px 0 -0px transparent; }
/* names 46 px: capitals a third of the block's height, as on air (frame: 22 of 68 px) */
/* the names in a bold condensed face at its own width, not a wide face squeezed (no source names USA's) */
.sb-cfb-usa-25 .nm, .sb-cfb-usa-25 .hd { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 100%; letter-spacing: .5px; }
.sb-cfb-usa-25 .nm { position: relative; z-index: 2; font-size: ${NAME_PX * 1.44}px; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.7), 0 0 8px rgba(0,0,0,.5); }   /* the name reads over the faint logo behind it */
.sb-cfb-usa-25 .scc { position: relative; display: grid; justify-items: center; gap: 4px; }
.sb-cfb-usa-25 .sc { position: relative; z-index: 2; font-size: ${SCORE_PX}px; line-height: 1; font-stretch: 100%; font-weight: 800; }   /* always over the faint logo (Harvard's red showed through) */
.sb-cfb-usa-25 .rec { position: relative; z-index: 2; font-size: 26px; opacity: .92; margin-top: 2px; }
.sb-cfb-usa-25 .sb-pips { display: flex; gap: 6px; min-height: 4px; } .sb-cfb-usa-25 .sb-pips i { width: 30px; height: 4px; background: #fff; } .sb-cfb-usa-25 .sb-pips i.used { opacity: .25; }
.sb-cfb-usa-25 .md2 { display: grid; grid-template-rows: 1fr 1fr 1fr; justify-items: center; align-items: center; background: linear-gradient(#141518, #000); }
.sb-cfb-usa-25 .md2 .sb-ha { color: #f2f2f2; } .sb-cfb-usa-25 .md2 .ck { font-size: ${CLOCK_PX}px; line-height: 1; } .sb-cfb-usa-25 .md2 .q { font-size: ${SUB_PX}px; }
.sb-cfb-usa-25 .md2 .w { grid-row: 2 / 4; font-size: ${CLOCK_PX * 0.75}px; }
.sb-cfb-usa-25 .sb-ord { font-size: .7em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const down = live && g.football && g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()) : '';
    root.append(el('div', 'hd', live && g.away.hasBall ? down : ''), el('div', 'hd md', (g.note || g.league || '').toUpperCase().slice(0, 18)), el('div', 'hd', live && g.home.hasBall ? down : ''));
    const block = (t, k) => {
      const c = teamColor(t, '#3a3f47');
      const b = el('div', 'tm ' + k);
      b.style.background = 'linear-gradient(' + shade(c, 0.05) + ', ' + shade(c, -0.15) + ')';
      b.style.color = teamInk(c);
      const scc = el('div', 'scc'), pp = el('span', 'sb-pips');
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) pp.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      scc.append(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g), pp);
      const nm = fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase());
      if (live && t.hasBall && g.sport === 'football') { const fb = el('span', 'fb'); if (k === 'a') nm.appendChild(fb); else nm.insertBefore(fb, nm.firstChild); }
      const lg = logo(t, 140);
      b.appendChild(lg);
      if (g.status === 'pre') { b.style.gridTemplateColumns = 'minmax(0, 1fr)'; lg.style.left = '0'; lg.style.right = '0'; const id = el('div', ''); id.style.cssText = 'display:grid;justify-items:center'; id.append(nm); if (t.record) id.append(el('span', 'rec', t.record)); b.append(id); }   // the record under the name before the game   // no score column before the game
      else if (k === 'a') b.append(nm, scc); else b.append(scc, nm);
      return b;
    };
    const md = el('div', 'md2');
    md.appendChild(marks(opts).ha ? haMark(32) : el('span'));
    if (live) md.append(el('span', 'ck', g.clock || ''), ordinal(g.period, 'q'));
    else md.appendChild(el('span', 'w', statusText(g, time)));
    root.append(block(g.away, 'a'), md, block(g.home, 'h'));
  },
};
