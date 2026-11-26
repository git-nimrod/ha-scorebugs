// Demo games for the Scorebug card (`demo: cycle | pre | live | final`): the card's real sensor gives the teams, colours and logos,
// and this plays a made-up game over them, written the way Scorebugs' own sensor writes a real one (state PRE / IN / POST, the clock
// text "8:42 - 3rd", quarter, possession, down and distance, timeouts, outs and bases ...). So a bug shows exactly what it would show
// during a real game. Nothing is fetched or stored; loaded only by a card that has `demo` set.
//
// cycle: one minute per game: 8 s before the game, 44 s live (the whole game, fast), 8 s final, then again.
// live: the live part only, over and over. pre / final: that moment, still.

const CYCLE = 60000, PRE = 8000, LIVE = 44000;

// a real opponent when the sensor has none (the off-season: NOT_FOUND): a rival from the same league, with its ESPN logo and colours
const T = (league, id, abbr, name, long, c1, c2, rec) => ({ opponent_id: id, opponent_abbr: abbr, opponent_name: name, opponent_long_name: long,
  opponent_colors: [c1, c2], opponent_record: rec, opponent_logo: 'https://a.espncdn.com/i/teamlogos/' + league + '/500/scoreboard/' + abbr.toLowerCase() + '.png' });
const RIVALS = {
  MLB: [T('mlb', '5', 'CLE', 'Guardians', 'Cleveland Guardians', '#002b5c', '#e31937', '88-74'), T('mlb', '24', 'STL', 'Cardinals', 'St. Louis Cardinals', '#be0a14', '#001541', '78-84')],
  NFL: [T('nfl', '9', 'GB', 'Packers', 'Green Bay Packers', '#204e32', '#ffb612', '6-4'), T('nfl', '3', 'CHI', 'Bears', 'Chicago Bears', '#0b1c3a', '#e64100', '5-5')],
  NHL: [T('nhl', '21', 'TOR', 'Maple Leafs', 'Toronto Maple Leafs', '#003e7e', '#ffffff', '8-13'), T('nhl', '7', 'CHI', 'Blackhawks', 'Chicago Blackhawks', '#cf0a2c', '#000000', '9-10')],
  NBA: [T('nba', '10', 'HOU', 'Rockets', 'Houston Rockets', '#ce0e2d', '#000000', '12-4'), T('nba', '6', 'DAL', 'Mavericks', 'Dallas Mavericks', '#0064b1', '#bbc4ca', '8-9')],
};
// the Cubs' rival is the Cardinals; everyone else gets the league's first rival that is not themselves
const PAIRS = { 'MLB:CHC': 'STL', 'NFL:CHI': 'GB', 'NHL:CHI': 'TOR' };
function rivalFor(a) {
  const league = String(a.league || '').toUpperCase(), list = RIVALS[league];
  const base = { team_homeaway: 'home', opponent_homeaway: 'away' };
  if (!list) return { ...base, opponent_id: '0', opponent_abbr: 'RIV', opponent_name: 'Rivals', opponent_long_name: 'The Rivals', opponent_colors: ['#4a4f57', '#c9ccd1'], opponent_logo: '' };
  const want = PAIRS[league + ':' + String(a.team_abbr || '').toUpperCase()];
  return { ...base, ...(list.find((r) => r.opponent_abbr === want) || list.find((r) => r.opponent_abbr !== String(a.team_abbr || '').toUpperCase()) || list[0]) };
}

const pad = (n) => String(n).padStart(2, '0');
const ord = (n) => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
const mmss = (sec) => Math.floor(sec / 60) + ':' + pad(Math.floor(sec % 60));

// scores rise along the game at fixed moments (fraction of the game, team, points), so a replay looks the same every time
const PLAYS = {
  football: [[0.08, 'o', 7], [0.2, 't', 3], [0.33, 't', 7], [0.45, 'o', 3], [0.58, 't', 7], [0.7, 'o', 7], [0.83, 't', 3], [0.95, 't', 3]],
  hockey: [[0.15, 't', 1], [0.42, 'o', 1], [0.6, 't', 1], [0.88, 't', 1]],
  soccer: [[0.27, 'o', 1], [0.55, 't', 1], [0.86, 't', 1]],
  baseball: [[0.12, 'o', 1], [0.3, 't', 2], [0.52, 't', 1], [0.66, 'o', 2], [0.9, 't', 1]],
};
const scoreAt = (sport, p, side) => {
  if (sport === 'basketball') return Math.round(p * (side === 't' ? 112 : 106) + (side === 't' ? 0 : 2) * Math.sin(p * 40));
  if (!PLAYS[sport]) return Math.round(p * (side === 't' ? 24 : 21));
  return PLAYS[sport].filter(([at, s]) => at <= p && s === side).reduce((n, [, , pts]) => n + pts, 0);
};

