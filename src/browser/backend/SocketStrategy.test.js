describe('SocketBackend', () => {
  const { EventEmitter } = require('events');

  class Bridge extends EventEmitter {
    emitSelf(...args) {
      super.emit(...args);
    }

    emit(...args) {
      this.target.emitSelf(...args);
    }

    on(...args) {
      this.addListener(...args);
    }
  }
  class ServerSocket extends Bridge {
    constructor() {
      super();

      this.id = 'test-server-socket';
    }

    join() {}
    leave() {}
  }

  const serverSocket = new ServerSocket();

  class IO extends Bridge {
    on(event: string, handler: Function) {
      expect(event).toEqual('connection');
      handler(serverSocket);
    }
  }
  const io = new IO();

  class Client extends Bridge {
    constructor() {
      super();

      this.target = serverSocket;
      serverSocket.target = this;
      io.target = this;

      setTimeout(() => {
        this.emitSelf('connect');
      });
    }
  }

  jest.setMock('socket.io-client', Client);
  jest.setMock('socket.io', jest.fn().mockReturnValue(io));

  const storage = {};
  jest.setMock('../utilities/localStorage', {
    setItem: jest.fn((key, value) => {
      storage[key] = value;
    }),
    getItem: jest.fn(key => storage[key]),
  });

  jest.setMock('../../server/server', {});

  const Datastore = require('../../server/datastore/Datastore').default;
  const datastore = new Datastore({
    type: 'mongodb',
    url: 'mongodb://localhost:27017/nekotaku-test',
    socketTimeoutMS: 200,
  });
  jest.setMock('../../server/datastore', datastore);

  require('../../server/io');

  beforeAll(async () => {
    await datastore.getDB();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
  afterAll(async () => datastore.close());

  require('./Backend.test.js').runBackendTests(require('./SocketStrategy').default);
});
