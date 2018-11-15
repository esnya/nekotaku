import StubStrategy from '@/browser/backend/StubStrategy';
import runBackendTest from './runBackendTest';

describe('StubBackend', () => {
  runBackendTest(StubStrategy);
});
