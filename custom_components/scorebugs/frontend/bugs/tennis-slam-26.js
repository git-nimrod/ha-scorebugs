// "Slam box '26": after the tennis world-feed score boxes, each tournament in its own colours and layout, chosen by the event's name
// (frames: Australian Open 2026 final, Roland Garros 2025 final, Wimbledon, the US Open, the WTA Finals and the Billie Jean King Cup).
// Two rows, one per player, with the games of each set in a column, and the round on a tag beside the box (with the tournament's logo
// when its address is known).
//   Melbourne        navy, see-through, the flag and surname with the seed after it, the set being played in yellow, a cyan edge
//   Roland Garros    green, the surname alone, sets won in white and lost sets faded, the set being played on a brighter column
//   Wimbledon        green with purple set cells
//   US Open          deep blue, the seed before the surname and the country's letters after it, sets won in yellow, a yellow tag
//   WTA/ATP Finals   dark green with teal
//   otherwise        the cup's bright blue
// The point score and the server's mark need data the sensor lacks.
import { el, logo, eventLogo, fit, shortName } from '../kit.js';

const PRE_CUT = 160;
const W = 640, ROW = 62, H = 2 * ROW + 36;   // room under the rows for the event tab, which hangs below them
const BASE = { bg: '#1554c4', ink: '#fff', set: 'transparent', cur: '#fff', edge: '#7cc0ff', curBg: '#2b6fe0', win: null, lose: null, flag: true, seedFirst: false, country: false, tagBg: null, tagInk: '#fff' };
const THEMES = [
  // Australian Open: the cyan edge down the LEFT side, each finished set's winning games in lime, the loser's
  // in a soft grey
  [/australian open/i, { bg: 'rgba(12,30,70,.9)', cur: '#ffd400', edge: '#2fc6f2', curBg: 'transparent', win: '#d6f03a', lose: '#cfd3dd', edgeLeft: true }],
  [/roland|french open/i, { bg: '#1d6b46', edge: '#1d6b46', curBg: '#2f9b62', win: '#ffffff', lose: 'rgba(170,220,190,.55)', flag: false }],
  [/wimbledon/i, { bg: '#00573f', set: '#5b2a86', edge: '#ffffff', curBg: '#7a3bb0' }],
  [/us open/i, { bg: 'linear-gradient(rgba(0,0,0,0) 55%, rgba(0,0,12,.1)), linear-gradient(rgba(110,130,255,0) 48%, rgba(110,130,255,.35) 49.5%, rgba(110,130,255,0) 51.5%), linear-gradient(90deg, rgba(42,110,208,.35), #2a6bd0 60%) top / 100% 6px no-repeat, linear-gradient(90deg, #070d27, #0d1237 20%, #171a52 48%, #1b2066 80%, #1d2470)',   // the still (US Open 2024): near-black navy on the left to indigo on the right, a bright blue line along the top and a faint line between the rows
    edge: '#0d2f78', curBg: 'transparent', win: '#ffd23f', lose: '#ffffff', flag: false, seedFirst: true, country: true, tagBg: '#ffcc29', tagInk: '#0b1f4d' }],
  [/wta finals|atp finals/i, { bg: '#123a33', edge: '#1fcf9a', curBg: '#1aa37a' }],
  [/.*/, {}],
];

