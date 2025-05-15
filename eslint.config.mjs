import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

import stylistic from '@stylistic/eslint-plugin';
/* This plugin provides all rules from:
@stylistic/eslint-plugin-js
@stylistic/eslint-plugin-ts
@stylistic/eslint-plugin-jsx
@stylistic/eslint-plugin-plus */

import eslintConfigPrettier from 'eslint-config-prettier';
import parser from '@typescript-eslint/parser';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globalAgent } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

/** @type {import('eslint').Linter.Config[]} */
export default [
  includeIgnoreFile(gitignorePath),
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: ['node_modules', 'dist', 'eslint.config.mjs', 'ecosystem.config.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...stylistic.configs.recommended,
    ...importPlugin.flatConfigs.recommended,
    plugins: {
      stylistic,
      importPlugin,
      unusedImports,
    },
    rules: {
      'unusedImports/no-unused-imports': 'error',
      'unusedImports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'importPlugin/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@next-apps/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '*nest*',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  eslintConfigPrettier,
];
