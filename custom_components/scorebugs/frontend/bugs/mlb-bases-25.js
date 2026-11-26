// "Bases box '25": after the MLB bug on FOX (2024 on). Two tall team panels in their colours, each with the team's letters over a big
// score and its logo faded large behind them, a white middle with the half inning and count over the outs, and three solid white bases
// standing out of the bottom edge like real bags. The pitcher and batter lines above it on air need data the sensor does not have,
// so they are left out.
import { el, fit, otherSport, logo, logoStyle, bases, inning, statusText, teamColor, shade, inkOn, FONTS, GLOSS, LOGO_HALO, scoreSlot } from '../kit.js';

const W = 560, H = 236, BOX = 176, PRE_BOX = 136;   // before the game the team boxes hold the letters over the record

export default {
  id: 'mlb-bases-25',
  size: { w: W, h: H },
  // the bags hang under the box only in play: before and after the game the bug ends with the box, and before the first pitch the
  // empty score room goes too, so the team boxes hold just their letters
  sizeFor: (g) => (g.status === 'pre' ? { w: W, h: PRE_BOX } : g.status === 'live' && g.baseball ? { w: W, h: H } : { w: W, h: BOX }),
  fonts: [FONTS.saira],
  css: `
.sb-mlb-bases-25 { font-family: 'SB Saira', 'Arial Narrow', sans-serif; font-weight: 700; font-stretch: 80%; color: #fff; }
.sb-mlb-bases-25 { font-stretch: 87.5%; }   /* FOX MLB 2021-: Saira SemiCondensed Bold, the face kept at its semi-condensed width */
.sb-mlb-bases-25 .box { position: absolute; left: 0; top: 0; width: ${W}px; height: ${BOX}px; display: grid; grid-template-columns: 172px minmax(0, 1fr) 172px; gap: 4px; }
.sb-mlb-bases-25 .tp { position: relative; overflow: hidden; display: grid; justify-items: center; align-content: start; padding-top: 8px; box-shadow: inset 0 -7px 0 #f2c94a; }   /* the yellow strip along the foot of each team box (frame) */
.sb-mlb-bases-25 .tp .sb-logo { position: absolute; left: -30px; top: 6px; width: 240px; height: 220px; object-fit: contain; opacity: .32;   /* subtler, as on air (Phase 2b) */  filter: brightness(.68) drop-shadow(0 0 1.5px rgba(0,0,0,.7)) drop-shadow(0 2px 4px rgba(0,0,0,.5)); }
.sb-mlb-bases-25 .tp::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 15%, rgba(255,255,255,.18), transparent 45%), radial-gradient(circle at 80% 80%, rgba(0,0,0,.18), transparent 50%); }
/* faint white star specks scattered over the team colour (frame) */
.sb-mlb-bases-25 .tp::before { content: ''; position: absolute; inset: 0; z-index: 0; opacity: .55;
  background: radial-gradient(circle at 23px 31px, rgba(255,255,255,.75) 0 1.6px, transparent 2.4px), radial-gradient(circle at 61px 9px, rgba(255,255,255,.6) 0 1.2px, transparent 2px), radial-gradient(circle at 44px 67px, rgba(255,255,255,.55) 0 1.2px, transparent 2px);
  background-size: 83px 79px, 71px 97px, 89px 73px; }
.sb-mlb-bases-25.sb-playoffs .tp::before { display: none; }
/* before the first pitch: a short box with the letters in the middle of each team box */
.sb-mlb-bases-25 .box.pre { height: ${PRE_BOX}px; } .sb-mlb-bases-25 .box.pre .tp { align-content: center; padding-top: 0; }
.sb-mlb-bases-25 .box.pre .tp .sb-logo { top: -60px; }
.sb-mlb-bases-25.sb-playoffs .box.pre .tp { justify-content: center; gap: 18px; } .sb-mlb-bases-25.sb-playoffs .box.pre .tp .sb-logo { top: 0; }
.sb-mlb-bases-25 .tp b { position: relative; z-index: 1; font-size: 58px; line-height: 1; letter-spacing: 1px; text-shadow: 0 3px 2px rgba(0,0,0,.35); }
.sb-mlb-bases-25 .tp .rec { position: relative; z-index: 1; font-size: 36px; line-height: 1.1; white-space: nowrap; text-shadow: 0 2px 2px rgba(0,0,0,.35); }
.sb-mlb-bases-25 .tp .s { position: relative; z-index: 1; font-size: 100px; line-height: .95; text-shadow: 0 3px 2px rgba(0,0,0,.35); }
.sb-mlb-bases-25 .mid { background: linear-gradient(#ffffff, #e2e2e2); color: #1a1a1a; display: grid; align-content: start; justify-items: center; padding-top: 12px; gap: 6px; }
.sb-mlb-bases-25 .mid .a { font-size: 48px; line-height: 1; word-spacing: 14px; }
.sb-mlb-bases-25 .mid .o { font-size: 44px; line-height: 1; } .sb-mlb-bases-25 .mid .o small { font-size: 34px; }
.sb-mlb-bases-25 .mid .w { font-size: 34px; text-align: center; line-height: 1.1; padding: 0 10px; }   /* 34: a start time like FRI 12:25 PM ran edge to edge at 40 */
/* before and after the game the middle holds one word or time: centred in the panel, not hung from the top like the live count */
.sb-mlb-bases-25 .mid.idle { align-content: center; padding-top: 0; }
/* the bags lie flat and big, drawn over the box (in front of it, not under), as on air: each bag about 0.75 of the white middle wide and a
   third as tall as wide (frame: 138 x 45 px on a 183 px middle); first and third side by side, their tops 10 px above the box's foot;
   second between and above them, in front of the white middle, its point 10 px below the foot */
.sb-mlb-bases-25 .bags { position: absolute; z-index: 3; left: 50%; top: ${BOX - 42}px; transform: translateX(-50%) scaleY(.33); transform-origin: 50% 0; }
.sb-mlb-bases-25 .bags i { background: linear-gradient(135deg, #ffffff, #d8d8d8 55%, #b0b0b0); outline: 3px solid #1a1a1a; box-shadow: 5px 5px 0 #4a4a4a, 7px 7px 8px rgba(0,0,0,.55); }
.sb-mlb-bases-25 .bags i.on { background: linear-gradient(135deg, #ffffff, #fff4c4 55%, #e8c64a); box-shadow: 4px 4px 0 #8a7420, 0 0 14px rgba(255,214,90,.8); }
/* playoffs (frame: 2026 NLCS): small logos beside much bigger scores on finely striped team colour with a stripe of the second colour
   along the bottom, and a black middle with the inning before its arrow ("3▲ 1-0") over the outs */
.sb-mlb-bases-25.sb-playoffs .box { grid-template-columns: 200px minmax(0, 1fr) 200px; }
.sb-mlb-bases-25.sb-playoffs .tp { display: flex; align-items: center; padding-top: 0; justify-content: space-between; padding: 0 14px; box-shadow: inset 0 -12px 0 var(--c2, rgba(255,255,255,.4)); }
.sb-mlb-bases-25.sb-playoffs .tp::after { background: repeating-linear-gradient(118deg, rgba(255,255,255,.08) 0 3px, transparent 3px 11px); }
.sb-mlb-bases-25.sb-playoffs .tp .sb-logo { position: relative; left: auto; top: -4px; width: 74px; height: 74px; opacity: 1; filter: none; z-index: 1; }
.sb-mlb-bases-25.sb-playoffs .tp .s { font-size: 130px; margin-top: -10px; flex: 1; min-width: 0 !important; text-align: center; }   /* the room beside the logo: fixed, so a second digit moves nothing */
.sb-mlb-bases-25.sb-playoffs .tp .sb-logo { flex: none; }
.sb-mlb-bases-25.sb-playoffs .mid { background: #0b0b0c; color: #fff; border-left: 4px solid #fff; border-right: 4px solid #fff; padding-top: 12px; }
.sb-mlb-bases-25.sb-playoffs .mid .a { font-size: 42px; word-spacing: 8px; } .sb-mlb-bases-25.sb-playoffs .mid .o { font-size: 40px; }
.sb-mlb-bases-25 .mid.os { align-content: center; padding-top: 0; gap: 12px; }
.sb-mlb-bases-25 .mid.os .a { font-size: 42px; word-spacing: 6px; white-space: nowrap; }
.sb-mlb-bases-25 .mid .dt { font-size: 30px; line-height: 1.05; text-align: center; white-space: pre-line; padding: 0 10px; }
`,
  dresses: ['regular', 'playoffs'],
  draw(root, g, { time }) {
    const live = g.status === 'live' && !!g.baseball; // a baseball bug forced onto another sport's game shows only the scores
    const box = el('div', 'box');
    const post = g.dress === 'playoffs';
    const panel = (t, side) => {
      const c = teamColor(t, '#4a4f57');
      const p = el('div', 'tp');
      p.style.background = 'linear-gradient(' + shade(c, 0.22) + ', ' + shade(c, 0.02) + ')';
      p.style.color = inkOn(c) === '#111' ? shade(c, -0.8) : '#fff';
      const pre = g.status === 'pre';
      const score = pre ? el('span', 'rec', t.record || '') : scoreSlot(el('span', 's', t.score != null ? String(t.score) : ''), g);  // records before the game, every time
      if (post) {
        if (/^#[0-9a-f]{6}$/i.test(t.color2 || '')) p.style.setProperty('--c2', t.color2);
        // the small logo sits on the team's own colour, so it is the version drawn for dark backgrounds (white where the team has one)
        const lt = { ...t, logo: logoStyle(t.logo, 'dark') };
        if (side === 'away') p.append(logo(lt, 74), score); else p.append(score, logo(lt, 74));
      } else p.append(logo(t, 220), fit(el('b', '', (t.abbr || '').toUpperCase())), score);
      return p;
    };
    const mid = el('div', 'mid');
    if (live) {
      const b = g.baseball;
      const inn = post ? (g.period.label || '') + (b.half === 'top' ? '▲' : b.half === 'bot' ? '▼' : '') : inning(g);
      mid.appendChild(el('span', 'a', inn + ' ' + b.balls + '-' + b.strikes));
      const o = el('span', 'o', String(b.outs) + ' ');
      o.appendChild(el('small', '', b.outs >= 2 ? 'OUTS' : 'OUT'));   // FOX writes "0 OUT" and "1 OUT"
      mid.appendChild(o);
    } else if (otherSport(g)) {
      // another sport's game: the period in the inning's spot, the clock in the count's, one detail in the bases' room, no outs
      const os = otherSport(g, 8);
      mid.classList.add('os');
      mid.appendChild(el('span', 'a', os.period + ' ' + os.clock));
      if (os.detail) mid.appendChild(el('span', 'dt', os.detail));
    } else { mid.classList.add('idle'); mid.appendChild(el('span', 'w', statusText(g, time))); }
    if (g.status === 'pre') box.classList.add('pre');
    box.append(panel(g.away, 'away'), mid, panel(g.home, 'home'));
    root.appendChild(box);
    if (live) root.appendChild(bases(g.baseball.bases, 111, 'sb-bases bags'));
  },
};
