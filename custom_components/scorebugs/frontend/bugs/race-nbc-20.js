// "Ticker and leader box '20": after the stock-car ticker on its US broadcast of 2017-2020 (frame: the 2020 championship race at
// Phoenix; retro catalogue nas-nbc-20-1). Top left, the series' logo in a black box with a white rim; beside it a glossy dark head with
// a bright green box (the stage and laps to go on air) and the race's name in white capitals; under the head the running order in
// near-black cells divided by thin grey rules: the position small, the car number in bold italics, the surname in white capitals.
// Measured on the 720p still: head #262425 gloss, top +10 L, horizon 38 %, step 10; green #2bf228 flat with
// black letters; cells #161518 flat, an entry every 213 px, divided by 2 px rules #6a6a6e; logo box 115 x 54 px, rim 2 px.
// The green box shows the lap (the sensor has no stages or race distance). Left out (no data): the interval row, the playoff box. The
// series' wordmark at the right end is left out too: its logo is already in the box on the left.
import { el, fit, leagueLogo, marks, statusText, FONTS } from '../kit.js';

const S = 1.5, LOGO = 176, HD = Math.round(32 * S), TK = Math.round(28 * S), ENTRY = 320, N = 5;
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const surname = (r) => { const p = String(r.name || r.short || '').trim().split(/\s+/); let s = p.pop() || '', suf = '';
  if (SUF.test(s) && p.length) { suf = ' ' + s.replace(/\.$/, ''); s = p.pop(); } return s + suf; };

export default {
  id: 'race-nbc-20',
  size: { w: LOGO + N * ENTRY, h: HD + 2 + TK },
  sizeFor: (g) => ({ w: LOGO + Math.max(2, Math.min(N, (g.rows || []).length)) * ENTRY, h: HD + 2 + TK }),
  fonts: [FONTS.barlowSemi700, FONTS.barlowSemi800i],
  css: `
.sb-race-nbc-20 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-race-nbc-20 .lb { position: absolute; left: 0; top: 0; width: ${LOGO}px; height: ${HD + 2 + TK}px; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%, rgba(0,0,0,.29) 100%), linear-gradient(#141416, #050506); box-shadow: inset 0 0 0 3px #f2f2f2; display: grid; place-items: center; }
.sb-race-nbc-20 .lb .sb-league { width: ${LOGO - 30}px; height: ${HD + TK - 22}px; object-fit: contain; }
/* no logo on the image server (the series has none there): its letters, centred in the box */
.sb-race-nbc-20 .lb .sb-league-text { display: grid; place-items: center; font-weight: 800; font-style: italic; letter-spacing: 1px; }
.sb-race-nbc-20 .hd { position: absolute; left: ${LOGO}px; right: 0; top: 0; height: ${HD}px; display: flex; align-items: center; gap: 26px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6);
  background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%, rgba(0,0,0,.29) 100%), linear-gradient(#3b393b, #343233 36%, #232122 40%, #1c1a1b); }
.sb-race-nbc-20 .gr { flex: none; width: 222px; height: ${HD - 6}px; margin-left: 12px; display: grid; place-items: center; align-content: center; background: linear-gradient(180deg, rgba(255,255,255,.26) 0, rgba(255,255,255,.1) 46%, rgba(255,255,255,0) 52%), linear-gradient(#45f542, #2bf228 50%, #26dc23);
  color: #0b0b0b; line-height: .95; text-align: center; }
.sb-race-nbc-20 .gr b { font-size: 22px; letter-spacing: .5px; } .sb-race-nbc-20 .gr span { font-size: 22px; font-weight: 700; }
.sb-race-nbc-20 .gr.one b { font-size: 30px; }
.sb-race-nbc-20 .ev { min-width: 0; overflow: hidden; white-space: nowrap; font-size: 36px; letter-spacing: .8px; padding-right: 16px; }
.sb-race-nbc-20 .tk { position: absolute; left: ${LOGO}px; right: 0; top: ${HD + 2}px; height: ${TK}px; display: flex; background: linear-gradient(180deg, rgba(255,255,255,.28) 0, rgba(255,255,255,.11) 45%, rgba(255,255,255,0) 51%, rgba(0,0,0,.29) 100%), #161518; box-shadow: inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.6); }
.sb-race-nbc-20 .e { width: ${ENTRY}px; flex: none; display: grid; grid-template-columns: 38px 60px 1fr; align-items: center; padding: 0 12px 0 8px; box-sizing: border-box;
  border-right: 2px solid #6a6a6e; white-space: nowrap; overflow: hidden; }
.sb-race-nbc-20 .e .p { font-size: 27px; font-weight: 600; text-align: center; }
.sb-race-nbc-20 .e .c { font-style: italic; font-weight: 800; font-size: 40px; text-align: center; }
.sb-race-nbc-20 .e .n { min-width: 0; overflow: hidden; text-align: right; font-size: 34px; letter-spacing: .5px; }
`,
  draw(root, g, { opts, time }) {
    if (marks(opts).league) { const lb = el('div', 'lb'); lb.appendChild(leagueLogo(g, 80)); root.appendChild(lb); }
    else root.appendChild(el('div', 'lb'));
    const hd = el('div', 'hd');
    const race = !g.session || g.session === 'Race';
    const gr = el('span', 'gr');
    if (g.status === 'live' && race && g.lap) gr.append(el('b', '', 'RACE'), el('span', '', 'LAP ' + g.lap));
    else if (g.status === 'pre') gr.append(el('b', '', String(g.session && !race ? g.session : 'RACE').toUpperCase()), el('span', '', statusText(g, time)));
    else { gr.classList.add('one'); gr.appendChild(el('b', '', g.status === 'final' ? 'FINAL' : String(g.session || '').toUpperCase())); }
    hd.append(gr, fit(el('span', 'ev', String(g.event || '').toUpperCase())));
    root.appendChild(hd);
    const tk = el('div', 'tk');
    (g.rows || []).slice(0, N).forEach((r, i) => {
      const e = el('span', 'e');
      e.append(el('span', 'p', String(r.pos || i + 1)), el('span', 'c', r.number || ''), fit(el('span', 'n', surname(r).toUpperCase())));
      tk.appendChild(e);
    });
    root.appendChild(tk);
  },
};
