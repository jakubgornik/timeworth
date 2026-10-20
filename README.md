# Timeworth

pnpm workspace monorepo managed by Turborepo:

- `apps/api`: NestJS API (Render)
- `apps/web`: React/Vite frontend (Vercel)
- `apps/e2e`: Playwright tests
- `packages/db`: Prisma client and NestJS database module
- `packages/types`: shared types

## Local development

Use Node.js 22 or 24 with Corepack installed. The root `packageManager` field pins
pnpm to `10.34.7`.

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
# Fill in the Supabase credentials and database URLs in .env.
pnpm exec supabase start
pnpm build
pnpm dev
```

Use the workspace-pinned Supabase CLI (`pnpm exec supabase`) for local services.
Older CLI versions can start a Storage image that is incompatible with an already
migrated local database. After updating the CLI, run `pnpm exec supabase stop`
followed by `pnpm exec supabase start` to recreate the containers with the matching
images. The standard stop command retains local data volumes
([Supabase CLI documentation](https://supabase.com/docs/reference/cli/supabase-stop)).

Use one `.env` in the repository root for the API, Vite frontend, Prisma commands,
database seed, and Playwright. The `.env.example` file lists the available settings.
When upgrading an existing checkout, merge values from `apps/api/.env`,
`apps/web/.env`, `packages/db/.env`, and `apps/e2e/.env` into the root `.env`, then
remove those old files. Do not overwrite an existing root `.env` with the example.

Only variables prefixed with `VITE_` are exposed to the frontend; keep database
credentials, Supabase service keys, and JWT secrets without that prefix
([Vite environment documentation](https://vite.dev/guide/env-and-mode)).
The web build explicitly sets `NODE_ENV=production`, so the local API setting
`NODE_ENV=development` does not turn a production frontend build into a development
build. Restart development servers after editing `.env`.

Environment variables provided by the shell or hosting platform take precedence
over the file. Deployments can continue using their existing platform variables
without creating a `.env` file. Database client generation runs as part of the
shared database package's build; building does not run migrations.

```sh
pnpm build:api                       # API and its shared packages
pnpm build:web                       # frontend and its shared packages
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api test --runInBand    # unit tests, excluding integration tests
pnpm --filter e2e test                # requires configured services/test accounts
pnpm --filter @packages/db db:generate
pnpm --filter @packages/db with-env prisma validate # extra commands with root .env
pnpm --filter web add <dependency>
pnpm --filter api add -D <dependency>
```

Commit `pnpm-lock.yaml` when changing dependencies. CI/deployments should use
`pnpm install --frozen-lockfile --prod=false` so build tools are installed even
when `NODE_ENV=production`.

## Deployment migration

Existing deployments keep running, but the old `npm install` build command
cannot install the new `workspace:*` dependencies. Temporarily disable Render's
auto-deploys before pushing this migration to its deployment branch. Push the
changes, update the commands below, and deploy manually. Re-enable auto-deploys
after that deployment succeeds.

### Render API

Use the repository root as the service root directory (leave Root Directory
empty). Set **Build Command** to:

```sh
bash scripts/render-build.sh
```

Set **Start Command** to:

```sh
node apps/api/dist/main.js
```

The checked-in script enables pnpm through Corepack, installs dependencies, runs
`prisma migrate deploy`, and builds the database package, shared types, and API in
dependency order. It stops immediately if any step fails. This preserves the
migration step from the previous Render command. Keep the existing database and
API environment variables, including `DATABASE_URL` and `DIRECT_URL`.

The build script requires Corepack on Render's Node.js runtime. Use the existing
Node.js version if Corepack is available; installing Corepack is needed if the
runtime does not provide it. The start command invokes Node directly.

### Vercel frontend

- Root Directory: `apps/web`.
- Enable **Include source files outside of the Root Directory in the Build
  Step**, so pnpm/Turborepo can access the repository root and shared packages.
- Set `ENABLE_EXPERIMENTAL_COREPACK=1` for each deployment environment to enable
  the pinned package manager ([Vercel documentation](https://vercel.com/docs/builds/configure-a-build#corepack)).
- Install, build, and output settings are checked in at `apps/web/vercel.json`:
  `corepack pnpm install --frozen-lockfile --prod=false`,
  `corepack pnpm --dir ../.. build:web`, and `dist` respectively.

Deploy a Vercel preview first and clear the old dependency cache for the first
pnpm deployment if the host reuses an npm installation.

## Migration details

The pnpm lockfile was imported from `package-lock.json`. TypeScript in the API
and shared packages is pinned to the previously installed `5.8.3`, preventing
the import from selecting a newer version already used by transitive tools.
Shared packages declare their own dependencies, and internal dependencies use
`workspace:*` so they always resolve locally.

`pnpm-workspace.yaml` allows the install scripts required by Prisma, SWC, and
esbuild. Turborepo caches the generated Prisma client alongside build output.
Changes to the root `.env` file also invalidate the build cache. Turborepo passes
server settings to its child processes and includes injected `VITE_*` variables
in its build cache key.

To roll back, restore the npm manifests and lockfile together, then restore the
previous hosting build commands. Database migrations are separate from a
package-manager rollback.
