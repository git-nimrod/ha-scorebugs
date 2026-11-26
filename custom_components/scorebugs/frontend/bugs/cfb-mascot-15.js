// "Mascot bar": after a college football bug. A long dark bar in a thin silver frame: each team its logo on a tile (light for the away team, in its colour for
// the home team), the school's name small and grey over its nickname in big white capitals, its timeouts as three gold blocks standing in
// a column, and its score dark on a white rounded plate; then the quarter in gold and the clock in white.
import { el, logo, statusText, teamColor, shade, scoreSlot, fit, gloss, FONTS } from '../kit.js';

// measured off the frame: a silver bracket cap at each end, and after the clock an empty dark
// stretch about 13% of the bar long before the right cap
const H = 72, CAP = 20, TILE = 102, NAME = 240, TO = 18, SCORE = 72, Q = 70, CLOCK = 96, EMPTY = 172;
const W = 2 * CAP + 2 * (TILE + NAME + TO + SCORE + 12) + Q + CLOCK + EMPTY + 20;

export default {
  id: 'cfb-mascot-15',
  size: { w: W, h: H },
  fonts: [FONTS.barlowCond700, FONTS.barlowCond500],
  css: `
.sb-cfb-mascot-15 { font-family: 'SB Barlow Condensed', 'Arial Narrow', sans-serif; font-weight: 700; color: #fff; display: flex; align-items: stretch; gap: 0; height: ${H}px; padding: 5px 4px; box-sizing: border-box;
  background: linear-gradient(#26272a, #0d0d0e 55%, #19191b); box-shadow: inset 0 0 0 2px #9aa0a6, inset 0 0 0 4px #1a1a1c, 0 3px 8px rgba(0,0,0,.55); border-radius: 4px; }
.sb-cfb-mascot-15 .cap { width: ${CAP}px; flex: none; margin: -2px 0; border-radius: 4px; background: linear-gradient(90deg, #6f747a, #e9ebee 45%, #9da2a8 70%, #50545a); box-shadow: inset 0 0 0 1px rgba(0,0,0,.5); }
.sb-cfb-mascot-15 .cap:first-child { margin-right: 6px; } .sb-cfb-mascot-15 .cap:last-child { margin-left: auto; }
.sb-cfb-mascot-15 .tile { width: ${TILE}px; flex: none; display: grid; place-items: center; overflow: hidden; }
.sb-cfb-mascot-15 .tile .sb-logo { width: 96px; height: 70px; object-fit: contain; }
.sb-cfb-mascot-15 .nm { width: ${NAME}px; flex: none; display: flex; flex-direction: column; justify-content: center; padding: 0 10px; box-sizing: border-box; overflow: hidden; }
.sb-cfb-mascot-15 .nm small { display: block; max-width: 100%; font-size: 19px; font-weight: 500; color: #a9adb3; line-height: 1; white-space: nowrap; text-transform: uppercase; }
.sb-cfb-mascot-15 .nm b { font-size: 34px; line-height: 1; white-space: nowrap; text-transform: uppercase; }
.sb-cfb-mascot-15 .to { width: ${TO}px; flex: none; display: flex; flex-direction: column; justify-content: center; gap: 4px; position: relative; }
/* the team with the ball: a small gold dot just before its timeouts, level with the nickname */
.sb-cfb-mascot-15 .to .pz { position: absolute; left: -17px; top: calc(60% - 3.5px); width: 7px; height: 7px; border-radius: 50%; background: #d2b10f; }
.sb-cfb-mascot-15 .to i { width: 9px; height: 12px; background: #f6c400; } .sb-cfb-mascot-15 .to i.used { background: #3a3a3c; }
.sb-cfb-mascot-15 .sc { width: ${SCORE}px; flex: none; margin: 4px 12px 4px 0; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(#ffffff, #d8dade); color: #111; font-size: 40px; }
.sb-cfb-mascot-15 .sc.rec { font-size: 20px; }
.sb-cfb-mascot-15 .q { width: ${Q}px; flex: none; display: grid; place-items: center; color: #f6c400; font-size: 32px; }
.sb-cfb-mascot-15 .ck { width: ${CLOCK}px; flex: none; display: grid; place-items: center; font-size: 32px; font-weight: 500; background: rgba(255,255,255,.04); }
.sb-cfb-mascot-15 .w { width: ${Q + CLOCK}px; flex: none; display: grid; place-items: center; font-size: 26px; }
`,
  draw(root, g, { time }) {
    const live = g.status === 'live';
    root.appendChild(el('i', 'cap'));
    [g.away, g.home].forEach((t, k) => {
      const c = teamColor(t, '#3a3f47');
      const tile = el('div', 'tile');
      tile.style.background = k ? 'linear-gradient(' + shade(c, 0.1) + ', ' + shade(c, -0.25) + ')' : gloss(50, 0.3) + ', linear-gradient(#f4f5f7, #a9adb3)';  // a glossy silver tile
      tile.appendChild(logo(t, 70));
      // the school over its nickname: "Georgia Bulldogs" -> GEORGIA / BULLDOGS
      const nick = t.name && t.longName && t.longName !== t.name && t.longName.endsWith(t.name) ? t.name : '';
      const school = nick ? t.longName.slice(0, -nick.length).trim() : t.longName || '';
      const nm = el('div', 'nm'); nm.append(fit(el('small', '', school)), fit(el('b', '', nick || t.name || t.abbr || '')));   // the school line fits too (stress: a long school ran past its box)
      const to = el('div', 'to'); if (live && t.timeouts != null) for (let i = 0; i < 3; i++) to.appendChild(el('i', i >= t.timeouts ? 'used' : ''));
      if (live && t.hasBall) to.appendChild(el('i', 'pz'));
      root.append(tile, nm, to, g.status === 'pre' ? el('span', 'sc rec', t.record || '') : scoreSlot(el('span', 'sc', t.score != null ? String(t.score) : ''), g));
    });
    if (live) root.append(el('span', 'q', g.period.word ? g.period.label : (g.period.label || '') + (g.period.suffix || '').toUpperCase()), el('span', 'ck', g.clock || ''));
    else root.appendChild(el('span', 'w', statusText(g, time)));
    root.appendChild(el('i', 'cap'));
  },
};
