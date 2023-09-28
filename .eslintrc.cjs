/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        'sourceType': 'script'
      }
    }
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    'ecmaVersion': 'latest',
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module'
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-undef': 'off', // https://eslint.org/docs/latest/rules/no-undef
    'vue/multi-word-component-names': 'off', // https://eslint.vuejs.org/rules/multi-word-component-names.html
    'vue/no-deprecated-v-on-native-modifier': 'off', // https://eslint.vuejs.org/rules/no-deprecated-v-on-native-modifier.html
    '@typescript-eslint/no-explicit-any': 'off', // https://typescript-eslint.io/rules/no-explicit-any/
    '@typescript-eslint/ban-types': 'off', // https://typescript-eslint.io/rules/ban-types/
    '@typescript-eslint/no-unused-vars': 'off', // https://typescript-eslint.io/rules/no-unused-vars/
  }
}
