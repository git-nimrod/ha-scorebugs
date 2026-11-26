// "Twin panels '26": after Big Ten Network / B1G+'s volleyball bar of 2026 (frames: retro catalogue vb-btn26-1 and -2, Nebraska at
// Maryland). One bar, symmetrical: the away team's logo tile and its panel in its colour with rank and name in white italic capitals, its
// points in a white box in heavy black italic figures; the set in a near-black middle box ("1ST SET" over "BEST OF 5"); then the home
// team's points, panel and logo tile, mirrored. When the two teams' colours are alike (red v red on the frames) the home panel and tile
// turn white with the name in the team's colour and a thin rim of it along the foot. Timeouts as two short dashes under each name.
// Measured: bar 1046 x 63; logo tiles 73, panels 282 / 291, score boxes 91 / 87, middle box 149; names
// cap 0.37 of the bar, figures 0.56, "1ST SET" 0.33, "BEST OF 5" 0.21; small corner radius 3; panels a soft gloss (lighter top third).
import { el, logo, statusText, teamColor, alikeColors, FONTS, fit, scoreSlot, relight } from '../kit.js';

const W = 1046, H = 63, LG = 73;

const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'TH' : ['TH', 'ST', 'ND', 'RD'][n % 10] || 'TH');

export default {
  id: 'vb-btn-26',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi700i, FONTS.barlowSemi800i, FONTS.barlowSemi700],
  css: `
.sb-vb-btn-26 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-vb-btn-26 .bar { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; display: flex; border-radius: 3px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
.sb-vb-btn-26 .bar > * { flex: none; height: ${H}px; display: flex; align-items: center; justify-content: center; position: relative; white-space: nowrap; overflow: hidden; line-height: 1; }
.sb-vb-btn-26 .lg { width: ${LG}px; }
.sb-vb-btn-26 .lg .sb-logo { width: 50px; height: 46px; object-fit: contain; }
.sb-vb-btn-26 .tm { box-sizing: border-box; padding: 0 16px 6px; gap: 4px; font-style: italic; }
.sb-vb-btn-26 .tm .rk { font-size: 15px; position: relative; top: -9px; flex: none; }
.sb-vb-btn-26 .tm .nm { font-size: 33px; letter-spacing: .02em; min-width: 0; overflow: hidden; }
.sb-vb-btn-26 .tm .to { position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; gap: 8px; }
.sb-vb-btn-26 .tm .to i { width: 18px; height: 3px; background: currentColor; opacity: .9; }
.sb-vb-btn-26 .tm .to i.used { opacity: .25; }
.sb-vb-btn-26 .sc { background: linear-gradient(#ffffff, #f1f2f3 45%, #e3e5e7); color: #0b0b0c; font-weight: 800; font-style: italic; font-size: 50px; }
.sb-vb-btn-26 .sc .sb-num { min-width: 0 !important; }
.sb-vb-btn-26 .md { width: 149px; flex-direction: column; gap: 3px; background: linear-gradient(#2c332f, #1d2320); }
.sb-vb-btn-26 .md b { font-size: 29px; font-weight: 700; } .sb-vb-btn-26 .md b small { font-size: .72em; }
.sb-vb-btn-26 .md span { font-size: 18px; font-weight: 700; letter-spacing: .03em; }
.sb-vb-btn-26 .md .one { font-size: 26px; width: 100%; text-align: center; }
`,
  draw(root, g, { time }) {
    const bar = el('div', 'bar'), live = g.status === 'live';
    const pts = (t) => (live ? ((t.sets || []).length ? t.sets[t.sets.length - 1] : t.score) : g.status === 'final' ? t.score : null);
    const ca = teamColor(g.away, '#3a3f47'), ch = teamColor(g.home, '#3a3f47');
    const white = alikeColors(ca, ch);
    const part = (t, c, home) => {
      const light = home && white;
      const lg = el('div', 'lg'); lg.style.background = light ? '#f3f3f2' : relight(c, -4);
      lg.appendChild(logo(t, 50));
      const tm = el('div', 'tm'); tm.style.width = (home ? 291 : 282) + 'px';
      tm.style.background = light ? 'linear-gradient(#ffffff, #f4f4f3 35%, #e9e9e8)' : 'linear-gradient(' + relight(c, 7) + ', ' + c + ' 35%, ' + relight(c, -6) + ')';
      if (light) { tm.style.color = c; tm.style.boxShadow = 'inset 0 -3px 0 ' + c; lg.style.boxShadow = 'inset 0 -3px 0 ' + c; }
      if (t.rank && t.rank <= 25) tm.appendChild(el('span', 'rk', String(t.rank)));
      tm.appendChild(fit(el('span', 'nm', (t.name || t.abbr || '').toUpperCase()), (t.abbr || '').toUpperCase()));
      if (live && t.timeouts != null) {
        const to = el('span', 'to');
        for (let k = 0; k < 2; k++) to.appendChild(el('i', k >= t.timeouts ? 'used' : ''));
        tm.appendChild(to);
      }
      const v = pts(t), sc = el('div', 'sc'); sc.style.width = (home ? 87 : 91) + 'px';
      sc.appendChild(scoreSlot(el('span', '', v != null ? String(v) : ''), g));
      return home ? [sc, tm, lg] : [lg, tm, sc];
    };
    const md = el('div', 'md');
    if (live) {
      const n = Number(g.period.label) || 1, o = ORD(n), b = el('b', '', String(n));
      b.appendChild(el('small', '', o.slice(String(n).length))); b.appendChild(document.createTextNode(' SET'));
      md.append(b, el('span', '', 'BEST OF 5'));
    } else md.appendChild(el('b', 'one', g.status === 'final' ? 'FINAL' : statusText(g, time)));
    bar.append(...part(g.away, ca, false), md, ...part(g.home, ch, true));
    root.appendChild(bar);
  },
};
