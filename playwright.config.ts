import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 1000 } },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -- --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      env: { VITE_WEB3FORMS_ACCESS_KEY: 'web3forms-test-key' },
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: 'npm run dev -- --port 4174 --strictPort',
      url: 'http://127.0.0.1:4174',
      env: { VITE_WEB3FORMS_ACCESS_KEY: '' },
      reuseExistingServer: false,
      timeout: 30_000,
    },
  ],
})
