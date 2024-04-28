const { alwaysTrue } = require('../routes/routes');

describe('testing index file', () => {
  test('empty string should result in zero', () => {
    expect(alwaysTrue()).toBe(true);
  });
});