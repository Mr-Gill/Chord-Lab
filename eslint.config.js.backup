import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
        'dist',
        'offline/dist',
        'node_modules',
        'eslint.config.js',
        'postcss.config.js',
        'tailwind.config.js',
        'offline/tailwind.config.js',
        'scripts/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        'tests/**',
        'tests-examples/**',
        'playwright.config.ts',
        'src/components/chord-builder/**',
        'src/components/classroom/**',
        'src/components/diagrams/**',
        'src/contexts/**',
        'src/components/learning-path/**',
        'src/components/diagrams/GuitarDiagram.tsx',
        'src/components/diagrams/PianoDiagram.tsx'
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json', './tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
    },
  }
)