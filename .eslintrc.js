module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  plugins: ['prettier'],
  extends: ['react-app', 'eslint:recommended', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-unused-vars': 'off',
  },
};
