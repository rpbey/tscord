<p align="center">
    <img height="450" src="https://github.com/barthofu/tscord/assets/66025667/7cf87e0f-37e9-46ce-b244-dda6c45941c9"></img>
</p>

<div align="center">

# tscord — Bun-first fork

Fork de [`barthofu/tscord`](https://github.com/barthofu/tscord) modernisé pour le runtime [Bun](https://bun.sh).

Maintenu sur [`rpbey/tscord`](https://github.com/rpbey/tscord).

[![Bun](https://img.shields.io/badge/runtime-Bun%201.3+-black?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![discord.js](https://img.shields.io/badge/discord.js-14.26-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.js.org/)
[![oxlint](https://img.shields.io/badge/lint-oxlint-orange?style=flat)](https://oxc.rs/)

</div>

## Pourquoi ce fork

Le template original `barthofu/tscord` cible Node.js. Ce fork :

- **Runtime Bun-only** (pas de Node, pas de `ts-node`, pas de `tsc` à l'exécution — Bun exécute le TypeScript natif)
- **`@rpbey/discordy`** au lieu de `discordx` (fork Bun-first du framework de décorateurs)
- **mikro-orm 6.6+** avec CVE critical SQL Injection résolue (GHSA-gwhv-j974-6fxm)
- **Lint oxlint** (50–100× plus rapide qu'ESLint, type-aware via `oxlint-tsgolint`)
- **Docker `oven/bun:1.3-alpine`** (image runtime ~50 Mo, no Node binary)
- **0 erreur TS, 0 erreur/warning lint** sur l'arbre source

## Stack

| Couche | Outil |
|---|---|
| Runtime | Bun 1.3+ |
| Framework Discord | `@rpbey/discordx` (workspace) |
| Lib Discord | `discord.js` 14.26 |
| ORM | `@mikro-orm/core` 6.6 + sqlite/postgresql/mysql/mariadb |
| API REST | TSed 7.87 + Express 4.22 |
| WebSocket | `socket.io` 4.8 |
| i18n | `typesafe-i18n` |
| DI | `tsyringe` 4.10 |
| Lint | `oxlint` 1.61 + `oxlint-tsgolint` (type-aware) |

## Démarrage rapide

```bash
git clone https://github.com/rpbey/tscord.git my-bot
cd my-bot
bun install
cp .env.example .env  # éditer BOT_TOKEN
bun run dev           # bun --watch src/main.ts
```

## Scripts

| Script | Description |
|---|---|
| `bun run dev` | Watch mode dev (`bun --watch src/main.ts`) |
| `bun run start` | Production (`bun build/main.js`) |
| `bun run build` | Compilation TS → `build/` |
| `bun run lint` | oxlint sans type-aware (~400 ms) |
| `bun run lint:strict` | oxlint avec type-aware (~700 ms, full coverage) |
| `bun run lint:fix` | autofix safe |
| `bun run type:check` | `tsc --noEmit` |
| `bun run migration:up` | mikro-orm migrations (via `bunx`) |

Toutes les commandes mikro-orm passent par `bunx mikro-orm` (Bun runs TS natively, plus besoin de `--loader ts-node/esm`).

## Tsconfig

- `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`
- `moduleDetection: force` — chaque fichier ESM
- `types: ["bun"]` — Bun globals dans la stdlib
- Path aliases avec `./` prefix (compat tsgolint)

## Lint

`.oxlintrc.json` configure 7 plugins :
- `eslint`, `typescript`, `import`, `oxc`, `promise`, `unicorn`, `node`
- Categories : `correctness=error`, `suspicious=warn`, `perf=warn`
- Rules killer : `typescript/no-floating-promises`, `no-misused-promises`, `await-thenable`
- Overrides : controllers/middlewares (TSed pattern), commands/events (`checksVoidReturn: false` pour discordx)

Lancer `bun run lint:strict` pour le type-aware mode (via `oxlint-tsgolint`, port Go du compilateur TS).

## Docker

```bash
docker build -t my-bot -f .docker/app/Dockerfile .
docker run --env-file .env my-bot
```

Image multi-stage `oven/bun:1.3-alpine` :
1. **dependencies** : `bun install --frozen-lockfile` + native builds (canvas/sharp)
2. **builder** : `bun run install:plugins && bun run build`
3. **prepare** : `bun install --production --frozen-lockfile`
4. **runner** : `CMD ["bun", "run", "start"]`

## Différences vs upstream barthofu/tscord

| Sujet | barthofu/tscord | rpbey/tscord |
|---|---|---|
| Runtime | Node 22 + ts-node | Bun 1.3+ |
| Decorators framework | `discordx` 11.12 | `@rpbey/discordx` (workspace) |
| Pkg manager | npm | bun |
| Linter | eslint | oxlint (50-100× faster) |
| Lockfile | package-lock.json | bun.lock |
| `dotenv` | requis | retiré (Bun load `.env` natif) |
| `__dirname` | CJS-isme | `import.meta.dirname` |
| mikro-orm | 6.4 (vulnérable) | 6.6.13 (CVE patched) |
| `cross-env` | requis | retiré (`NODE_ENV=x bun ...`) |
| `nodemon` | requis | retiré (`bun --watch`) |

## Migration depuis upstream

Si tu as un projet basé sur `barthofu/tscord` et veux passer à ce fork :

1. **Imports** : `discordx` → `@rpbey/discordx`, `@discordx/*` → `@rpbey/*`
2. **API breaking** :
   - `client.parseCommand(prefix, message, false)` → `client.parseCommand(message, false)`
   - `PaginationType.Button` → option `selectMenu: { disabled: true }`
3. **Scripts** : voir `package.json` pour les nouvelles formes Bun-natives
4. **Lockfile** : `rm package-lock.json && bun install`

## Crédits

- Template original : [@barthofu](https://github.com/barthofu) — [tscord](https://github.com/barthofu/tscord)
- Fork Bun-first : [@aphrody-code](https://github.com/aphrody-code) — [rpbey/tscord](https://github.com/rpbey/tscord)
- `@rpbey/discordy` : fork Bun-first de [discordx-ts/discordx](https://github.com/discordx-ts/discordx) — [rpbey/discordy](https://github.com/rpbey/discordy)

## Documentation upstream

La documentation originale reste pertinente pour la majorité des concepts (architecture, plugins, i18n, schedule, store) :
**[tscord.bartho.dev](https://tscord.bartho.dev/)**

Adapte les commandes `npx`/`npm` en `bunx`/`bun` lors de la lecture.

## Licence

MIT — voir [LICENSE](./LICENSE).
