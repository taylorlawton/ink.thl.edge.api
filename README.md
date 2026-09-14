# thl.ink Edge API

An edge-hosted API for [thl.ink](https://thl.ink/) (offline for now), built to run on [Bunny.net Edge Scripting](https://bunny.net/edge-scripting/) via the `@bunny.net/edgescript-sdk`.

It will serve the configuration and data via a [Bunny Database](https://bunny.net/database/) (libSQL/Turso) through Drizzle ORM.

Built for fun.

## Features

Still in-progress but it will have

- A custom HTTP router built on top of the Bunny Edge Scripting `net.http` server.
- Dependency injection via [`fast-injection`](https://fast-injection.21no.de/), configured through a `ApplicationBuilder`.
- Data access using [`drizzle-orm`](https://orm.drizzle.team/).
- Simple in-memory response cache using TTL-based expiration.

## Uses

- [Bun](https://bun.com) v1.3+.
- A turso dialect SQLite database.

## Environment variables

| Variable                              | Description                                                                                                 |
|:------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `DEPLOY_ENV`                          | Logical environment key used to look up config from the `environment` table (e.g. `production`, `staging`). |
| `BUNNY_DATABASE_URL`                  | Connection URL for the Bunny/libSQL database.                                                               |
| `BUNNY_DATABASE_AUTH_TOKEN`           | Read/write auth token for the database.                                                                     |
| `BUNNY_DATABASE_READ_ONLY_AUTH_TOKEN` | Read-only auth token.                                                                                       |
| `BUNNY_EDGE_PORT`                     | Optional port to bind the server to.                                                                        |
| `BUNNY_EDGE_HOSTNAME`                 | Optional hostname/IPv4 address to bind the server to.                                                       |

## Getting started

Install dependencies:

```bash
bun install
```

Run the API locally:

```bash
bun run src/main.ts
```

Build for deployment (bundles `src/main.ts` into `dist/`):

```bash
bun run build.ts
```

## Database

The schema [`src/db/schema.ts`](src/db/schema.ts) and relations [`src/db/relations.ts`](src/db/relations.ts) are managed with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) and configured with [`drizzle.config.ts`](drizzle.config.ts). Migrations are generated and are stored under [`db/migrations/`](db/migrations).

Seed data lives in `data/data.ts` and can be applied with:

```bash
bun run data/seed.ts
```

## Structure

```text
.
├── build.ts               # Bun build script
├── drizzle.config.ts      # Drizzle Kit configuration
├── data/                  # Static seed data and seed script
├── db/migrations/         # Generated SQL migrations
└── src/
    ├── main.ts            # Application entry point and route registration
    ├── core/              # Application builder, router, cache, and logger
    ├── db/                # Database client, schema, relations
    ├── interfaces/        # Shared TypeScript interfaces
    └── services/          # Data access services
```
