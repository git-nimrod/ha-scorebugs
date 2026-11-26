// "Three panel '21": after the Australian pay-TV test cricket bar (2021; frame: India batting, 3-194 after 70.2 overs, chasing on the
// last day). Three panels across the bottom: the batting side in its colour (its logo, "IND 3-194", "OVERS 70.2"), a pale grey middle in
// two lines (the batters above, the state of the game below in the side's blue letters), and the bowling side in its colour at the right
// with its logo.
// measured: panels 33.5 %, 38.5 % and 28 % of the width; the
// batting panel #2a4e98 fading to #142850 at its right end, a faint light line along its top; middle #edf0f0 over #dfe3e2 with a darker
// foot, split at 41 %; bowling panel #0a5b20 at its left fading to #032802; capitals 16 % of the height, letters a semi-condensed sans.
// Left out: the batters' and bowler's figures and the over's balls (no data); the middle carries the note and the run rate, and the
// bowling panel that side's score.
import { el, fit, logo, statusText, cricketState, cricketScore, teamColor, shade, relight, FONTS } from '../kit.js';

const W = 1400, H = 100;

export default {
  id: 'cricket-fox-21',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi600, FONTS.barlowSemi700],
  css: `
.sb-cricket-fox-21 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-fox-21 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-fox-21 *, .sb-cricket-fox-21 *::before { box-sizing: border-box; }
.sb-cricket-fox-21 .bar { position: absolute; inset: 0; display: flex; }
.sb-cricket-fox-21 .bat { width: 469px; display: flex; align-items: center; gap: 16px; padding-left: 52px; box-shadow: inset 0 2px 0 rgba(170,200,255,.35); }
.sb-cricket-fox-21 .bat .sb-logo, .sb-cricket-fox-21 .bowl .sb-logo { width: 66px; height: 66px; object-fit: contain; }
.sb-cricket-fox-21 .bat .sc { font-size: 31px; white-space: nowrap; }
.sb-cricket-fox-21 .bat .ov { font-size: 22px; margin-left: auto; padding-right: 40px; white-space: nowrap; }
.sb-cricket-fox-21 .mid { width: 539px; display: grid; grid-template-rows: 41px 1fr; color: #2a4fa0; font-weight: 600; }
.sb-cricket-fox-21 .mid .a { background: linear-gradient(#eeefef, #f0f0f0 55%, #e8eceb 80%, #dfe3e2); display: flex; align-items: center; justify-content: center; gap: 36px; font-size: 22px; border-bottom: 2px solid #c3c8c8; padding: 0 18px; white-space: nowrap; }
.sb-cricket-fox-21 .mid .b { background: linear-gradient(#dde1e0, #dfe3e2 70%, #d0d4d3 88%, #bbbfbe); display: flex; align-items: center; justify-content: center; font-size: 24px; padding: 0 18px; box-shadow: inset 0 1px 0 #fff; }
.sb-cricket-fox-21 .mid b { font-weight: 700; }
.sb-cricket-fox-21 .bowl { flex: 1; min-width: 0; display: flex; align-items: center; gap: 24px; padding: 0 30px 0 24px; }
.sb-cricket-fox-21 .bowl .ln { flex: 1; min-width: 0; display: flex; justify-content: space-between; align-items: baseline; align-self: start; padding-top: 14px; font-size: 24px; white-space: nowrap; gap: 16px; }
`,
  draw(root, g, { time }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase();
    const side = g.status === 'pre' ? g.home : c.bat, other = side === g.home ? g.away : g.home;
    const cb = teamColor(side, '#2a4e98'), cw = teamColor(other, '#0a5b20');
    const bar = el('div', 'bar'), bat = el('div', 'bat'), mid = el('div', 'mid'), bowl = el('div', 'bowl');
    // the side's colour, lit a touch at the top, fading to near black at the panel's right end (sampled: #2a4e98 to #142850)
    bat.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) 55%, ' + shade(cb, -0.5) + '), linear-gradient(' + relight(cb, 3) + ', ' + cb + ' 60%, ' + relight(cb, -3) + ')';
    bowl.style.background = 'linear-gradient(90deg, rgba(0,0,0,0) 30%, ' + shade(cw, -0.55) + ' 75%), linear-gradient(' + relight(cw, 4) + ', ' + cw + ')';
    const a = el('div', 'a'), b = el('div', 'b');
    if (g.status === 'pre') {
      bat.append(logo(side, 66), el('span', 'sc', ab(side) + ' v ' + ab(other)));
      if (g.note) a.appendChild(fit(el('span', '', g.note.toUpperCase())));
      b.appendChild(fit(el('span', '', statusText(g, time))));
      const ln = el('div', 'ln'); ln.appendChild(fit(el('span', 'nm', (other.longName || other.name || '').toUpperCase()))); bowl.append(ln, logo(other, 66));
    } else {
      // the Australian order: wickets-runs ("3-194")
      const runs = cricketScore(side, '-', true);
      bat.append(logo(side, 66), el('span', 'sc', ab(side) + ' ' + runs));
      if (c.overs) bat.appendChild(el('span', 'ov', 'OVERS ' + c.overs));
      if (g.note) a.appendChild(el('span', '', g.note.toUpperCase()));
      if (c.rate != null) { const r = el('span', '', 'RUN RATE '); r.appendChild(el('b', '', c.rate.toFixed(2))); a.appendChild(r); }
      const who = (side.longName || side.name || ab(side)).toUpperCase();
      let line = '';
      if (c.result) line = c.result.text;
      else if (c.need != null) line = who + ' NEEDS ' + c.need + ' MORE ' + (c.need === 1 ? 'RUN' : 'RUNS') + ' TO WIN';
      else if (c.lead != null) line = c.lead > 0 ? who + ' LEAD BY ' + c.lead + ' RUNS' : c.lead < 0 ? who + ' TRAIL BY ' + -c.lead + ' RUNS' : 'SCORES LEVEL';
      else if (g.lastPlay && !/\b(won|beat)\b/i.test(g.lastPlay)) line = g.lastPlay.toUpperCase();
      b.appendChild(fit(el('span', '', line)));
      const ln = el('div', 'ln'); ln.append(el('span', 'nm', ab(other)), el('span', 'sc', cricketScore(other))); bowl.append(ln, logo(other, 66));
    }
    mid.append(a, b);
    bar.append(bat, mid, bowl);
    root.appendChild(bar);
  },
};
