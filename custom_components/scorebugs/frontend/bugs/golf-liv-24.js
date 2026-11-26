// "Pylon '24": after the team golf league's own leaderboard pylon of 2022-2024 (frame: a 2024 event, final round with 15 holes to play;
// retro catalogue golf-liv-24-1). A narrow dark pylon down the left: the league's logo at the top over a black head with the holes left
// in huge lime figures, "TO PLAY", and the round; then a row per player with the position (once for a tie), a square tile (the team's
// logo on air), the surname in white capitals cut to six letters as the league prints them (PIETRS, NIEMNN) and the score to par.
// Measured on the 1080p still: pylon 255 px wide; head #1c1c1c, 170 px; the figures #b4fe98 to a deeper
// green at their foot, 55 px tall; rows 49.5 px, #2f332c flat; tiles 48 x 48 px; names 16 px capitals, scores 20 px.
// After the round the head keeps the round alone. The tile shows the player's flag (the sensor has no team). The holes left are the leader's (18 less the holes played). The team
// table under the players is left out (no data).
// : the holes-left figures 57 px tall reaching the head's foot (were 51 px,
// ending above it); the scores centred in their own column (centre at 0.87 of the width), not set to the right edge; the head a
// touch darker and greener as sampled (#161b13; was #1a1a1a).
import { el, fit, leagueLogo, marks, setSrc, statusText, FONTS } from '../kit.js';

const S = 1.25, W = Math.round(255 * S), HEAD = Math.round(170 * S), ROW = Math.round(49.5 * S), ROWS = 12;
// "PIETERS" -> "PIETRS", "NIEMANN" -> "NIEMNN", "LEISHMAN" -> "LEISHM": the last vowel dropped, then six letters
const six = (s) => { s = String(s || '').toUpperCase(); if (s.length <= 6) return s; const i = s.slice(1).search(/[AEIOU](?=[^AEIOU]*$)/); return (i >= 0 ? s.slice(0, i + 1) + s.slice(i + 2) : s).slice(0, 6); };

// the surname as boards print it: "Davis Love III" -> LOVE III (the feed's short form is the last word alone)
const SUF = /^(jr\.?|sr\.?|ii|iii|iv)$/i;
const sur = (p, keep = true) => { const w = String(p.name || '').trim().split(/\s+/); const s = String(p.short || '');
  if (w.length > 2 && SUF.test(w[w.length - 1])) return (w[w.length - 2] + (keep ? ' ' + w[w.length - 1].replace(/\.$/, '') : '')).toUpperCase();
  return (s || w[w.length - 1] || '').toUpperCase(); };

