import js from '@eslint/js';
import drizzle from 'eslint-plugin-drizzle';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config';
import path from 'path';

export default defineConfig([
  globalIgnores(['**/node_modules/**', '**/dist/**', '**/build/**', '**/out/**']),
  includeIgnoreFile([path.resolve(__dirname, '.gitignore')]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, drizzle },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    // eslint-plugin-drizzle only ships an eslintrc-style `configs.recommended`
    // which flat config can't use via `extends` so they're manually mapped.
    rules: {
      'drizzle/enforce-delete-with-where': [
        'error',
        {
          drizzleObjectName: ['db', 'drizzle', 'queryBuilder'],
        }
      ],
      'drizzle/enforce-update-with-where': 'error',
    },
  },
  tseslint.configs.strict,
  {
    rules: {
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
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowWithDecorator: true,
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]);
