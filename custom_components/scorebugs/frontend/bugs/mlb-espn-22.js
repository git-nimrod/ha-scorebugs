// "Records strip '22": after ESPN's MLB bug (2020s; frame: Astros at Dodgers). A slim strip: each team on a panel of its colour with its
// logo, letters and score, and its record in small type underneath; then a black column with the inning number between yellow arrows,
// the bases in yellow with the outs as dots under them, and the count at the right. While the game is on (Scorebugs' sensors) the
// fielding team's band says who pitches ("P: Stone") and the batting team's who bats, and the pitch count sits under the count
// ("P:3"), as on the frame; the batter's lineup number in its small red box is left out (no data).
// "Have the pitching boxes be outside the main body of the bug. Same size but below the line there is now. Let
// logo/score/abbrev take over space": the coloured bands (record, pitcher, batter) hang under the box's bottom rule, under each team
// cell, 34 px tall as before; the box is
// 106 tall (the still's 0.106 of its width; was 116 with the bands inside) and the logo, letters and score fill each cell's height.
import { el, fit, otherSport, logo, bases, statusText, scoreSlot, teamColor, shade, inkOn, contrast, panelInk, FONTS } from '../kit.js';

const W = 1000, BODY = 106, BAND = 34, H = BODY + BAND, TEAM = 316, RULE = 3, INN = 64, BASES = 150;
const PRE_CUT = 70;   // a score's room in a team panel, left out before the first pitch
const ABBR_PX = 58, SCORE_PX = 64, LOGO = 74, REC_PX = 24, INN_PX = 46, COUNT_PX = 44;

export default {
  id: 'mlb-espn-22',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: both team panels lose the score room and the strip is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * PRE_CUT, h: H } : { w: W, h: H }),
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-mlb-espn-22 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 600; color: #fff; }
/* face: ESPN MLB: Barlow SemiCondensed Bold */
.sb-mlb-espn-22 .bx { position: absolute; left: 0; top: 0; right: 0; height: ${BODY}px; display: grid; grid-template-columns: ${TEAM}px ${TEAM}px ${INN}px ${BASES}px 1fr; gap: ${RULE}px; padding: ${RULE}px; box-sizing: border-box;
  background: #c9ccd1; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-mlb-espn-22 .tm { display: grid; grid-template-columns: auto 1fr auto; align-items: center; column-gap: 10px; padding: 2px 16px 2px 8px; box-sizing: border-box; }
.sb-mlb-espn-22 .tm .sb-logo { width: ${LOGO}px; height: ${LOGO - 4}px; object-fit: contain; }
.sb-mlb-espn-22 .tm .ab { font-size: ${ABBR_PX}px; line-height: 1; } .sb-mlb-espn-22 .tm .sc { font-size: ${SCORE_PX}px; line-height: 1; }
/* the band hangs under the box's bottom rule, the width of its team cell */
.sb-mlb-espn-22 .rc { position: absolute; top: ${BODY}px; height: ${BAND}px; display: flex; align-items: center; padding-left: 12px; box-sizing: border-box; overflow: hidden; font-size: ${REC_PX}px; font-weight: 500; line-height: 1; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
/* each team cell is black, the team's colour only in the band under it (frame) */
.sb-mlb-espn-22 .tm { background: linear-gradient(#0c0c0c, #000); color: #fff; }
.sb-mlb-espn-22 .k { background: linear-gradient(#141414, #050505); }
.sb-mlb-espn-22 .inn { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #e8d42c; font-size: ${INN_PX}px; line-height: 1; }
.sb-mlb-espn-22 .inn b { font-size: .4em; color: #5a5420; } .sb-mlb-espn-22 .inn b.on { color: #e8d42c; }
.sb-mlb-espn-22 .bs { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
.sb-mlb-espn-22 .bs .sb-bases i { background: #4f4a1c; } .sb-mlb-espn-22 .bs .sb-bases i.on { background: #e8d42c; }
.sb-mlb-espn-22 .outs { display: flex; gap: 10px; } .sb-mlb-espn-22 .outs i { width: 14px; height: 14px; border-radius: 50%; background: #4f4a1c; } .sb-mlb-espn-22 .outs i.on { background: #e8d42c; }
.sb-mlb-espn-22 .cnt { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: ${COUNT_PX}px; line-height: 1; }
.sb-mlb-espn-22 .cnt .pc { font-size: ${Math.round(COUNT_PX * 0.72)}px; }   /* "P:3" under the count, about 0.75 of its height (frame) */
.sb-mlb-espn-22 .w { grid-column: 3 / 6; display: grid; place-items: center; font-size: ${COUNT_PX * 0.8}px; }
.sb-mlb-espn-22 .bs.dt { padding: 0 10px; box-sizing: border-box; text-align: center; font-size: 30px; line-height: 1.1; white-space: pre-line; color: #fff; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const bx = el('div', 'bx');
    if (g.status === 'pre') bx.style.gridTemplateColumns = (TEAM - PRE_CUT) + 'px ' + (TEAM - PRE_CUT) + 'px ' + INN + 'px ' + BASES + 'px 1fr';
    const tw = g.status === 'pre' ? TEAM - PRE_CUT : TEAM;
    [g.away, g.home].forEach((t, i) => {
      // the strip in the team's own colour, the first one that is not near black (Orioles orange, Marlins blue), letters that read on it
      const c = [t.color, t.color2].find((x) => /^#[0-9a-f]{6}$/i.test(x || '') && contrast(x, '#000000') >= 2.2) || teamColor(t, '#3a3f47');
      const tm = el('div', 'tm');
      // live: the pitcher in the fielding team's band, the batter in the batting team's (when the sensor names them), else the record
      const p = b.pitcher && b.pitcher.last ? b : null, bats = t.hasBall;
      const who = live && p ? (bats ? (b.batter && b.batter.last) || '' : 'P: ' + b.pitcher.last) : '';
      const rc = el('span', 'rc', who || t.record || ''); rc.style.left = (RULE + i * (tw + RULE)) + 'px'; rc.style.width = tw + 'px'; rc.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.12) + ')'; rc.style.color = panelInk(t, c);
      const sc = g.status === 'pre' ? el('span', '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      tm.append(logo(t, LOGO), el('span', 'ab', (t.abbr || '').toUpperCase()), sc);
      bx.appendChild(tm); root.appendChild(rc);
    });
    if (live) {
      const inn = el('div', 'k inn'); inn.append(el('b', b.half === 'top' ? 'on' : '', '▲'), el('span', '', g.period.label || ''), el('b', b.half === 'top' ? '' : 'on', '▼'));
      const bs = el('div', 'k bs'), outs = el('span', 'outs'); for (let i = 0; i < 3; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      bs.append(bases(b.bases, 26), outs);
      const cnt = el('div', 'k cnt'); cnt.appendChild(el('span', '', b.balls + '-' + b.strikes));
      if (b.pitches != null) cnt.appendChild(el('span', 'pc', 'P:' + b.pitches));
      bx.append(inn, bs, cnt);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      bx.append(fit(el('div', 'k inn', os.period)), el('div', 'k bs dt', os.detail), el('div', 'k cnt', os.clock));
    } else bx.appendChild(el('div', 'k w', statusText(g, time)));
    root.appendChild(bx);
  },
};