/** The live attributes for a game `p` of the way through (0..1). */
function liveAt(a, p) {
  const sport = String(a.sport || '').toLowerCase(), out = { team_score: scoreAt(sport, p, 't'), opponent_score: scoreAt(sport, p, 'o') };
  const home = a.team_homeaway === 'away' ? 'opponent' : 'team', away = home === 'team' ? 'opponent' : 'team';
  if (sport === 'football' || sport === 'basketball' || sport === 'hockey') {
    const halves = sport === 'basketball' && /^NCAAM|^NCAAB/.test(String(a.league || ''));
    const n = sport === 'hockey' ? 3 : halves ? 2 : 4, len = sport === 'football' ? 900 : halves ? 1200 : sport === 'basketball' ? 600 : 1200;
    const q = Math.min(n, 1 + Math.floor(p * n)), left = Math.max(0, Math.round(len * (1 - (p * n - (q - 1)))));
    out.quarter = q;
    out.clock = mmss(left) + ' - ' + ord(q);
    if (sport === 'football') {
      const drive = Math.floor(p * 16), down = 1 + (Math.floor(p * 64) % 4), with_ = drive % 2 ? away : home;
      out.possession = String(a[with_ + '_id'] || '');
      out.down_distance_text = ord(down) + ' & ' + [10, 6, 3, 1][down - 1] + ' at ' + String(a[with_ + '_abbr'] || '') + ' ' + (25 + (Math.floor(p * 64) % 4) * 8);
      out.team_timeouts = 3 - Math.floor((p * 2 % 1) * 3);
      out.opponent_timeouts = 3 - Math.floor((p * 2 % 1) * 2);
    }
    if (sport === 'hockey') { out.team_shots_on_target = Math.round(p * 31); out.opponent_shots_on_target = Math.round(p * 27); }
  } else if (sport === 'baseball') {
    const half = Math.min(17, Math.floor(p * 18)), inn = 1 + Math.floor(half / 2), top = half % 2 === 0, step = Math.floor(p * 18 * 6) % 6;
    out.quarter = inn;
    out.clock = (top ? 'Top ' : 'Bot ') + ord(inn);
    out.possession = String(a[(top ? away : home) + '_id'] || '');
    Object.assign(out, { outs: Math.min(2, Math.floor(step / 2)), balls: step % 4, strikes: step % 3, on_first: step % 2 === 1, on_second: step >= 3, on_third: step === 5 });
  } else if (sport === 'soccer') {
    const sec = Math.round(p * 90 * 60);
    out.clock = Math.floor(sec / 60) + "'";
    out.clock_seconds = sec;
    out.quarter = p < 0.5 ? 1 : 2;
    out.team_possession = Math.round(52 + 6 * Math.sin(p * 9));
    out.opponent_possession = 100 - out.team_possession;
  } else if (sport === 'tennis' || sport === 'volleyball') {
    // sets played one after another; the score is sets won; the set being played is the last entry
    const n = sport === 'tennis' ? 4 : 5, to = sport === 'tennis' ? 6 : 25, at = Math.min(n - 1, Math.floor(p * n)), part = p >= 1 ? 1 : p * n - at;
    const plan = sport === 'tennis' ? [[6, 4], [4, 6], [6, 3], [7, 5]] : [[25, 21], [22, 25], [25, 19], [23, 25], [15, 12]];
    const ts = [], os = [];
    for (let k = 0; k <= at; k++) {
      const [a, b] = plan[k];
      ts.push(k < at ? a : Math.round(a * part)); os.push(k < at ? b : Math.round(b * part));
    }
    out.team_sets = ts; out.opponent_sets = os;
    const done = p >= 1 ? at + 1 : at;   // at the end the last set counts too
    out.team_score = ts.slice(0, done).filter((v, k) => v > os[k]).length;
    out.opponent_score = done - out.team_score;
    out.quarter = at + 1;
    out.clock = sport === 'tennis' ? 'Set ' + (at + 1) : 'Set ' + (at + 1);
    if (to && sport === 'tennis') { out.team_tiebreaks = ts.map(() => null); out.opponent_tiebreaks = os.map(() => null); }
  } else if (sport === 'mma') {
    const r = Math.min(3, 1 + Math.floor(p * 3));
    out.quarter = r; out.team_score = null; out.opponent_score = null;
    out.fight_clock = mmss(Math.round(300 * (1 - (p * 3 - (r - 1)))));
    out.clock = out.fight_clock + ' - R' + r;
  } else if (sport === 'australian-football') {
    const q = Math.min(4, 1 + Math.floor(p * 4)), f = (side, k) => Math.round(p * (side === 't' ? 13 : 12)) - (k ? 0 : 0);
    const tg = f('t'), og = f('o'), tb = Math.round(p * 11), ob = Math.round(p * 13);
    Object.assign(out, { team_goals: tg, team_behinds: tb, opponent_goals: og, opponent_behinds: ob, team_score: tg * 6 + tb, opponent_score: og * 6 + ob, quarter: q,
      clock: mmss(Math.round(1200 * (1 - (p * 4 - (q - 1))))) + ' - ' + ord(q) });
    const split = (tot) => Array.from({ length: q }, (_, k) => (k < q - 1 ? Math.round(tot / q) : tot - Math.round(tot / q) * (q - 1)));
    out.team_quarters = split(out.team_score); out.opponent_quarters = split(out.opponent_score);
  } else if (sport === 'cricket') {
    // the opponent batted first (all out or 50 overs); the team is chasing
    const overs = Math.min(50, p * 50), runs = Math.round(p * 262), wk = Math.min(9, Math.floor(p * 8));
    const ov = Math.floor(overs) + '.' + Math.floor((overs % 1) * 6);
    Object.assign(out, { opponent_score: 278, opponent_wickets: 8, opponent_overs: 50, opponent_score_text: '278/8',
      team_score: runs, team_wickets: wk, team_overs: Number(ov), team_score_text: runs + '/' + wk + ' (' + ov + '/50 ov, target 279)',
      possession: String(a.team_id || ''), quarter: 2, clock: 'Live' });
  } else {
    out.quarter = 1 + Math.floor(p * 4);
    out.clock = mmss(Math.round(720 * (1 - (p * 4 % 1)))) + ' - ' + ord(out.quarter);
  }
  return out;
}

