/* eslint class-methods-use-this: off */

import EventEmitter from 'eventemitter3';
import { spy } from 'sinon';
import Client from '@/server/Client';
import SocketStrategy from '@/browser/backend/SocketStrategy';
import runBackendTest from './runBackendTest';

describe('SocketBackend', () => {
  const up = new EventEmitter();
  const down = new EventEmitter();

  const socket = {
    on: spy((...args) => down.on(...args)),
    emit: spy((...args) => up.emit(...args)),
  };

  const io = {
    on: spy((...args) => up.on(...args)),
    emit: spy((...args) => down.emit(...args)),
    join: spy(),
    leave: spy(),
  };

  it('should mock Client on server', () => {
    const client = new Client();
    client.connection(io, io);
  });

  runBackendTest(SocketStrategy, {
    socket,
    onInitialized() {
      io.emit('connect');
    },
  });
});
