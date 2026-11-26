// "Diamond wings '97": after FOX's MLB score box from July 13, 1996 through 1997. A black box with amber-lit ends over a wide flat silver diamond whose
// points stick out at the left, the right and the top; the points are the bases (one lights amber on the frame). In the box: the
// network's mark (here the Home Assistant logo) over the inning at the left, both teams' letters and scores at the right, the count and
// outs across the foot.
// measured: diamond 100% of the bar wide, 71% tall, centred 35% down; box 66% wide, 63% tall; rows centred 25, 47 and
// 66% down; letters heavy, upright, light grey, caps 0.14 of the bar's height (inning 0.1); dark hard shadows. Drawn soft (bug_tv: clean turns it off).
import { el, otherSport, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 645, H = 240;

export default {
  id: 'mlb-fox-97',
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-mlb-fox-97 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 800; font-stretch: 85%; color: #dcdee4; }
/* the flat silver diamond: lit top half, a shade under its middle */
.sb-mlb-fox-97 .wing { position: absolute; left: 0; top: 0; width: ${W}px; height: 170px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  background: linear-gradient(#c4c8d6, #a2a5b8 40%, #7d8196 52%, #9a9db0); }
/* its points are the bases: third left, second top, first right */
.sb-mlb-fox-97 .tip { position: absolute; background: linear-gradient(#fff0a8, #f0b030 60%, #b87010); opacity: 0; }
.sb-mlb-fox-97 .tip.on { opacity: 1; }
.sb-mlb-fox-97 .tip.b3 { left: 0; top: 0; width: 112px; height: 170px; clip-path: polygon(0 50%, 100% 33%, 100% 67%); }
.sb-mlb-fox-97 .tip.b1 { left: 533px; top: 0; width: 112px; height: 170px; clip-path: polygon(100% 50%, 0 33%, 0 67%); }
.sb-mlb-fox-97 .tip.b2 { left: 225px; top: 0; width: 195px; height: 26px; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
/* the whole box and everything in it leans to the right, top ahead of the foot, 10 deg from upright (measured on the
 frame's right amber end: 10.3 deg, the rows' right ends step back the same way); the diamond behind it stays square */
.sb-mlb-fox-97 .lean { position: absolute; inset: 0; transform: skewX(-10deg); transform-origin: 50% 106px; }
/* the black box, its ends lit amber (frame) */
.sb-mlb-fox-97 .box { position: absolute; left: 112px; width: 421px; top: 30px; height: 152px; border-radius: 4px;
  background: linear-gradient(rgba(255,255,255,.08), rgba(255,255,255,0) 40%), linear-gradient(90deg, #5a3212, #1c0f06 10%, #050505 24%, #050505 76%, #1c0f06 90%, #5a3212);
  box-shadow: 0 3px 8px rgba(0,0,0,.6); }
.sb-mlb-fox-97 .ha { position: absolute; left: 182px; top: 36px; width: 50px; height: 50px; color: #e8eaf0; filter: drop-shadow(2px 2px 0 #000); }
.sb-mlb-fox-97 .inn { position: absolute; left: 136px; width: 142px; top: 95px; height: 34px; display: grid; place-items: center; font-size: 35px; line-height: 1; color: #c8cad2; text-shadow: 2px 2px 0 #000; white-space: nowrap; }
.sb-mlb-fox-97 .r { position: absolute; left: 296px; width: 196px; height: 42px; display: flex; align-items: center; justify-content: space-between; font-size: 50px; line-height: 1; text-shadow: 2px 2px 0 #000; }
.sb-mlb-fox-97 .r .s { min-width: 1.4em; text-align: right; }
.sb-mlb-fox-97 .ft { position: absolute; left: 136px; width: 370px; top: 137px; height: 44px; display: flex; align-items: center; justify-content: space-around; font-size: 48px; line-height: 1; color: #d8d8c8; text-shadow: 2px 2px 0 #000; white-space: nowrap; }
.sb-mlb-fox-97 .ft .dt { font-size: 32px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live' && !!g.baseball;
    const b = live ? g.baseball : null;
    root.appendChild(el('div', 'wing'));
    const os = otherSport(g);
    // another sport's game: no bases (the points round the box); the period in the inning's spot, the clock in the count's and one
    // detail where the outs were
    if (!os) [['b3', 2], ['b2', 1], ['b1', 0]].forEach(([c, k]) => root.appendChild(el('div', 'tip ' + c + (b && b.bases[k] ? ' on' : ''))));
    const lean = el('div', 'lean');
    lean.appendChild(el('div', 'box'));
    const ha = el('div', 'ha'); if (marks(opts).ha) ha.appendChild(haMark(50)); lean.appendChild(ha);
    const inn = el('div', 'inn');
    // the frame shows the inning alone ("3RD"), no half
    if (live) inn.appendChild(el('span', '', g.period.label + (g.period.suffix || '')));
    else if (os) inn.appendChild(el('span', '', os.period));
    lean.appendChild(inn);
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'r'); r.style.top = (40 + i * 51) + 'px';
      r.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), scoreSlot(el('span', 's', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      lean.appendChild(r);
    });
    const ft = el('div', 'ft');
    if (b) ft.append(el('span', '', b.balls + '-' + b.strikes), el('span', '', b.outs + ' OUT'));
    else if (os) { ft.appendChild(el('span', '', os.clock)); if (os.detail) ft.appendChild(el('span', 'dt', os.detail)); }
    // before and after the game the start time or FINAL takes the foot row, where it has the box's width (the inning column clipped it)
    else ft.appendChild(el('span', '', statusText(g, time)));
    lean.appendChild(ft);
    root.appendChild(lean);
  },
};
