// "Centre diamond '26": after a team broadcast's MLB bug (2026 season set; frame: Rangers v Phillies). A wide box in the two teams'
// colours: each score in a white ring at the outer end and the logo inside, a black diamond in the middle holding the bases with the
// inning under them; under the box a dark strip with the count at the left and the outs at the right.
import { el, otherSport, bases, logo, statusText, teamColor, shade, scoreSlot, FONTS } from '../kit.js';

const W = 760, H = 212, TOP = 150, STRIP = 54, DIA = 196, BASE = 44;
// scores 88: on air the figure is about 44 % of the box's height (ours were 28 %)
const SCORE_PX = 88, ROW_PX = 40, INN_PX = 34;
const SC_ROOM = 136 + 18;   // a score cell and the gap after it

export default {
  id: 'mlb-diamond-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the score cells go and the box closes up on the diamond
  sizeFor: (g) => ({ w: W, h: H }),  // before the game the score boxes hold the records
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  // measured against the frame by the automatic audit: text -26% vs the broadcast; 80 % of the correction
  typeScale: 1.15,
  fonts: [FONTS.barlow700, FONTS.saira],
  css: `
.sb-mlb-diamond-26 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: MLB local media template: Barlow Bold */
.sb-mlb-diamond-26 .top { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TOP}px; display: grid; grid-template-columns: 1fr 1fr; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-diamond-26 .hf { display: flex; align-items: center; gap: 18px; padding: 0 24px; box-sizing: border-box; }
.sb-mlb-diamond-26 .hf.h { flex-direction: row-reverse; }
/* the score cell 136 wide: on air it takes the outer 19 % of the box (142 of 760) */
.sb-mlb-diamond-26 .ring { width: 136px; height: 100%; flex: none; display: grid; place-items: center; box-sizing: border-box; }
/* the score sits in its own cell at the outer end, set off from the logo by a thin dark line (frame: no ring) */
.sb-mlb-diamond-26 .hf.a .ring { border-right: 3px solid rgba(0,0,0,.28); } .sb-mlb-diamond-26 .hf.h .ring { border-left: 3px solid rgba(0,0,0,.28); }
.sb-mlb-diamond-26 .hf { padding: 0 24px 0 0; } .sb-mlb-diamond-26 .hf.h { padding: 0 0 0 24px; }
.sb-mlb-diamond-26 .top.pre .hf { padding: 0 24px; }
.sb-mlb-diamond-26 .sc { font-size: ${SCORE_PX}px; line-height: 1; }
.sb-mlb-diamond-26 .hf .sb-logo { width: 110px; height: 110px; object-fit: contain; }
.sb-mlb-diamond-26 .strip { position: absolute; left: 70px; right: 70px; top: ${TOP}px; height: ${STRIP}px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; box-sizing: border-box;
  background: #16181c; border-radius: 0 0 8px 8px; font-size: ${ROW_PX}px; }
/* the count and the outs in a wide, squared, lighter face in light grey, as on air (0-0, 2 OUTS) */
.sb-mlb-diamond-26 .strip { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 600; font-stretch: 118%; color: #e2e3e5; }
.sb-mlb-diamond-26 .dia { position: absolute; left: ${(W - DIA) / 2}px; top: ${(TOP + STRIP - DIA) / 2 + 4}px; width: ${DIA}px; height: ${DIA}px; }
.sb-mlb-diamond-26 .dia::before { content: ''; position: absolute; inset: ${DIA * 0.15}px; transform: rotate(45deg); background: #0c0d0f; box-shadow: 0 0 0 3px #3a3d44; }
/* bases sized and placed to the frame: each about a quarter of the diamond's height, second base near its top point, first and third at its widest */
.sb-mlb-diamond-26 .dia .sb-bases { position: absolute; left: 50%; top: 27px; transform: translateX(-50%); }
.sb-mlb-diamond-26 .dia .sb-bases i { background: transparent; border: 3px solid #555a63; } .sb-mlb-diamond-26 .dia .sb-bases i.on { background: #fff; border-color: #fff; }
.sb-mlb-diamond-26 .dia .inn { position: absolute; left: 0; right: 0; top: 118px; text-align: center; font-size: ${INN_PX}px; line-height: 1; }
.sb-mlb-diamond-26 .dia .inn b { display: block; font-size: .45em; line-height: 1; } .sb-mlb-diamond-26 .dia .inn b.off { visibility: hidden; }
.sb-mlb-diamond-26 .w { flex: none; max-width: 150px; white-space: nowrap; text-align: right;   /* the room right of the diamond's foot: the kit squeezes the time into it */
  font-size: ${ROW_PX * 0.75}px; }
.sb-mlb-diamond-26 .dia .dt { position: absolute; left: 40px; right: 40px; top: 44px; height: 66px; display: grid; place-items: center; text-align: center; font-size: 24px; line-height: 1.1; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const top = el('div', 'top');
    const w = W;
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k]) => {
      const c = teamColor(t, '#3a3f47');
      const hf = el('div', 'hf ' + k);
      // a matte panel lit softly from the top (frame: no glossy horizon)
      hf.style.background = 'linear-gradient(' + shade(c, 0.12) + ', ' + shade(c, -0.12) + ')';
      if (g.status === 'pre') { const ring = el('span', 'ring'), r = el('span', 'sc', t.record || ''); r.style.fontSize = ((t.record || '').length > 5 ? 26 : 34) + 'px'; ring.appendChild(r); hf.append(ring, logo(t, 110)); }
      else { const ring = el('span', 'ring'); ring.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g)); hf.append(ring, logo(t, 110)); }
      top.appendChild(hf);
    });
    const strip = el('div', 'strip');
    if (live) strip.append(el('span', '', b.balls + '-' + b.strikes), el('span', '', b.outs + (b.outs === 1 ? ' OUT' : ' OUTS')));
    else if (os) strip.append(el('span', '', os.clock), el('span', ''));
    // before and after: the start time (or FINAL) in the outs' place on the right, never under the diamond (pre-game review)
    else strip.append(el('span', ''), el('span', 'w', statusText(g, time)));
    const dia = el('div', 'dia'), inn = el('span', 'inn');
    dia.style.left = (w - DIA) / 2 + 'px';
    inn.append(el('b', live && b.half === 'top' ? '' : 'off', '▲'), el('span', '', live ? (g.period.label || '') : os ? os.period : ''), el('b', live && b.half === 'bot' ? '' : 'off', '▼'));
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    if (os) { if (os.detail) dia.appendChild(el('span', 'dt', os.detail)); dia.appendChild(inn); }
    else dia.append(bases(live ? b.bases : [false, false, false], BASE), inn);
    root.append(top, strip, dia);
  },
};
