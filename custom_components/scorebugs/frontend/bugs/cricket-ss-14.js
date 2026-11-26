// "Crest bar '14": after the South African pay-TV test cricket bar (2014; frame: Australia 206-4 in the first innings). A green glass
// band along the bottom with a crest at each end (the batting side's at the left, the bowling side's at the right); on it a dark red box
// with the side and runs-wickets, two dark navy pills ("1st INNINGS", "RR 3.17"), a lime glass panel and a white box with the network's
// mark (the Home Assistant logo here); under them a white row with the batters' and bowler's figures.
// measured: wings 8.7 % and 8 %; red box 18.5 % of the width, 43 %
// of the height, #611a18 lit to #b14340 along the top, a pale rim; pills 18 % each, #051119 lit at the top, a light grey rim, corners
// 6 px; lime glass #bdec90 (#ffffe2 top); white box over both rows; the white row #f7f7f9 with a teal-grey top edge; band #49926d with a
// bright top (+44 L down to 10 %), horizon 72 %; capitals 23 % of the height on the top row, 13 % on the white row; letters condensed bold.
// measured on five 2014 stills: the top boxes are 47 % of the
// bar's height and stand 21 % above the green band (the band starts under their top fifth); the white row is as tall as they are; each
// top box has a light rim about 7-9 % of its height (#c2cab8 to #afaea0, lit along the side); the dark boxes are a slate-violet glass
// (top #6f7381 L 48 down to 32 %, then #41435a, foot #323549); the end box is a plain rounded rectangle of pale lime glass (#fbffda top
// left, #d8f9ab middle, #b0e884 foot, no rim); the band itself barely changes (L 42-51 top to foot, #198970), with a soft mint glow
// behind each crest. Letters grown with the boxes (capitals about half the box's height, as on air).
// Left out: the batters' and bowler's figures (no data): the white row carries the overs, the note and the other side's score.
import { el, fit, logo, haMark, marks, statusText, cricketState, cricketScore, FONTS } from '../kit.js';

const W = 1300, H = 106;

