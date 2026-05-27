import tseslint from 'typescript-eslint';
import baseConfig from './base.js';

/**
 * ESLint config for Node.js/Express backend apps.
 *
 * Usage in apps/backend/eslint.config.js:
 *   import nodeConfig from '@repo/eslint-config/node'
 *   export default nodeConfig
 */
const nodeConfig = tseslint.config(
  // Spread the base config first — all base rules apply
  ...baseConfig,

  {
    rules: {
      // Backend apps use real loggers but console is more acceptable
      // than in frontend — override base to off for backend
      'no-console': 'off',

      // Disallow require() — we're using ESM throughout
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
);

export default nodeConfig;
