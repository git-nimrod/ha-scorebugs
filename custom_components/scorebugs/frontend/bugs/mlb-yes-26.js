// "Silver strip '26": after the YES Network's Yankees bug (2026; frame: Marlins at Yankees; first filed as Fox, corrected from the
// reference pack's labelled frame BAS0014). A silver frame holding, for each team, its logo and letters on a
// dark navy plate with its score on a white plate; then the bases as navy diamonds over the inning, and the count over the outs as dots. The
// pitcher and batter line under the plates is left out (no data).
import { el, otherSport, logo, bases, statusText, scoreSlot, teamColor, shade, FONTS, GLOSS, BEVEL } from '../kit.js';

const W = 1000, H = 116, TEAM = 200, SCORE = 116;
const ABBR_PX = 46, SCORE_PX = 68, RT_PX = 38;

export default {
  id: 'mlb-yes-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first pitch the white score plates go (the kit's logo in them doubled the team's own logo) and the strip closes up
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - 2 * (SCORE + 6), h: H } : { w: W, h: H }),
  hug: '.fr',  // before and after the game the frame ends after the start time / FINAL (no empty silver)
  logos: 'dark',   // white one-colour logos on the dark / team-colour tiles, as on air (Phase 2b review)
  // measured against the frame by the automatic audit: text -33% vs the broadcast; 80 % of the correction
  typeScale: 1.041,
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-mlb-yes-26 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 700; color: #fff; }
/* face: YES Network: Barlow SemiCondensed Bold */
.sb-mlb-yes-26 .fr { position: absolute; inset: 0; display: grid; grid-template-columns: ${TEAM}px ${SCORE}px ${TEAM}px ${SCORE}px 1fr 120px; gap: 6px; padding: 8px; box-sizing: border-box;
  border-radius: 8px; background: linear-gradient(#f6f7f9, #dcdfe4 60%, #cdd1d7); box-shadow: 0 3px 8px rgba(0,0,0,.45); }
/* on air the frame is a pale, nearly flat silver (no dark chrome band), and each team's plate is its own dark colour (black for Miami, navy
 for New York) */
.sb-mlb-yes-26 .fr.pre { grid-template-columns: ${TEAM}px ${TEAM}px auto; justify-content: start; } .sb-mlb-yes-26 .fr.recs, .sb-mlb-yes-26 .fr.fin { grid-template-columns: ${TEAM}px ${SCORE}px ${TEAM}px ${SCORE}px auto; justify-content: start; }
.sb-mlb-yes-26 .fr > .sc:nth-child(2) { margin-right: 10px; }   /* the two team pairs a little apart, as on air */
.sb-mlb-yes-26 .sc.rec { font-size: ${SCORE_PX * 0.45}px; white-space: nowrap; }
.sb-mlb-yes-26 .nm { display: flex; align-items: center; gap: 10px; padding-left: 12px; border-radius: 4px; font-size: ${ABBR_PX}px; line-height: 1; }
.sb-mlb-yes-26 .nm .sb-logo { width: 60px; height: 60px; object-fit: contain; }
.sb-mlb-yes-26 .sc { display: grid; place-items: center; background: linear-gradient(#ffffff, #dfe2e7); box-shadow: ${BEVEL}; color: #121b30; font-size: ${SCORE_PX}px; line-height: 1; }
.sb-mlb-yes-26 .md { display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; color: #121b30; font-size: ${RT_PX * 0.8}px; line-height: 1; }
/* the bases wide and flat as on air: the three diamonds about 15 % of the bug wide and under half as tall as wide (frame 160 x 60 on a 1080 bug) */
.sb-mlb-yes-26 .md .sb-bases { transform: scaleY(.55); margin: -23px 0 -21px; }
.sb-mlb-yes-26 .md .sb-bases i { background: #b2b8c4; } .sb-mlb-yes-26 .md .sb-bases i.on { background: #121b30; }
.sb-mlb-yes-26 .md b { font-size: .6em; margin-right: 4px; vertical-align: .15em; }
.sb-mlb-yes-26 .rt { display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; border-left: 2px solid #aab0bb; color: #121b30; font-size: ${RT_PX}px; line-height: 1; }
.sb-mlb-yes-26 .dots { display: flex; gap: 8px; } .sb-mlb-yes-26 .dots i { width: 18px; height: 18px; border-radius: 50%; background: #b2b8c4; } .sb-mlb-yes-26 .dots i.on { background: #121b30; }
.sb-mlb-yes-26 .w { display: grid; place-items: center; padding: 0 24px; white-space: nowrap; color: #121b30; font-size: ${RT_PX * 0.75}px; }
.sb-mlb-yes-26 .md .dt { font-size: 26px; line-height: 1.05; text-align: center; white-space: pre-line; }
`,
  draw(root, g, { time }) {
    const os = otherSport(g, 8);
    const live = g.status === 'live' && !os;
    const b = g.baseball || { outs: 0, balls: 0, strikes: 0, bases: [false, false, false], half: '' };
    const recs = g.status === 'pre' && g.away.record && g.home.record;  // records before the game, every time
    const fr = el('div', recs ? 'fr recs' : g.status === 'pre' ? 'fr pre' : g.status === 'final' ? 'fr fin' : 'fr');
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#1c2a44'), nm = el('span', 'nm'); nm.append(logo(t, 52), el('span', '', (t.abbr || '').toUpperCase()));
      nm.style.background = GLOSS + ', linear-gradient(' + shade(c, -0.15) + ', ' + shade(c, -0.45) + ')';   // a dark shade of the team's colour
      fr.appendChild(nm);
      if (g.status !== 'pre') fr.appendChild(scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      else if (recs) fr.appendChild(el('span', 'sc rec', t.record));
    });
    if (live) {
      const md = el('span', 'md'), inn = el('span', ''); inn.append(el('b', '', b.half === 'top' ? '▲' : '▼'), document.createTextNode(g.period.label || ''));
      md.append(bases(b.bases, 46), inn);
      const rt = el('span', 'rt'), dots = el('span', 'dots'); for (let i = 0; i < 2; i++) dots.appendChild(el('i', i < b.outs ? 'on' : ''));
      rt.append(el('span', '', b.balls + '-' + b.strikes), dots);
      fr.append(md, rt);
    } else if (os) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const md = el('span', 'md'); md.append(el('span', 'dt', os.detail), el('span', '', os.period));
      const rt = el('span', 'rt'), ck = el('span', '', os.clock); ck.style.gridRow = '1 / 3'; rt.appendChild(ck);
      fr.append(md, rt);
    } else fr.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(fr);
  },
};
