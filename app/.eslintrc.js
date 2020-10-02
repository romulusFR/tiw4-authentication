module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "prettier",
    "plugin:node/recommended",
    "plugin:promise/recommended",
    "plugin:import/recommended",
    "plugin:security/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  rules: {
    'no-var': ['error'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
