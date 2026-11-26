// "Silver plates '16": after NBC's Sunday Night Football bug (2016-17; frame: Patriots at Seahawks). A chrome bar: each team on a silver
// plate with its logo and letters, its score on a dark navy plate with timeout dashes under it; then a light box with the quarter and the
// clock (the play clock's place left out: no data), the down and distance on a dark panel with a red line under it, and the network's
// mark at the right end (here the Home Assistant logo).
import { el, logo, statusText, haMark, marks, scoreSlot, FONTS, teamColor, shade, teamInk } from '../kit.js';

const W = 1100, H = 64,   // 1100: the bar ends just after the network's mark, as on air (it ran on 110 px of empty chrome)
  BAR = 56, PLATE = 170, SCORE = 76, CLOCK = 210, DOWN = 260, MARK = 70;
// letters 37: capitals about 47 % of the bar's height, as on air (frame: 17 of 36 px)
const ABBR_PX = 37, SCORE_PX = 40, CLOCK_PX = 32, DOWN_PX = 30;

export default {
  id: 'nfl-nbc-16',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // the down-and-distance panel only while the game is on (it stood empty before and after); before the kick-off the empty navy score
  // plates go too, so the bar closes up
  // the down and distance room only for a football game while it runs (another sport's game left it standing empty)
  sizeFor: (g) => ({ w: W - (g.status === 'live' && g.football ? 0 : DOWN + 4), h: H }),  // before the game the score boxes hold the records
  // the upright files (only the italic file was loaded, so the letters drew slanted whatever the style said)
  fonts: [FONTS.barlowSemi600, FONTS.barlowSemi700],
  css: `
.sb-nfl-nbc-16 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 600; font-stretch: 92%; color: #fff; }
.sb-nfl-nbc-16 { font-style: normal; }   /* upright, as in the frame (NE, SEA) */
.sb-nfl-nbc-16 .bar { position: absolute; left: 0; top: 0; width: 100%; height: ${BAR}px; display: flex; align-items: center; gap: 4px; padding: 4px 16px; box-sizing: border-box; border-radius: 10px;   /* square ends with rounded corners */
 
  background: linear-gradient(#f3f4f5, #9ea3a9 50%, #c3c7cb 55%, #7d8288); box-shadow: 0 3px 6px rgba(0,0,0,.5); }
/* at each end, where the team's plate (left) and the mark (right) meet the grey chrome, an upright bar as on air: a dark groove, a bright
 bar and a dark hairline against the plate, mirrored at the right end (frame: about 2, 2 and 1 px on a 35 px bar, so 4, 3 and 1 here) */
.sb-nfl-nbc-16 .bar::before, .sb-nfl-nbc-16 .bar::after { content: ''; position: absolute; top: 4px; bottom: 4px; width: 8px; }
.sb-nfl-nbc-16 .bar::before { left: 8px; background: linear-gradient(90deg, #2c3036 0 4px, #f6f7f9 4px 7px, #4e535a 7px); }
.sb-nfl-nbc-16 .bar::after { right: 8px; background: linear-gradient(270deg, #2c3036 0 4px, #f6f7f9 4px 7px, #4e535a 7px); }
.sb-nfl-nbc-16 .pl { position: relative; width: ${PLATE}px; height: 100%; flex: none; display: flex; align-items: center; justify-content: space-between; padding: 0 14px 0 4px; box-sizing: border-box;
  background: linear-gradient(#ffffff, #cdd1d6); color: #1b2a44; }
.sb-nfl-nbc-16 .pl { overflow: hidden; } .sb-nfl-nbc-16 .pl .sb-logo { width: 84px; height: 56px; margin-left: -20px; object-fit: contain; }   /* bigger, cut on the left */ .sb-nfl-nbc-16 .pl .ab { font-size: ${ABBR_PX}px; }
.sb-nfl-nbc-16 .sc { position: relative; width: ${SCORE}px; height: 100%; flex: none; display: grid; place-items: center; background: linear-gradient(#25375a, #0f1b33); font-size: ${SCORE_PX}px; font-weight: 700; line-height: 1; }
.sb-nfl-nbc-16 .sb-pips { position: absolute; left: -${PLATE - 10}px; right: 6px; bottom: -6px; display: flex; gap: 8px; } .sb-nfl-nbc-16 .sb-pips i { flex: 1; height: 3px; background: #f2f2f2; } .sb-nfl-nbc-16 .sb-pips i.used { opacity: .25; }
.sb-nfl-nbc-16 .ck { width: ${CLOCK}px; height: 100%; flex: none; display: flex; align-items: center; justify-content: space-evenly; background: linear-gradient(#ffffff, #d4d7db); color: #1b1d21; font-size: ${CLOCK_PX}px; }
.sb-nfl-nbc-16 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-nfl-nbc-16 .dn { width: ${DOWN}px; height: 100%; flex: none; display: grid; place-items: center; background: linear-gradient(#25375a, #0f1b33); box-shadow: inset 0 -4px 0 #d0202b; font-size: ${DOWN_PX}px; }
.sb-nfl-nbc-16 .mk { width: ${MARK}px; flex: none; display: grid; place-items: center; } .sb-nfl-nbc-16 .mk .sb-ha { color: #1b2a44; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    [g.away, g.home].forEach((t) => {
      // the team's own logo in its colours, never the black on-air version
      const lg = logo(t, 84); if (t.onAir && t.onAir.logo === 'black') { lg.style.filter = ''; delete lg.dataset.outline; lg.dataset.crop = 'own'; }
      const pl = el('div', 'pl'); pl.append(lg, el('span', 'ab', (t.abbr || '').toUpperCase()));
      const sc = g.status === 'pre' ? el('span', 'sc', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre') sc.style.fontSize = ((t.record || '').length > 5 ? 20 : 26) + 'px';
      const pp = el('span', 'sb-pips');
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) pp.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      sc.appendChild(pp);
      // the score box in the team's own colour, glossy like the metal round it
      const tc = teamColor(t, '#25375a'); sc.style.background = 'linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,0) 48%, rgba(0,0,0,.12)), linear-gradient(' + shade(tc, 0.05) + ', ' + shade(tc, -0.35) + ')'; sc.style.color = teamInk(tc);
      bar.append(pl, sc);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(36));
    bar.appendChild(ck);
    if (live && g.football) {
      const dn = el('span', 'dn', g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()) : '');
      // in the colour of the team with the ball
      const lead = g.away.hasBall ? g.away : g.home.hasBall ? g.home : null;
      if (lead) { const c = teamColor(lead, '#25375a'); dn.style.background = 'linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,0) 48%, rgba(0,0,0,.12)), linear-gradient(' + shade(c, 0.05) + ', ' + shade(c, -0.35) + ')'; dn.style.color = teamInk(c); dn.style.boxShadow = 'none'; }
      bar.appendChild(dn);
    }
    bar.appendChild(mk);
    root.appendChild(bar);
  },
};
