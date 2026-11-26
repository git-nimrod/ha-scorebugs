// Scorebugs: broadcast-style scorebugs for Home Assistant. This file is the shared part every bug uses, and the plug other code calls.
// Loaded only when something on the page shows a scorebug, so a screen that never shows one never downloads any of it.
//
//   mount(root, host, opts)   the plug: draws the games of the host's sensors as scorebugs into `root` (see HOST below)
//   gameOf(state)             a Team Tracker-style sensor state -> one tidy game record (pure; tested)
//   helpers                   what every bug file uses (logos, ordinals, timeout pips, base diamond, fonts)
//
// Each bug lives in its own file (bugs/<id>.js): { id, size: {w, h}, fonts: [...], css, draw(root, game, h) }. It is drawn at the
// broadcast's own pixel size and then scaled to the box it is given, so it looks the same at any size. No network logos or wordmarks
// are ever drawn; team and league logos load at display time from ESPN's image service, and nothing of theirs is stored here.
//
// HOST: how the bugs reach Home Assistant without knowing who is asking (the dashboard card, Glass Panes, a test).
//   { entities: [entity ids], state(id) -> Promise<state>, refresh(render, entities, ms), width, align: left|center|right,
//     time: { sameDay, parts, ampm } (optional), icon(name, px) -> Element (optional), callWS(msg) -> Promise (optional) }
// Without callWS (Glass Panes with no Scorebugs integration installed) everything still draws; only the extra logo versions
// (secondary, white, black) fall back to the logo the sensor gives.

/** The plug's version. A caller checks it and keeps its own copy when the major number differs from the one it was written for. */
export const API = 1;
// which copy of the code a screen is running, shown under the review cards so an old copy held by a browser is easy to spot; changed on every install
export const BUILD = '25 Nov 2026 · z42';

/** A new element with an optional class and text. */
export function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };
const okState = (s) => !!s && !['unknown', 'unavailable', '', null, undefined].includes(s.state);

/** Plain time helpers for hosts that bring none (the dashboard card): local time, 12-hour clock. */
export const plainTime = {
  sameDay: (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
  parts: (d) => ({ wd: d.getDay(), h: d.getHours() }),
  ampm: (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/\s+/g, ' '),
};

// ---------------------------------------------------------------- the game record

const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'TH' : ['TH', 'ST', 'ND', 'RD'][n % 10] || 'TH');
const num = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));
const SPORT = { football: 'football', basketball: 'basketball', hockey: 'hockey', baseball: 'baseball', soccer: 'soccer', golf: 'golf', racing: 'racing', tennis: 'tennis', mma: 'mma',
  'australian-football': 'australian-football', volleyball: 'volleyball', cricket: 'cricket',
  // added with ESPN's other leagues: they draw the generic bar until their own looks are built
  rugby: 'rugby', 'rugby-league': 'rugby-league', lacrosse: 'lacrosse', 'field-hockey': 'field-hockey', 'water-polo': 'water-polo' };
// ESPN's address part for a league, for sensors that do not give it (Team Tracker gives sport_path and league_path).
const LEAGUE_PATH = { NFL: 'nfl', NCAAF: 'college-football', NBA: 'nba', WNBA: 'wnba', NCAAM: 'mens-college-basketball', NCAAW: 'womens-college-basketball',
  NHL: 'nhl', MLB: 'mlb', MLS: 'usa.1', NWSL: 'usa.nwsl', EPL: 'eng.1', BUND: 'ger.1', LIGA: 'esp.1', LIG1: 'fra.1', SERA: 'ita.1', CL: 'uefa.champions', WC: 'fifa.world' };

// sports whose clock is the running minute ("54'") over two halves: soccer, and rugby union and league (ESPN gives "81'")
const MINUTE_SPORTS = ['soccer', 'rugby', 'rugby-league'];

/** "12:00 - 3rd" -> "12:00"; "67'" stays; a pre-game date line gives ''. */
function clockOf(raw, sport) {
  const s = String(raw || '').trim();
  if (MINUTE_SPORTS.includes(sport)) { const m = /(\d+)'(?:\s*\+\s*(\d+)'?)?/.exec(s); return m ? m[1] + "'" + (m[2] ? '+' + m[2] : '') : ''; }   // "67'", "45'+2"
  const m = /^(\d{1,2}:\d{2}|:\d{2}|\d{1,2}\.\d)/.exec(s);
  return m ? m[1] : '';
}

/** The period as broadcasts write it: { n, label, suffix } where label is the number part ("3") and suffix "RD", or a word ("OT", "HALF"). */
function periodOf(sport, league, n, clockText) {
  if (!n) return { n: 0, label: '', suffix: '' };
  if (sport === 'tennis' || sport === 'mma' || sport === 'volleyball' || sport === 'cricket') return { n, label: String(n), suffix: '' };   // the set / round / innings
  if (sport === 'baseball') {
    const t = String(clockText || '').toLowerCase();
    const half = /^(top|mid)/.test(t) ? 'top' : /^(bot|end)/.test(t) ? 'bot' : null;
    return { n, label: String(n), suffix: ORD(n).replace(/^\d+/, ''), half };
  }
  // a soccer half as the short "2H": "2ND HALF" wrapped, ran past slanted ends or crowded the clock on the other sports' bugs that show a
  // soccer game; the soccer bugs show the running minute alone
  if (MINUTE_SPORTS.includes(sport)) return n <= 2 ? { n, label: n === 1 ? '1H' : '2H', suffix: '', word: true } : { n, label: 'ET', suffix: '', word: true };
  const regular = sport === 'hockey' ? 3 : league === 'NCAAM' ? 2 : 4;   // men's college basketball plays halves; women's, quarters
  if (n > regular) {
    const ot = n - regular;
    return { n, label: sport === 'hockey' && league !== 'NHL-PLAYOFFS' && ot > 1 ? 'SO' : ot > 1 ? ot + 'OT' : 'OT', suffix: '', word: true };
  }
  return { n, label: String(n), suffix: ORD(n).replace(/^\d+/, '') };
}

/**
 * One tidy game from a Team Tracker sensor state (attributes team_* and opponent_*), or null when there is nothing to show.
 * Teams come out as away and home (the order US broadcasts use; a soccer bug may flip them).
 */
// Teams whose colour on air differs from ESPN's first colour. color: the panel colour, kept as it is
// (not darkened for white letters); outline: the logo always gets its outline on that colour; logo 'black': the logo drawn as a black
// silhouette with a light outline. Light colours (gold) take dark letters, as on air; the oranges keep white letters (see inkOn).
export const ON_AIR = {
  NFL: { DEN: { color: '#fb4f14', outline: true }, CLE: { color: '#ff3c00', outline: true }, NO: { color: '#d3bc8d', logo: 'black' } },
  NHL: { NSH: { color: '#fdba31', outline: true } },  // white letters on the gold, for legibility (inkOn + legible)
};
export function gameOf(s, now = Date.now()) {
  if (!okState(s) || !s.attributes) return null;
  const a = s.attributes, state = String(s.state || a.state || '').toUpperCase();
  const status = state === 'IN' ? 'live' : state === 'POST' ? 'final' : state === 'PRE' ? 'pre' : null;
  if (!status) return null;
  const sport = SPORT[String(a.sport || '').toLowerCase()] || 'other', league = String(a.league || '').toUpperCase();
  if (a.kind === 'board') {
    // golf and racing: a leaderboard, not two teams (rows and the followed player come straight from Scorebugs' sensor)
    return { kind: 'board', sport, league, status, starts: Date.parse(a.date) || now, event: a.event_name || '', circuit: a.circuit || '', city: a.city || '', country: a.country || '',
      session: a.session || '', roundNo: num(a.round), lap: num(a.lap), clockText: a.clock || '', par: Array.isArray(a.par) ? a.par : [],
      rows: Array.isArray(a.rows) ? a.rows : [], player: a.player && typeof a.player === 'object' ? a.player : null,
      tv: a.tv_network || '', leagueLogo: a.league_logo || '', eventLogo: a.event_logo || '', note: '', away: { abbr: '' }, home: { abbr: '' } };
  }
  const side = (p) => ({
    id: a[p + '_id'], abbr: a[p + '_abbr'] || '', name: a[p + '_name'] || a[p + '_abbr'] || '', longName: a[p + '_long_name'] || '',
    logo: a[p + '_logo'] || '', color: (a[p + '_colors'] || [])[0] || '', color2: (a[p + '_colors'] || [])[1] || '',
    score: num(a[p + '_score']), record: a[p + '_record'] || '', rank: num(a[p + '_rank']), seed: num(a[p + '_seed']), timeouts: num(a[p + '_timeouts']),
    winner: a[p + '_winner'] === true, shots: num(a[p + '_shots_on_target']), hasBall: false,
    // basketball (Scorebugs' sensors, live NBA and WNBA games): team fouls this period, fouls to give, and the bonus this team shoots
    fouls: num(a[p + '_fouls']), foulsToGive: num(a[p + '_fouls_to_give']), bonus: ['single', 'double'].includes(a[p + '_bonus']) ? a[p + '_bonus'] : '',
    // Scorebugs' own sensors carry the followed team's logo versions and its My teams logo choice
    logos: a[p + '_logos'] && typeof a[p + '_logos'] === 'object' ? a[p + '_logos'] : null, logoStyle: a[p + '_logo_style'] || '',
    ownLogo: a[p + '_own_logo'] || '', ownLogoAt: a[p + '_own_logo_at'] || '',   // a picture the person uploaded for this team (My teams)
    // tennis: games per set (and tiebreak points); MMA: nothing extra
    sets: Array.isArray(a[p + '_sets']) ? a[p + '_sets'] : null, tiebreaks: Array.isArray(a[p + '_tiebreaks']) ? a[p + '_tiebreaks'] : null,
    // AFL: goals and behinds ("12.17") and the quarters; cricket: wickets, overs and the score as the feed writes it ("278/8")
    goals: num(a[p + '_goals']), behinds: num(a[p + '_behinds']), quarters: Array.isArray(a[p + '_quarters']) ? a[p + '_quarters'] : null,
    wickets: num(a[p + '_wickets']), overs: a[p + '_overs'] != null ? String(a[p + '_overs']) : '', scoreText: a[p + '_score_text'] || '',
  });
  const team = side('team'), opp = side('opponent');
  team.followed = true;   // the team the sensor follows (team_*): its team rule comes first (bug_by_team)
  // timeouts, fouls and the bonus only while the game is on:
  // a feed that still gives them after the final (or before the tip) gives a bug nothing to draw
  if (status !== 'live') [team, opp].forEach((t) => { t.timeouts = null; t.fouls = null; t.foulsToGive = null; t.bonus = ''; });
  [team, opp].forEach((t) => { const o = (ON_AIR[league] || {})[t.abbr]; if (o) { t.onAir = o; t.color = o.color; } });
  const home = a.team_homeaway === 'away' ? opp : team, away = home === team ? opp : team;
  if (a.possession != null && a.possession !== '') [away, home].forEach((t) => { t.hasBall = String(t.id) === String(a.possession); });
  // no score before the game: a feed's pre-game "0" filled the score boxes, so a bug that shows a score whenever there is one drew 0-0
  // where each team's record belongs
  if (status === 'pre') [away, home].forEach((t) => { t.score = null; });
  pairColors(away, home);
  const g = {
    sport, league, status, starts: Date.parse(a.date) || now, tv: a.tv_network || '', lastPlay: a.last_play || '',
    sportPath: a.sport_path || sport, leaguePath: a.league_path || LEAGUE_PATH[league] || '',
    season: String(a.season || ''), series: a.series_summary || '',
    clock: status === 'live' ? clockOf(a.clock, sport) : '', clockSec: status === 'live' ? num(a.clock_seconds) : null, period: periodOf(sport, league, num(a.quarter != null ? a.quarter : a.period), a.clock),
    away, home,
  };
  // in the regular season a playoff-style note (a round, a series game, a final, a cup or tournament stage) is dropped, so no bug shows it
  g.note = a.game_note || '';
  if (g.season && !/post/i.test(g.season) && POSTSEASON_NOTE.test(g.note)) { g.note = ''; g.series = ''; }
  g.event = a.event_name || '';
  // the look Scorebugs' settings give this team's games (its Look entity, else the overall one): "", "network" or a bug id
  g.look = String(a.bug_look || '');
  g.fightClock = a.fight_clock || '';
  g.eventLogo = a.event_logo || '';
  g.round = roundOf(g.note, g.season, g.series, away, home);
  if (sport === 'football') {
    const dd = String(a.down_distance_text || '');
    const m = /^(\d)(?:st|nd|rd|th)\s*&\s*(\w+)/i.exec(dd);
    g.football = { text: dd, down: m ? Number(m[1]) : null, distance: m ? m[2] : null, short: m ? ORD(Number(m[1])) + ' & ' + m[2].toUpperCase() : '' };
  }
  if (sport === 'baseball') {
    g.baseball = { outs: num(a.outs) || 0, balls: num(a.balls) || 0, strikes: num(a.strikes) || 0, bases: [!!a.on_first, !!a.on_second, !!a.on_third], half: g.period.half };
    // the pitcher and batter of a live game (Scorebugs' sensors; Team Tracker has none): full name, short name, last name; the pitch count
    const who = (k) => { const full = status === 'live' ? String(a[k] || '') : ''; return { name: full, short: full ? String(a[k + '_short'] || full) : '', last: full ? lastName(full) : '' }; };
    g.baseball.pitcher = who('pitcher'); g.baseball.batter = who('batter');
    g.baseball.pitches = status === 'live' && g.baseball.pitcher.name ? num(a.pitch_count) : null;
  }
  if (sport === 'soccer') {
    // possession: Scorebugs' own sensors give it per team; with Team Tracker it is only inside the last-play text
    const m = /(\d+)%[^\d]+(\d+)%/.exec(g.lastPlay), pa = num(a[(home === team ? 'opponent' : 'team') + '_possession']), ph = num(a[(home === team ? 'team' : 'opponent') + '_possession']);
    const minute = /(\d+)'(?:\s*\+\s*(\d+))?/.exec(String(a.clock || ''));
    g.soccer = { possession: pa != null && ph != null ? [pa, ph] : m ? [Number(m[1]), Number(m[2])] : null, added: minute && minute[2] ? Number(minute[2]) : 0 };
  }
  if (sport === 'hockey') g.hockey = { powerPlay: status === 'live' && a.power_play === true, emptyNet: status === 'live' && a.empty_net === true };
  g.timeoutsTotal = timeoutCount(g);
  g.leagueLogo = a.league_logo || '';
  return g;
}

/** A player's last name for a pitcher line: "Tarik Skubal" -> "Skubal", "Ha-Seong Kim" -> "Kim", "Vladimir Guerrero Jr." -> "Guerrero Jr.". */
export function lastName(full) {
  const w = String(full || '').trim().split(/\s+/);
  if (w.length < 2) return w[0] || '';
  return /^(jr|sr|ii|iii|iv)\.?$/i.test(w[w.length - 1]) && w.length > 2 ? w.slice(-2).join(' ') : w[w.length - 1];
}

/** How many timeouts a team has in this game's sport: football 3 a half, NBA 7 a game, WNBA and college basketball 4, hockey 1. */
export function timeoutCount(g) {
  if (!g) return 3;
  if (g.sport === 'basketball') return g.league === 'NBA' ? 7 : 4;
  return g.sport === 'hockey' ? 1 : 3;
}

/**
 * A bug made for one sport drawing another sport's game (football, basketball and hockey share bugs): its timeout pips are counted
 * again for the game's sport (3 dashes on a football bug become 7 for an NBA game, 7 on an NBA bug become 3 for football), in the
 * room the bug gave them; a team whose timeouts the feed does not give loses its pips. A bug's own sport is left exactly as drawn.
 */
export function fitPips(stage, g, bugSport) {
  if (!stage || !g || !bugSport || g.sport === bugSport || !SHARED_SPORTS.includes(g.sport) || !SHARED_SPORTS.includes(bugSport)) return;
  const n = timeoutCount(g);
  stage.querySelectorAll('[data-pips]').forEach((box) => {
    const left = box.dataset.left === '' || box.dataset.left == null ? null : Number(box.dataset.left);
    if (left == null || !Number.isFinite(left)) { box.style.visibility = 'hidden'; return; }
    const kids = [...box.children];
    if (!kids.length || kids.length === n) return;
    const w0 = box.offsetWidth || 0, iw = kids[0].offsetWidth || 0, gap = kids.length > 1 ? (w0 - iw * kids.length) / (kids.length - 1) : 0;
    kids.forEach((k) => k.remove());
    for (let i = 0; i < n; i++) {
      const p = el('i', i >= left ? 'used' : '');
      p.style.cssText = kids[0].style.cssText;   // a bug may colour its pips inline (its team's colour)
      box.appendChild(p);
    }
    // more pips than the bug made room for: each one narrower, so they fill the same width
    if (n > kids.length && w0 > 0 && iw > 0) {
      const w = Math.max(3, (w0 - Math.max(0, gap) * (n - 1)) / n);
      if (w < iw) box.querySelectorAll('i').forEach((p) => { p.style.width = w.toFixed(1) + 'px'; p.style.minWidth = '0'; });
    }
    box.dataset.left = String(left); box.dataset.pips = String(n);
  });
}

// ---- playoff dress. ESPN names the round in the game's note ("East 1st Round - Game 2", "West Finals - Game 2", "NBA Finals -
// Game 7", "NFC Wild Card Playoffs", "AFC Championship", "NLDS - Game 3", "World Series - Game 2", "Super Bowl LX") and the series in
// its summary ("CAR leads series 2-1", "Series tied 1-1"). A bug that has playoff looks wears the one that fits.

/** The levels of dress, in order. A bug lists the ones it has (catalogue `dresses`); a missing one falls back to the level below. */
export const DRESSES = ['regular', 'playoffs', 'conf-finals', 'finals'];
const FINALS = /\b(NBA Finals|WNBA Finals|Stanley Cup Final|World Series|Super Bowl|MLS Cup|NWSL Championship|National Championship|Grey Cup)\b|^Final\b/i;
const SEMIS = /\b((East|West|Eastern|Western)( Conference)? Finals?|Conference Finals?|Division Finals?|ALCS|NLCS|(AFC|NFC|AL|NL) Championship|Final Four|Semifinals?)\b/i;

/** Words that mark a note as a playoff or tournament stage (dropped in the regular season, see gameOf). */
export const POSTSEASON_NOTE = /playoff|post-?season|\bround\b|\bgame \d|series|final|semifinal|quarterfinal|wild ?card|divisional|championship|bowl\b|\bcup\b|tournament|play-?in|elimination|knockout|\b(alds|nlds|alcs|nlcs)\b/i;

