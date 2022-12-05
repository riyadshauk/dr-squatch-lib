module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     jsx: 'never',
    //     ts: 'never',
    //     tsx: 'never',
    //   },
    // ],
    'no-use-before-define': 0,
    'eol-last': 0,
    'no-confusing-arrow': 0,
    'arrow-parens': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
    // 'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'no-restricted-syntax': 0, // generator keyword "in" increases code size, but it's server-side... so fine?
  },
};
