import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsEslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  globalIgnores(['dist/**/*', 'node_modules/**/*', 'src/migrations/*.ts', 'eslint.config.mjs']),
  ...tsEslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: {
      'import/first': 'error',
      'import/exports-last': 'error',
      'import/no-duplicates': 'error',
      'import/order': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:'],
            ['^\\u0000'],
            ['^@nestjs/'],
            ['^@?\\w'],
            ['^.*configs/'],
            ['^.*modules/'],
            ['^.*shared/'],
            ['^.*shared/types/'],
            ['^\\.\\./', '^\\./'],
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  eslintPluginPrettierRecommended,
  prettierConfig,
]);

export default eslintConfig;
