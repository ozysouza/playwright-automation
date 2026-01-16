import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'api-test',
      testDir: './tests/api'
    },
    {
      name: 'smoke-test',
      testMatch: 'smoke*'
    },
    {
      name: 'ui-test',
      testDir: './tests/ui',
      use: {
        defaultBrowserType: 'chromium'
      }
    }
  ],
});
