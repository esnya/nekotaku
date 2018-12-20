import socketIO from 'socket.io';
import Client from './Client';
import Datastore from './Datastore';
import config from './config';
import * as logger from './logger';
import server from './server';

const io = socketIO(server);
export default io;

const datastore = new Datastore({
  ...config,
  logger: logger.datastore,
});

io.on('connection', (socket) => {
  const client = new Client({
    ...config,
    datastore,
    logger: logger.client,
  });
  client.connection(io, socket);
});
