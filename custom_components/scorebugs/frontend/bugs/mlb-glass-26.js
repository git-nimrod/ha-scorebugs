// "Dark glass '26": after Apple TV's Friday Night Baseball bug (2026; frame: Guardians at Mariners). Each team's logo beside a large score at
// either side, the bases in grey and white between them; under them the inning (a yellow arrow and the inning in mixed case), the outs as
// dots and the count. The pitcher and batter lines at the bottom are left out (no data).
import { el, otherSport, logo, bases, ordinal, statusText, scoreSlot, teamColor, FONTS, vividColor } from '../kit.js';

const W = 560, H = 160, TOP = 94;   // the frame's two rows run 139 px of 157 at our scale from the card's top to the rule above the pitcher line (Nov 25 pass)
const SCORE_PX = 76, LOW_PX = 34, PRE_W = 400;   // cap heights on air 13 % and 18 % smaller than before

export default {
  id: 'mlb-glass-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch there is no score: the logos close up on the bases and the card is narrower
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: PRE_W, h: H } : { w: W, h: H }),   // records keep the room
  logos: 'dark',   // the logos' versions for dark grounds: a navy logo (Yankees, Dodgers) was lost on the navy glass
  fonts: [FONTS.inter],
  css: `
.sb-mlb-glass-26 { font-family: 'SB Inter V', 'Arial', sans-serif; font-weight: 600; color: #f4f5f7; }
/* face: Apple TV 2026: Inter Bold (SF Pro confirmed) */
.sb-mlb-glass-26 .gl { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: ${TOP}px 1fr; padding: 6px 18px; box-sizing: border-box;
  border-radius: 14px; -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);   /* see-through glass: black in the middle, each team's colour glowing round from its end; set in draw */ box-shadow: 0 3px 10px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12); }
.sb-mlb-glass-26 .tm { display: flex; align-items: center; justify-content: center; gap: 16px; font-size: ${SCORE_PX}px; font-weight: 700; line-height: 1; }   /* bold figures, as on air */
.sb-mlb-glass-26 .tm .rec { font-size: ${SCORE_PX * 0.36}px; white-space: nowrap; }
.sb-mlb-glass-26 .tm .sb-logo { width: 70px; height: 76px; object-fit: contain; }
.sb-mlb-glass-26 .bs { display: grid; place-items: center; } .sb-mlb-glass-26 .bs .sb-bases { transform: scaleY(.62); }   /* the bags laid flat in perspective, as on air */ .sb-mlb-glass-26 .bs .sb-bases i { background: linear-gradient(37deg, #3a3d46, #1c1e24 70%); box-shadow: 2px 2px 0 #14151a; }   /* empty bags are dark glass on air (#25282c), not mid grey (frame, Nov 25) */ .sb-mlb-glass-26 .bs .sb-bases i.on { background: linear-gradient(316deg, #ffffff, #e4e6ea); box-shadow: 2px 2px 0 #9ea2ab; }   /* thick bags with an edge below (frame) */
.sb-mlb-glass-26 .lo { display: grid; place-items: center; font-size: ${LOW_PX}px; line-height: 1; }
.sb-mlb-glass-26 .lo b { color: #f2c230; font-size: .6em; margin-right: 6px; vertical-align: .15em; } .sb-mlb-glass-26 .lo .sb-ord { font-size: .8em; text-transform: lowercase; }
.sb-mlb-glass-26 .dots { display: flex; gap: 10px; } .sb-mlb-glass-26 .dots i { width: 18px; height: 18px; border-radius: 50%; background: #5b5f6b; } .sb-mlb-glass-26 .dots i.on { background: #f4f5f7; }
.sb-mlb-glass-26 .w { grid-column: 1 / 4; display: grid; place-items: center; font-size: ${LOW_PX * 0.8}px; }
.sb-mlb-glass-26 .bs .dt { font-size: 26px; line-height: 1.1; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const gl = el('div', 'gl');
    const rgba = (c, a) => 'rgba(' + [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)).join(', ') + ', ' + a + ')';
    const ca = vividColor(g.away, '#1e345a'), ch = vividColor(g.home, '#1e345a');
    // each colour spreading from its top outer corner in a curve that reaches about two thirds of the way down, black through the middle
    // and along the foot
    // the colour fading out softly towards its curved edge, as the reference
    const glow = (c, at) => 'radial-gradient(ellipse 48% 92% at ' + at + ' 0%, ' + rgba(c, 0.8) + ' 0%, ' + rgba(c, 0.55) + ' 28%, ' + rgba(c, 0.28) + ' 55%, ' + rgba(c, 0.1) + ' 78%, ' + rgba(c, 0) + ' 100%)';
    gl.style.background = glow(ca, '0%') + ', ' + glow(ch, '100%') + ', rgba(5, 6, 8, .7)';
    const team = (t, logoFirst) => {
      const tm = el('span', 'tm');
      if (g.status === 'pre') { tm.append(logo(t, 70)); if (g.away.record && g.home.record) { const r = el('span', 'rec', t.record); if (logoFirst) tm.appendChild(r); else tm.prepend(r); } return tm; }  // records before the game, every time
      const sc = scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g);
      if (logoFirst) tm.append(logo(t, 70), sc); else tm.append(sc, logo(t, 70));
      return tm;
    };
    // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
    const bs = el('span', 'bs');
    if (os) { if (os.detail) bs.appendChild(el('span', 'dt', os.detail)); } else bs.appendChild(bases(live ? b.bases : [false, false, false], 34));
    gl.append(team(g.away, true), bs, team(g.home, false));
    if (live) {
      const inn = el('span', 'lo'); const i = el('span', ''); i.append(el('b', '', b.half === 'top' ? '▲' : '▼'), ordinal(g.period)); inn.appendChild(i);
      const outs = el('span', 'lo'), dots = el('span', 'dots'); for (let k = 0; k < 2; k++) dots.appendChild(el('i', k < b.outs ? 'on' : '')); outs.appendChild(dots);
      gl.append(inn, outs, el('span', 'lo', b.balls + '-' + b.strikes));
    } else if (os) gl.append(el('span', 'lo', os.period), el('span', 'lo'), el('span', 'lo', os.clock));
    else gl.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(gl);
  },
};
