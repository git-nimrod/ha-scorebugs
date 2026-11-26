// "Panel bar '25": after the NBA bar on ESPN and ABC (2024-25 on), which changes its dress through the season (frames: regular season
// 2026, 2025 first round, 2025 West and 2026 East finals, 2025 Finals). A long, low bar: a dark slot at the left end (where the
// network's mark sits on air; here the Home Assistant logo), each team a flat block of its colour with its letters and score, then a
// dark block with the quarter and the clock in a pill. Underneath, a second row that carries the dress:
//   regular      dark charcoal frame; each team's record under its block; the league and the day of the week on the right
//   playoffs     the league's logo and PLAYOFFS, then the round and the game ("WEST 1st ROUND  GAME 1") across the row
//   conf-finals  a silver frame and the round in tall italic capitals ("WESTERN CONFERENCE FINALS  GAME 1")
//   finals       a gold frame; timeouts as dashes under the teams; a gold plate with the league's logo, FINALS and the game
// The league's playoff and Finals wordmarks are not drawn: plain lettering stands in for them.
import { el, ordinal, pips, statusText, teamColor, teamPair, contrast, shade, inkOn, leagueLogo, haMark, marks, FONTS, GLOSS, eventLogo } from '../kit.js';

const W = 1500, H = 184, ROW = 104;
// measured against the frames: the team letters are smaller and the row sits closer to its edges (median of four frames)
const ABBR_PX = 49, SCORE_PX = 70, PERIOD_PX = 44, PAD_IN = 14, PAD_OUT = 18;
const FRAME = { regular: '#41474e', playoffs: '#41474e', 'conf-finals': '#c4c8cd', finals: '#b8a46c' };
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const WIDE = { WEST: 'WESTERN CONFERENCE', EAST: 'EASTERN CONFERENCE' };


// the team letters' width to the frame's
const LETTERS = { stretch: 125, track: 2 };  // wide letters, not spread apart (8 px read as spaced out)

// measured position corrections: [element, right, down, outwards] in stage px, applied by the kit (nudgeAll)
const NUDGE = [
  ['div.fr > div.tm > span.s', 0, -1, 6],
  ['div.fr > div.tm > span.ab', 24.5, 0.5, 0],
  ['div.fr > div.clock > span.pill', -20, 5, 0],
  ['div.fr > div.band > div.mark > img', -22.5, -3.5, 0],
  ['div.fr > div.plate > img', 5, -1.5, 0],
];

