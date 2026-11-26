// "White panels '25": after the CW's college football bug (2025; frame: UNLV at Hawai'i). Each team's logo (ESPN's version for its own colour)
// on a block of its colour at the bar's rounded ends, then a white panel with its name, three timeout dashes in its colour, the down and distance on a tab in its colour when
// it has the ball, and a big black score towards the middle; the middle a black box with the network's mark (here the Home Assistant
// logo) over the quarter and the clock.
import { el, logo, ordinal, statusText, teamColor, contrast, shade, haMark, marks, teamInk, scoreSlot, fit, FONTS } from '../kit.js';

const W = 1100, H = 96, END = 120, MID = 190;
const NAME_PX = 28, SCORE_PX = 66, TAB_PX = 24, CLOCK_PX = 30;
const INK_MIN = 3;
const SCORE_W = 110;   // the team colour on white for the name, dashes and tab, else a darker shade of it

export default {
  id: 'cfb-cw-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: both score columns go and the panels close up on the clock
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -31% vs the broadcast; 80 % of the correction
  typeScale: 1.253,
  fonts: [FONTS.barlowCond700],
  logos: 'primary-on-primary',   // ESPN's version of the logo for the team's own colour: the letter mark where the school has one (UNLV, Hawai'i, Auburn); a school with none keeps its usual logo
  css: `
.sb-cfb-cw-25 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 85%; color: #111; display: grid; grid-template-columns: ${END}px 1fr ${MID}px 1fr ${END}px;
.sb-cfb-cw-25 { font-weight: 700; font-stretch: 100%; }   /* face: Barlow Condensed 700 (low confidence) */
  grid-template-rows: minmax(0, 1fr); height: ${H}px; border-radius: ${H / 2}px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-cfb-cw-25 .end { display: grid; place-items: center; overflow: hidden; }
/* rounded ends; in each, ESPN's own logo made for the team's colour (UNLV's white wordmark on red, Hawai'i's white H), never a drawn
 stand-in; a team ESPN has no such version for keeps its usual logo */
.sb-cfb-cw-25 .end .sb-logo { width: 86px; height: 66px; object-fit: contain; }
.sb-cfb-cw-25 .end.a .sb-logo { margin-left: 18px; } .sb-cfb-cw-25 .end.h .sb-logo { margin-right: 18px; }
.sb-cfb-cw-25 .pn { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 110px; align-items: center; background: linear-gradient(#ffffff, #e9eaec); padding-left: 16px; }
.sb-cfb-cw-25 .pn.h { grid-template-columns: 110px minmax(0, 1fr); padding: 0 16px 0 0; }
.sb-cfb-cw-25 .id { display: grid; gap: 4px; justify-items: stretch; } .sb-cfb-cw-25 .pn.h .id { text-align: right; }
.sb-cfb-cw-25 .nm { font-size: ${NAME_PX}px; white-space: nowrap; line-height: 1; }
/* the timeout dashes run the whole width of the name block */
.sb-cfb-cw-25 .sb-pips { display: flex; gap: 10px; min-height: 4px; } .sb-cfb-cw-25 .sb-pips i { flex: 1; }   /* keeps its row before the game, so the name does not move at kickoff */ .sb-cfb-cw-25 .sb-pips i { width: 40px; height: 4px; background: currentColor; } .sb-cfb-cw-25 .sb-pips i.used { opacity: .2; }
.sb-cfb-cw-25 .tab { justify-self: stretch; display: flex; justify-content: space-between; padding: 1px 10px; font-size: ${TAB_PX}px; color: #fff; min-height: 28px; line-height: 1.15; }   /* the name, dashes and tab fit the panel's height at the audited text size (the tab was cut off below) */
.sb-cfb-cw-25 .pn.h .sb-pips, .sb-cfb-cw-25 .pn.h .tab { justify-content: flex-end; }   /* the home side's dashes and record end under its name, as on air */
.sb-cfb-cw-25 .sc { text-align: center; font-size: ${SCORE_PX}px; line-height: 1; font-stretch: 72%; }   /* tall and narrow on air */
.sb-cfb-cw-25 .md { display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; background: linear-gradient(#1c1d20, #000); color: #fff; }
.sb-cfb-cw-25 .md .sb-ha { color: #ff6a13; } .sb-cfb-cw-25 .md .ck { display: flex; gap: 18px; font-size: ${CLOCK_PX}px; }
.sb-cfb-cw-25 .md .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-cfb-cw-25 .sb-ord { font-size: .62em; vertical-align: .5em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const end = (t, k) => { const c = teamColor(t, '#3a3f47'); const e = el('div', 'end ' + k); e.style.background = 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.15) + ')'; e.appendChild(logo(t, 86)); return e; };
    const panel = (t, k) => {
      const c = teamColor(t, '#3a3f47'), ink = contrast(c, '#ffffff') >= INK_MIN ? c : shade(c, -0.45);
      const p = el('div', 'pn ' + k), id = el('div', 'id');
      const nm = fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase());
      const pp = el('span', 'sb-pips'); pp.style.color = ink;
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) pp.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      // the down and distance on the panel of the team with the ball; the record otherwise (the tab keeps its room)
      const tab = el('span', 'tab', live && t.hasBall && g.football && g.football.short ? g.football.short : (t.record || ''));
      if (tab.textContent) { tab.style.background = ink; tab.style.color = teamInk(ink); }
      id.append(nm, pp, tab);
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      // the score column (110 px) already holds three figures in this tall narrow face: the slot's own room for basketball (three wide
      // figures, 170 px) ran past the column, so the score sat off centre and was cut by the middle box
      sc.style.minWidth = '0';
      // a three-figure score gets the column 24 px wider (the name has room to spare), so it keeps clear of the middle box and the panel's
      // end
      if (g.status !== 'pre' && [g.away.score, g.home.score].some((v) => v != null && v >= 100)) p.style.gridTemplateColumns = k === 'a' ? 'minmax(0, 1fr) 134px' : '134px minmax(0, 1fr)';
      if (g.status === 'pre') { p.style.gridTemplateColumns = 'minmax(0, 1fr)'; p.append(id); }   // no score column before the game
      else if (k === 'a') p.append(id, sc); else p.append(sc, id);
      return p;
    };
    const md = el('div', 'md');
    md.appendChild(marks(opts).ha ? haMark(34) : el('span'));
    const ck = el('span', 'ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) ck.appendChild(el('span', '', g.clock)); }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    md.appendChild(ck);
    root.append(end(g.away, 'a'), panel(g.away, 'a'), md, panel(g.home, 'h'), end(g.home, 'h'));
  },
};
