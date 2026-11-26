// "Navy bar '09": after TBS's MLB postseason bug (2009-10; frame: Yankees at Twins, ALDS). A dark navy bar: the channel's red box at the left
// (here the Home Assistant logo on red), both teams' letters and scores stacked on blue, the bases in a diamond frame, and the inning (a
// yellow arrow) over the outs. The round's mark at the right end is left out.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, leagueLogo, ordinal, FONTS } from '../kit.js';

// a smaller team block, narrower and shorter, as the frame's
const W = 860, H = 150, MARK = 130, TEAMS = 230, SCORE_W = 72, DIA = 150, END = 120, PX = 38;

export default {
  id: 'mlb-tbs-09',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the score column goes and the bar closes up
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - SCORE_W, h: H } : { w: W, h: H }),   // records keep the room
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-tbs-09 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #e9ecf4; }
.sb-mlb-tbs-09 { font-weight: 600; font-stretch: 75%; }   /* face: Archivo 600 at 75% width (low confidence) */
/* on air: the blue sits only behind the team's letters, the score is on the bar's black; the bases are on a
 silver-edged diamond badge as tall as the bar; the inning and the outs are two black rows split by a thin line; and a dark red cell at the
 right end holds the league's logo over the round */
.sb-mlb-tbs-09 .bar { position: absolute; inset: 0; display: grid; grid-template-columns: ${MARK}px ${TEAMS}px ${DIA}px 1fr ${END}px; gap: 4px; padding: 4px; box-sizing: border-box; border-radius: 6px;
  background: linear-gradient(#e2e6eb, #9aa1ab 45%, #6f7782 52%, #c9ced5); box-shadow: 0 3px 8px rgba(0,0,0,.5); }   /* a polished chrome rim round the bar */
/* the chrome shows between the sections as bright metal dividers running the full height into the rim */
.sb-mlb-tbs-09 .bar > * { position: relative; }
.sb-mlb-tbs-09 .tm, .sb-mlb-tbs-09 .dm { background: linear-gradient(#232b3c, #0b0f18 55%, #121826); }
.sb-mlb-tbs-09 .mk { display: grid; place-items: center; border-radius: 4px; background: linear-gradient(#e03030, #a0141a); } .sb-mlb-tbs-09 .mk .sb-ha { color: #fff; }
.sb-mlb-tbs-09 .tm { display: grid; grid-template-rows: 1fr 1fr; row-gap: 4px; padding: 14px 8px; }   /* the rows shorter than the bar, as on air */
.sb-mlb-tbs-09 .ln { display: grid; grid-template-columns: 1fr ${SCORE_W}px; align-items: stretch; background: linear-gradient(#20242c, #05070b 55%, #0d1016); font-size: ${PX}px; line-height: 1; }
.sb-mlb-tbs-09 .ln .nm { display: flex; align-items: center; padding: 0 16px; background: linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 50%), linear-gradient(90deg, #2d4b8e, #1f3870 60%, #0d1530); }   /* the blue fading into the score's black, as on air */
.sb-mlb-tbs-09 .ln .rec { display: grid; place-items: center; font-size: .6em; white-space: nowrap; }
.sb-mlb-tbs-09 .ln .sc { display: grid; place-items: center; }
.sb-mlb-tbs-09 .dm { position: relative; display: grid; place-items: center; overflow: visible; }
.sb-mlb-tbs-09 .dm::before { content: ''; position: absolute; left: 50%; top: 50%; width: 96px; height: 96px; margin: -48px 0 0 -48px; transform: rotate(45deg); box-sizing: border-box;
  border: 4px solid #b9bfca; border-image: none; border-radius: 6px; background: linear-gradient(135deg, #2f333c, #0e1015); box-shadow: 0 2px 6px rgba(0,0,0,.6), 0 0 0 1px #5b616b, inset 0 0 0 1px #eef1f5; }
/* the badge's rim as polished metal: a lit edge outside, a bright line inside */
.sb-mlb-tbs-09 .dm::after { content: ''; position: absolute; left: 50%; top: 50%; width: 96px; height: 96px; margin: -48px 0 0 -48px; transform: rotate(45deg); box-sizing: border-box; border-radius: 6px; pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,.28), rgba(255,255,255,0) 40%); }
.sb-mlb-tbs-09 .dm .sb-bases { z-index: 1; }
/* bases sized and placed to the frame: each about a quarter of the diamond's height, second base near its top point, first and third at its widest */
.sb-mlb-tbs-09 .dm .sb-bases { position: relative; top: -13px; } .sb-mlb-tbs-09 .dm .sb-bases i { background: linear-gradient(135deg, #8a919e, #4e5460); border: 2px solid #c3c9d3; } .sb-mlb-tbs-09 .dm .sb-bases i.on { background: linear-gradient(135deg, #fff17a, #f2d230 45%, #b99a12); border-color: #fbe56a; }   /* glossy tiles, as on air */
.sb-mlb-tbs-09 .rt { display: grid; grid-template-rows: 1fr 1fr; row-gap: 4px; background: linear-gradient(#e2e6eb, #9aa1ab 45%, #6f7782 52%, #c9ced5); font-size: ${PX * 0.85}px; line-height: 1; }
.sb-mlb-tbs-09 .rt > span { display: flex; align-items: center; justify-content: flex-end; padding-right: 16px; background: linear-gradient(#20242c, #05070b 55%, #0d1016); }
.sb-mlb-tbs-09 .rt b { color: #f2d230; font-size: .6em; margin-right: 10px; } .sb-mlb-tbs-09 .rt .sb-ord { font-size: .8em; }
.sb-mlb-tbs-09 .rt small { font-size: .65em; margin-left: 6px; }
.sb-mlb-tbs-09 .rt .w { grid-row: 1 / 3; justify-content: center; padding: 0; font-size: ${PX * 0.7}px; }
.sb-mlb-tbs-09 .en { display: grid; place-items: center; align-content: center; gap: 2px; border-radius: 4px; background: linear-gradient(#8e1a1e, #55090c); font-size: 26px; line-height: 1; }
.sb-mlb-tbs-09 .dm .dt { position: relative; z-index: 1; font-size: 24px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const m = marks(opts), bar = el('div', 'bar'), mk = el('span', 'mk'); if (m.ha) mk.appendChild(haMark(76));
    const recs = g.status === 'pre' && g.away.record && g.home.record;  // records before the game, every time
    if (g.status === 'pre' && !recs) bar.style.gridTemplateColumns = MARK + 'px ' + (TEAMS - SCORE_W) + 'px ' + DIA + 'px 1fr ' + END + 'px';
    const tm = el('span', 'tm');
    [g.away, g.home].forEach((t) => {
      const ln = el('span', 'ln');
      ln.appendChild(el('span', 'nm', (t.abbr || '').toUpperCase()));
      if (recs) ln.appendChild(el('span', 'rec', t.record));
      else if (g.status === 'pre') ln.style.gridTemplateColumns = '1fr';
      else ln.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      tm.appendChild(ln);
    });
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const dm = el('span', 'dm');
    if (os) { if (os.detail) dm.appendChild(el('span', 'dt', os.detail)); } else dm.appendChild(bases(live ? b.bases : [false, false, false], 34));  // inside the badge with room round them
    const rt = el('span', 'rt');
    if (live) {
      const inn = el('span', ''); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), ordinal(g.period));
      const outs = el('span', '', String(b.outs)); outs.appendChild(el('small', '', 'OUT'));
      rt.append(inn, outs);
    } else if (os) rt.append(el('span', '', os.period), el('span', '', os.clock));
    else rt.appendChild(el('span', 'w', statusText(g, time)));
    // the right end: the league's logo over the round (from the game's note), on dark red
    const en = el('span', 'en');
    if (m.league) en.appendChild(leagueLogo(g, 64, null, true));
    const post = !!(g.round && g.round.dress && g.round.dress !== 'regular');  // the round only in a real postseason game
    const round = /\b(ALDS|NLDS|ALCS|NLCS|WORLD SERIES|WILD CARD)\b/i.exec(post ? g.note || '' : '');
    if (round) en.appendChild(el('span', '', round[1].toUpperCase()));
    bar.append(mk, tm, dm, rt, en);
    root.appendChild(bar);
  },
};
