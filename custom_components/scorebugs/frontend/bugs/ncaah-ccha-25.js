// "Silver plates '25": after the CCHA's own college hockey bug (CCHA TV, 2020s). The network's badge on a small silver tab at the left (here the Home Assistant logo); each team in
// a silver-rimmed plate: its logo on a tile, a panel in its colour with its letters over "SHOTS" and the count in a white box, and its score
// dark on a brushed silver block; then the period and the clock on a glossy navy block lit blue from below. In the playoffs a navy banner
// over the teams carries the game's note, and a silver box at the right the series. The shootout grid is left out (no data).
import { el, logo, statusText, haMark, marks, teamPair, panelInk, shade, scoreSlot, fit, stripes, glow, FONTS } from '../kit.js';

const H = 120, ROW = 64, TOP = H - ROW - 6, BADGE = 76, TEAM = 330, CLOCK = 190, SERIES = 170;
const W = BADGE + 8 + 2 * (TEAM + 8) + CLOCK + 10 + SERIES;
const SILVER = 'linear-gradient(#fdfdfd, #d4d7db 40%, #aeb3b8 60%, #e4e6e9)';

/** The light tint of a panel colour that the broadcast sets "SHOTS" in (frame: #d3afff on the purple, #b8dcd3 on the green): the panel's hue, lightness 0.8, its saturation x1.4. */
function tint(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return '#ffffff';
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l0 = (mx + mn) / 2;
  let h = 0; if (d) h = 60 * (mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
  const s = Math.min(1, (d ? d / (1 - Math.abs(2 * l0 - 1)) : 0) * 1.4), l = 0.8, a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); };
  return '#' + f(0) + f(8) + f(4);
}

