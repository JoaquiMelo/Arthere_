// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['components/**', 'src/components/**', 'src/screens/**'],
    rules: { 'import/no-unresolved': 'off' },
  },
  {
    files: ['src/hooks/**'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
]);
