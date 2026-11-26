// The Scorebugs dashboard card (type: custom:scorebug-card). The Scorebugs integration adds this file to every dashboard by itself,
// so nobody has to add a resource by hand. The card itself is tiny: the bug code (kit.js and bugs/) loads only when a card is drawn.
//
//   type: custom:scorebug-card
//   entities: [sensor.my_team]          Team Tracker sensors (or Scorebugs' own, later)
//   bug: auto | network | <bug id>      auto = the league's default; network = the look of the network showing the game
//   bug_by_team: { "NFL:CHI": <bug id> | network }   when that team plays, its bug (before `bug`); the key can be the letters alone
//   Without bug (or bug: auto) the card uses the look Scorebugs' settings give each team (its Look entity), and every other bug_*
//   setting below falls back to Scorebugs > Configure > How bugs look on cards.
//   bug_logos: auto | primary | dark | secondary | white | secondary-white | black   (auto: each team's My teams choice)
//   bug_marks: both | league | ha | none     bug_tv: auto | clean | soft | vhs     max_games: 1-6
//   bug_logo_look: sharp | vintage   team logos softened a touch, as on an old broadcast (sharp by default)
//   bug_mark: ha | league | own | none (what goes in the network's spot)     bug_mark_style: auto | colour | dark | white
//   bug_dress: auto | regular | playoffs | conf-finals | finals   (auto: from the game's season and round)
//   bug_strip_color: #rrggbb   the colour of the strip under the bug, on bugs that have one (empty: the bug's own)
//   bug_lower: show | hide   the strip under a bug's main bar (records, the day, the round), on bugs that have one
//   bug_texture: auto | none | mesh | carbon | brushed | plays | graffiti   the pattern over a bug's panels, on bugs that use one
//   bug_ink: auto | light | dark   text colour for the parts of a bug that sit straight on the card (auto: what reads on the card)
//   demo_league: NCAAF | NCAAM | WNBA | CFL | EPL | CL | BUND | MLS | NWSL | WC | PGA | F1 | ATP | UFC | AFL | IPL | NCAAVB
//         with demo and no sensor: a sample game of that league (real teams or players, from demo-games.js)
//   demo: cycle | pre | live | final   a made-up game over the sensor's teams, to see how a bug looks before, during and after a game
//   demo_game: { ...a sensor's attributes }   with demo: the card plays this game instead of a sensor's (review dashboards)
//         (cycle: one minute per game, again and again). Labelled "Demo game" on the card.

const BASE = new URL('./', import.meta.url);
let kit = null;
const loadKit = () => (kit = kit || import(new URL('kit.js', BASE).href));
let demo = null;
const loadDemo = () => (demo = demo || import(new URL('demo.js', BASE).href));
let samples = null;
const loadSamples = () => (samples = samples || import(new URL('demo-games.js', BASE).href).then((m) => m.SAMPLES));
const DEMOS = ['cycle', 'pre', 'live', 'final', 'review'];
// demo: review: the card shows its bug three times, before, during and after one game, the game read from a
// file on the person's own Home Assistant (demo_source, default /local/scorebugs-review/games.json: { "<bug id>": { sensor attributes } })
let reviewGames = null;
const loadReview = (src) => (reviewGames = reviewGames || fetch(src, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : {})).catch(() => ({})));

