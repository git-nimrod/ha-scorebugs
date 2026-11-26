// "Blue glass '25": after the SEC Network's college football bug (2025; frame: Florida Atlantic at Florida). A deep blue glossy bar:
// each team's name at the top of its half and its logo under it, a big white score towards the middle with its timeouts as three short
// bars beside it (the bar stays the network's blue for both teams); the middle a dark rounded panel with the down and distance over the
// clock over the quarter. The network's mark sat under the bug.
// Review: each half in its team's colour (the frame's two blues are Florida Atlantic's navy and Florida's royal blue; a
// fixed network blue turned Baylor and Harvard blue), the same darker strip for the name; the record in the score's place before the game.
import { el, logo, ordinal, statusText, fit, scoreSlot, teamColor, shade, FONTS } from '../kit.js';

const W = 1060, H = 128, MID = 230, SCORE_W = 162;   // a team's score column with its timeout bars
const NAME_PX = 26, SCORE_PX = 74, DOWN_PX = 26, CLOCK_PX = 34, PERIOD_PX = 24;

export default {
  id: 'cfb-sec-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the score columns go and both halves close up on the middle
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -9% vs the broadcast; 80 % of the correction
  typeScale: 1.079,
  fonts: [FONTS.saira],
  css: `
.sb-cfb-sec-25 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 700; font-stretch: 122%; color: #fff; }   /* wide squared capitals, as on air */
/* face: Saira at its widest (the pack's Unbounded match was too round for the SEC Network) */
.sb-cfb-sec-25 .bar { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr ${MID}px 1fr; grid-template-rows: minmax(0, 1fr); border-radius: 22px; overflow: hidden;   /* well-rounded ends, as on air (open since the first pass) */
  /* on air: the names on a darker strip along the top, a thin light line under it, and a brighter blue glass panel below (no gloss horizon) */
  background: #101216; box-shadow: 0 3px 8px rgba(0,0,0,.5); }   /* each half carries its team's glass; behind the centre box only dark */
.sb-cfb-sec-25 .ball { position: absolute; bottom: 0; width: 0; height: 0; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 11px solid #fff; }   /* the possession notch under the score */
.sb-cfb-sec-25 .tm { position: relative; display: grid; grid-template-columns: 1fr 22px 140px; grid-template-rows: 34px 1fr; align-items: center; padding: 0 0 0 16px; }
.sb-cfb-sec-25 .tm.h { grid-template-columns: 140px 22px 1fr; padding: 0 16px 0 0; }
/* the scores right against the middle */
.sb-cfb-sec-25 .tm.a .sc { justify-self: end; padding-right: 6px; } .sb-cfb-sec-25 .tm.h .sc { justify-self: start; padding-left: 6px; }
.sb-cfb-sec-25 .nm { grid-column: 1 / 4; font-size: ${NAME_PX}px; letter-spacing: .5px; white-space: nowrap; } .sb-cfb-sec-25 .tm.h .nm { text-align: right; }
.sb-cfb-sec-25 .tm .sb-logo { width: 104px; height: 60px; filter: drop-shadow(0 2px 2px rgba(0,0,0,.5)); object-fit: contain; justify-self: start; } .sb-cfb-sec-25 .tm.h .sb-logo { justify-self: end; }
.sb-cfb-sec-25 .to { display: grid; gap: 5px; justify-items: center; } .sb-cfb-sec-25 .to i { width: 16px; height: 5px; background: #dfe7f5; } .sb-cfb-sec-25 .to i.used { opacity: .25; }
.sb-cfb-sec-25 .sc { text-align: center; font-size: ${SCORE_PX}px; line-height: 1; font-weight: 800; font-stretch: 112%; filter: drop-shadow(0 3px 2px rgba(0,0,0,.4));
  background: linear-gradient(#ffffff 45%, #b8c0cc); -webkit-background-clip: text; background-clip: text; color: transparent; }   /* silver-lit figures, as on air */
/* the middle: a dark glass panel with a curved lit rim along its foot, bowed like the frame's; on top the down and distance on its own tab,
 rounded at the top and square at its foot; plainer, narrower figures than the team names, as on air */
.sb-cfb-sec-25 .md { display: grid; grid-template-rows: 34px 1fr 30px; justify-items: center; align-items: center; font-stretch: 100%;
  background: radial-gradient(120% 60% at 50% 105%, rgba(140,180,255,.28), rgba(140,180,255,0) 60%), linear-gradient(#2c3038, #121418);
  border-radius: 0 0 40px 40px / 0 0 18px 18px; margin: 0 4px 6px; box-shadow: inset 0 -2px 0 rgba(190,215,255,.45), 0 2px 6px rgba(0,0,0,.5); }
.sb-cfb-sec-25 .md .dn { font-size: ${DOWN_PX}px; align-self: stretch; justify-self: stretch; display: grid; place-items: center; margin: 0 22px;
  background: linear-gradient(#3a3f48, #1b1e23); border-radius: 12px 12px 0 0; box-shadow: inset 0 1px 0 rgba(255,255,255,.25); }
.sb-cfb-sec-25 .md .dn:empty { background: none; box-shadow: none; } .sb-cfb-sec-25 .md .ck { font-size: ${CLOCK_PX}px; line-height: 1; } .sb-cfb-sec-25 .md .pq { font-size: ${PERIOD_PX}px; color: #c9ced6; }
.sb-cfb-sec-25 .md .w { grid-row: 1 / 4; font-size: ${CLOCK_PX * 0.8}px; }
.sb-cfb-sec-25 .sb-ord { font-size: .62em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const team = (t, k) => {
      const p = el('div', 'tm ' + k), c = teamColor(t, '#1544a8');
      // team colour as glass: a darker strip for the name, a light line, then the panel with a shine across its top and a soft fall, a lit
      // rim along its edges
      p.style.background = 'linear-gradient(' + shade(c, -0.38) + ', ' + shade(c, -0.3) + ' 34px, rgba(255,255,255,.4) 34px, rgba(255,255,255,.4) 36px, transparent 36px), ' +
        // second pass: a glassy horizon across the whole panel, a bright upper half and a darker foot, as the frame
        'linear-gradient(transparent 36px, rgba(255,255,255,.26) 37px, rgba(255,255,255,.08) 78px, rgba(0,0,0,0) 82px, rgba(0,0,0,.28)), ' +
        // lighter at the outer end, deepening towards the middle
        'linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, 0.16) + ', ' + shade(c, -0.05) + ' 45%, ' + shade(c, -0.4) + ')';
      p.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,.22), inset ' + (k === 'a' ? '-3px' : '3px') + ' 0 0 rgba(255,255,255,.28)';
      if (live && t.hasBall) { const b = el('span', 'ball'); b.style[k === 'a' ? 'right' : 'left'] = '69px'; p.appendChild(b); }
      const nm = fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase());
      const to = el('span', 'to');
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      // before the game a long record (45-34, 10-14-1) steps down a size on one line in the slim column (it broke onto two)
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      if (g.status === 'pre') { sc.textContent = t.record || ''; sc.style.fontSize = Math.min(40, Math.floor(148 / Math.max(1, (t.record || '').length))) + 'px'; sc.style.whiteSpace = 'nowrap'; p.style.gridTemplateColumns = k === 'a' ? '1fr 0 104px' : '104px 0 1fr'; if (k === 'a') p.append(nm, logo(t, 120), to, sc); else p.append(nm, sc, to, logo(t, 120)); }   // the record in the score's place before the game
      else if (k === 'a') p.append(nm, logo(t, 120), to, sc); else p.append(nm, sc, to, logo(t, 120));
      return p;
    };
    const md = el('div', 'md');
    if (live) md.append(el('span', 'dn', g.football && g.football.short ? g.football.short : ''), el('span', 'ck', g.clock || ''), ordinal(g.period, 'pq'));
    else md.appendChild(el('span', 'w', statusText(g, time)));
    bar.append(team(g.away, 'a'), md, team(g.home, 'h'));
    root.appendChild(bar);
  },
};
