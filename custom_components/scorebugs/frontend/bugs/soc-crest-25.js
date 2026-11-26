// "Crest tags '25": after the Premier League's own world-feed bug (2025-26; frame: a Bayern-Bournemouth friendly in the league's graphics,
// shown as MUN v BOU). Two tags in the teams' colours with the letters (the away team's in its second colour), each cut on a slant by a
// black stripe that leans into the middle; between them the two scores stand free, big and white, either side of the league's lion,
// which rises above the bar; under them a deep purple plate with the match clock (MM:SS). Rounded geometric type (Montserrat).
import { el, soccerClock, homeFirst, leagueLogo, marks, teamColor, shade, accentOn, FONTS, teamInk, withRecord, fit } from '../kit.js';

const W = 620, H = 140, TAG = 236, TT = 24, TH = 54, MID = W / 2, SHUT = 60;   // SHUT: what each side gives up before the game
// measured against the frame, frame size / mine: Man Utd v Bournemouth
const TYPE = { letters: 1.14, clock: 1.08 };


// the team letters' width to the frame's
const LETTERS = { track: 4 };

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [  // the tags' old shifts dropped: they set the two tags at different heights
  // (the clock plate's old 7.5 px drop removed: its text ran out of the purple)
];

export default {
  id: 'soc-crest-25',
  size: { w: W, h: H },
  // before the kick-off there are no scores: both tags close up on the lion and the bar is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - 2 * SHUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -22% vs the broadcast; 80 % of the correction
  typeScale: 1.222,
  nudge: NUDGE,
  fonts: [FONTS.montserrat],
  css: `
.sb-soc-crest-25 { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 800; color: #fff; }
.sb-soc-crest-25 .tag { position: absolute; top: ${TT}px; width: ${TAG}px; height: ${TH}px; display: grid; grid-auto-flow: column; place-content: center; align-items: center; white-space: nowrap; font-size: ${40 * TYPE.letters}px; line-height: 1; letter-spacing: .5px; }
/* each tag's outer end rounded, its inner end a chevron, as on air */
.sb-soc-crest-25 .tag.h { left: 0; clip-path: path('M 16 0 L ${TAG - 26} 0 L ${TAG} ${TH / 2} L ${TAG - 26} ${TH} L 16 ${TH} A 16 16 0 0 1 0 ${TH - 16} L 0 16 A 16 16 0 0 1 16 0 Z');   /* ends in a chevron (surface pass, frame) */ padding-right: 26px; box-sizing: border-box; }
.sb-soc-crest-25 .tag.a { right: 0; clip-path: path('M 26 0 L ${TAG - 16} 0 A 16 16 0 0 1 ${TAG} 16 L ${TAG} ${TH - 16} A 16 16 0 0 1 ${TAG - 16} ${TH} L 26 ${TH} L 0 ${TH / 2} Z'); padding-left: 26px; box-sizing: border-box; }
/* the black stripes: a slanted band against each tag, both leaning the same way, as on air */
.sb-soc-crest-25 .jag { position: absolute; top: ${TT}px; height: ${TH}px; background: #0a0a0c; }
.sb-soc-crest-25 .jag.h { left: ${TAG - 30}px; right: ${MID}px; clip-path: polygon(0 0, 100% 0, 100% 100%, 26px 100%); }
.sb-soc-crest-25 .jag.a { left: ${MID}px; right: ${TAG - 30}px; clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 100%, 0 100%); }
/* the figures stand on the bar's foot and rise above it by about a fifth of its height, as on air (they were a third bigger and ran down
 into the clock plate); 75 px times the audit's typeScale */
.sb-soc-crest-25 .sc { position: absolute; top: ${TT - 24}px; width: 80px; text-align: center; font-size: 75px; line-height: 1; text-shadow: 0 3px 4px rgba(0,0,0,.45); z-index: 3; }
.sb-soc-crest-25 .lion::before { content: ''; position: absolute; left: 26px; top: 16px; width: 56px; height: 59px; border-radius: 50% 50% 45% 45%; background: #fff; }
.sb-soc-crest-25 .lion .sb-league { position: relative; }
.sb-soc-crest-25 .sc.h { left: ${MID - 122}px; } .sb-soc-crest-25 .sc.a { left: ${MID + 42}px; }
/* a two-figure score keeps its inner edge where a one-figure score's ink ends, beside the lion, and grows outwards, a little narrower; that team's letters move 24 px outwards to leave it room.
 Before kick-off the closed-up bar puts the lion over the tags' inner ends: the letters and record keep out of it the same way and are
 squeezed to what is left */
.sb-soc-crest-25 .sc.w { width: 120px; }
.sb-soc-crest-25 .sc.h.w { left: ${MID - 52 - 120}px; text-align: right; transform: scaleX(.84); transform-origin: right center; }
.sb-soc-crest-25 .sc.a.w { left: ${MID + 52}px; text-align: left; transform: scaleX(.84); transform-origin: left center; }
.sb-soc-crest-25 .tag.h.w { padding-right: 50px; } .sb-soc-crest-25 .tag.a.w { padding-left: 50px; }
/* the lion about 1.5 times the bar's height, rising above it and dipping into the clock plate, as on air (Nov 23 sweep; it was 1.2) */
.sb-soc-crest-25 .lion { position: absolute; left: ${MID - 54}px; top: 4px; width: 108px; height: 82px; overflow: hidden; z-index: 2; }
.sb-soc-crest-25 .lion .sb-league { width: 108px; height: 134px; object-fit: cover !important; object-position: 50% 0; filter: drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1.5px #fff) drop-shadow(0 2px 3px rgba(0,0,0,.4)); }
.sb-soc-crest-25 .clk { position: absolute; left: ${MID - 98}px; width: 196px; top: ${TT + TH}px; height: 52px; background: #37003c; border-radius: 0 0 12px 12px; display: grid; place-items: center;
  font-size: ${30 * TYPE.clock}px; line-height: 1; font-weight: 700; color: #f6e7f7; font-variant-numeric: tabular-nums; z-index: 1; padding: 0 16px; box-sizing: border-box; white-space: nowrap; overflow: hidden; }   /* the time inside the purple plate, never spilling */   /* a start time kept off the plate's edges */
.sb-soc-crest-25 .tag { letter-spacing: ${LETTERS.track}px; } .sb-soc-crest-25 .tag .sb-rec { font-size: .42em; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const [h, a] = homeFirst(g);
    const pre = g.status === 'pre', mid = pre ? MID - SHUT : MID;   // the middle of the closed-up bar before the game
    [[h, 'h'], [a, 'a']].forEach(([t, k]) => {
      const c = teamColor(t, '#3a3f47');
      const tag = fit(withRecord(el('div', 'tag ' + k + (pre || String(t.score ?? '').length > 1 ? ' w' : ''), (t.abbr || '').toUpperCase()), t, g, k !== 'h'));  // the record beside the letters before kick-off
      // each bar shades along its length, lighter at its outer end, deeper towards the score (frame)
      tag.style.background = 'linear-gradient(rgba(255,255,255,.12), rgba(0,0,0,.1)), linear-gradient(' + (k === 'a' ? '270deg' : '90deg') + ', ' + shade(c, 0.12) + ', ' + c + ' 55%, ' + shade(c, -0.28) + ')';
      tag.style.color = k === 'a' ? accentOn(t, c) : teamInk(c);
      // the slanted band between the tag and the scores is a deep shade of the team's own colour on air, not black
      const jag = el('i', 'jag ' + k); jag.style.background = shade(c, -0.4);
      if (pre) jag.style[k === 'h' ? 'right' : 'left'] = mid + 'px';
      root.append(tag, jag);
    });
    const sc = (t) => (g.status !== 'pre' && t.score != null ? String(t.score) : '');
    const clk = el('div', 'clk'); clk.appendChild(fit(el('span', '', soccerClock(g, time))));
    if (pre) clk.style.left = (mid - 98) + 'px'; else root.append(el('span', 'sc h' + (sc(h).length > 1 ? ' w' : ''), sc(h)), el('span', 'sc a' + (sc(a).length > 1 ? ' w' : ''), sc(a)));
    root.appendChild(clk);
    if (mk.league) { const lion = el('div', 'lion'); if (pre) lion.style.left = (mid - 54) + 'px'; lion.appendChild(leagueLogo(g, 114)); root.appendChild(lion); }
  },
};