/** The round of a game: { dress, label: 'WEST 1st ROUND', game: 'GAME 1', wins: { away, home } | null }. */
export function roundOf(note, season, series, away, home) {
  const n = String(note || '').trim();
  // the season decides; the note's wording only when no season is given
  const post = season ? /post/i.test(season) : (FINALS.test(n) || SEMIS.test(n) || /playoff|round|wild card|divisional/i.test(n));
  const dress = !post ? 'regular' : FINALS.test(n) ? 'finals' : SEMIS.test(n) ? 'conf-finals' : 'playoffs';
  const [label, game] = n.split(/\s+-\s+/);
  const up = (x) => String(x || '').toUpperCase().replace(/(\d)(ST|ND|RD|TH)\b/g, (m, d, s) => d + s.toLowerCase());
  let wins = null;
  const lead = /^(\w+) leads? series (\d+)-(\d+)/i.exec(series || ''), tied = /tied (\d+)-(\d+)/i.exec(series || '');
  if (lead) {
    const a = String(away.abbr || '').toUpperCase() === lead[1].toUpperCase();
    wins = a ? { away: +lead[2], home: +lead[3] } : { away: +lead[3], home: +lead[2] };
  } else if (tied) wins = { away: +tied[1], home: +tied[2] };
  return { dress, label: up(label), game: up(game), wins };
}

/** The dress a bug wears: the one asked for (options.bug_dress) or the game's own, stepped down to one the bug has. */
export function dressFor(g, bug, opts) {
  const want = opts && DRESSES.includes(opts.bug_dress) ? opts.bug_dress : (g.round || {}).dress || 'regular';
  const has = (bug && bug.dresses) || ['regular'];
  for (let i = DRESSES.indexOf(want); i > 0; i--) if (has.includes(DRESSES[i])) return DRESSES[i];
  return 'regular';
}

/** Which games to show, in order: live, then finals of the last 18 hours, then today's games; `next` adds the coming week's. */
export function gamesToShow(games, now, opts) {
  const h = 3600000, max = opts.max_games || 3;
  if (opts.demo === 'review') return games.filter(Boolean);   // the review card: before, live, final, in that order
  const keep = games.filter(Boolean).filter((g) => g.status === 'live' || (g.status === 'final' && now - g.starts < 18 * h) ||
    (g.status === 'pre' && g.starts - now < (opts.show_next === false ? 18 : 7 * 24) * h && g.starts > now - 3 * h));
  // two followed teams playing each other: one game, from the home team's sensor (so the home team's look is the one used)
  const seen = new Map();
  keep.forEach((g) => {
    const k = [g.league, g.starts, ...[g.away && g.away.abbr, g.home && g.home.abbr].sort()].join('|');
    const had = seen.get(k);
    if (!had || (g.home && g.home.followed && !(had.home && had.home.followed))) seen.set(k, g);
  });
  const rank = { live: 0, final: 1, pre: 2 };
  return [...seen.values()].sort((x, y) => rank[x.status] - rank[y.status] || x.starts - y.starts).slice(0, max);
}

// ---------------------------------------------------------------- helpers for the bug files

/**
 * Shared design tokens: the rules every bug follows instead of its own numbers.
 * accentMin a team's second colour is used for its letters on its own colour only above this contrast (3:1 plus a margin for gradients)
 * inkMin team ink: white on a team colour when it reaches this contrast, else whichever of white and dark reads better
 * logoBlend a logo whose solid pixels match the panel behind it (within logoBlendDE, CIEDE2000) more than this share gets an outline
 * logoAlpha alpha above which a logo pixel counts as solid artwork (blend check)
 * logoMargin empty margin (share of the file) a logo file must have on some side before it is cut to its artwork
 * whiteCut in a white mark, logo pixels lighter than this (0-1) are the logo's own white details and are cut out
 * fitFloor how far a name may be squeezed sideways before its short form is used
 * scoreDigits digits a score slot keeps room for, by sport, so neighbours never move when a score gains a digit
 * figure width of one tabular figure, in em, in the open faces the bugs use, at their widest settings (Saira 112-125 % bold: about 0.7)
 */
export const TOKENS = {
  accentMin: 3.5, inkMin: 4.5, inkLight: '#ffffff', inkDark: '#111111',
  logoBlend: 0.4, logoBlendDE: 16, logoAlpha: 0.6, logoMargin: 0.02,
  fitFloor: 0.72,
  whiteCut: 0.82,
  scoreDigits: { basketball: 3, default: 2 },
  figure: 0.7,
};

