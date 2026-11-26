// The Scorebug card's editor: pick your team, then pick the look by seeing it. Nothing else.
// Team one dropdown of the teams Home Assistant has (Scorebugs' own sensors first, then Team Tracker's)
// Look every look for that team's sport, each drawn with the team itself mid-game; "Automatic" follows Scorebugs' look settings
// (and its Look entities, for automations). Click one, or use the arrow keys; Home Assistant's preview beside the editor
// shows the real game in it. Network buttons narrow the list.
// Each little preview is drawn only when it scrolls into view, so opening the editor stays quick.

const BASE = new URL('./', import.meta.url);
let kitP = null, demoP = null, catP = null;
const kit = () => (kitP = kitP || import(new URL('kit.js', BASE).href));
const demo = () => (demoP = demoP || import(new URL('demo.js', BASE).href));
const catalogue = () => (catP = catP || fetch(new URL('catalogue.json', BASE).href).then((r) => r.json()).then((j) => j.bugs || []).catch(() => []));

const NET = { fox: 'FOX', apple: 'Apple TV', 'apple tv': 'Apple TV', 'apple tv+': 'Apple TV', netflix: 'Netflix', prime: 'Prime Video', 'prime video': 'Prime Video',
  sn: 'Sportsnet', sportsnet: 'Sportsnet', 'yes network': 'YES', 'fox footy': 'FOX Footy', seven: 'Seven', 7: 'Seven' };
const networkOf = (b) => { const n = String((b.networks || [''])[0] || '').trim(); return n ? NET[n.toLowerCase()] || n : 'Other'; };
const yearOf = (b) => { const m = /(\d{4})/.exec(b.era || ''); return m ? +m[1] : 9999; };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const AUTO = '';

class ScorebugCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._ui = document.createElement('div'); this.shadowRoot.appendChild(this._ui); this._net = 'All'; Promise.all([catalogue(), kit()]).then(([b, k]) => { this._bugs = b; this._looksFor = k.looksFor; this._draw(); }); }

  setConfig(config) {
    const same = this._config && JSON.stringify(config) === JSON.stringify(this._config);
    this._config = { ...config };
    if (!same) this._draw();
  }
  set hass(h) { const first = !this._hass; this._hass = h; if (first) this._draw(); }

  _emit(patch) {
    const c = { ...this._config, ...patch };
    Object.keys(patch).forEach((k) => { if (patch[k] === undefined) delete c[k]; });
    this._config = c;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
  }

  _teams() {
    const st = (this._hass && this._hass.states) || {};
    return Object.keys(st).filter((id) => id.startsWith('sensor.') && (st[id].attributes || {}).team_abbr)
      .sort((a, b) => (b.startsWith('sensor.scorebugs_') - a.startsWith('sensor.scorebugs_')) || a.localeCompare(b))
      .map((id) => { const a = st[id].attributes; return { id, name: a.team_long_name || a.team_name || a.team_abbr, league: a.league || '', sport: String(a.sport || '').toLowerCase() }; });
  }

  _draw() {
    if (!this._config || !this._hass || !this._bugs) return;
    // only the editor's own part is redrawn: the styles the little previews add to the shadow root stay
    const root = this._ui, c = this._config, teams = this._teams();
    const ents = c.entities || (c.entity ? [c.entity] : []);
    const team = teams.find((t) => t.id === ents[0]) || null;
    const pick = c.bug && c.bug !== 'auto' ? c.bug : AUTO;
    const looks = team ? this._looksFor(this._bugs, team.sport)
      .sort((a, b) => networkOf(a).localeCompare(networkOf(b)) || yearOf(a) - yearOf(b) || String(a.label).localeCompare(String(b.label))) : [];
    const nets = ['All', ...new Set(looks.map(networkOf))];
    if (!nets.includes(this._net)) this._net = 'All';
    const shown = looks.filter((b) => this._net === 'All' || networkOf(b) === this._net);
    this._order = [AUTO, ...shown.map((b) => b.id)];
    root.innerHTML = '<style>'
      + ':host{display:block}label.t{display:grid;gap:4px;font-size:13px;opacity:.85;margin-bottom:14px}'
      + 'select{font:inherit;font-size:15px;padding:10px;border-radius:6px;border:1px solid var(--divider-color,#888);background:var(--card-background-color,#fff);color:var(--primary-text-color)}'
      + '.h{font-size:15px;font-weight:500;margin:4px 0 8px}.more{font-size:12px;opacity:.7;margin:-8px 0 12px}'
      + '.nets{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.nets button{font:inherit;font-size:12px;padding:4px 10px;border-radius:14px;border:1px solid var(--divider-color,#888);background:none;color:var(--primary-text-color);cursor:pointer}'
      + '.nets button[aria-pressed="true"]{background:var(--primary-color,#03a9f4);border-color:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff)}'
      + '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;outline:none;max-height:460px;overflow:auto;padding:2px}'
      + '.tile{display:grid;gap:4px;padding:6px;border-radius:8px;border:2px solid transparent;background:rgba(127,127,127,.12);cursor:pointer;text-align:left;font:inherit;color:inherit}'
      + '.tile[aria-selected="true"]{border-color:var(--primary-color,#03a9f4)}.tile .pv{height:72px;display:flex;align-items:center;overflow:hidden}'
      + '.tile .nm{font-size:12px;line-height:1.2}.tile .sub{font-size:11px;opacity:.6}.auto .pv{justify-content:center;font-size:12px;opacity:.75;text-align:center}'
      + '.hint{font-size:12px;opacity:.65;margin-top:8px}'
      + '</style>'
      + '<label class="t">Team<select id="team">' + (team ? '' : '<option value="" selected>Pick your team</option>')
      + teams.map((t) => '<option value="' + esc(t.id) + '"' + (team && t.id === team.id ? ' selected' : '') + '>' + esc(t.name + (t.league ? ' (' + t.league + ')' : '')) + '</option>').join('') + '</select></label>'
      + (ents.length > 1 ? '<p class="more">This card also shows ' + (ents.length - 1) + ' more team' + (ents.length > 2 ? 's' : '') + ', in the same look.</p>' : '')
      + (team ? '<div class="h">Look</div><div class="nets">' + nets.map((n) => '<button type="button" data-net="' + esc(n) + '" aria-pressed="' + (n === this._net) + '">' + esc(n) + '</button>').join('') + '</div>'
        + '<div class="grid" id="grid" tabindex="0" role="listbox" aria-label="Look">'
        + '<button type="button" class="tile auto" role="option" data-id="" aria-selected="' + (pick === AUTO) + '"><span class="pv">Automatic</span><span class="nm">Automatic</span><span class="sub">League default, or your Scorebugs look settings</span></button>'
        + shown.map((b) => '<button type="button" class="tile" role="option" data-id="' + esc(b.id) + '" aria-selected="' + (b.id === pick) + '"><span class="pv"></span><span class="nm">' + esc(b.label) + '</span><span class="sub">' + esc(networkOf(b) + (b.era ? ' · ' + b.era : '')) + '</span></button>').join('')
        + '</div><p class="hint">Click a look, or use the arrow keys. The preview shows your real game in it.</p>' : '');
    root.querySelector('#team').addEventListener('change', (e) => { if (e.target.value) { this._emit({ entities: [e.target.value, ...ents.slice(1).filter((x) => x !== e.target.value)], entity: undefined }); this._draw(); } });
    root.querySelectorAll('[data-net]').forEach((b) => b.addEventListener('click', () => { this._net = b.dataset.net; this._draw(); }));
    const grid = root.querySelector('#grid');
    if (!grid) return;
    grid.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) this._choose(t.dataset.id, true); });
    grid.addEventListener('keydown', (e) => {
      const cols = Math.max(1, Math.round(grid.clientWidth / (grid.querySelector('.tile') || { offsetWidth: 180 }).offsetWidth));
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
      if (!step) return;
      e.preventDefault();
      const i = Math.max(0, this._order.indexOf(pick));
      const next = this._order[Math.min(this._order.length - 1, Math.max(0, i + step))];
      this._choose(next, false);
    });
    if (this._refocus) { grid.focus(); this._refocus = false; }
    const sel = grid.querySelector('[aria-selected="true"]');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
    this._previews(grid, team);
  }

  _choose(id, byClick) {
    this._emit({ bug: id === AUTO ? undefined : id });
    this._refocus = !byClick;
    this._draw();
    if (byClick) { const g = this._ui.querySelector('#grid'); if (g) g.focus(); }
  }

  // each look drawn with the team mid-game (demo.js: the team's real colours and logos, a made-up live moment), once it is in view
  _previews(grid, team) {
    if (this._io) this._io.disconnect();
    const st = this._hass.states[team.id];
    this._io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      this._io.unobserve(e.target);
      const id = e.target.dataset.id, box = e.target.querySelector('.pv');
      Promise.all([kit(), demo()]).then(([k, d]) => {
        const s = d.demoAt(st, 'live', 0.55);
        return k.mount(box, { entities: [team.id], state: () => Promise.resolve(s), refresh: (render) => render(), width: box.clientWidth || 160, align: 'center' },
          { bug: id, max_games: 1, bug_gap: 0, bug_height: 68 });
      }).catch(() => {});
    }), { root: grid, rootMargin: '120px' });
    grid.querySelectorAll('.tile:not(.auto)').forEach((t) => this._io.observe(t));
  }
}

if (!customElements.get('scorebug-card-editor')) customElements.define('scorebug-card-editor', ScorebugCardEditor);
