import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { Linter } from 'eslint'

const config: Linter.Config[] = [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    ignores: ['node_modules/', 'dist/', 'out/']
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      }
    },
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended as Linter.Config[],
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser
      }
    }
  },
  {
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off', // https://eslint.vuejs.org/rules/multi-word-component-names.html
      'vue/no-deprecated-v-on-native-modifier': 'off', // https://eslint.vuejs.org/rules/no-deprecated-v-on-native-modifier.html
      'vue/max-attributes-per-line': ['error', {
        'singleline': {
          max: 2,
        },
        'multiline': {
          'max': 2
        }
      }], // https://eslint.vuejs.org/rules/max-attributes-per-line.html
      '@typescript-eslint/no-explicit-any': 'off', // https://typescript-eslint.io/rules/no-explicit-any/
      '@typescript-eslint/ban-types': 'off', // https://typescript-eslint.io/rules/ban-types/
      '@typescript-eslint/no-unused-vars': 'off', // https://typescript-eslint.io/rules/no-unused-vars/
      '@typescript-eslint/no-unsafe-function-type': 'off', // https://typescript-eslint.io/rules/no-unsafe-function-type/
    },
  }
]

export default config
