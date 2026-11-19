import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress';

export default tseslint.config(
  { ignores: ['node_modules', 'cypress/videos', 'cypress/screenshots'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  cypress.configs.recommended,
  {
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
    },
  },
);
