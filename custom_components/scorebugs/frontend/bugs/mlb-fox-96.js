// "Red caps '96": after FOX's first MLB score box (Saturday games, June 1-15, 1996). A dark green see-through slab between two red cylinder ends; at its left a
// flat white-edged diamond plate (the network's mark sat in it: here the Home Assistant logo) with the bases at its corners, the count
// and outs under it in cream italic, and at the right a black panel with the half inning over both teams' letters and scores.
// measured: ends lean about 12 deg, the black panel's left side about 10 deg; plate 38% of the bar wide and 57% tall;
// letters italic about 13 deg, heavy, caps 0.22 of the bar's height; ink light grey-blue on the panel, cream on the slab; hard dark shadows under the letters (1990s).
// Drawn soft, as it looked on a 1996 TV (bug_tv: clean turns that off).
// the inning's box leans with the black panel's sides (left side 10 deg, right side 12 deg); the left red end
// tucked in about half again (everything but that end moved 41 px left over it: its crescent at mid height about 40 px, was 80); the
// plate with its bases and the count and outs each centred left to right in the green between the slab's left edge and the panel.
import { el, otherSport, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 699, H = 190;

export default {
  id: 'mlb-fox-96',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.barlowSemi800i],
  css: `
.sb-mlb-fox-96 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 800; font-style: italic; color: #cdd6dc; }
/* the red cylinder ends: slanted, round-cornered, a pale lit stripe a third of the way across (frame) */
/* curves measured by circle fits on the frame: the left end's sides bow out (r 115 and 84 px, sag 20 and 31 px over 130), the right
   end's outer side is near a half circle (r 72 px, sag 47 over 135): elliptical corners */
.sb-mlb-fox-96 .cap { position: absolute; top: 8px; height: 172px; border-radius: 50% / 50%; transform: skewX(-12deg);
  background: linear-gradient(90deg, #6a0c18, #c0223a 26%, #f4a0b4 42%, #d83850 58%, #8a1020 92%); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
/* each red end tucked in under the slab: the left one's right half and the right one's left half go behind it, so only
 the outer crescent shows (frame: about 40-60 px of red at the left, 40-55 at the right, between the slab's slanted edge and the curve) */
.sb-mlb-fox-96 .cap.cl { left: 12px; width: 140px; background: linear-gradient(90deg, #6a0c18, #c0223a 13%, #f4a0b4 22%, #d83850 32%, #8a1020 52%); }
.sb-mlb-fox-96 .cap.cr { left: 585px; width: 100px; border-radius: 40px 50px 50px 40px / 70px 86px 86px 70px; background: linear-gradient(90deg, #8a1020 40%, #d83850 62%, #f4a0b4 76%, #c0223a 88%, #6a0c18); }
/* the slab: dark green, see-through, lit along its top edge; its ends lean with the red ends (12 deg) so the red tucks under evenly */
.sb-mlb-fox-96 .slab { position: absolute; left: 25px; right: 46px; top: 4px; bottom: 3px; clip-path: polygon(46px 0, 100% 0, calc(100% - 39px) 100%, 7px 100%);
  background: linear-gradient(rgba(36,70,54,.92), rgba(30,66,50,.9) 45%, rgba(18,40,28,.92)); box-shadow: inset 0 2px 0 rgba(255,255,255,.14), inset 0 -2px 0 rgba(0,0,0,.4); }
/* the flat diamond plate: a white edge round a grey-green face */
/* the plate centred in the green at its own height (slab edge 57, panel 397 at 72 px down) */
.sb-mlb-fox-96 .dia { position: absolute; left: 88px; top: 18px; width: 278px; height: 108px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  background: linear-gradient(#f2f6f2, #b9c8c0); }
.sb-mlb-fox-96 .dia::before { content: ''; position: absolute; inset: 4px 8px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  background: linear-gradient(#4a7a66, #2c5a46 55%, #22483a); }
.sb-mlb-fox-96 .ha { position: absolute; left: 193px; top: 38px; width: 68px; height: 68px; color: #fff; filter: drop-shadow(2px 2px 0 #000); }
/* the bases at the plate's corners: third left, second top, first right; a lit yellow ball when taken */
.sb-mlb-fox-96 .bs { position: absolute; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #e8efe9, #8a9a90 70%); opacity: .5; }
.sb-mlb-fox-96 .bs.on { opacity: 1; background: radial-gradient(circle at 35% 30%, #fff6c0, #f2c230 55%, #b07a10); box-shadow: 0 0 6px rgba(255,200,60,.8); }
/* the letters lean about 13 deg: the italic face plus a little skew */
.sb-mlb-fox-96 .cnt, .sb-mlb-fox-96 .inn, .sb-mlb-fox-96 .r { transform: skewX(-5deg); }
/* the count and outs centred in the green at their height (slab edge 37, panel 381 at 161 px down) */
.sb-mlb-fox-96 .cnt { position: absolute; left: 35px; width: 350px; top: 136px; height: 50px; display: flex; align-items: center; justify-content: center; gap: 24px;
  font-size: 62px; line-height: 1; color: #e8d896; text-shadow: 2px 3px 0 #000; white-space: nowrap; }
/* the black panel at the right, its left side slanted; the half inning in a lined box on top, the two teams under it */
.sb-mlb-fox-96 .pn { position: absolute; left: 377px; width: 276px; top: 5px; bottom: 4px; clip-path: polygon(32px 0, 100% 0, calc(100% - 39px) 100%, 0 100%); background: linear-gradient(rgba(6,10,8,.92), rgba(2,4,2,.95)); }
/* the half inning's box leans with the panel's sides, 4 px inside them: left side 10 px over its 56 px
 height, right side 12 px, a 2 px grey-blue line round it */
.sb-mlb-fox-96 .inn { position: absolute; left: 403px; width: 245px; top: 7px; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px;
  font-size: 53px; line-height: 1; isolation: isolate; text-shadow: 2px 3px 0 #000; white-space: nowrap; }
.sb-mlb-fox-96 .inn::before, .sb-mlb-fox-96 .inn::after { content: ''; position: absolute; z-index: -1; clip-path: polygon(10px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); }
.sb-mlb-fox-96 .inn::before { inset: 0; background: #3a464a; }
.sb-mlb-fox-96 .inn::after { inset: 2px 2px 2px 2px; clip-path: polygon(9.6px 0, 100% 0, calc(100% - 11.6px) 100%, 0 100%); background: linear-gradient(#232c2e, #06090a); }
.sb-mlb-fox-96 .inn .sb-ord { font-size: .8em; }
.sb-mlb-fox-96 .r { position: absolute; left: 395px; width: 248px; height: 54px; display: flex; align-items: center; justify-content: space-between;
  font-size: 60px; line-height: 1; text-shadow: 2px 3px 0 #000; }
.sb-mlb-fox-96 .r .s { min-width: 1.4em; text-align: right; }
.sb-mlb-fox-96 .cnt .dt { font-size: .5em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    const mk = marks(opts);
    root.append(el('div', 'cap cl'), el('div', 'cap cr'), el('div', 'slab'), el('div', 'dia'));
    const ha = el('div', 'ha'); if (mk.ha) ha.appendChild(haMark(68)); root.appendChild(ha);
    // third, second, first at the plate's left, top and right corners
    const os = otherSport(g);
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (!os) [[2, 96, 72], [1, 227, 22], [0, 358, 72]].forEach(([k, x, y]) => {
      const s = el('i', 'bs' + (b && b.bases[k] ? ' on' : '')); s.style.left = x + 'px'; s.style.top = y + 'px'; root.appendChild(s);
    });
    const cnt = el('div', 'cnt');
    if (b) cnt.append(el('span', '', b.balls + '-' + b.strikes), el('span', '', b.outs + ' OUT'));
    else if (os) { cnt.appendChild(el('span', '', os.clock)); if (os.detail) cnt.appendChild(el('span', 'dt', os.detail)); }
    root.append(cnt, el('div', 'pn'));
    const inn = el('div', 'inn');
    if (live) {
      inn.appendChild(el('span', '', b.half === 'bot' ? 'BOT' : 'TOP'));
      const n = el('span', '', g.period.label); n.appendChild(el('span', 'sb-ord', g.period.suffix || '')); inn.appendChild(n);
    } else inn.appendChild(el('span', '', os ? os.period : statusText(g, time)));
    root.appendChild(inn);
    [g.away, g.home].forEach((t, i) => {
      // the panel's right side leans in toward the foot, so each row ends a little further left
      const r = el('div', 'r'); r.style.top = (68 + i * 56) + 'px'; r.style.width = (232 - i * 12) + 'px';
      r.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      root.appendChild(r);
    });
  },
};
