// "Silver capsule '11": after TBS's MLB postseason bug (2011-15; frame: Cardinals at Phillies, NLDS). A silver capsule: the channel's mark on
// a blue badge at the left (here the Home Assistant logo), each team's letters on a bar of its colour with its score on dark grey, the bases
// in a diamond frame with the inning beside them, and the count over the outs as yellow dots (the pitch speed is left out: no data; the
// round's plate at the right end too).
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, teamColor, shade, FONTS } from '../kit.js';

// the team letters larger, about a quarter of the capsule's height; the lit bases and outs a lime yellow
const W = 860, H = 150, PX = 46, TEAM_PX = 54, LIT = '#c6dc46';

export default {
  id: 'mlb-tbs-11',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -13% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  hug: '.cap',  // before and after the game the capsule ends after the start time / FINAL: no empty silver
  fonts: [FONTS.barlowCond700],
  css: `
.sb-mlb-tbs-11 { font-family: 'SB Barlow Condensed', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-mlb-tbs-11 { font-weight: 700; font-stretch: 100%; }   /* face: Barlow Condensed 700 (low confidence) */
.sb-mlb-tbs-11 .cap { position: absolute; inset: 0; display: grid; grid-template-columns: 120px 150px 86px 160px 64px 1fr;   /* the score column wide enough for 48 or 88 (hard cases, Nov 22) */ gap: 0; align-items: stretch; padding: 10px 26px 10px 12px; box-sizing: border-box;
  border-radius: 40px; background: linear-gradient(#f4f5f7, #c3c7ce 55%, #9da2ab); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
/* on air the channel's mark sits straight on the silver, in blue; the scores, the bases, the inning and the count share one dark rounded
 panel, the bases on a silver-rimmed diamond inside it */
.sb-mlb-tbs-11 .mk { display: grid; place-items: center; margin-right: 6px; } .sb-mlb-tbs-11 .mk .sb-ha { color: #1d4fa8; }
.sb-mlb-tbs-11 .tm { margin-right: 0; border-radius: 4px 0 0 4px !important; }   /* the scores join straight onto the team colours */
.sb-mlb-tbs-11 .tm, .sb-mlb-tbs-11 .scs { display: grid; grid-template-rows: 1fr 1fr; row-gap: 4px; }
/* the two teams touching, no line between them; the score panel moved in towards them */
.sb-mlb-tbs-11 .tm { row-gap: 0; border-radius: 4px; overflow: hidden; }
.sb-mlb-tbs-11 .tm span { display: grid; place-items: center start; padding-left: 14px; font-size: ${TEAM_PX}px; line-height: 1; }
.sb-mlb-tbs-11 .scs { border-radius: 0; background: linear-gradient(#3a3d43, #1d1f23); } .sb-mlb-tbs-11 .scs.only { border-radius: 8px; }
.sb-mlb-tbs-11 .scs span { display: grid; place-items: center; font-size: ${PX}px; line-height: 1; }
.sb-mlb-tbs-11 .dm { position: relative; display: grid; place-items: center; background: linear-gradient(#3a3d43, #1d1f23); }
.sb-mlb-tbs-11 .dm::before { content: ''; position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px 0 0 -42px; transform: rotate(45deg); box-sizing: border-box;
  border: 4px solid #c9cdd4; border-radius: 6px; background: linear-gradient(135deg, #35383e, #141518); }
/* bases sized and placed to the frame: each about a quarter of the diamond's height, second base near its top point, first and third at its widest */
/* each base at its own corner of the badge, as the frame */
.sb-mlb-tbs-11 .dm .bz { position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; transform: rotate(45deg); box-sizing: border-box; background: #6d717a; border: 2px solid #1b1d21; }
.sb-mlb-tbs-11 .dm .bz.on { background: ${LIT}; }
.sb-mlb-tbs-11 .dm .sb-bases i { background: #6d717a; border: 2px solid #1b1d21; } .sb-mlb-tbs-11 .dm .sb-bases i.on { background: ${LIT}; }
.sb-mlb-tbs-11 .inn { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #e9ebee; background: linear-gradient(#3a3d43, #1d1f23); font-size: ${PX * 0.85}px; line-height: 1; } .sb-mlb-tbs-11 .inn b { font-size: .5em; }
.sb-mlb-tbs-11 .ct { display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; border-radius: 0 8px 8px 0; background: linear-gradient(#3a3d43, #1d1f23); font-size: ${PX * 0.85}px; line-height: 1; }
.sb-mlb-tbs-11 .dots { display: flex; gap: 10px; } .sb-mlb-tbs-11 .dots i { width: 18px; height: 18px; border-radius: 4px; background: #6d717a; } .sb-mlb-tbs-11 .dots i.on { background: ${LIT}; }   /* small rounded squares, as on air */
.sb-mlb-tbs-11 .w { display: grid; place-items: center; padding: 0 10px 0 26px; color: #2a2d33; font-size: ${PX * 0.7}px; white-space: nowrap; }
.sb-mlb-tbs-11 .scs .rec { font-size: ${PX * 0.6}px; padding: 0 16px; white-space: nowrap; }
.sb-mlb-tbs-11 .scs .sc { padding: 0 22px; }
.sb-mlb-tbs-11 .dm .dt { position: relative; z-index: 1; font-size: 22px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const cap = el('div', 'cap'), mk = el('span', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(64));
    const tm = el('span', 'tm'), scs = el('span', 'scs');
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#33507a'), n = el('span', '', (t.abbr || '').toUpperCase());
      n.style.background = 'linear-gradient(' + shade(c, -0.05) + ', ' + shade(c, -0.5) + ')';   // a dark gradient of the team's colour
      tm.appendChild(n);
      if (!live && !os) scs.className = 'scs only';
      if (g.status === 'pre') { if (t.record) scs.appendChild(el('span', 'rec', t.record)); }  // records before the game, every time
      else scs.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
    });
    cap.append(mk, tm);
    const recs = g.status === 'pre' && g.away.record && g.home.record;
    if (g.status !== 'pre' || recs) cap.appendChild(scs);   // before the first pitch the dark panel holds the records, else it goes
    if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const dm = el('span', 'dm'); if (os.detail) dm.appendChild(el('span', 'dt', os.detail));
      const ct = el('span', 'ct'), ck = el('span', '', os.clock); ck.style.gridRow = '1 / 3'; ct.appendChild(ck);
      cap.append(dm, el('span', 'inn', os.period), ct);
    } else if (live) {
      // the badge: an 84 px square turned on its point at the cell's middle; its corners 59 px out, each base 20 px in from its corner
      const dm = el('span', 'dm'), cx = 'calc(50% + ', cy = 'calc(50% + ';
      [[1, 0, -26], [2, -26, 0], [0, 26, 0]].forEach(([k, x, y]) => { const z = el('i', 'bz' + (b.bases[k] ? ' on' : '')); z.style.left = cx + x + 'px)'; z.style.top = cy + y + 'px)'; dm.appendChild(z); });
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), el('span', '', g.period.label || ''));
      const ct = el('span', 'ct'), dots = el('span', 'dots'); for (let i = 0; i < 3; i++) dots.appendChild(el('i', i < b.outs ? 'on' : ''));
      ct.append(el('span', '', b.balls + '-' + b.strikes), dots);
      cap.append(dm, inn, ct);
    } else {
      cap.style.gridTemplateColumns = '120px 190px' + (g.status !== 'pre' || recs ? ' auto' : '') + ' auto'; cap.style.justifyContent = 'start';   // packed: no empty silver (auto tracks would stretch)
      cap.appendChild(el('span', 'w', statusText(g, time)));
    }
    root.appendChild(cap);
  },
};
