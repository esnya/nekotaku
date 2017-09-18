export function runBackendTests(Stragtegy) {
  URL.createObjectURL = jest.fn();
  URL.revokeObjectURL = jest.fn();
  const now = Date.now();
  Date.now = jest.fn().mockReturnValue(now);

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
    expect(roomUpate[1]).toEqual(RoomData1);
    expect(mapUpate[1]).toEqual(TestMap1);
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

  it('should be able to update map', async () => {
    roomWatcher.mockClear();
    const width = 25;
    await backend.updateMap('width', width);
    TestMap1.width = width;
  });

  it('should receives updated map', async () => {
    expect(roomWatcher).toBeCalledWith('maps:update', TestMap1);
  });

  const Message1 = {
    body: [
      { type: 'text', text: 'Test Message' },
    ],
    name: 'tester',
  };
  it('should be able to send message', async () => {
    roomWatcher.mockClear();
    Message1.id = await backend.sendMessage(Message1);
    expect(Message1.id).toBeDefined();
  });

  it('should receives sent message', () => {
    expect(roomWatcher).toBeCalledWith('messages:add', Message1);
  });

  const Character1 = {
    name: 'char1',
    initiative: 0,
    attributes: ['10', '2'],
  };
  it('should be able to create character', async () => {
    roomWatcher.mockClear();
    Character1.id = await backend.createCharacter(Character1);
    expect(Character1.id).toBeDefined();
  });

  it('should receives created character', () => {
    expect(roomWatcher).toBeCalledWith('characters:add', Character1);
  });

  it('should be able to update character', async () => {
    roomWatcher.mockClear();
    const name = 'char1a';
    await backend.updateCharacter(Character1.id, 'name', name);
    Character1.name = name;
  });

  it('should receives updated character', () => {
    expect(roomWatcher).toBeCalledWith('characters:change', Character1);
  });

  it('should be able to remove character', async () => {
    roomWatcher.mockClear();
    await backend.removeCharacter(Character1.id);
  });

  it('should receives character removal', () => {
    const call = roomWatcher.mock.calls.find(([event]) => event === 'characters:remove');
    expect(call[1].id).toEqual(Character1.id);
  });

  const Shape1 = {
    type: 'circle',
    x: 0,
    y: 1,
    radius: 10,
  };
  it('should be able to create shape', async () => {
    roomWatcher.mockClear();
    Shape1.id = await backend.createShape(Shape1);
    expect(Shape1.id).toBeDefined();
  });

  it('should receives created shape', () => {
    expect(roomWatcher).toBeCalledWith('shapes:add', Shape1);
  });

  it('should be able to update shape', async () => {
    roomWatcher.mockClear();
    await backend.moveShape(Shape1.id, 1, 2, 3);
    Shape1.x = 1;
    Shape1.y = 2;
    Shape1.z = 3;
  });

  it('should receives updated shape', () => {
    expect(roomWatcher).toBeCalledWith('shapes:change', Shape1);
  });

  it('should be able to remove shape', async () => {
    roomWatcher.mockClear();
    await backend.removeShape(Shape1.id);
  });

  it('should receives shape removal', () => {
    const call = roomWatcher.mock.calls.find(([event]) => event === 'shapes:remove');
    expect(call[1].id).toEqual(Shape1.id);
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
