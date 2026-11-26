// "Round logos '24": after AT&T SportsNet's Astros bug (2020s; frame: White Sox at Astros). A slim dark bar: each team's logo on a round
// dark disc with its score beside it, then the inning (a yellow arrow and the number), the bases as white diamonds, the outs as yellow
// dots stacked upright, and the network's round mark at the right end (here the Home Assistant logo on a disc). The pitcher line over
// the bar is left out (no data).
import { el, otherSport, logo, bases, statusText, scoreSlot, haMark, marks, teamColor, shade, FONTS } from '../kit.js';

const W = 1000, H = 124, BAR = 96, DISC = 116;
const SCORE_PX = 66, INN_PX = 52;
const SC_ROOM = 70 + 30;   // a score's width and the gap after it

export default {
  id: 'mlb-attsn-24',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the two score spaces go and the bar closes up, so it is shorter
  sizeFor: (g) => ({ w: W, h: H }),  // before the game the records stand in the scores' place
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  fonts: [FONTS.barlow700],
  css: `
.sb-mlb-attsn-24 { font-family: 'SB Barlow', 'Arial', sans-serif; font-weight: 700; color: #f2f3f5; }
/* face: MLB local media template: Barlow Bold */
.sb-mlb-attsn-24 .bar { position: absolute; left: ${DISC / 2}px; right: ${DISC / 2}px; top: ${(H - BAR) / 2}px; height: ${BAR}px; border-radius: 6px;
  background: linear-gradient(#3a3d43, #202226 55%, #16181b); box-shadow: 0 3px 8px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15); }
.sb-mlb-attsn-24 .row { position: absolute; inset: 0 8px 0 4px; display: flex; align-items: center; gap: 30px; }
.sb-mlb-attsn-24 .dc { flex: none; width: ${DISC}px; height: ${DISC}px; border-radius: 50%; display: grid; place-items: center; box-sizing: border-box;
  background: radial-gradient(circle at 40% 35%, #55585e, #26282c 70%); border: 3px solid #5d6066; box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sb-mlb-attsn-24 .dc { overflow: hidden; } .sb-mlb-attsn-24 .dc .sb-logo { width: 84px; height: 84px; object-fit: contain; }   /* on a disc of the team's own colour, filling it, as on air (NYY, HOU) */
.sb-mlb-attsn-24 .rec { width: 70px; margin-right: 30px; text-align: center; font-size: 30px; white-space: nowrap; } .sb-mlb-attsn-24 .dc .sb-ha { color: #f2f2f2; }
.sb-mlb-attsn-24 .sc { width: 70px; text-align: center; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-mlb-attsn-24 .inn { margin-left: 14px; font-size: ${INN_PX}px; font-weight: 600; line-height: 1; } .sb-mlb-attsn-24 .inn b { color: #f2c230; font-size: .6em; margin-right: 8px; vertical-align: .15em; }
.sb-mlb-attsn-24 .sb-bases i { border: 2px solid #e9eaec; background: transparent; } .sb-mlb-attsn-24 .sb-bases i.on { background: #e9eaec; }
.sb-mlb-attsn-24 .outs { display: flex; flex-direction: column; gap: 10px; } .sb-mlb-attsn-24 .outs i { width: 22px; height: 22px; border-radius: 50%; background: #4a4d52; } .sb-mlb-attsn-24 .outs i.on { background: #f2c230; }
.sb-mlb-attsn-24 .w { flex: 1; text-align: center; font-size: ${INN_PX * 0.8}px; font-weight: 600; }
.sb-mlb-attsn-24 .gap { flex: 1; }
.sb-mlb-attsn-24 .inn.ck { margin-left: 0; }
.sb-mlb-attsn-24 .dt { font-size: 30px; font-weight: 600; line-height: 1.1; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const row = el('div', 'row');
    [g.away, g.home].forEach((t) => {
      const dc = el('span', 'dc'), c = teamColor(t, '#2a2d33'); dc.style.background = 'radial-gradient(circle at 50% 35%, ' + shade(c, 0.08) + ', ' + shade(c, -0.35) + ')'; dc.appendChild(logo(t, 84));
      if (g.status === 'pre') row.append(dc, el('span', 'rec', t.record || ''));
      else row.append(dc, scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
    });
    if (live) {
      const inn = el('span', 'inn'); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      const outs = el('span', 'outs'); for (let i = 0; i < 2; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      // the bases wider and laid a little flat, with thin rims, as on air (the three span 1.7 times their height; ours 1.37)
      const bs = bases(b.bases, 38); bs.style.transform = 'scaleY(.75)'; bs.style.margin = '0 -7px';
      row.append(inn, bs, outs, el('span', 'gap'));
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      row.append(el('span', 'inn', os.period), el('span', 'inn ck', os.clock));
      if (os.detail) row.appendChild(el('span', 'dt', os.detail));
      row.appendChild(el('span', 'gap'));
    } else row.appendChild(el('span', 'w', statusText(g, time)));
    const mk = el('span', 'dc'); if (marks(opts).ha) mk.appendChild(haMark(70));
    row.appendChild(mk);
    const bar = el('div', 'bar');
    root.append(bar, row);
  },
};
