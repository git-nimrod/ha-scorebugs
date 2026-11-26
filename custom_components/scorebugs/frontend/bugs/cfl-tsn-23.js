// "Pale strip '23": after the Canadian sports network's CFL bar of the early 2020s. A white strip along the foot of the picture holding a row of flat cells parted by thin white gaps: the network's tile in
// grey (here the Home Assistant logo), then each team as a panel of its colour (logo, letters with the timeout bars under them) with its
// score on a deeper cell of the same colour, the quarter and the clock on white with a small grey arrow between them, and while a team
// has the ball its down on its colour, pointing at the spot on a pale cell edged in that colour ("2nd & 10" > "EDM 40").
// measured (crop px of 1176 x 50): white rim 2-3 px all round, cells y 3-47; network 0-128, team 137-305 + score 306-368, team
// 379-546 + score 548-611, quarter 612-711, clock 715-850, down 853-1011 (point 4 px deep), spot 1013-1171; gaps 4 px white; letters
// capitals 25 px (0.5 of the bar), scores 30, quarter and clock 25, down 26; logos about 60 x 40 at the left of each panel; timeout bars
// 23 x 3 px, 11 apart, under the letters, in a pale tint of the team colour. A light team colour keeps its score cell light with dark
// figures (Elks gold #e5bb16 under #ecc93d), a dark one deepens it (Lions #cd391f over #641902). Every cell flat (sample.py: within 3 L
// top to foot), square corners.
import { el, logo, ordinal, pips, fit, statusText, teamColor, teamInk, inkOn, relight, haMark, marks, abbr3, scoreSlot, setSrc, badge, FONTS } from '../kit.js';

const K = 1280 / 1176, P = (x) => Math.round(x * K);
const H = P(50), NET = P(129), TEAM = P(169), SC = P(63), PER = P(100), CK = P(136), DN = P(159), SP = P(159), GAP = P(4);
const W = GAP + NET + GAP + TEAM + SC + GAP + TEAM + SC + GAP + PER + GAP + CK + GAP;
const DOWN = DN + 2 + SP + GAP;

// the CFL's logos come from the league feed; the kit draws ESPN's only for now, so this
// bug loads the feed's own address itself and keeps the letters badge if it fails
const feedLogo = (t, px) => {
  const im = logo(t, px);
  if (/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(t.logo || '')) setSrc(im, t.logo, () => { im.src = badge(t); });
  return im;
};

