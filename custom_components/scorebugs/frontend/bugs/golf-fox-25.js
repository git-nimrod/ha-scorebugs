// "Green pylon '25": after the team golf league's leaderboard pylon on its US network, 2025 (frame: the 2025 Singapore event, final round
// with 16 holes to play; retro catalogue golf-liv-fox-1). A pylon down the left: a deep green box with rounded corners holding the
// league's logo, the host city in white capitals, the holes left in big white figures and the round; under it a pale card: the leader
// on a green band (position, first name light, surname bold, flag, score), a white panel with the leader's progress, then a row per player
// with a green round tab at the left (the team's logo on air), the position (once for a tie), the surname and the score in black.
// Measured on the 1080p still: pylon 253 px wide plus the 43 px tabs; green #04591e flat, corners 14 px; the
// card #e9eae2 with a white #f6f7f1 panel; leader band 69 px; rows 42 px; tabs #05581f, 43 x 34 px, round on the left; flags 36 px
// round; surnames 22 px capitals on the band, 17 px in the rows.
// Sponsors' marks (two on air) are never drawn. The panel shows the holes the leader has played, the latest ringed in black (on air it
// counts the strokes on the hole being played: data the sensor lacks); the tabs show the player's flag (no team in the sensor); the
// leader's team standing beside the band is left out.
// : the head is two greens: a dark #04591e box with rounded
// lower corners over its top 0.60 (logo and city), the rest #067324 (the holes to play and the round); the city's capitals 0.17 of the
// head (were 0.13); the rows' surnames, their scores, the leader's first name and TO PLAY in a wide grotesque (Archivo 500, the scores 800), not the
// condensed face. LIV's own ultra-condensed city face has no open match: Barlow Condensed draws it wider (0.71 of the head vs 0.54).
import { el, fit, leagueLogo, marks, setSrc, statusText, FONTS } from '../kit.js';

const S = 1.25, TAB = Math.round(43 * S), W = TAB + Math.round(253 * S), TOPH = Math.round(196 * S), CARD = Math.round(210 * S), BAND = Math.round(69 * S),
  PANEL = Math.round(90 * S), ROW = Math.round(42 * S), ROWS = 8;
const hFor = (n) => TOPH + 10 + Math.round(15 * S) + BAND + PANEL + 12 + Math.max(0, n - 1) * ROW + 10;

// the surname as boards print it: "Davis Love III" -> LOVE III (the feed's short form is the last word alone)
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const sur = (p, keep = true) => { const w = String(p.name || '').trim().split(/\s+/); const s = String(p.short || '');
  if (w.length > 2 && SUF.test(w[w.length - 1])) return (w[w.length - 2] + (keep ? ' ' + w[w.length - 1].replace(/\.$/, '') : '')).toUpperCase();
  return (s || w[w.length - 1] || '').toUpperCase(); };

