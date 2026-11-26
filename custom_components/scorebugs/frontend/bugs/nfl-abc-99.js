// "Red oval '99": after ABC's Monday Night Football bug (1999-2000). A small upright box: across its top a glossy black oval with a red swoosh, the quarter in it and the clock on a
// white oval at its right end; under it a dark see-through box with each team's letters and its score on a grey cell; under the box the
// down and distance in gold on a dark plate with a gold rule along its top.
import { el, statusText, scoreSlot, FONTS } from '../kit.js';

// rows lower and the oval thinner, as on air (frame: oval 0.28 of the bug's height, each row about 52 on a 415 wide bug); the black oval
// starts at the box's left edge and only the white clock oval runs past its right side
const W = 420, TOP = 68, ROW = 56, DOWN = 50, H = TOP + 2 * ROW + 16 + DOWN;

export default {
  id: 'nfl-abc-99',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H : TOP + 2 * ROW + 12 }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-abc-99 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 80%; color: #fff; }
.sb-nfl-abc-99 .ov { position: absolute; left: 41px; right: 0; top: 0; height: ${TOP}px; border-radius: 50%; z-index: 2; display: flex; align-items: center; padding-left: 70px; box-sizing: border-box;
  background: radial-gradient(ellipse 70% 60% at 22% 40%, rgba(230,30,40,.95), rgba(150,10,20,.6) 45%, rgba(0,0,0,0) 70%), linear-gradient(#3a3a3e, #0a0a0b 55%, #000);
  box-shadow: 0 4px 8px rgba(0,0,0,.6), inset 0 2px 3px rgba(255,255,255,.35); font-size: 38px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
/* the quarter's letters sit over the see-through box, crisp as on air (the oval itself lies under the box) */
.sb-nfl-abc-99 .qt { position: absolute; left: 41px; right: 0; top: 0; height: ${TOP}px; z-index: 4; display: flex; align-items: center; padding-left: 70px; box-sizing: border-box; font-size: 38px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nfl-abc-99 .qt .sb-ord { font-size: .75em; }
.sb-nfl-abc-99 .clk { position: absolute; right: 0; top: 6px; width: 190px; height: ${TOP - 12}px; border-radius: 50%; z-index: 5; display: grid; place-items: center;
  background: radial-gradient(ellipse at 50% 30%, #ffffff, #e4e4e8 60%, #b9bcc2); color: #121214; font-size: 42px; line-height: 1; box-shadow: 0 2px 5px rgba(0,0,0,.5); }
.sb-nfl-abc-99 .clk.w { font-size: 30px; }
/* the box lies on top of the red and black oval, as on air: it rises to the oval's top with square corners (frame: box and oval both start
 69 px down; the oval's red end starts 6 px inside the box's left edge, 11 px here) and is see-through over it, so the oval shows through;
 only the white clock oval lies over everything */
.sb-nfl-abc-99 .bx { position: absolute; left: 30px; right: 30px; top: 0; z-index: 3; padding: ${TOP + 4}px 16px 8px; display: grid; grid-auto-rows: ${ROW - 6}px; gap: 6px;
  background: linear-gradient(rgba(16,16,18,.22), rgba(16,16,18,.22) ${TOP - 8}px, rgba(30,30,32,.9) ${TOP + 2}px, rgba(10,10,12,.9)); box-shadow: 0 4px 8px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.12); }
.sb-nfl-abc-99 .ln { display: flex; align-items: center; justify-content: space-between; font-size: 40px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.6); }
.sb-nfl-abc-99 .sc { min-width: 66px; height: 100%; display: grid; place-items: center; background: linear-gradient(#8b8e94, #5c5f65); box-shadow: inset 0 1px 0 rgba(255,255,255,.35), inset 0 -2px 0 rgba(0,0,0,.35); }
.sb-nfl-abc-99 .sc.rec { font-size: 28px; padding: 0 8px; }
.sb-nfl-abc-99 .dn { position: absolute; left: 30px; right: 30px; top: ${TOP + 2 * ROW + 16}px; height: ${DOWN}px; display: grid; place-items: center; color: #f0d27a; font-size: 34px; line-height: 1;
  background: linear-gradient(#2d2a20, #14120d); border-top: 3px solid #d9b450; box-sizing: border-box; box-shadow: 0 4px 8px rgba(0,0,0,.5); }
.sb-nfl-abc-99 .dn .sb-ord { font-size: .75em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const ov = el('div', 'ov'), qt = el('div', 'qt');
    if (live) { qt.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) qt.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase())); }
    const clk = el('div', 'clk' + (live ? '' : ' w'), live ? g.clock || '' : statusText(g, time));
    const bx = el('div', 'bx');
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      ln.append(el('span', '', (t.abbr || '').toUpperCase()), g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    root.append(ov, bx, qt, clk);
    if (live && g.football && g.football.short) {
      const dn = el('div', 'dn'); const m = /^(\d)(ST|ND|RD|TH)(.*)$/.exec(g.football.short);
      const tx = el('span', ''); tx.style.whiteSpace = 'pre';
      if (m) tx.append(document.createTextNode(m[1]), el('span', 'sb-ord', m[2]), document.createTextNode(m[3])); else tx.textContent = g.football.short;
      dn.appendChild(tx); root.appendChild(dn);
    }
  },
};
