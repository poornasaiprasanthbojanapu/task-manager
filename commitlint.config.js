/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Allowed commit types — what comes before the colon
    'type-enum': [
      2, // 2 = error (not warning)
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation only
        'style', // formatting, whitespace (not CSS)
        'refactor', // code change that is neither feat nor fix
        'test', // adding or fixing tests
        'chore', // maintenance, deps updates, tooling
        'perf', // performance improvement
        'ci', // CI/CD changes
        'revert', // reverts a previous commit
        'build', // build system changes
      ],
    ],

    // Type must be lowercase: 'feat' not 'Feat'
    'type-case': [2, 'always', 'lower-case'],

    // Type must be present: 'feat: ...' not just 'some message'
    'type-empty': [2, 'never'],

    // Subject (the part after the colon) must not be empty
    'subject-empty': [2, 'never'],

    // Subject must not end with a period
    // 'fix: resolve bug.' ← rejected
    // 'fix: resolve bug'  ← accepted
    'subject-full-stop': [2, 'never', '.'],

    // Subject must not start with uppercase
    // 'feat: Add login'  ← rejected
    // 'feat: add login'  ← accepted
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

    // Max length of the entire first line (type + scope + subject)
    'header-max-length': [2, 'always', 100],

    // Scopes are optional (severity 1 = warning) but when used,
    // must be one of these recognised values
    'scope-enum': [
      1, // warning not error — scope is always optional
      'always',
      ['frontend', 'backend', 'shared-types', 'eslint-config', 'tsconfig', 'root', 'ci', 'deps'],
    ],
  },
};
