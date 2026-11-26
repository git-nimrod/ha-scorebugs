// "Gold box '02": after the Sunday afternoon NFL box of about 2001-2003 (frame: an NFL scorebugs-through-the-years montage, Colts at Patriots). A tall box: a
// royal-blue head with the network's mark (here the Home Assistant logo), a gold panel striped with dark lines carrying the two teams'
// letters and scores in big white capitals with a black shadow, and a blue foot with the quarter and the clock. Soft picture by
// default, as on a 2002 standard-definition set. During play, the down and distance on a blue plate under the box and, when the sensor
// gives the spot, "Ball on" in gold over it on a navy plate below that.
import { el, statusText, haMark, marks, FONTS, fit } from '../kit.js';

const W = 544, H = 500;   // the frame's box is 0.92 as tall as it is wide
const DN_H = 96, SPOT_H = 150, PLATE_GAP = 12;
// the spot of the ball, from the down text's tail ("1st & 10 at OAK 42")
const spotOf = (g) => { const m = g.football && /\bat\s+(.+)$/i.exec(g.football.text || ''); return m ? m[1].trim().toUpperCase() : ''; };
const downOn = (g) => g.status === 'live' && g.football && g.football.short;
// the parts as shares of the frame's box: head 0.1-0.92 wide and 0.3 high; gold 0.11-0.9 wide from 0.31 to 0.74; the back box full width from 0.39 down
const HEAD_X = 52, HEAD_H = 158, GOLD_X = 52, CURVE = 26, GOLD_TOP = HEAD_H - CURVE - 6, GOLD_H = 246, BACK_TOP = 190, FOOT_H = 120;
// the gold has the head's own shape: its top dips by the same curve the head's foot bulges, so the two nest into
// each other, and its foot bulges down over the back box the same way
// measured against the frame, frame size / mine: Colts at Patriots
const TYPE = { rows: 1.12, clock: 1.3 };  // stepped down: at the measured size the letters and the clock were cut top and bottom

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
];

export default {
  id: 'nfl-goldbox-02',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H + 2 * PLATE_GAP + DN_H + SPOT_H },
  // the plates under the box only while a football game runs
  sizeFor: (g) => ({ w: W, h: !downOn(g) ? H : H + PLATE_GAP + DN_H + (spotOf(g) ? PLATE_GAP + SPOT_H : 0) }),
  nudge: NUDGE,
  tv: 'soft',
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-goldbox-02 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 112%; color: #fff; }
.sb-nfl-goldbox-02 { font-weight: 800; font-stretch: 88%; }   /* face: Archivo 800 at 75% width (low confidence) */
/* the stripes' pitch 21 px = 4.3 % of the box's height, as on the frame (about ten dark lines across the gold; were 12 px, twenty); the letters at 88 % width (frame's IND is 20 % wider than ours were) */
/* built as on air: a big deep-blue box behind everything, wider than the rest, with the quarter and the clock in its
 foot; over it the gold panel; over that a royal-blue head whose top dips in the middle and whose foot curves down over the gold */
