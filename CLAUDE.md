# Project: CoM2 Damage Calculator

## Key Files
- `Manuals/MoM source - Fandom site/` — Primary source for MoM game mechanics. Use these wiki-sourced .md files to determine how combat abilities, damage types, and immunities work.
- `MoM Combat Mechanics Reference.md` — Condensed combat mechanics reference summarizing the above.
- `README.md` — Project overview and phased implementation plan.

## Rules
- When implementing a new mechanic, read the relevant .md files in `Manuals/MoM source - Fandom site/` first to understand the exact rules.
- Use exact probability distributions (binomial math), not Monte Carlo simulation.
- MoM uses 10% increments for To Hit / To Block. CoM2 uses 1% increments (Phase 4).

## Testing with Playwright
- Use `nocache_server.py` instead of `python -m http.server` — it sets `Cache-Control: no-store` headers to prevent browser caching. **Port is 8080** (`http://localhost:8080`):
  ```
  python nocache_server.py &
  sleep 1 && curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/
  ```
- **Start this server before the first Playwright navigation** so the browser never caches stale files. If the Playwright browser has already cached old JS, a page reload won't help — the disk cache persists across tab closes and navigations.
- If already stuck with stale cache, force-reload all scripts via indirect eval:
  ```js
  const scripts = ['engine.js', 'combat.js', 'data.js', 'units.js', 'ui.js'];
  scripts.reduce((chain, s) =>
    chain.then(() => fetch('/' + s, {cache: 'no-store'}).then(r => r.text()).then(c => (0,eval)(c))),
    Promise.resolve()
  )
  ```
- **Reading results**: Use `browser_evaluate` instead of snapshots to read computed values. Key DOM IDs:
  - `distA` / `distB` — result panels (attacker/defender). Header text in child `.dist-header`.
  - `aFigs`, `aAtk`, `aRtb`, `aRtbType`, `aDef`, `aRes`, `aHP`, `aDmg`, `aLevel`, `aWeapon` — attacker stat inputs (prefix `b` for defender).
  - `aAbil_<key>` / `bAbil_<key>` — ability checkboxes/inputs, where `<key>` matches `ABILITY_DEFS[].key` in `data.js` (e.g. `aAbil_doom`, `bAbil_firstStrike`).
  - `rangedCheck` — checkbox toggling ranged vs melee mode. `rangedDist` — distance spinbutton.
  - `gameVersion`, `cityWalls`, `nodeAura`, `enchLightDark` — global setting dropdowns.
  - After changing values programmatically, dispatch `new Event('input')` or `new Event('change')` on the changed element to trigger recalculation.