export default {
  id: 'cricket-ss-14',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-cricket-ss-14 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-ss-14 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-ss-14 *, .sb-cricket-ss-14 *::before { box-sizing: border-box; }
.sb-cricket-ss-14 .band { position: absolute; inset: 22px 0 0 0; background: radial-gradient(ellipse 80px 62% at 56px 62%, rgba(140,250,225,.3), rgba(140,250,225,0)), radial-gradient(ellipse 76px 62% at calc(100% - 52px) 62%, rgba(140,250,225,.28), rgba(140,250,225,0)), linear-gradient(#2a8070 0%, #1a7d68 7%, #198970 50%, #18846f 80%, #177e69 100%); }
.sb-cricket-ss-14 .wing { position: absolute; top: 22px; bottom: 0; width: 113px; display: grid; place-items: center; }
.sb-cricket-ss-14 .wing .sb-logo { width: 74px; height: 74px; object-fit: contain; }
.sb-cricket-ss-14 .w1 { left: 0; } .sb-cricket-ss-14 .w2 { right: 0; width: 104px; }
.sb-cricket-ss-14 .row1 { position: absolute; left: 113px; top: 1px; height: 54px; width: 962px; display: flex; gap: 8px; }
.sb-cricket-ss-14 .red { width: 241px; border-radius: 3px; background: linear-gradient(#b14340 0%, #963230 12%, #67100d 30%, #5f1311 55%, #59151d 100%); box-shadow: inset 0 0 0 3.5px #d6dccf, inset 0 0 0 4.5px rgba(40,8,6,.5), 0 0 0 1px #3b0c0a; display: flex; align-items: center; justify-content: center; gap: 22px; font-size: 43px; text-shadow: 0 2px 2px rgba(0,0,0,.6); white-space: nowrap; padding: 0 10px; }
.sb-cricket-ss-14 .pill { width: 228px; border-radius: 6px; background: linear-gradient(#8a8e9c 0%, #6f7381 14%, #50536a 31%, #34374c 50%, #2a2d40 78%, #24273a 100%); box-shadow: inset 0 0 0 3.5px #d6dccf, inset 0 0 0 4.5px rgba(20,22,30,.55), 0 0 0 1px #20232c; display: grid; place-items: center; font-size: 34px; white-space: nowrap; padding: 0 12px; text-shadow: 0 1px 1px #000; }
/* a glossy rounded square, a white glass band over its top half with a hard edge, a white rim, a bright foot */
.sb-cricket-ss-14 .lime { flex: 1; border-radius: 6px; background: linear-gradient(rgba(255,255,255,.62) 0%, rgba(255,255,255,.28) 48%, rgba(255,255,255,0) 50%), linear-gradient(#cdf59a 0%, #b9ee86 50%, #b6ee7f 52%, #c8f79a 100%); box-shadow: inset 0 0 0 2.5px #eef8e0, inset 0 -3px 0 rgba(235,255,200,.8), 0 0 0 1px rgba(90,150,70,.55); display: grid; place-items: center; color: #183a12; font-size: 33px; padding: 0 10px; }
.sb-cricket-ss-14 .mark { position: absolute; left: 1079px; top: 2px; width: 99px; height: 101px; border-radius: 3px; background: linear-gradient(#fdfdfd, #eef0f1 55%, #d9dcde); box-shadow: inset 0 0 0 2px #b8c6c0; display: grid; place-items: center; color: #3a4148; }
.sb-cricket-ss-14 .row2 { position: absolute; left: 113px; top: 59px; height: 45px; width: 962px; border-radius: 12px; background: linear-gradient(#bed9d6 0%, #dcebeb 10%, #f0f1f6 25%, #fcfbff 45%, #f0eff2 75%, #fcfcff 100%); box-shadow: inset 0 0 0 1px #9fb6b2; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; gap: 30px; color: #2a2a2e; font-size: 25px; white-space: nowrap; }
.sb-cricket-ss-14 .row2 > * { flex: none; }
.sb-cricket-ss-14 .row2 > [data-fit] { flex: 1 1 0; text-align: center; }
.sb-cricket-ss-14 .row2 small { font-size: 17px; }
`,
  draw(root, g, { time, opts }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase(), mk = marks(opts);
    const side = g.status === 'pre' ? g.home : c.bat, other = side === g.home ? g.away : g.home;
    const w1 = el('div', 'wing w1'), w2 = el('div', 'wing w2');
    w1.appendChild(logo(side, 74)); w2.appendChild(logo(other, 74));
    const row1 = el('div', 'row1'), row2 = el('div', 'row2'), red = el('div', 'red');
    const pill = (txt) => { const p = el('div', 'pill'); p.appendChild(fit(el('span', '', txt))); return p; };
    const lime = el('div', 'lime');
    if (g.status === 'pre') {
      red.append(el('span', '', ab(side)), el('span', '', 'v ' + ab(other)));
      row1.append(red, pill(statusText(g, time)), pill(g.note || ''), lime);
      row2.appendChild(fit(el('span', '', ((side.longName || side.name) + ' v ' + (other.longName || other.name)).toUpperCase())));
    } else {
      // runs-wickets ("206-4")
      red.append(el('span', '', ab(side)), el('span', '', c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.runs + '-' + c.wkts : String(c.runs)));
      // the innings as the frame writes it: "1st INNINGS"
      const n = g.period && g.period.n ? g.period.n : c.target != null || c.lead != null ? 2 : 1;
      const inn = el('span', ''); inn.append(n + (['th', 'st', 'nd', 'rd'][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] || 'th') + ' INNINGS');
      const p1 = el('div', 'pill'); p1.appendChild(inn);
      row1.append(red, p1, pill(c.rate != null ? 'RR ' + c.rate.toFixed(2) : 'RR -'), lime);
      const tl = c.result ? '' : c.target != null ? 'TARGET ' + c.target : c.lead != null ? (c.lead >= 0 ? 'LEAD ' + c.lead : 'TRAIL ' + -c.lead) : '';
      if (tl) lime.appendChild(fit(el('span', '', tl)));
      const ovs = el('span', ''); if (c.overs) { ovs.append('OVERS ' + c.overs); }
      const midTxt = c.result ? c.result.text : (g.note || '').toUpperCase();
      const opp = el('span', '', other.score != null ? 'v ' + ab(other) + ' ' + cricketScore(other) : '');
      row2.append(ovs, fit(el('span', '', midTxt)), opp);
    }
    const markBox = el('div', 'mark'); if (mk.ha) markBox.appendChild(haMark(58));
    root.append(el('div', 'band'), w1, w2, row1, row2, markBox);
  },
};
