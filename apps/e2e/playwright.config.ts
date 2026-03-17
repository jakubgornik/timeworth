import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../web/.env") });
config({ path: path.resolve(__dirname, ".env"), override: true });

const E2E_BASE_URL = process.env.E2E_BASE_URL || "http://localhost:5173";
const E2E_API_URL = process.env.E2E_API_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"]],
  preserveOutput: "failures-only",
  use: {
    baseURL: E2E_BASE_URL,
    launchOptions: {
      slowMo: 500,
    },
  },

  webServer: [
    {
      command: `CORS_ORIGIN=${E2E_BASE_URL} npm --prefix ../.. run dev -w api`,
      url: E2E_API_URL,
    },
    {
      command:
        "npm --prefix ../.. run dev -w web -- --host localhost --port 5173",
      url: `${E2E_BASE_URL}/login`,
    },
  ],

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
