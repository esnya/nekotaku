export function runBackendTests(Stragtegy) {
  URL.createObjectURL = jest.fn();
  URL.revokeObjectURL = jest.fn();
  const now = Date.now();
  Date.now = jest.fn().mockReturnValue(now);

  const _ = require('lodash');
  const MetadataFields = ['id', 'createdAt', 'updatedAt', 'uid', 'roomId'];
  function filterMetadata(o) {
    return _.pickBy(o, (v, k) => MetadataFields.indexOf(k) < 0);
  }

  let backend;
  const JoinResult = require('./JoinResult');
  it('should be able to instantiate', () => {
    const Backend = require('./Backend').default;
    const strategy = new Stragtegy({
      backend: { type: 'test' },
    });
    backend = new Backend(strategy);
  });

  let uid;
  it('should be able to get UID', async () => {
    uid = await backend.getUID();
    expect(uid).toBeDefined();
  });

  const lobbyWatcher = jest.fn();
  it('should be able to join lobby', async () => {
    await backend.joinLobby(lobbyWatcher);
  });

  let roomId1;
  const TestRoom1 = {
    title: 'TestRoom1',
    dice: 'DiceBot',
    characterAttributes: ['HP'],
  };
  const TestMap1 = {
    width: 12,
    height: 13,
  };
  let RoomData1;
  it('should be able to craete room', async () => {
    lobbyWatcher.mockClear();
    roomId1 = await backend.createRoom(TestRoom1, TestMap1);

    expect(roomId1).toBeDefined();
  });

  it('should receives created room', () => {
    RoomData1 = {
      ...TestRoom1,
      id: roomId1,
      isLocked: false,
      createdAt: now,
      updatedAt: now,
      players: 1,
      uid,
    };
    const roomsAdd = lobbyWatcher.mock.calls.find(([e]) => e === 'rooms:add');
    expect(roomsAdd).toEqual(['rooms:add', RoomData1]);
  });

  const roomWatcher = jest.fn();
  it('should be able to login craeted room', async () => {
    await backend.leaveLobby();
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).toEqual({
      result: JoinResult.OK,
    });
  });

  it('should receives logged in room', () => {
    RoomData1.players = 1;

    const roomUpate = roomWatcher.mock.calls.find(([e]) => e === 'room:update');
    const mapUpate = roomWatcher.mock.calls.find(([e]) => e === 'maps:update');
    expect(roomUpate).toEqual(['room:update', RoomData1]);
    expect(filterMetadata(mapUpate[1])).toEqual(TestMap1);
  });

  it('should be able to update room title', async () => {
    const title = 'TestRoom1a';
    roomWatcher.mockClear();
    await backend.updateRoom('title', title);
    RoomData1.title = title;
  });

  it('should receives updated room title', () => {
    expect(roomWatcher).toBeCalledWith('room:update', RoomData1);
  });

  it('should be able to update room characterAttributes', async () => {
    const characterAttributes = ['HP', 'MP'];
    roomWatcher.mockClear();
    await backend.updateRoom('characterAttributes', characterAttributes);
    RoomData1.characterAttributes = characterAttributes;
  });

  it('should receives updated room characterAttributes', () => {
    expect(roomWatcher).toBeCalledWith('room:update', RoomData1);
  });

  it('should be able to update room password', async () => {
    roomWatcher.mockClear();
    await backend.updateRoomPassword('pass');

    RoomData1.isLocked = true;
    expect(roomWatcher).toBeCalledWith('room:update', RoomData1);
  });

  it('should be able to login without password', async () => {
    await backend.leaveRoom();
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).toEqual({
      result: JoinResult.OK,
    });
  });

  it('should be able to remove user from members', async () => {
    await backend.leaveRoomHard();
  });

  it('should requires password to login room', async () => {
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).toEqual({
      title: RoomData1.title,
      result: JoinResult.PasswordRequired,
    });
  });

  it('should checks password when logging in room', async () => {
    const result = await backend.joinRoom(roomId1, '1234', roomWatcher);
    expect(result).toEqual({
      title: RoomData1.title,
      result: JoinResult.IncorrectPassword,
    });
  });

  it('should be able to login with password', async () => {
    const result = await backend.joinRoom(roomId1, 'pass', roomWatcher);
    expect(result).toEqual({
      result: JoinResult.OK,
    });
  });

  it('should be able to leaveRoom', async () => {
    await backend.leaveRoom();
  });

  it('should be able to remove room', async () => {
    await backend.joinRoom(roomId1, null, roomWatcher);
    await backend.removeRoom({}, []);
  });
}

describe('Backend', () => {
  const Backend = require('./Backend').default;
  const BackendStrategy = require('./BackendStrategy').default;

  it('should reject abstract strategy', () => {
    expect(() => new Backend(new BackendStrategy())).toThrow();
  });
});