/** Shared open faces a bug can list in its `fonts` (variable files: one file covers every weight, and Saira every width too). */
export const FONTS = {
  saira: { family: 'SB Saira', file: 'saira-latin-var.woff2', desc: { weight: '100 900', stretch: '50% 125%' } },
  sairaItalic: { family: 'SB Saira Italic', file: 'saira-latin-var-italic.woff2', desc: { weight: '100 900', stretch: '50% 125%' } },
  interTight: { family: 'SB Inter Tight', file: 'inter-tight-latin-var.woff2', desc: { weight: '100 900' } },
  montserrat: { family: 'SB Montserrat', file: 'montserrat-latin-wght-normal.woff2', desc: { weight: '100 900' } },
  bangers: { family: 'SB Bangers', file: 'bangers-latin-400.woff2', desc: { weight: '400' } },
  playfair: { family: 'SB Playfair', file: 'playfair-display-latin-var.woff2', desc: { weight: '400 900' } },
  // Added in the fidelity pass. `cap` = the face's cap height / em (from its OS/2 table): a bug measured "cap height N
  // px" on a frame sets font-size N / cap (capSize below). The ascent/descent/line-gap overrides pin the line box to the face's own
  // metrics in every browser, so a baseline measured on a frame lands at the same place.
  openSans: { family: 'SB Open Sans', file: 'open-sans-latin-var.woff2', cap: 0.7139, desc: { weight: '300 800', stretch: '75% 100%', ascentOverride: '106.88%', descentOverride: '29.3%', lineGapOverride: '0%' } },
  michroma: { family: 'SB Michroma', file: 'michroma-latin-400.woff2', cap: 0.75, desc: { weight: '400', ascentOverride: '115.62%', descentOverride: '26.56%', lineGapOverride: '0%' } },
  kanit500: { family: 'SB Kanit', file: 'kanit-latin-500.woff2', cap: 0.644, desc: { weight: '500', ascentOverride: '110%', descentOverride: '39.5%', lineGapOverride: '0%' } },
  kanit600: { family: 'SB Kanit', file: 'kanit-latin-600.woff2', cap: 0.644, desc: { weight: '600', ascentOverride: '110%', descentOverride: '39.5%', lineGapOverride: '0%' } },
  kanit600i: { family: 'SB Kanit', file: 'kanit-latin-600-italic.woff2', cap: 0.644, desc: { weight: '600', style: 'italic', ascentOverride: '110%', descentOverride: '39.5%', lineGapOverride: '0%' } },
  kanit700: { family: 'SB Kanit', file: 'kanit-latin-700.woff2', cap: 0.644, desc: { weight: '700', ascentOverride: '110%', descentOverride: '39.5%', lineGapOverride: '0%' } },
  roboto: { family: 'SB Roboto', file: 'roboto-latin-var.woff2', cap: 0.7109, desc: { weight: '100 900', stretch: '75% 100%', ascentOverride: '92.77%', descentOverride: '24.41%', lineGapOverride: '0%' } },
  robotoItalic: { family: 'SB Roboto', file: 'roboto-latin-var-italic.woff2', cap: 0.7109, desc: { weight: '100 900', stretch: '75% 100%', style: 'italic', ascentOverride: '92.77%', descentOverride: '24.41%', lineGapOverride: '0%' } },
  barlowSemi700: { family: 'SB Barlow Semi Condensed', file: 'barlow-semi-condensed-latin-700.woff2', cap: 0.7, desc: { weight: '700', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowSemi700i: { family: 'SB Barlow Semi Condensed', file: 'barlow-semi-condensed-latin-700-italic.woff2', cap: 0.7, desc: { weight: '700', style: 'italic', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowSemi800i: { family: 'SB Barlow Semi Condensed', file: 'barlow-semi-condensed-latin-800-italic.woff2', cap: 0.7, desc: { weight: '800', style: 'italic', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  sans3: { family: 'SB Sans Three', file: 'source-sans-3-latin-var.woff2', cap: 0.66, desc: { weight: '200 900', ascentOverride: '102.4%', descentOverride: '40%', lineGapOverride: '0%' } },
  outfit: { family: 'SB Outfit', file: 'outfit-latin-var.woff2', cap: 0.676, desc: { weight: '100 900', ascentOverride: '100%', descentOverride: '26%', lineGapOverride: '0%' } },
  // Font matching: the reference pack's free match for each broadcast (specs/*_fonts.json), Latin-subset like the rest.
  barlow700: { family: 'SB Barlow', file: 'barlow-latin-700.woff2', cap: 0.7, desc: { weight: '700', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlow800: { family: 'SB Barlow', file: 'barlow-latin-800.woff2', cap: 0.7, desc: { weight: '800', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowCond600: { family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-600.woff2', cap: 0.7, desc: { weight: '600', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowCond700: { family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-normal.woff2', cap: 0.7, desc: { weight: '700', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  inter: { family: 'SB Inter V', file: 'inter-latin-var.woff2', cap: 0.7275, desc: { weight: '100 900', ascentOverride: '96.88%', descentOverride: '24.12%', lineGapOverride: '0%' } },
  unbounded: { family: 'SB Unbounded', file: 'unbounded-latin-var.woff2', cap: 0.75, desc: { weight: '200 900', ascentOverride: '99.5%', descentOverride: '24.5%', lineGapOverride: '0%' } },
  lexend: { family: 'SB Lexend', file: 'lexend-latin-var.woff2', cap: 0.7, desc: { weight: '100 900', ascentOverride: '100%', descentOverride: '25%', lineGapOverride: '0%' } },
  bigShoulders: { family: 'SB Big Shoulders', file: 'big-shoulders-display-latin-var.woff2', cap: 0.8, desc: { weight: '100 900', ascentOverride: '98.4%', descentOverride: '21.3%', lineGapOverride: '0%' } },
  anton: { family: 'SB Anton', file: 'anton-latin-400.woff2', cap: 0.8594, desc: { weight: '100 900', ascentOverride: '117.63%', descentOverride: '32.91%', lineGapOverride: '0%' } },
  figtree: { family: 'SB Figtree', file: 'figtree-latin-var.woff2', cap: 0.7, desc: { weight: '300 900', ascentOverride: '95%', descentOverride: '25%', lineGapOverride: '0%' } },
  workSans: { family: 'SB Work Sans', file: 'work-sans-latin-var.woff2', cap: 0.66, desc: { weight: '100 900', ascentOverride: '93%', descentOverride: '24.3%', lineGapOverride: '0%' } },
  archivo: { family: 'SB Archivo', file: 'archivo-latin-var.woff2', cap: 0.686, desc: { weight: '100 900', stretch: '62% 125%', ascentOverride: '87.8%', descentOverride: '21%', lineGapOverride: '0%' } },
  teko: { family: 'SB Teko', file: 'teko-latin-var.woff2', cap: 0.622, desc: { weight: '300 700', ascentOverride: '95.8%', descentOverride: '47.5%', lineGapOverride: '0%' } },
  titillium: { family: 'SB Titillium', file: 'titillium-web-latin-700.woff2', cap: 0.68, desc: { weight: '100 900', ascentOverride: '113.3%', descentOverride: '38.8%', lineGapOverride: '0%' } },
  baiJamjuree: { family: 'SB Bai Jamjuree', file: 'bai-jamjuree-latin-700.woff2', cap: 0.7, desc: { weight: '100 900', ascentOverride: '100%', descentOverride: '25%', lineGapOverride: '0%' } },
  // Stand-in replacements: more weights and two new families
  barlow500: { family: 'SB Barlow', file: 'barlow-latin-500.woff2', cap: 0.7, desc: { weight: '500', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlow600: { family: 'SB Barlow', file: 'barlow-latin-600.woff2', cap: 0.7, desc: { weight: '600', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowCond500: { family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-500.woff2', cap: 0.7, desc: { weight: '500', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowCond700i: { family: 'SB Barlow Condensed', file: 'barlow-condensed-latin-700-italic.woff2', cap: 0.7, desc: { weight: '700', style: 'italic', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  barlowSemi600: { family: 'SB Barlow Semi Condensed', file: 'barlow-semi-condensed-latin-600.woff2', cap: 0.7, desc: { weight: '600', ascentOverride: '100%', descentOverride: '20%', lineGapOverride: '0%' } },
  archivoItalic: { family: 'SB Archivo', file: 'archivo-latin-var-italic.woff2', cap: 0.686, desc: { weight: '100 900', stretch: '62% 125%', style: 'italic', ascentOverride: '87.8%', descentOverride: '21%', lineGapOverride: '0%' } },
  rajdhani: { family: 'SB Rajdhani', file: 'rajdhani-latin-700.woff2', cap: 0.643, desc: { weight: '700', ascentOverride: '93%', descentOverride: '34.6%', lineGapOverride: '0%' } },
  publicSans: { family: 'SB Public Sans', file: 'public-sans-latin-var.woff2', cap: 0.723, desc: { weight: '100 900', ascentOverride: '95%', descentOverride: '22.5%', lineGapOverride: '0%' } },
};
// the cap height of each face a bug may set (font-size x cap = capital letter height), for keeping measured sizes when a face changes
FONTS.saira.cap = FONTS.saira.cap || 0.688; FONTS.interTight.cap = FONTS.interTight.cap || 0.7275; FONTS.montserrat.cap = FONTS.montserrat.cap || 0.7;
const CAP_OF = Object.fromEntries(Object.values(FONTS).filter((f) => f.cap).map((f) => [f.family, f.cap]));

/** Keep every text's capital height when a bug moved from the face its sizes were measured in (`fromCap`) to another face: each text
 * in a face with a known cap height is resized by fromCap / cap. Single-weight faces never get a fake bold. */
export function capMatch(stage, fromCap) {
  const hold = [...stage.querySelectorAll('*')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const sizes = hold.map((e) => { const cs = getComputedStyle(e); return [parseFloat(cs.fontSize) || 0, CAP_OF[cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim()]]; });
  hold.forEach((e, i) => { const [px, cap] = sizes[i]; if (px && cap && Math.abs(cap - fromCap) > 0.005) e.style.fontSize = (px * fromCap / cap).toFixed(2) + 'px'; });
}

/** The CSS font-size (px) that gives a face the cap height `capPx` measured on a frame. `face` is a FONTS entry with `cap`. */
export function capSize(face, capPx) {
  return Math.round((capPx / (face && face.cap ? face.cap : 0.7)) * 100) / 100;
}

/** A thin light outline and a soft shadow for a logo, so a logo in its own team's colour still stands out on that colour (CSS filter). */
/**
 * Panel textures: drawn here as small repeating SVG tiles, no borrowed
 * artwork. White strokes on clear, meant to be laid over a team colour with mix-blend-mode overlay or soft-light. A bug that has a
 * texture lays `var(--sb-tex)` (size `var(--sb-tex-size)`) over its panels and names its own with `texture`; the card's bug_texture
 * picks another or none. { name: [image, tile size] }
 */
const svgTile = (w, h, body) => 'url("data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" + body + '</svg>') + '")';
export const TEXTURES = {
  // fine diagonal pinstripes, as on NBC's college bar
  lines: ['repeating-linear-gradient(135deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)', 'auto'],
  mesh: [svgTile(10, 10, "<path d='M0 5L5 0L10 5L5 10Z' fill='none' stroke='white' stroke-opacity='.55' stroke-width='1.3'/><path d='M0 6L5 1L10 6M0 4L5 9L10 4' fill='none' stroke='black' stroke-opacity='.25' stroke-width='.8'/>"), '10px 10px'],
  carbon: [svgTile(8, 8, "<rect width='4' height='4' fill='white' fill-opacity='.18'/><rect x='4' y='4' width='4' height='4' fill='white' fill-opacity='.18'/><rect x='4' width='4' height='4' fill='black' fill-opacity='.15'/><rect y='4' width='4' height='4' fill='black' fill-opacity='.15'/>"), '8px 8px'],
  brushed: ['repeating-linear-gradient(0deg, rgba(255,255,255,.16) 0 1px, rgba(0,0,0,.08) 1px 2px, transparent 2px 4px)', 'auto'],
  plays: [svgTile(180, 110, "<g fill='none' stroke='white' stroke-opacity='.5' stroke-width='3' stroke-linecap='round'>" +
    "<circle cx='22' cy='24' r='8'/><circle cx='52' cy='24' r='8'/><circle cx='82' cy='24' r='8'/><circle cx='140' cy='30' r='8'/>" +
    "<path d='M24 74l12 12M36 74l-12 12M70 80l12 12M82 80l-12 12M128 72l12 12M140 72l-12 12'/>" +
    "<path d='M52 34C56 56 78 58 96 52S130 40 150 58' stroke-dasharray='6 6'/><path d='M150 58l-11-2M150 58l-4 10'/>" +
    "<path d='M82 34c0 16 10 24 26 30'/><path d='M108 64l-10 1M108 64l-6-8'/></g>"), '120px 73px'],
  graffiti: [svgTile(220, 120, "<g fill='none' stroke='white' stroke-opacity='.45' stroke-linecap='round' stroke-linejoin='round'>" +
    "<path d='M10 70c20-40 40 30 60-10s30-30 45 5 25 25 40-15' stroke-width='9'/>" +
    "<path d='M130 30c15 10 30-5 40 8s-5 30 15 34 25-20 30-10' stroke-width='6'/>" +
    "<path d='M30 100c10-6 22 4 34-2' stroke-width='5'/><path d='M60 78v22M98 82v18' stroke-width='3'/>" +
    "<path d='M180 90l6-14 6 14-14-9h16z' stroke-width='3'/></g><circle cx='160' cy='104' r='4' fill='white' fill-opacity='.4'/>"), '150px 82px'],
};
/** Sets the stage's texture variables: the card's bug_texture (auto: the bug's own), or none. */
export function setTexture(stage, bug, o) {
  const pick = o && o.bug_texture && o.bug_texture !== 'auto' ? o.bug_texture : bug.texture;
  const t = TEXTURES[pick];
  stage.style.setProperty('--sb-tex', t ? t[0] : 'none');
  stage.style.setProperty('--sb-tex-size', t ? t[1] : 'auto');
}

export const LOGO_HALO = 'drop-shadow(0 0 1.2px rgba(255,255,255,.95)) drop-shadow(0 0 1.2px rgba(255,255,255,.95)) drop-shadow(0 2px 3px rgba(0,0,0,.5))';

/** A glossy sheen over a coloured panel (light top half, soft dark bottom): CSS for `background-image` layered over the colour. */
export const GLOSS = 'linear-gradient(rgba(255,255,255,.34), rgba(255,255,255,.08) 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,.22))';

// Surfaces seen on air (Phase 2b review, section 5-7). Each is plain CSS a bug drops into its own rules.
/** Polished silver (2000s chrome plates, discs and bars): a bright top, a dark band just under the middle, a lighter foot. `background`. */
export const CHROME = 'linear-gradient(#fdfdfd, #d9dde1 30%, #9aa1a8 52%, #c3c8cd 74%, #eef0f2)';
/** Dark chrome (a black plate with a metal sheen). `background`. */
export const CHROME_DARK = 'linear-gradient(#5d6269, #2a2d32 45%, #0d0e10 55%, #24272c 85%, #3b3f45)';
/** A raised edge: a light line along the top and left, a dark one along the foot and right. `box-shadow` (add your own after a comma). */
export const BEVEL = 'inset 0 2px 0 rgba(255,255,255,.6), inset 2px 0 0 rgba(255,255,255,.25), inset 0 -3px 0 rgba(0,0,0,.35), inset -2px 0 0 rgba(0,0,0,.2)';
/** The heavy dark outline and drop shadow of 1990s TV type. `text-shadow`. */
export const TEXT_90S = '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 4px 5px 3px rgba(0,0,0,.7)';

// ---- finish recipes: each turns a number measured off the frame into CSS,
// so every bug draws a finish the same way. Plain strings; nothing here changes a bug that doesn't call it. Kept light for wall tablets:
// no backdrop-filter, no SVG filters, no animation.

/** A colour with an alpha: '#3092f3', .5 -> 'rgba(48,146,243,0.5)'. */
export function alpha(hex, a) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return 'rgba(0,0,0,' + a + ')';
  return 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',' + +(+a).toFixed(3) + ')';
}

/** Neon: a light tube glowing in its colour. `reach` is the glow's measured radius in px. `box-shadow` (inset adds the tube's own
 *  inner light). Three layers: a tight bright core, the body of the glow, and a faint far haze. */
export function neon(color, reach = 16, inset = true) {
  const r = Math.max(2, reach);
  const out = ['0 0 ' + (r * 0.15).toFixed(1) + 'px ' + alpha(color, 0.95), '0 0 ' + (r * 0.45).toFixed(1) + 'px ' + alpha(color, 0.7), '0 0 ' + r + 'px ' + alpha(color, 0.4)];
  if (inset) out.push('inset 0 0 ' + (r * 0.3).toFixed(1) + 'px ' + alpha(color, 0.55));
  return out.join(', ');
}

/** Neon letters: a near-white core with the colour glowing round it, as a lit tube reads on camera. Set `color` to `neonCore(color)`
 *  and `text-shadow` to this. */
export function neonText(color, reach = 10) {
  const r = Math.max(2, reach);
  return ['0 0 ' + (r * 0.1).toFixed(1) + 'px #fff', '0 0 ' + (r * 0.3).toFixed(1) + 'px ' + color, '0 0 ' + (r * 0.6).toFixed(1) + 'px ' + color, '0 0 ' + r + 'px ' + alpha(color, 0.6)].join(', ');
}
/** The letters' own colour under a neon glow: the tube's colour washed towards white. */
export const neonCore = (color) => shade(color, 0.75);

/** A soft glow (not neon: one wide layer, less saturated). `box-shadow`, or `text-shadow` with text = true. */
export function glow(color, reach = 12, strength = 0.5, text = false) {
  return text ? '0 0 ' + reach + 'px ' + alpha(color, strength) : '0 0 ' + reach + 'px ' + Math.round(reach / 4) + 'px ' + alpha(color, strength);
}

/** Stripes or fine lines laid over a fill: measured line spacing (`period` px) and angle (deg, CSS: 0 = lines across, 90 = lines down).
 *  `background-image` layer, put before the fill. */
export function stripes(period = 6, angle = 135, color = '#ffffff', strength = 0.06, width = null) {
  const w = width == null ? Math.max(1, Math.round(period / 3)) : width;
  return 'repeating-linear-gradient(' + angle + 'deg, ' + alpha(color, strength) + ' 0 ' + w + 'px, transparent ' + w + 'px ' + period + 'px)';
}

/** Brushed metal: very fine streaks along one direction, over the metal's own gradient. `background-image` layer. */
export function brushed(horizontal = true, strength = 0.07) {
  return 'repeating-linear-gradient(' + (horizontal ? 0 : 90) + 'deg, ' + alpha('#ffffff', strength) + ' 0 1px, transparent 1px 2px, ' + alpha('#000000', strength * 0.8) + ' 2px 3px, transparent 3px 4px)';
}

/** A dot screen (halftone) or carbon-fibre-like weave: `period` px between dots. `background-image` layer with `background-size`. */
export function dots(period = 6, color = '#ffffff', strength = 0.1) {
  return { image: 'radial-gradient(' + alpha(color, strength) + ' 30%, transparent 32%)', size: period + 'px ' + period + 'px' };
}

/** Scan lines (a TV-screen look): a thin dark line every `period` px. `background-image` layer. */
export const scanlines = (period = 3, strength = 0.18) => 'repeating-linear-gradient(0deg, ' + alpha('#000000', strength) + ' 0 1px, transparent 1px ' + period + 'px)';

/** Metal from a base colour: `bands` light bands top to bottom spread over `range` (0-1) of lightness. Chrome is metal('#c8ccd1');
 *  gold metal('#d4a83a'). `background`. When measure.py prints the measured gradient, use that instead: it is the frame's own. */
export function metal(base = '#c8ccd1', bands = 2, range = 0.45) {
  const stops = [], n = Math.max(1, bands) * 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n, light = i % 2 === 0;
    stops.push(shade(base, light ? range * (i === 0 ? 0.9 : 0.6) : -range * (Math.abs(t - 0.55) < 0.2 ? 0.8 : 0.45)) + ' ' + Math.round(t * 100) + '%');
  }
  return 'linear-gradient(' + stops.join(', ') + ')';
}

/** Gloss: a sheen with a hard horizon at `horizon`% down, lightness stepping by `step` (0-1) across it. `background-image` layer over the
 *  panel's colour. GLOSS is gloss(50, .3). */
export function gloss(horizon = 50, step = 0.3) {
  const h = Math.max(5, Math.min(95, horizon)), s = Math.max(0.05, Math.min(0.6, step));
  return 'linear-gradient(' + alpha('#ffffff', s + 0.04) + ', ' + alpha('#ffffff', s * 0.25) + ' ' + (h - 2) + '%, ' + alpha('#000000', 0) + ' ' + h + '%, ' + alpha('#000000', s * 0.7) + ')';
}

/** Sheen: a soft light band across a panel at `at`% down (no hard horizon, unlike gloss), darker above and below. `background-image`
 *  layer over the panel's colour. */
export function sheen(at = 45, strength = 0.15) {
  const p = Math.max(10, Math.min(90, at));
  return 'linear-gradient(' + alpha('#000000', strength * 0.8) + ', ' + alpha('#ffffff', strength) + ' ' + p + '%, ' + alpha('#000000', strength * 1.2) + ')';
}

/** Bevel from the lightness each edge differs from the face by (measure.py: {top: +18, bottom: -22, ...}, in L units): lit edges as
 *  white insets, shaded ones as black. `box-shadow`. */
export function bevel(dL = { top: 15, left: 8, bottom: -18, right: -10 }, width = 2) {
  const side = { top: [0, 1], bottom: [0, -1], left: [1, 0], right: [-1, 0] };
  return Object.entries(dL).filter(([k, v]) => side[k] && Math.abs(v) >= 3).map(([k, v]) => {
    const [x, y] = side[k], a = Math.min(0.75, Math.abs(v) / 40);
    return 'inset ' + x * width + 'px ' + y * width + 'px 0 ' + alpha(v > 0 ? '#ffffff' : '#000000', a);
  }).join(', ');
}

/** See-through glass of a colour: the colour at the measured alpha, with a faint light top edge. `background` and `box-shadow`. */
export function glass(color, a = 0.75) {
  return { background: 'linear-gradient(' + alpha(shade(color, 0.08), a) + ', ' + alpha(shade(color, -0.08), Math.min(1, a + 0.08)) + ')', shadow: 'inset 0 1px 0 ' + alpha('#ffffff', 0.25) };
}

/** A colour with its lightness moved by `dL` L* units (CIELAB), hue and chroma kept: lighter or darker the way a lit or shaded part of a
 *  panel reads on air, for any team colour. */
export function relight(hex, dL) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return hex;
  const [L, A, B] = toLab(...m.slice(1).map((x) => parseInt(x, 16)));
  const fy = (Math.max(0, Math.min(100, L + dL)) + 16) / 116, fx = fy + A / 500, fz = fy - B / 200;
  const inv = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
  const X = inv(fx) * 0.95047, Y = inv(fy), Z = inv(fz) * 1.08883;
  const g = (c) => { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.round(Math.max(0, Math.min(1, c)) * 255).toString(16).padStart(2, '0'); };
  return '#' + g(3.2406 * X - 1.5372 * Y - 0.4986 * Z) + g(-0.9689 * X + 1.8758 * Y + 0.0415 * Z) + g(0.0557 * X - 0.204 * Y + 1.057 * Z);
}

/** The glass cover: a panel lit over its top part
 * down to a horizon, darker below it and darkest at the foot, with a light line along the top edge and a light rim where the frame has
 * them. Numbers are L* units against the panel's own colour, read off a frame with `sample.py` (its `recipe:` line). Defaults are the
 * 2017 Sportsnet / 2019 NWHL tiles: lit +8 at the top, +6 just above a horizon 38 % down, a 7 L step, -6 at the foot. A pane lit in the
 * middle (2019 NWHL team panels) is { top: -6, mid: 5, horizon: 50, step: 1, foot: -20 }. Returns { background, shadow }. */
export function glassCover(color, o = {}) {
  const top = o.top ?? 8, mid = o.mid ?? Math.max(top - 2, 0), h = Math.max(5, Math.min(95, o.horizon ?? 38)), step = o.step ?? 7, foot = o.foot ?? -6;
  const stops = [[0, top], [Math.max(1, h - 2), mid], [Math.min(99, h + 2), mid - step], [100, foot]];
  const background = 'linear-gradient(' + stops.map(([p, d]) => relight(color, d) + ' ' + p + '%').join(', ') + ')';
  const sh = [];
  if ((o.line || 0) > 3) sh.push('inset 0 1px 0 ' + alpha('#ffffff', Math.min(0.8, o.line / 40)));
  if ((o.rim || 0) > 3) sh.push('inset 0 0 0 1px ' + alpha('#ffffff', Math.min(0.6, o.rim / 60)));
  return { background, shadow: sh.join(', ') || 'none' };
}

/** An outline round letters of `width` px (eight directions; keeps the glyph, unlike -webkit-text-stroke). `text-shadow`. */
export function textOutline(width = 2, color = '#000') {
  const w = width, d = +(w * 0.7071).toFixed(2);
  return [[w, 0], [-w, 0], [0, w], [0, -w], [d, d], [-d, d], [d, -d], [-d, -d]].map(([x, y]) => x + 'px ' + y + 'px 0 ' + color).join(', ');
}

/** A drop shadow from measure.py's reading (how far below it reaches, how much darker). `box-shadow` or `filter: drop-shadow` (shape = true). */
export function dropShadow(reach = 8, darker = 30, shape = false) {
  const y = Math.max(1, Math.round(reach / 3)), b = Math.max(2, Math.round(reach)), a = Math.min(0.8, darker / 60);
  return shape ? 'drop-shadow(0 ' + y + 'px ' + Math.round(b / 2) + 'px ' + alpha('#000000', a) + ')' : '0 ' + y + 'px ' + b + 'px ' + alpha('#000000', a);
}

const loaded = new Set();
/** Make sure a font a bug needs is registered (once per page). Fonts live in fonts/ next to this file. */
export function font(family, file, desc) {
  // keyed by file too: one family can come in several files (a weight or an italic each)
  if (loaded.has(family + '|' + file) || typeof FontFace === 'undefined') return;
  loaded.add(family + '|' + file);
  try {
    const f = new FontFace(family, 'url(' + new URL('./fonts/' + file, import.meta.url).href + ')', desc || {});
    document.fonts.add(f);
    f.load().catch(() => {});
  } catch (e) { /* the fallback font draws instead */ }
}

/** An image address a bug may load: https only (a sensor's or feed's text never becomes another kind of address). '' otherwise. */
export const httpsOnly = (url) => (typeof url === 'string' && /^https:\/\/[^\s"'<>]+$/.test(url) ? url : '');

/** A team logo at the size it is drawn: ESPN logos are asked for at that size (a few KB instead of 30-100 KB). */
export function logoUrl(url, px) {
  const m = /^https:\/\/a\.espncdn\.com(\/(?:i\/teamlogos|i\/leaguelogos|i\/headshots|guid)\/[^?]+\.png)$/.exec(url || '');
  return m ? 'https://a.espncdn.com/combiner/i?img=' + m[1] + '&w=' + px + '&h=' + px : url;
}

// ---- logos through Home Assistant (the add-on's /scorebugs/logo): the person's own logo when they have one, else Home Assistant's cached
// copy of the ESPN or Wikimedia image, so a display asks only its own Home Assistant. Only when this kit is the add-on's (the copy inside
// Glass Panes has no server part); if that address fails, the image loads straight from ESPN or Wikimedia as before.
const LOGO_SERVICE = (() => {
  try { const u = new URL(import.meta.url); return /^https?:$/.test(u.protocol) && /\/scorebugs\/frontend\/kit\.js$/.test(u.pathname) ? new URL('/scorebugs/logo', u).href : ''; } catch (e) { return ''; }
})();
// the image addresses Home Assistant will keep a copy of (logo_view.py has the same list)
const CACHEABLE = [
  /^https:\/\/a\.espncdn\.com\/combiner\/i\?img=\/(?:i\/teamlogos|i\/leaguelogos|i\/headshots|i\/flags|guid)\/[A-Za-z0-9/_.-]+\.png&w=\d{1,4}&h=\d{1,4}$/,
  /^https:\/\/a\.espncdn\.com\/(?:i\/teamlogos|i\/leaguelogos|i\/headshots|i\/flags|guid)\/[A-Za-z0-9/_.-]+\.png$/,
  /^https:\/\/(?:upload|thumb)\.wikimedia\.org\/wikipedia\/(?:en|commons)\/[A-Za-z0-9/_.%(),~-]+\.(?:png|jpe?g|webp)$/,
];
/** The address on Home Assistant for an image (`url`; `own` = a team's own picture, "nfl/12", and `at` when it was uploaded), or ''. */
export function viaHA(url, own, at, base = LOGO_SERVICE) {
  if (!base) return '';
  const q = new URLSearchParams();
  if (own && /^[a-z0-9-]{1,20}\/[a-z0-9-]{1,60}$/.test(own)) { q.set('k', own); if (/^\d+$/.test(String(at || ''))) q.set('t', String(at)); }
  // the image as server + path (+ ESPN's size), never the whole address: Home Assistant's security filter refuses addresses in a query
  const m = url && !url.includes('..') && CACHEABLE.some((r) => r.test(url)) &&
    (/^https:\/\/a\.espncdn\.com\/combiner\/i\?img=\/([^&]+)&w=(\d+)&h=\d+$/.exec(url) || /^https:\/\/(a\.espncdn\.com|upload\.wikimedia\.org|thumb\.wikimedia\.org)\/(.+)$/.exec(url));
  if (m && m.length === 3 && /^\d+$/.test(m[2])) { q.set('s', 'espn'); q.set('p', m[1]); q.set('w', m[2]); }
  else if (m) { q.set('s', { 'a.espncdn.com': 'espn', 'upload.wikimedia.org': 'wiki-upload', 'thumb.wikimedia.org': 'wiki-thumb' }[m[1]]); q.set('p', m[2]); }
  return q.toString() ? base + '?' + q : '';
}
const ownMissing = new Set();   // names with no own file and no address: asked once per page, not on every draw
/** Load an image from the first address that works (each tried once), then `done` when none does. */
export function tryEach(im, list, done) {
  const urls = list.filter((u, i) => u && list.indexOf(u) === i);
  let i = 0;
  const next = () => {
    if (i > 0 && urls[i - 1].startsWith(LOGO_SERVICE || '\0') && !/[?&]p=/.test(urls[i - 1])) ownMissing.add(urls[i - 1]);
    while (i < urls.length && ownMissing.has(urls[i])) i++;
    if (i < urls.length) {
      const u = urls[i++];
      // ESPN allows its images to be read (the logo slot measures them); asked that way, so the cached copy is readable too
      if (/^https:\/\/a\.espncdn\.com\//.test(u)) im.crossOrigin = 'anonymous'; else im.removeAttribute('crossorigin');
      im.src = u;
    } else { im.onerror = null; if (done) done(); }
  };
  im.onerror = next;
  next();
}
/** An image from `url` through Home Assistant when it can, else straight from `url`. */
export function setSrc(im, url, done) { const u = httpsOnly(url); tryEach(im, [viaHA(u), u], done); }

/** A round badge with the team's letters in its colour, for a missing or broken logo. */
export function badge(team) {
  const c = /^#[0-9a-f]{3,6}$/i.test(team.color || '') ? team.color : '#555';
  return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="' + c +
    '"/><text x="50" y="62" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="32" fill="#fff">' + String(team.abbr || '?').replace(/\W/g, '').slice(0, 4) + '</text></svg>');
}

/** An <img> for a team's logo, `px` square, that falls back to the badge. */
/** Logos from ESPN only (no uploaded or other-source logos) while the looks are being matched to broadcast frames. */
export const ESPN_ONLY = true;

export function logo(team, px, cls) {
  const im = el('img', cls || 'sb-logo');
  im.alt = '';
  im.width = px; im.height = px;
  const full = httpsOnly(team.logo), sized = full ? logoUrl(full, px * 2) : '';
  im.dataset.team = teamColor(team, '');
  if (team.onAir && team.onAir.outline) im.dataset.outline = '1';
  if (team.onAir && team.onAir.logo === 'black') { im.dataset.outline = 'light'; im.style.filter = 'brightness(0)'; }   // the logo's own team colour: its outline is decided against it too, so it never comes and goes
  im.addEventListener('load', () => logoSlot(im));
  // ESPN's logo (through Home Assistant's copy) by default; the team's own picture only when the person chose one in My teams
  // ESPN's logos only for now: a person's own uploaded logo and any other source are skipped; a team with no ESPN
  // logo shows its letters badge. Set ESPN_ONLY false to bring own logos back.
  const espn = (u) => /^https:\/\/a\.espncdn\.com\//.test(u || '');
  const urls = ESPN_ONLY ? (espn(full) ? [viaHA(sized), sized, full] : []) : [team.ownLogo ? viaHA(sized, team.ownLogo, team.ownLogoAt) : '', viaHA(sized), sized, full];
  // a logo already cut on this page is drawn straight from its cut copy, so a redraw never flashes the uncut file first
  const known = urls.find((u) => u && slotCache.get(u) && slotCache.get(u).url);
  if (known) { im.dataset.from = known; im.dataset.cut = '1'; im.src = slotCache.get(known).url; return im; }
  tryEach(im, urls, () => { im.src = badge(team); });
  return im;
}

// ---- the shared logo slot. Logo files carry a margin of empty space (ESPN's about 8 %, each team's different), so a logo sized by its
// file comes out smaller or larger than the broadcast's. Once a logo has loaded it is cut to its artwork, so the box a bug gives is the
// artwork's box; and when most of its solid colour matches the panel behind it (a logo on its own team colour), it gets an outline in
// the colour that stands out on that panel. Logos a bug crops on purpose (object-fit: cover) keep their file as it is. An image from another
// server can only be read when that server allows it (ESPN does, and Home Assistant's copy is the page's own); otherwise it is drawn as it comes.
const slotCache = new Map();   // image address -> { url: the cut copy or '', lab: solid colours } (worked out once per page)
// Logo balance (bug option balanceLogos): once both team logos are in, each is scaled so the area of artwork it shows is about the same, a wide logo up, a tall or
// solid one down, within limits.
function balanceLogos(im) {
  const st = im.closest('.sb'); if (!st || !st.dataset.balance) return;
  const all = [...st.querySelectorAll('img.sb-logo:not(.sb-league):not(.sb-pre-logo)')];
  if (all.length < 2 || all.some((n) => !n.dataset.fill || !n.complete || !n.naturalWidth)) return;
  const area = all.map((n) => {
    const bw = n.offsetWidth, bh = n.offsetHeight, k = Math.min(bw / n.naturalWidth, bh / n.naturalHeight);
    return n.naturalWidth * k * n.naturalHeight * k * Number(n.dataset.fill);
  });
  const target = Math.sqrt(area.reduce((a, b) => a * b, 1) ** (1 / area.length) * Math.max(...area));   // between the mean and the largest
  all.forEach((n, i) => {
    const f = Math.max(0.85, Math.min(1.22, Math.sqrt(target / (area[i] || target))));   // capped so a wide logo stays inside the bug
    const base = Number(n.dataset.baseScale || (n.style.scale ? parseFloat(n.style.scale) : 1)); n.dataset.baseScale = String(base);
    n.style.scale = (base * f).toFixed(3);
  });
}
// A logo the bug lets its panel cut (big and half off the end, as on air) slides so its focal point sits as near the middle of what
// shows as it can, without opening a gap at a cut edge.
function focusCrop(im) {
  if (im.dataset.focused || im.dataset.fx == null) return;
  const st = im.closest('.sb'); if (!st) return;
  const sc = st.getBoundingClientRect().width / (st.offsetWidth || 1) || 1;
  const box = im.getBoundingClientRect(); if (!box.width || !box.height) return;
  // the drawn artwork inside the image box (contain keeps its shape)
  const nw = im.naturalWidth, nh = im.naturalHeight, k = Math.min(box.width / nw, box.height / nh);
  const fit = getComputedStyle(im).objectFit, dw = fit === 'contain' ? nw * k : box.width, dh = fit === 'contain' ? nh * k : box.height;
  const art = { l: box.left + (box.width - dw) / 2, t: box.top + (box.height - dh) / 2, r: 0, b: 0 }; art.r = art.l + dw; art.b = art.t + dh;
  let win = { l: art.l, t: art.t, r: art.r, b: art.b }, clipT = -Infinity, clipB = Infinity;
  for (let p = im.parentElement; p; p = p.parentElement) {
    const cs = getComputedStyle(p);
    if (cs.overflow !== 'visible' || cs.clipPath !== 'none' || p === st) { const q = p.getBoundingClientRect(); win = { l: Math.max(win.l, q.left), t: Math.max(win.t, q.top), r: Math.min(win.r, q.right), b: Math.min(win.b, q.bottom) }; clipT = Math.max(clipT, q.top); clipB = Math.min(clipB, q.bottom); }
    if (p === st) break;
  }
  if (win.r <= win.l || win.b <= win.t) return;
  // a wide logo keeps most of its height: a bug that sets data-keep on a logo's
  // box (the share of a wide logo's height that must show, e.g. 0.8) gets a logo wider than tall drawn smaller until that much of it
  // shows, so the panel trims its edges but never its head; round and tall logos are still cut as on air
  // (the wider the logo, the more of it shows: a wordmark twice as wide as tall, the Jets' or the Pelicans', shows almost whole)
  const holder = im.closest('[data-keep]'), keep0 = holder ? Number(holder.dataset.keep) : 0;
  const keep = keep0 > 0 && keep0 <= 1 ? keep0 + (1 - keep0) * Math.max(0, Math.min(0.9, (dw / dh - 1.2) / 1.0)) : 0;
  if (keep > 0 && !im.dataset.kept && dw / dh >= 1.2 && clipB - clipT < keep * dh - 0.5) {
    im.dataset.kept = '1';
    const s0 = parseFloat(im.style.scale) || 1;
    im.style.scale = (s0 * Math.max(0.5, (clipB - clipT) / (keep * dh))).toFixed(3);
    // smaller now, it may no longer fill the window top to foot: set its face in the window's middle up and down first (kept so the
    // artwork still covers the window's top and foot), then the usual slide below
    const b2 = im.getBoundingClientRect(), k2 = Math.min(b2.width / nw, b2.height / nh), dh2 = fit === 'contain' ? nh * k2 : b2.height, t2 = b2.top + (b2.height - dh2) / 2;
    const dy2 = Math.max(clipB - (t2 + dh2), Math.min(clipT - t2, (clipT + clipB) / 2 - (t2 + Number(im.dataset.fy) * dh2)));
    const was2 = (im.style.translate || '').split(' ').map((v) => parseFloat(v) || 0);
    im.style.translate = (was2[0] || 0) + 'px ' + ((was2[1] || 0) + dy2 / sc).toFixed(1) + 'px';
    focusCrop(im);
    return;
  }
  const shown = ((win.r - win.l) * (win.b - win.t)) / (dw * dh);
  if (shown > 0.9) return;   // not really cropped
  const fx = art.l + Number(im.dataset.fx) * dw, fy = art.t + Number(im.dataset.fy) * dh;
  const axis = (f, a0, a1, w0, w1) => {   // how far to slide on one axis, kept so the artwork still covers the window's cut edges
    if (a1 - a0 <= w1 - w0 + 0.5) return 0;
    const want = (w0 + w1) / 2 - f;
    return Math.max(w1 - a1, Math.min(w0 - a0, want));
  };
  const dx = axis(fx, art.l, art.r, win.l, win.r), dy = axis(fy, art.t, art.b, win.t, win.b);
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
  const was = (im.style.translate || '').split(' ').map((v) => parseFloat(v) || 0);
  im.style.translate = ((was[0] || 0) + dx / sc).toFixed(1) + 'px ' + ((was[1] || 0) + dy / sc).toFixed(1) + 'px';
  im.dataset.focused = '1';
}
function logoSlot(im) {
  if (im.dataset.slot) return;   // the cut copy's own load
  const src = im.dataset.cut ? im.dataset.from : im.currentSrc || im.src;
  if (!src || /^data:image\/svg/.test(src)) return;
  const cropped = getComputedStyle(im).objectFit === 'cover';   // cropped on purpose by the bug: not cut, but still outlined when it blends
  if (!slotCache.has(src)) slotCache.set(src, measureLogo(im));
  const r = slotCache.get(src);
  if (!r) return;
  im.dataset.slot = '1';
  if (r.url && !cropped && !im.dataset.cut) {
    if (getComputedStyle(im).objectFit === 'fill') im.style.objectFit = 'contain';   // a cut logo is rarely square
    im.dataset.from = src; im.removeAttribute('crossorigin'); im.src = r.url;
  }
  if (r.fill) im.dataset.fill = r.fill.toFixed(3);
  balanceLogos(im);
  // a bug may set its own crop (data-crop on the logo: the kit's focal point stays out of it)
  const fp = im.closest('[data-focus="face"]') && r.face ? r.face : r.focus;
  if (fp && !im.dataset.crop) { im.dataset.fx = fp[0].toFixed(3); im.dataset.fy = fp[1].toFixed(3); if (cropped) im.style.objectPosition = (fp[0] * 100).toFixed(1) + '% ' + (fp[1] * 100).toFixed(1) + '%'; }
  if (im.complete && im.naturalWidth) focusCrop(im); else im.addEventListener('load', () => focusCrop(im), { once: true });
  const bg = panelBehind(im), own = im.dataset.team, stops = panelStops(im);
  // outlined when it blends into the panel behind it now, or into its own team's colour (a panel that turns to the team's colour when
  // it has the ball would otherwise make the outline come and go)
  const blends = (c) => c && blendShare(r.lab, c) > TOKENS.logoBlend;
  // red on red: checked against every solid colour of a gradient panel too, not only its average
  // a one-colour logo in the panel's own colour (Bates on red): nothing to outline, so it is drawn white (dark on a light panel), as
  // broadcasts do
  // a bug may draw logos white sooner (bug option monoLogos: the share of matching colour above which a logo goes white; the CW's
  // white logos on their colour tiles)
  const stMono = im.closest('.sb'), cut = stMono && stMono.dataset.mono ? Number(stMono.dataset.mono) : 0.85;
  const all = (c) => c && blendShare(r.lab, c) > cut;
  if (!im.dataset.outline && bg && (all(bg) || stops.some(all))) {
    const light = contrast(TOKENS.inkLight, bg) >= contrast(TOKENS.inkDark, bg);
    const was = getComputedStyle(im).filter;
    im.style.filter = (light ? 'brightness(0) invert(1)' : 'brightness(0)') + ' drop-shadow(0 1px 2px rgba(0,0,0,.35))' + (was && was !== 'none' && !/brightness\(0\)/.test(was) ? ' ' + was : '');
    im.classList.add('sb-logo-mono');
    return;
  }
  if (im.dataset.outline || (bg && (blends(bg) || blends(own) || stops.some(blends)))) {
    const c = im.dataset.outline === 'light' || !bg || contrast(TOKENS.inkLight, bg) >= contrast(TOKENS.inkDark, bg) ? 'rgba(255,255,255,.95)' : 'rgba(17,17,17,.9)';
    const was = getComputedStyle(im).filter;
    // the outline grows with the logo: a thin line vanishes round a big logo
    const st = im.closest('.sb'), k = st ? (st.getBoundingClientRect().width / (st.offsetWidth || 1)) || 1 : 1;
    const ow = Math.max(1.2, Math.min(3, (im.getBoundingClientRect().height / k) / 40)).toFixed(1);
    im.style.filter = (was && was !== 'none' ? was + ' ' : '') + 'drop-shadow(0 0 ' + ow + 'px ' + c + ') drop-shadow(0 0 ' + ow + 'px ' + c + ')';
    im.classList.add('sb-logo-outlined');
  }
}
/** The artwork's box and solid colours of a loaded logo: { url (a copy cut to the artwork, or '' when it has no margin), lab }, or null. */
function measureLogo(im) {
  try {
    const w = im.naturalWidth, h = im.naturalHeight;
    if (!w || !h || w > 2048 || h > 2048) return null;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
    const d = cx.getImageData(0, 0, w, h).data, A = TOKENS.logoAlpha * 255, step = Math.max(1, Math.round(Math.max(w, h) / 64));
    let x0 = w, y0 = h, x1 = -1, y1 = -1, solid = 0; const lab = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] < 8) continue;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      if (d[i + 3] >= 128) solid++;
      if (d[i + 3] >= A && x % step === 0 && y % step === 0) lab.push(toLab(d[i], d[i + 1], d[i + 2]));
    }
    const m = TOKENS.logoMargin;
    // the focal point: the centre of
    // the artwork's detail, each opaque pixel weighted by how much it differs from its neighbours (edges, eyes, lettering), as a share of
    // the cut artwork's width and height
    // and a 'face' focal point that leans hard on the sharpest detail (eyes, teeth, lettering), for bugs that ask for it (focus: 'face')
    let fw = 0, fxs = 0, fys = 0, gw = 0, gxs = 0, gys = 0;
    if (x1 >= x0) for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) {
      const i = (y * w + x) * 4; if (d[i + 3] < A) continue;
      const j = i + 4 * Math.min(step, x1 - x), k = i + 4 * w * Math.min(step, y1 - y);
      const e = Math.abs(d[i] - d[j]) + Math.abs(d[i + 1] - d[j + 1]) + Math.abs(d[i + 2] - d[j + 2]) + Math.abs(d[i] - d[k]) + Math.abs(d[i + 1] - d[k + 1]) + Math.abs(d[i + 2] - d[k + 2]) + Math.abs(d[i + 3] - d[j + 3]) + Math.abs(d[i + 3] - d[k + 3]);
      fw += e + 1; fxs += (e + 1) * x; fys += (e + 1) * y;
      const e2 = e * e * e; gw += e2 + 1; gxs += (e2 + 1) * x; gys += (e2 + 1) * y;
    }
    const fill = x1 >= x0 ? solid / ((x1 - x0 + 1) * (y1 - y0 + 1)) : 1;   // share of the cut box the artwork covers
    const focus = fw ? [(fxs / fw - x0) / Math.max(1, x1 - x0), (fys / fw - y0) / Math.max(1, y1 - y0)] : [0.5, 0.5];
    // (half way towards the upper third too: a mascot's face sits high in its logo, the orca's head, the duck's eyes)
    const face = gw ? [(gxs / gw - x0) / Math.max(1, x1 - x0), 0.5 * (gys / gw - y0) / Math.max(1, y1 - y0) + 0.15] : focus;
    if (x1 < x0 || !(x0 > m * w || y0 > m * h || x1 < (1 - m) * w - 1 || y1 < (1 - m) * h - 1)) return { url: '', lab, focus, face, fill };
    const t = document.createElement('canvas'); t.width = x1 - x0 + 1; t.height = y1 - y0 + 1;
    t.getContext('2d').drawImage(cv, x0, y0, t.width, t.height, 0, 0, t.width, t.height);
    return { url: t.toDataURL('image/png'), lab, focus, face, fill };
  } catch (e) { return null; }   // another server's image that does not allow reading
}
/** The colour behind a logo: the nearest solid background (a gradient's solid colours averaged), else the page's colour, or null. */
/** Every solid colour of the nearest panel behind a node (a gradient's stops), as #rrggbb. */
function panelStops(node) {
  for (let n = node.parentElement; n && !n.classList.contains('sb'); n = n.parentElement) {
    const cs = getComputedStyle(n);
    const all = [cs.backgroundColor, cs.backgroundImage].join(' ');
    const l = [...all.matchAll(/rgba?\(([^)]+)\)/g)].map((m) => m[1].split(/[\s,/]+/).map(Number)).filter((v) => v.length < 4 || v[3] >= 0.9);
    if (l.length) return l.map((v) => '#' + v.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join(''));
  }
  return [];
}
function panelBehind(node) {
  const rgb = (txt) => [...String(txt).matchAll(/rgba?\(([^)]+)\)/g)].map((m) => m[1].split(/[\s,/]+/).map(Number)).filter((v) => v.length < 4 || v[3] >= 0.9);
  const hex = (v) => '#' + v.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
  const mean = (l) => [0, 1, 2].map((i) => l.reduce((a, v) => a + v[i], 0) / l.length);
  let n = node.parentElement;
  for (; n && !n.classList.contains('sb'); n = n.parentElement) {
    const cs = getComputedStyle(n), c = rgb(cs.backgroundColor)[0];
    if (c) return hex(c);
    const g = cs.backgroundImage !== 'none' ? rgb(cs.backgroundImage) : [];
    if (g.length) return hex(mean(g));
  }
  const page = n && rgb(n.dataset.page || '');   // a logo straight on the page (see mount)
  return page && page.length ? hex(page[0]) : null;
}
function toLab(r, g, b) {
  const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const R = f(r), G = f(g), B = f(b);
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const h = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  return [116 * h(Y) - 16, 500 * (h(X) - h(Y)), 200 * (h(Y) - h(Z))];
}
/** CIEDE2000 colour difference of two Lab colours. */
export function de2000(a, b) {
  const [L1, a1, b1] = a, [L2, a2, b2] = b, rad = Math.PI / 180;
  const Cm = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2, G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const ap1 = a1 * (1 + G), ap2 = a2 * (1 + G), Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2);
  const hue = (x, y) => { if (!x && !y) return 0; const t = Math.atan2(y, x) / rad; return t < 0 ? t + 360 : t; };
  const h1 = hue(ap1, b1), h2 = hue(ap2, b2), both = Cp1 * Cp2 !== 0;
  let dh = both ? h2 - h1 : 0; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dL = L2 - L1, dC = Cp2 - Cp1, dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dh / 2 * rad), Lm = (L1 + L2) / 2, Cpm = (Cp1 + Cp2) / 2;
  const hm = !both ? h1 + h2 : Math.abs(h1 - h2) > 180 ? (h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2) : (h1 + h2) / 2;
  const T = 1 - 0.17 * Math.cos((hm - 30) * rad) + 0.24 * Math.cos(2 * hm * rad) + 0.32 * Math.cos((3 * hm + 6) * rad) - 0.2 * Math.cos((4 * hm - 63) * rad);
  const SL = 1 + 0.015 * (Lm - 50) ** 2 / Math.sqrt(20 + (Lm - 50) ** 2), SC = 1 + 0.045 * Cpm, SH = 1 + 0.015 * Cpm * T;
  const RT = -2 * Math.sqrt(Cpm ** 7 / (Cpm ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hm - 275) / 25) ** 2)) * rad);
  return Math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH));
}
/** Share of a logo's solid colours (Lab) within TOKENS.logoBlendDE of a panel colour (#rrggbb). */
export function blendShare(lab, hex) {
  if (!lab || !lab.length) return 0;
  const p = toLab(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
  return lab.filter((c) => de2000(c, p) < TOKENS.logoBlendDE).length / lab.length;
}

/** A school's name shortened the way broadcasts do when it will not fit (ESPN publishes no shorter form: its short name for Virginia
 * Tech is still "Virginia Tech"): a leading direction word becomes its letter ("N CAROLINA", "S FLORIDA"), else the first word of a
 * name of two or more words does ("V TECH", "B COLLEGE"); one word stays whole.. */
export function shortName(name) {
  const w = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return w.join(' ');
  return [w[0][0], ...w.slice(1)].join(' ');
}

/** A name that must fit its box: squeezed sideways down to TOKENS.fitFloor, then its `short` form (done after drawing, by fitAll). */
export function fit(node, short) {
  node.dataset.fit = '1';
  node.style.minWidth = '0';   // a grid or flex item may then shrink to its room instead of pushing its neighbours
  if (short && short !== node.textContent) node.dataset.short = short;
  return node;
}
/** Every element holding text gets its font size times k (sizes read first, so nested texts are not scaled twice). */
export function scaleText(stage, k) {
  const hold = [...stage.querySelectorAll('*')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const sizes = hold.map((e) => parseFloat(getComputedStyle(e).fontSize) || 0);
  hold.forEach((e, i) => { if (sizes[i]) e.style.fontSize = (sizes[i] * k).toFixed(2) + 'px'; });
}

/** Before the game: the team records (rank and record in college) in the empty score boxes, in the bug's team order (soccer home
 *  first), squeezed to fit; left alone when the bug already shows the records somewhere, or a team has none. */
// Before the game with no records to show: an empty score box that is a plate of its own (white or coloured) holds the team's logo
// instead of standing blank. A bare score area on a bar is left alone; the bug closes that up itself (sizeFor).
function preLogos(stage, g) {
  const plate = (n) => { const cs = getComputedStyle(n); if (/text/.test(cs.backgroundClip || cs.webkitBackgroundClip || '')) return false; return cs.backgroundImage !== 'none' || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor); };
  // empty: no text and nothing inside but the kit's own (empty) fitting box
  const empty = (sel) => [...stage.querySelectorAll(sel)].filter((n) => !n.textContent.trim() && ![...n.children].some((c) => !c.classList.contains('sb-fit')) && n.offsetWidth > 0);
  let slots = empty('.sb-num');
  if (slots.length !== 2) slots = empty('.s, .sc, .score');
  if (slots.length !== 2 || !slots.every(plate)) return;
  // a bug that already shows both teams' logos does not get them twice (nba-espn-14, cbb-chrome-11)
  const teams = g.sport === 'soccer' ? [g.home, g.away] : [g.away, g.home];
  if ([...stage.querySelectorAll('img.sb-logo:not(.sb-league):not(.sb-pre-logo)')].filter((n) => n.offsetWidth > 0).length >= 2) {
    // the logos are already on the bug: a bug that shows no team letters gets them in its plates instead (Marquee, MASN, MLB Network)
    const shown = stage.textContent.toUpperCase();
    if (teams.some((t) => t.abbr && shown.includes(t.abbr.toUpperCase()))) {
      // logos and letters already there, nothing to put in: an empty box in a row of boxes goes, so the row closes up
      slots.forEach((n) => { if (n.parentElement && /flex/.test(getComputedStyle(n.parentElement).display)) n.style.display = 'none'; });
      return;
    }
    slots.forEach((n, i) => {
      const px = parseFloat(getComputedStyle(n).fontSize) || 20;
      n.textContent = (teams[i].abbr || '').toUpperCase(); n.classList.add('sb-pre-rec'); n.style.whiteSpace = 'nowrap';
      for (let k = 0.75; k >= 0.34; k -= 0.04) { n.style.setProperty('font-size', (px * k).toFixed(1) + 'px', 'important'); if (n.scrollWidth <= n.clientWidth + 1) break; }
    });
    const sz = slots.map((n) => parseFloat(n.style.fontSize) || 0).filter(Boolean);
    if (sz.length === 2) slots.forEach((n) => n.style.setProperty('font-size', Math.min(...sz) + 'px', 'important'));
    return;
  }
  slots.forEach((n, i) => {
    const px = Math.max(16, Math.min(n.clientWidth, n.clientHeight) * 0.8);
    // on a light plate the plain logo (a bug may have picked the white "dark" version for its dark panels)
    const light = (() => { const c = getComputedStyle(n).backgroundColor.match(/\d+/g); return c && c.length >= 3 && (+c[0] + +c[1] + +c[2]) / 3 > 160; })() || /linear-gradient\(rgb\(2[0-5]\d/.test(getComputedStyle(n).backgroundImage);
    const t = light ? { ...teams[i], logo: String(teams[i].logo || '').replace('/500-dark/', '/500/') } : teams[i];
    const im = logo(t, Math.round(px), 'sb-logo sb-pre-logo');
    im.style.cssText = 'width:' + px + 'px;height:' + px + 'px;object-fit:contain;display:block;margin:auto';
    n.style.display = 'grid'; n.style.placeItems = 'center';
    n.appendChild(im);
  });
}
/** Size a pre-game record to its box: smaller until it fits, clears the texts beside it and stays inside its parent. */
function fitRecord(n) {
  const px = +n.dataset.recPx || 20;
  const near = [...n.parentElement.children].filter((s) => s !== n && s.textContent.trim());
  const hits = () => { const r = n.getBoundingClientRect(); return near.some((s) => { const q = s.getBoundingClientRect(); return r.left < q.right - 1 && q.left < r.right - 1 && r.top < q.bottom && q.top < r.bottom; }); };
  const inside = () => { const r = n.getBoundingClientRect(), q = n.parentElement.getBoundingClientRect(); return r.left >= q.left - 1 && r.right <= q.right + 1; };
  // down to a fifth of the score's size: a long record (10-14-1) in a big score box (Stadium block)
  for (let k = 0.6; k >= 0.2; k -= 0.04) { n.style.setProperty('font-size', (px * k).toFixed(1) + 'px', 'important'); if (n.scrollWidth <= n.clientWidth + 1 && !hits() && inside()) break; }
}
/** Fit the records again (a web font that loads after the first fit is wider), then give both the smaller size. */
export function refitRecords(stage) {
  const slots = [...stage.querySelectorAll('.sb-pre-rec')].filter((n) => n.dataset.recPx);
  if (!slots.length) return;
  slots.forEach(fitRecord);
  const sizes = slots.map((n) => parseFloat(n.style.fontSize) || 0).filter(Boolean);
  if (sizes.length === 2) slots.forEach((n) => n.style.setProperty('font-size', Math.min(...sizes) + 'px', 'important'));
}

export function preRecords(stage, g) {
  const rec = (t) => t.record || '';   // the record only: a rank already sits by the name in the bugs that show one
  const recs = [g.away, g.home].map(rec);
  if (!recs[0] || !recs[1]) { preLogos(stage, g); return; }
  const shown = stage.textContent.replace(/\s+/g, ' ');
  if (recs.some((r) => shown.includes(r.split(' ').pop()))) return;   // the bug has its own place for them
  const empty = (sel) => [...stage.querySelectorAll(sel)].filter((n) => !n.textContent.trim() && n.offsetWidth > 0);
  let slots = empty('.sb-num');
  if (slots.length !== 2) slots = empty('.s, .sc, .score');   // a bug that did not mark its score boxes: the usual class names
  if (slots.length !== 2) return;
  const order = g.sport === 'soccer' ? [recs[1], recs[0]] : recs;
  // the box keeps its size (a score slot holds room for two figures); the record's own size steps down until it fits that room
  slots.forEach((n, i) => {
    n.dataset.recPx = parseFloat(getComputedStyle(n).fontSize) || 20;   // the score's own size (read before the record goes in)
    n.textContent = order[i]; n.classList.add('sb-pre-rec'); n.style.whiteSpace = 'nowrap';
    fitRecord(n);
  });
  // both records at the same size, the smaller of the two
  const sizes = slots.map((n) => parseFloat(n.style.fontSize) || 0).filter(Boolean);
  if (sizes.length === 2) slots.forEach((n) => n.style.setProperty('font-size', Math.min(...sizes) + 'px', 'important'));
}

/** Fit the box holding exactly `text` (the start time or FINAL) wherever a bug put it. */
export function fitStatus(stage, text) {
  if (!text) return;
  const short = text.replace(/ ([AP])M$/, '$1');
  stage.querySelectorAll('*').forEach((e) => {
    if (e.children.length || e.textContent.trim() !== text) return;
    const fitted = e.closest('[data-fit]');
    if (fitted) { if (!fitted.dataset.short && short !== text) fitted.dataset.short = short; return; }   // a box the bug fitted itself: offer the short form too
    let n = e;   // the nearest box that is not plain inline text and holds nothing else
    while (n !== stage && getComputedStyle(n).display === 'inline' && n.parentElement && n.parentElement.textContent.trim() === text) n = n.parentElement;
    if (n !== stage && !n.dataset.fit) fit(n, short !== text ? short : undefined);
  });
}
/** Fit every name a bug marked with fit(): its text in an inner box, squeezed sideways to the room it has. Runs once the stage is in the page. */
// the short form in place of the name, keeping any box before it (a rank, a seed): only the last piece of plain text is swapped, with the
// text of the boxes before it taken off the front of the short form when it starts with them
function shortInto(inner, short) {
  const texts = [...inner.childNodes].filter((c) => c.nodeType === 3 && c.data.trim());
  if (!texts.length || inner.children.length === 0) { inner.textContent = short; return; }
  const last = texts[texts.length - 1];
  let lead = '';
  for (const c of inner.childNodes) { if (c === last) break; lead += c.textContent; }
  const s = short.startsWith(lead.trim()) ? short.slice(lead.trim().length).trimStart() : short;
  last.data = s;
}
// White letters on a light panel (a bright gold, a pale end of a gradient) get a soft dark edge so they still read
function legible(stage) {
  stage.querySelectorAll('span, div, b').forEach((n) => {
    if (![...n.childNodes].some((c) => c.nodeType === 3 && c.data.trim())) return;
    const cs = getComputedStyle(n);
    if (!/^rgba?\(2[3-5]\d, 2[3-5]\d, 2[3-5]\d/.test(cs.color)) return;
    const bg = panelBehind(n);
    if (!bg || contrast('#ffffff', bg) >= 2.6) return;
    n.style.textShadow = (cs.textShadow && cs.textShadow !== 'none' ? cs.textShadow + ', ' : '') + '0 0 2px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)';
  });
}
/** Three-figure scores (a basketball game on a football or hockey bar): when a score of 100 or more is cut by its box or runs into
 * other text, both scores get smaller together, one size for both sides, until they fit. Two-figure scores are never touched. */
export function fitScores(stage, g) {
  const sc = [g.away && g.away.score, g.home && g.home.score];
  if (!sc.some((x) => x != null && x >= 100)) return;
  const want = new Set(sc.filter((x) => x != null).map(String));
  const own = (n) => [...n.childNodes].find((c) => c.nodeType === 3 && want.has(c.textContent.trim()));
  const nodes = [...stage.querySelectorAll('*')].filter((n) => own(n) && n.offsetWidth > 0);
  if (!nodes.length) return;
  const box = (t) => { const r = document.createRange(); r.selectNodeContents(t); return r.getBoundingClientRect(); };
  const texts = () => { const w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT); const out = []; let t; while ((t = w.nextNode())) if (t.textContent.trim() && t.parentElement && t.parentElement.offsetWidth > 0) out.push(t); return out; };
  const k0 = stage.getBoundingClientRect().width / (stage.offsetWidth || 1) || 1, gap = 1 * k0;
  // a box or logo drawn after the score (so on top of it) that covers part of it: the next cell of a grid, a team's logo
  // opaque only: a see-through shine or tint laid over a panel does not hide what is under it
  const alpha = (c) => { const m = /rgba\([^)]*,\s*([\d.]+)\)/.exec(c); return m ? +m[1] : /transparent/.test(c) ? 0 : 1; };
  const painted = (e) => { if (e.tagName === 'IMG') return true; const cs = getComputedStyle(e);
    if (alpha(cs.backgroundColor) >= 0.8) return true;
    const stops = (cs.backgroundImage.match(/rgba?\([^)]*\)/g) || []); return stops.length > 0 && stops.some((c) => alpha(c) >= 0.8); };
  const covers = (n) => [...stage.querySelectorAll('*')].filter((e) => e.offsetWidth > 0 && !e.contains(n) && !n.contains(e) && !e.closest('.sb-pips')
    && (n.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) && painted(e));
  const bad = (n) => {
    const t = own(n), r = box(t);
    // wider than its own box (a score plate sized for two figures holding three)
    const nb = n.getBoundingClientRect();
    if (r.left < nb.left - 1 || r.right > nb.right + 1) return true;
    if (covers(n).some((e) => { const q = e.getBoundingClientRect(); const hit = Math.min(r.right, q.right) - Math.max(r.left, q.left) > Math.max(2 * k0, 0.12 * r.width) && Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) > 0.3 * r.height; return hit; })) return true;
    for (let p = n.parentElement; p; p = p.parentElement) {
      const pc = getComputedStyle(p);
      if (p === stage || pc.overflow !== 'visible' || pc.overflowX !== 'visible' || pc.clipPath !== 'none') { const q = p.getBoundingClientRect(); if (r.left < q.left - 1 || r.right > q.right + 1) return true; }
      if (p === stage) break;
    }
    return texts().some((o) => { if (o === t || n.contains(o.parentElement) || o.parentElement.contains(n)) return false; const q = box(o);
      // side by side on the same line: a text's box runs above and below its letters, so rows stacked tight count only when they share
      // more than a third of their height
      const v = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
      const hit = r.left < q.right + gap && q.left < r.right + gap && v > 0.35 * Math.min(r.height, q.height); return hit; });
  };
  // every pass starts from the score's own size: the pass made before the web font loaded measured a wider stand-in face and shrank
  // the score, and the pass after it must be free to put it back
  const px = nodes.map((n) => {
    if (n.dataset.scorePx == null) n.dataset.scorePx = String(parseFloat(getComputedStyle(n).fontSize) || 0);
    else n.style.setProperty('font-size', n.dataset.scorePx + 'px');
    return parseFloat(n.dataset.scorePx) || 0;
  });
  let k = 1;
  while (k > 0.6 && nodes.some(bad)) { k -= 0.05; nodes.forEach((n, i) => n.style.setProperty('font-size', (px[i] * k).toFixed(1) + 'px', 'important')); }
}

export function fitAll(stage) {
  stage.querySelectorAll('[data-fit]').forEach((n) => {
    let inner = n.querySelector(':scope > .sb-fit');
    if (!inner) { inner = el('span', 'sb-fit'); while (n.firstChild) inner.appendChild(n.firstChild); n.appendChild(inner); }
    // every pass starts from the full text, before anything is measured: a pass made before the fonts arrived may have swapped in the
    // short form (and the box shrank round it), and the pass after them must be free to put the full name back (team sweep, Nov 21,
    // 2026: "ALLG" stayed for "ALLEGHENY")
    // (kept as markup: a rank or a seed in its own box before the name must survive the swap)
    if (n.dataset.short) { if (n.dataset.long == null) n.dataset.long = inner.innerHTML; else inner.innerHTML = n.dataset.long; }
    const cs = getComputedStyle(n);
    // where the squeeze is anchored: a flex or grid box centres (or end-aligns) an item that overflows it, but a line of text that overflows
    // its block always runs out to the right whatever its text-align, so there the squeeze is anchored at the left (else it still spills)
    const a = /flex|grid/.test(cs.display) ? cs.justifyContent + ' ' + cs.justifyItems : 'left';
    inner.style.cssText = 'display:inline-block;white-space:nowrap;transform:none;translate:none;transform-origin:' + (/right|end/.test(a) ? 'right' : /center/.test(a) ? 'center' : 'left') + ' center';
    // a box that grew wider than the panel it sits in is held to that panel (it may shrink: fit() set min-width 0)
    const host_ = n.parentElement;
    if (host_ && host_ !== stage && n.offsetWidth > host_.clientWidth + 1) n.style.maxWidth = '100%';
    let room = n.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    // the room that is actually visible: a box that grows with its text can still be cut by a panel round it, or by the stage itself
    const sc = stage.getBoundingClientRect().width / (stage.offsetWidth || 1) || 1, r = n.getBoundingClientRect();
    let lo = r.left, hi = r.right;
    for (let p = n.parentElement; p; p = p.parentElement) {
      const pc = getComputedStyle(p);
      if (p === stage || pc.overflow !== 'visible' || pc.overflowX !== 'visible' || pc.clipPath !== 'none') { const pr = p.getBoundingClientRect(); lo = Math.max(lo, pr.left); hi = Math.min(hi, pr.right); }
      if (p === stage) break;
    }
    room = Math.min(room, (hi - lo) / sc - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0));
    if (room <= 0) return;   // not laid out (hidden): fitted on the next draw
    let need = inner.offsetWidth;
    if (need * TOKENS.fitFloor > room && n.dataset.short) { shortInto(inner, n.dataset.short); need = inner.offsetWidth; }
    // squeezed sideways down to the floor; tighter than that, the whole text gets smaller instead, so it stays whole and readable
    if (need * TOKENS.fitFloor > room) inner.style.transform = 'scale(' + (room / need).toFixed(4) + ')';
    else if (need > room) inner.style.transform = 'scaleX(' + (room / need).toFixed(4) + ')';
    // then where it actually landed: a squeezed text still poking out of the visible room is slid back into it
    if (inner.style.transform) {
      const q = inner.getBoundingClientRect(), pl = (parseFloat(cs.paddingLeft) || 0) * sc, pr = (parseFloat(cs.paddingRight) || 0) * sc;
      const dx = q.left < lo + pl ? lo + pl - q.left : q.right > hi - pr ? hi - pr - q.right : 0;
      if (Math.abs(dx) > 0.5) inner.style.translate = (dx / sc).toFixed(1) + 'px 0';
    }
  });
}

/**
 * Measured position corrections a bug lists as `nudge: [[selector, dx, dy, spread], ...]` (stage px, from the frame audit): every element
 * the selector finds (from the stage) moves dx right and dy down, plus `spread` outwards (away from the stage's centre line), so one entry
 * serves both teams' copies of an element. Applied with the CSS translate property, so a bug's own transforms are untouched.
 */
export function nudgeAll(stage, list, width) {
  (list || []).forEach(([sel, dx, dy, spread]) => {
    let found = [];
    try { found = stage.querySelectorAll(':scope > ' + sel); } catch (e) { return; }
    found.forEach((n) => {
      const r = n.getBoundingClientRect(), o = stage.getBoundingClientRect(), k = o.width / (width || o.width || 1);
      const side = (r.left + r.width / 2 - o.left) / k < (width || o.width) / 2 ? -1 : 1;
      n.style.translate = ((dx || 0) + side * (spread || 0)).toFixed(1) + 'px ' + (dy || 0).toFixed(1) + 'px';
    });
  });
}

/** Before the game, a team's record set small beside its letters (`after` false: before them, for a name that ends at the middle);
 * for bugs with no score box to hold it. Returns the node. */
export function withRecord(node, t, g, after = true) {
  if (g.status !== 'pre' || !t.record) return node;
  const r = el('small', 'sb-rec', t.record);
  if (after) node.appendChild(r); else node.insertBefore(r, node.firstChild);
  return node;
}

/** A score slot with room for TOKENS.scoreDigits of the sport in tabular figures, so nothing beside it moves when a score gains a digit. */
export function scoreSlot(node, g) {
  const n = TOKENS.scoreDigits[g && g.sport] || TOKENS.scoreDigits.default;
  node.classList.add('sb-num');
  // never more than the box it sits in: a look made for two-figure scores drawing a basketball game keeps its score inside its box
  node.style.minWidth = 'min(' + (n * TOKENS.figure).toFixed(2) + 'em, 100%)';
  return node;
}

/** "3" + "RD" as two spans (the suffix smaller, the way broadcasts set it). */
export function ordinal(p, cls) {
  const s = el('span', cls || 'sb-period');
  s.appendChild(document.createTextNode(p.label));
  if (p.suffix) s.appendChild(el('span', 'sb-ord', p.suffix));
  return s;
}

// ---- the marks a broadcast puts on its bug. The network's own mark is never drawn; in its place goes the Home Assistant logo (from
// Home Assistant's own icon set, asked of the person's Home Assistant like every other icon). Where the broadcast showed the league's
// logo, the league's logo goes, loaded from the same ESPN image server the team logos come from. Neither is stored in this repository.

const LEAGUE_KEY = { NFL: 'nfl', NBA: 'nba', WNBA: 'wnba', NHL: 'nhl', MLB: 'mlb', MLS: 'mls', NWSL: 'nwsl', F1: 'f1', PGA: 'pgatour', LPGA: 'lpga', LIV: 'livgolf', UFC: 'ufc', UFL: 'ufl', PWHL: 'pwhl' };
// soccer competitions have numbered logos on ESPN's image server (from each league's scoreboard reply)
const SOCCER_LOGO = { EPL: 23, BUND: 10, LIGA: 15, SERA: 12, LIG1: 9, CL: 2, CLA: 58, WC: 4, WWC: 60, MLS: 19, NWSL: 2323,
  EFL: 24, FACUP: 40, SPFL: 45, UEL: 2310, UECL: 20296, LIGAMX: 22, BRA: 85, ERED: 11, PORT: 14 };

/** Which marks a widget wants: options.bug_marks both (default) | league | ha | none. */
export function marks(o) {
  const m = (o && o.bug_marks) || 'both';
  return { league: m === 'both' || m === 'league', ha: m === 'both' || m === 'ha' };
}

/** The address of the league's logo on ESPN's image server ('' when it has none): the one the sensor names, else the known one. */
export function leagueBase(g) {
  const k = LEAGUE_KEY[g.league], n = SOCCER_LOGO[g.league];
  // the logo the sensor names (Scorebugs' own sensors and Team Tracker give league_logo), else the known address for the league
  const given = /^https:\/\/a\.espncdn\.com\/i\/(teamlogos|leaguelogos)\//.test(g.leagueLogo || '') ? g.leagueLogo : '';
  return given || (n ? 'https://a.espncdn.com/i/leaguelogos/soccer/500/' + n + '.png' : k ? 'https://a.espncdn.com/i/teamlogos/leagues/500/' + k + '.png' : '');
}

/** The league's logo, `px` square (`dark` for the version drawn for dark backgrounds); the league's letters when there is none. */
const DARK_LEAGUE_LOGOS = new Set(['EPL']);
export function leagueLogo(g, px, cls, dark) {
  const text = () => { const s = el('span', (cls || 'sb-league') + ' sb-league-text', g.league || ''); s.style.fontSize = Math.round(px * 0.34) + 'px'; return s; };
  const base = leagueBase(g);
  if (!base) return text();
  const im = el('img', cls || 'sb-league');
  im.alt = '';
  im.width = px; im.height = px;
  im.style.objectFit = 'contain';
  // a dark logo (the Premier League's purple lion) gets a thin light rim, so it shows on a dark tile
  if (DARK_LEAGUE_LOGOS.has(g.league)) im.style.filter = 'drop-shadow(0 0 1px rgba(255,255,255,.95)) drop-shadow(0 0 1px rgba(255,255,255,.95))';
  const url = logoUrl(dark ? base.replace('/500/', '/500-dark/') : base, px * 2);
  tryEach(im, [viaHA(url), url], () => im.replaceWith(text()));
  return im;
}

/** A team's three-letter code, as most broadcasts set it: a two-letter code becomes the initials of the full name (LV -> LVA). */
export function abbr3(t) {
  const a = String(t.abbr || '').toUpperCase();
  const words = String(t.longName || '').split(/\s+/).filter(Boolean);
  return a.length < 3 && words.length >= 3 ? words.map((w) => w[0]).join('').slice(0, 3).toUpperCase() : a;
}

/** A plain silver cup (a bowl on stepped bands), `px` tall: drawn here, no one's trophy logo. */
export function cupMark(px) {
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 60 100'); svg.setAttribute('width', String(px * 0.6)); svg.setAttribute('height', String(px)); svg.setAttribute('class', 'sb-cup');
  svg.innerHTML = '<defs><linearGradient id="sbcup" x1="0" x2="1"><stop offset="0" stop-color="#8d949b"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#7c838a"/></linearGradient></defs>' +
    '<g fill="url(#sbcup)" stroke="rgba(0,0,0,.35)" stroke-width="1">' +
    '<path d="M12 4 H48 Q48 22 34 26 V30 H26 V26 Q12 22 12 4 Z"/><rect x="22" y="30" width="16" height="6"/>' +
    '<rect x="18" y="36" width="24" height="12" rx="2"/><rect x="15" y="48" width="30" height="14" rx="2"/><rect x="12" y="62" width="36" height="16" rx="2"/><rect x="9" y="78" width="42" height="18" rx="2"/></g>';
  return svg;
}

/** The Home Assistant logo, `px` square, in the text colour (set `color` on it or its parent). */
export function haMark(px, cls) {
  const s = el('span', 'sb-ha' + (cls && cls !== 'sb-ha' ? ' ' + cls : ''));
  s.style.cssText = 'display:inline-grid;place-items:center;flex:none;width:' + px + 'px;height:' + px + 'px';
  s.dataset.px = String(px);   // filled in after drawing, with the host's own icon (see fillMarks)
  return s;
}

/** A team logo's dark version, worked out from its address (no lookup needed); only ESPN's logos have one. */
export function logoStyle(url, style) {
  return style === 'dark' && /^https:\/\/a\.espncdn\.com\/i\/teamlogos\/[a-z-]+\/500\//.test(url || '') ? url.replace('/500/', '/500-dark/') : url;
}

/** Light or dark text for a background colour (#rrggbb). */
/** Contrast ratio of two #rrggbb colours (1 to 21). */
export function contrast(a, b) {
  const lum = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return 0;
    return m.slice(1).map((x) => { const v = parseInt(x, 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0); };
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** A team's box in the FOX / NBC late style: the team's colour lightened at the front fading to the original,
 * white letters (the team ink), and a bright line along the top in a contrasting colour: the team's second colour when it stands out
 * from the first, else a light tint of the first. Returns { bg, line, ink, c }. */
export function teamBox(t, fallback) {
  const c = teamColor(t, fallback || '#3a3f47');
  const ok2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') && contrast(t.color2, c) >= 1.8;
  return { c, bg: 'linear-gradient(rgba(255,255,255,.14), rgba(255,255,255,0) 50%, rgba(0,0,0,.12)), linear-gradient(90deg, ' + shade(c, 0.22) + ', ' + shade(c, -0.08) + ')',
    line: ok2 ? shade(t.color2, 0.2) : shade(c, 0.55), ink: teamInk(shade(c, 0.1)) };
}

/** A team's letters in its own colour on a dark ground (the FOX strips): its first colour, or its second when the first is black or
 *  grey, lifted in lightness with its hue and saturation kept until it reads (a dark green glows green, not grey). Returns the ink
 *  and a deep shade of the same hue for a box behind it ({ ink, deep }); a black-and-grey team gets a light grey on dark grey. */
export function brightInk(t, bg = '#0b0c0e', min = 3.4) {
  const ok = (x) => /^#[0-9a-f]{6}$/i.test(x || '');
  const rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16) / 255);
  const sat = (x) => { const v = rgb(x); return Math.max(...v) - Math.min(...v); };
  const hsl = (x) => { const [r, g, b] = rgb(x), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    const h = !d ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, d ? d / (1 - Math.abs(2 * l - 1)) : 0, l]; };
  const hex = ([h, sa, l]) => { const k = (n) => (n + h / 30) % 12, a = sa * Math.min(l, 1 - l);
    return '#' + [0, 8, 4].map((n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))).toString(16).padStart(2, '0')).join(''); };
  const c = [t.color, t.color2].filter(ok).find((x) => sat(x) > 0.12);
  if (!c) return { ink: '#c9cdc9', deep: '#262a26' };
  const [h, sa, l0] = hsl(c), s2 = Math.max(sa, 0.6), deep = hex([h, Math.min(s2, 0.75), 0.2]);
  const ground = contrast(bg, '#000000') > contrast(deep, '#000000') ? bg : deep;
  let l = Math.max(l0, 0.4); while (l < 0.82 && Math.min(contrast(hex([h, s2, l]), bg), contrast(hex([h, s2, l]), deep)) < min) l += 0.03;
  return { ink: hex([h, s2, l]), deep, ground };
}

