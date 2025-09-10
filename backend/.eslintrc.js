module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'no-process-exit': 'off',
    'no-unused-vars': 'warn',
  },
};