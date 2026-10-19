# Timeworth API

NestJS API in the Timeworth pnpm workspace. Run these commands from the
repository root after following the [setup instructions](../../README.md):

```sh
pnpm build:api
pnpm --filter api dev
pnpm --filter api start:prod
pnpm --filter api test --runInBand
```

`build:api` generates the Prisma client and builds the shared packages before
compiling the API. Unit tests exclude integration specs; integration tests need
a configured test database.

See the [Render deployment instructions](../../README.md#render-api) before
deploying the pnpm migration.
