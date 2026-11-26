// "Silver strip '06": after FOX's World Series score strip of 2005-2007. A brushed silver strip across the top: the bases as three tiles over its left end (yellow
// when taken) with a small white plate under them, each team's letters on a slanted cell in its colour with the score on white, then
// the half inning, the outs and the count in dark letters, and at the right the league's logo and the network's mark (here the Home
// Assistant logo).
// measured: strip 58% of the bug's height, team cells lean about 14 deg on their right side, the bases' cluster with its plate 86% tall, the tiles half as tall as wide;
// letters bold condensed, upright, caps 0.28 of the height, dark grey on the silver. Drawn soft (bug_tv: clean turns it off).
// The strip hugs what it holds.
// team letters centred in their cells (measured on the ink: they sat 4.5 px right of the cell's middle), the
// plate up 6 px to tuck under the bases' black ground, the inning 20% bigger.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, leagueLogo, teamPair, teamColor, panelInk, FONTS } from '../kit.js';

const W = 1305, H = 108;

export default {
  id: 'mlb-fox-06',
  size: { w: W, h: H },
  tv: 'soft',
  hug: '.row',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-fox-06 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 75%; color: #2e3034; }
/* the silver strip: light top, a soft shade under the middle, a dark line along its foot */
.sb-mlb-fox-06 .row { position: absolute; left: 0; top: 0; height: 62px; display: flex; align-items: center; box-sizing: border-box; padding: 0 22px 0 160px;
  background: linear-gradient(#eef0f0, #cfd2d3 45%, #b6babb 60%, #d0d3d4); box-shadow: inset 0 -2px 0 #6e7072; font-size: 44px; line-height: 1; white-space: nowrap; }
/* each team's cell in its colour and the score on a white box after it, every edge between parts leaning like a backslash (top to
 the left) 24 deg from upright, a thin line of the silver showing between them (his marked ALCS frame, and this frame's
 cell edges drift about 3 px over 7 rows, the same way) */
.sb-mlb-fox-06 .ab { height: 56px; display: grid; place-items: center; box-sizing: border-box; padding: 0 34px 0 38px; min-width: 153px; color: #fff; letter-spacing: 2px;
  margin-left: -26px; clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 100%, 25px 100%); }
.sb-mlb-fox-06 .ab:first-child { margin-left: 0; }
.sb-mlb-fox-06 .s { height: 56px; min-width: 64px; display: grid; place-items: center; margin: 0 4px 0 -22px; padding: 0 30px; background: linear-gradient(#ffffff, #e8eaea 50%, #d6d8d8);
  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 100%, 25px 100%); }
/* bigger scores. Measured on the frame: the score's digits 10 of the strip's 15 light rows (0.67); ours were 30 of 62
 px (0.48), so 62 px type (was 44): digits 40 px, 0.65 of the strip. Records before the game keep their size */
.sb-mlb-fox-06 .s:not(.sb-pre-rec) { font-size: 62px; }
/* the thin leaning lines between the inning, the outs, the count, the league's logo and the mark: white with a grey shade beside */
.sb-mlb-fox-06 .dv { align-self: stretch; flex: none; width: 3px; margin: 3px 20px; background: linear-gradient(90deg, rgba(96,100,104,.7) 33%, #ffffff 33%); transform: skewX(24deg); }
/* before the game the records keep a score box's full width (the kit's em width shrinks with the record's own size) and the box
   stands clear of the team cell (tucked under it, the kit read the record as touching the letters and shrank it to a speck) */
.sb-mlb-fox-06 .s.sb-pre-rec { min-width: 84px !important; margin-left: 2px; }
.sb-mlb-fox-06 .inn { margin-left: 18px; font-size: 1.2em; } .sb-mlb-fox-06 .inn b { font-size: .55em; margin-right: 8px; vertical-align: 4px; } .sb-mlb-fox-06 .inn .sb-ord { font-size: .7em; }
.sb-mlb-fox-06 .o small { font-size: .7em; margin-left: 3px; }
.sb-mlb-fox-06 .lg { display: grid; place-items: center; width: 100px; height: 56px; }
.sb-mlb-fox-06 .mk { display: grid; place-items: center; width: 80px; height: 56px; color: #3a3c40; }
/* the tiles seen in perspective: each tile about half as tall as wide on the frame (cluster 60 px tall at bug scale), so flattened to 58%;
 set lower so the outer corners of first and third sit on the strip's foot, on a black ground that fills between the tiles */
.sb-mlb-fox-06 .bz { position: absolute; left: 15px; top: 21px; transform: scaleY(.58); transform-origin: top; }
.sb-mlb-fox-06 .bz .sb-bases i { background: linear-gradient(135deg, #ffffff, #d8dada 55%, #a8aaaa); border: 3px solid #0b0c0e; box-shadow: 0 0 0 5px #0b0c0e; }
.sb-mlb-fox-06 .bz .sb-bases i.on { background: linear-gradient(135deg, #fff6a8, #f2d230 55%, #c8a010); }
.sb-mlb-fox-06 .hp { position: absolute; left: 73px; top: 80px; width: 24px; height: 20px; background: #f4f4f2; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
.sb-mlb-fox-06 .row.os { padding-left: 22px; }
.sb-mlb-fox-06 .dt { font-size: 36px; margin-left: 6px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const mk = marks(opts);
    const cols = teamPair(g.away, g.home, '#8a1a22');
    // two look-alike teams (ARI v CIN): a team switched to a light other colour (CIN on white) takes letters that read on it; every other game keeps its white letters
    const ink = [g.away, g.home].map((t, i) => (cols[i].toLowerCase() !== String(teamColor(t, '#8a1a22')).toLowerCase() ? panelInk(t, cols[i]) : '#fff'));
    const os = otherSport(g);
    const row = el('div', 'row');
    // another sport's game: no bases hanging at the strip's end; one detail of the game opens the strip instead (none: the strip starts
    // at the first team), then the period in the inning's spot and the clock in the count's, no outs
    const dv = () => row.appendChild(el('span', 'dv'));
    if (os) { row.classList.add('os'); if (os.detail) { row.appendChild(el('span', 'dt', os.detail)); dv(); } }
    [g.away, g.home].forEach((t, i) => {
      const ab = el('span', 'ab', (t.abbr || '').toUpperCase().slice(0, 3));
      ab.style.background = 'linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,0) 45%, rgba(0,0,0,.15)), ' + cols[i];
      if (ink[i] !== '#fff') ab.style.color = ink[i];
      row.append(ab, scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
    });
    const inn = el('span', 'inn');
    if (live) { inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), g.period.label); inn.appendChild(el('span', 'sb-ord', g.period.suffix || '')); }
    else inn.textContent = os ? os.period : statusText(g, time);
    row.appendChild(inn);
    if (live) { dv(); const o = el('span', 'o', String(b.outs)); o.appendChild(el('small', '', 'OUT')); row.appendChild(o); dv(); row.appendChild(el('span', 'c', b.balls + '-' + b.strikes)); }
    else if (os) { dv(); row.appendChild(el('span', 'c', os.clock)); }
    const lg = el('span', 'lg'); if (mk.league) lg.appendChild(leagueLogo(g, 52));
    const m = el('span', 'mk'); if (mk.ha) m.appendChild(haMark(46));
    if (lg.children.length) { dv(); row.appendChild(lg); }
    if (m.children.length) { dv(); row.appendChild(m); }
    root.appendChild(row);
    if (!os) { const bz = el('div', 'bz'); bz.appendChild(bases(b ? b.bases : null, 46)); root.append(bz, el('div', 'hp')); }
  },
};
