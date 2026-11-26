// "College blocks '25": after CBS's college football bug (2025; frame: Boise State v Oregon). Each team a block in its colour with a
// thin edge in its second colour at the outer end: its name small at the top, its logo large below, and a tall silver-lit score with three
// timeout dashes under it towards the middle. The centre: the down and distance on a band in the colour of the team with the ball, over a
// black band with the quarter | the clock (the play clock's box is left out: the feed has no play clock). The network's mark sat under
// the bug, so there is no Home Assistant logo here.
import { el, logo, ordinal, pips, statusText, teamColor, shade, teamInk, scoreSlot, FONTS, GLOSS } from '../kit.js';

// wider team blocks
const W = 1040, H = 116, TEAM = 370, MID = 300, SHUT = 100;   // SHUT: how much each block gives up before the game
const NAME_PX = 20, SCORE_PX = 88, DOWN_PX = 30, CLOCK_PX = 32, RANK_PX = 16;

export default {
  id: 'cfb-blocks-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off with no records to show, the score's room goes and the blocks close up on the middle (else the kit filled it with
  // a second copy of the logo beside the first). With both records, the kit sets them in the score boxes.
  sizeFor: (g) => (g.status === 'pre' && !(g.away.record && g.home.record) ? { w: W - 2 * SHUT, h: H } : { w: W, h: H }),
  fonts: [FONTS.barlow800],
  css: `
.sb-cfb-blocks-25 { font-family: 'SB Barlow', 'Arial Black', sans-serif; font-weight: 800; color: #fff; display: grid; grid-template-columns: ${TEAM}px ${MID}px ${TEAM}px; height: ${H}px; filter: drop-shadow(0 3px 6px rgba(0,0,0,.5)); }
.sb-cfb-blocks-25 { font-weight: 800; }   /* CBS Eyebar 2024-25: Barlow ExtraBold */
.sb-cfb-blocks-25 .tm { position: relative; display: grid; grid-template-columns: 150px 1fr; overflow: hidden; }
.sb-cfb-blocks-25 .tm.a { border-radius: 8px 0 0 8px; } .sb-cfb-blocks-25 .tm.h { border-radius: 0 8px 8px 0; grid-template-columns: 1fr 150px; }
.sb-cfb-blocks-25 .nm { position: absolute; top: 4px; font-size: ${NAME_PX}px; font-weight: 700; letter-spacing: .3px; white-space: nowrap; }
.sb-cfb-blocks-25 .tm.a .nm { left: 14px; } .sb-cfb-blocks-25 .tm.h .nm { right: 14px; }
.sb-cfb-blocks-25 .nm b { display: inline-block; min-width: 18px; padding: 0 3px; margin-right: 5px; background: #e6e6e6; color: #222; border-radius: 3px; font-size: ${RANK_PX}px; text-align: center; }
/* every logo in the same box under the name, clear of it and of the block's edge, wide or tall */
.sb-cfb-blocks-25 .tm .sb-logo { width: 124px; height: 74px; object-fit: contain; align-self: end; justify-self: center; margin-bottom: 8px; filter: drop-shadow(1px 2px 0 rgba(0,0,0,.3)); }
.sb-cfb-blocks-25 .sc { position: relative; display: grid; place-items: center; font-size: ${SCORE_PX}px; line-height: 1; padding-bottom: 12px;
  background: linear-gradient(#ffffff 0%, #f3f4f6 36%, #a4a9b1 52%, #e6e8eb 70%, #b3b8bf 100%);   /* brushed metal: a bright top, a hard horizon */
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.sb-cfb-blocks-25 .sb-pips { position: absolute; left: 0; right: 0; bottom: 10px; display: flex; justify-content: center; gap: 8px; }
.sb-cfb-blocks-25 .sb-pips i { width: 36px; height: 6px; border-radius: 2px; background: #f2f2f2; } .sb-cfb-blocks-25 .sb-pips i.used { opacity: .25; }
.sb-cfb-blocks-25 .md { display: grid; grid-template-rows: 1fr 1fr; }
.sb-cfb-blocks-25 .dn { display: grid; padding: 4px 8px 2px; background: #0b0c0d; font-size: ${DOWN_PX}px; }
.sb-cfb-blocks-25 .dn .bx { display: grid; place-items: center; border-radius: 5px; background: linear-gradient(#3b3e44, #24262a); box-shadow: inset 0 0 0 1px rgba(0,0,0,.45); }   /* an inset rounded box, as on air */
.sb-cfb-blocks-25 .ck { display: flex; align-items: center; justify-content: center; gap: 18px; background: #0b0c0d; font-size: ${CLOCK_PX}px; }
.sb-cfb-blocks-25 .ck .bar { width: 2px; height: 30px; background: #7a7c80; }
.sb-cfb-blocks-25 .ck .w { font-size: ${CLOCK_PX * 0.8}px; }
.sb-cfb-blocks-25 .sb-ord { font-size: .62em; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const shut = g.status === 'pre' && !(g.away.record && g.home.record);
    if (shut) root.style.gridTemplateColumns = (TEAM - SHUT) + 'px ' + MID + 'px ' + (TEAM - SHUT) + 'px';
    const block = (t, k) => {
      const c = teamColor(t, '#2f3236');
      const b = el('div', 'tm ' + k);
      b.style.background = 'linear-gradient(' + shade(c, 0.04) + ', ' + shade(c, -0.08) + ')';   // flat colour, as on air (no gloss)
      const c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') && t.color2.toLowerCase() !== c.toLowerCase() ? t.color2 : shade(c, 0.3);   // the true second colour (a yellow stays yellow)
      b.style[k === 'a' ? 'borderLeft' : 'borderRight'] = '6px solid ' + c2;
      b.style.color = teamInk(c);
      const nm = el('span', 'nm');
      if (t.rank) nm.appendChild(el('b', '', String(t.rank)));
      nm.appendChild(document.createTextNode((t.name || t.abbr || '').toUpperCase().slice(0, 16)));
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      // the score (and its timeout dashes under it) sits close to the middle box, as on air
      const cell = el('div'), sw = el('div');
      cell.style.cssText = 'display:grid;align-items:center;justify-content:' + (k === 'a' ? 'end' : 'start') + ';padding:0 18px';
      sw.style.cssText = 'position:relative;display:grid;height:100%'; sw.appendChild(sc); cell.appendChild(sw);
      if (live && t.timeouts != null) sw.appendChild(pips(t.timeouts, 3));
      if (shut) { b.style.gridTemplateColumns = '1fr'; b.append(logo(t, 116)); }
      else if (k === 'a') b.append(logo(t, 116), cell); else b.append(cell, logo(t, 116));
      b.appendChild(nm);
      return b;
    };
    const md = el('div', 'md');
    const dn = el('div', 'dn'), bx = el('span', 'bx', live && g.football && g.football.short ? g.football.short : ''); dn.appendChild(bx);
    const ball = live ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    if (ball) { const c = teamColor(ball, '#3b3e44'); bx.style.background = 'linear-gradient(' + shade(c, 0.06) + ', ' + shade(c, -0.12) + ')'; bx.style.color = teamInk(c); }
    const ck = el('div', 'ck');
    if (live) { ck.appendChild(ordinal(g.period)); if (g.clock) { ck.appendChild(el('span', 'bar')); ck.appendChild(el('span', '', g.clock)); } }
    else ck.appendChild(el('span', 'w', statusText(g, time)));
    // no empty down band before or after the game, nor for another sport's game
    if (live && g.football) md.append(dn, ck); else { md.style.gridTemplateRows = '1fr'; md.append(ck); }
    root.append(block(g.away, 'a'), md, block(g.home, 'h'));
  },
};
