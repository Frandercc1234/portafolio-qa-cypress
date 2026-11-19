import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', { log(m) { console.log(JSON.stringify(m)); return null; } });
    },
    baseUrl: 'https://frandercenteno.vercel.app',
    viewportWidth: 1440,
    viewportHeight: 900,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
    defaultCommandTimeout: 8000,
  },
});
