import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import baseConfig from './base.js';

/**
 * ESLint config for React + TypeScript frontend apps.
 *
 * Usage in apps/frontend/eslint.config.js:
 *   import reactConfig from '@repo/eslint-config/react'
 *   export default reactConfig
 */
const reactConfig = tseslint.config(
  // All base TypeScript rules apply here too
  ...baseConfig,

  {
    // Target only React component files
    files: ['**/*.tsx', '**/*.jsx'],

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },

    settings: {
      // Tell the React plugin what version to expect
      // 'detect' reads it from your package.json automatically
      react: { version: 'detect' },
    },

    rules: {
      // ── React rules ───────────────────────────────────────────

      // Not needed in React 17+ with automatic JSX transform
      // react.json tsconfig uses jsx: 'react-jsx' which handles this
      'react/react-in-jsx-scope': 'off',

      // TypeScript handles prop validation better than PropTypes
      'react/prop-types': 'off',

      // Components should have display names for React DevTools
      'react/display-name': 'warn',

      // Catch common React mistakes
      'react/no-array-index-key': 'warn', // index as key = broken animations/state
      'react/no-danger': 'error', // dangerouslySetInnerHTML = XSS risk

      // ── React Hooks rules ─────────────────────────────────────

      // Hooks must be called at top level — not in loops/conditions
      // This is a Rules of Hooks violation and causes very weird bugs
      'react-hooks/rules-of-hooks': 'error',

      // useEffect dependency arrays must be complete
      // Missing deps = stale closures = wrong values in effect
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);

export default reactConfig;