/** Text for a team's own panel: its second colour when that reads on the panel (Notre Dame gold on navy), else white or black. */
export function accentOn(t, bg) {
  const c2 = /^#[0-9a-f]{6}$/i.test(t.color2 || '') ? t.color2 : '';
  return c2 && contrast(c2, bg) >= TOKENS.accentMin ? c2 : inkOn(bg);
}

/**
 * Text colour for the parts of a bug that sit straight on the page (no panel of their own): 'light' or 'dark'.
 * `choice` is the widget's bug_ink (auto | light | dark); auto reads the page colour the host gives (any CSS colour) and picks the
 * one that reads on it. No page colour known (a mirror, a TV): light, as on a broadcast.
 */
export function inkFor(choice, background) {
  if (choice === 'light' || choice === 'dark') return choice;
  const m = /rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+))?/.exec(String(background || ''));
  const hex = /^#([0-9a-f]{6})$/i.exec(String(background || '').trim());
  let rgb = m ? [+m[1], +m[2], +m[3]] : hex ? [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)) : null;
  if (!rgb || (m && m[4] !== undefined && Number(m[4]) < 0.2)) return 'light';   // unknown or see-through: as on a broadcast
  const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  return lum > 0.55 ? 'dark' : 'light';
}

/** Text on a colour (#rrggbb): '#fff' when white reaches TOKENS.inkMin or reads better than dark, else '#111'. Every team panel uses this. */
export function inkOn(hex) {
  if (!/^#?[0-9a-f]{6}$/i.test(hex || '')) return '#fff';
  const c = hex[0] === '#' ? hex : '#' + hex;
  // a strong orange (Broncos, Browns) takes white letters as on air, even where black would measure a little higher
  const [r, gg, b] = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  if (r > 200 && gg > 40 && gg < 120 && b < 60) return '#fff';
  // the Predators' bright gold too; legible gives it a dark edge
  // the Predators' gold (#fdba31) and its darker shades (a darker shade keeps the channels' ratios; the Steelers gold has far less blue)
  if (r > 120 && gg / r > 0.7 && gg / r < 0.76 && b / r > 0.15 && b / r < 0.25) return '#fff';
  const w = contrast(TOKENS.inkLight, c);
  return w >= TOKENS.inkMin || w >= contrast(TOKENS.inkDark, c) ? '#fff' : '#111';
}
/** The team-ink token as a colour: TOKENS.inkLight or TOKENS.inkDark for text on `hex`. */
export const teamInk = (hex) => (inkOn(hex) === '#fff' ? TOKENS.inkLight : TOKENS.inkDark);

const okHex = (c) => /^#[0-9a-f]{6}$/i.test(c || '');
const rgbOf = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const hslOf = (c) => { const [r, g, b] = rgbOf(c).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, d / (1 - Math.abs(2 * l - 1)), l]; };
/** Two colours a viewer would mix up: the same colour, not merely the same family. Two different blues (Tigers navy, Dodgers royal) are
 * fine; the same blue (Warriors and Pistons), the same purple (Hornets and Suns) are not. */
