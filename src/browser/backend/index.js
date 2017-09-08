import config from '../config';
import stub from './BackendStub';
import * as JR from './JoinResult';

const {
  backend,
} = config;

export default new ({
  stub,
})[backend.type](backend);

export const JoinResult = JR;
