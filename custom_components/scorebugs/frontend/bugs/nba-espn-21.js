// "Mirror bar '21": after ESPN/ABC's NBA playoff bug (2021-22). A long dark bar, the two teams mirrored: each a panel
// in its colour that lightens towards the middle, its logo big on a darker tile at the outer end and cut by it, a small seed, slanted
// letters and a big slanted score by the middle; under each a dark strip with its timeouts at the outer side. Then a dark box with the
// clock over the quarter, a panel with the round (or the night), a panel with the game and the series, and the network's mark at the
// right (here the Home Assistant logo). The shot clock and the bonus are left out (no data).
import { el, logo, statusText, teamPair, panelInk, shade, haMark, marks, scoreSlot, fit, leagueLogo, sheen, gloss, FONTS } from '../kit.js';

// the bar is 87 tall inside the 5 px edge: team row 62, timeouts strip 25 (measured on the frame, Nov 23 2026)
const H = 97, TOP = 67, TILE = 96, TEAM = 410, CLOCK = 180, ROUND = 350, GAME = 220, NET = 196, GAP = 5;   // the network's panel is 11% of the bar, as measured
const W = 2 * TEAM + CLOCK + ROUND + GAME + NET + 5 * GAP + 2 * GAP;
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default {
  id: 'nba-espn-21',
  size: { w: W, h: H },
  fonts: [FONTS.archivo, FONTS.archivoItalic, FONTS.barlowCond700],
  css: `
.sb-nba-espn-21 { font-family: 'SB Archivo', 'Arial', sans-serif; color: #fff; display: grid; height: ${H}px; padding: ${GAP}px; box-sizing: border-box; gap: ${GAP}px;
  grid-template-columns: ${TEAM}px ${TEAM}px ${CLOCK}px ${ROUND}px ${GAME}px ${NET}px; grid-template-rows: minmax(0, 1fr);
  background: linear-gradient(#1d1e21, #08090a); box-shadow: 0 3px 8px rgba(0,0,0,.55); }
/* thin light dividers between the parts, as on the frame */
.sb-nba-espn-21 > * + * { box-shadow: -${Math.ceil(GAP / 2) + 1}px 0 0 -${Math.floor(GAP / 2)}px rgba(190,194,200,.55); }
.sb-nba-espn-21 .tm { display: grid; grid-template-rows: ${TOP - GAP}px 1fr; min-width: 0; }
.sb-nba-espn-21 .top { position: relative; display: flex; align-items: center; gap: 12px; overflow: hidden; font-style: italic; }
.sb-nba-espn-21 .h .top { flex-direction: row-reverse; }
.sb-nba-espn-21 .tile { align-self: stretch; width: ${TILE}px; flex: none; position: relative; overflow: hidden; }
.sb-nba-espn-21 .tile .sb-logo { position: absolute; top: 50%; width: 92px; height: 92px; margin-top: -46px; object-fit: contain; }
.sb-nba-espn-21 .a .tile .sb-logo { left: -10px; } .sb-nba-espn-21 .h .tile .sb-logo { right: -10px; }
/* the letters and scores slant about 15 deg on air (measured); the italic face gives 9, a skew adds the rest */
.sb-nba-espn-21 .top .ab, .sb-nba-espn-21 .top .sc, .sb-nba-espn-21 .top .sd { transform: skewX(-6deg); }
.sb-nba-espn-21 .sd { font-size: 24px; font-weight: 500; opacity: .9; }
.sb-nba-espn-21 .ab { font-size: 40px; font-weight: 600; font-stretch: 95%; white-space: nowrap; }
.sb-nba-espn-21 .sc { margin-left: auto; padding: 0 14px 0 14px; font-size: 58px; font-weight: 800; font-stretch: 100%; line-height: 1; }
/* the scores sit against the dividing line: the away score's slot keeps its three-figure room on its outer side */
.sb-nba-espn-21 .a .sc { padding-right: 3px; text-align: right; }
.sb-nba-espn-21 .h .sc { margin-left: 0; margin-right: auto; padding-left: 3px; }
.sb-nba-espn-21 .sc.rec { font-size: 28px; font-weight: 600; }
.sb-nba-espn-21 .sub { display: flex; align-items: center; padding: 0 12px; background: linear-gradient(#141518, #0a0a0b); font-size: 21px; font-weight: 600; letter-spacing: 1.5px; white-space: nowrap; }
.sb-nba-espn-21 .h .sub { justify-content: flex-end; }
.sb-nba-espn-21 .ck { display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; padding: 4px 0 6px; background: linear-gradient(#1a1b1e, #050506); }
.sb-nba-espn-21 .ck .c { font-size: 40px; font-weight: 500; line-height: 1; }
.sb-nba-espn-21 .ck .q { font-size: 26px; font-weight: 500; line-height: 1; }
.sb-nba-espn-21 .ck .w { font-size: 28px; font-weight: 600; text-align: center; line-height: 1.05; }
.sb-nba-espn-21 .pn { display: flex; align-items: center; justify-content: center; gap: 12px; min-width: 0; padding: 0 12px; overflow: hidden; white-space: nowrap; background: linear-gradient(#17181b, #070708); }
/* the round fills its panel: capitals 0.35 of the bar's height (2021 West finals still: 24 of 69 px) */
.sb-nba-espn-21 .rd { font-family: 'SB Barlow Condensed', sans-serif; font-weight: 700; font-size: 46px; text-transform: uppercase; letter-spacing: .5px; }
.sb-nba-espn-21 .gm { flex-direction: column; gap: 2px; text-transform: uppercase; }
.sb-nba-espn-21 .gm b { font-size: 28px; font-weight: 600; letter-spacing: 1.5px; line-height: 1; }
.sb-nba-espn-21 .gm span { font-size: 20px; font-weight: 500; line-height: 1; }
.sb-nba-espn-21 .pn img { width: 46px; height: 46px; flex: none; }
/* the network's panel near black, no gloss line (2021 still: #090708, L 1 at the top) */
.sb-nba-espn-21 .net { background: linear-gradient(#0d0b0c, #050405); }
.sb-nba-espn-21 .net .sb-ha { color: #fff; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');   // never two alike panels
    const team = (t, k) => {
      const c = pair[k === 'a' ? 0 : 1];
      const p = el('div', 'tm ' + k);
      const top = el('div', 'top');
      // the panel lightens towards the middle of the bar (dark by the logo, light by the score)
      // a soft light band across the middle over the colour (measured: shine range 27-43 L, no hard horizon)
      top.style.background = sheen(45, 0.16) + ', linear-gradient(' + (k === 'a' ? '90deg' : '270deg') + ', ' + shade(c, -0.08) + ', ' + shade(c, 0.08) + ')';
      top.style.color = panelInk(t, c);
      // a clear edge where the tile meets the panel, as on the frame
      const tile = el('div', 'tile'); tile.style.background = shade(c, -0.4); tile.appendChild(logo(t, 88));
      top.appendChild(tile);
      if (t.seed != null) top.appendChild(el('span', 'sd', String(t.seed)));
      top.appendChild(fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      top.appendChild(g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      const sub = el('div', 'sub', live && t.timeouts != null ? 'TIMEOUTS: ' + t.timeouts : g.status === 'pre' ? '' : t.record || '');
      p.append(top, sub);
      return p;
    };
    const ck = el('div', 'ck');
    if (live) {
      ck.appendChild(el('span', 'c', g.clock || ''));
      ck.appendChild(el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()));
    } else { const w = el('span', 'w', statusText(g, time)); w.style.gridRow = '1 / 3'; ck.appendChild(w); }
    const r = g.round || {};
    // the round in the post-season ("WESTERN CONFERENCE FINALS"), else the night, as ESPN named it
    const rd = el('div', 'pn'); rd.appendChild(leagueLogo(g, 46)); rd.appendChild(fit(el('span', 'rd', r.label || (g.league || 'NBA') + ' ' + DAYS[new Date(g.starts).getDay()])));
    const gm = el('div', 'pn gm');
    if (r.game) gm.appendChild(el('b', '', r.game));
    // "PHX LEADS 2-1" on air (no "series"), squeezed to its panel if need be
    if (g.series) gm.appendChild(fit(el('span', '', g.series.replace(/\s*series\s*/i, ' '))));
    else if (!r.game) gm.appendChild(el('b', '', (g.away.abbr || '') + ' @ ' + (g.home.abbr || '')));
    const net = el('div', 'pn net'); if (marks(opts).ha) net.appendChild(haMark(44));
    root.append(team(g.away, 'a'), team(g.home, 'h'), ck, rd, gm, net);
  },
};