export function alikeColors(x, y) {
  if (!okHex(x) || !okHex(y)) return false;
  const p = rgbOf(x), q = rgbOf(y); if (Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 60) return true;
  const a = hslOf(x), b = hslOf(y), dh = Math.min(Math.abs(a[0] - b[0]), 360 - Math.abs(a[0] - b[0]));
  return a[1] > 0.25 && b[1] > 0.25 && dh < 10 && Math.abs(a[2] - b[2]) < 0.06;
}
/** When both teams' panel colours look alike, one team (the home team first) takes its other real colour, made dark enough for white
 * letters, but only when that makes sense: a true colour (not black, grey or white) that no longer looks like
 * the other team's. Otherwise both keep their colours. Sets t.pairColor, which teamColor then gives every bug. */
function pairColors(away, home) {
  const ca = teamColor(away), ch = teamColor(home);
  if (!alikeColors(ca, ch)) return;
  const real = (c) => { if (!okHex(c)) return ''; const [, sa, l] = hslOf(c); if (sa < 0.22 || l < 0.12 || l > 0.9) return '';
    let x = c; for (let i = 0; i < 2 && contrast(TOKENS.inkLight, x) < TOKENS.inkMin; i++) x = shade(x, -0.08);
    return contrast(TOKENS.inkLight, x) >= TOKENS.inkMin ? x : ''; };   // a gold muddied into brown to carry white letters is not sensible
  for (const [t, now, other] of [[home, ch, ca], [away, ca, ch]]) {
    const alt = [t.color2, t.color].map(real).find((c) => c && c.toLowerCase() !== now.toLowerCase() && !alikeColors(c, other));
    if (alt) { t.pairColor = alt; return; }
  }
}