export default {
  id: 'tennis-slam-26',
  size: { w: W, h: H },
  // before the match there are no games: the set columns go and the box is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - PRE_CUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -32% vs the broadcast, logos -22%; 80 % of the correction
  logoScale: 1.226,
  fonts: [{ family: 'SB Montserrat Heavy', file: 'montserrat-latin-wght-normal.woff2', desc: { weight: '600 900' } }],
  css: `
.sb-tennis-slam-26 { font-family: 'SB Montserrat Heavy', 'Montserrat', Arial, sans-serif; font-weight: 800; }
.sb-tennis-slam-26 .bx { position: absolute; left: 0; top: 0; width: ${W}px; height: ${2 * ROW + 6}px; border-radius: 8px; overflow: hidden; box-shadow: 0 3px 8px rgba(0,0,0,.45); border-right: 6px solid var(--edge); box-sizing: border-box; }
.sb-tennis-slam-26.edge-l .bx { border-right: 0; border-left: 6px solid var(--edge); }
.sb-tennis-slam-26 .rw { position: absolute; left: 0; right: 0; height: ${ROW}px; display: flex; align-items: center; }
.sb-tennis-slam-26 .rw .sb-logo { width: 46px; height: 32px; object-fit: cover; margin: 0 14px 0 16px; }
.sb-tennis-slam-26 .rw .sd { width: 36px; text-align: center; font-size: 22px; margin-left: 10px; }
.sb-tennis-slam-26 .rw .nm { flex: 1; font-size: 32px; letter-spacing: .5px; white-space: nowrap; overflow: hidden; padding-left: 16px; }
.sb-tennis-slam-26 .rw .sb-logo + .nm, .sb-tennis-slam-26 .rw .sd + .nm { padding-left: 4px; }
.sb-tennis-slam-26 .rw .nm small { font-size: 17px; opacity: .85; margin-left: 8px; font-weight: 600; }
.sb-tennis-slam-26 .rw .ss { display: flex; height: 100%; } .sb-tennis-slam-26 .rw .ss span { width: 52px; display: grid; place-items: center; font-size: 34px; }
.sb-tennis-slam-26 .rw .ss span sup { font-size: 15px; margin-left: 2px; }
/* the tiebreak figure small and raised beside the games, never under them */
.sb-tennis-slam-26 .rw .ss span { display: flex; align-items: center; justify-content: center; } .sb-tennis-slam-26 .rw .ss span sup { align-self: flex-start; margin-top: 11px; line-height: 1; }
/* a long surname is squeezed into its room with the seed beside it */
.sb-tennis-slam-26 .rw .nm { min-width: 0; }
.sb-tennis-slam-26 .rw.win .nm::after { content: ' ✓'; font-size: 22px; }
.sb-tennis-slam-26 .tag { position: absolute; left: 10px; top: ${2 * ROW + 6}px; font-size: 18px; letter-spacing: 1px; padding: 2px 10px; border-radius: 0 0 6px 6px; }
.sb-tennis-slam-26 .tag.top { top: auto; bottom: ${H}px; border-radius: 4px 4px 0 0; }
`,
  draw(root, g, { opts }) {
    const th = { ...BASE, ...THEMES.find(([re]) => re.test(g.event || ''))[1] };
    root.style.setProperty('--edge', th.edge);
    if (th.edgeLeft) root.classList.add('edge-l');
    const bx = el('div', 'bx'); bx.style.background = th.bg; bx.style.color = th.ink;
    const players = [g.away, g.home];
    const pre = g.status === 'pre';
    const sets = pre ? 0 : Math.max((g.away.sets || []).length, (g.home.sets || []).length, 1);
    if (pre) bx.style.width = (W - PRE_CUT) + 'px';
    const cur = g.status === 'live' ? sets - 1 : -1;
    players.forEach((t, i) => {
      const other = players[1 - i];
      const rw = el('div', 'rw' + (g.status === 'final' && t.winner ? ' win' : ''));
      rw.style.top = (3 + i * ROW) + 'px';
      if (th.flag) rw.appendChild(logo(t, 46));
      if (th.seedFirst) rw.appendChild(el('span', 'sd', t.rank ? String(t.rank) : ''));
      const nm = fit(el('span', 'nm', (t.abbr || '').toUpperCase()), shortName((t.abbr || '').toUpperCase()));
      const code = (/\/countries\/500\/([a-z]{3})\.png/.exec(t.logo || '') || [])[1];
      if (th.country && code) nm.appendChild(el('small', '', code.toUpperCase()));
      else if (!th.seedFirst && t.rank) nm.appendChild(el('small', '', '(' + t.rank + ')'));
      rw.appendChild(nm);
      const ss = el('span', 'ss');
      for (let k = 0; k < sets; k++) {
        const v = (t.sets || [])[k], o = (other.sets || [])[k];
        const c = el('span', '', v == null ? '' : String(v));
        const tb = (t.tiebreaks || [])[k];
        if (tb != null && tb !== '') c.appendChild(el('sup', '', String(tb)));
        c.style.background = k === cur ? th.curBg : th.set;
        // a finished set: the winner's games in the tournament's colour for a won set
        if (k !== cur && th.win && v != null && o != null) c.style.color = v > o ? th.win : th.lose;
        if (k === cur) c.style.color = th.cur;
        ss.appendChild(c);
      }
      rw.appendChild(ss);
      bx.appendChild(rw);
    });
    root.appendChild(bx);
    // the round on a tag under the box (yellow at the US Open, like its "CHAMPIONSHIP POINT" tag), with the tournament's logo when known
    const lg = eventLogo(g, 26, opts);
    if (g.note || lg) {
      const tag = el('span', 'tag');
      if (lg) { lg.style.verticalAlign = 'middle'; lg.style.marginRight = '8px'; tag.appendChild(lg); }
      tag.appendChild(document.createTextNode(String(g.note || '').toUpperCase()));
      tag.style.background = th.tagBg || th.bg; tag.style.color = th.tagInk;
      root.appendChild(tag);
    }
  },
};
