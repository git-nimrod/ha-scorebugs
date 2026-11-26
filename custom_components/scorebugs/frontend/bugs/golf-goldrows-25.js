// "Gold rows '25": after the leaderboard of a links major on its US broadcast (frame: the final round, navy frame and
// gold rows). A navy board: the championship's logo across the top when its address is known (else its name in plain capitals),
// a header row with the round, TOTAL, PAR (the round's par) and TODAY, then a gold row per player with the position (shown once for a
// tie), the flag and the full name, and navy boxes with the total and the round's strokes and a pale box with today's score.
import { el, eventLogo, FONTS, GLOSS, LOGO_HALO, setSrc } from '../kit.js';

const W = 1180, ROWS = 8, ROWH = 62, TOP = 150;

export default {
  id: 'golf-goldrows-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: TOP + ROWS * ROWH + 30 },
  // measured against the frame by the automatic audit: text -17% vs the broadcast, logos -10%; 80 % of the correction
  typeScale: 1.16, logoScale: 1.088,
  fonts: [FONTS.figtree, FONTS.playfair],
  css: `
.sb-golf-goldrows-25 { font-family: 'SB Figtree', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 82%; color: #fff; }
.sb-golf-goldrows-25 { font-weight: 500; font-stretch: 100%; }   /* face: Figtree 500 (low confidence) */
.sb-golf-goldrows-25 .fr { position: absolute; inset: 0; background: radial-gradient(ellipse 75% 60% at 50% 8%, #1f4c9c, rgba(18,53,116,0) 70%), linear-gradient(#0f2d68, #08204f 55%, #051638);   /* a deep navy, lit from the top middle and darkening down and out, as on air */ border: 4px solid #1d4590; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,.5); }
/* the head with the title is its own deep band lit at the top middle, with a light rule under it; the rows sit on their own inset panel,
 a lighter blue fading down. Both are drawn on the frame itself (layers), and the
 inset panel as the frame's ::before, so the rows paint over them */
.sb-golf-goldrows-25 .fr { background:
  radial-gradient(ellipse 55% ${TOP - 54}px at 50% 0, rgba(70,120,210,.55), rgba(70,120,210,0) 70%) top / 100% ${TOP - 54}px no-repeat,
  linear-gradient(rgba(120,160,230,.5), rgba(120,160,230,.5)) 0 ${TOP - 54}px / 100% 2px no-repeat,
  linear-gradient(#0c2860, #061a45) top / 100% ${TOP - 54}px no-repeat,
  linear-gradient(#0f2d68, #08204f 55%, #051638); }
.sb-golf-goldrows-25 .fr::before { content: ''; position: absolute; left: 10px; right: 10px; top: ${TOP - 50}px; bottom: 10px; border-radius: 3px;
  background: linear-gradient(#1a3f86, #123171 60%, #0c2559); box-shadow: inset 0 1px 0 rgba(255,255,255,.12); }
.sb-golf-goldrows-25 .ttl { position: absolute; left: 0; right: 0; top: 10px; height: 86px; display: grid; place-items: center; font-family: Georgia, 'Times New Roman', serif;
  font-size: 56px; font-weight: 700; letter-spacing: 1px; }
.sb-golf-goldrows-25 .hd { position: absolute; left: 22px; right: 22px; top: ${TOP - 46}px; height: 36px; display: grid; grid-template-columns: 1fr 104px 104px 104px; gap: 8px;
  font-size: 22px; letter-spacing: .5px; }
.sb-golf-goldrows-25 .hd span { display: grid; place-items: center; background: #0a2150; border-radius: 3px; font-family: 'SB Playfair', Georgia, serif; font-weight: 700; letter-spacing: .5px; font-variant-numeric: lining-nums; }
.sb-golf-goldrows-25 .hd span:first-child { justify-items: start; padding-left: 14px; background: none; font-family: 'SB Playfair', Georgia, serif; }
.sb-golf-goldrows-25 .rw { position: absolute; left: 22px; right: 22px; height: ${ROWH - 3}px;   /* rows nearly touching, as on air */ display: grid; grid-template-columns: 56px 1fr 104px 104px 104px; gap: 8px; }
.sb-golf-goldrows-25 .rw > * { display: grid; align-items: center; }
.sb-golf-goldrows-25 .pos { background: linear-gradient(#ffc93a, #f3b519 60%, #e6a50f); color: #1c2c55; justify-items: center; font-size: 30px; margin-right: -8px; }   /* one gold bar with the name, as on air (review, Nov 22) */
/* the position in the same serif as the boxes' figures, as on air */
.sb-golf-goldrows-25 .pos { font-family: 'SB Playfair', Georgia, serif; font-weight: 700; font-variant-numeric: lining-nums; font-size: 32px; }
.sb-golf-goldrows-25 .nm { background: linear-gradient(#ffc93a, #f3b519 60%, #e6a50f); color: #1c2c55; grid-template-columns: 56px 1fr; font-size: 30px; font-weight: 500; letter-spacing: 3px; }   /* smaller and spaced, as on air */
.sb-golf-goldrows-25 .nm img { width: 40px; height: 28px; object-fit: cover; justify-self: center; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
.sb-golf-goldrows-25 .bx { background: #0a2150; justify-items: center; align-items: center; line-height: 1; padding: 0; box-sizing: border-box; font-variant-numeric: lining-nums tabular-nums; font-family: 'SB Playfair', Georgia, serif; font-weight: 700; font-size: 36px; box-shadow: inset 0 0 0 2px #f2b52a; }
.sb-golf-goldrows-25 .bx.light { background: linear-gradient(#ffffff, #e4e7ec); color: #1c2c55; }
.sb-golf-goldrows-25 .rw.me .nm { background: linear-gradient(#fff3c4, #f5d877); }
`,
  draw(root, g, { opts }) {
    const fr = el('div', 'fr');
    const lg = eventLogo(g, 84, opts), ttl = el('div', 'ttl');
    // the championship's logo in white on the navy board, as on air; its name when there is no logo
    if (lg) { lg.style.filter = 'brightness(0) invert(1)'; ttl.appendChild(lg); }
    else ttl.textContent = String(g.event || '').toUpperCase().replace(/\b(PRESENTED BY|SPONSORED BY)\b.*$/, '').trim();
    fr.appendChild(ttl);
    const done = g.status === 'final', rd = g.roundNo || 1;
    const hd = el('div', 'hd');
    const par = (g.par || []).reduce((a, b) => a + (b || 0), 0);
    hd.append(el('span', '', done && rd >= 4 ? 'FINAL ROUND' : 'ROUND ' + rd), el('span', '', 'TOTAL'), el('span', '', par ? 'PAR ' + par : 'ROUND'), el('span', '', 'TODAY'));
    fr.appendChild(hd);
    const rows = (g.rows || []).slice(0, ROWS);
    if (g.player && !rows.some((p) => p.id === g.player.id)) rows[ROWS - 1] = g.player;
    let last = null;
    rows.forEach((p, i) => {
      const rw = el('div', 'rw' + (g.player && g.player.id === p.id ? ' me' : ''));
      rw.style.top = (TOP + i * ROWH) + 'px';
      const place = p.place || p.pos;
      rw.appendChild(el('span', 'pos', place === last ? '' : String(place || ''))); last = place;
      const nm = el('span', 'nm');
      // no flag in the feed: none drawn, the name moves up to the row's start
      if (p.flag) { const flag = el('img'); flag.alt = ''; setSrc(flag, p.flag); nm.appendChild(flag); }
      const nmText = el('span', '', String(p.name || '').toUpperCase()); nmText.style.whiteSpace = 'nowrap'; nm.appendChild(nmText);
      // a round through 18 holes counts as finished (a feed may give 18 instead of F)
      const strokes = (p.strokes || []).filter((x) => x != null);
      rw.append(nm, el('span', 'bx', p.score || ''), el('span', 'bx', (p.thru === 'F' || Number(p.thru) >= 18) ? String(strokes.reduce((a, b) => a + b, 0)) : (p.thru ? String(p.thru) : '')), el('span', 'bx light', p.today || ''));
      fr.appendChild(rw);
    });
    root.appendChild(fr);
  },
};