/** A team colour that reads on a dark bug: very dark or missing colours fall back to the second colour, then a neutral. */
export function teamColor(t, fallback) {
  if (t.pairColor) return t.pairColor;   // switched away from a look-alike opponent (pairColors)
  const ok = (c) => /^#[0-9a-f]{6}$/i.test(c || '') && c.toLowerCase() !== '#d3d3d3' && c.toLowerCase() !== '#a9a9a9';
  // one ink for both teams. A colour too light for white
  // letters (gold, yellow, white) gives way to the team's second colour when that one takes white, else it is darkened until it does,
  // as broadcasts do; so the letters on every team panel are white.
  // (a strong orange counts: it takes white letters on air, as inkOn has it)
  const white = (c) => contrast(TOKENS.inkLight, c) >= TOKENS.inkMin || inkOn(c) === '#fff';
  if (t.onAir && ok(t.onAir.color)) return t.onAir.color;  // the on-air colour, as it is
  const cands = [t.color, t.color2].filter(ok);
  if (!cands.length) return fallback || '#3a3f47';
  const good = cands.find(white);
  if (good) return good;
  let c = cands[0];
  for (let i = 0; i < 12 && !white(c); i++) c = shade(c, -0.08);
  return c;
}

/** A team's colour for a glow or an end that must stand out: its panel colour, or, when that is near black (Bears navy, a black Giants
 * feed colour), its bright second colour. */
export function vividColor(t, fallback) {
  const c = teamColor(t, fallback), c2 = t.color2 || '';
  const lum = (x) => { const v = rgbOf(x); return (Math.max(...v) + Math.min(...v)) / 510; }, sat = (x) => { const v = rgbOf(x); return (Math.max(...v) - Math.min(...v)) / 255; };
  // (its own first colour counts too: the Panthers' blue was set aside for white letters and their black taken)
  if (!okHex(c) || lum(c) >= 0.16) return c;
  return [t.color, c2].find((x) => okHex(x) && sat(x) > 0.45 && lum(x) > 0.25 && lum(x) < 0.8) || c;
}

/** Both teams' panel colours, never alike. Each starts
 * as teamColor; when the two are alike, a team whose first colour was set aside for white letters gets it back (GS's gold, CHA's teal:
 * the colour it is known by), else the home team takes its second colour. For bugs whose letters follow the panel (inkOn). */
export function teamPair(a, b, fallback) {
  const ok = okHex, alike = alikeColors;
  let ca = teamColor(a, fallback), ch = teamColor(b, fallback);
  if (!ok(ca) || !ok(ch) || !alike(ca, ch)) return [ca, ch];
  if (ok(a.color) && a.color.toLowerCase() !== ca.toLowerCase() && !alike(a.color, ch)) return [a.color, ch];
  if (ok(b.color) && b.color.toLowerCase() !== ch.toLowerCase() && !alike(b.color, ca)) return [ca, b.color];
  const alt = [b.color2, b.color].find((c) => ok(c) && !alike(c, ca));
  return alt ? [ca, alt] : [ca, ch];
}

/** Letters for a teamPair colour: white while it reads as big bold type (3:1), else the team's other colour when that reads (GS:
 *  navy on gold), else a deep shade of the panel. */
export function panelInk(t, c) {
  if (contrast('#ffffff', c) >= 3) return '#fff';
  const c2 = [t.color2, t.color].find((x) => /^#[0-9a-f]{6}$/i.test(x || '') && x.toLowerCase() !== String(c).toLowerCase() && contrast(x, c) >= 4.5);
  return c2 || shade(c, -0.75);
}

/** A colour made darker (f < 0) or lighter (f > 0), -1..1. */
export function shade(hex, f) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return hex;
  return '#' + m.slice(1).map((x) => { const v = parseInt(x, 16); return Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f).toString(16).padStart(2, '0'); }).join('');
}

/**
 * Old-TV picture for a bug: 'soft' = a standard-definition blur with faint scanlines (how bugs looked on a 90s/2000s set),
 * 'vhs' = softer still with the red/blue colour bleed of a taped game. One CSS filter, nothing animated.
 */
export const TV = {
  soft: 'blur(1.6px) contrast(1.08) saturate(1.1)',
  vhs: 'blur(2.1px) saturate(1.35) drop-shadow(2.5px 0 0 rgba(255,40,60,.4)) drop-shadow(-2.5px 0 0 rgba(40,170,255,.4))',
};
// The scanlines are drawn by an SVG filter that keeps them inside the bug's own pixels (a plain overlay would stripe the empty box
// around a bug that is not rectangular). The filter lives in the stage itself, so it resolves inside a shadow root too.
export function tvLook(stage, mode) {
  if (!TV[mode]) return;
  const id = 'sb-scan-' + mode, ns = 'http://www.w3.org/2000/svg';
  const a = mode === 'vhs' ? '.28' : '.2';
  const lines = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="3"><rect width="1" height="1" fill="#000" fill-opacity="' + a + '"/></svg>');
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'sb-scan'); svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
  svg.innerHTML = '<filter id="' + id + '" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
    '<feImage href="' + lines + '" x="0" y="0" width="1" height="3" result="l"/><feTile in="l" result="t"/>' +
    '<feComposite in="t" in2="SourceAlpha" operator="in" result="c"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="c"/></feMerge></filter>';
  stage.appendChild(svg);
  stage.style.filter = 'url(#' + id + ') ' + TV[mode];
}

/** n timeout pips, the used ones dimmed. Football has 3 per half. */
export function pips(left, total, cls) {
  const box = el('span', cls || 'sb-pips');
  for (let i = 0; i < (total || 3); i++) box.appendChild(el('i', left != null && i >= left ? 'used' : ''));
  // what the kit needs to count them again when the bug draws another sport's game (fitPips)
  box.dataset.pips = String(total || 3); box.dataset.left = left != null ? String(left) : '';
  return box;
}

