import { defineConfig, devices } from "@playwright/test";
import { testDatabaseUrl } from "./tests/unit/test-db";

const PORT = 3200;

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: testDatabaseUrl(),
      EMAIL_OUTBOX_DIR: ".outbox/e2e",
      SMTP_HOST: "",
      RATE_LIMIT_MAX: "1000",
      RATE_LIMIT_SECRET: process.env.RATE_LIMIT_SECRET || "e2e-secret",
    },
  },
});