export default {
  id: 'golf-fox-25',
  size: { w: W, h: hFor(ROWS + 1) },
  sizeFor: (g) => ({ w: W, h: hFor(Math.max(1, Math.min(ROWS + 1, (g.rows || []).length))) }),
  fonts: [FONTS.barlowCond700, FONTS.barlowCond500, FONTS.archivo],
  css: `
.sb-golf-fox-25 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-golf-fox-25 .tb { position: absolute; left: ${TAB}px; right: 0; top: 0; height: ${TOPH}px; border-radius: ${Math.round(14 * S)}px; background: #067324; box-shadow: 0 2px 6px rgba(0,0,0,.3); }
/* the dark top box (logo and city): its own rounded lower corners over the lighter head */
.sb-golf-fox-25 .tb::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: ${Math.round(118 * S)}px; border-radius: ${Math.round(14 * S)}px; background: #04591e; }
.sb-golf-fox-25 .lg { position: absolute; left: 0; right: 0; top: ${Math.round(28 * S)}px; height: ${Math.round(40 * S)}px; display: grid; place-items: center; }
.sb-golf-fox-25 .lg { overflow: hidden; }
/* the logo file is square with the mark across its middle: drawn big and cropped by its own empty top and bottom; the version for dark grounds */
.sb-golf-fox-25 .lg .sb-league { width: ${Math.round(190 * S)}px; height: ${Math.round(190 * S)}px; margin: -${Math.round(75 * S)}px 0; max-width: none; object-fit: contain; }
.sb-golf-fox-25 .lg .sb-league-text { font-size: ${Math.round(28 * S)}px !important; font-style: italic; }
.sb-golf-fox-25 .ct { position: absolute; left: ${Math.round(10 * S)}px; right: ${Math.round(10 * S)}px; top: ${Math.round(64 * S)}px; height: ${Math.round(50 * S)}px; display: grid; place-items: center; font-size: ${Math.round(48 * S)}px; letter-spacing: 0; white-space: nowrap; overflow: hidden; }
.sb-golf-fox-25 .tp { position: absolute; left: ${Math.round(10 * S)}px; top: ${Math.round(130 * S)}px; width: ${Math.round(60 * S)}px; display: grid; justify-items: center; line-height: 1; }
.sb-golf-fox-25 .tp b { font-size: ${Math.round(52 * S)}px; } .sb-golf-fox-25 .tp small { font-family: 'SB Archivo', sans-serif; font-size: ${Math.round(11 * S)}px; font-weight: 500; white-space: nowrap; }
.sb-golf-fox-25 .tp .pre { font-size: ${Math.round(18 * S)}px; padding-top: ${Math.round(14 * S)}px; white-space: nowrap; }
.sb-golf-fox-25 .rd { position: absolute; left: ${Math.round(70 * S)}px; top: ${Math.round(138 * S)}px; width: ${Math.round(90 * S)}px; text-align: center; font-size: ${Math.round(22 * S)}px; line-height: 1.05; }
.sb-golf-fox-25 .cd { position: absolute; left: ${TAB}px; right: 0; top: ${TOPH + 10}px; bottom: 0; z-index: 1; border-radius: ${Math.round(14 * S)}px ${Math.round(14 * S)}px 0 0; background: #e9eae2; }
.sb-golf-fox-25 .ld { position: absolute; left: ${TAB}px; right: 0; top: ${TOPH + 10 + Math.round(15 * S)}px; height: ${BAND}px; background: #04591e; border-radius: 0 0 ${Math.round(14 * S)}px ${Math.round(14 * S)}px;
  display: grid; grid-template-columns: ${Math.round(48 * S)}px 1fr auto; grid-template-rows: 1fr 1fr; align-items: center; }
.sb-golf-fox-25 .ld .p { grid-row: 1; text-align: center; font-size: ${Math.round(30 * S)}px; }
.sb-golf-fox-25 .ld .fl { grid-row: 2; grid-column: 1; justify-self: center; width: ${Math.round(30 * S)}px; height: ${Math.round(30 * S)}px; border-radius: 50%; object-fit: cover; }
.sb-golf-fox-25 .ld .f { grid-row: 1; grid-column: 2; align-self: end; font-family: 'SB Archivo', sans-serif; font-weight: 500; font-size: ${Math.round(18 * S)}px; letter-spacing: 0; white-space: nowrap; overflow: hidden; }
.sb-golf-fox-25 .ld .n { grid-row: 2; grid-column: 2 / 4; align-self: start; font-size: ${Math.round(32 * S)}px; line-height: 1; white-space: nowrap; overflow: hidden; min-width: 0; }
.sb-golf-fox-25 .ld .s { grid-row: 1; grid-column: 3; padding-right: ${Math.round(14 * S)}px; font-size: ${Math.round(26 * S)}px; }
.sb-golf-fox-25 .pn { position: absolute; left: ${TAB + Math.round(8 * S)}px; right: ${Math.round(8 * S)}px; top: ${TOPH + 10 + Math.round(15 * S) + BAND}px; height: ${PANEL}px; background: #f6f7f1; color: #0c0c0c;
  box-shadow: 0 ${Math.round(4 * S)}px ${Math.round(4 * S)}px -${Math.round(3 * S)}px rgba(4,89,30,.6); padding: ${Math.round(12 * S)}px 0 0 ${Math.round(26 * S)}px; box-sizing: border-box; }
.sb-golf-fox-25 .pn .h { font-family: 'SB Archivo', sans-serif; font-weight: 900; font-size: ${Math.round(20 * S)}px; letter-spacing: -.5px; }
.sb-golf-fox-25 .pn .d { display: flex; gap: ${Math.round(16 * S)}px; margin-top: ${Math.round(8 * S)}px; font-family: 'SB Archivo', sans-serif; font-weight: 800; font-size: ${Math.round(20 * S)}px; }
.sb-golf-fox-25 .pn .d span { width: ${Math.round(28 * S)}px; height: ${Math.round(28 * S)}px; display: grid; place-items: center; }
.sb-golf-fox-25 .pn .d .on { background: #0c0c0c; color: #fff; border-radius: 50%; box-shadow: 0 ${Math.round(6 * S)}px 0 -${Math.round(4 * S)}px #0c0c0c; }
.sb-golf-fox-25 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: grid; grid-template-columns: ${TAB + Math.round(46 * S)}px 1fr auto; align-items: center; color: #0c0c0c; }
.sb-golf-fox-25 .rw .tg { position: absolute; left: 0; top: ${Math.round(4 * S)}px; width: ${TAB + 24}px; padding-right: 24px; box-sizing: border-box; z-index: 0; height: ${ROW - Math.round(8 * S)}px; border-radius: ${ROW}px 0 0 ${ROW}px; background: #05581f; display: grid; place-items: center; }
.sb-golf-fox-25 .rw .tg img { width: ${Math.round(22 * S)}px; height: ${Math.round(22 * S)}px; border-radius: 50%; object-fit: cover; }
.sb-golf-fox-25 .rw .p { grid-column: 1; justify-self: end; padding-right: ${Math.round(14 * S)}px; font-size: ${Math.round(24 * S)}px; }
.sb-golf-fox-25 .rw .n { min-width: 0; overflow: hidden; white-space: nowrap; font-family: 'SB Archivo', sans-serif; font-weight: 500; font-size: ${Math.round(20 * S)}px; letter-spacing: 0; }
.sb-golf-fox-25 .rw .s { padding-right: ${Math.round(14 * S)}px; font-family: 'SB Archivo', sans-serif; font-weight: 800; font-size: ${Math.round(22 * S)}px; }
/* the cream card covers the tabs' inner ends; the row's words stand above it */
.sb-golf-fox-25 .ld, .sb-golf-fox-25 .pn { z-index: 2; }
.sb-golf-fox-25 .rw .p, .sb-golf-fox-25 .rw .n, .sb-golf-fox-25 .rw .s { position: relative; z-index: 2; }
.sb-golf-fox-25 .rw.me .n { font-weight: 700; }
`,
  draw(root, g, { opts, time }) {
    const tb = el('div', 'tb');
    if (marks(opts).league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, Math.round(40 * S), 'sb-league', true)); tb.appendChild(lg); }
    // the host city: the event's name without the league's own name in front
    tb.appendChild(fit(el('div', 'ct', String(g.event || '').replace(/^\s*LIV\s+Golf\s*/i, '').replace(/\s+presented by .*$/i, '').toUpperCase())));
    const rows = (g.rows || []).slice(0, ROWS + 1);
    const lead = rows[0];
    const played = lead ? (lead.thru === 'F' ? 18 : Number(lead.thru) || 0) : 0;
    const tp = el('div', 'tp');
    if (g.status === 'live' && played < 18) tp.append(el('b', '', String(18 - played)), el('small', '', 'TO PLAY'));
    else if (g.status === 'pre') tp.appendChild(el('span', 'pre', statusText(g, time)));
    tb.appendChild(tp);
    const rd = g.roundNo || 1, fin = rd >= 4 || g.status === 'final';
    const rdt = el('div', 'rd'); rdt.append(el('div', '', fin ? 'FINAL' : 'ROUND'), el('div', '', fin ? 'ROUND' : String(rd)));
    tb.appendChild(rdt);
    root.appendChild(tb);
    root.appendChild(el('div', 'cd'));
    if (!lead) return;
    const parts = String(lead.name || '').trim().split(/\s+/);
    const ld = el('div', 'ld');
    const fl = el('img', 'fl'); fl.alt = ''; if (lead.flag) setSrc(fl, lead.flag, () => fl.remove());
    ld.append(el('span', 'p', String(lead.place || lead.pos || 1)), lead.flag ? fl : '', fit(el('span', 'f', parts.length > 1 ? parts.slice(0, -1).join(' ').toUpperCase() : '')),
      fit(el('span', 'n', String(lead.short || parts[parts.length - 1] || '').toUpperCase())), el('span', 's', lead.score || ''));
    root.appendChild(ld);
    // the leader's progress: the last holes played, the latest ringed
    const pn = el('div', 'pn');
    if (g.status === 'live' && played > 0 && played < 18) {
      pn.appendChild(el('div', 'h', 'THRU ' + played));
      const d = el('div', 'd');
      for (let h = Math.max(1, played - 3); h <= played; h++) d.appendChild(el('span', h === played ? 'on' : '', String(h)));
      pn.appendChild(d);
    } else pn.appendChild(el('div', 'h', g.status === 'final' ? 'FINAL' : g.status === 'pre' ? 'TEE TIMES' : played >= 18 ? 'FINISHED' : ''));
    root.appendChild(pn);
    let last = lead.place || lead.pos;
    rows.slice(1).forEach((p, i) => {
      const rw = el('div', 'rw' + (g.player && g.player.id === p.id ? ' me' : ''));
      rw.style.top = (TOPH + 10 + Math.round(15 * S) + BAND + PANEL + 12 + i * ROW) + 'px';
      const tg = el('span', 'tg');
      // no flag in the feed: an empty tab, not an empty picture
      if (p.flag) { const im = el('img'); im.alt = ''; setSrc(im, p.flag, () => im.remove()); tg.appendChild(im); }
      const place = p.place || p.pos;
      rw.append(tg, el('span', 'p', place === last ? '' : String(place || '')), fit(el('span', 'n', sur(p))), el('span', 's', p.score || ''));
      last = place;
      root.appendChild(rw);
    });
  },
};