/**
 * The three bases as squares turned 45 degrees: second at the top, third left, first right. `on` is [first, second, third];
 * occupied bases get the class "on". `s` is a base's side in px. The bug's CSS colours `.sb-bases i` and `.sb-bases i.on`.
 */
export function bases(on, s, cls) {
  const box = el('span', cls || 'sb-bases');
  const step = s * 0.82, pad = s * 0.22;
  box.style.cssText = 'position:relative;display:inline-block;flex:none;width:' + (2 * step + s + 2 * pad) + 'px;height:' + (step + s + 2 * pad) + 'px';
  [[1, step, 0], [2, 0, step], [0, 2 * step, step]].forEach(([k, x, y]) => {
    const b = el('i', on && on[k] ? 'on' : '');
    b.style.cssText = 'position:absolute;box-sizing:border-box;left:' + (x + pad) + 'px;top:' + (y + pad) + 'px;width:' + s + 'px;height:' + s + 'px;transform:rotate(45deg)';
    box.appendChild(b);
  });
  return box;
}

// the tournaments' logos from the catalogue (Wikimedia addresses), filled when the catalogue is read
let EVENT_LOGOS = [];
/** The listed logo for this game's event: the sport matches and the event's name starts with one of the listed names. */
export function eventLogoUrl(g, list) {
  const name = String(g.event || '').toLowerCase().trim();
  if (!name) return '';
  const hit = (list || EVENT_LOGOS).find((e) => e.sport === g.sport && (e.names || []).some((n) => name.startsWith(n)));
  return hit && /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(hit.url || '') ? hit.url : '';   // only Wikimedia's own image hosts
}

/**
 * The tournament's or event's own logo (the Masters, The Open, a Grand Slam), `px` high, or null when there is no address for it.
 * ESPN serves none, so the address comes from the widget (options.event_logo, the person's own) or from the sensor (event_logo).
 * Like team logos, it is loaded at display time; nothing is stored.
 */
export function eventLogo(g, px, opts, cls) {
  const url = httpsOnly(opts && opts.event_logo) || httpsOnly(g.eventLogo) || eventLogoUrl(g);
  if (!url) return null;
  const im = el('img', cls || 'sb-event-logo');
  im.alt = ''; im.height = px; im.style.cssText = 'height:' + px + 'px;width:auto;object-fit:contain';
  tryEach(im, [viaHA(url), url], () => im.remove());
  return im;
}

/** A player's photo from ESPN's headshot service ('' when the sport has none there); the bug falls back to the flag. */
export function headshot(sport, id) {
  const dir = { golf: 'golf', racing: 'rpm', tennis: 'tennis', mma: 'mma' }[sport];
  return dir && /^\d+$/.test(String(id || '')) ? 'https://a.espncdn.com/i/headshots/' + dir + '/players/full/' + id + '.png' : '';
}

