import config from '@/browser/config';
import Backend from '@/browser/backend/Backend';
import BackendOptions from '@/browser/backend/BackendOptions';
import FirebaseBackend from '@/browser/backend/FirebaseBackend';
import FirebaseBackendOptions from '@/browser/backend/FirebaseBackendOptions';
import SocketBackend from '@/browser/backend/SocketBackend';
import SocketBackendOptions from '@/browser/backend/SocketBackendOptions';
import StubBackend from '@/browser/backend/StubBackend';

const {
  backend,
} = config;

function factory(type: string, options: BackendOptions): Backend {
  switch (type) {
    case 'stub':
      return new StubBackend();
    case 'firebase':
      return new FirebaseBackend(options as FirebaseBackendOptions);
    case 'socket':
      return new SocketBackend(options as SocketBackendOptions);
    default:
      throw new Error(`Invalid backend type ${type}`);
  }
}

export default factory(backend.type, backend);
