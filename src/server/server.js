import { Server } from 'http';
import app from './app';
import config from './config';
import { system } from './logger';

const server = new Server(app);
export default server;
server.listen(config.http, () => {
  const {
    address,
    port,
  } = server.address();

  system.info(`Listening on ${address}:${port}`);
});
