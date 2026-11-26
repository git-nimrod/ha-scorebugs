// "Box '94": after the first always-on score box, FOX's NFL coverage from August 1994 (and its NHL games from 1995). A small see-through
// green-tinted wafer in the top corner with a light outline: a rounded end holding the clock over the quarter, a slash, then a
// parallelogram with the two teams' letters and scores in two rows. Bold condensed type with a slight bevel. Nothing is drawn outside
// the outline. Surface: the plate is silver metal across the top row, with dark type, and a darker
// see-through green under it, with light type. Drawn soft, with scanlines, the way it looked on a 1994 TV (bug_tv: clean turns that off).
// Review: the round end holds a team's logo as a white silhouette on a glossy
// blue disc (the team with the ball, else the home team; in its own colours, since a white silhouette loses most logos), so the clock and the quarter move to a third column at the panel's right end;
// the silver row's letters are black heavy italic, the green row's tall narrow white letters with a hard dark shadow; a brighter shine
// band across the silver and a near-black green, as on air.
import { el, logo, statusText, FONTS } from '../kit.js';

const W = 520, H = 112;

// the plate is see-through on a broadcast; on a light page it needs to be nearly solid for its light text
const PLATE = { seeThrough: 0.55, onLight: 0.92 };

export default {
  id: 'box-94',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  tv: 'soft',
  fonts: [FONTS.archivo, FONTS.archivoItalic],
  css: `
.sb-box-94 { font-family: 'SB Archivo', 'Arial Narrow', sans-serif; font-weight: 800; font-stretch: 70%; color: #f2f4ef; }
.sb-box-94 .frame { position: absolute; inset: 0; pointer-events: none; }
.sb-box-94 .disc { position: absolute; left: 22px; top: 14px; width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(circle at 38% 30%, #7d8cff 0, #3346d6 38%, #1b2496 75%, #10165e); box-shadow: inset 0 0 0 3px rgba(255,255,255,.55), 0 2px 4px rgba(0,0,0,.5); }
.sb-box-94 .disc .sb-logo { width: 62px; height: 62px; object-fit: contain; filter: drop-shadow(0 1px 1px rgba(0,0,0,.5)); }   /* in its own colours: a white silhouette (as on air) turns most logos into a blob */
.sb-box-94 .col { position: absolute; top: 10px; display: grid; grid-template-rows: 46px 46px; align-items: center; font-size: 44px; line-height: 1; }
.sb-box-94 .row { display: flex; justify-content: space-between; width: 150px; letter-spacing: 1px; }
.sb-box-94 .top { color: #0d0f10; font-style: italic; font-weight: 900; text-shadow: 1px 1px 0 rgba(255,255,255,.5); }   /* black heavy italic on the silver */
.sb-box-94 .bot { color: #f4f6f1; font-stretch: 62%; text-shadow: 2px 2px 0 #050806, 0 0 3px rgba(0,0,0,.7); }   /* tall narrow white with a hard shadow */
.sb-box-94 .ck { width: 96px; justify-items: center; }
.sb-box-94 .ck .one { grid-row: 1 / 3; font-size: 32px; margin-left: -40px; color: #f4f6f1; font-style: normal; text-shadow: 2px 2px 0 #050806, 0 0 3px rgba(0,0,0,.8); }   /* white with a hard shadow reads on both halves */
`,
  draw(root, g, { time }) {
    // the outline is one SVG path per piece so the slash and the parallelogram share the look, like the original
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'frame'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('width', W); svg.setAttribute('height', H);
    // silver with a bright shine band over the top row, a dark edge at the step, near-black see-through green under it
    const dark = root.classList.contains('sb-ink-dark') ? PLATE.onLight : PLATE.seeThrough;
    svg.innerHTML = '<defs><linearGradient id="b94" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e6e1"/><stop offset=".1" stop-color="#ffffff"/>' +
      '<stop offset=".22" stop-color="#d6dad3"/><stop offset=".44" stop-color="#8f978d"/><stop offset=".5" stop-color="#3e463c"/>' +
      '<stop offset=".5" stop-color="rgb(22,46,26)" stop-opacity="' + dark + '"/><stop offset="1" stop-color="rgb(8,20,10)" stop-opacity="' + dark + '"/></linearGradient></defs>';
    const shape = (d) => { const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'url(#b94)'); p.setAttribute('stroke', '#d9ddd6'); p.setAttribute('stroke-width', '5'); p.setAttribute('stroke-linejoin', 'round'); return p; };
    svg.appendChild(shape('M 150 8 L 64 8 A 48 48 0 0 0 64 104 L 104 104 Z'));
    svg.appendChild(shape('M 168 8 L 512 8 L 460 104 L 116 104 Z'));
    // a thin slanted line before the clock column
    const ln = document.createElementNS(ns, 'path'); ln.setAttribute('d', 'M 402 12 L 352 100'); ln.setAttribute('stroke', 'rgba(20,24,20,.55)'); ln.setAttribute('stroke-width', '3');
    svg.appendChild(ln);
    root.appendChild(svg);
    // the round end: the team with the ball, else the home team
    const who = g.away.hasBall ? g.away : g.home;
    const disc = el('div', 'disc'); disc.appendChild(logo(who, 62)); root.appendChild(disc);
    const right = el('div', 'col');
    right.style.left = '176px';
    [g.away, g.home].forEach((t, i) => {
      const r = el('div', 'row ' + (i ? 'bot' : 'top'));
      r.style.marginLeft = (i ? -26 : 0) + 'px';
      // a three-figure score (basketball, a football shoot-out) gets the row 30 px longer, into the room before the slanted line, so it
      // keeps its size
      if (g.status !== 'pre' && [g.away.score, g.home.score].some((v) => v != null && v >= 100)) r.style.width = '180px';
      // before the game the team's record sits where its score will be
      const sc = el('span', 'scn', g.status === 'pre' ? t.record || '' : t.score != null ? String(t.score) : '');
      if (g.status === 'pre') { sc.style.whiteSpace = 'nowrap'; if ((t.record || '').length > 5) sc.style.fontSize = '.7em'; }   // a long record (10-14-1) never breaks
      if (g.status === 'pre') { sc.style.fontSize = '30px'; sc.style.alignSelf = 'center'; }
      r.append(el('span', '', (t.abbr || '').toUpperCase().slice(0, 3)), sc);
      right.appendChild(r);
    });
    const ck = el('div', 'col ck'); ck.style.left = '398px';
    if (g.status === 'live') {
      ck.append(el('span', 'top', g.clock || ''), el('span', 'bot', (g.period.label || '') + (g.period.suffix || '')));
      ck.lastChild.style.marginLeft = '-26px';
    } else if (g.status === 'final') {
      ck.append(el('span', 'top one', 'FINAL'));   // once, across both rows: no empty half
    } else {
      // the start time on one line across both rows, never broken ("9:11" over "PM")
      const w = el('span', 'top one w', statusText(g, time)); w.style.whiteSpace = 'nowrap'; ck.append(w);
    }
    ck.querySelectorAll('span').forEach((n) => { n.style.fontSize = n.classList.contains('one') ? '32px' : '34px'; });   // FINAL kept well inside the slanted end
    root.append(right, ck);
    // the kit sizes a three-figure score down when it does not fit, first while the face is still loading (a wider stand-in face) and
    // again once it has; the second pass starts from the first one's size, so a score that fits in the real face stayed small. Once
    // the faces are in, the scores go back to their own size before that second pass (this runs first: it was asked for first)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => root.querySelectorAll('.scn').forEach((n) => { if (n.style.getPropertyPriority('font-size')) n.style.removeProperty('font-size'); }), () => {});
  },
};
