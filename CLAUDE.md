# Project: CoM2 Damage Calculator

## Key Files
- `Manuals/MoM source - Fandom site/` — Primary source for MoM game mechanics. Use these wiki-sourced .md files to determine how combat abilities, damage types, and immunities work.
- `Manuals/CoM spells.md` — Primary source for CoM spell descriptions and mechanics.
- `Manuals/CoM2 spells.md` — Primary source for CoM2 spell descriptions and mechanics.
- `Manuals/CoM2 spells helptext.txt` — Primary source for CoM2 spell and ability descriptions, taken directly from the game UI. Use this to determine exact CoM2 behavior for any spell or ability.
- `Reference docs/MoM Combat Mechanics Reference.md` — Condensed combat mechanics reference summarizing the above.
- `Reference docs/Damage calculation version differences.md` — Documents how damage calculation differs between MoM 1.31, MoM 1.60, and CoM2.

## ABILITY_DEFS Ordering
The `ABILITY_DEFS` array in `data.js` controls the order abilities appear in the per-unit enchantments panel. The panel uses a 2-column CSS grid (`grid-template-columns: 1fr 1fr`, row-first flow), so odd-indexed entries go left and even-indexed go right.

Within each subgroup, order entries in column-major ordering so columns read top-to-bottom by realm in this sequence: **life → death → chaos → nature → sorcery**. Select inputs (like Prayer, Chaos Channels) sit at the top of the subgroup. Checkboxes fill the remaining slots interleaved L/R. When adding or removing an entry, recount columns and reorder neighbours to preserve the realm grouping in both columns.

## Rules
- When implementing a new mechanic, read the relevant .md files in `Manuals/MoM source - Fandom site/` first to understand the base MoM rules. For CoM/CoM2-specific behavior, check `Manuals/CoM spells.md`, `Manuals/CoM2 spells.md`, `Manuals/CoM2 spells helptext.txt`, and `Reference docs/Damage calculation version differences.md`.
- Use exact probability distributions (binomial math), not Monte Carlo simulation.

## Test Case Conventions
Test cases live in `PRESETS` in `data.js` and must also be wired into `TEST_TREE` so they appear in the UI — a preset that isn't in `TEST_TREE` is invisible to users.

Ability-named subgroups in `TEST_TREE` (e.g. "Haste", "Wall of Fire", "Immolation") must be kept in **alphabetical order** within their parent group.

`TEST_TREE` has two relevant groups:
- **"Artificial MoM 1.31 tests"** — all keys here must use `version: 'mom_1.31'` (either via the group default or an explicit field on the preset). No other versions belong in this group.
- **"Version differences tests"** — for mechanics that behave differently across versions. Each version-specific subgroup must contain **pairs** of directly corresponding test cases where **the only difference between entries is the version** — same unit stats, same ability, same scenario. A lone test with no counterpart does not belong here. This makes the behavioral delta immediately legible.

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
- **Running tests**: Call `runTests()` in `browser_evaluate` — returns `{ allPassed, total, failures[] }` (not an array). Example: `const r = runTests(); r.failures.map(f => f.key + ': ' + f.message)`.
- **Always call `browser_close`** after finishing a Playwright session. The MCP uses a single shared Chrome instance — leaving a tab open causes "Browser is already in use" on the next run.
