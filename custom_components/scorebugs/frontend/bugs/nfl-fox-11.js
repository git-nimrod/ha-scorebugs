// "Logo capsule '11": after Fox's NFL bug (2011; frames: Lions at Broncos, Falcons at Steelers). A glossy capsule with yellow timeout bars
// curving round each end: each team's logo over its score on a panel of its colour, a black centre with the clock in yellow over the
// quarter and an arrow pointing to the team with the ball; and a silver strip along the bottom with the down and distance (the play clock
// at its end is left out: no data).
// Review: the ends bow outwards in one curve from top to bottom (an elliptical end, not a rounded corner), the timeout
// bars following that curve; the logo kept clear of the score (its foot covered the figures on some teams).
import { el, logo, statusText, scoreSlot, teamColor, shade, FONTS, CHROME, BEVEL } from '../kit.js';

const W = 640, H = 220, CENTRE = 176, STRIP = 58;
const SCORE_PX = 74, CLOCK_PX = 66, STRIP_PX = 46;
const hasStrip = (g) => g.status === 'live';   // the silver strip holds the down and distance only

// before the game with both teams' records the kit writes them into the score room, so that room stays; without them it closes up
const closeUp = (g) => g.status === 'pre' && !(g.away.record && g.home.record);

export default {
  id: 'nfl-fox-11',
  sizedFor: 0.688,   // sizes were measured in SB Saira; the matched face keeps those cap heights
  size: { w: W, h: H },
  // outside live play the silver strip is empty, so it goes and the capsule is shorter; before the kick-off the logos stand whole in their
  // panels (no score under them)
  sizeFor: (g) => ({ w: W, h: hasStrip(g) ? H : H - STRIP }),
  fonts: [FONTS.barlowSemi700],
  css: `
.sb-nfl-fox-11 { font-family: 'SB Barlow Semi Condensed', 'Arial', sans-serif; font-weight: 700; font-stretch: 85%; color: #fff; }
/* face: FOX 2010-14 family: Barlow Semi Condensed Bold */
.sb-nfl-fox-11 .cap { position: absolute; left: 24px; right: 24px; top: 4px; bottom: 4px; border-radius: 34px / 50%; overflow: hidden; display: grid; grid-template-columns: 1fr ${CENTRE}px 1fr; grid-template-rows: 1fr ${STRIP}px;   /* both panels fill to the rim (a dark sliver stood at the right end) */
  background: #0b0b0c; box-shadow: 0 0 0 4px #c9cbce, 0 3px 8px rgba(0,0,0,.55); }
.sb-nfl-fox-11 .p { display: grid; grid-template-rows: 1fr auto; justify-items: center; align-items: center; padding: 6px 0 8px; position: relative; }
.sb-nfl-fox-11 .p::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,0) 50%, rgba(0,0,0,.25)); }
.sb-nfl-fox-11 .p .sb-logo { width: 190px; height: 96px; margin: -46px 0 0; object-fit: contain; object-position: center bottom;
  -webkit-mask-image: linear-gradient(#000 45%, rgba(0,0,0,.15) 100%); mask-image: linear-gradient(#000 45%, rgba(0,0,0,.15) 100%); }   /* the logo fades out at its foot so the score takes over */   /* its foot clear of the score (it covered the top of the figures) */   /* big and cut by its panel, as on air */
.sb-nfl-fox-11 .sc { position: relative; z-index: 1; height: ${SCORE_PX * 0.9}px; font-size: ${SCORE_PX}px; line-height: .9; text-shadow: 0 2px 3px rgba(0,0,0,.5); }
.sb-nfl-fox-11 .md { display: grid; grid-template-rows: 1fr 1fr; justify-items: center; align-items: center; background: linear-gradient(#1c1d20, #050506); font-size: ${CLOCK_PX}px; line-height: 1; }
.sb-nfl-fox-11 .md .q { font-size: .82em; } .sb-nfl-fox-11 .md .ck { color: #f2c230; } .sb-nfl-fox-11 .md { position: relative; } .sb-nfl-fox-11 .md > b { position: absolute; bottom: 24px; font-size: ${CLOCK_PX * 0.6}px; color: #f2c230; }
.sb-nfl-fox-11 .md > b.l { left: 8px; } .sb-nfl-fox-11 .md > b.r { right: 8px; }
.sb-nfl-fox-11 .md .w { grid-row: 1 / 3; font-size: ${CLOCK_PX * 0.55}px; }
/* the strip runs from black at its left end to near-white past the middle, dimming again to the right (sampled on the frame, Nov 22) */
.sb-nfl-fox-11 .st { grid-column: 1 / 4; display: grid; place-items: center; background: linear-gradient(rgba(255,255,255,.35), rgba(255,255,255,0) 45%, rgba(0,0,0,.12)), linear-gradient(90deg, #2c2f2d 0, #7d807c 12%, #c4c6c3 28%, #fbfdfb 46%, #e6eae7 62%, #bcc0bd 80%, #8a8e8b 100%); box-shadow: ${BEVEL}; color: #111;   /* chrome strip (surface pass) */ font-size: ${STRIP_PX}px; line-height: 1; }
.sb-nfl-fox-11 .to { position: absolute; top: 18px; bottom: 18px; width: 14px; display: flex; flex-direction: column; gap: 6px; }
.sb-nfl-fox-11 .to.a { left: 6px; } .sb-nfl-fox-11 .to.h { right: 6px; }
.sb-nfl-fox-11 .to.a i:nth-child(odd) { transform: translateX(7px) rotate(var(--r)); } .sb-nfl-fox-11 .to.h i:nth-child(odd) { transform: translateX(-7px) rotate(var(--r)); }   /* along the bowed end */
.sb-nfl-fox-11 .to.a i:first-child, .sb-nfl-fox-11 .to.h i:last-child { --r: 14deg; } .sb-nfl-fox-11 .to.a i:last-child, .sb-nfl-fox-11 .to.h i:first-child { --r: -14deg; }
.sb-nfl-fox-11 .to i { flex: 1; border-radius: 6px; background: #f2d33a; box-shadow: 0 0 0 2px #6b5a12; } .sb-nfl-fox-11 .to i.used { background: #3a3a3a; box-shadow: 0 0 0 2px #222; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    const cap = el('div', 'cap');
    const panel = (t) => {
      const c = teamColor(t, '#3a3f47'), p = el('span', 'p');
      p.style.background = 'linear-gradient(' + shade(c, 0.06) + ' 0, ' + c + ' 40%, ' + shade(c, -0.6) + ' 100%)';   // the team colour running into near-black at the panel's foot, as on air
      if (closeUp(g)) { const lg = logo(t, 190); lg.style.margin = '0'; lg.style.height = '128px'; p.style.gridTemplateRows = '1fr'; p.appendChild(lg); }
      else {
        const lg = logo(t, 190);
        if (g.status === 'pre') { lg.style.height = '96px'; lg.style.margin = '-24px 0 6px'; }   // the kit's records below: the logo kept clear of them
        p.append(lg, scoreSlot(el('span', 'sc', g.status !== 'pre' && t.score != null ? String(t.score) : ''), g));
      }
      return p;
    };
    const md = el('span', 'md');
    if (live) {
      const q = el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || ''));
      md.append(el('span', 'ck', g.clock || ''), q);
      if (g.away.hasBall) md.appendChild(el('b', 'l', '◀')); else if (g.home.hasBall) md.appendChild(el('b', 'r', '▶'));
    } else md.appendChild(el('span', 'w', statusText(g, time)));
    cap.append(panel(g.away), md, panel(g.home));
    if (hasStrip(g)) cap.appendChild(el('span', 'st', g.football && g.football.short ? g.football.short : ''));
    else cap.style.gridTemplateRows = '1fr';
    root.appendChild(cap);
    [[g.away, 'a'], [g.home, 'h']].forEach(([t, k]) => {
      const to = el('span', 'to ' + k);
      if (live && t.timeouts != null) for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      root.appendChild(to);
    });
  },
};
