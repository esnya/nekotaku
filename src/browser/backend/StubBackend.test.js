describe('StubBackend', () => {
  require('./Backend.test.js').runBackendTests(require('./StubStrategy').default);
});
