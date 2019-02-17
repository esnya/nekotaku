import EventEmitter, { ListenerFn } from 'eventemitter3';
import * as firebasemock from 'firebase-mock';
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
import Backend from '@/browser/backend/Backend';

function setupStub(c: any) {
  browserLogger.setLevel(browserLogger.levels.ERROR);
  return c.backend;
}

function setupFirebase(c: any) {
  const mockauth = new firebasemock.MockAuthentication();
  mockauth.autoFlush();
  const mockdatabase = new firebasemock.MockFirebase();
  mockdatabase.autoFlush();
  const mockstorage = new firebasemock.MockStorage();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    (path?: string) => (path ? mockdatabase.child(path) : mockdatabase),
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

class StubSocket {
  private sender: EventEmitter;
  private receiver: EventEmitter;
  join = spy();

  constructor(sender: EventEmitter, receiver: EventEmitter) {
    this.sender = sender;
    this.receiver = receiver;
  }

  emit(event: string, ...args: any[]): void {
    setTimeout(() => this.sender.emit(event, ...args));
  }

  once(event: string, callback: ListenerFn): void {
    this.receiver.once(event, callback);
  }

  on(event: string, callback: ListenerFn): void {
    this.receiver.on(event, callback);
  }

  off(event: string, callback: ListenerFn): void {
    this.receiver.off(event, callback);
  }
}

function setupSocket(c: any) {
  const up = new EventEmitter();
  const down = new EventEmitter();

  const clientSocket = new StubSocket(up, down);
  const serverSocket = new StubSocket(down, up);

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

export function forEachBackend(tests: (a: Backend) => void) {
  const backends: { [key: string]: [any, (c: any) => any ]} = {
    stub: [StubBackend, setupStub],
    firebase: [FirebaseBackend, setupFirebase],
    socket: [SocketBackend, setupSocket],
  };

  Object.keys(backends).forEach((type) => {
    const [TargetBackend, setup] = backends[type];

    const testConfig = setup(config);
    const backend = new TargetBackend(testConfig);

    describe(`with ${type} backend`, () => {
      tests(backend);
    });
  });
}

export async function removeRoom(backend: Backend, roomId: string) {
  const roomModel = new RoomModel(backend);
  await roomModel.remove(roomId);
}

export async function withRoom(backend: Backend) {
  const roomsModel = new RoomsModel(backend);

  const now = Date.now();
  const title = `TestRoom-${now}`;

  const roomId = await roomsModel.push(null, {
    title,
    dice: 'SwordWord',
    characterAttirbutes: ['HP', 'MP'],
  });

  after(() => {
    removeRoom(backend, roomId).catch(() => {});
  });

  return roomId;
}

export function sleep(t: number = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}