export default {
  id: 'ncaah-ccha-25',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: g.series ? W : W - SERIES - 10, h: g.note ? H : ROW + 12 }),
  fonts: [FONTS.archivo],
  css: `
.sb-ncaah-ccha-25 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-ncaah-ccha-25 .row { position: absolute; left: 0; bottom: 6px; height: ${ROW}px; display: flex; gap: 8px; align-items: stretch; }
.sb-ncaah-ccha-25 .bd { width: ${BADGE}px; margin: 6px 0; flex: none; display: grid; place-items: center; background: ${SILVER}; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,.5), ${glow('#2a8cff', 26, 0.7)}; }   /* a blue glow behind the badge */
.sb-ncaah-ccha-25 .bd .sb-ha { color: #1d3f8f; }
.sb-ncaah-ccha-25 .tm { width: ${TEAM}px; flex: none; display: flex; padding: 3px; gap: 3px; box-sizing: border-box; background: ${SILVER}; box-shadow: 0 3px 6px rgba(0,0,0,.5); }
/* loop pass 1: the logo tile takes 0.39 of the plate on the frame (100 of 255 px: logo tile 85-185, panel 188-275, score 277-340), */
/* the panel 0.34 and the score 0.25; ours gave the logo 0.30 and the panel 0.46 */
.sb-ncaah-ccha-25 .lw { width: 122px; flex: none; position: relative; overflow: hidden; }
.sb-ncaah-ccha-25 .lw .sb-logo { position: absolute; left: 50%; top: 50%; width: 116px; height: 116px; margin: -58px 0 0 -58px; object-fit: contain; }
.sb-ncaah-ccha-25 .pn { flex: 1; min-width: 0; display: grid; grid-template-rows: 1fr auto; align-items: center; justify-items: center; padding: 2px 6px 4px; }
.sb-ncaah-ccha-25 .pn .ab { font-size: 32px; line-height: 1; white-space: nowrap; }
.sb-ncaah-ccha-25 .pn .sh { display: flex; align-items: center; gap: 6px; font-size: 14px; letter-spacing: .5px; }
.sb-ncaah-ccha-25 .pn .sh b { min-width: 26px; padding: 0 3px; text-align: center; background: #fff; color: #111; font-size: 15px; }
/* loop pass 1, read in columns on the frame: the panel is split, a thin light line (+20 L over the panel, about 2 px) at 62 %
 of its height, and under it a strip a little darker than the panel holding SHOTS at its left and the count's white box at its right
 ("SHOTS" capitals 0.22 of the panel; ours were 0.17 and centred under the letters) */
.sb-ncaah-ccha-25 .pn { grid-template-rows: 1fr 38%; padding: 0; }
.sb-ncaah-ccha-25 .pn.one { grid-template-rows: 1fr; }
.sb-ncaah-ccha-25 .pn .sh { justify-self: stretch; align-self: stretch; justify-content: space-between; padding: 0 5px 0 7px; font-size: 17px; background: rgba(0,0,0,.1); box-shadow: inset 0 2px 0 rgba(255,255,255,.3); }
.sb-ncaah-ccha-25 .pn .sh b { font-size: 17px; min-width: 30px; }
/* loop pass 1: a saturated blue light strip runs under the clock block, below its silver rim (frame: #0870ff, at least 6 of 70 px) */
.sb-ncaah-ccha-25 .ck { position: relative; }
.sb-ncaah-ccha-25 .ck::after { content: ''; position: absolute; left: 4px; right: 4px; top: 100%; height: 6px; background: linear-gradient(90deg, #1a5fe0, #0a78ff 50%, #1a5fe0); }
.sb-ncaah-ccha-25 .sc { width: 76px; flex: none; display: grid; place-items: center; color: #1a1c20; font-size: 42px; font-weight: 800;
  background: repeating-linear-gradient(135deg, rgba(255,255,255,.18) 0 2px, transparent 2px 5px), linear-gradient(#e9eaea, #fbfbfb 22%, #f1f1f1 44%, #b4b4b4 50%, #acacac 80%, #a5a5a7); }   /* hard gloss at 47% (measured, Nov 23 2026) */
.sb-ncaah-ccha-25 .sc.rec { font-size: 18px; }
.sb-ncaah-ccha-25 .ck { width: ${CLOCK}px; flex: none; display: flex; align-items: center; justify-content: space-evenly; font-size: 34px; border-radius: 3px; padding: 3px; box-sizing: border-box; background: ${SILVER}; box-shadow: 0 3px 6px rgba(0,0,0,.5); }
.sb-ncaah-ccha-25 .ck > div { width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-evenly;
  background: ${stripes(8, 135, '#ffffff', 0.07)}, radial-gradient(ellipse 70% 55% at 50% 112%, rgba(110,190,255,1), transparent 70%), linear-gradient(#2b4f9e, #12296a 55%, #0b1d52); }   /* fine diagonal stripes and a blue glow rising from the foot */
.sb-ncaah-ccha-25 .ck sup { font-size: .55em; vertical-align: .1em; } .sb-ncaah-ccha-25 .ck .w { font-size: 24px; }
.sb-ncaah-ccha-25 .se { width: ${SERIES}px; flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #1a1c20; font-size: 22px; line-height: 1.05; text-transform: uppercase; background: ${SILVER}; box-shadow: 0 3px 6px rgba(0,0,0,.5); }
.sb-ncaah-ccha-25 .se b { font-size: 30px; }
.sb-ncaah-ccha-25 .nt { position: absolute; left: ${BADGE + 8}px; width: ${2 * TEAM + 8}px; top: 0; height: ${TOP - 4}px; display: grid; place-items: center; padding: 0 12px; box-sizing: border-box;
  background: linear-gradient(#253e7c, #0f1f4f); box-shadow: inset 0 0 0 2px #c9cdd2, 0 2px 5px rgba(0,0,0,.4); font-size: 22px; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    const row = el('div', 'row');
    const bd = el('div', 'bd'); if (marks(opts).ha) bd.appendChild(haMark(44)); row.appendChild(bd);
    [g.away, g.home].forEach((t, k) => {
      const c = pair[k];
      const tm = el('div', 'tm');
      const lw = el('span', 'lw'); lw.style.background = 'linear-gradient(' + shade(c, -0.2) + ', ' + shade(c, -0.5) + ')'; lw.appendChild(logo(t, 116));
      const pn = el('span', 'pn'); pn.style.background = stripes(8, 135, '#ffffff', 0.05) + ', linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.15) + ')';
      // white letters unless the panel is too light for them (Nashville's gold, a light blue taken against a look-alike): then the kit's
      // ink, the team's other colour or a deep shade
      pn.style.color = panelInk(t, c);
      pn.appendChild(fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      const sh = el('span', 'sh');
      // the shots line is hockey's own: a football or basketball game drawn on this bug shows none
      if (g.status === 'pre') sh.appendChild(document.createTextNode(t.record || ''));
      else if (g.sport === 'hockey') { const sl = el('span', '', 'SHOTS'); if (/^#f{3,6}/i.test(panelInk(t, c) || '') || panelInk(t, c) === 'white') sl.style.color = tint(c); sh.appendChild(sl); if (t.shots != null) sh.appendChild(el('b', '', String(t.shots))); }
      // no strip drawn empty (a football or basketball game has no shots line): the letters then take the whole panel
      if (sh.childNodes.length) pn.appendChild(sh); else pn.classList.add('one');
      tm.append(lw, pn, g.status === 'pre' ? el('span', 'sc rec', '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
      row.appendChild(tm);
    });
    const ck = el('div', 'ck'), cin = el('div', '');
    if (live) { const p = el('span', ''); p.appendChild(document.createTextNode(g.period.label || '')); if (!g.period.word && g.period.suffix) p.appendChild(el('sup', '', g.period.suffix.toUpperCase())); cin.append(p, el('span', '', g.clock || '')); }
    else cin.appendChild(el('span', 'w', statusText(g, time)));
    ck.appendChild(cin); row.appendChild(ck);
    if (g.series) {
      const m = /^(\w+) leads? series (\d+-\d+)/i.exec(g.series), tie = /tied (\d+-\d+)/i.exec(g.series);
      const se = el('div', 'se');
      if (m) se.append(el('span', '', m[1] + ' LEADS'), el('b', '', m[2])); else if (tie) se.append(el('span', '', 'SERIES TIED'), el('b', '', tie[1])); else se.appendChild(fit(el('span', '', g.series)));
      row.appendChild(se);
    }
    root.appendChild(row);
    if (g.note) root.appendChild(el('div', 'nt', g.note));
  },
};