class ScorebugCard extends HTMLElement {
  setConfig(config) {
    // a demo card can also play a sample game from a league nobody follows (demo_league: NCAAF, EPL, PGA, F1 ...): no sensor needed
    const sample = DEMOS.includes(config.demo) && /^[A-Z0-9]{2,8}$/.test(String(config.demo_league || '')) ? config.demo_league : null;
    // a review card can carry its own game (demo_game: the sensor's attributes), so each card shows the teams it was given
    const own = DEMOS.includes(config.demo) && config.demo_game && typeof config.demo_game === 'object';
    const review = config.demo === 'review';
    const list = review ? ['demo.review#pre', 'demo.review#live', 'demo.review#final'] : own ? ['demo.own'] : config.entities || (config.entity ? [config.entity] : sample ? ['demo.' + sample.toLowerCase()] : []);
    if (!Array.isArray(list) || !list.length) throw new Error('Pick at least one sports sensor (entities).');
    this._config = { ...config, entities: list };
    this._mounted = false;
    if (this._hass) this._start();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) { this._start(); return; }
    // redraw only when one of the card's own sensors changed
    const changed = (this._config.entities || []).some((id) => hass.states[id] !== this._seen.get(id));
    if (changed && this._render) this._draw();
  }

  connectedCallback() {
    this.style.display = 'block';   // a custom element is inline by default and then measures 0 wide
    if (!this._ro && typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => { const w = Math.round(this.clientWidth); if (w && w !== this._w) { this._w = w; this._draw(); } });
    }
    if (this._ro) this._ro.observe(this);
    // a card off screen does not redraw on its timer (a page of many cards froze the browser long enough for Home Assistant's connection
    // to drop); it draws again as it comes into view
    if (!this._io && typeof IntersectionObserver !== 'undefined') {
      this._io = new IntersectionObserver((es) => { const seen = es.some((e) => e.isIntersecting); if (seen && this._onScreen === false) this._draw(); this._onScreen = seen; });
    }
    if (this._io) this._io.observe(this);
    if (this._ms && !this._timer) this._timer = setInterval(() => this._tick(), this._ms);
  }

  disconnectedCallback() {
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    clearInterval(this._timer); this._timer = null;
  }

  getCardSize() { return 2 * Math.min((this._config && this._config.max_games) || 1, 3); }

  _start() {
    if (this._mounted || !this._config || !this._hass) return;
    this._mounted = true;
    this._seen = new Map();
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const root = this.shadowRoot;
    while (root.firstChild) root.removeChild(root.firstChild);
    const card = document.createElement('ha-card');
    card.style.cssText = 'padding:12px;background:var(--ha-card-background, var(--card-background-color));overflow:hidden';
    const box = document.createElement('div');
    card.appendChild(box);
    const mode = DEMOS.includes(this._config.demo) ? this._config.demo : null;
    if (mode) {
      const tag = document.createElement('div');
      tag.textContent = mode === 'review' ? 'Before, during and after the game' : 'Demo game' + (mode === 'cycle' ? ': before, live, final, one minute each round' : ': ' + mode);
      tag.style.cssText = 'font-size:12px;opacity:.6;margin-top:6px;text-align:center';
      card.appendChild(tag);
      // the review cards say which copy of the code drew them (kit BUILD), so an old copy in the browser shows
      if (mode === 'review') loadKit().then((k) => { if (k.BUILD) tag.textContent += '  ·  code ' + k.BUILD; }, () => {});
    }
    root.appendChild(card);
    const self = this;
    const host = {
      entities: this._config.entities,
      // a demo card plays a made-up game over the real sensor (demo.js); the real state is still what tells the card to redraw
      state: (id) => {
        const s = self._hass.states[id]; self._seen.set(id, s);
        if (!mode) return Promise.resolve(s);
        // a sample game (demo_league) when the card has no sensor of its own
        if (id.startsWith('demo.review#')) {
          const phase = id.split('#')[1];
          return Promise.all([loadDemo(), loadReview(self._config.demo_source || '/local/scorebugs-review/games.json')]).then(([d, all]) => {
            const a = all[self._config.bug]; return a ? d.demoState({ entity_id: id, state: 'PRE', attributes: a }, phase) : null;
          });
        }
        const base = s || (id === 'demo.own' ? { entity_id: id, state: 'PRE', attributes: self._config.demo_game } : id.startsWith('demo.') ? loadSamples().then((all) => { const a = all[id.slice(5).toUpperCase()]; return a ? { entity_id: id, state: 'PRE', attributes: a } : null; }) : null);
        return Promise.all([loadDemo(), base]).then(([d, st]) => d.demoState(st, mode));
      },
      refresh: (render, entities, ms) => {
        self._render = render; self._ms = mode === 'review' ? 15000 : mode === 'cycle' || mode === 'live' ? 1000 : ms;   // review cards hold still: a redraw every 15 s
        clearInterval(self._timer); self._timer = setInterval(() => self._tick(), self._ms); self._draw();
      },
      get width() { return Math.max(120, Math.floor(self._w || self.getBoundingClientRect().width || 400) - 24); },
      align: this._config.align || 'center',
      // the colour behind the bug, for bug_ink auto (the theme's card colour; a see-through card shows the page behind it)
      get background() {
        const c = getComputedStyle(card).backgroundColor;
        return /rgba\(.*,\s*0\)$|transparent/.test(c) ? getComputedStyle(document.body).backgroundColor : c;
      },
      icon: (name, px) => { const i = document.createElement('ha-icon'); i.setAttribute('icon', 'mdi:' + name); i.style.setProperty('--mdc-icon-size', px + 'px'); return i; },
      callWS: (msg) => self._hass.callWS(msg),
    };
    // Scorebugs' settings first (the overall look and the card defaults: Configure > Scorebug looks / How bugs look on cards), then the
    // card's own settings on top; without Scorebugs set up (a Team Tracker sensor alone) the card draws with its own settings only
    const settings = Promise.resolve().then(() => self._hass.callWS({ type: 'scorebugs/settings' })).catch(() => ({}));
    Promise.all([loadKit(), settings]).then(([k, set]) => k.mount(box, host, { ...((set && set.card) || {}), look_default: (set && set.look) || '',
      ...this._config, bug_gap: this._config.bug_gap ?? 8, empty_text: this._config.empty_text ?? 'No game coming up' }))
      .catch(() => { box.textContent = 'Scorebugs could not load its files. Restart Home Assistant after installing or updating Scorebugs.'; });
  }

  _draw() { if (this._render) this._render().catch(() => {}); }
  _tick() { if (this._onScreen !== false) this._draw(); }

  // a new card starts on your first Scorebugs team (else the first Team Tracker sensor), in the automatic look
  static getStubConfig(hass) {
    const all = Object.keys((hass && hass.states) || {}).filter((id) => id.startsWith('sensor.') && (hass.states[id].attributes || {}).team_abbr);
    const ours = all.filter((id) => id.startsWith('sensor.scorebugs_'));
    return { entities: (ours.length ? ours : all).slice(0, 1) };
  }

  // The card's editor (editor.js, loaded only when it opens): pick your team, then pick the look by seeing it. Everything else is
  // set once in Scorebugs > Configure, or in the card's code (YAML) for anyone who wants it.
  static async getConfigElement() {
    await import(new URL('editor.js', BASE).href);
    return document.createElement('scorebug-card-editor');
  }
}

if (!customElements.get('scorebug-card')) {
  customElements.define('scorebug-card', ScorebugCard);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: 'scorebug-card', name: 'Scorebug', description: 'Your games as TV-style scorebugs, current and retro.', preview: true });
}
