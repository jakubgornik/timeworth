#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

corepack enable pnpm
corepack pnpm install --frozen-lockfile --prod=false
corepack pnpm --filter @packages/db db:deploy
corepack pnpm build:api

