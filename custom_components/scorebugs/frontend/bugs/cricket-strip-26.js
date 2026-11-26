// "Innings strip '26": after the T20 league's score strip on its Indian broadcaster (2026; frame: Hyderabad v Bengaluru, a photo of the
// screen). A long, hot orange strip along the bottom: the batting side's logo, its letters with the runs and wickets in yellow
// ("23-1") and the overs, "v" and the bowling side underneath; the run rate in the middle; the bowling side's logo at the right end.
// The batters, the bowler and the ball-by-ball row need data the sensor lacks; the match summary sits where the batters are.
import { el, logo, statusText, FONTS, GLOSS, LOGO_HALO, TOKENS } from '../kit.js';

const W = 1320, H = 92, SHUT = 300;   // SHUT: the runs, overs and run rate's room, gone before the first ball

// the bar's orange, dark enough for white text at 4.5:1 and the yellow runs at 3:1 (the brighter broadcast orange failed on every page)
// a red-orange as on air (the frame reads #de4b27, hue about 10 degrees; ours was a browner orange), kept as dark
const BAR = { edge: '#ad2f1a', mid: '#c8401f' };
const RUNS_FIGURES = 5;   // "287-6": three figures, the dash and the wickets

export default {
  id: 'cricket-strip-26',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the first ball there are no runs, overs or run rate: their room goes and the strip is shorter
  sizeFor: (g) => (g.status === 'pre' ? { w: W - SHUT, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -10% vs the broadcast, logos -25%; 80 % of the correction
  logoScale: 1.26,
  fonts: [FONTS.rajdhani],
  css: `
.sb-cricket-strip-26 { font-family: 'SB Rajdhani', 'Arial Black', sans-serif; font-weight: 700; font-stretch: 88%; color: #fff; }
.sb-cricket-strip-26 { font-weight: 700; font-stretch: 100%; }   /* face: Rajdhani 700 (low confidence) */
.sb-cricket-strip-26 .bar { position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,.12), rgba(0,0,0,.1)), linear-gradient(90deg,   /* flat with a soft fall, no glossy horizon (surface sweep) */ ${BAR.edge}, ${BAR.mid} 40%, ${BAR.edge}); border-top: 3px solid #ffd2a8; display: flex; align-items: center; }
.sb-cricket-strip-26 .bar .sb-logo { width: 76px; height: 76px; object-fit: contain; margin: 0 22px;   /* clear of the letters */ filter: ${LOGO_HALO}; }
.sb-cricket-strip-26 .bt { display: grid; min-width: 330px; } .sb-cricket-strip-26 .bt .l1 { font-size: 36px; line-height: 1.05; display: flex; gap: 14px; align-items: baseline; font-weight: 800; }
.sb-cricket-strip-26 .bt .r { color: #ffe14a; font-size: 46px; font-weight: 800; font-stretch: 95%; } .sb-cricket-strip-26 .bt .ov { font-size: 26px; font-weight: 600; } .sb-cricket-strip-26 .bt .l2 { font-size: 19px; line-height: 1.1; font-weight: 600; opacity: .92; }
.sb-cricket-strip-26 .mid { flex: 1; text-align: center; font-size: 24px; font-weight: 600; border-left: 2px solid rgba(255,255,255,.4); border-right: 2px solid rgba(255,255,255,.4); padding: 0 18px; }
.sb-cricket-strip-26 .rr { width: 170px; display: grid; justify-items: center; font-size: 18px; font-weight: 600; letter-spacing: .5px; } .sb-cricket-strip-26 .rr b { font-size: 36px; line-height: 1.05; font-weight: 800; color: #ffe14a; }
.sb-cricket-strip-26 .ot { width: 260px; display: grid; justify-items: end; font-size: 30px; font-weight: 800; padding-right: 6px; } .sb-cricket-strip-26 .ot small { font-size: 20px; font-weight: 600; opacity: .9; }
`,
  draw(root, g, { time }) {
    // the batting side: the team with possession while live, else the side with more innings played (or the first)
    const sides = [g.home, g.away];
    const bat = sides.find((t) => t.hasBall) || sides[0], bowl = bat === g.home ? g.away : g.home;
    const bar = el('div', 'bar');
    const bt = el('div', 'bt'), l1 = el('div', 'l1');
    const runs = bat.score != null ? String(bat.score) + (bat.wickets != null && bat.wickets < 10 ? '-' + bat.wickets : '') : '';
    const r = el('span', 'r sb-num', runs); r.style.minWidth = (RUNS_FIGURES * TOKENS.figure).toFixed(2) + 'em'; r.style.textAlign = 'left';
    const pre = g.status === 'pre';
    if (pre) { bt.style.minWidth = '0'; l1.append(el('span', '', (bat.abbr || '').toUpperCase())); }   // no runs or overs before the first ball (the fixture's "50" overs showed)
    else l1.append(el('span', '', (bat.abbr || '').toUpperCase()), r, el('span', 'ov', bat.overs || ''));
    bt.append(l1, el('div', 'l2', 'v ' + (bowl.abbr || '').toUpperCase() + (bowl.scoreText ? '  ' + bowl.scoreText : '')));
    // a result ("won by", "tied") only after the game: during play the note can still hold one from a feed
    const result = (x) => /\b(won|beat|tied|draw|no result)\b/i.test(x || '');
    const keep = (x) => (g.status === 'live' && result(x) ? '' : x || '');
    const mid = el('div', 'mid', g.status === 'pre' ? statusText(g, time) : (keep(g.lastPlay) || keep(g.note)));
    const rr = el('div', 'rr');
    const ov = parseFloat(bat.overs || '0'), balls = Math.floor(ov) * 6 + Math.round((ov % 1) * 10);
    if (!pre && bat.score != null && balls > 0) rr.append(el('span', '', 'RUN RATE'), el('b', '', (bat.score * 6 / balls).toFixed(2)));
    const ot = el('div', 'ot'); ot.append(el('span', '', (bowl.abbr || '').toUpperCase()), el('small', '', mid.textContent === (g.note || '') ? '' : g.note || ''));   // the note once, not twice
    if (pre) bar.append(logo(bat, 76), bt, mid, ot, logo(bowl, 76)); else bar.append(logo(bat, 76), bt, mid, rr, ot, logo(bowl, 76));
    root.appendChild(bar);
  },
};
