import config from '../config';
import Backend from './Backend';
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

export default new Backend(new Strategy(backend));

export const JoinResult = JR;
