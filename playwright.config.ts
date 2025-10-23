import { PlaywrightTestConfig } from '@playwright/test';
import { deviceMatrix } from './e2e/fixtures/constants';
import { environments } from './e2e/fixtures/environments';
import * as dotenv from "dotenv";
import { getEnvVariable } from "./e2e/helpers/env-variables";
/**
 * See https://playwright.dev/docs/test-configuration.
 */

interface TestConfig extends PlaywrightTestConfig {
  baseUrl: string;
  lighthouseAudit: boolean;
  componentSnapshots: boolean;
}

dotenv.config({ override: true });
export const BASE_URL = getEnvVariable("BASE_URL");
export const CHIRPY_LOGIN = getEnvVariable("CHIRPY_LOGIN");
export const CHIRPY_PASSWORD = getEnvVariable("CHIRPY_PASSWORD");


const defaultConfig: TestConfig = {
  testDir: './e2e/specs',
  outputDir: './e2e/reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["blob"], ["list"], ["html", { title: 'Custom test' }], ["github"], ["./state-reporter.js"]] : [["blob"], ["list"], ["html", { title: 'Custom test' }], ["github"], ["./state-reporter.js"]],
  baseUrl: 'http://localhost:8080',
  snapshotDir: './e2e/reports/snapshots',
  use: {
    storageState: "./e2e/fixtures/auth.json",
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AUTH_TOKEN || ''}`,
    },
    trace: "on",
    video: "on",
    screenshot: "on",
  },
  projects: [...deviceMatrix],
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:8080',
  //   reuseExistingServer: !process.env.CI,
  // },

  timeout: 20000,
  captureGitInfo: { diff: true },
  lighthouseAudit: false,
  componentSnapshots: true,

};
// get the environment type from command line. If none, set it to local
const environment = process.env.TEST_ENV || 'local';

// config object with default configuration and environment-specific configuration
const config: TestConfig = {
  ...defaultConfig,
  ...environments[environment], // Merge environment-specific config
};

export default config;
