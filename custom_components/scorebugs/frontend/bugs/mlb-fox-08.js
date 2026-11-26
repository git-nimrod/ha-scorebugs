// "Chip strip '08": after FOX's MLB score strip of 2008. A dark strip along the top with a bright blue rule over it, holding a row of rounded dark chips with
// light rims: the league's logo with the network's mark (here the Home Assistant logo), each team's letters and score, the half inning
// (a yellow arrow), the outs, the bases as three yellow-and-white tiles, the count on a wider silver chip, and at the right end the
// league's logo, the round and the network's mark again.
// measured: rule 11% of the bug's height, chips 51% tall with 6 px corners and a 2 px light rim; letters bold condensed,
// upright, caps 0.33 of the height, white on the chips, dark on the silver count. Drawn soft (bug_tv: clean turns it off).
// The strip hugs what it holds.
// every chip's own outline pure black (frame: about 0-20 grey against the strip's 105-125 and the chip's
// 45-55 fill); the text in each chip centred both ways on its ink.
import { el, otherSport, bases, statusText, scoreSlot, haMark, marks, leagueLogo, FONTS } from '../kit.js';

const W = 1368, H = 72;

export default {
  id: 'mlb-fox-08',
  size: { w: W, h: H },
  tv: 'soft',
  hug: '.row',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-fox-08 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 78%; color: #f2f2f2; }
/* the strip: a bright blue rule on top, mid grey under it (frame: about #7a7e8a lit to #94989e, the rim round the chips) */
.sb-mlb-fox-08 .row { position: absolute; left: 0; top: 0; height: 72px; display: flex; align-items: center; gap: 8px; box-sizing: border-box; padding: 8px 6px 0 12px;
  background: linear-gradient(#3a5cf0, #1a2ec0 8px, #0c1460 10px, #8a8e9a 11px, #7c808a 60%, #6a6e76); font-size: 32px; line-height: 1; white-space: nowrap; }
/* the chips: black, not grey (frame about #0a0a10 to #1e1c22), outlined in pure black against the lighter grey strip;
 the text set 1 px lower so its ink sits in the middle (it read 1.5 px high) */
.sb-mlb-fox-08 .ch { height: 37px; display: flex; align-items: center; justify-content: center; gap: 16px; box-sizing: border-box; padding: 2px 14px 0; border-radius: 6px;
  background: linear-gradient(#26262c, #121216 45%, #0e0e11); box-shadow: inset 0 0 0 3px #000, 0 0 0 1px rgba(0,0,0,.55); }
.sb-mlb-fox-08 .ch .s { min-width: 30px; text-align: right; }
.sb-mlb-fox-08 .ch.inn { gap: 0; } .sb-mlb-fox-08 .inn b { color: #f2c020; font-size: .6em; margin-right: 6px; vertical-align: 2px; } .sb-mlb-fox-08 .inn .sb-ord, .sb-mlb-fox-08 small { font-size: .7em; }
/* the count in black on the silver chip */
.sb-mlb-fox-08 .cn { min-width: 170px; justify-content: center; color: #0b0c0e; background: linear-gradient(#f4f4f6, #cfcfd4 50%, #b8b8be); box-shadow: inset 0 0 0 3px #000, 0 0 0 1px rgba(0,0,0,.55); }
.sb-mlb-fox-08 .mk { color: #fff; gap: 10px; justify-content: center; min-width: 178px; padding-top: 0; }
.sb-mlb-fox-08 .ch.inn { min-width: 105px; justify-content: center; padding-right: 18px; } .sb-mlb-fox-08 .ch.ou { min-width: 108px; justify-content: center; }
.sb-mlb-fox-08 .rd { font-family: 'SB Archivo', serif; font-weight: 800; font-stretch: 90%; letter-spacing: 1px; }
.sb-mlb-fox-08 .bz { position: relative; top: 2px; width: 100px; height: 40px; margin: 0 8px 0 4px; }
.sb-mlb-fox-08 .bz .sb-bases { position: absolute; left: 0; top: -14px; }
/* the three tiles packed into one diamond with black lines between them: each tile grown until they touch */
.sb-mlb-fox-08 .bz .sb-bases i { background: linear-gradient(135deg, #ffffff, #d6d6d8); border: 3px solid #0b0c0e; transform: rotate(45deg) scale(1.16) !important; }
.sb-mlb-fox-08 .bz .sb-bases i.on { background: linear-gradient(135deg, #fff6a0, #f2d020 55%, #c89c10); }
.sb-mlb-fox-08 .ch.dt { font-size: 28px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const mk = marks(opts);
    const row = el('div', 'row');
    // the first chip: the league's logo and the network's mark
    const first = el('span', 'ch mk');
    if (mk.league) first.appendChild(leagueLogo(g, 30));
    if (mk.ha) first.appendChild(haMark(30));
    if (first.children.length) row.appendChild(first);
    [g.away, g.home].forEach((t) => {
      const c = el('span', 'ch');
      c.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      row.appendChild(c);
    });
    const inn = el('span', 'ch inn');
    if (live) { inn.append(el('b', '', b.half === 'bot' ? '▼' : '▲'), g.period.label); inn.lastChild.after(el('span', 'sb-ord', g.period.suffix || '')); }
    else inn.textContent = otherSport(g) ? otherSport(g).period : statusText(g, time);
    row.appendChild(inn);
    if (live) {
      const o = el('span', 'ch ou', String(b.outs)); o.appendChild(el('small', '', 'OUT')); o.style.gap = '4px';
      const bz = el('span', 'bz'); bz.appendChild(bases(b.bases, 26));
      row.append(o, bz, el('span', 'ch cn', b.balls + '-' + b.strikes));
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const os = otherSport(g);
      if (os.detail) row.appendChild(el('span', 'ch dt', os.detail));
      row.appendChild(el('span', 'ch cn', os.clock));
    }
    // the right end: the league's logo, the round in a real postseason game (from the game's note) and the network's mark
    const post = !!(g.round && g.round.dress && g.round.dress !== 'regular');
    const round = /\b(ALDS|NLDS|ALCS|NLCS|WORLD SERIES|WILD CARD)\b/i.exec(post ? g.note || '' : '');
    if (round) {
      const end = el('span', 'ch mk');
      if (mk.league) end.appendChild(leagueLogo(g, 30));
      end.appendChild(el('span', 'rd', round[1].toUpperCase()));
      if (mk.ha) end.appendChild(haMark(30));
      row.appendChild(end);
    }
    root.appendChild(row);
  },
};
