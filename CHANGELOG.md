# CHANGELOG — rpbey/tscord

## v3.0.0 — 2026-04-25 (Bun-first fork)

Migration complète Node.js → Bun + adoption `@rpbey/discordy`.

### Breaking changes

- **Runtime cible** : Bun 1.3+ (Node n'est plus supporté)
- **Imports** :
  - `discordx` → `@rpbey/discordx`
  - `@discordx/importer` → `@rpbey/importer`
  - `@discordx/pagination` → `@rpbey/pagination`
  - `@discordx/utilities` → `@rpbey/utilities`
- **API @rpbey/pagination** : `PaginationType.Button` n'existe plus, utiliser `{ selectMenu: { disabled: true } }`
- **API @rpbey/discordx** : `client.parseCommand(message, false)` à 2 arguments (le `prefix` est configuré au niveau Client)
- **`engines.bun >= 1.3`** au lieu de `engines.node >= 22`
- **`mikro-orm.useTsNode: false`** (Bun runs TS natively)

### Sécurité

- **CVE critical** [GHSA-gwhv-j974-6fxm](https://github.com/advisories/GHSA-gwhv-j974-6fxm) résolue : SQL Injection dans mikro-orm < 6.6.10
- **8 CVE high** transitifs `tar` < 7.5.7 résolus via bump mikro-orm
- **3 CVE moderate** `request`/`qs`/`ajv` résolus via bump `image-hash` 5.3 → 7.0
- `.credentials.json` (Discord token Discord 2021) **scrubbé de l'histoire** via `git filter-repo`

### Bumps majeurs

- `@mikro-orm/*` 6.4 → **6.6.13**
- `discord.js` 14.16 → **14.26.3**
- `tsyringe` 4.8 → **4.10**
- `@tsed/*` 7.84 → **7.87.9**
- `image-hash` 5.3 → **7.0.1**
- `axios` 1.7 → **1.15**
- `bullmq`, `socket.io`, `puppeteer`, `sharp` → latest patches

### Drop deps Node-only

- `cross-env` (utiliser `NODE_ENV=x bun ...`)
- `dotenv` (Bun load `.env` natif)
- `nodemon` (utiliser `bun --watch`)
- `ts-node` (Bun runs TS natively)
- `npm-run-all` (utiliser `bun run`)
- `rimraf` (utiliser `rm -rf`)
- `fs ~0.0.1-security` (package squat factice)
- `@types/ioredis` (typé natif depuis ioredis 5)

### Modernisation Bun-natif

- `__dirname` → `import.meta.dirname`
- `delete require.cache[...]` → cache-busting ESM via `?t=${Date.now()}`
- `process.env` → `Bun.env` (mikro-orm.config.ts)
- `dotenv/config` import retiré

### Toolchain

- **Linter** : eslint → **oxlint 1.61** (50–100× faster) + `oxlint-tsgolint` pour type-aware
- **`.oxlintrc.json`** : 7 plugins (eslint, typescript, import, oxc, promise, unicorn, node), categories correctness=error
- **`bunfig.toml`** : config Bun centralisée (install/run/test/debug)
- **`.dockerignore`** : empêche les fichiers sensibles dans l'image
- **CI workflow** : `oven-sh/setup-bun@v2`, type-check + lint + build, actions/checkout v4

### Tsconfig

- `target: ES2021` → **`ES2022`**
- `module: CommonJS` → **`ESNext`**
- `moduleResolution: node` → **`Bundler`**
- Ajout `moduleDetection: force` (chaque fichier ESM)
- Ajout `types: ["bun"]`
- Ajout `skipLibCheck: true`
- Suppression bloc `ts-node`
- Path aliases avec `./` prefix (compat tsgolint type-aware)

### Docker

- `oven/bun:20-alpine` → **`oven/bun:1.3-alpine`**
- `npm prune` → `bun install --production --frozen-lockfile`
- `CMD ["npm", "run", "start"]` → `CMD ["bun", "run", "start"]`
- `COPY package-lock.json` → `COPY bun.lock`

### Code quality

- **0 erreurs TS** (`bunx tsc --noEmit`)
- **0 erreurs oxlint, 0 warnings** (`bun run lint`)
- 91 imports auto-fixés en `import type`
- 24 ambient `import('...')` isolés dans `.d.ts` (pattern volontaire)
- 4 `no-shadow` corrigés
- 1 `no-nesting` promise refactor (logGuild → async/await)

---

## Commits clés

- `09db5a3` — Squash merge PR #1 sur main
- `d4bf16e` — fix(lint): zéro warning, zéro erreur
- `2798370` — chore(pkg): description Bun-first fork
- `740ec69` — feat: modernisation Bun-first (tsconfig, bunfig, dockerignore)
- `851349c` — chore(lint): oxlint + type-aware via tsgolint
- `ec32f27` — chore: finitions migration Bun + bumps sécurité
- `de61d73` — Squash baseline post `git filter-repo` (.credentials.json scrubbé)

---

## Historique upstream

Pour les versions précédentes (v2.5 et antérieures), voir le [CHANGELOG.md de barthofu/tscord](https://github.com/barthofu/tscord/blob/main/CHANGELOG.md).
