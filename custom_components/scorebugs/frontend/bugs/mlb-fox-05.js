// "Dark strip '05": after FOX's MLB score strip from the 2004 postseason through 2005. A near-black strip across the top: the bases as three silver tiles over its
// left end with a small white plate under them, each team's letters in its own colour with a white score, the half inning (a
// yellow-green arrow), the outs, and at the right the round's name in white italic and the network's mark (here the Home Assistant
// logo). The frame shows no count, so none is drawn.
// measured: strip 69% of the bug's height, the bases' cluster 10% of the width, flattened to about half as if seen in
// perspective; letters bold condensed, upright, caps 0.24 of
// the height; team letters a bright tint of the team's colour (as on air: navy shown as a light blue). Drawn soft (bug_tv: clean turns
// it off). The strip hugs what it holds.
// each team's letters white on a cell of its colour, its score on a black cell; home plate pulled up under the
// middle of the bases (frame: the plate's top 2 px under the cluster's foot on a 34 px strip, its middle within 1 px of the cluster's).
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, teamPair, panelInk, FONTS } from '../kit.js';

const W = 1218, H = 102;

export default {
  id: 'mlb-fox-05',
  size: { w: W, h: H },
  tv: 'soft',
  hug: '.row',
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-mlb-fox-05 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 75%; color: #e6e6e2; }
/* the strip: see-through black, the picture showing through, a faint light along its top */
.sb-mlb-fox-05 .row { position: absolute; left: 0; top: 6px; height: 70px; display: flex; align-items: center; box-sizing: border-box; padding: 0 24px 0 146px;
  background: linear-gradient(rgba(40,42,34,.72), rgba(0,0,0,.62) 35%, rgba(0,0,0,.68)); font-size: 35px; line-height: 1; white-space: nowrap; }
/* thin light lines part the strip: bases | away | home | inning | outs | the round and the mark; each
 leans like a backslash, top to the left, 24 deg from upright (measured on his marks: 19, 27 and 27 deg) */
.sb-mlb-fox-05 .dv { align-self: stretch; flex: none; width: 2px; margin: 0 22px; background: rgba(226,228,232,.62); transform: skewX(24deg); }
/* each team: its letters white on a cell of its colour, then its score on a black cell; both cells lean with the lines (24 deg) and
   fill the strip's height, their contents stood upright again */
.sb-mlb-fox-05 .ab, .sb-mlb-fox-05 .sc { align-self: stretch; flex: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box; transform: skewX(24deg); }
.sb-mlb-fox-05 .ab { min-width: 112px; padding: 0 12px; color: #fff; letter-spacing: 1px; text-shadow: 1px 1px 0 rgba(0,0,0,.35); }
/* the sections joined, no gaps: each team cell starts at the line before it and its score cell runs on to the line
 after it (they stood 12 px off each line, a black wedge showing) */
.sb-mlb-fox-05 .dv + .ab { margin-left: -22px; }
.sb-mlb-fox-05 .ab > span, .sb-mlb-fox-05 .sc > .s { transform: skewX(-24deg); }
.sb-mlb-fox-05 .sc { min-width: 74px; padding: 0 12px; background: linear-gradient(#17181b, #0b0c0e 45%, #050506); margin-right: -22px; }
.sb-mlb-fox-05 .s { min-width: 40px; text-align: center; }
/* before the game the records keep a score box's full width (the kit's em width shrinks with the record's own size) */
.sb-mlb-fox-05 .s.sb-pre-rec { min-width: 76px !important; }
.sb-mlb-fox-05 .inn b { color: #c8d838; font-size: .62em; margin-right: 8px; vertical-align: 3px; } .sb-mlb-fox-05 .inn .sb-ord { font-size: .7em; }
.sb-mlb-fox-05 .o small { font-size: .62em; margin-left: 3px; }
.sb-mlb-fox-05 .rd { margin-left: 100px; font-family: 'SB Archivo', sans-serif; font-style: italic; font-weight: 800; font-size: 38px; letter-spacing: -1px; color: #f4f4f4; text-shadow: 2px 2px 0 rgba(0,0,0,.6); }
.sb-mlb-fox-05 .mk { margin-left: 26px; display: grid; place-items: center; width: 92px; height: 48px; color: #fff; }
/* the tiles seen in perspective: each tile about half as tall as wide on the frame (cluster 48 x 126 at bug scale), so flattened to 52% */
.sb-mlb-fox-05 .bz { position: absolute; left: 15px; top: 15px; transform: scaleY(.52); transform-origin: top; }
.sb-mlb-fox-05 .bz .sb-bases i { background: linear-gradient(135deg, #c2bcbc, #8a8284 55%, #605a5c); border: 2px solid rgba(10,10,10,.6); }
.sb-mlb-fox-05 .bz .sb-bases i.on { background: linear-gradient(135deg, #fff6a8, #f2c822 55%, #c49010); }
.sb-mlb-fox-05 .hp { position: absolute; left: 65px; top: 64px; width: 26px; height: 19px; background: #f0f0ec; clip-path: polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%); }
.sb-mlb-fox-05 .row.os { padding-left: 24px; }
.sb-mlb-fox-05 .dt { font-size: 30px; color: #c8d838; margin-left: 4px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const os = otherSport(g);
    const row = el('div', 'row');
    // another sport's game: no bases hanging at the strip's end; one detail of the game opens the strip instead (none: the strip starts
    // at the first team), then the period in the inning's spot and the clock in the count's, no outs
    if (os) { row.classList.add('os'); if (os.detail) row.appendChild(el('span', 'dt', os.detail)); }
    const dv = () => row.appendChild(el('span', 'dv'));
    dv();
    // each team's cell in its colour (two look-alike teams: the home team takes its other colour), letters white where white reads
    const cols = teamPair(g.away, g.home);
    [g.away, g.home].forEach((t, i) => {
      const ab = el('span', 'ab');
      ab.appendChild(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)));
      ab.style.background = 'linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,0) 45%, rgba(0,0,0,.22)), ' + cols[i];
      ab.style.color = panelInk(t, cols[i]);
      const sc = el('span', 'sc');
      sc.appendChild(scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      row.append(ab, sc);
      dv();
    });
    const inn = el('span', 'inn');
    if (live) { inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), g.period.label); inn.appendChild(el('span', 'sb-ord', g.period.suffix || '')); }
    else inn.textContent = os ? os.period : statusText(g, time);
    row.appendChild(inn);
    if (live) { dv(); const o = el('span', 'o', String(b.outs)); o.appendChild(el('small', '', 'OUT')); row.appendChild(o); }
    else if (os) { dv(); row.appendChild(el('span', 'o', os.clock)); }
    dv();
    // the round's name only in a real postseason game (from the game's note)
    const post = !!(g.round && g.round.dress && g.round.dress !== 'regular');
    const round = /\b(ALDS|NLDS|ALCS|NLCS|WORLD SERIES|WILD CARD)\b/i.exec(post ? g.note || '' : '');
    if (round) row.appendChild(el('span', 'rd', round[1].toUpperCase()));
    const m = el('span', 'mk'); if (marks(opts).ha) m.appendChild(haMark(44));
    row.appendChild(m);
    root.appendChild(row);
    if (!os) { const bz = el('div', 'bz'); bz.appendChild(bases(b ? b.bases : null, 41)); root.append(bz, el('div', 'hp')); }
  },
};
