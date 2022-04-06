module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'prettier'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  },
  plugins: ['vue', 'html', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'prefer-const': 'warn',
    'no-trailing-spaces': 'warn',
  },
};
