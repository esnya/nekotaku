import config from '../config';
import Backend from './Backend';
import socket from './SocketBackend';
import stub from './StubBackend';
import firebase from './FirebaseBackend';

const {
  backend,
} = config;

const BackendImpl = {
  stub,
  firebase,
  socket,
}[backend.type];

(Object.getOwnPropertyNames(Backend.prototype))
  .filter(key => key !== 'constructor')
  .forEach((key) => {
    if (BackendImpl.prototype[key] === Backend.prototype[key]) {
      throw new TypeError(`Abstract method "${key}" is not implemented`);
    }
  });

export default new BackendImpl(backend);
