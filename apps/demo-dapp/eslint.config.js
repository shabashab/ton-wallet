import { extendConfig as extendBaseConfig } from '@inc-dev/eslint-config-vue'
import { globalIgnores } from 'eslint/config'
import path from 'node:path'
import ts from 'typescript-eslint'

export default extendBaseConfig([
  globalIgnores([
    'dist/**/*',
    'node_modules/**/*',
    '.nuxt/**/*',
    '.output/**/*',
  ]),
  {
    languageOptions: {
      parserOptions: {
        project: [
          path.resolve(import.meta.dirname, './tsconfig.app.json'),
          path.resolve(import.meta.dirname, './tsconfig.node.json'),
        ],
      },
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        parser: ts.parser,
        project: [
          path.resolve(import.meta.dirname, './tsconfig.app.json'),
          path.resolve(import.meta.dirname, './tsconfig.node.json'),
        ],
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
