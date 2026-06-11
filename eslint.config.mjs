import tanstackQuery from '@tanstack/eslint-plugin-query'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

export default [
  ...nextVitals,
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/next-env.d.ts',
    ],
  },
  prettier,
  {
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      'import/export': 'off',
      'import/no-unresolved': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@tanstack/query/prefer-query-options': 'warn',
    },
  },
]
