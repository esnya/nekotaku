describe.skip('FirebaseBackend', () => {
  jest.mock('firebase');

  const {
    default: FirebaseStrategy,
  } = require('./FirebaseStrategy');

  beforeEach(() => new Promise(resolve => setTimeout(resolve)));

  require('./Backend.test.js').runBackendTests(FirebaseStrategy);
});
