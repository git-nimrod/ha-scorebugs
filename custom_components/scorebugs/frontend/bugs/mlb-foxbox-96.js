// "Slant slab '96": after FOX's MLB score box of June 22 to July 6, 1996. A charcoal slab leaning to the right with dark red-brown ends: the network's mark
// over the inning at the left (here the Home Assistant logo), both teams' letters and scores on a darker panel at the right, and the
// count and outs across the foot in cream.
// measured: sides lean about 8 deg, the team panel 55% of the slab wide, three rows of about a third each; letters heavy,
// upright, caps 0.2 of the bar's height (inning 0.15, foot row 0.16); warm white ink, cream on the foot row. Drawn soft (bug_tv: clean turns it off).
import { el, otherSport, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 470, H = 169;

export default {
  id: 'mlb-foxbox-96',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-foxbox-96 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 800; font-stretch: 82%; color: #ddd4c4; }
/* the slab leans with its sides; its ends are a dark red-brown, the face charcoal, lit along the top */
.sb-mlb-foxbox-96 .slab { position: absolute; left: 16px; right: 14px; top: 12px; bottom: 11px; transform: skewX(-8deg); border-radius: 5px;
  background: linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,.25)),
    linear-gradient(90deg, #4e1c0c, #84391f 4%, #4a3e34 11%, #45443c 50%, #403f37 89%, #8b4d3c 96%, #57261a);
  box-shadow: 0 3px 8px rgba(0,0,0,.55); }
.sb-mlb-foxbox-96 .pn { position: absolute; left: 204px; width: 230px; top: 16px; height: 94px; transform: skewX(-8deg); background: linear-gradient(#34322a, #26251f); }
.sb-mlb-foxbox-96 .ha { position: absolute; left: 84px; top: 16px; width: 50px; height: 50px; color: #ece4d4; filter: drop-shadow(2px 2px 0 #000); }
.sb-mlb-foxbox-96 .inn { position: absolute; left: 44px; width: 130px; top: 65px; height: 42px; display: grid; place-items: center; font-size: 38px; line-height: 1; text-shadow: 2px 2px 0 #000; white-space: nowrap; }
.sb-mlb-foxbox-96 .inn .sb-ord { font-size: .85em; }
.sb-mlb-foxbox-96 .r { position: absolute; left: 222px; width: 196px; height: 46px; display: flex; align-items: center; justify-content: space-between; font-size: 48px; line-height: 1; text-shadow: 2px 2px 0 #000; }
.sb-mlb-foxbox-96 .r .s { min-width: 1.4em; text-align: right; }
.sb-mlb-foxbox-96 .ft { position: absolute; left: 30px; width: 400px; top: 115px; height: 44px; display: grid; grid-template-columns: 136px 1fr; align-items: center; justify-items: center; font-size: 42px; line-height: 1; color: #d6d4a8; text-shadow: 2px 2px 0 #000; white-space: nowrap; }
.sb-mlb-foxbox-96 .ft .dt { font-size: 32px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    root.append(el('div', 'slab'), el('div', 'pn'));
    const ha = el('div', 'ha'); if (marks(opts).ha) ha.appendChild(haMark(50)); root.appendChild(ha);
    const inn = el('div', 'inn');
    // the frame shows the inning alone ("1ST"), no half
    const os = otherSport(g);
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (os) inn.appendChild(el('span', '', os.period));
    if (live) { const n = el('span', '', g.period.label); n.appendChild(el('span', 'sb-ord', g.period.suffix || '')); inn.appendChild(n); }
    root.appendChild(inn);
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r'); r.style.top = (18 + i * 45) + 'px';
      r.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      root.appendChild(r);
    });
    const ft = el('div', 'ft');
    if (b) ft.append(el('span', '', b.balls + '-' + b.strikes), el('span', '', b.outs + ' OUT'));
    else if (os) { ft.appendChild(el('span', '', os.clock)); if (os.detail) ft.appendChild(el('span', 'dt', os.detail)); }
    // before and after the game the start time or FINAL takes the whole foot row (the inning column cut the time short: TUE 1:31A)
    else { const w = el('span', '', statusText(g, time)); w.style.gridColumn = '1 / 3'; ft.appendChild(w); }
    root.appendChild(ft);
  },
};
