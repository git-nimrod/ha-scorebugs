// "Chrome box '01": after the 2001 spring league's top-left box on NBC (frames: Chicago v Los Angeles, :59 2nd, 2ND & 10; New York v Las
// Vegas, 5:11 3rd, 2ND & 6; standard definition, rough). Two team rows stacked: a light silver bar with the logo at its left end and the
// code in dark capitals at its right end, and beside it the score in white on a black box with a chrome rim. To the right a black panel
// with chrome rims and both ends cut on the slant holds the clock over the quarter. Under all of it a chrome strip and a black box with
// the down and distance in white, its right end cut on the same slant.
// Measured on the SD frame (upscaled to 1080p, stage px = 2x that): rows 165 x 40, 3 apart; score boxes 65 wide, chrome rim
// 4, corners 6; the clock panel 240 wide over both rows, its ends leaning 38 deg (geomdiff: 39.6 on the frame); the chrome strip 17 tall; the down box 220 x 47. The
// silver bars run L 73 at the top to 40 at the foot (sample.py). Letters cap 28 (codes), 25 (scores, clock, down). Rough: a 480-line frame
// can't show a 1 px rim or the chrome's banding exactly, so the chrome is the kit's metal and the rims are read off the blur.
import { el, logo, statusText, teamColor, shade, fit, scoreSlot, metal, textOutline, FONTS } from '../kit.js';

// each score box now stands right against its team's silver bar, its chrome
// rim the grey barrier between them (no gap, as the SD frames show); the two team rows are parted by a heavy black line (5 frame px,
// 1/8 of a row) across the bars and the scores; and the clock panel (the slanted "diamond") moved left so its lower slanted corner meets
// the score column, as on the CHI v LA frame (its bottom-left corner sits at the scores' right edge there).
const S = 2, ROW = 40 * S, RG = 8 * S,  // loop pass 2: the line 5 -> 8 frame px, the panel 12 frame px left, tucked under the scores
   NAME = 165 * S, SCB = 65 * S, PAN = 240 * S, SLANT = 38;
const STRIP = 17 * S, DOWN = 47 * S, DW = 220 * S, PAD = 5 * S;
const CUT = Math.round((2 * ROW + RG) * Math.tan((SLANT * Math.PI) / 180));
const SCL = PAD + NAME, PANL = SCL + SCB - 12 * S;
const W = PANL + PAN + 4 * S, H = 2 * ROW + RG + 3 * S + STRIP + 3 * S + DOWN;
const CHROME = metal('#c8ccd1', 2, 0.42);

