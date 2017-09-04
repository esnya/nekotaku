import config from '../config';
import stub from './BackendStub';

const {
  backend,
} = config;

export default new ({
  stub,
})[backend.type](backend);
