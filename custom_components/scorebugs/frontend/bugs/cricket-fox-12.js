// "Slash bar '12": after the Australian T20 league's bar on pay TV (2011-12; frames: Brisbane Heat batting first, Dec 2011, and Sydney
// Sixers chasing, Jan 2012: the same package, so one bug with both states). A steel-teal glass band along the bottom carrying tabs cut
// with "/" ends: the batting side's tab in its colour with its logo, a white tab with wickets-runs ("0-65"), then steel label tabs
// ("RUNS NEEDED", "BALLS LEFT", "OVER") each followed by a white figure tab; under the band a pale strip with a line of figures.
// measured: tab ends lean 30 deg; tabs 51 % of the height, the strip
// 40 %; team tab 14.6 % of the width, white figure tabs 13 %, labels 8 %; band #3a6884 lit +9 L at the top with a light top line;
// white tabs #f2f8f6 at the top to #a9c8ca at the foot; strip #d4e2e4 with a soft horizon at 47 %; figures black, cap 63 % of a tab.
// Left out: the speed-gun tab and the batters' and bowler's figures (no data); the strip carries the run rates and the target instead.
// on a reference frame crop-1 and crop-2 (1080p): the over is one steel tab with OVER and the
// figure in big white letters (ours had a small OVER label and a white figure tab); the figures' capitals 0.354 of the bar (ours
// 0.319): 45 px (the on-air face is a little narrower). Not changed: the band on air, sampled per row, has a dark top line, a lit band
// at 6-17 % (#93bcd0 at its peak), then #4a768f falling to #2a5369 at the foot (three tries lowered the score's edges or structure).
import { el, fit, logo, statusText, cricketState, teamColor, glassCover, FONTS } from '../kit.js';

// "Move right side over much more to truncate size left/right": the band ends just past the widest line of tabs
// (runs needed, balls left) instead of running 1300 px with an empty right half
const W = 1000, H = 91;

