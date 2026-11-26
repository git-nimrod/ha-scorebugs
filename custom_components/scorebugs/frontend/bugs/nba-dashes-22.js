// "Dash panels '22": after an NBA regional broadcast's bug of the early 2020s (a 326 x 116 px box, fair). Two glossy team panels side by side,
// split on a slight lean: the away team's logo at the outer end and its big score towards the middle, the home team the mirror of it;
// under each a band of the team's colour with "TO" and a dash for each timeout left; under both a dark bar with the quarter in words and
// the clock. Left out (no data): the shot clock's grey box at the right of the dark bar, and the bonus ("PENALTY") and fouls-to-give
// ("FLS") marks at the right of each band. The bug carries no network mark, so there is no Home Assistant logo either.
// the dark bar black, near-black #0d0d0e with a touch of lift at the top.
// measured (x3 here): panels 0.66 of the height (the score part 0.46, the timeout band 0.2), a 3 px gap,
// the dark bar 0.27 (#2f2d2b); the split between the panels leans 11.2 deg (top to the right; compare.py edge reading); the scores' capitals 0.57 of the score
// part, italic about 12 deg, white with a light grey foot; the dashes 15 x 40 here, leaning like the letters; the quarter's words 0.13 of the height, the clock 0.17; a 1 px light rim all round.
import { el, logo, statusText, teamPair, panelInk, shade, scoreSlot, pips, FONTS } from '../kit.js';

const W = 980, H = 350, TOP = 162, BAND = 70, GAP = 9, BAR = H - TOP - BAND - GAP - 6, LEAN = 11.2, LOGO = 253;
const WORDS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
// the sport's own word for the part being played: period in hockey, half in
// men's college basketball and soccer, quarter otherwise; OT and SO spelled out
const UNIT = (g) => (g.sport === 'hockey' ? ' PERIOD' : g.league === 'NCAAM' ? ' HALF' : ' QUARTER');
const OVER = { OT: 'OVERTIME', SO: 'SHOOTOUT', HALF: 'HALFTIME', '1H': 'FIRST HALF', '2H': 'SECOND HALF', ET: 'EXTRA TIME' };
const periodWords = (p, g) => (p.word ? OVER[p.label] || p.label.replace(/^(\d)OT$/, '$1 OT') : WORDS[p.n - 1] ? WORDS[p.n - 1] + UNIT(g) : (p.label || '') + (p.suffix || ''));