/** A soccer clock as the bugs show it: the minute while live ("67'", "45'+2"), HT at half time, FT at the end, the kick-off before. */
export function soccerClock(g, time) {
  // MM:SS from the running seconds when the sensor has them (not in added time, where the minute text "90'+5'" says more)
  if (g.status === 'live' && g.clockSec != null && !/\+/.test(g.clock || '')) {
    const s = Math.max(0, Math.floor(g.clockSec));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  if (g.status === 'live') return g.clock || 'HT';
  if (g.status === 'final') return 'FT';
  return statusText(g, time);
}

/** Soccer bugs put the home team first, as broadcasts outside North America do (and MLS and NWSL too). */
export const homeFirst = (g) => [g.home, g.away];

/** "▲7" / "▼7" for the half inning, or the plain inning number when the half is unknown. */
export function inning(g) {
  const h = g.baseball && g.baseball.half;
  return (h === 'top' ? '▲' : h === 'bot' ? '▼' : '') + (g.period.label || '');
}

/**
 * Another sport's live game on a baseball look: what goes in its baseball block's place, or null (a baseball game, or not live).
 * period: the inning's spot ("Q3" for football and basketball, "2H" for halves, "2ND" for hockey, "2H" for soccer, or the word: "OT",
 * "2OT", "SO", "ET"); clock: the count's spot; detail: the bases' room, one thing when there is one: football's down and distance
 * ("3RD & 7"), basketball's bonus ("BOS BONUS": the team that shoots it), hockey's power play, soccer's added time ("+3"). The outs have
 * no counterpart: a look shows no outs for another sport. wrap: the most letters the look's detail room holds on one line; a longer
 * detail comes back on two lines ("4TH" over "& GOAL", "POWER" over "PLAY"; the look sets `white-space: pre-line`).
 */
export function otherSport(g, wrap = 0) {
  if (!g || g.sport === 'baseball' || g.status !== 'live') return null;
  const p = g.period || {};
  const halves = g.sport === 'basketball' && g.league === 'NCAAM';
  const period = !p.label ? '' : p.word ? p.label : g.sport === 'hockey' ? p.label + (p.suffix || '') : halves ? p.label + 'H' : 'Q' + p.label;
  let clock = String(g.clock || ''), detail = '';
  if (g.sport === 'football' && g.football && g.football.short) detail = g.football.short;
  else if (g.sport === 'hockey' && g.hockey && g.hockey.powerPlay) detail = 'POWER PLAY';
  else if (g.sport === 'basketball') { const t = [g.away, g.home].find((x) => x && x.bonus); if (t) detail = (String(t.abbr || '').toUpperCase() + ' BONUS').trim(); }
  else if (g.sport === 'soccer') { const m = /^(\d+')\+(\d+)/.exec(clock); if (m) { clock = m[1]; detail = '+' + m[2]; } }
  if (wrap && detail.length > wrap && / /.test(detail)) detail = / & /.test(detail) ? detail.replace(' & ', '\n& ') : detail.replace(/ (?=\S+$)/, '\n');
  return { period, clock, detail };
}

/**
 * Cricket, worked out once for every cricket bug: the batting side (the one with the ball, else the first
 * with runs), its runs, wickets, overs and balls bowled, the run rate, the match's overs when the note or league says (T20 20, ODI 50,
 * none for a test), and in a limited-overs chase the target, runs needed and balls left; in a test, the lead (+) or deficit (-).
 * Fields the feed lacks stay null; a bug shows only what is there.
 */
export function cricketState(g) {
  const sides = [g.home, g.away];
  const bat = sides.find((t) => t.hasBall) || sides.find((t) => t.score != null) || sides[0], bowl = bat === g.home ? g.away : g.home;
  const ov = parseFloat(bat.overs || ''), balls = isNaN(ov) ? null : Math.floor(ov) * 6 + Math.round((ov % 1) * 10);
  const note = String(g.note || '') + ' ' + String(g.event || '');
  const max = /\btest\b|first-class/i.test(note) ? null : /\bt20|twenty20|\b20 ov/i.test(note) || /^(IPL|BBL|WBBL|PSL|CPL|SA20|T20)/i.test(g.league || '') ? 20 : /\bodi\b|one-day|\b50 ov/i.test(note) ? 50 : null;
  const runs = bat.score, wkts = bat.wickets;
  const chase = max != null && bowl.score != null && runs != null && g.status !== 'pre';
  const target = chase ? bowl.score + 1 : null;
  return {
    bat, bowl, runs, wkts, overs: bat.overs || '', balls, max,
    rate: runs != null && balls ? runs * 6 / balls : null,
    target, need: chase ? Math.max(0, target - runs) : null, ballsLeft: chase && balls != null ? Math.max(0, max * 6 - balls) : null,
    lead: max == null && runs != null && bowl.score != null ? runs - bowl.score : null,
    result: cricketResult(g),
  };
}
/** A side's cricket score, short: runs and wickets joined by `sep` ("206-2"; the Australian order, wickets first, with `wicketsFirst`:
 *  "2/206"); all out or wickets unknown: the runs alone; no runs: ''. */
export function cricketScore(t, sep = '-', wicketsFirst = false) {
  if (!t || t.score == null) return '';
  if (t.wickets == null || t.wickets >= 10) return String(t.score);
  return wicketsFirst ? t.wickets + sep + t.score : t.score + sep + t.wickets;
}
// after the game: the winner and the margin from the feed's result line ("Australia won by 112 runs" -> AUS, "112 RUNS"), a tie or no
// result as its words; null during play (a feed can carry an old result in the note)
function cricketResult(g) {
  if (g.status !== 'final') return null;
  const line = [g.lastPlay, g.note].find((x) => /\b(won|beat|tied|draw|drawn|no result|abandoned)\b/i.test(x || '')) || '';
  const m = /won by (.+?)\s*(\(|$)/i.exec(line);
  const sides = [g.home, g.away], named = (t) => [t.longName, t.name, t.abbr].some((n) => n && line.toLowerCase().startsWith(String(n).toLowerCase()));
  const team = sides.find((t) => t.winner) || sides.find(named) || null;
  if (m && team) return { team, by: m[1].toUpperCase(), text: (team.abbr || '').toUpperCase() + ' WON BY ' + m[1].toUpperCase() };
  const w = /\b(tied|draw|drawn|no result|abandoned)\b/i.exec(line);
  return w ? { team: null, by: '', text: w[1].toUpperCase() === 'DRAWN' ? 'DRAW' : w[1].toUpperCase() } : null;
}

/** A small "when" line for a game that has not started or is over: "SUN 12:00 PM", "FINAL", "FINAL/OT". */
/**
 * Before the game, in the clock slot every bug already sizes for "9:43 PM":
 * the last hour counts down ("IN 45 MIN", then "STARTING"); later today the start time ("9:43 PM"); this week the day and time
 * ("SAT 9:43 PM"); further out the day and date ("SAT 11/29"). The bugs redraw every minute, so the countdown stays true.
 */
export function preText(g, time, now) {
  const d = new Date(g.starts);
  if (isNaN(d)) return '';
  const mins = (d - now) / 60000;
  if (mins <= 0.5) return 'STARTING';
  if (mins < 60) return 'IN ' + Math.ceil(mins) + ' MIN';
  const wd = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.parts(d).wd];
  if (time.sameDay(d, now)) return time.ampm(d).toUpperCase();
  if (mins < 6 * 24 * 60) return wd + ' ' + time.ampm(d).toUpperCase();
  return wd + ' ' + (d.getMonth() + 1) + '/' + d.getDate();
}

export function statusText(g, time) {
  if (g.status === 'final') return g.period && g.period.word && /OT|SO/.test(g.period.label) ? 'FINAL/' + g.period.label : 'FINAL';
  if (g.status === 'pre') return preText(g, time, new Date());
  return '';
}

// ---------------------------------------------------------------- choosing a bug

let catalogue = null;
/** The catalogue (catalogue.json next to this file, read once): { bugs, defaults: league / sport -> id }. */
export function loadCatalogue() {
  catalogue = catalogue || fetch(new URL('./catalogue.json', import.meta.url).href).then((r) => r.json()).then(indexCatalogue)
    .catch(() => ({ bugs: [], defaults: { '*': 'nfl-blocks-25' } }));
  return catalogue;
}
export function indexCatalogue(j) {
  const defaults = {};
  (j.bugs || []).forEach((b) => (b.default_for || []).forEach((k) => { if (!defaults[k]) defaults[k] = b.id; }));
  EVENT_LOGOS = Array.isArray(j.event_logos) ? j.event_logos : [];
  return { bugs: j.bugs || [], defaults, eventLogos: EVENT_LOGOS };
}

// The network text the sensor gives varies ("ESPN2", "ABC/ESPN+", "Prime Video", "NBC/Peacock"). Each part is put in a plain form
// and looked up here; a network not listed keeps its plain form. Only plain words: no network mark is ever drawn.
const NETWORK = {
  ESPN: 'ESPN', ESPN2: 'ESPN', ESPNU: 'ESPN', ESPNEWS: 'ESPN', 'ESPN+': 'ESPN', 'ESPN DEPORTES': 'ESPN', SECN: 'ESPN', 'SEC NETWORK': 'ESPN',
  ACCN: 'ESPN', 'ACC NETWORK': 'ESPN', ABC: 'ABC',
  FOX: 'FOX', FS1: 'FOX', FS2: 'FOX', 'FOX DEPORTES': 'FOX', BTN: 'FOX', 'BIG TEN NETWORK': 'FOX',
  CBS: 'CBS', CBSSN: 'CBS', 'CBS SPORTS NETWORK': 'CBS', 'PARAMOUNT+': 'CBS',
  NBC: 'NBC', PEACOCK: 'NBC', USA: 'NBC', 'USA NET': 'NBC', 'USA NETWORK': 'NBC', NBCSN: 'NBC', TELE: 'NBC', TELEMUNDO: 'NBC', UNIVERSO: 'NBC',
  TNT: 'TNT', TBS: 'TNT', TRUTV: 'TNT', MAX: 'TNT', 'HBO MAX': 'TNT',
  PRIME: 'PRIME', 'PRIME VIDEO': 'PRIME', 'AMAZON PRIME VIDEO': 'PRIME', AMAZON: 'PRIME',
  'APPLE TV': 'APPLE', 'APPLE TV+': 'APPLE', APPLETV: 'APPLE', NETFLIX: 'NETFLIX',
  NFLN: 'NFLN', 'NFL NETWORK': 'NFLN', NBATV: 'NBATV', 'NBA TV': 'NBATV', MLBN: 'MLBN', 'MLB NETWORK': 'MLBN', NHLN: 'NHLN', 'NHL NETWORK': 'NHLN',
};
/** "ABC/ESPN+" -> ['ABC', 'ESPN']: the networks a game is on, in the order the sensor names them. */
export function networksOf(tv) {
  const out = [];
  String(tv || '').toUpperCase().split(/\s*(?:\/|,|&|\|)\s*/).forEach((p) => {
    const k = p.trim().replace(/\s+/g, ' ');
    if (!k) return;
    const n = NETWORK[k] || NETWORK[k.replace(/\+$/, '')] || k;
    if (!out.includes(n)) out.push(n);
  });
  return out;
}
const fitsGame = (b, g) => (b.leagues && b.leagues.length ? b.leagues.includes(g.league) : (b.sports || []).includes(g.sport));
/**
 * The current bug for the network showing this game, or '' when no bug matches it. A bug marked `postseason` in the catalogue (a
 * tournament's own look, like the college basketball tournament's) is used only for postseason games, and before the network's
 * everyday bug when it is one.
 */
export function bugForNetwork(g, bugs) {
  const post = !!(g.round && g.round.dress && g.round.dress !== 'regular');
  for (const n of networksOf(g.tv)) {
    const fits = (bugs || []).filter((b) => (b.networks || []).includes(n) && fitsGame(b, g) && (post || !b.postseason));
    const hit = fits.find((b) => b.postseason) || fits[0];
    if (hit) return hit.id;
  }
  return '';
}

/**
 * The bug for a game: the widget's own pick; `network` = the bug for the network showing the game; then the per-league pick (which can
 * also be `network`); then the catalogue default for the league, then for the sport, then the generic one.
 */
// Which bugs may draw which games: football, basketball and hockey share bars (they are alike: two teams, a score, a
// period and a clock). A baseball look also draws football, basketball, hockey and soccer games: in its baseball block's place it
// shows the period, the clock and one detail of the game (otherSport), and no outs or bases. Every other sport is locked: it keeps to
// its own bugs, and its bugs keep to it, even when a card, a team rule, a league pick or the overall look asks otherwise. Tennis and
// volleyball (sets), golf (a leaderboard), racing (a running order), MMA (fighters and rounds), cricket (runs and wickets),
// Australian football (goals.behinds) and soccer (its bars broke on two- and three-figure scores; team bars cut fighters' names, and
// the MMA bar and cricket strip showed no score or one score for a team game). Baseball games take only baseball looks (they need
// the bases and the count). The rule is read from the catalogue's `sports` alone: a bug that lists only locked sports draws only those
// (and what ALSO_DRAWS gives them); a bug made for several sports (the generic bar) draws each sport it lists.
export const SHARED_SPORTS = ['football', 'basketball', 'hockey'];
export const LOCKED_SPORTS = Object.keys(SPORT).filter((s) => !SHARED_SPORTS.includes(s));
/** Other sports a locked sport's looks may draw as well. */
export const ALSO_DRAWS = { baseball: ['football', 'basketball', 'hockey', 'soccer'] };
const also = (sp, sport) => sp.length > 0 && sp.every((x) => (ALSO_DRAWS[x] || []).includes(sport));
const sportsOf = (bugs, id) => { const b = (bugs || []).find((x) => x.id === id); return b ? b.sports || [] : null; };
/** The looks a picker offers for a sport: the bugs made for it, and the looks that also draw it (a locked sport's looks are offered
 *  for that sport only). */
export function looksFor(bugs, sport) {
  return (bugs || []).filter((b) => b && b.id && ((b.sports || []).includes(sport) || also(b.sports || [], sport)));
}
/** May this bug draw this game? Yes for a sport the bug is made for or also draws; else only a shared sport on a bug made for shared
 *  sports alone. */
export function bugAllowed(id, g, bugs) {
  const sp = sportsOf(bugs, id);
  if (!sp || !sp.length) return true;   // unknown or general bug: no lock
  if (sp.includes(g.sport)) return true;
  if (also(sp, g.sport)) return true;
  return SHARED_SPORTS.includes(g.sport) && sp.every((x) => SHARED_SPORTS.includes(x));
}

// Bugs merged into another: a saved card that names the old
// id draws the merged bug.
export const RETIRED = { 'mlb-strip-26': 'mlb-nbc-26', 'nfl-espn-20': 'nfl-neon-17', 'nfl-nbc-20': 'nfl-flat-18', 'nfl-fox-00': 'nfl-foxbox-03', 'nfl-fox-20': 'nfl-fox-17', 'nfl-twotone-17': 'nfl-fox-10', 'mlb-yes-23': 'mlb-yes-26' };
const current = (id) => RETIRED[id] || id;
/**
 * A team rule (bug_by_team: { "NFL:CHI": "nfl-fox-10", "CHI": "network" }): when a team with a rule plays, its bug is used, before the
 * card's own pick. The key is the league and the team's letters, or the letters alone for any league. The followed team's rule wins
 * over the opponent's. A rule's bug that may not draw this game's sport is skipped.
 */
export function bugForTeams(g, opts, bugs) {
  const rules = opts && opts.bug_by_team && typeof opts.bug_by_team === 'object' ? opts.bug_by_team : null;
  if (!rules) return '';
  const sides = [g.away, g.home].filter(Boolean).sort((x, y) => (y.followed ? 1 : 0) - (x.followed ? 1 : 0));
  for (const t of sides) {
    const ab = String(t.abbr || '').toUpperCase();
    if (!ab) continue;
    const r = rules[g.league + ':' + ab] || rules[ab];
    if (!r) continue;
    if (r === 'network') { const n = bugForNetwork(g, bugs); if (n) return n; continue; }
    const id = current(r);
    if (bugs && bugs.length && !bugs.some((b) => b.id === id)) continue;   // a rule with no bug picked yet ('pick') or an unknown id
    if (bugAllowed(id, g, bugs)) return id;
  }
  return '';
}
export function bugFor(g, opts, defaults, bugs) {
  const ruled = bugForTeams(g, opts, bugs);
  if (ruled) return ruled;
  // a card set to a bug of its own keeps it; else the look Scorebugs' settings give the team (its sensor's bug_look), else the
  // overall look (look_default, from scorebugs/settings, for sensors that aren't Scorebugs' own)
  let pick = current(opts.bug || 'auto');
  if (pick === 'auto') {
    const look = current(g.look || opts.look_default || '');
    if (look === 'network') pick = 'network';
    else if (look && (!bugs || !bugs.length || bugs.some((b) => b.id === look)) && bugAllowed(look, g, bugs)) return look;
  }
  // the league's default, the sport's, then the generic one; a default that may not draw this sport is passed over
  const fallback = () => [defaults[g.league], defaults[g.sport], defaults['*']].find((id) => id && bugAllowed(id, g, bugs)) || defaults[g.sport] || defaults['*'];
  if (pick !== 'auto' && pick !== 'network') return bugAllowed(pick, g, bugs) ? pick : fallback();
  // a tournament with its own look (a golf major's board, a tennis major's colours): matched on the event's name
  const eventLook = (bugs || []).find((b) => fitsGame(b, g) && (b.events || []).some((e) => String(g.event || '').toLowerCase().includes(String(e).toLowerCase())));
  if (eventLook) return eventLook.id;
  const own = current((opts.bug_by_league || {})[g.league]);
  if (pick === 'network' || own === 'network') { const n = bugForNetwork(g, bugs); if (n) return n; }
  const mine = own && own !== 'network' ? own : '';
  return (mine && bugAllowed(mine, g, bugs) ? mine : '') || fallback();
}

// ---------------------------------------------------------------- team logo versions

/** The logo versions a widget can ask for (bug_logos). `primary` is the logo the sensor gives. */
export const LOGO_STYLES = ['primary', 'dark', 'secondary', 'white', 'secondary-white', 'black'];
// any logo ESPN lists can be picked by its plain name ("primary-on-white", "secondary-black", "grayscale": espn.logo_name)
const styleName = (s) => typeof s === 'string' && /^[a-z0-9-]{1,40}$/.test(s) && s !== 'auto';
// When a team has no logo of the version asked for, the next one in its list is tried; the sensor's own logo is always last.
const LOGO_FALLBACK = { dark: ['dark'], secondary: ['secondary'], white: ['white', 'dark'], 'secondary-white': ['secondary-white', 'white', 'dark'], black: ['black'] };

/** Pick a logo address from a team's versions (as scorebugs/team_logos returns them), with the fallbacks above. */
export function pickLogo(versions, style, given) {
  const want = LOGO_FALLBACK[style] || (styleName(style) && style !== 'primary' ? [style] : null);
  if (!want) return given;
  for (const k of want) if (versions && versions[k] && (!ESPN_ONLY || !/^https?:/.test(versions[k]) || /^https:\/\/a\.espncdn\.com\//.test(versions[k]))) return versions[k];
  return want.includes('dark') ? logoStyle(given, 'dark') : given;
}

const logoCache = new Map();   // "sport/league/id" -> Promise<versions or null>, for the life of the page
const teamKey = (g, t) => g.sportPath + '/' + g.leaguePath + '/' + t.id;
/** Ask Home Assistant for the teams' logo versions: only teams on a bug being drawn, only when a version other than primary/dark is wanted. */
async function teamLogos(host, games) {
  const want = [];
  games.forEach((g) => [g.away, g.home].forEach((t) => {
    if (!t.id || !g.sportPath || !g.leaguePath) return;
    const k = teamKey(g, t);
    if (!logoCache.has(k) && !want.some((w) => w.key === k)) want.push({ key: k, sport: g.sportPath, league: g.leaguePath, id: String(t.id) });
  }));
  if (want.length && host.callWS) {
    const ask = Promise.resolve().then(() => host.callWS({ type: 'scorebugs/team_logos', teams: want.map(({ sport, league, id }) => ({ sport, league, id })) }))
      .then((r) => (r && r.teams) || {}, () => ({}));
    want.forEach((w) => logoCache.set(w.key, ask.then((all) => all[w.key] || null)));
  }
  const out = {};
  await Promise.all(games.flatMap((g) => [g.away, g.home].map(async (t) => {
    const k = teamKey(g, t);
    out[k] = logoCache.has(k) ? await logoCache.get(k) : null;
  })));
  return out;
}

// ---------------------------------------------------------------- drawing

const bugCache = new Map();
const loadBug = (id) => {
  id = current(id);
  if (!/^[a-z0-9-]+$/.test(id || '')) return Promise.reject(new Error('bad bug id'));
  if (!bugCache.has(id)) bugCache.set(id, import('./bugs/' + id + '.js').then((m) => m.default));
  return bugCache.get(id);
};
const cssDone = new WeakMap();   // document or shadow root -> ids whose CSS it already has
// the kit's own rules, shared by every bug
// a bug's status line (class w: the start time before the game, FINAL after) stays on one line; mount fits it to its box
const KIT_CSS = { id: 'sb-kit', css: '.sb .sb-pre-rec { letter-spacing: 0 !important; } .sb-num { font-variant-numeric: tabular-nums; display: inline-block; text-align: center; } .sb .w { white-space: nowrap; } .sb.sb-vintage-logos img.sb-logo { filter: blur(.7px) saturate(.85) contrast(.95) !important; } .sb .sb-rec { font-size: .5em; margin: 0 .4em; opacity: .92; letter-spacing: 0; white-space: nowrap; vertical-align: middle; }' };
function addCss(bug, where) {
  const done = cssDone.get(where) || new Set();
  cssDone.set(where, done);
  if (done.has(bug.id) || !bug.css) return;
  done.add(bug.id);
  const st = document.createElement('style');
  st.textContent = bug.css;
  (where === document ? (document.head || document.documentElement) : where).appendChild(st);
}

/** The mark slot choices (options.bug_mark): what goes where the TV network's logo was. bug_mark_style picks the league logo's version. */
export const MARKS = ['ha', 'league', 'own', 'none'];
export const MARK_STYLES = ['auto', 'colour', 'dark', 'white'];
export const OWN_MARK = 'marks/network';   // the add-on's name for the person's own mark (logo_view.MARK)

const whiteCache = new Map();
/** A logo in one colour, white: its coloured parts turn white and its own white details become see-through, so the shape still reads
 * (a plain white filter would fill the whole logo). Needs a readable image (Home Assistant's copy, or ESPN); otherwise left as it is. */
function whiteMark(im) {
  if (im.dataset.white) return;
  const src = im.currentSrc || im.src;
  if (!whiteCache.has(src)) {
    let url = '';
    try {
      const w = im.naturalWidth, h = im.naturalHeight, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
      const d = cx.getImageData(0, 0, w, h);
      for (let i = 0; i < d.data.length; i += 4) {
        const lum = (0.2126 * d.data[i] + 0.7152 * d.data[i + 1] + 0.0722 * d.data[i + 2]) / 255;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = 255;
        if (lum > TOKENS.whiteCut) d.data[i + 3] = 0;   // the logo's own white: a hole in the white mark
      }
      cx.putImageData(d, 0, 0); url = cv.toDataURL('image/png');
    } catch (e) { url = ''; }
    whiteCache.set(src, url);
  }
  const url = whiteCache.get(src);
  if (url) { im.dataset.white = '1'; im.removeAttribute('crossorigin'); im.src = url; }
}

/**
 * Fill the places a bug left for the network's mark (haMark) with the widget's choice: the Home Assistant logo (default, from the host's
 * own icons), the league's logo (ESPN's colour or dark version, or the colour one in white; auto picks by the slot's background), the
 * person's own picture (uploaded in the add-on's Configure > Your own mark), or nothing (the space stays, so the layout does not move).
 * A league with no logo, or no own picture, falls back to the Home Assistant logo. Runs once the stage is in the page.
 */
function fillMarks(stage, host, g, o) {
  const mode = MARKS.includes(o && o.bug_mark) ? o.bug_mark : 'ha';
  const style = MARK_STYLES.includes(o && o.bug_mark_style) ? o.bug_mark_style : 'auto';
  stage.querySelectorAll('.sb-ha[data-px]').forEach((s) => {
    const px = Number(s.dataset.px);
    const ha = () => { if (host.icon) Promise.resolve(host.icon('home-assistant', px)).then((n) => { if (n) s.replaceChildren(n); }, () => {}); };
    const picture = (urls) => {
      const im = el('img', 'sb-mark'); im.alt = ''; im.width = px; im.height = px; im.style.cssText = 'width:' + px + 'px;height:' + px + 'px;object-fit:contain';
      s.replaceChildren(im);
      tryEach(im, urls, () => { im.remove(); ha(); });
      return im;
    };
    if (mode === 'none') { s.style.visibility = 'hidden'; return; }
    if (mode === 'own') { const u = viaHA('', OWN_MARK); return u ? void picture([u]) : ha(); }
    if (mode === 'league' && g) {
      const base = leagueBase(g);
      if (!base) return ha();   // no logo for this league on ESPN (college, CFL, PGA): the Home Assistant logo stays
      const bg = panelBehind(s), dark = bg && contrast(bg, '#000000') < contrast(bg, '#ffffff');
      const v = style === 'auto' ? (dark ? 'dark' : 'colour') : style;
      const colour = logoUrl(base, px * 2), darkUrl = logoUrl(base.replace('/500/', '/500-dark/'), px * 2);
      // some leagues have no dark version (MLS, NWSL, UFC, the soccer competitions): then the colour one
      const im = picture(v === 'dark' ? [viaHA(darkUrl), darkUrl, viaHA(colour), colour] : [viaHA(colour), colour]);
      if (v === 'white') im.addEventListener('load', () => whiteMark(im));
      return;
    }
    ha();
  });
}

/**
 * The plug: draws the host's games as scorebugs into `root`, scaled to `host.width`, and keeps them up to date through host.refresh.
 * opts: bug, bug_by_league, bug_by_team, bug_lower, bug_texture, bug_marks, bug_mark, bug_mark_style, bug_logos, bug_tv, bug_height, bug_gap, max_games, show_next, empty_text.
 */
export async function mount(root, host, opts) {
  const o = opts || {}, entities = (host.entities || []).filter(Boolean);
  const cat = await loadCatalogue();
  const time = host.time || plainTime, align = host.align || 'left';
  const rootNode = root.getRootNode ? root.getRootNode() : document;
  const cssRoot = rootNode && rootNode !== document && rootNode.nodeType === 11 ? rootNode : document;   // a shadow root gets its own copy
  // bug_logos picks one logo version for every team; auto (or unset) uses each team's own My teams choice, else primary
  const fixed = styleName(o.bug_logos) ? o.bug_logos : null;
  // a bug may name the version its look uses (bug.logos, e.g. white logos on team colours); the widget's and the team's own choice win
  const styleOf = (t, bug) => fixed || (styleName(t.logoStyle) && t.logoStyle !== 'primary' ? t.logoStyle : (bug && styleName(bug.logos) ? bug.logos : 'primary'));
  const render = async () => {
    const states = await Promise.all(entities.map((t) => host.state(t)));
    const games = gamesToShow(states.map((s) => gameOf(s)), Date.now(), o);
    const bugs = await Promise.all(games.map((g) => loadBug(bugFor(g, o, cat.defaults, cat.bugs)).catch(() => loadBug(cat.defaults['*']))));
    const ask = games.filter((g, i) => g.kind !== 'board' && [g.away, g.home].some((t) => !t.logos && !['primary', 'dark'].includes(styleOf(t, bugs[i]))));
    const versions = ask.length ? await teamLogos(host, ask) : {};
    if (root.isConnected === false) return;
    const W = host.width || 1000;   // read on every draw: a dashboard card can change width
    clear(root);
    games.forEach((g, i) => {
      const bug = bugs[i];
      addCss(KIT_CSS, cssRoot);
      addCss(bug, cssRoot);
      (bug.fonts || []).forEach((f) => font(f.family, f.file, f.desc));
      // a bug can size itself to the game (a golf board without a followed player leaves out the player panel)
      const size0 = typeof bug.sizeFor === 'function' ? bug.sizeFor(g, o) : bug.size;
      // bug_lower hide: a bug with a strip under its main bar (bug.lower: the strip's height) leaves it out and is that much shorter
      const dropLow = o.bug_lower === 'hide' && bug.lower > 0;
      const size = dropLow ? { w: size0.w, h: size0.h - bug.lower } : size0;
      const scale = Math.min(W / size.w, (o.bug_height || size.h) / size.h);
      const holder = el('div', 'sb-holder');
      holder.style.cssText = 'position:relative;width:' + W + 'px;height:' + Math.round(size.h * scale) + 'px;margin-bottom:' + (o.bug_gap == null ? 16 : o.bug_gap) + 'px';
      const stage = el('div', 'sb sb-' + bug.id);
      if (host.background) stage.dataset.page = String(host.background).replace(/#([0-9a-f]{6})\b/i, (m, h) => 'rgb(' + [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',') + ')');
      const left = align === 'right' ? W - size.w * scale : align === 'center' ? (W - size.w * scale) / 2 : 0;
      stage.style.cssText = 'position:absolute;top:0;left:' + Math.round(left) + 'px;width:' + size.w + 'px;height:' + size.h + 'px;transform-origin:0 0;transform:scale(' + scale.toFixed(4) + ')';
      if (g.kind !== 'board') [g.away, g.home].forEach((t) => {
        const st = styleOf(t, bug);
        if (st !== 'primary') t.logo = pickLogo(t.logos || versions[teamKey(g, t)], st, t.logo);
      });
      g.dress = dressFor(g, bug, o);
      // text that sits straight on the page takes a colour that reads on it (bug_ink; the card tells the page colour)
      if (inkFor(o.bug_ink, host.background) === 'dark') stage.classList.add('sb-ink-dark');
      if (g.dress !== 'regular') stage.classList.add('sb-' + g.dress);
      if (dropLow) stage.classList.add('sb-no-lower');
      setTexture(stage, bug, o);
      // the strip under a bug (bug_strip_color): any #rrggbb the person picks, drawn as a soft gradient of it
      if (/^#[0-9a-f]{6}$/i.test(o.bug_strip_color || '')) stage.style.setProperty('--sb-strip', 'linear-gradient(' + shade(o.bug_strip_color, 0.08) + ', ' + shade(o.bug_strip_color, -0.35) + ')');
      try { bug.draw(stage, g, { time, opts: o }); } catch (e) { stage.textContent = g.kind === 'board' ? g.event : g.away.abbr + ' ' + (g.away.score ?? '') + ' - ' + (g.home.score ?? '') + ' ' + g.home.abbr; }
      tvLook(stage, o.bug_tv && o.bug_tv !== 'auto' ? o.bug_tv : bug.tv);
      // vintage logos: bug_logo_look vintage softens the team logos a touch, as on an old broadcast; sharp (the default)
      // leaves them as they are, so no reviewed bug changes unless the person picks it
      if (o.bug_logo_look === 'vintage') stage.classList.add('sb-vintage-logos');
      holder.appendChild(stage);
      root.appendChild(holder);
      fillMarks(stage, host, g, o);   // in the page, so the slot's background can be read
      if (g.kind !== 'board') fitPips(stage, g, (sportsOf(cat.bugs, bug.id) || [])[0]);   // another sport's game: its own timeout count
      // measured size corrections: every text grows
      // or shrinks by bug.typeScale, every team logo by bug.logoScale (drawn bigger in place, so the layout does not move)
      if (bug.balanceLogos) stage.dataset.balance = '1';
      if (bug.monoLogos) stage.dataset.mono = String(bug.monoLogos);
      if (bug.sizedFor) { stage.style.fontSynthesis = 'none'; capMatch(stage, bug.sizedFor); }   // a matched face keeps the measured cap heights
      if (bug.typeScale && bug.typeScale !== 1) scaleText(stage, bug.typeScale);
      if (bug.logoScale && bug.logoScale !== 1) stage.querySelectorAll('img.sb-logo:not(.sb-league)').forEach((im) => { im.style.scale = String(bug.logoScale); });
      stage.querySelectorAll('.w').forEach((n) => { if (!n.dataset.fit) fit(n); });   // the start time never wraps or spills
      // and wherever else a bug put the start time or FINAL: the box that holds just that text is fitted too (squeezed to its room,
      // "TUE 12:05P" when even that is too tight); found by its text, so no bug needs to mark it
      if (g.status !== 'live') fitStatus(stage, statusText(g, time));
      fitAll(stage);
      fitScores(stage, g);
      legible(stage);
      // timeouts mean nothing before or after the game: their dashes go
      if (g.status !== 'live') stage.querySelectorAll('.sb-pips, [data-pips]').forEach((n) => { n.style.visibility = 'hidden'; });
      if (bug.nudge) nudgeAll(stage, bug.nudge, size.w);
      // before the game a bug with nowhere else for the records shows them in its empty score boxes (construction plan, section 4)
      if (g.status === 'pre' && g.kind !== 'board') preRecords(stage, g);   // after the nudges, so a record clears the names where they end up
      // a strip that hugs its contents (bug.hug: the selector of the row holding them): the stage is trimmed to the last item's right
      // edge plus the row's own end padding, so no empty bar runs on past them
      const hug = () => {
        const row = bug.hug && stage.querySelector(bug.hug); if (!row) return;
        row.style.whiteSpace = 'nowrap'; [...row.children].forEach((c) => { c.style.flexShrink = '0'; });   // trimming must not squeeze a text onto two lines
        const k = stage.getBoundingClientRect().width / stage.offsetWidth || 1, x0 = stage.getBoundingClientRect().left;
        let right = 0; [...row.children].forEach((c) => { right = Math.max(right, (c.getBoundingClientRect().right - x0) / k); });
        const w = Math.ceil(right + (parseFloat(getComputedStyle(row).paddingRight) || 0));
        if (!(w > 0 && w < size.w)) return;
        const sc = Math.min(W / w, (o.bug_height || size.h) / size.h), lf = align === 'right' ? W - w * sc : align === 'center' ? (W - w * sc) / 2 : 0;
        stage.style.width = w + 'px'; stage.style.left = Math.round(lf) + 'px'; stage.style.transform = 'scale(' + sc.toFixed(4) + ')';
        holder.style.height = Math.round(size.h * sc) + 'px';
      };
      hug();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitAll(stage); fitScores(stage, g); refitRecords(stage); hug(); }, () => {});
    });
    if (!games.length && o.empty_text) root.appendChild(el('div', 'sb-empty', o.empty_text));
  };
  host.refresh(render, entities, 60000);
}
