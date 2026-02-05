const js = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // === Ignore patterns
  {
    ignores: [
      'node_modules/',
      'dist/',
      '/.vscode',
      '/.yarn',
      'yarn.lock',
      'README.md',
      '**/.*',
    ],
  },

  // === Base JS recommended
  js.configs.recommended,

  // === Base configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // Custom rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-console': ['warn', { allow: ['info', 'warn', 'error', 'test'] }],
      'comma-spacing': ['error', { before: false, after: true }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'array-bracket-spacing': ['error', 'never'],
      'array-callback-return': 'error',
      'object-shorthand': ['error', 'always'],
      'arrow-spacing': 'error',
      'switch-colon-spacing': 'error',
      'block-spacing': 'error',
      'semi-spacing': ['error', { before: false, after: true }],
      'computed-property-spacing': ['error', 'never'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'func-call-spacing': ['error', 'never'],
      'jsx-quotes': ['error', 'prefer-double'],
    },
  },

  // === TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx'] },
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      // plugin:@typescript-eslint/recommended
      ...tsPlugin.configs.recommended.rules,

      // plugin:import/recommended + plugin:import/typescript
      ...importPlugin.configs.recommended.rules,
      ...(importPlugin.configs.typescript?.rules ?? {}),

      // TypeScript rules
      'no-undef': 'off',
      'import/no-named-as-default': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // === Prettier
  prettierConfig,

  // === Node
  {
    files: ['eslint.config.cjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
