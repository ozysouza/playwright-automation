import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.SITE_URL
        ? process.env.SITE_URL
        : 'http://localhost:4200/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: {
      mode: 'off',
      size: {
        width: 1920,
        height: 1080
      }
    }
  },

  projects: [
    {
      name: 'chromium'
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      },
    }
  ],
});
