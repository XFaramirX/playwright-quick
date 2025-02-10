import { PlaywrightTestConfig } from '@playwright/test';
import { deviceMatrix } from './e2e/fixtures/constants';
import { environments } from './e2e/fixtures/environments';
import {
  CurrentsConfig,
  currentsReporter
} from "@currents/playwright";


const currentsConfig: CurrentsConfig = {
  recordKey: "secret record key", // 📖 https://currents.dev/readme/guides/record-key
  projectId: "project id", // get one at https://app.currents.dev
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */

interface TestConfig extends PlaywrightTestConfig {
  baseUrl: string;
  lighthouseAudit: boolean;
}

const defaultConfig: TestConfig = {
  testDir: './e2e/specs',
  outputDir: './e2e/reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["blob"], ["list"], ["html"]] : [currentsReporter(currentsConfig)],
  baseUrl: 'http://localhost:8080',
  snapshotDir: './e2e/reports/snapshots',
  use: {
    storageState: "./e2e/fixtures/auth.json",
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
  timeout: 45000,
  lighthouseAudit: false,

};
// get the environment type from command line. If none, set it to local
const environment = process.env.TEST_ENV || 'local';

// config object with default configuration and environment-specific configuration
const config: TestConfig = {
  ...defaultConfig,
  ...environments[environment], // Merge environment-specific config
};

export default config;