export default {
  id: 'cricket-fox-12',
  size: { w: W, h: H },
  fonts: [FONTS.montserrat],
  css: `
.sb-cricket-fox-12 { font-family: 'SB Montserrat', 'Arial Black', sans-serif; font-weight: 800; color: #111; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-fox-12 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-fox-12 *, .sb-cricket-fox-12 *::before { box-sizing: border-box; }
/* the steel-teal band and the pale strip under it (sampled: #3a6884, +9 L on top, a light top line; strip #d4e2e4, horizon 47 %) */
.sb-cricket-fox-12 .band { position: absolute; left: 0; right: 0; top: 0; height: 51px; background: linear-gradient(#5e8ba4 0%, #3d6c86 12%, #396787 50%, #3a687c 75%, #295669 100%); box-shadow: inset 0 1px 0 rgba(200,235,245,.55); }
.sb-cricket-fox-12 .strip { position: absolute; left: 0; right: 0; top: 52px; bottom: 0; background: linear-gradient(#cee9eb 0%, #dfe7e7 25%, #e8f0f2 45%, #d0d8d9 55%, #cbd0d2 100%); box-shadow: inset 0 1px 0 #fff, 0 -1px 0 #213f4c; display: flex; align-items: center; padding: 0 0 0 30px; font-size: 28px; gap: 34px; white-space: nowrap; }
.sb-cricket-fox-12 .tabs { position: absolute; left: 14px; top: 3px; height: 46px; display: flex; gap: 5px; }
/* a tab: a parallelogram with "/" ends (30 deg); its contents stand upright */
.sb-cricket-fox-12 .tab { position: relative; height: 100%; display: grid; place-items: center; padding: 0 16px; }
.sb-cricket-fox-12 .tab::before { content: ''; position: absolute; inset: 0; transform: skewX(-30deg); background: var(--bg); box-shadow: var(--sh, none); border-radius: 2px; }
.sb-cricket-fox-12 .tab > * { position: relative; }
.sb-cricket-fox-12 .fig { --bg: linear-gradient(#f2f8f6 0%, #e0eceb 25%, #d4e0e0 45%, #c7d5d7 55%, #b6cbcc 75%, #a9c8ca 100%); --sh: inset 0 1px 0 #fff; min-width: 170px; font-size: 45px; line-height: 1; }
.sb-cricket-fox-12 .lab { --bg: linear-gradient(#3c6d88 0%, #31627c 20%, #346073 50%, #4f7b8c 74%, #3d6070 100%); --sh: inset 0 1px 0 rgba(200,235,245,.6), inset 0 0 0 1px rgba(160,200,215,.35); min-width: 106px; color: #fff; font-size: 20px; line-height: .95; text-align: center; font-weight: 700; }
/* the over: one steel tab, OVER and the figure in big white letters (2011 and 2012 stills: "OVER 11.4", "OVER 10.3") */
.sb-cricket-fox-12 .lab.big { min-width: 300px; font-size: 45px; font-weight: 800; line-height: 1; letter-spacing: 3px; }
.sb-cricket-fox-12 .lab.big > span { display: flex; gap: 28px; }
.sb-cricket-fox-12 .team { min-width: 190px; color: #fff; display: flex; gap: 10px; font-size: 26px; }
.sb-cricket-fox-12 .team .sb-logo { width: 54px; height: 40px; object-fit: contain; }
.sb-cricket-fox-12 .team .tn { display: flex; align-items: center; gap: 10px; }
.sb-cricket-fox-12 .strip b { font-weight: 800; }
`,
  draw(root, g, { time }) {
    const c = cricketState(g), ab = (t) => (t.abbr || '').toUpperCase();
    const band = el('div', 'band'), strip = el('div', 'strip'), tabs = el('div', 'tabs');
    const teamTab = (t) => {
      const tab = el('div', 'tab team'), col = teamColor(t, '#7a2d8c');
      // the team's colour lit from the top with a soft step past the middle (sampled on the Sixers' magenta: horizon 68 %, step 8)
      tab.style.setProperty('--bg', glassCover(col, { top: 8, mid: 4, horizon: 62, step: 6, foot: -4 }).background);
      tab.style.setProperty('--sh', 'inset 0 1px 0 rgba(255,255,255,.35)');
      const tn = el('div', 'tn'); tn.append(logo(t, 40), el('span', '', ab(t))); tab.appendChild(tn); return tab;
    };
    const figTab = (txt) => { const t = el('div', 'tab fig'); t.appendChild(fit(el('span', '', txt))); return t; };
    const labTab = (a, b) => { const t = el('div', 'tab lab'); const s = el('span', ''); s.append(a); if (b) s.append(el('br'), b); t.appendChild(s); return t; };
    if (g.status === 'pre') {
      tabs.append(teamTab(g.home), labTab('V'), teamTab(g.away), figTab(statusText(g, time)));
      strip.appendChild(fit(el('span', '', ((g.home.longName || g.home.name) + ' v ' + (g.away.longName || g.away.name)).toUpperCase())));
    } else {
      // the Australian order: wickets-runs ("3-62"); all out or no wickets known: the runs alone
      const runs = c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.wkts + '-' + c.runs : String(c.runs);
      tabs.append(teamTab(c.bat), figTab(runs));
      if (c.need != null && !c.result) tabs.append(labTab('RUNS', 'NEEDED'), figTab(String(c.need)), ...(c.ballsLeft > 0 ? [labTab('BALLS', 'LEFT'), figTab(String(c.ballsLeft))] : []));
      else if (c.overs) { const t = el('div', 'tab lab big'), s = el('span', ''); s.append(el('span', '', 'OVER'), el('span', '', c.overs)); t.appendChild(s); tabs.appendChild(t); }
      const bits = [];
      if (c.result) bits.push(c.result.text);
      else {
        if (c.rate != null) bits.push('CURRENT RATE: ' + c.rate.toFixed(2));
        if (c.need != null && c.ballsLeft > 0) bits.push('REQUIRED RATE: ' + (c.need * 6 / c.ballsLeft).toFixed(2));
        else if (c.target != null) bits.push('TARGET: ' + c.target);
        else if (c.lead != null) bits.push(c.lead >= 0 ? 'LEAD: ' + c.lead : 'TRAIL: ' + -c.lead);
      }
      bits.forEach((b) => strip.appendChild(el('span', '', b)));
    }
    band.appendChild(tabs);
    root.append(band, strip);
  },
};
