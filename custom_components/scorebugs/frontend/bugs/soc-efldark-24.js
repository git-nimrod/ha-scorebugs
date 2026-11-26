// "Four tiles dark '24": after Sky Sports' EFL bug of 2024-25 in its dark form (frame: reference pack SOC0001, Preston v Leeds, 82:30,
// 1-0; the best frame of the pack's EFL set, 2766 px wide). The same four tiles as "Four tiles '24" (soc-efl-24), but the score and the
// clock stand white on near-black tiles; the team tiles carry the kit colour with dark letters on a light kit (Preston's white, Leeds'
// pink), white on a dark one. build both, light and dark (theme "Sky EFL 2024-25").
// Measured: tiles 83.4 / 78.4 / 76.9 / 102.2 wide and 38.6
// tall; letters cap 0.47 of the bar (dark grey on a light kit), score and clock cap 0.52, white; dark tiles #333333 and #34332e; the
// light tiles a touch lighter at the top (#f2f0f4 to #dcdade on Preston's white); corners rounded about 2 px.
// "not seeing the glass on this one. Time and score should be black, team color should be there". Sampled on the
// frame in a 3x3 grid: the score and clock tiles are black glass, lit dark grey over the top 58 % (L 22-23, #383535)
// with a hard step to black (L 0-1) below; the team tiles lit at the top (+4 L), a step of 6 at 60 %, darkest at the foot (-11 to -13
// L: Preston #f0eeee -> #c8c7cc, Leeds #e2a3a0 -> #b27972), the colour kept all the way down.
import { el, soccerClock, homeFirst, teamColor, teamInk, teamPair, alikeColors, contrast, glassCover, FONTS, scoreSlot, fit } from '../kit.js';

const HT = 130, SC = 122, AT = 120, CK = 159, H = 60, W = HT + SC + AT + CK;
// black glass for the score and clock tiles: near black, lit dark grey down to a hard horizon at 58 % (frame grid)
const DARK = { background: 'linear-gradient(180deg, rgba(255,255,255,.17) 0, rgba(255,255,255,.07) 44%, rgba(255,255,255,0) 52%), linear-gradient(#060607, #000)' };
// the kit colour as the team wears it, light kits included (Preston's white, Leeds' pink on air); the kit's darker stand-in only when the
// two would look alike
const kit = (t) => { const c = (t.onAir && t.onAir.color) || t.color; return !t.pairColor && /^#[0-9a-f]{6}$/i.test(c || '') ? c : teamColor(t, '#3a3f47'); };

export default {
  id: 'soc-efldark-24',
  size: { w: W, h: H },
  fonts: [FONTS.openSans],
  css: `
.sb-soc-efldark-24 { font-family: 'SB Open Sans', Arial, sans-serif; font-weight: 600; color: #fff; }
.sb-soc-efldark-24 .row { position: absolute; left: 0; top: 0; height: ${H}px; display: flex; }
.sb-soc-efldark-24 .t { height: ${H}px; display: grid; place-items: center; box-sizing: border-box; padding: 0 8px; white-space: nowrap; overflow: hidden; border-radius: 2px; }
/* letters: cap 0.47 of the bar (28 px / Open Sans' 0.714) */
.sb-soc-efldark-24 .ab { font-size: 39px; line-height: 1; }
.sb-soc-efldark-24 .ab.h { width: ${HT}px; } .sb-soc-efldark-24 .ab.a { width: ${AT}px; }
.sb-soc-efldark-24 .sc { width: ${SC}px; background: ${DARK.background}; box-shadow: inset 0 1px 0 rgba(255,255,255,.4); font-size: 39px; font-weight: 700; letter-spacing: .03em; line-height: 1; display: flex; align-items: center; justify-content: center; gap: 10px; }
.sb-soc-efldark-24 .sc .sb-num { min-width: .62em !important; }
.sb-soc-efldark-24 .sc .d { font-size: .8em; }
.sb-soc-efldark-24 .ck { width: ${CK}px; background: ${DARK.background}; box-shadow: inset 0 1px 0 rgba(255,255,255,.4); font-size: 39px; font-weight: 700; letter-spacing: .04em; line-height: 1; font-variant-numeric: tabular-nums; }
.sb-soc-efldark-24 .ck.when { font-size: 28px; }
`,
  draw(root, g, { time }) {
    const [h, a] = homeFirst(g);
    const row = el('div', 'row');
    let [ch, ca] = [kit(h), kit(a)];
    if (alikeColors(ch, ca)) [ch, ca] = teamPair(h, a, '#3a3f47');
    const team = (t, k, c) => {
      const ink = teamInk(c), n = el('div', 't ab ' + k);
      // the team's colour under the glass: lit at the top, a step at 60 %, darkest at the foot (frame grid); letters dark grey on a
      // light kit, white on a dark one
      n.style.background = 'linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.10) 44%, rgba(255,255,255,0) 50%), ' + glassCover(c, { top: 4, mid: 1, horizon: 60, step: 6, foot: -12 }).background;
      n.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(0,0,0,.4)';
      // (white wherever it reads as big bold type, 3:1, as on a red kit; the frame's dark grey only on a truly light kit)
      n.style.color = ink === '#ffffff' || contrast('#ffffff', c) >= 3 ? '#ffffff' : '#3a3b40';
      n.appendChild(fit(el('span', '', (t.abbr || '').toUpperCase())));
      return n;
    };
    const live = g.status !== 'pre';
    const sc = el('div', 't sc');
    // before the kick-off the two figure slots stay empty: the kit puts each team's record in them
    sc.append(scoreSlot(el('span', '', live && h.score != null ? String(h.score) : ''), g), el('span', 'd', live ? '-' : ''),
      scoreSlot(el('span', '', live && a.score != null ? String(a.score) : ''), g));
    const clock = soccerClock(g, time);
    row.append(team(h, 'h', ch), sc, team(a, 'a', ca), el('div', 't ck' + (clock.length > 5 ? ' when' : ''), clock));
    root.appendChild(row);
  },
};