.sb-nfl-goldbox-02 .bk { position: absolute; left: 0; right: 0; top: ${BACK_TOP}px; bottom: 0; border-radius: 26px; background: linear-gradient(#1d2fb4, #121f86 60%, #0c1566);
  box-shadow: inset 0 0 0 4px #6f86f0, 0 4px 10px rgba(0,0,0,.55); }
.sb-nfl-goldbox-02 .gd { position: absolute; left: ${GOLD_X}px; right: ${GOLD_X}px; top: ${GOLD_TOP}px; height: ${GOLD_H}px; box-sizing: border-box; padding: 34px 34px 26px;
  background: linear-gradient(90deg, rgba(0,0,0,.45), rgba(255,255,255,.12) 26%, rgba(255,255,255,.18) 50%, rgba(255,255,255,.12) 74%, rgba(0,0,0,.45)), repeating-linear-gradient(#e8bd55 0 13px, #8a5d18 13px 21px);
  border-radius: 0 0 50% 50% / 0 0 ${CURVE}px ${CURVE}px; display: grid; grid-template-rows: 1fr 1fr; grid-template-columns: minmax(0, 1fr); overflow: hidden;
  -webkit-mask-image: radial-gradient(ellipse 50% ${CURVE}px at 50% 0, transparent 97%, #000 100%); mask-image: radial-gradient(ellipse 50% ${CURVE}px at 50% 0, transparent 97%, #000 100%);
  filter: drop-shadow(0 3px 3px rgba(0,0,0,.4)); }
.sb-nfl-goldbox-02 .gd div { display: flex; justify-content: space-between; align-items: center; font-size: ${80 * TYPE.rows}px; line-height: 1; text-shadow: 4px 4px 0 #000, 0 0 8px #000; }
.sb-nfl-goldbox-02 .hd { position: absolute; left: ${HEAD_X}px; right: ${HEAD_X}px; top: 0; height: ${HEAD_H}px; display: flex; align-items: center; justify-content: center; gap: 18px; padding-top: 10px; box-sizing: border-box;
  font-size: 76px; background: linear-gradient(#3348dc, #2234c4); border-radius: 0 0 50% 50% / 0 0 ${CURVE}px ${CURVE}px; box-shadow: inset 0 0 0 4px #6f86f0, 0 3px 6px rgba(0,0,0,.45);
  -webkit-mask-image: radial-gradient(ellipse 62% 22px at 50% 0, transparent 97%, #000 100%); mask-image: radial-gradient(ellipse 62% 22px at 50% 0, transparent 97%, #000 100%); }   /* the top dips in the middle */
.sb-nfl-goldbox-02 .hd .sb-ha { color: #fff; }
.sb-nfl-goldbox-02 .ft { position: absolute; left: 20px; right: 20px; bottom: 0; height: ${FOOT_H}px; display: flex; justify-content: space-between; align-items: center; padding: 0 22px; box-sizing: border-box; font-size: ${70 * TYPE.clock}px; }
.sb-nfl-goldbox-02 .ft.one { justify-content: center; }
/* the plates under the box: deep blue with the box's light rim; the spot's plate darker, "Ball on" in gold */
.sb-nfl-goldbox-02 .bk { height: ${H - BACK_TOP}px; bottom: auto; }
.sb-nfl-goldbox-02 .ft { bottom: auto; top: ${H - FOOT_H}px; }
.sb-nfl-goldbox-02 .pl { position: absolute; left: 20px; right: 20px; border-radius: 20px; display: grid; place-items: center; align-content: center; background: linear-gradient(#1d2fb4, #121f86 60%, #0c1566);
  box-shadow: inset 0 0 0 4px #6f86f0, 0 4px 10px rgba(0,0,0,.55); font-size: 78px; line-height: 1; }
.sb-nfl-goldbox-02 .pl.spot { background: linear-gradient(#141c4a, #0a0f2e); line-height: 1.05; }
.sb-nfl-goldbox-02 .pl.spot .on { color: #f2cf4a; font-size: 64px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    root.appendChild(el('div', 'bk'));
    const gd = el('div', 'gd');
    // before the game each team's record in the score's place, smaller
    [g.away, g.home].forEach((t) => { const r = el('div'); const sc = el('span', '', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : ''); sc.style.flex = 'none'; if (g.status === 'pre') sc.style.fontSize = '.62em'; r.append(fit(el('span', '', (t.abbr || '').toUpperCase())), sc); gd.appendChild(r); });
    root.appendChild(gd);
    const hd = el('div', 'hd'); if (mk.ha) hd.appendChild(haMark(86)); if (g.league) hd.appendChild(el('span', '', g.league)); root.appendChild(hd);
    const ft = el('div', 'ft');   // the quarter at the left end, the clock at the right, as on air
    if (g.status === 'live') ft.append(el('span', '', (g.period.label || '') + (g.period.word ? '' : (g.period.suffix || '').toLowerCase())), el('span', '', g.clock || ''));
    else { ft.classList.add('one'); ft.appendChild(el('span', '', g.status === 'final' ? 'Final' : statusText(g, time))); }
    root.appendChild(ft);
    if (downOn(g)) {
      const dn = el('div', 'pl', g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, x) => d + x.toLowerCase()));
      dn.style.top = (H + PLATE_GAP) + 'px'; dn.style.height = DN_H + 'px';
      root.appendChild(dn);
      const at = spotOf(g);
      if (at) {
        const sp = el('div', 'pl spot'); sp.style.top = (H + 2 * PLATE_GAP + DN_H) + 'px'; sp.style.height = SPOT_H + 'px';
        sp.append(el('span', 'on', 'Ball on'), el('span', '', at));
        root.appendChild(sp);
      }
    }
  },
};