export default {
  id: 'nba-gilt-25',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // measured against the frame by the automatic audit: text -13% vs the broadcast; 80 % of the correction
  typeScale: 1.0,
  nudge: NUDGE,
  lower: H - ROW - 8,   // the second row (records, the day, the round), which the card can hide
  dresses: ['regular', 'playoffs', 'conf-finals', 'finals'],
  fonts: [FONTS.archivo, FONTS.sairaItalic],
  css: `
.sb-nba-gilt-25 { font-family: 'SB Archivo', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 106%; color: #fff; --fr: #41474e; }
.sb-nba-gilt-25 { font-stretch: 125%; }   /* ESPN/ABC NBA 2022-: Archivo wide 900 */
.sb-nba-gilt-25 .fr { position: absolute; inset: 0; box-sizing: border-box; border: 4px solid var(--fr); background: rgba(18,22,26,.55); box-shadow: 0 3px 8px rgba(0,0,0,.45);
  display: grid; grid-template-columns: 190px 400px 400px 1fr; grid-template-rows: ${ROW}px 1fr; }
.sb-nba-gilt-25 .slot .sb-ha { color: var(--gold, #c9ccd0); }

.sb-nba-gilt-25 .slot { background: #1d2328; display: grid; place-items: center; font-size: 40px; color: #c9ccd0; letter-spacing: 2px; border-right: 3px solid var(--fr); }
.sb-nba-gilt-25 .tm { display: flex; align-items: center; justify-content: space-between; padding: 0 ${PAD_OUT}px 0 ${PAD_IN}px; font-size: ${ABBR_PX}px; position: relative; }
.sb-nba-gilt-25 .tm::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 6px; background: rgba(255,255,255,.28); }
.sb-nba-gilt-25 .tm .s { font-size: ${SCORE_PX}px; }
.sb-nba-gilt-25 .tm .ab sup { font-size: 30px; vertical-align: 0; margin-right: 4px; opacity: .92; }
.sb-nba-gilt-25 .clock { background: #1d2328; display: flex; align-items: center; justify-content: space-evenly; border-left: 3px solid var(--fr); }
.sb-nba-gilt-25 .q { font-size: ${PERIOD_PX}px; } .sb-nba-gilt-25 .sb-ord { font-size: .62em; vertical-align: 16px; }
.sb-nba-gilt-25 .pill { border: 3px solid var(--pf, var(--fr)); border-radius: 40px; padding: 2px 34px; font-size: 60px; letter-spacing: 4px; color: #4a4f56; background: linear-gradient(#ffffff, #e6e8eb); }
.sb-nba-gilt-25 .when { font-size: 40px; color: #eceef0; }
/* in the Finals the pill is dark like its block, with cream figures and a thin light grey rim (2025 G1 and 2026 G4 stills: fill
 #1a201f, figures #d9d6bc, rim #b6b89a) */
.sb-nba-gilt-25.sb-finals .pill { background: linear-gradient(#1d2423, #171d1c); color: #d9d6bc; border-color: #b6b89a; }
.sb-nba-gilt-25 .low { grid-row: 2; display: grid; place-items: center; background: rgba(34,39,44,.5);   /* the lower row is a thin smoked glass: the arena shows through it in the frame */ font-size: 30px; color: #c3c8cd; }
.sb-nba-gilt-25 .low.l0 { grid-column: 1; } .sb-nba-gilt-25 .low + .low { border-left: 2px solid rgba(255,255,255,.12); }
.sb-nba-gilt-25 .sb-pips { display: flex; gap: 12px; }
.sb-nba-gilt-25 .sb-pips i { width: 30px; height: 6px; background: #e6e6e6; } .sb-nba-gilt-25 .sb-pips i.used { opacity: .2; }
.sb-nba-gilt-25 .day { grid-row: 2; grid-column: 4; display: flex; align-items: center; justify-content: center; gap: 14px; font-size: 32px; color: #eceef0;
  background: rgba(34,39,44,.5); border-left: 3px solid var(--fr); }
.sb-nba-gilt-25 .day .sb-league, .sb-nba-gilt-25 .band .sb-league, .sb-nba-gilt-25 .plate .sb-league { width: 52px; height: 52px; }
.sb-nba-gilt-25 .band { grid-row: 2; grid-column: 1 / -1; display: flex; align-items: center; background: #23292f; border-top: 2px solid rgba(255,255,255,.08); }
.sb-nba-gilt-25 .band .mark { flex: 0 0 620px; display: flex; align-items: center; justify-content: flex-end; gap: 14px; padding-right: 40px; box-sizing: border-box; }
.sb-nba-gilt-25 .band span { white-space: nowrap; }
.sb-nba-gilt-25 .band .po { font-family: 'SB Saira Italic', sans-serif; font-stretch: 75%; font-size: 58px; letter-spacing: 1px; }
.sb-nba-gilt-25 .band .rd { flex: 1; display: flex; align-items: center; justify-content: flex-start; gap: 22px; font-size: 32px; padding-left: 30px; }
.sb-nba-gilt-25 .band .gm { font-size: 27px; color: #c3c8cd; }
.sb-nba-gilt-25.sb-conf-finals .band { background: rgba(70,76,82,.78); }
.sb-nba-gilt-25.sb-conf-finals .band .mark { flex: 0 0 auto; padding: 0 26px 0 300px; }
.sb-nba-gilt-25.sb-conf-finals .band .po { font-size: 62px; color: #f2f3f5; }
.sb-nba-gilt-25.sb-conf-finals .band .rd { justify-content: flex-start; padding-left: 20px; }
.sb-nba-gilt-25 .plate { grid-row: 2; grid-column: 4; display: flex; align-items: center; justify-content: center; gap: 26px; font-size: 32px; color: #fff;
  background: linear-gradient(#c7ae69, #8f7737); border-left: 3px solid var(--fr); }
.sb-nba-gilt-25 .plate .po { font-family: 'SB Saira Italic', sans-serif; font-stretch: 75%; font-size: 48px; }
.sb-nba-gilt-25.sb-no-lower .low, .sb-nba-gilt-25.sb-no-lower .day, .sb-nba-gilt-25.sb-no-lower .band, .sb-nba-gilt-25.sb-no-lower .plate { display: none; }
.sb-nba-gilt-25 .tm .s.rec { font-size: 36px; }   /* before the game with the second row hidden, the record in the score's place */
.sb-nba-gilt-25 .tm .ab { font-stretch: ${LETTERS.stretch}%; letter-spacing: ${LETTERS.track}px; }
`,
  draw(root, g, { time, opts }) {
    const mk = marks(opts);
    const live = g.status === 'live', dress = g.dress || 'regular', r = g.round || {};
    root.style.setProperty('--fr', FRAME[dress] || FRAME.regular);
    if (dress !== 'regular') { root.style.setProperty('--gold', '#d9b65c'); root.style.setProperty('--pf', '#d9b65c'); }
    const fr = el('div', 'fr');
    // the network's wordmark sat in this slot; now the Home Assistant logo (or the league's letters)
    const slot = el('div', 'slot', mk.ha ? '' : g.league || '');
    if (mk.ha) slot.appendChild(haMark(58));
    fr.appendChild(slot);
    const pair = teamPair(g.away, g.home, '#4a5058');  // never two alike blocks: GS keeps its gold against DET, CHA its teal against PHX
    [g.away, g.home].forEach((t, i) => {
      const c = pair[i];
      const b = el('div', 'tm');
      b.style.background = c;
      // dark letters on a light block take the team's other colour when it reads (GS: navy on gold), else a deep shade of the block
      const c2 = t.color2 && t.color2.toLowerCase() !== c.toLowerCase() ? t.color2 : '';
      // white while it reads as big bold type (3:1: Hornets teal keeps white letters); else the other colour (GS: navy on gold)
      b.style.color = contrast('#ffffff', c) >= 3 ? '#fff' : c2 && contrast(c2, c) >= 4.5 ? c2 : shade(c, -0.75);
      // the seed sits small before the letters in the postseason ("6 MIN")
      const ab = el('span', 'ab');
      if (t.seed || t.rank) ab.appendChild(el('sup', '', String(t.seed || t.rank)));
      ab.appendChild(document.createTextNode((t.abbr || '').toUpperCase()));
      const recHere = g.status === 'pre' && opts && opts.bug_lower === 'hide' && t.record;   // the row with the records is hidden
      b.append(ab, el('span', 's' + (recHere ? ' rec' : ''), recHere ? t.record : g.status !== 'pre' && t.score != null ? String(t.score) : ''));
      fr.appendChild(b);
    });
    const clock = el('div', 'clock');
    if (live) { clock.appendChild(ordinal(g.period, 'q')); if (g.clock) clock.appendChild(el('span', 'pill', g.clock)); }
    else clock.appendChild(el('span', 'when', statusText(g, time)));
    fr.appendChild(clock);

    if (dress === 'regular' || (dress === 'playoffs' && !r.label && !r.game)) {
      // the records under the teams, and "NBA (logo) WEDNESDAY" on the right
      fr.appendChild(el('div', 'low l0'));
      // during play the row under the teams holds the timeouts left as dashes (as on air); before and after, or when they are not known, the records
      [g.away, g.home].forEach((t) => { const low = el('div', 'low', live && t.timeouts != null ? '' : t.record || ''); if (live && t.timeouts != null) { const p = pips(t.timeouts, t.timeouts); p.classList.add('left'); low.appendChild(p); } fr.appendChild(low); });
      const day = el('div', 'day');
      day.appendChild(el('span', '', g.league || ''));
      if (mk.league) day.appendChild(leagueLogo(g, 52));
      day.appendChild(el('span', '', DAYS[time.parts(new Date(g.starts)).wd]));
      fr.appendChild(day);
    } else if (dress === 'finals') {
      fr.appendChild(el('div', 'low l0'));
      [g.away, g.home].forEach((t) => {
        const low = el('div', 'low');
        // NBA teams have seven timeouts a game; shown only when the sensor knows how many are left
        if (live && t.timeouts != null) low.appendChild(pips(t.timeouts, 7));
        fr.appendChild(low);
      });
      const plate = el('div', 'plate');
      const fl = g.league === 'NBA' ? eventLogo({ sport: g.sport, event: 'nba finals' }, 56) : null;
      if (fl) { fl.style.filter = 'brightness(0) invert(1) drop-shadow(0 1px 1px rgba(0,0,0,.5))'; plate.appendChild(fl); } else { if (mk.league) plate.appendChild(leagueLogo(g, 52)); plate.appendChild(el('span', 'po', 'FINALS')); }
      plate.appendChild(el('span', '', r.game || (g.status === 'final' ? 'FINAL' : '')));
      fr.appendChild(plate);
    } else {
      // playoffs: the league's logo and PLAYOFFS, then the round; conference finals: the round itself, written out large
      const band = el('div', 'band'), mark = el('div', 'mark'), rd = el('div', 'rd');
      if (mk.league) mark.appendChild(leagueLogo(g, 52));
      if (dress === 'conf-finals') {
        const side = (r.label || '').split(' ')[0];
        mark.appendChild(el('span', 'po', WIDE[side] ? WIDE[side] + ' FINALS' : r.label || 'CONFERENCE FINALS'));
        rd.appendChild(el('span', 'gm', r.game || ''));
      } else {
        const pl = g.league === 'NBA' ? eventLogo({ sport: g.sport, event: 'nba playoffs' }, 58) : null;
        if (pl) { mark.textContent = ''; pl.style.filter = 'brightness(0) invert(1)'; mark.appendChild(pl); } else mark.appendChild(el('span', 'po', 'PLAYOFFS'));
        rd.append(el('span', '', r.label || ''), el('span', 'gm', r.game || ''));
      }
      band.append(mark, rd);
      fr.appendChild(band);
    }
    root.appendChild(fr);
  },
};
