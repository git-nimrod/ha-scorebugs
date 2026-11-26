// "Green box '06": after the free-to-air network's test cricket score box (2006; frame: the Ashes, England batting, a VHS-era still,
// 190 x 74 px of box). A small box at the top left: a near-black upper panel lit green from below with the batting side's letters and its
// wickets/runs ("ENG 7/118", the Australian order), and under it a darker green line ("LEADS BY 16").
// measured: upper panel 52 % of the box, its green glow rising from near black
// at the top (L 9) to L 35 at the foot (sample.py: horizon 25 %, +18 L to the foot); lower panel flat #001000; capitals 30 % of the box
// height on top, 26 % below; letters white with a soft green halo (the frame is blurred, so the halo is a guide).
// measured on a new 1080p still: the box sits in a black frame with a thin lit green edge (brightest along the top); the upper
// panel runs #002718 (L 13) at the top to #036b2f (L 39) at its foot, the lower one an even dark green #032e16 (L 13-16); the letters
// are a cream white with a hard black outline and a dark shadow down and right, the green only as a faint glow outside the black.
// Not on air: the network's own bug (never drawn). Data: the lead or deficit in a test, what is needed in a chase, else the overs.
import { el, fit, statusText, cricketState, textOutline, FONTS } from '../kit.js';

const W = 400, H = 156;

export default {
  id: 'cricket-nine-06',
  size: { w: W, h: H },
  fonts: [FONTS.barlowSemi600],
  css: `
.sb-cricket-nine-06 { font-family: 'SB Barlow Semi Condensed', 'Arial Narrow', sans-serif; font-weight: 600; color: #eef3e2; }
/* a fitted text is a block, so the kit can measure its room */
.sb-cricket-nine-06 [data-fit] { display: block; min-width: 0; max-width: 100%; }
/* sizes are outer sizes: padding inside them */
.sb-cricket-nine-06 *, .sb-cricket-nine-06 *::before { box-sizing: border-box; }
.sb-cricket-nine-06 .box { position: absolute; inset: 0; border-radius: 9px; background: #000; box-shadow: inset 0 0 0 1px rgba(60,190,110,.22), 0 0 4px rgba(60,220,110,.25); padding: 8px 14px 8px; display: grid; grid-template-rows: 52% 1fr; gap: 9px; overflow: hidden; }
/* upper panel: near black lit green from below (sampled on the 1080p still: #002718, L 13, at the top to #036b2f, L 39, at the foot) */
/* a wider black frame and gap round the panels, each panel with its own thin lit green edge (brightest along the top of the upper one), the lower panel a pill; stills: a reference frame */
.sb-cricket-nine-06 .up { border-radius: 10px 10px 4px 4px; box-shadow: inset 0 0 0 1px rgba(60,190,110,.6); background: radial-gradient(130% 70% at 52% 100%, rgba(10,140,60,.35), rgba(10,140,60,0)), linear-gradient(#001a0d 0%, #002718 18%, #044f27 55%, #036b2f 90%, #03722f 100%); display: flex; align-items: center; justify-content: space-between; padding: 0 16px 0 20px; font-size: 62px; line-height: 1; }
.sb-cricket-nine-06 .dn { border-radius: 4px 4px 16px 16px; box-shadow: inset 0 0 0 1px rgba(50,170,95,.45); background: linear-gradient(#021f10, #032e16 30%, #032a14); display: flex; align-items: center; justify-content: center; padding: 0 14px; font-size: 52px; line-height: 1; color: #dfead6; }
.sb-cricket-nine-06 .up span, .sb-cricket-nine-06 .dn span { text-shadow: ${textOutline(2, '#000')}, 3px 3px 2px rgba(0,0,0,.85), 0 0 8px rgba(90,255,120,.3); white-space: nowrap; }
.sb-cricket-nine-06 .up .r { margin-left: 18px; }
.sb-cricket-nine-06 .dn.small { font-size: 44px; }
`,
  draw(root, g, { time }) {
    const c = cricketState(g);
    const box = el('div', 'box'), up = el('div', 'up'), dn = el('div', 'dn');
    const ab = (t) => (t.abbr || '').toUpperCase();
    if (g.status === 'pre') {
      up.append(el('span', 'a', ab(g.home)), el('span', 'r', 'v ' + ab(g.away)));
      dn.appendChild(fit(el('span', '', statusText(g, time))));
    } else {
      // the Australian order: wickets / runs ("7/118"); all out or no wickets known: the runs alone
      const runs = c.runs == null ? '' : c.wkts != null && c.wkts < 10 ? c.wkts + '/' + c.runs : String(c.runs);
      up.append(fit(el('span', 'a', ab(c.bat))), fit(el('span', 'r', runs)));
      let line = '';
      if (c.result) line = c.result.text;
      else if (c.need != null) line = 'NEED ' + c.need + (c.ballsLeft > 0 ? ' OFF ' + c.ballsLeft : '');
      else if (c.lead != null) line = c.lead > 0 ? 'LEADS BY ' + c.lead : c.lead < 0 ? 'TRAILS BY ' + -c.lead : 'SCORES LEVEL';
      else if (c.overs) line = 'OVERS ' + c.overs;
      if (line.length > 14) dn.classList.add('small');
      dn.appendChild(fit(el('span', '', line)));
    }
    box.append(up, dn);
    root.appendChild(box);
  },
};