export default {
  id: 'nba-dashes-22',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi800i, FONTS.barlowSemi700i],
  css: `
.sb-nba-dashes-22 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; font-style: italic; color: #fff;
  background: #0b0c0e; box-shadow: inset 0 0 0 2px rgba(240,232,226,.85); }
.sb-nba-dashes-22 .row { position: absolute; left: 3px; right: 3px; display: grid; grid-template-columns: 1fr 1fr; }
.sb-nba-dashes-22 .top { top: 3px; height: ${TOP + BAND}px; background: #e6e0da; }
/* each side: the score part over the timeout band; the two sides meet on a line leaning ${LEAN} deg, top to the right */
.sb-nba-dashes-22 .side { position: relative; display: grid; grid-template-rows: ${TOP}px ${BAND}px; overflow: hidden; }
.sb-nba-dashes-22 .side.a { margin-right: -23px; clip-path: polygon(0 0, 100% 0, calc(100% - 46px) 100%, 0 100%); }
/* on air a light rule about 4 px wide (13 here) parts the two panels along the lean */
.sb-nba-dashes-22 .side.h { margin-left: -23px; clip-path: polygon(59px 0, 100% 0, 100% 100%, 13px 100%); }
.sb-nba-dashes-22 .pan { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 34px 0 30px; overflow: hidden; }
.sb-nba-dashes-22 .h .pan { flex-direction: row-reverse; padding: 0 0 0 58px; }
/* a glossy panel: a light diagonal band across the colour, darker at the foot */
.sb-nba-dashes-22 .pan::before { content: ''; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(112deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.16) 46%, rgba(255,255,255,0) 60%), linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 45%, rgba(0,0,0,.16)); }
/* the logos big, as on air: the Thunder's about 0.46 of its panel's width and the Blazers' cut by the panel's outer end (checked Nov 24:
 at 150 they came out half the frame's size)

 (the logo's slot keeps its old width so the scores keep their gap at the split; the logo spills past it towards the outer end) */
/*: on the frame the Blazers' pinwheel stands
 about 1.45 of its score part's height, its foot 1-2 px (4 %) above the part's foot and its top cut off by the panel's top edge. Each
 logo now stands on the panel's foot (8 px above it) and grows upwards, so a tall or round logo runs out of the top and is cut there;
 a wide logo (the Thunder's shield) still sits whole in the middle. */
.sb-nba-dashes-22 .lg { position: relative; width: 230px; height: ${TOP}px; display: flex; align-items: flex-end; justify-content: flex-end; flex: none; }
.sb-nba-dashes-22 .h .lg { width: 230px; margin-right: -10px; justify-content: flex-start; }
.sb-nba-dashes-22 .sb-logo { width: ${LOGO}px; height: ${LOGO}px; flex: none; object-fit: contain; object-position: 50% 100%; margin-bottom: 8px; }
.sb-nba-dashes-22 .sc { position: relative; font-weight: 800; font-size: 128px; line-height: 1; text-align: right; letter-spacing: -1px;
  color: inherit; text-shadow: 0 -2px 0 rgba(255,255,255,.35), 0 3px 0 rgba(0,0,0,.18); }
/* the score's slot held to three of this face's narrow figures (1.6 em, not the kit's 2.1), so the bigger logos and a 3-figure score both fit */
.sb-nba-dashes-22 .sc.sb-num { min-width: 1.6em !important; }
.sb-nba-dashes-22 .h .sc { text-align: left; }
.sb-nba-dashes-22 .band { display: flex; align-items: center; gap: 22px; padding: 0 32px; font-size: 54px; box-shadow: inset 0 2px 0 rgba(255,255,255,.3); }
.sb-nba-dashes-22 .h .band { padding-left: 46px; }
.sb-nba-dashes-22 .sb-pips { display: flex; gap: 9px; }
/* the dashes take the letters' colour (white, or dark on a light band such as GS gold) */
.sb-nba-dashes-22 .sb-pips i { width: 15px; height: 40px; background: currentColor; transform: skewX(-12deg); }
.sb-nba-dashes-22 .sb-pips i.used { opacity: 0; }
.sb-nba-dashes-22 .bar { bottom: 3px; height: ${BAR}px; display: flex; align-items: center; gap: 20px; padding: 0 30px; box-sizing: border-box;
  background: linear-gradient(#1a1a1a, #0d0d0e 50%, #050505); font-size: 64px; }
.sb-nba-dashes-22 .pw { flex: 1; letter-spacing: .5px; }
.sb-nba-dashes-22 .ck { font-weight: 800; font-size: 80px; line-height: 1; margin-right: 34px; }
.sb-nba-dashes-22 .w { flex: 1; text-align: center; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    // never two look-alike panels (two navies), and dark letters on a light panel (GS gold)
    const [ca, ch] = teamPair(g.away, g.home, '#4a5560');
    const top = el('div', 'row top');
    [[g.away, ca, 'a'], [g.home, ch, 'h']].forEach(([t, c, s]) => {
      const side = el('div', 'side ' + s);
      side.style.color = panelInk(t, c);
      const pan = el('div', 'pan');
      pan.style.background = 'linear-gradient(90deg, ' + shade(c, s === 'a' ? -0.18 : 0.04) + ', ' + c + ' 45%, ' + shade(c, s === 'a' ? 0.04 : -0.18) + ')';
      // the logo stands on the panel's foot and is cut only at the top (its own crop: the kit's focal-point slide stays out of it)
      const im = logo(t, LOGO); im.dataset.crop = 'foot';
      const lg = el('div', 'lg'); lg.appendChild(im);
      pan.append(lg, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      const band = el('div', 'band');
      band.style.background = 'linear-gradient(' + shade(c, 0.16) + ', ' + shade(c, 0.04) + ')';
      if (live && t.timeouts != null) band.append(el('span', '', 'TO'), pips(t.timeouts, 7));
      side.append(pan, band);
      top.appendChild(side);
    });
    const bar = el('div', 'row bar');
    if (live) bar.append(el('span', 'pw', periodWords(g.period, g)), el('span', 'ck', g.clock || ''));
    else bar.appendChild(el('span', 'w', statusText(g, time)));
    root.append(top, bar);
  },
};
