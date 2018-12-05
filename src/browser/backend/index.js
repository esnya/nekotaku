import config from '../config';
import BackendStrategy from './BackendStrategy';
import socket from './SocketStrategy';
import stub from './StubStrategy';
import firebase from './FirebaseStrategy';
import * as JR from './JoinResult';

const {
  backend,
} = config;

const Strategy = {
  stub,
  firebase,
  socket,
}[backend.type] || BackendStrategy;

(Object.getOwnPropertyNames(BackendStrategy.prototype))
  .filter(key => key !== 'constructor')
  .forEach((key) => {
    const method = BackendStrategy.prototype[key];
    if (Strategy.prototype[key] === method) {
      throw new TypeError(`Abstract method "${key}" is not implemented`);
    }
  });

export default new Strategy(backend);

export const JoinResult = JR;
