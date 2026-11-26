// "Postseason strip '07": after TBS's MLB postseason strip (2007-08; frame: Brewers at Phillies, NLDS). A thin navy strip across the top of
// the screen in framed cells: the channel's mark (here the Home Assistant logo), the round from the game's note, the bases in a diamond
// frame, each team's letters and score, the inning, the count, the outs, and the game of the series on a red cell.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, leagueLogo, ordinal, teamColor, FONTS } from '../kit.js';

const W = 1280, H = 64, PX = 32;

export default {
  id: 'mlb-tbs-07',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -14% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  hug: '.st',  // the strip ends at the game cell: no empty run before it
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-tbs-07 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-mlb-tbs-07 { font-weight: 800; font-stretch: 75%; }   /* face: Archivo 800 at 75% width (low confidence) */
/* on air it is one bar with a silver rim, its cells split by thin silver lines (not separately framed boxes): navy for the channel and the
 round, each team on its own colour with the score in a white box, black for the inning, the count and the outs, dark red for the game;
 the bases sit on a silver-edged diamond badge that stands out over the bar's top and bottom */
.sb-mlb-tbs-07 .st { position: absolute; left: 0; right: 0; top: 9px; bottom: 9px; display: flex; align-items: stretch; box-sizing: border-box; border: 4px solid #c6ccd8; border-radius: 8px;
  background: linear-gradient(#26282e, #0c0d10); box-shadow: 0 2px 6px rgba(0,0,0,.45); font-size: ${PX}px; line-height: 1; }
.sb-mlb-tbs-07 .c { display: flex; align-items: center; gap: 12px; padding: 0 14px; box-sizing: border-box; border-left: 4px solid #d3d8e0; box-shadow: inset 1px 0 0 #7d848f; background: linear-gradient(#2a2c32, #0b0c0f); }
/* heavier metal dividers, as Navy bar '09's rim; the score box only as wide as its figures and close to the next divider; the mark
 centred in its cell */
.sb-mlb-tbs-07 .c .sc { min-width: 1.3em !important; text-align: center; }
.sb-mlb-tbs-07 .c:has(> .sc) { padding-right: 6px; }
.sb-mlb-tbs-07 .c.ld { justify-content: center; } .sb-mlb-tbs-07 .c.ld .sb-ha { display: block; }
.sb-mlb-tbs-07 .c:first-child { border-left: 0; border-radius: 6px 0 0 6px; }
.sb-mlb-tbs-07 .c.ld { background: linear-gradient(#24447f, #0f2250 60%, #0a1838); gap: 10px; }
.sb-mlb-tbs-07 .c .sc { padding: 2px 8px 0; background: #f2f2f2; color: #15171c; }
.sb-mlb-tbs-07 .c.rd { background: linear-gradient(#a3201c, #5e0d0b); color: #f3dede; border-radius: 0 6px 6px 0; }
.sb-mlb-tbs-07 .c.in .ar { color: #e9d43a; } .sb-mlb-tbs-07 .c .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-mlb-tbs-07 .dm { position: relative; width: 76px; flex: none; display: grid; place-items: center; border-left: 0; background: none; padding: 0; margin: 0 -6px; z-index: 1; }
.sb-mlb-tbs-07 .dm::before { content: ''; position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; transform: rotate(45deg); box-sizing: border-box;
  border: 3px solid #d3d8e2; border-radius: 4px; background: linear-gradient(135deg, #3a3d44, #15171b); box-shadow: 0 1px 4px rgba(0,0,0,.6); }
/* bases sized and placed to the frame: each about a quarter of the diamond's height, second base near its top point, first and third at its widest */
.sb-mlb-tbs-07 .dm .sb-bases { position: relative; top: -6px; } .sb-mlb-tbs-07 .dm .sb-bases i { background: #7d828c; } .sb-mlb-tbs-07 .dm .sb-bases i.on { background: #fff; }
.sb-mlb-tbs-07 .dm + .c { border-left: 0; }
.sb-mlb-tbs-07 .sb-ha { color: #fff; } .sb-mlb-tbs-07 .nt { text-transform: uppercase; font-size: .85em; }
.sb-mlb-tbs-07 .c .rec { font-size: .62em; opacity: .92; white-space: nowrap; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false] };
    const st = el('div', 'st');
    const mk = marks(opts), lead = el('span', 'c ld');
    if (mk.ha) lead.appendChild(haMark(30));
    if (mk.league) lead.appendChild(leagueLogo(g, 30, null, true));   // the league's logo after the channel's, as on air
    // the round and the series game only in a real postseason game
    const post = !!(g.round && g.round.dress && g.round.dress !== 'regular');
    const round = post ? /\b(ALDS|NLDS|ALCS|NLCS|WORLD SERIES|WILD CARD)\b/i.exec(g.note || '') : null;
    if (round) lead.appendChild(el('span', 'nt', round[1]));
    const dm = el('span', 'c dm'); dm.appendChild(bases(live ? b.bases : [false, false, false], 16));  // small enough to sit inside the badge
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail after them (the badge goes), no outs
    st.appendChild(lead); if (!os) st.appendChild(dm);
    [g.away, g.home].forEach((t) => {
      const c = el('span', 'c'); c.style.background = teamColor(t, '#2a3f66');
      c.appendChild(el('span', '', (t.abbr || '').toUpperCase()));
      // before the first pitch there is no white score box (a logo squeezed into it read badly)
      if (g.status !== 'pre') c.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (t.record) c.appendChild(el('span', 'rec', t.record));  // records before the game, every time
      st.appendChild(c);
    });
    if (live) {
      const inn = el('span', 'c in'); inn.append(el('span', 'ar', b.half === 'top' ? '▲' : '▼'), ordinal(g.period));
      st.append(inn, el('span', 'c', b.balls + '-' + b.strikes), el('span', 'c', b.outs + ' OUT'));
    } else if (os) { st.append(el('span', 'c in', os.period), el('span', 'c', os.clock)); if (os.detail) st.appendChild(el('span', 'c', os.detail)); }
    else st.appendChild(el('span', 'c', statusText(g, time)));
    const game = post ? /game\s*(\d+)/i.exec(g.note || '') : null;
    if (game) st.appendChild(el('span', 'c rd', 'GAME ' + game[1]));
    root.appendChild(st);
  },
};
