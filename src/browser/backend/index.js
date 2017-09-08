import config from '../config';
import stub from './BackendStub';
import firebase from './FirebaseBackend';
import * as JR from './JoinResult';

const {
  backend,
} = config;

export default new ({
  firebase,
  stub,
})[backend.type](backend);

export const JoinResult = JR;
