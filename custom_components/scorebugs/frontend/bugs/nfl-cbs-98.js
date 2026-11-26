// "Blue panel '98": after CBS's NFL bug (1998; frame: Dolphins at Colts). A light tab on top where the network's eye sat (here the Home
// Assistant logo), a white band with the quarter and the clock in blue, and a blue panel with each team's letters and score in white, a
// small football beside the team with the ball.
import { el, statusText, scoreSlot, haMark, marks, FONTS } from '../kit.js';

const W = 340, H = 330, TAB = 70, BAND = 62;
const BAND_PX = 48, TEAM_PX = 68, PRE_W = 250;

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-cbs-98',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // before the kick-off there is no score: the box narrows to the letters, centred
  sizeFor: (g) => (closeUp(g) ? { w: PRE_W, h: H } : { w: W, h: H }),
  // measured against the frame by the automatic audit: text -22% vs the broadcast; 80 % of the correction
  typeScale: 1.229,
  fonts: [FONTS.archivo],
  css: `
.sb-nfl-cbs-98 { font-family: 'SB Archivo', 'Arial', sans-serif; font-weight: 800; font-stretch: 88%; color: #fff; }
.sb-nfl-cbs-98 { font-weight: 900; font-stretch: 64%; }   /* very tall, narrow and heavy, filling about 75 % of each row, as on air (was Archivo 800 at 80 %) */
.sb-nfl-cbs-98 .tab { position: absolute; left: 100px; right: 100px; top: 0; height: ${TAB + 10}px; display: grid; place-items: center; padding-bottom: 10px; box-sizing: border-box;
  border-radius: 8px 8px 0 0; background: linear-gradient(#f4f4f6, #c9cbd2); } .sb-nfl-cbs-98 .tab .sb-ha { color: #1d2ea0; }
.sb-nfl-cbs-98 .bx { position: absolute; left: 0; right: 0; top: ${TAB}px; bottom: 0; display: grid; grid-template-rows: ${BAND}px 1fr 1fr; padding: 8px; box-sizing: border-box;
  border-radius: 6px; background: linear-gradient(#d6d8de, #a4a8b2); box-shadow: 0 3px 8px rgba(0,0,0,.5); }
.sb-nfl-cbs-98 .band { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: linear-gradient(#ffffff, #e2e4ea); color: #1d2ea0; font-size: ${BAND_PX}px; line-height: 1; }
.sb-nfl-cbs-98 .band .w { flex: 1; text-align: center; font-size: ${BAND_PX * 0.65}px; }
.sb-nfl-cbs-98 .ln { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 26px 0 40px; background: #26228e; min-width: 0; overflow: hidden; font-size: ${TEAM_PX}px; line-height: 1; text-shadow: 0 2px 2px rgba(0,0,0,.45); }
.sb-nfl-cbs-98 .ln + .ln { background: linear-gradient(#26228e, #211d84); }   /* a deeper blue, as on air (frame, levels corrected) */   /* one blue panel under the band, as the frame (it was two striped rows) */
.sb-nfl-cbs-98 .ln.ball::before { content: ''; position: absolute; left: 8px; top: calc(50% - 8px); width: 26px; height: 16px; border-radius: 50%; background: radial-gradient(#a0582a, #5e2c10 75%); }
`,
  draw(root, g, { time, opts }) {
    const live = g.status === 'live';
    const tab = el('div', 'tab'); if (marks(opts).ha) tab.appendChild(haMark(52));
    const bx = el('div', 'bx'), band = el('div', 'band');
    if (live) band.append(el('span', '', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toLowerCase()), el('span', '', g.clock || ''));
    else band.appendChild(el('span', 'w', statusText(g, time)));
    bx.appendChild(band);
    [g.away, g.home].forEach((t) => {
      const ln = el('div', 'ln' + (live && t.hasBall ? ' ball' : ''));
      ln.append(el('span', '', (t.abbr || '').toUpperCase()), scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      bx.appendChild(ln);
    });
    if (closeUp(g)) {
      tab.style.left = tab.style.right = (PRE_W - (W - 200)) / 2 + 'px';
      bx.querySelectorAll('.ln').forEach((ln) => { ln.style.justifyContent = 'center'; ln.style.padding = '0'; ln.lastChild.remove(); });
    }
    root.append(tab, bx);
  },
};
