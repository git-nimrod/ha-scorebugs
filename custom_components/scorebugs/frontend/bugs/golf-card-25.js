// "Leaderboard and card '25": after a US golf network's tour leaderboard with the player panel (frame: the final round,
// a featured player). Left, a deep blue board: the tour's logo and the event's name, then a row per player with the position (shown
// once for a tie) by a thin rule, the country's letters over its flag, the surname, the total and the round in yellow; the featured
// player's row lights up in bright blue. Right, only when a player is followed: a photo, the surname with the total
// and the round, and the hole-by-hole card for the round, with circles for birdies (two for an eagle) and squares for bogeys. Without a
// followed player the board is drawn on its own. The tour's logo (from ESPN) stays at the top left.
import { el, leagueLogo, headshot, marks, FONTS, GLOSS, LOGO_HALO, setSrc, fit } from '../kit.js';

const W = 1560, H = 1010, LEFT = 850, ROWH = 72, ROWS = 10, TOP = 230;

// the followed player's row a deeper blue and the header text lighter, so both read at 4.5:1 (the frame's lighter blues failed)
const CARD = { me: '#1f7fc4, #145f9b', head: '#e3edf7' };

export default {
  id: 'golf-card-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -6% vs the broadcast, logos -18%; 80 % of the correction
  logoScale: 1.18,
  sizeFor: (g) => (g.player ? { w: W, h: H } : { w: LEFT, h: H }),
  fonts: [FONTS.roboto],
  css: `
.sb-golf-card-25 { font-family: 'SB Roboto', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 84%; color: #fff; }
.sb-golf-card-25 { font-weight: 500; font-stretch: 100%; }   /* face: Roboto 500 (low confidence) */
.sb-golf-card-25 .lb { position: absolute; left: 0; top: 0; width: ${LEFT}px; height: ${H}px; background: ${GLOSS}, linear-gradient(#1a5a92, #0d3459); }
/* the board a clear mid blue at the top left, deepening down and to the right, with no gloss line (frame: #307fb8 top left, #205273
 top right, #123e57 at the foot) */
.sb-golf-card-25 .lb { background: linear-gradient(to right, rgba(6,22,40,0), rgba(6,22,40,.3)), linear-gradient(#2c7eb8, #1c6599 30%, #165078 65%, #113c56); }
.sb-golf-card-25 .lb .tl { position: absolute; left: 40px; top: 40px; width: 96px; height: 120px; display: grid; place-items: center; background: #fff; border-radius: 8px; }
.sb-golf-card-25 .lb .tl .sb-league { width: 80px; height: 100px; }
.sb-golf-card-25 .lb .ev { position: absolute; left: 170px; top: 40px; right: 20px; font-family: Georgia, 'Times New Roman', serif; font-size: 62px; line-height: 1.05; }
/* the event's name on one line, as on air, squeezed when long */
.sb-golf-card-25 .lb .ev { white-space: nowrap; }
.sb-golf-card-25 .lb .hd { position: absolute; top: ${TOP - 60}px; left: 410px; right: 20px; display: grid; grid-template-columns: 150px 1fr 90px; align-items: center; font-size: 26px; color: ${CARD.head}; }
.sb-golf-card-25 .lb .hd b { background: #fff; color: #0d3459; padding: 6px 12px; justify-self: start; }
.sb-golf-card-25 .rw { position: absolute; left: 0; width: ${LEFT}px; height: ${ROWH}px; display: grid; grid-template-columns: 90px 8px 90px 1fr 120px 100px; align-items: center; }
.sb-golf-card-25 .rw.me { background: ${GLOSS}, linear-gradient(${CARD.me}); } .sb-golf-card-25 .rw.me .rd { color: #fff; }
.sb-golf-card-25 .rw .p { text-align: center; font-size: 48px; } .sb-golf-card-25 .rw .rule { width: 3px; height: 70%; background: #d8e3ee; justify-self: center; }
.sb-golf-card-25 .rw .fl { display: grid; justify-items: center; font-size: 17px; letter-spacing: 2px; } .sb-golf-card-25 .rw .fl img { width: 44px; height: 28px; object-fit: cover; }
.sb-golf-card-25 .rw .nm { font-size: 50px; letter-spacing: 1px; padding-left: 10px; white-space: nowrap; overflow: hidden; }
.sb-golf-card-25 .rw .tot { text-align: right; font-size: 50px; padding-right: 22px; } .sb-golf-card-25 .rw .rd { text-align: center; font-size: 50px; color: #f6c535; border-left: 2px solid rgba(255,255,255,.25); }
.sb-golf-card-25 .pc { position: absolute; left: ${LEFT}px; top: 0; width: ${W - LEFT}px; height: ${H}px; background: ${GLOSS}, linear-gradient(#52b8f5, #2386d2); overflow: hidden; }
.sb-golf-card-25 .pc .ph { position: absolute; left: 0; right: 0; top: 0; height: 640px; overflow: hidden; display: grid; place-items: end center; }
.sb-golf-card-25 .pc .ph img { width: ${W - LEFT}px; height: 700px; object-fit: cover; object-position: 50% 12%; margin-bottom: -60px; }   /* the photo runs to both side ends of the panel and down to the name bar: the shoulders are cut by the panel's edges, never short of them */   /* the player large, filling the panel and cut at its foot, as on air */
.sb-golf-card-25 .pc .nb { position: absolute; left: 0; right: 0; top: 640px; height: 92px; background: ${GLOSS}, linear-gradient(#174d7d, #0b2c4d); display: grid; grid-template-columns: 1fr 160px 120px; align-items: center; }
.sb-golf-card-25 .pc .nb .n { font-size: 60px; padding-left: 30px; letter-spacing: 1px; } .sb-golf-card-25 .pc .nb .t { background: ${GLOSS}, #2b9be6; height: 100%; display: grid; place-items: center; font-size: 70px; }
.sb-golf-card-25 .pc .nb .r { background: #f2f4f7; color: #0d3459; height: 100%; display: grid; place-items: center; font-size: 56px; }
.sb-golf-card-25 .pc { background: linear-gradient(#0aa6f6 0 640px, #0f3a55 732px, #0b2f48); }   /* behind the photo a flat bright sky blue; under the name bar the card on deep navy, as on air (#03a9ff, #0d354e) */
.sb-golf-card-25 .pc .nb { background: linear-gradient(#1d77ad, #175f94); }   /* the name bar a mid blue, as on air (#1b72a8 to #186196) */
.sb-golf-card-25 .pc .cd { position: absolute; left: 20px; right: 20px; top: 750px; height: 250px; display: grid; grid-template-rows: 34px 1fr 34px 1fr; }
.sb-golf-card-25 .pc .cd > div { display: grid; grid-template-columns: repeat(9, 1fr) 110px; align-items: center; justify-items: center; }
.sb-golf-card-25 .pc .cd .hn { font-size: 26px; color: #dceaf7; } .sb-golf-card-25 .pc .cd .sc span { font-size: 44px; width: 56px; height: 56px; display: grid; place-items: center; box-sizing: border-box; }
.sb-golf-card-25 .pc .cd .sc .b { border: 3px solid #fff; border-radius: 50%; } .sb-golf-card-25 .pc .cd .sc .e { border: 3px double #fff; border-width: 6px; border-radius: 50%; }
.sb-golf-card-25 .pc .cd .sc .k { border: 3px solid #fff; } .sb-golf-card-25 .pc .cd .sc .k2 { border: 6px double #fff; }
.sb-golf-card-25 .pc .cd .sc .tot { background: #f2f4f7; color: #0d3459; width: 100px; height: 64px; }
`,
  draw(root, g, { opts }) {
    const mk = marks(opts);
    const lb = el('div', 'lb');
    const tl = el('div', 'tl'); if (mk.league) tl.appendChild(leagueLogo(g, 80)); lb.appendChild(tl);
    lb.appendChild(fit(el('div', 'ev', String(g.event || '').replace(/\s+presented by .*$/i, ''))));
    const done = g.status === 'final', rd = g.roundNo || 1;
    const hd = el('div', 'hd'); hd.append(el('b', '', done && rd >= 4 ? 'FINAL RD' : 'RD ' + rd), el('span', '', 'TOTAL'), el('span', '', String((g.par || []).reduce((a, b) => a + (b || 0), 0) || '')));
    hd.lastChild.style.textAlign = 'center'; hd.children[1].style.textAlign = 'right'; lb.appendChild(hd);
    const feat = g.player;
    const rows = (g.rows || []).slice(0, ROWS);
    if (g.player && !rows.some((p) => p.id === g.player.id)) rows[ROWS - 1] = g.player;
    // a round through 18 holes counts as finished (a feed may give 18 instead of F: the final showed "18" in the round column)
    const strokesOf = (p) => (p.strokes || []).filter((x) => x != null).reduce((a, b) => a + b, 0);
    let last = null;
    rows.forEach((p, i) => {
      const rw = el('div', 'rw' + (feat && feat.id === p.id ? ' me' : ''));
      rw.style.top = (TOP + i * ROWH) + 'px';
      const place = p.place || p.pos;
      const fl = el('span', 'fl'); fl.appendChild(el('span', '', String(p.country || '').slice(0, 3).toUpperCase()));
      if (p.flag) { const img = el('img'); img.alt = ''; setSrc(img, p.flag); fl.appendChild(img); }   // no flag: the country's letters alone
      rw.append(el('span', 'p', place === last ? '' : String(place || '')), el('i', 'rule'), fl, fit(el('span', 'nm', p.short || '')),
        el('span', 'tot', p.score || ''), el('span', 'rd', (p.thru === 'F' || Number(p.thru) >= 18) ? String(strokesOf(p)) : p.thru ? String(p.thru) : ''));
      last = place;
      lb.appendChild(rw);
    });
    root.appendChild(lb);
    const pc = el('div', 'pc');
    if (feat) {
      const ph = el('div', 'ph'); const im = el('img'); im.alt = ''; setSrc(im, headshot('golf', feat.id), () => setSrc(im, feat.flag)); ph.appendChild(im);
      const nb = el('div', 'nb'); nb.append(fit(el('span', 'n', feat.short || '')), el('span', 't', feat.score || ''), el('span', 'r', (feat.thru === 'F' || Number(feat.thru) >= 18) ? String(strokesOf(feat)) : feat.today || ''));
      const cd = el('div', 'cd');
      for (const half of [0, 9]) {
        const hn = el('div', 'hn'), sc = el('div', 'sc');
        let sum = 0, any = false;
        for (let i = half; i < half + 9; i++) {
          hn.appendChild(el('span', '', String(i + 1)));
          const s = (feat.strokes || [])[i], par = (feat.hole_par || [])[i];
          const d = s != null && par != null ? s - par : null;
          if (s != null) { sum += s; any = true; }
          sc.appendChild(el('span', d == null ? '' : d <= -2 ? 'e' : d === -1 ? 'b' : d === 1 ? 'k' : d >= 2 ? 'k2' : '', s == null ? '' : String(s)));
        }
        hn.appendChild(el('span', '', String((g.par || []).slice(half, half + 9).reduce((a, b) => a + (b || 0), 0) || '')));
        sc.appendChild(el('span', 'tot', any ? String(sum) : ''));
        cd.append(hn, sc);
      }
      pc.append(ph, nb, cd);
    }
    if (feat) root.appendChild(pc);   // no followed golfer: the board alone
  },
};
