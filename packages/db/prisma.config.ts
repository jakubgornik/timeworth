import { defineConfig, env } from "prisma/config";

// The with-env scripts load the root .env before invoking the Prisma CLI.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
