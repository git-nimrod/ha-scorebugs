// "Metal panels '25": after ESPN's college basketball bug (2025-26; frame: Missouri vs Illinois). Two wide panels with a brushed-metal
// sheen in the teams' colours: the logo at the outer end, the rank and the name in tall condensed capitals, and the score on a deeper
// shade next to the middle; a white block between them with the clock (and the shot clock, which needs data the sensor lacks) over the
// half, and a small yellow arrow towards the team with the possession arrow. Under each panel a dark strip with the record and the
// timeouts left; team fouls need data the sensor lacks.
import { el, logo, statusText, teamColor, shade, FONTS, fit, shortName } from '../kit.js';

// (Nov 23 sweep) the lower row measured on the frame: 0.45 of the top row's height, its capitals about 0.18 of the top row
const W = 1210, H = 96, ROW = 66, MID = 180, SCORE_W = 110;
// measured against the frame, frame size / mine: Missouri v Illinois
const TYPE = { logo: 0.47 };
const SIDE = (W - MID) / 2;

export default {
  id: 'cbb-metal-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the tip-off there is no score: the score boxes go and both panels close up on the clock, so the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SCORE_W, h: H } : { w: W, h: H }),
  texture: 'mesh',  // a fine wire mesh over the panels, as on air; the card's Panel texture can change it
  fonts: [FONTS.archivo, FONTS.barlowCond700],
  css: `
.sb-cbb-metal-25 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 86%; color: #fff; }
.sb-cbb-metal-25 { font-stretch: 125%; }   /* ESPN 2022-: Archivo wide 900 */
.sb-cbb-metal-25 .pn { position: absolute; top: 0; width: ${SIDE}px; height: ${ROW}px; display: flex; align-items: center; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,.4); }
.sb-cbb-metal-25 .pn.a { left: 0; } .sb-cbb-metal-25 .pn.h { right: 0; flex-direction: row-reverse; }
.sb-cbb-metal-25 .pn::after { content: ''; position: absolute; inset: 0; pointer-events: none;
  /* the frame's panel is a fine diagonal cross-hatch all over (like woven carbon) with a soft light top, no hard gloss horizon */
  background: var(--sb-tex, none), linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 40%, rgba(0,0,0,.1)); background-size: var(--sb-tex-size, auto), auto; mix-blend-mode: overlay; }
.sb-cbb-metal-25 .pn.a { box-shadow: inset 4px 0 0 rgba(255,255,255,.75), 0 2px 5px rgba(0,0,0,.4); } .sb-cbb-metal-25 .pn.h { box-shadow: inset -4px 0 0 rgba(255,255,255,.75), 0 2px 5px rgba(0,0,0,.4); }   /* the thin white rim at each outer end */
.sb-cbb-metal-25 .lg { position: relative; width: 190px; height: 100%; display: grid; place-items: center; } .sb-cbb-metal-25 .lg .sb-logo { position: relative; width: ${210 * TYPE.logo}px; height: ${132 * TYPE.logo}px; margin: -34px 0; object-fit: contain; filter: drop-shadow(0 2px 2px rgba(0,0,0,.45)); }
/* the names and scores tall and condensed, as on air (MIZZOU, 28); the rest stays wide */
.sb-cbb-metal-25 .nm { flex: 1; min-width: 0; box-sizing: border-box; padding: 0 14px; text-align: center; font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-size: 54px; font-stretch: 100%; letter-spacing: 1px; white-space: nowrap; text-shadow: 0 1px 0 rgba(255,255,255,.35), 0 -1px 0 rgba(0,0,0,.25); }
/* the logo sits on top of the mesh, not under it, as on air */
.sb-cbb-metal-25 .nm, .sb-cbb-metal-25 .sc, .sb-cbb-metal-25 .lg { position: relative; z-index: 1; }
.sb-cbb-metal-25 .sc { box-sizing: border-box; padding-bottom: 4px; grid-template-rows: minmax(0, 1fr); } .sb-cbb-metal-25 .nm { padding-bottom: 3px; }   /* the figures and names centred top to bottom in their boxes (they sat 13 px from the top, 4 from the foot) */   /* the letters and score over the texture, not under it */
/* the wire mesh runs on over the score box too, under its figures: the same
 texture and blend as the panel, laid over the box's deeper shade (z-index -1 inside the box keeps it under the figures) */
.sb-cbb-metal-25 .sc::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: var(--sb-tex, none), linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,0) 40%, rgba(0,0,0,.1)); background-size: var(--sb-tex-size, auto), auto; mix-blend-mode: overlay; }
.sb-cbb-metal-25 .nm b { font-size: 26px; vertical-align: 14px; margin-right: 6px; }
.sb-cbb-metal-25 .sc { flex: none; width: 110px; height: 100%; display: grid; place-items: center; font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-size: 72px; font-stretch: 100%; line-height: 1; color: #fff; text-shadow: 0 2px 3px rgba(0,0,0,.45); }
.sb-cbb-metal-25 .mid { position: absolute; left: ${SIDE}px; top: 0; width: ${MID}px; height: ${ROW}px; background: linear-gradient(#ffffff, #e3e6ea); color: #18306b; display: grid;
  justify-items: center; align-content: center; line-height: 1.05; }
.sb-cbb-metal-25 .mid .clk { font-size: 34px; letter-spacing: 1px; } .sb-cbb-metal-25 .mid .q { font-size: 26px; } .sb-cbb-metal-25 .mid .w { font-size: 26px; }
.sb-cbb-metal-25 .arr { position: absolute; top: 24px; width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; }
.sb-cbb-metal-25 .low { position: absolute; top: ${ROW}px; height: ${H - ROW}px; width: ${SIDE}px; background: rgba(20,22,26,.86); display: flex; align-items: center;
  justify-content: space-between; padding: 0 30px; box-sizing: border-box; font-size: 17px; letter-spacing: .5px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    // the word after the period: halves in men's college basketball, quarters in football, basketball and Australian football; a hockey
    // period, a set, a round or an innings shown on this bug gets none
    const half = g.league === 'NCAAM' ? ' HALF' : /^(football|basketball|australian-football)$/.test(g.sport) ? ' QTR' : '';
    [['away', 'a'], ['home', 'h']].forEach(([side, k]) => {
      const t = g[side], c = teamColor(t, '#5a6068');
      const pn = el('div', 'pn ' + k);
      pn.style.background = 'linear-gradient(' + (side === 'away' ? '90deg' : '270deg') + ', ' + shade(c, 0.1) + ', ' + shade(c, 0.42) + ' 45%, ' + shade(c, 0.12) + '), linear-gradient(' + shade(c, 0.3) + ', ' + shade(c, -0.05) + ')';
      pn.style.backgroundBlendMode = 'multiply';
      // white letters on both sides (one ink; the kit's legible edges them on a light panel): a dark shade of the colour read
      // poorly on red, orange and gold
      pn.style.color = '#fff';
      const lg = el('div', 'lg'); lg.appendChild(logo(t, 180));
      // the whole name when it fits; else shortened as broadcasts do (V TECH, N CAROLINA), never cut mid-word
      const nm = fit(el('span', 'nm'), (t.rank ? t.rank + ' ' : '') + shortName(t.name || t.abbr || '').toUpperCase());
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase()));
      const sc = el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : '');
      sc.style.background = 'linear-gradient(' + shade(c, 0.05) + ', ' + shade(c, -0.35) + ')';
      if (g.status === 'pre') { pn.style.width = (SIDE - SCORE_W) + 'px'; pn.append(lg, nm); } else pn.append(lg, nm, sc);
      root.appendChild(pn);
      const low = el('div', 'low');
      const side_w = g.status === 'pre' ? SIDE - SCORE_W : SIDE;
      low.style.left = side === 'away' ? '0' : (side_w + MID) + 'px'; low.style.width = side_w + 'px';
      const rec = el('span', '', t.record || ''), to = el('span', '', live && t.timeouts != null ? 'TIMEOUTS: ' + t.timeouts : '');
      if (side === 'away') low.append(rec, to); else low.append(to, rec);
      root.appendChild(low);
    });
    const mid = el('div', 'mid');
    if (g.status === 'pre') mid.style.left = (SIDE - SCORE_W) + 'px';
    if (live) mid.append(el('span', 'clk', g.clock || ''), el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '') + half));
    else mid.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(mid);
  },
};
