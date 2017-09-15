import socketIO from 'socket.io';
import Client from './Client';
import server from './server';

const io = socketIO(server);
export default io;

io.on('connection', (socket) => {
  const client = new Client();
  client.connection(io, socket);
});
