// "Green strip '03": after Fox's NFL score strip (2003-05; frames: Bengals at Steelers, Packers at Eagles, Vikings at Panthers). A thin
// dark green strip across the bottom: each team's letters in its colour (or its small logo) and its score, the clock, the quarter, the
// down and distance on a grey plate when there is one, and the show's mark at the right end (here the Home Assistant logo).
// Review: letters only, no logos; was: each team's letters glow in
// its own colour (its first unless that is black or grey, lifted until it reads) on a box of the same colour, deep; the clock white, the quarter yellow; the down
// and distance upright on a silver plate leaning the same way as the team boxes.
import { el, statusText, scoreSlot, haMark, marks, teamBox, FONTS, vividColor, shade } from '../kit.js';

const W = 1280, H = 54,  // slimmer: the black outline hugs the team blocks
  PX = 42, SCORE_ROOM = 64;   // a score slot and its gap, per team

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-fox-03',
  size: { w: W, h: H },
  hug: '.st',  // the strip ends after the show's mark: no empty bar
  // before the kick-off there is no score: the score slots go and the strip is shorter by their room
  sizeFor: (g) => (closeUp(g) ? { w: W - 2 * SCORE_ROOM, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text +56% vs the broadcast, logos -36%; 80 % of the correction
  fonts: [FONTS.saira],
  css: `
.sb-nfl-fox-03 { font-family: 'SB Saira', 'Arial', sans-serif; font-weight: 800; color: #f2f2f2; }
.sb-nfl-fox-03 { font-weight: 700; font-stretch: 120%; }   /* face: Saira 700 at 120% width (medium confidence) */
.sb-nfl-fox-03 .st { position: absolute; inset: 0; display: flex; align-items: center; gap: 18px; padding: 0 30px 0 24px; box-sizing: border-box;
  background: linear-gradient(#1c1d1f, #070708 55%, #000); border: 2px solid #000; box-shadow: 0 0 0 1px #3a3c40;   /* black with a dark outline, not green */
  font-size: ${PX}px; line-height: 1; }
/* each team one slanted block: a glowing version of its colour under the letters fading to black under the score; only its slanted
 left and right edges, no boxes inside */
.sb-nfl-fox-03 .tm { display: flex; align-items: center; gap: 22px; height: 46px; padding: 0 26px 0 22px; margin-right: -14px; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%); }
.sb-nfl-fox-03 .tm + .tm { margin-left: -2px; }   /* the two teams joined, only a thin black line between them */
.sb-nfl-fox-03 .tm:nth-of-type(2) { margin-right: 4px; }
.sb-nfl-fox-03 .tm .ab { display: grid; place-items: center; height: 46px; text-shadow: 0 1px 3px rgba(0,0,0,.7); color: #fff; }   /* a box leaning top-left to bottom-right, white letters, a bright top line */
.sb-nfl-fox-03 .ck { color: #f2f2f2; margin-left: 8px; } .sb-nfl-fox-03 .q { color: #f2d23a; font-size: ${PX * 0.85}px; }
.sb-nfl-fox-03 .dn { padding: 6px 32px; letter-spacing: .06em; background: linear-gradient(#eef0ed, #b9bdb8 55%, #9fa39e); color: #161816; font-size: ${PX * 0.85}px; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 100%, 14px 100%); }
.sb-nfl-fox-03 .dn:empty { display: none; }
.sb-nfl-fox-03 .sb-ha { color: #f2f2f2; margin-left: 30px; }
.sb-nfl-fox-03 .w { color: #f2d23a; font-size: ${PX * 0.8}px; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const st = el('div', 'st');
    [g.away, g.home].forEach((t) => {
      // the team's box: lightened team colour, white letters, a contrasting line along its top (kit teamBox)
      const c = vividColor(t, '#3a3f47'), lit = shade(c, 0.35);
      const tm = el('span', 'tm'); const ab = el('span', 'ab', (t.abbr || '').toUpperCase());
      tm.style.background = 'linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,0) 50%), linear-gradient(90deg, ' + lit + ' 0%, ' + c + ' 22%, ' + shade(c, -0.6) + ' 42%, #000 55%)';  // black from before the score
      // (no glow round the whole block: it put colour on the score's black end)
      tm.append(ab);
      if (!closeUp(g)) tm.appendChild(scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      st.appendChild(tm);
    });
    if (live) st.append(el('span', 'ck', g.clock || ''), el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '')),
      el('span', 'dn', g.football && g.football.short ? g.football.short : ''));
    else st.appendChild(el('span', 'w', statusText(g, time)));
    if (marks(opts).ha) st.appendChild(haMark(44));
    root.appendChild(st);
  },
};
