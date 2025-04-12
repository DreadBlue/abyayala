module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    'ecmaVersion': 2018,
  },
  extends: ['eslint:recommended', 'google', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        quoteProps: 'preserve',
      },
    ],
    'quotes': 'off',
    'max-len': ['error', { 'code': 180 }],
    'object-curly-spacing': [2, 'always'],
    'indent': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
