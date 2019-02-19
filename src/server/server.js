import { Server } from 'http';
import { system } from './logger';
import app from './app';
import config from './config';

const server = new Server(app);
export default server;
server.listen(config.http, () => {
  const {
    address,
    port,
  } = server.address();

  system.info(`Listening on ${address}:${port}`);
});
