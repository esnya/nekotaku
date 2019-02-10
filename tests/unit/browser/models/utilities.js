import EventEmitter from 'eventemitter3';
import firebasemock from 'firebase-mock';
import { spy } from 'sinon';
import browserLogger from 'loglevel';
import config from '@/browser/config';
import StubBackend from '@/browser/backend/StubBackend';
import FirebaseBackend from '@/browser/backend/FirebaseBackend';
import SocketBackend from '@/browser/backend/SocketBackend';
import RoomModel from '@/browser/models/RoomModel';
import RoomsModel from '@/browser/models/RoomsModel';
import serverConfig from '@/server/config';
import Datastore from '@/server/Datastore';
import Client from '@/server/Client';

function setupStub(c) {
  browserLogger.setLevel(browserLogger.levels.ERROR);
  return c.backend;
}

function setupFirebase(c) {
  const mockauth = new firebasemock.MockAuthentication();
  mockauth.autoFlush();
  const mockdatabase = new firebasemock.MockFirebase();
  mockdatabase.autoFlush();
  const mockstorage = new firebasemock.MockStorage();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    path => (path ? mockdatabase.child(path) : mockdatabase),
    () => mockauth,
    // () => ({
    //   onAuthStateChanged(callback) {
    //     callback({
    //       uid: 'test-uid',
    //     });
    //   },
    //   signInAnonymously: spy(),
    // }),
    () => null,
    () => mockstorage,
    () => null,
  );

  return {
    ...c.backend,
    firebase: mocksdk,
  };
}

const MockLogger = {
  debug: spy(),
  trace: spy(),
  info: spy(),
  error: spy(),
  fatal: spy(),
};

function setupSocket(c) {
  const up = new EventEmitter();
  const down = new EventEmitter();
  const clientSocket = {
    emit(event, ...args) {
      setTimeout(() => up.emit(event, ...args));
    },
    once(event, callback) {
      down.once(event, callback);
    },
    on(event, callback) {
      down.on(event, callback);
    },
    off(event, callback) {
      down.off(event, callback);
    },
  };
  const serverSocket = {
    emit(event, ...args) {
      setTimeout(() => down.emit(event, ...args));
    },
    join: spy(),
    once(event, callback) {
      up.once(event, callback);
    },
    on(event, callback) {
      up.on(event, callback);
    },
    off(event, callback) {
      up.off(event, callback);
    },
  };

  const datastore = new Datastore({
    ...serverConfig,
    logger: MockLogger,
  });

  const client = new Client({
    ...serverConfig,
    logger: MockLogger,
    datastore,
  });
  client.connection(serverSocket, serverSocket);

  return {
    ...c.backend,
    socket: clientSocket,
    onInitialized: () => serverSocket.emit('connect'),
  };
}

export function forEachBackend(tests: (a: Object) => void) {
  const backends = {
    stub: [StubBackend, setupStub],
    firebase: [FirebaseBackend, setupFirebase],
    socket: [SocketBackend, setupSocket],
  };

  Object.keys(backends).forEach((type) => {
    const [Backend, setup] = backends[type];

    const testConfig = setup(config);
    const backend = new Backend(testConfig);

    describe(`with ${type} backend`, () => {
      tests(backend);
    });
  });
}

export async function removeRoom(backend, roomId) {
  const roomModel = new RoomModel(backend);
  await roomModel.remove(roomId);
}

export async function withRoom(backend) {
  const roomsModel = new RoomsModel(backend);

  const now = Date.now();
  const title = `TestRoom-${now}`;

  const roomId = await roomsModel.push({
    title,
    dice: 'SwordWord',
    characterAttirbutes: ['HP', 'MP'],
  });

  after(() => {
    removeRoom(backend, roomId).catch(() => {});
  });

  return roomId;
}

export function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}