/** A golf or racing board `p` of the way through: the leaders trade places, the round or the laps go on. */
function boardAt(a, p) {
  const rows = Array.isArray(a.rows) ? a.rows.map((r) => ({ ...r })) : [];
  const swaps = a.sport === 'golf' ? 0 : Math.floor(p * 6);   // golf positions follow the scores, which the demo leaves alone
  for (let k = 0; k < swaps && rows.length > 2; k++) { const i = k % Math.min(4, rows.length - 1); [rows[i], rows[i + 1]] = [rows[i + 1], rows[i]]; }
  rows.forEach((r, i) => { r.pos = i + 1; });
  if (a.sport === 'golf') {
    rows.forEach((r) => { if (r.thru !== undefined || a.sport === 'golf') r.thru = String(Math.max(1, Math.round(p * 18))); });
    return { rows, round: a.round || 4, clock: 'Round ' + (a.round || 4) };
  }
  const laps = a.lap || 56;
  return { rows, lap: Math.max(1, Math.round(p * laps)), session: a.session || 'Race', clock: 'Lap ' + Math.max(1, Math.round(p * laps)) };
}

/** The sensor's state at one moment of a demo game: phase 'pre' | 'live' | 'final', and `p` (0..1) how far the live game has got. */
export function demoAt(s, phase, p = 0.5, now = Date.now()) {
  if (!s || !s.attributes) return s;
  const board = s.attributes.kind === 'board';
  const a = { ...s.attributes, ...(board || s.attributes.opponent_abbr ? {} : rivalFor(s.attributes)) };
  let state, extra;
  if (phase === 'pre') {
    state = 'PRE';
    extra = board ? { date: new Date(now + 2 * 3600e3).toISOString(), clock: '' }
      : { date: new Date(now + 2 * 3600e3).toISOString(), team_score: null, opponent_score: null, clock: '', quarter: null, possession: null,
        team_sets: [], opponent_sets: [], team_quarters: null, opponent_quarters: null, team_score_text: '', opponent_score_text: '', fight_clock: '' };
  } else if (phase === 'live') {
    state = 'IN';
    // a game being played (or just played) started a little while ago, whatever date the sensor had (a card hides old finished games)
    a.date = new Date(now - 90 * 60e3).toISOString();
    extra = board ? boardAt(a, p) : liveAt(a, p);
  } else {
    state = 'POST';
    a.date = new Date(now - 3 * 3600e3).toISOString();
    extra = board ? { ...boardAt(a, 1), clock: 'Final' } : { ...liveAt(a, 1), clock: 'Final', possession: null, down_distance_text: '' };
    if (!board) {
      if (String(a.sport) === 'mma') { extra.team_winner = true; extra.opponent_winner = false; }
      else { extra.team_winner = extra.team_score > extra.opponent_score; extra.opponent_winner = extra.opponent_score > extra.team_score; }
    }
  }
  return { ...s, state, attributes: { ...a, ...extra } };
}

/** The sensor's state as it would be at this moment of a demo game. `s` is the real state object; it is never changed. */
export function demoState(s, mode, now = Date.now()) {
  const t = mode === 'live' ? PRE + (now % LIVE) : mode === 'pre' ? 0 : mode === 'final' ? CYCLE - 1 : now % CYCLE;
  return demoAt(s, t < PRE ? 'pre' : t < PRE + LIVE ? 'live' : 'final', (t - PRE) / LIVE, now);
}

/** How often a demo card redraws (ms): every second while it can change. */
export const DEMO_TICK = 1000;