export default {
  id: 'xfl-nbc-01',
  size: { w: W, h: H },
  // no down and distance (before and after the game, between plays): the strip and the down box go
  sizeFor: (g) => ({ w: W, h: g.status === 'live' && g.football && g.football.short ? H : 2 * ROW + RG }),
  fonts: [FONTS.saira],
  css: `
.sb-xfl-nbc-01 { font-family: 'SB Saira', 'Arial Black', sans-serif; font-weight: 800; font-stretch: 112%; color: #fff; }
.sb-xfl-nbc-01 > div { position: absolute; box-sizing: border-box; }
/* the team rows: light silver, lit at the top; logo left, code right in dark capitals with a light edge */
.sb-xfl-nbc-01 .nm { left: ${PAD}px; width: ${NAME}px; height: ${ROW}px; background: linear-gradient(#dfe5e4, #b7c3c2 45%, #8f9a99 80%, #646d6c); box-shadow: inset 0 0 0 2px rgba(255,255,255,.5), 0 2px 3px rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: space-between; padding: 0 ${8 * S}px 0 ${4 * S}px; }
.sb-xfl-nbc-01 .nm .sb-logo { width: ${34 * S}px; height: ${32 * S}px; object-fit: contain; }
.sb-xfl-nbc-01 .ab { font-size: ${28 * S / 0.7}px; line-height: 1; white-space: nowrap; overflow: hidden; max-width: ${118 * S}px; text-shadow: ${textOutline(2, 'rgba(255,255,255,.55)')}; }
/* the heavy black line between the two team rows, across the bars and the scores */
.sb-xfl-nbc-01 .sep { left: ${PAD}px; top: ${ROW}px; width: ${NAME + SCB}px; height: ${RG}px; background: #050606; }
/* score boxes: black with a 4 px chrome rim, corners 6, standing right against the team's bar (the rim is the grey barrier) */
.sb-xfl-nbc-01 .sc { left: ${SCL}px; border-radius: 0 ${6 * S}px ${6 * S}px 0; width: ${SCB}px; height: ${ROW}px; background: ${CHROME}; padding: ${4 * S}px; z-index: 2; }
.sb-xfl-nbc-01 .sc > span { display: grid; place-items: center; width: 100%; height: 100%; background: #070808; border-radius: ${3 * S}px; font-size: ${25 * S / 0.7}px; line-height: 1; min-width: 0 !important; overflow: hidden; }
/* the clock panel: black inside chrome rims, both ends cut leaning ${SLANT} deg, a chrome line between clock and quarter */
.sb-xfl-nbc-01 .pan { left: ${PANL}px; top: 0; width: ${PAN}px; height: ${2 * ROW + RG}px; background: ${CHROME}; clip-path: polygon(${CUT}px 0, 100% 0, calc(100% - ${CUT}px) 100%, 0 100%); }
.sb-xfl-nbc-01 .pan > i { position: absolute; left: ${4 * S}px; right: ${4 * S}px; height: ${ROW - 4 * S}px; background: #070808; clip-path: polygon(${CUT / 2}px 0, 100% 0, calc(100% - ${CUT / 2}px) 100%, 0 100%);
  display: flex; align-items: center; justify-content: center; font-style: normal; font-size: ${25 * S / 0.7}px; line-height: 1; white-space: nowrap; }
.sb-xfl-nbc-01 .pan > i.t { top: ${3 * S}px; left: ${4 * S + CUT / 2}px; } .sb-xfl-nbc-01 .pan > i.b { bottom: ${3 * S}px; right: ${4 * S + CUT / 2}px; }
.sb-xfl-nbc-01 .pan > i.w { top: ${3 * S}px; bottom: ${3 * S}px; height: auto; left: ${4 * S + CUT / 4}px; right: ${4 * S + CUT / 4}px; clip-path: polygon(${(CUT * 3) / 4}px 0, 100% 0, calc(100% - ${(CUT * 3) / 4}px) 100%, 0 100%); font-size: ${14 * S / 0.7}px; }
.sb-xfl-nbc-01 small { font-size: .72em; }
.sb-xfl-nbc-01 .strip { left: 0; top: ${2 * ROW + RG + 3 * S}px; width: ${SCL + SCB + 20 * S}px; height: ${STRIP}px; background: ${CHROME}; clip-path: polygon(0 0, 100% 0, calc(100% - ${STRIP}px) 100%, 0 100%); }
.sb-xfl-nbc-01 .dn { left: ${PAD}px; top: ${2 * ROW + RG + 6 * S + STRIP}px; width: ${DW}px; height: ${DOWN}px; background: ${CHROME}; clip-path: polygon(0 0, 100% 0, calc(100% - ${Math.round(DOWN * 0.67)}px) 100%, 0 100%); }
.sb-xfl-nbc-01 .dn > span { position: absolute; inset: ${4 * S}px ${4 * S}px ${4 * S}px ${4 * S}px; background: #070808; clip-path: polygon(0 0, 100% 0, calc(100% - ${Math.round(DOWN * 0.6)}px) 100%, 0 100%);
  display: flex; align-items: center; padding-left: ${22 * S}px; font-size: ${25 * S / 0.7}px; line-height: 1; white-space: nowrap; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live', pre = g.status === 'pre';
    [g.away, g.home].forEach((t, k) => {
      const y = k * (ROW + RG) + 'px';
      const nm = el('div', 'nm'); nm.style.top = y;
      nm.appendChild(logo(t, 32 * S));
      const ab = el('span', 'ab', (t.abbr || '').toUpperCase()); ab.style.color = shade(teamColor(t, '#1a1c1c'), -0.6);   // dark, with a hint of the team's colour (New York's read dark green)
      nm.appendChild(fit(ab)); root.appendChild(nm);
      // before the game the score boxes hold each team's record (kit)
      const sc = el('div', 'sc'); sc.style.top = y;
      const v = scoreSlot(el('span', '', pre ? '' : t.score != null ? String(t.score) : ''), g);
      // three figures on either side: both scores smaller, so they stay inside their boxes
      if (!pre && Math.max(g.away.score || 0, g.home.score || 0) >= 100) v.style.fontSize = Math.round((25 * S / 0.7) * 0.75) + 'px';
      sc.appendChild(v); root.appendChild(sc);
    });
    root.appendChild(el('div', 'sep'));
    const pan = el('div', 'pan');
    if (live) {
      pan.appendChild(el('i', 't', g.clock || ''));
      const q = el('i', 'b'); q.append(g.period.label || '', el('small', '', g.period.word ? '' : g.period.suffix || '')); pan.appendChild(q);
    } else pan.appendChild(el('i', 'w', statusText(g, time)));
    root.appendChild(pan);
    const dn = live && g.football && g.football.short ? g.football.short : '';
    if (!dn) return;
    root.appendChild(el('div', 'strip'));
    const d = el('div', 'dn'); const s = el('span', '');
    const m = /^(\d)(ST|ND|RD|TH)(.*)$/.exec(dn);
    if (m) { const r = el('span', '', m[3]); r.style.whiteSpace = 'pre'; s.append(m[1], el('small', '', m[2]), r); }
    // a long down (4TH & GOAL) set smaller so it clears the slanted end
    if (dn.length > 8) s.style.fontSize = Math.round((25 * S / 0.7) * 0.74) + 'px';
    d.appendChild(s); root.appendChild(d);
  },
};
