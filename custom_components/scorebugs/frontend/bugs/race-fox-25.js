// "Photo tower '25": after the open-wheel series' timing tower on its US broadcast of 2025 (frame: the 2025 Portland GP, lap 64; retro
// catalogue indy-fox-25-2). A tall tower down the left inside a teal outline with cut corners, over a near-black ground with fine
// diagonal stripes: a white plate at the top (a sponsor on air; the series' logo here), a dark band with the lap, then the first five
// as big cards in their team's colour, dark at the left and full at the right, each with its position on a black tab, the surname in
// big white capitals, the car number large and the driver's photo; then a near-black row per car with the position, the car number in
// its team's colour and the surname, and the series' logo at the foot.
// Measured on the 1080p still: tower 348 px wide; plate 320 x 123 px white; band 57 px #080c0a; cards 84 px on
// an 84 px pitch, team colour from 25 % (#301b08 on the orange card) at the left to 100 % at the right, a 2 px rim in the light team
// colour, the black tab 58 px with its lower outer corner cut 45 deg; rows 42 px, #09100f; outline #2fb8b0, 2 px; stripes 6 px, 45 deg.
// Left out (no data): the race distance and its progress bar ("/100"), the gaps to the leader, the pit marks.
import { brightInk, el, fit, headshot, leagueLogo, marks, setSrc, shade, statusText, FONTS } from '../kit.js';

const W = 350, PLATE = 126, BAND = 58, CARD = 84, BIG = 5, ROW = 42, ROWS = 8, FOOT = 64;
const TOP = PLATE + 10 + BAND + 12;
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return s + suf; };
// a light card (yellow, white, pale grey) takes a dark number; every other card a white one
const light = (c) => { const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] > 0.45; };
const hex = (c) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#5a6470');
const heightFor = (n) => TOP + Math.min(n, BIG) * CARD + Math.max(0, Math.min(n, BIG + ROWS) - BIG) * ROW + 8 + FOOT;

export default {
  id: 'race-fox-25',
  size: { w: W, h: heightFor(BIG + ROWS) },
  sizeFor: (g) => ({ w: W, h: heightFor(Math.max(1, (g.rows || []).length)) }),
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-race-fox-25 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 700; color: #fff; }
.sb-race-fox-25 .tw { position: absolute; left: 0; right: 0; top: ${PLATE + 4}px; bottom: 0; clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px));
  background: #2fb8b0; }
