// "Twin panels": after a college football bug (Army v Navy). Two square-ish
// panels side by side, each in its team's colour with its name in slanted capitals at the top left, its big slanted score under it and its
// logo at the right; under each a strip with its timeouts as dots and its record (dark for the away team, light for the home team); then a
// black box with the clock large over the quarter. The play clock is left out (no data).
import { el, logo, statusText, teamPair, panelInk, shade, scoreSlot, fit, FONTS } from '../kit.js';

const TEAM = 340, CLOCK = 250, TOP = 140, SUB = 36, H = TOP + SUB, W = 2 * TEAM + CLOCK + 8;

export default {
  id: 'cfb-twin-17',
  size: { w: W, h: H },
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-cfb-twin-17 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; color: #fff; display: grid; grid-template-columns: ${TEAM}px ${TEAM}px ${CLOCK}px; gap: 0 4px; height: ${H}px; background: #050506; box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-cfb-twin-17 .tm { display: grid; grid-template-rows: ${TOP}px ${SUB}px; }
.sb-cfb-twin-17 .top { position: relative; overflow: hidden; padding: 8px 14px; box-sizing: border-box; font-style: italic; }
.sb-cfb-twin-17 .top .nm { position: relative; z-index: 1; font-size: 34px; font-stretch: 85%; white-space: nowrap; display: block; }
.sb-cfb-twin-17 .top .sc { position: relative; z-index: 1; display: block; text-align: left; margin-top: 2px; font-size: 76px; line-height: 1; font-stretch: 90%; }
.sb-cfb-twin-17 .top .sc.rec { font-size: 34px; margin-top: 18px; }
.sb-cfb-twin-17 .top .sb-logo { position: absolute; right: 12px; bottom: 6px; width: 120px; height: 92px; object-fit: contain; object-position: right bottom; }
.sb-cfb-twin-17 .sub { display: flex; align-items: center; justify-content: space-between; padding: 0 14px; font-size: 30px; font-weight: 600; }
.sb-cfb-twin-17 .sub .to { display: flex; gap: 10px; } .sb-cfb-twin-17 .sub .to i { width: 16px; height: 16px; border-radius: 50%; background: currentColor; }
.sb-cfb-twin-17 .sub .to i.used { background: none; box-shadow: inset 0 0 0 2px currentColor; opacity: .7; }
.sb-cfb-twin-17 .ck { display: grid; grid-template-rows: 1fr ${SUB + 22}px; }
.sb-cfb-twin-17 .ck .c { display: grid; place-items: center; font-size: 72px; font-weight: 500; letter-spacing: 2px; background: linear-gradient(#1c1c1e, #050506); }
.sb-cfb-twin-17 .ck .c.w { font-size: 34px; text-align: center; }
.sb-cfb-twin-17 .ck .q { display: grid; place-items: center; font-size: 38px; font-weight: 500; border-top: 3px solid #3a3a3e; background: #0b0b0c; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const pair = teamPair(g.away, g.home, '#3a3f47');
    [g.away, g.home].forEach((t, k) => {
      const c = pair[k];
      const tm = el('div', 'tm'), top = el('div', 'top');
      top.style.background = 'repeating-linear-gradient(45deg, rgba(255,255,255,.04) 0 2px, transparent 2px 5px), linear-gradient(' + shade(c, 0.02) + ', ' + shade(c, -0.12) + ')';  // a gentler fall (the frame's panels are nearly flat: Navy L 3 at the top)
      top.style.color = panelInk(t, c);
      // the school's name, as on air (ARMY, NAVY): the long name without the nickname, else the letters
      const school = t.longName && t.name && t.longName.endsWith(t.name) && t.longName !== t.name ? t.longName.slice(0, -t.name.length).trim() : t.abbr || '';
      top.append(fit(el('span', 'nm', school.toUpperCase())), g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g), logo(t, 120));
      // the strip under the panel: dark under the away team, light under the home team (as on air)
      const sub = el('div', 'sub');
      if (k) { sub.style.background = 'linear-gradient(#a9aaae, #d2d3d6)'; sub.style.color = shade(c, -0.1); } else { sub.style.background = '#0b0b0c'; sub.style.color = '#fff'; }
      const to = el('span', 'to'); if (live && t.timeouts != null) for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      sub.append(to, el('span', '', g.status === 'pre' ? '' : t.record || ''));
      tm.append(top, sub); root.appendChild(tm);
    });
    const ck = el('div', 'ck');
    if (live) ck.append(el('span', 'c', g.clock || ''), el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()));
    else { const w = el('span', 'c w', statusText(g, time)); w.style.gridRow = '1 / 3'; ck.appendChild(w); }
    root.appendChild(ck);
  },
};
