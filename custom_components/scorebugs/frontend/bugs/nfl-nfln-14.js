// "Network bar '14": after NFL Network's Thursday night bug (2014). A
// bar of blocks: the network's mark on navy at the left (here the Home Assistant logo), then each team on a block of its colour (its
// logo at the left, its record small before its letters, timeouts as white dashes under them, an arrow after the letters of the team with
// the ball) and its score in a deeper block of that colour; the quarter and the clock dark on a white block, and the down and distance on
// a block of the colour of the team with the ball, an arrow before it. The play clock needs data the sensor lacks.
import { el, logo, statusText, teamColor, shade, inkOn, haMark, marks, scoreSlot, pips, fit, FONTS, GLOSS } from '../kit.js';

const H = 68, MARK = 220, TEAM = 330, SC = 96, CLK = 300, DOWN = 330, GAP = 4;
const W = MARK + 2 * (TEAM + SC) + CLK + DOWN + 6 * GAP;

export default {
  id: 'nfl-nfln-14',
  size: { w: W, h: H },
  sizeFor: (g) => ({ w: g.status === 'live' && g.football && g.football.short ? W : W - DOWN - GAP, h: H }),
  fonts: [FONTS.barlowSemi700i],
  css: `
.sb-nfl-nfln-14 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 700; font-style: italic; color: #fff; }
.sb-nfl-nfln-14 .bar { position: absolute; inset: 0; display: flex; gap: ${GAP}px; filter: drop-shadow(0 3px 5px rgba(0,0,0,.5)); }
.sb-nfl-nfln-14 .bar > * { flex: none; height: 100%; display: flex; align-items: center; box-sizing: border-box; position: relative; }
.sb-nfl-nfln-14 .mk { width: ${MARK}px; justify-content: center; background: ${GLOSS}, linear-gradient(#1d3054, #0e1b36); } .sb-nfl-nfln-14 .mk .sb-ha { color: #fff; }
.sb-nfl-nfln-14 .tm { width: ${TEAM}px; padding-right: 18px; gap: 10px; }
.sb-nfl-nfln-14 .tm .sb-logo { width: 92px; height: 60px; object-fit: contain; margin-left: 8px; filter: drop-shadow(0 2px 3px rgba(0,0,0,.45)); }
.sb-nfl-nfln-14 .tx { flex: 1; min-width: 0; display: grid; justify-items: end; gap: 6px; }
.sb-nfl-nfln-14 .nm { max-width: 100%; display: flex; align-items: baseline; gap: 10px; font-size: 48px; line-height: 1; white-space: nowrap; text-shadow: 0 2px 2px rgba(0,0,0,.4); }
.sb-nfl-nfln-14 .nm .rec { font-size: 22px; opacity: .9; flex: none; } .sb-nfl-nfln-14 .nm .ab { overflow: hidden; }
.sb-nfl-nfln-14 .nm .ar { width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 12px solid currentColor; align-self: center; }
.sb-nfl-nfln-14 .to { display: flex; gap: 8px; } .sb-nfl-nfln-14 .to i { width: 30px; height: 4px; background: currentColor; } .sb-nfl-nfln-14 .to i.used { opacity: .25; }
.sb-nfl-nfln-14 .sc { width: ${SC}px; justify-content: center; font-size: 52px; line-height: 1; }
.sb-nfl-nfln-14 .sc.pre { font-size: 30px; }
.sb-nfl-nfln-14 .clk { width: ${CLK}px; justify-content: space-around; background: linear-gradient(#ffffff, #dfe3e8); color: #15181d; font-size: 46px; line-height: 1; font-style: normal; }
.sb-nfl-nfln-14 .clk .sb-ord { font-size: .7em; }
.sb-nfl-nfln-14 .dn { width: ${DOWN}px; justify-content: center; gap: 16px; font-size: 40px; line-height: 1; }
.sb-nfl-nfln-14 .dn .ar { width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 12px solid currentColor; }
.sb-nfl-nfln-14 .dn .sb-ord { font-size: .7em; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bar = el('div', 'bar');
    const mk = el('div', 'mk'); if (marks(opts).ha) mk.appendChild(haMark(44)); bar.appendChild(mk);
    let ballC = null;
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#3a3f47'), ink = inkOn(c) === '#111' ? shade(c, -0.8) : '#fff';
      if (live && t.hasBall) ballC = c;
      const tm = el('div', 'tm');
      tm.style.background = GLOSS + ', linear-gradient(' + shade(c, 0.08) + ', ' + shade(c, -0.12) + ')'; tm.style.color = ink;
      const tx = el('div', 'tx');
      const nm = el('span', 'nm');
      if (t.record && g.status !== 'pre') nm.appendChild(el('span', 'rec', t.record));
      nm.appendChild(fit(el('span', 'ab', (t.abbr || '').toUpperCase())));
      if (live && t.hasBall) nm.appendChild(el('i', 'ar'));
      tx.appendChild(nm);
      if (live && t.timeouts != null) tx.appendChild(pips(t.timeouts, 3, 'to'));
      tm.append(logo(t, 96), tx);
      // before the kick-off the score block holds the record
      const sc = g.status === 'pre' ? el('div', 'sc pre', t.record || '') : scoreSlot(el('div', 'sc', t.score != null ? String(t.score) : ''), g);
      sc.style.background = GLOSS + ', linear-gradient(' + shade(c, -0.25) + ', ' + shade(c, -0.42) + ')'; sc.style.color = inkOn(shade(c, -0.3)) === '#111' ? '#111' : '#fff';
      bar.append(tm, sc);
    });
    const clk = el('div', 'clk');
    if (live) { const q = el('span', ''); q.appendChild(document.createTextNode(g.period.label || '')); if (g.period.suffix) q.appendChild(el('span', 'sb-ord', g.period.suffix.toUpperCase())); clk.append(q, el('span', '', g.clock || '')); }
    else clk.appendChild(el('span', '', statusText(g, time)));
    bar.appendChild(clk);
    if (live && g.football && g.football.short) {
      const c = ballC || '#26365a';
      const dn = el('div', 'dn'); dn.style.background = GLOSS + ', linear-gradient(' + shade(c, 0.08) + ', ' + shade(c, -0.12) + ')'; dn.style.color = inkOn(c) === '#111' ? shade(c, -0.8) : '#fff';
      const m = /^(\d)(ST|ND|RD|TH)(.*)$/.exec(g.football.short);
      const tx = el('span', ''); if (m) tx.append(document.createTextNode(m[1]), el('span', 'sb-ord', m[2]), document.createTextNode(m[3])); else tx.textContent = g.football.short;
      tx.style.whiteSpace = 'pre';
      dn.append(el('i', 'ar'), tx);
      bar.appendChild(dn);
    }
    root.appendChild(bar);
  },
};
