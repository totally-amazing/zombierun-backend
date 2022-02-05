module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb-base',
    'prettier',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'consistent-return': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'import/no-unresolved': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 80,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
        allow: ['_getData'],
      },
    ],
    'class-methods-use-this': [
      'error',
      {
        enforceForClassFields: false,
      },
    ],
  },
  plugins: ['prettier', 'jest'],
};
