module.exports = {
  env: {
    commonjs: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:array-func/all',
    'plugin:lodash/recommended',
    'plugin:node/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['api/server/src/migrations/*'],
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['prettier', 'promise', 'unicorn', 'array-func', 'lodash', 'node'],
  rules: {
    'no-console': 0,
    'no-param-reassign': ['error', { props: false }],
    'prefer-destructuring': 0,
    'consistent-return': ['warn', { treatUndefinedAsUnspecified: true }],
    'arrow-body-style': 0,
    'comma-dangle': 0,
    'node/no-unsupported-features/es-syntax': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: { camelCase: true, pascalCase: true },
      },
    ],
  },
};
