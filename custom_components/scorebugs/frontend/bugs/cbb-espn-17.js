// "Colour blocks '17": after ESPN's college basketball bug (2017-26; frame: Duke at Louisville). Each team a panel in its colour: the
// rank and name over the record (conference record in brackets when the feed has it), a column of timeout dots, and a big score towards
// the middle; the middle a black box with the clock over the half. The network's mark sat under the bug. Fouls, bonus and possession
// need data the sensor lacks.
import { el, statusText, teamColor, teamPair, shade, teamInk, scoreSlot, fit, FONTS } from '../kit.js';

// loop pass 1 (the frame's ink measured by hand, its 45 x 494 px bar x2.51 to our width): the bar 113 tall at this
// width (was 100: on air it is 1:11, ours was 1:12.4); the score figures 28 px on air = 70 here (ours 52); the names' capitals
// 8-9 px on air = 20-23 here (ours 26); the records 12 px of ink on air = 30 here (ours 24: 28 px type, which also keeps them
// readable on a 40 px card)
const W = 1240, H = 113, MID = 190, TIMEOUTS = 4;
const NAME_PX = 28, RANK_PX = 20, REC_PX = 28, SCORE_PX = 86, CLOCK_PX = 36, HALF_PX = 28;

export default {
  id: 'cbb-espn-17',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -28% vs the broadcast; 80 % of the correction
  typeScale: 1.129,
  fonts: [FONTS.inter],
  css: `
.sb-cbb-espn-17 { font-family: 'SB Inter V', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; display: grid; grid-template-columns: 1fr ${MID}px 1fr; height: ${H}px; gap: 3px;
/* face: ESPN 2016 package: Inter */
  background: #e9e9e9; padding: 3px; box-sizing: border-box; box-shadow: 0 3px 8px rgba(0,0,0,.45); }
.sb-cbb-espn-17 .tm { display: grid; grid-template-columns: 1fr 22px 132px; align-items: center; padding-left: 16px; }   /* three figures clear of the clock box (was 120) */
.sb-cbb-espn-17 .tm.h { grid-template-columns: 132px 22px 1fr; padding: 0 16px 0 0; }
.sb-cbb-espn-17 .id { display: grid; justify-items: end; padding-right: 10px; min-width: 0; } .sb-cbb-espn-17 .tm.h .id { justify-items: start; padding: 0 0 0 10px; }
.sb-cbb-espn-17 .nm { font-size: ${NAME_PX}px; line-height: 1.05; white-space: nowrap; max-width: 100%; }
.sb-cbb-espn-17 .nm b { font-size: ${RANK_PX}px; font-weight: 600; margin-right: 6px; }
.sb-cbb-espn-17 .rec { font-size: ${REC_PX}px; font-weight: 600; line-height: 1.1; opacity: .95; }
.sb-cbb-espn-17 .to { display: grid; gap: 4px; justify-items: center; } .sb-cbb-espn-17 .to i { width: 9px; height: 9px; border-radius: 50%; background: #fff; } .sb-cbb-espn-17 .to i.used { opacity: .25; }
.sb-cbb-espn-17 .sc { display: grid; place-items: center; font-size: ${SCORE_PX}px; line-height: 1; padding: 0 10px; box-sizing: border-box; }   /* three figures keep clear of the clock box */
.sb-cbb-espn-17 .md { display: grid; grid-template-rows: 1fr 1fr; align-items: center; justify-items: center; background: linear-gradient(#141416, #000); }
.sb-cbb-espn-17 .md .ck { font-size: ${CLOCK_PX}px; line-height: 1; } .sb-cbb-espn-17 .md .hf { font-size: ${HALF_PX}px; line-height: 1; }
.sb-cbb-espn-17 .md .w { grid-row: 1 / 3; font-size: ${HALF_PX}px; text-align: center; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');   // never two alike blocks (Alabama red against Arizona State maroon: ASU takes its gold)
    const team = (t, k) => {
      const c = pair[k === 'a' ? 0 : 1];
      const p = el('div', 'tm ' + k);
      // flat colour, darker towards the outer end; no gloss
      p.style.background = 'linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, -0.15) + ', ' + c + ' 70%)';
      p.style.color = teamInk(c);
      const id = el('div', 'id'), nm = fit(el('span', 'nm'), (t.abbr || '').toUpperCase());
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase()));
      id.append(nm, el('span', 'rec', t.record || ''));
      const to = el('span', 'to');
      if (live && t.timeouts != null) for (let i = 0; i < TIMEOUTS; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      const sc = fit(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));  // three figures fit their box
      if (k === 'a') p.append(id, to, sc); else p.append(sc, to, id);
      return p;
    };
    const md = el('div', 'md');
    // the clock over the half ("2nd"), as on air
    if (live) md.append(el('span', 'ck', g.clock || ''), el('span', 'hf', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()));
    else md.appendChild(el('span', 'w', statusText(g, time)));
    root.append(team(g.away, 'a'), md, team(g.home, 'h'));
  },
};
