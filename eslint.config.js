import eslintPluginAstro from 'eslint-plugin-astro';
import * as eslintPluginMdx from 'eslint-plugin-mdx';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

export default [
  // Global ignore patterns - directories to exclude from linting
  {
    ignores: [
      '**/.astro/**', 
      '**/dist/**'
    ]
  },
  
  // Apply recommended Astro linting rules
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  
  // Add TypeScript support for Astro files
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.astro']
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    }
  },

  // Apply MDX linting rules
  {
    ...eslintPluginMdx.flat,
    files: ['**/*.md', '**/*.mdx'],
    // Optional: enable code block linting
    processor: eslintPluginMdx.createRemarkProcessor({
      lintCodeBlocks: true,
      // Add settings to treat certain code blocks differently
      languageMapper: {
        js: 'javascript',
        javascript: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        typescript: 'typescript',
        tsx: 'typescript',
        // Treat JSON specially - don't attempt to lint as JS
        json: 'json',
        // Ignore shell commands
        sh: false,
        bash: false
      }
    })
  },
  
  // Apply MDX code blocks linting rules
  {
    ...eslintPluginMdx.flatCodeBlocks,
    files: ['**/*.md', '**/*.mdx'],
    rules: {
      ...eslintPluginMdx.flatCodeBlocks.rules,
      // Add specific rules for code blocks to be more tolerant
      'no-unused-expressions': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },
  
  // Apply TypeScript linting rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Existing rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Recommended rules for Astro Starlight projects
      '@typescript-eslint/consistent-type-imports': 'error', // Use import type {} syntax
      '@typescript-eslint/no-non-null-assertion': 'warn', // Avoid non-null assertions
      '@typescript-eslint/no-inferrable-types': 'warn', // Don't specify types when they can be inferred
      '@typescript-eslint/ban-ts-comment': ['warn', { // Restrict @ts-ignore comments
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description'
      }],
      '@typescript-eslint/prefer-nullish-coalescing': 'warn', // Use ?? instead of || for null/undefined checks
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Prefer interface over type
      '@typescript-eslint/array-type': ['error', { default: 'array' }], // Prefer T[] over Array<T>
      '@typescript-eslint/no-empty-interface': 'warn' // Warn about empty interfaces
    }
  },

  // Custom rule overrides
  {
    rules: {
      // Add or modify specific rules here, for example:
      // "astro/no-set-html-directive": "error"
    }
  }
];