.sb-race-fox-25 .tw::after { content: ''; position: absolute; inset: 2px; clip-path: inherit; background: repeating-linear-gradient(45deg, rgba(255,255,255,.045) 0 1px, transparent 1px 6px), linear-gradient(#0b1414, #060a0a); }
.sb-race-fox-25 .pl { position: absolute; left: 14px; right: 14px; top: 0; height: ${PLATE}px; background: #fff; display: grid; place-items: center;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); box-shadow: inset 0 0 0 2px #2fb8b0; }
.sb-race-fox-25 .pl .sb-league { width: 200px; height: 100px; object-fit: contain; }
.sb-race-fox-25 .bd { position: absolute; left: 8px; right: 8px; top: ${PLATE + 14}px; height: ${BAND - 8}px; display: grid; place-items: center end; padding-right: 18px; background: #080c0a; font-size: 34px; letter-spacing: .5px; white-space: nowrap; }
.sb-race-fox-25 .bd::before, .sb-race-fox-25 .bd::after { content: ''; position: absolute; top: 50%; width: 14px; height: 14px; margin-top: -7px; background: #2bd96b; transform: rotate(45deg); }
.sb-race-fox-25 .bd::before { left: -7px; } .sb-race-fox-25 .bd::after { right: -7px; }
.sb-race-fox-25 .cd { position: absolute; left: 6px; right: 6px; height: ${CARD - 6}px; display: grid; grid-template-columns: 52px 1fr auto 82px; overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 22px 100%, 0 calc(100% - 22px)); }
/* no photo: the number moves to the card's right end */
.sb-race-fox-25 .cd.nop { grid-template-columns: 52px 1fr auto 14px; }
.sb-race-fox-25 .cd .p { background: #050707; font-size: 30px; padding: 10px 0 0 16px; }
.sb-race-fox-25 .cd .n { min-width: 0; align-self: end; padding: 0 4px 8px 12px; font-size: 31px; font-stretch: 84%; white-space: nowrap; overflow: hidden; text-shadow: 0 2px 3px rgba(0,0,0,.4); }
.sb-race-fox-25 .cd .c { align-self: center; padding-right: 4px; font-family: 'SB Archivo', sans-serif; font-style: italic; font-weight: 800; font-size: 52px; line-height: 1; text-shadow: 0 2px 3px rgba(0,0,0,.35); }
.sb-race-fox-25 .cd .ph { position: relative; overflow: hidden; }
.sb-race-fox-25 .cd .ph img { position: absolute; left: -6px; bottom: -4px; width: 94px; height: auto; }
.sb-race-fox-25 .rw { position: absolute; left: 6px; width: 290px; height: ${ROW - 4}px; display: grid; grid-template-columns: 40px 58px 1fr; align-items: center; background: #09100f; box-shadow: inset 0 -1px 0 rgba(255,255,255,.08); font-size: 26px; }
.sb-race-fox-25 .rw .p { text-align: center; } .sb-race-fox-25 .rw .c { text-align: center; font-style: italic; font-weight: 800; font-size: 26px; white-space: nowrap; }
.sb-race-fox-25 .rw .n { min-width: 0; overflow: hidden; white-space: nowrap; padding: 0 8px 0 6px; }
.sb-race-fox-25 .rw.me { background: #1c2a2a; }
.sb-race-fox-25 .ft { position: absolute; left: 0; right: 0; bottom: 6px; height: ${FOOT - 12}px; display: grid; place-items: center; }
.sb-race-fox-25 .ft .sb-league { width: 120px; height: 44px; object-fit: contain; }
.sb-race-fox-25 .pl .sb-league-text { display: grid; place-items: center; color: #0b1414; font-weight: 800; font-style: italic; }
.sb-race-fox-25 .ft .sb-league-text { display: grid; place-items: center; color: #e8f4f4; font-weight: 800; font-style: italic; }
`,
  draw(root, g, { opts, time }) {
    const mk = marks(opts);
    root.appendChild(el('div', 'tw'));
    const pl = el('div', 'pl'); if (mk.league) pl.appendChild(leagueLogo(g, 100)); root.appendChild(pl);
    const race = !g.session || g.session === 'Race';
    root.appendChild(fit(el('div', 'bd', g.status === 'live' && race && g.lap ? 'LAP ' + g.lap : g.status === 'final' ? 'FINAL' : g.status === 'pre' ? statusText(g, time) : String(g.session || '').toUpperCase())));
    const rows = (g.rows || []).slice(0, BIG + ROWS);
    rows.forEach((r, i) => {
      const c = hex(r.color);
      if (i < BIG) {
        const cd = el('div', 'cd' + (g.player && g.player.id === r.id ? ' me' : '')); cd.style.top = (TOP + i * CARD) + 'px';
        cd.style.background = 'linear-gradient(100deg, transparent 0 52px, ' + shade(c, -0.75) + ' 52px, ' + shade(c, -0.45) + ' 45%, ' + c + ' 92%)';
        cd.style.boxShadow = 'inset 0 0 0 2px ' + shade(c, 0.35);
        const ph = el('span', 'ph'); const im = el('img'); im.alt = ''; setSrc(im, headshot('racing', r.id), () => { cd.classList.add('nop'); im.remove(); }); ph.appendChild(im);
        // the big number sits on the card's full colour: white, or a deep shade of the colour on a light card (the yellow card's 10 on air)
        const num = el('span', 'c', r.number || ''); if (light(c)) { num.style.color = shade(c, -0.62); num.style.textShadow = 'none'; }
        cd.append(el('span', 'p', String(r.pos || i + 1)), fit(el('span', 'n', surname(r).toUpperCase())), num, ph);
        root.appendChild(cd);
      } else {
        const rw = el('div', 'rw' + (g.player && g.player.id === r.id ? ' me' : '')); rw.style.top = (TOP + BIG * CARD + (i - BIG) * ROW) + 'px';
        const n = el('span', 'c', r.number || ''); n.style.color = brightInk({ color: c }, '#09100f').ink;
        rw.append(el('span', 'p', String(r.pos || i + 1)), n, fit(el('span', 'n', surname(r).toUpperCase())));
        root.appendChild(rw);
      }
    });
    if (mk.league) { const ft = el('div', 'ft'); ft.appendChild(leagueLogo(g, 44)); root.appendChild(ft); }
  },
};
