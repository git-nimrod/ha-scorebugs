// "Blue box '01": after CBS's NFL bug (2001; frame: Ravens at Titans). An upright blue box: the network's eye and letters at the top (here
// the Home Assistant logo), a white band with the quarter and the clock, then each team's letters and score in white on the blue; under
// the box, the down and distance on a black plate.
import { el, statusText, haMark, marks, scoreSlot, FONTS } from '../kit.js';

const W = 300, H = 340, BOX = 252, HEAD = 64, BAND = 54, DOWN = 74;
const BAND_PX = 50, TEAM_PX = 68, DOWN_PX = 56, PRE_W = 214;

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-cbs-01',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the box narrows to the letters; outside live play there is no down plate, so its room goes too
  // the down tab's room only for a football game while it runs (another sport's game left an empty foot)
  sizeFor: (g) => (closeUp(g) ? { w: PRE_W, h: BOX } : g.status === 'live' && g.football ? { w: W, h: H } : { w: W, h: BOX }),
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-cbs-01 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 90%; color: #fff; }
.sb-nfl-cbs-01 { font-weight: 900; font-stretch: 70%; }   /* tall, narrow, heavy, as on air (was Archivo 700 at full width) */
.sb-nfl-cbs-01 .bx { position: absolute; left: 0; top: 0; width: ${W}px; height: ${BOX}px; display: grid; grid-template-rows: ${HEAD}px ${BAND}px 1fr; border-radius: 16px / 50%; overflow: hidden;   /* sides bowed outward, top and bottom flat, as on air */
  background: radial-gradient(circle 120px at 70% 78%, rgba(255,255,255,0) 108px, rgba(255,255,255,.14) 112px, rgba(255,255,255,0) 118px),
    radial-gradient(150% 110% at 65% 70%, #3f3ee0, #2a29c4 60%, #2120a8);
  /* the box's edge as on the frame (sampled in a grid on the 152 px frame): dark navy along the top and the
 sides (#01042d-#080a57 on the top edge, #171986 down the left against the body's #2120a2) and a light silver foot lit from the left
 (#c4c7ce at the left, #66677c at the right, 2-3 of the box's 126 px); ours was a light inset line all round (#7272d1 on top) */
  box-shadow: 0 3px 8px rgba(0,0,0,.55), inset 0 3px 0 #0b0e5a, inset 3px 0 0 #171986, inset -3px 0 0 #171986; }
.sb-nfl-cbs-01 .bx::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 5px; background: linear-gradient(90deg, #c4c7ce, #a3a6b4 30%, #74748a 60%, #66677c); }
.sb-nfl-cbs-01 .hd { display: grid; place-items: center; } .sb-nfl-cbs-01 .hd .sb-ha { color: #fff; }
/* the white band framed by a lighter blue line above and below it, as on the frame (#8085c8 just over it, #5e5dad-#726dc9 just under,
   about 2 of its 126 px each); ours ran the white straight into the blue */
.sb-nfl-cbs-01 .band { display: flex; align-items: center; justify-content: space-between; padding: 0 22px; line-height: 1; background: linear-gradient(#ffffff, #d2d6dc); color: #0d0d10; font-size: ${BAND_PX}px; box-shadow: 0 -4px 0 #8085c8, 0 4px 0 #6865bd; }
.sb-nfl-cbs-01 .band .w { flex: 1; text-align: center; font-size: ${BAND_PX * 0.7}px; }
.sb-nfl-cbs-01 .teams { display: grid; grid-template-rows: 1fr 1fr; padding: 2px 24px 6px; }   /* the letters fill about 70 % of each row, as on air */
.sb-nfl-cbs-01 .ln { display: flex; align-items: center; justify-content: space-between; font-size: ${TEAM_PX}px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.5); }
.sb-nfl-cbs-01 .dn { position: absolute; left: 6px; right: 6px;   /* as wide as the box, as on air */ top: ${BOX + 10}px; height: ${DOWN}px; display: grid; place-items: center; background: #050505; border: 3px solid #d7d9dc; border-radius: 4px; box-sizing: border-box; font-size: ${DOWN_PX}px; }
.sb-nfl-cbs-01 .dn:empty { display: none; }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const bx = el('div', 'bx');
    const hd = el('div', 'hd'); if (marks(opts).ha) hd.appendChild(haMark(46));
    const band = el('div', 'band');
    if (live) band.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else band.appendChild(el('span', 'w', statusText(g, time)));
    const teams = el('div', 'teams');
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln');
      const sc = scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g);
      // a sport whose scores run to three figures keeps that room (2.1 em): at 68 px a four-letter-wide name and it overran the box and
      // pushed the clock in the white band 7 px past the edge (stress, a basketball game: MEM and 8:00); the letters and score 56 px there
      if (parseFloat(sc.style.minWidth) > 1.6) ln.style.fontSize = '56px';
      ln.append(el('span', '', (t.abbr || '').toUpperCase()), sc);
      teams.appendChild(ln);
    });
    if (closeUp(g)) { bx.style.width = PRE_W + 'px'; teams.querySelectorAll('.ln').forEach((ln) => { ln.style.justifyContent = 'center'; ln.lastChild.remove(); }); }
    bx.append(hd, band, teams);
    root.append(bx, el('div', 'dn', live && g.football && g.football.short ? g.football.short.replace(/(\d)(ST|ND|RD|TH)/, (m, d, s) => d + s.toLowerCase()).replace('GOAL', 'Goal') : ''));
  },
};
