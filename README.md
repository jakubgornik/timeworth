# Timeworth — Work Time Management Platform

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?logo=react)](#)
[![API](https://img.shields.io/badge/API-Node.js%20%2F%20NestJS-339933?logo=node.js)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](#)
[![Platform](https://img.shields.io/badge/Platform-Supabase-3ECF8E?logo=supabase&logoColor=white)](#)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](#)
[![Storage](https://img.shields.io/badge/Storage-AWS%20S3-FF9900?logo=amazonaws&logoColor=white)](#)
[![Tests](https://img.shields.io/badge/Tests-Unit%20%7C%20E2E-success)](#)
[![Deploy](https://img.shields.io/badge/Deploy-Frontend%20Vercel%20%7C%20API%20Render-black)](#)
[![UI](https://img.shields.io/badge/UI-TailwindCSS%20%2B%20shadcn%2Fui-38B2AC?logo=tailwindcss&logoColor=white)](#)

Full-stack application for managing work time, attendance, and reporting.  
Built with a dedicated API, secure JWT authentication (with refresh token rotation), testing, optimized data flows, Amazon S3 file storage, and deep Supabase integration.

## Live Demo

https://www.timeworth.site

## Key Features

- JWT-based authentication with access + refresh token flow and token rotation
- Two independent secure user flows (employee vs organization manager)
- Timesheet/worklog management with validation and business rules
- Advanced data tables with sorting, multi-criteria filtering, search, and pagination
- Data import/export workflows
- Secure file upload and storage using Amazon S3
- Supabase usage for core backend platform capabilities
- Reusable custom components
- Fully responsive UX across desktop/tablet/mobile
- Caching and invalidation
- Role/permission-based access control for sensitive actions

## Architecture Overview

- **Frontend (SPA):** React + TypeScript + TailwindCSS
- **Backend API:** NestJS
- **Database:** PostgreSQL (Supabase)
- **Backend Platform Services:** Supabase
- **ORM:** Prisma
- **Storage:** Amazon S3
- **Auth:** JWT, refresh tokens, secure HTTP-only cookies
- **Deployment:** Frontend on Vercel, API on Render

## Repository structure

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
pnpm build
pnpm dev
```

Keep the existing environment files in `apps/api`, `apps/web`, and `packages/db`.
Database client generation runs as part of the shared database package's build;
building does not run migrations.

```sh
pnpm build:api                       # API and its shared packages
pnpm build:web                       # frontend and its shared packages
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api test --runInBand    # unit tests, excluding integration tests
pnpm --filter e2e test                # requires configured services/test accounts
pnpm --filter @packages/db db:generate
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
Changes to local `.env` files also invalidate the build cache.

To roll back, restore the npm manifests and lockfile together, then restore the
previous hosting build commands. Database migrations are separate from a
package-manager rollback.
