// "Logo panels '26": after the MLB bar on NBC and Peacock (2026 on; frame: Diamondbacks at Dodgers, Sunday Night Baseball). A low bar: each
// team a block of its colour with its logo, then a second block of the same colour with the score; a dark section with the bases in
// gold and, under it, the half inning and the outs as dots; and the count at the right end under the network's place (here the Home
// Assistant logo). A dark line under the team blocks carries the records (on air, the pitcher and batter, which the sensor does not
// have). The pitch clock is not in the data either.
// Two bugs had been built from this one frame (Logo panels '26 and Glossy strip '26); merged on the picks: the
// separate blocks, their sizes, the records line and the glossy gradients from Glossy strip; from Logo panels the square top, every
// block level along one line, and the logos' versions for team-colour grounds with heavier figures, which read better. The old id
// mlb-strip-26 now draws this bug (kit RETIRED).
import { el, otherSport, logo, bases, inning, pips, statusText, teamColor, shade, haMark, marks, FONTS } from '../kit.js';

const W = 860, H = 154, TOP = 112, SCORE_W = 138, DIA_W = 170;

export default {
  id: 'mlb-nbc-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the two score blocks and the empty bases section go and the bar closes up (a second logo in the empty block
  // read as a stutter)
  // after the game the empty bases section goes too: FINAL takes the count's place (it sat in a wide empty end)
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W - DIA_W, h: H } : g.status === 'live' ? { w: W, h: H } : { w: W - DIA_W, h: H }),
  // measured against the frame by the automatic audit: text -4% vs the broadcast, logos -10%; 80 % of the correction
  logoScale: 1.087,
  logos: 'dark',   // the logos' versions for team-colour grounds (frame: the Dodgers' white LA on blue)
  fonts: [FONTS.barlowCond600, FONTS.barlow800],
  css: `
.sb-mlb-nbc-26 { font-family: 'SB Barlow Condensed', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 108%; color: #fff; }
.sb-mlb-nbc-26 { font-weight: 600; }   /* NBC MLB 2026: Barlow Condensed SemiBold */
.sb-mlb-nbc-26 .bar { position: absolute; inset: 0; display: grid; grid-template-columns: 132px ${SCORE_W}px 132px ${SCORE_W}px ${DIA_W}px 150px; grid-template-rows: ${TOP}px 1fr;
  background: linear-gradient(#2a2b2f, #141518 60%); overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
/* a thin light blue-grey rim round the whole bar, over the blocks (frame: 1-2 px of about 160,180,200 on a 98 px bar) */
.sb-mlb-nbc-26 .bar::after { content: ''; position: absolute; inset: 0; border: 3px solid rgba(176,190,208,.8); pointer-events: none; z-index: 2; }
/* square blocks, all level with the bar's top edge: one straight line across */
.sb-mlb-nbc-26 .lg, .sb-mlb-nbc-26 .sc { display: grid; place-items: center; position: relative; margin: 0 2px 0 0; overflow: hidden; }
/* on air the logo block and the score block are the same colour, each a rounded pillow: a lighter top, a hard darker horizon just under the
 middle, then the colour */
.sb-mlb-nbc-26 .sb-logo { width: 110px; height: 100px; object-fit: contain; }
/* the score and count figures wide and heavy as on air (a '2' nearly as wide as tall): Barlow 800 at normal width */
.sb-mlb-nbc-26 .sc, .sb-mlb-nbc-26 .cnt > span:not(.w) { font-family: 'SB Barlow', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 100%; }
.sb-mlb-nbc-26 .sc { font-size: 78px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.4); }
.sb-mlb-nbc-26 .dia { grid-column: 5; grid-row: 1 / 3; display: grid; justify-items: center; align-content: center; gap: 4px; border-left: 2px solid #2c2d31; }
.sb-mlb-nbc-26 .sb-bases i { border: 4px solid #8c8c8c; background: transparent; } .sb-mlb-nbc-26 .sb-bases i.on { border-color: #f2b21b; background: #f2b21b; }
.sb-mlb-nbc-26 .dia .ln { display: flex; align-items: center; gap: 34px; font-size: 32px; }
.sb-mlb-nbc-26 .dia .ln .h { color: #fff; } .sb-mlb-nbc-26 .dia .ln .h::first-letter { color: #f2b21b; }
.sb-mlb-nbc-26 .sb-pips { display: flex; gap: 8px; } .sb-mlb-nbc-26 .sb-pips i { width: 22px; height: 22px; border-radius: 50%; background: #f2f2f2; }
.sb-mlb-nbc-26 .sb-pips i.used { background: transparent; box-shadow: inset 0 0 0 3px #6c6c6c; }
.sb-mlb-nbc-26 .cnt { grid-column: 6; grid-row: 1 / 3; display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; font-size: 46px; border-left: 2px solid #2c2d31; padding: 8px 0 6px; box-sizing: border-box; }
.sb-mlb-nbc-26 .cnt .sb-ha { color: #9a9b9e; align-self: center; }   /* the network's mark sits over the count on air: the Home Assistant mark, greyed like the peacock */
.sb-mlb-nbc-26 .cnt > span:only-child { grid-row: 1 / 3; }
.sb-mlb-nbc-26 .cnt .w { font-size: 30px; text-align: center; line-height: 1.15; }
.sb-mlb-nbc-26 .rec { grid-row: 2; grid-column: span 2; display: flex; align-items: center; padding: 0 16px; font-size: 22px; letter-spacing: .5px; background: #0d0e10; color: #e9e9e9; white-space: nowrap; overflow: hidden; }
.sb-mlb-nbc-26 .dia .dt { font-size: 30px; line-height: 1.05; text-align: center; white-space: pre-line; padding: 0 8px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball; // a baseball bug forced onto another sport's game shows only the scores
    const bar = el('div', 'bar');
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#4a4f57');
      const lg = el('div', 'lg');
      const pillow = 'linear-gradient(' + shade(c, 0.24) + ', ' + shade(c, 0.08) + ' 44%, ' + shade(c, -0.12) + ' 47%, ' + c + ' 80%, ' + shade(c, -0.08) + ')';
      lg.style.background = pillow;
      lg.appendChild(logo(t, 110));
      bar.appendChild(lg);
      if (g.status === 'pre') return;
      const sc = el('div', 'sc', t.score != null ? String(t.score) : '');
      sc.style.background = pillow;
      bar.appendChild(sc);
    });
    const dia = el('div', 'dia');
    const os = otherSport(g, 8);
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (os) {
      if (os.detail) dia.appendChild(el('div', 'dt', os.detail));
      const ln = el('div', 'ln'); ln.appendChild(el('span', 'h', os.period)); dia.appendChild(ln);
    }
    if (live) {
      dia.appendChild(bases(g.baseball.bases, 34));
      const ln = el('div', 'ln');
      ln.append(el('span', 'h', inning(g)), pips(g.baseball.outs, 2));
      dia.appendChild(ln);
    }
    if (g.status === 'pre') bar.style.gridTemplateColumns = '132px 132px 150px';
    const cnt = el('div', 'cnt');
    if (g.status === 'pre') cnt.style.gridColumn = '3';
    else if (!live && !os) { cnt.style.gridColumn = '5'; bar.style.gridTemplateColumns = '132px ' + SCORE_W + 'px 132px ' + SCORE_W + 'px 150px'; }   // FINAL in the count's place, no empty bases section
    if (marks(opts).ha) cnt.appendChild(haMark(70));
    cnt.appendChild(live ? el('span', '', g.baseball.balls + '-' + g.baseball.strikes) : os ? el('span', '', os.clock) : el('span', 'w', statusText(g, time)));
    if (live || os) bar.appendChild(dia);
    bar.appendChild(cnt);
    // the records under the two team blocks
    [g.away, g.home].forEach((t) => {
      const r = el('div', 'rec', [(t.abbr || '').toUpperCase(), t.record].filter(Boolean).join('  '));
      if (g.status === 'pre') r.style.gridColumn = 'span 1';
      // the line under a team runs from a dark shade of its colour into black
      r.style.background = 'linear-gradient(90deg, ' + shade(teamColor(t, '#4a4f57'), -0.45) + ', #0d0e10 85%)';
      bar.appendChild(r);
    });
    root.appendChild(bar);
  },
};
