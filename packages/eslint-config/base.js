import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/**
 * Base ESLint config for all TypeScript packages.
 *
 * Usage in any app's eslint.config.js:
 *   import baseConfig from '@repo/eslint-config/base'
 *   export default tseslint.config(...baseConfig, { ...your overrides })
 *
 * Note: This is an ARRAY of config objects, not a single object.
 * Spread it with ... when composing.
 */
const baseConfig = tseslint.config(
  // ── Layer 1: ESLint's own recommended JS rules ──────────────
  js.configs.recommended,

  // ── Layer 2: TypeScript-ESLint recommended rules ────────────
  // 'recommended' = type-unaware rules only (faster)
  // We use recommended here rather than strict to avoid being
  // too aggressive for a shared base config
  ...tseslint.configs.recommended,

  // ── Layer 3: Disable rules that conflict with Prettier ──────
  // Must be LAST so it overrides any formatting rules above
  prettierConfig,

  // ── Layer 4: Our custom rules ───────────────────────────────
  {
    rules: {
      // ── TypeScript specific ──────────────────────────────────

      // Use the TypeScript-aware version, not the base ESLint one
      // argsIgnorePattern allows (_req, res) in Express handlers
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // import type { Task } not import { Task } for type-only imports
      // Prevents Zod/runtime code from leaking into frontend bundles
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Bans any — use unknown and narrow explicitly instead
      '@typescript-eslint/no-explicit-any': 'error',

      // Unawaited promises are silent bugs
      // Write 'void fn()' to explicitly say "fire and forget"
      '@typescript-eslint/no-floating-promises': 'error',

      // Disallow non-null assertion operator (the ! postfix)
      // obj!.property — if obj is actually null, this crashes
      // Use optional chaining obj?.property or check explicitly
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Prefer ?? over || for default values
      // 0 || 'default' → 'default'  (wrong! 0 is valid)
      // 0 ?? 'default' → 0          (correct)
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // Prefer x?.y over x && x.y
      '@typescript-eslint/prefer-optional-chain': 'error',

      // ── General JavaScript ────────────────────────────────────

      // console.log is a debug artifact — use a real logger
      // Allow warn/error as those are legitimate in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Always === never ==
      // JavaScript's == coercion is a footgun
      eqeqeq: ['error', 'always'],

      // var is function-scoped and hoisted — always use const/let
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // ── Layer 5: Global ignores ─────────────────────────────────
  // These patterns are ignored across ALL apps that use this config
  {
    ignores: ['**/dist/**', '**/build/**', '**/.turbo/**', '**/node_modules/**', '**/coverage/**'],
  },
);

export default baseConfig;
