import { PlaywrightTestConfig } from '@playwright/test';
import { deviceMatrix } from './e2e/fixtures/constants';
import { environments } from './e2e/fixtures/environments';
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
  retries: process.env.CI ? 2 : 3,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'blob' : 'html',
  baseUrl: 'http://localhost:8080',
  snapshotDir: './e2e/reports/snapshots',
  use: {
    storageState: "./e2e/fixtures/auth.json",
    trace: 'on-first-retry',
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