export default {
  id: 'golf-liv-24',
  size: { w: W, h: HEAD + ROWS * ROW + 4 },
  sizeFor: (g) => ({ w: W, h: HEAD + Math.max(1, Math.min(ROWS, (g.rows || []).length)) * ROW + 4 }),
  fonts: [FONTS.barlowCond700, FONTS.archivo],
  css: `
.sb-golf-liv-24 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
.sb-golf-liv-24 .hd { position: absolute; left: 0; right: 0; top: 0; height: ${HEAD}px; background: linear-gradient(#1e201c, #171a15 30%, #131511); }
.sb-golf-liv-24 .lg { position: absolute; left: 0; right: 0; top: ${Math.round(42 * S)}px; height: ${Math.round(50 * S)}px; display: grid; place-items: center; }
.sb-golf-liv-24 .lg { overflow: hidden; }
/* the logo file is square with the mark across its middle: drawn big and cropped by its own empty top and bottom; the version for dark grounds */
.sb-golf-liv-24 .lg .sb-league { width: ${Math.round(190 * S)}px; height: ${Math.round(190 * S)}px; margin: -${Math.round(75 * S)}px 0; max-width: none; object-fit: contain; }
.sb-golf-liv-24 .lg .sb-league-text { font-size: ${Math.round(30 * S)}px !important; font-style: italic; letter-spacing: 1px; }
.sb-golf-liv-24 .tp { position: absolute; left: ${Math.round(8 * S)}px; top: ${Math.round(110 * S)}px; height: ${Math.round(62 * S)}px; display: flex; align-items: center; gap: ${Math.round(4 * S)}px; }
.sb-golf-liv-24 .tp b { font-family: 'SB Archivo', sans-serif; font-weight: 900; font-stretch: 80%; font-size: ${Math.round(83 * S)}px; line-height: 1; letter-spacing: -2px;
  color: #b4fe98; text-shadow: 0 ${Math.round(2 * S)}px 0 #4fae3a; }
.sb-golf-liv-24 .tp span { font-size: ${Math.round(19 * S)}px; line-height: 1; }
.sb-golf-liv-24 .tp .two { display: grid; }
.sb-golf-liv-24 .rd { position: absolute; right: ${Math.round(18 * S)}px; top: ${Math.round(118 * S)}px; width: ${Math.round(90 * S)}px; text-align: center; font-size: ${Math.round(17 * S)}px; line-height: 1.02; font-weight: 600; }
.sb-golf-liv-24 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: grid; grid-template-columns: ${Math.round(46 * S)}px ${Math.round(50 * S)}px 1fr auto; align-items: center; background: #2f332c; font-family: 'SB Archivo', sans-serif; font-size: ${Math.round(17 * S)}px; }
.sb-golf-liv-24 .rw .p { text-align: center; font-size: ${Math.round(24 * S)}px; }
.sb-golf-liv-24 .rw .tl { width: ${Math.round(48 * S)}px; height: ${ROW}px; overflow: hidden; background: #e9e9e9; display: grid; place-items: center; }
.sb-golf-liv-24 .rw .tl img { width: 100%; height: 100%; object-fit: cover; }
.sb-golf-liv-24 .rw .tl.no { background: #3a3f37; }
.sb-golf-liv-24 .rw .n { min-width: 0; overflow: hidden; white-space: nowrap; padding-left: ${Math.round(20 * S)}px; letter-spacing: ${0.5 * S}px; }
.sb-golf-liv-24 .rw .s { width: ${Math.round(60 * S)}px; margin-right: ${Math.round(6 * S)}px; text-align: center; font-size: ${Math.round(21 * S)}px; font-weight: 600; }
.sb-golf-liv-24 .rw.me { background: #3f4a3a; }
`,
  draw(root, g, { opts, time }) {
    const hd = el('div', 'hd');
    if (marks(opts).league) { const lg = el('div', 'lg'); lg.appendChild(leagueLogo(g, Math.round(50 * S), 'sb-league', true)); hd.appendChild(lg); }
    const rows = (g.rows || []).slice(0, ROWS);
    const lead = rows[0];
    const played = lead ? (lead.thru === 'F' ? 18 : Number(lead.thru) || 0) : 0;
    const tp = el('div', 'tp');
    // the holes left, with "TO PLAY" on two lines beside them, as on air
    if (g.status === 'live' && played < 18) { const two = el('span', 'two'); two.append(el('span', '', 'TO'), el('span', '', 'PLAY')); tp.append(el('b', '', String(18 - played)), two); }
    else if (g.status === 'pre') tp.appendChild(el('span', '', statusText(g, time)));
    hd.appendChild(tp);
    const rd = g.roundNo || 1;
    const rdt = el('div', 'rd'); const fin = rd >= 4 || g.status === 'final';
    rdt.append(el('div', '', fin ? 'FINAL' : 'ROUND'), el('div', '', fin ? 'ROUND' : String(rd)));
    hd.appendChild(rdt);
    root.appendChild(hd);
    let last = null;
    rows.forEach((p, i) => {
      const rw = el('div', 'rw' + (g.player && g.player.id === p.id ? ' me' : '')); rw.style.top = (HEAD + i * ROW) + 'px';
      const place = p.place || p.pos;
      const tl = el('span', 'tl' + (p.flag ? '' : ' no'));
      // no flag in the feed: the tile takes the row's colour, no empty picture
      if (p.flag) { const im = el('img'); im.alt = ''; setSrc(im, p.flag, () => im.remove()); tl.appendChild(im); }
      rw.append(el('span', 'p', place === last ? '' : String(place || '')), tl, fit(el('span', 'n', six(sur(p, false)))), el('span', 's', p.score || ''));
      last = place;
      root.appendChild(rw);
    });
  },
};
