// tests/i18n.spec.js
const en = require('../locales/en.json');

test('en contains welcome key', () => {
  expect(en).toHaveProperty('welcome');
});