export default {
  id: 'cfl-tsn-23',
  size: { w: W + DOWN, h: H },
  // the down and spot cells only while a team has the ball: without them the strip ends at the clock
  sizeFor: (g) => ({ w: W + (g.status === 'live' && g.football && g.football.short ? DOWN : 0), h: H }),
  fonts: [FONTS.montserrat],
  css: `
.sb-cfl-tsn-23 { font-family: 'SB Montserrat', Arial, sans-serif; font-weight: 700; color: #111; }
.sb-cfl-tsn-23 .bar { position: absolute; inset: 0; background: #fcfdf8; display: flex; align-items: stretch; padding: ${P(3)}px ${GAP}px; gap: ${GAP}px; box-sizing: border-box; }
.sb-cfl-tsn-23 .net { flex: 0 0 ${NET}px; background: #5d6769; display: grid; place-items: center; }
.sb-cfl-tsn-23 .net .sb-ha { color: #f5fdfd; }
.sb-cfl-tsn-23 .tm { flex: 0 0 ${TEAM + SC}px; display: flex; }
.sb-cfl-tsn-23 .tm .pn { flex: 0 0 ${TEAM}px; position: relative; }
.sb-cfl-tsn-23 .tm .sb-logo { position: absolute; left: ${P(8)}px; top: ${P(1)}px; width: ${P(64)}px; height: ${P(42)}px; object-fit: contain; }
/* the letters centred (ink, both ways) in the room right of the logo, never under it */
.sb-cfl-tsn-23 .tm .ab { position: absolute; left: ${P(76)}px; right: ${P(6)}px; white-space: nowrap; overflow: hidden; top: 0; bottom: ${P(5)}px; display: grid; place-items: center; font-size: ${P(25 / 0.7)}px; line-height: 1; letter-spacing: 0; }
.sb-cfl-tsn-23 .sb-pips { position: absolute; left: ${P(76)}px; right: ${P(6)}px; bottom: ${P(1)}px; display: flex; justify-content: center; gap: ${P(11)}px; }
.sb-cfl-tsn-23 .sb-pips i { width: ${P(23)}px; height: ${P(3)}px; background: var(--pip); }
.sb-cfl-tsn-23 .sb-pips i.used { opacity: .25; }
.sb-cfl-tsn-23 .tm .sc { flex: 0 0 ${SC}px; display: grid; place-items: center; font-size: ${P(30 / 0.7)}px; font-weight: 800; line-height: 1; min-width: 0 !important; }
.sb-cfl-tsn-23 .tm .sc.sb-pre-rec { font-weight: 700; }
.sb-cfl-tsn-23 .pd { flex: 0 0 ${PER}px; display: flex; align-items: center; justify-content: center; font-size: ${P(25 / 0.7)}px; line-height: 1; }
.sb-cfl-tsn-23 .pd .sb-ord { font-size: 1em; text-transform: lowercase; }
.sb-cfl-tsn-23 .ck { flex: 0 0 ${CK}px; display: grid; place-items: center; font-size: ${P(25 / 0.7)}px; line-height: 1; position: relative; margin-left: -${GAP}px; }
.sb-cfl-tsn-23 .ck::before { content: ''; position: absolute; left: 0; top: 50%; width: ${P(6)}px; height: ${P(14)}px; margin-top: -${P(7)}px; background: #474744; clip-path: polygon(0 0, 100% 50%, 0 100%); }
.sb-cfl-tsn-23 .w { flex: 0 0 ${PER + GAP + CK}px; display: grid; place-items: center; font-size: ${P(23 / 0.7)}px; line-height: 1; white-space: nowrap; }
.sb-cfl-tsn-23 .dn { flex: 0 0 ${DN}px; min-width: 0; overflow: hidden; display: grid; place-items: center; font-size: ${P(24 / 0.7)}px; line-height: 1; white-space: nowrap; clip-path: polygon(0 0, calc(100% - ${P(4)}px) 0, 100% 50%, calc(100% - ${P(4)}px) 100%, 0 100%); position: relative; z-index: 1;
  box-sizing: border-box; padding: 0 ${P(10)}px 0 ${P(6)}px; font-weight: 600; }
/* the down and the spot keep about 10 px of room each side of the point (2023 still: "2nd & 10" > "EDM 40", 9-11 crop px clear),
 in the still's lighter weight, and squeeze to fit before they could run into each other */
.sb-cfl-tsn-23 .sp { flex: 0 0 ${SP}px; min-width: 0; overflow: hidden; display: grid; place-items: center; font-size: ${P(23.5 / 0.7)}px; line-height: 1; white-space: nowrap; background: #fcfdf7; margin-left: -${GAP + 2}px; box-sizing: border-box; padding: 0 ${P(6)}px 0 ${P(12)}px; font-weight: 600; box-shadow: inset 0 ${P(2)}px 0 var(--edge), inset 0 -${P(2)}px 0 var(--edge), inset -${P(2)}px 0 0 var(--edge); }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts), live = g.status === 'live', pre = g.status === 'pre';
    const bar = el('div', 'bar');
    const net = el('div', 'net');
    if (mk.ha) net.appendChild(haMark(P(30)));
    bar.appendChild(net);
    [g.away, g.home].forEach((t) => {
      const c = teamColor(t, '#5d6769'), ink = teamInk(c), light = inkOn(c) !== '#fff';
      const tm = el('div', 'tm'), pn = el('div', 'pn');
      pn.style.background = c; pn.style.color = ink;
      pn.style.setProperty('--pip', relight(c, light ? 22 : 45));
      pn.append(feedLogo(t, P(64)), fit(el('div', 'ab', abbr3(t))));
      if (g.sport === 'football' && live) pn.appendChild(pips(t.timeouts, g.league === 'CFL' ? 2 : 3));
      // the score on a deeper cell of the team's colour: a light colour stays light with dark figures, a dark one goes darker
      const sc = scoreSlot(el('div', 'sc', !pre && t.score != null ? String(t.score) : ''), g);
      const sb = light ? relight(c, -4) : relight(c, -24);
      sc.style.background = sb; sc.style.color = teamInk(sb);
      tm.append(pn, sc);
      bar.appendChild(tm);
    });
    if (live) {
      bar.appendChild(ordinal(g.period, 'pd'));
      bar.appendChild(el('div', 'ck', g.clock || ''));
    } else bar.appendChild(el('div', 'w', statusText(g, time)));
    const f = g.football, ball = live && f && f.short ? (g.away.hasBall ? g.away : g.home.hasBall ? g.home : null) : null;
    if (live && f && f.short) {
      const c = ball ? teamColor(ball, '#5d6769') : '#5d6769';
      const dn = el('div', 'dn', (/goal/i.test(f.text) ? f.short.replace(/&\s*\S+$/, '& Goal') : f.short).replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()));
      dn.style.background = c; dn.style.color = teamInk(c);
      const spot = /\bat\s+([A-Z]{1,4}\s*\d{1,2})\b/i.exec(f.text || '');
      const sp = el('div', 'sp', spot ? spot[1].toUpperCase() : '');
      sp.style.setProperty('--edge', c);
      bar.append(fit(dn), fit(sp));
    }
    root.appendChild(bar);
  },
};
