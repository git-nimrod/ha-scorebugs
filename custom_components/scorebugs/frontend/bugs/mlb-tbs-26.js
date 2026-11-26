// "Black box '26": after TNT Sports' MLB bug on TBS (the 2026 postseason; real stills: Yankees v Rays ALDS Game 1). Reshaped Nov 25 to the
// stills: one dark rounded bar. At the left the network's spot (here the Home Assistant logo) and a dashed line, then each team's logo on a
// tile of its navy beside a white-to-grey score tile, the inning as a column (an outline arrow, the number, a filled arrow), a hairline,
// the count over three out circles (a filled circle is an out) and the bases as outlines at the right (the taken one filled white). The
// round floats above the bar with no background ("ALDS  GAME 1"). No batter line (the pitcher and batter lines on air have no data).
import { el, fit, otherSport, logo, bases, statusText, teamColor, shade, haMark, marks, FONTS } from '../kit.js';

const W = 800, H = 256, TOP = 76, BOX = 180, SPOT = 178, DASH = 20, LG = 110, SC_W = 94;
const titled = (g, o) => !!(g.round && g.round.label) && (o && o.bug_dress) !== 'regular';

export default {
  id: 'mlb-tbs-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // the round floats above the bar only in the postseason; without it the bug is just the bar (no empty band on top)
  // before the first pitch the white score column goes too and the bar closes up; records keep the column
  sizeFor: (g, o) => ({ w: g.status === 'pre' && !(g.away.record && g.home.record) ? W - SC_W : W, h: titled(g, o) ? H : BOX + 4 }),
  dresses: ['regular', 'playoffs'],
  logos: 'dark',   // one-colour white logos on the navy tiles, as on air
  fonts: [FONTS.kanit600],
  css: `
.sb-mlb-tbs-26 { font-family: 'SB Kanit', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 80%; color: #fff; }
.sb-mlb-tbs-26 { font-weight: 600; }   /* TBS/TNT MLB 2024-26: Kanit SemiBold */
.sb-mlb-tbs-26.sb-ink-dark .ttl { color: #16181b; text-shadow: none; }
.sb-mlb-tbs-26 .ttl { position: absolute; left: 180px; top: 0; height: ${TOP - 6}px; display: flex; align-items: center; gap: 60px; font-size: 52px; letter-spacing: 1px;
  text-shadow: 0 2px 6px rgba(0,0,0,.8); white-space: nowrap; }
.sb-mlb-tbs-26 .box { position: absolute; left: 0; top: ${TOP}px; width: ${W}px; height: ${BOX}px; background: linear-gradient(#232426, #101112 40%, #08080a); border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.25); display: grid; grid-template-columns: ${SPOT}px ${DASH}px ${LG}px ${SC_W}px 1fr; box-sizing: border-box; overflow: hidden; }
.sb-mlb-tbs-26 .box.pre { grid-template-columns: ${SPOT}px ${DASH}px ${LG}px 1fr; width: ${W - SC_W}px; }
.sb-mlb-tbs-26 .slot { display: grid; place-items: center; } .sb-mlb-tbs-26 .slot .sb-ha { color: #fff; }
/* four short white dashes between the network's spot and the teams */
.sb-mlb-tbs-26 .dash { background: repeating-linear-gradient(#e8e8e8 0 24px, transparent 24px 40px) 50% 14px / 5px 152px no-repeat; }
.sb-mlb-tbs-26 .col { display: grid; grid-template-rows: 1fr 1fr; }
.sb-mlb-tbs-26 .lgs > div { display: grid; place-items: center; } .sb-mlb-tbs-26 .lgs .sb-logo { width: 84px; height: 70px; object-fit: contain; }
.sb-mlb-tbs-26 .scs span { background: linear-gradient(#f0f0f0, #dcdcdc 55%, #b9b9b9); color: #111; display: grid; place-items: center; font-size: 56px; line-height: 1; padding-top: 0; overflow: hidden; }
.sb-mlb-tbs-26 .rt { position: relative; }
.sb-mlb-tbs-26 .inn { position: absolute; left: 0; width: 76px; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 46px; line-height: 1; }
.sb-mlb-tbs-26 .inn i { font-style: normal; font-size: 30px; line-height: 1; color: #e8e8e8; }
.sb-mlb-tbs-26 .inn i.off { color: transparent; -webkit-text-stroke: 1.5px #9a9a9a; }
.sb-mlb-tbs-26 .rule { position: absolute; left: 82px; top: 24px; bottom: 24px; width: 1px; background: rgba(255,255,255,.18); }
.sb-mlb-tbs-26 .c { position: absolute; left: 100px; width: 190px; top: 22px; text-align: center; font-size: 50px; line-height: 1; }
.sb-mlb-tbs-26 .outs { position: absolute; left: 100px; width: 190px; top: 112px; display: flex; justify-content: center; gap: 22px; }
.sb-mlb-tbs-26 .outs i { width: 26px; height: 26px; border-radius: 50%; box-sizing: border-box; border: 2.5px solid #8d8d90; }
.sb-mlb-tbs-26 .outs i.on { background: #ececec; border-color: #ececec; }
.sb-mlb-tbs-26 .bs { position: absolute; right: 0; top: 0; bottom: 0; width: 150px; display: grid; place-items: center; }
.sb-mlb-tbs-26 .bs .sb-bases i { background: transparent; border: 2.5px solid #7d7e82; border-radius: 6px; } .sb-mlb-tbs-26 .bs .sb-bases i.on { background: #ececec; border-color: #ececec; }
.sb-mlb-tbs-26 .w { grid-column: 5; grid-row: 1; font-size: 48px; display: grid; place-items: center; white-space: nowrap; }
.sb-mlb-tbs-26 .box.pre .w { grid-column: 4; }
.sb-mlb-tbs-26 .os .inn { font-size: 40px; padding: 0 6px; box-sizing: border-box; }
.sb-mlb-tbs-26 .os .c { top: 0; bottom: 0; display: grid; place-items: center; }
.sb-mlb-tbs-26 .os .dt { position: absolute; right: 0; top: 0; bottom: 0; width: 150px; box-sizing: border-box; padding: 0 14px; display: grid; place-items: center; text-align: center; font-size: 32px; line-height: 1.1; color: #e8e8e8; white-space: pre-line; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live' && !!g.baseball;
    const r = g.round || {};
    if (g.dress && g.dress !== 'regular' && r.label) {
      const ttl = el('div', 'ttl');
      ttl.append(el('span', '', r.label), el('span', '', r.game || ''));
      root.appendChild(ttl);
    }
    const box = el('div', 'box');
    if (!root.querySelector('.ttl')) box.style.top = '0';
    const slot = el('div', 'slot');
    if (mk.ha) slot.appendChild(haMark(120));
    box.append(slot, el('div', 'dash'));
    const lgs = el('div', 'col lgs'), scs = el('div', 'col scs');
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47');
      const sq = el('div', ''); sq.style.background = 'linear-gradient(' + shade(c, -0.18) + ', ' + shade(c, -0.42) + ')';
      sq.appendChild(logo(t, 100)); lgs.appendChild(sq);
      if (g.status !== 'pre') scs.appendChild(el('span', '', t.score != null ? String(t.score) : ''));
      else if (g.away.record && g.home.record) { const rc = el('span', '', t.record); rc.style.fontSize = (Math.max(g.away.record.length, g.home.record.length) > 5 ? 16 : 28) + 'px'; scs.appendChild(rc); }  // records before the game, every time
    });
    box.appendChild(lgs);
    if (g.status === 'pre' && !(g.away.record && g.home.record)) box.classList.add('pre'); else box.appendChild(scs);
    if (live) {
      const b = g.baseball;
      const rt = el('div', 'rt');
      const inn = el('div', 'inn');
      inn.append(el('i', b.half === 'top' ? '' : 'off', '▲'), el('span', '', g.period.label || ''), el('i', b.half === 'bot' ? '' : 'off', '▼'));
      const outs = el('div', 'outs'); for (let i = 0; i < 3; i++) outs.appendChild(el('i', i < b.outs ? 'on' : ''));
      const bs = el('div', 'bs'); bs.appendChild(bases(b.bases, 40, 'sb-bases'));
      rt.append(inn, el('div', 'rule'), el('span', 'c', b.balls + '-' + b.strikes), outs, bs);
      box.appendChild(rt);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's column, the clock centred where the count and outs were, one detail in the bases' room
      const os = otherSport(g, 8);
      const rt = el('div', 'rt os');
      rt.append(fit(el('div', 'inn', os.period)), el('div', 'rule'), el('span', 'c', os.clock));
      if (os.detail) rt.appendChild(el('div', 'dt', os.detail));
      box.appendChild(rt);
    } else box.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(box);
  },
};
