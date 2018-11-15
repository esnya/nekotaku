import { expect } from 'chai';
import { fake } from 'sinon';

export default function runBackendTests(Stragtegy, config = {}) {
  URL.createObjectURL = fake.returns('/');
  URL.revokeObjectURL = fake();
  const now = Date.now();
  Date.now = fake.returns(now);

  let backend;
  const JoinResult = require('@/browser/backend/JoinResult');
  it('should be able to instantiate', () => {
    const Backend = require('@/browser/backend/Backend').default;
    const strategy = new Stragtegy(config);
    backend = new Backend(strategy);
  });

  let uid;
  it('should be able to get UID', async () => {
    uid = await backend.getUID();
    expect(uid).to.exist;
  });

  const lobbyWatcher = fake();
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
    lobbyWatcher.resetHistory();
    roomId1 = await backend.createRoom(TestRoom1, TestMap1);

    expect(roomId1).to.exist;
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
    const roomsAdd = lobbyWatcher.getCalls().find(({ args }) => args[0] === 'rooms:add').args;
    expect(roomsAdd[1]).to.deep.equal(RoomData1);
  });

  const roomWatcher = fake();
  it('should be able to login craeted room', async () => {
    await backend.leaveLobby();
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).to.deep.equal({
      result: JoinResult.OK,
    });
  });
  it('should receives logged in room', () => {
    RoomData1.players = 1;

    const roomUpate = roomWatcher.getCalls().find(({ args }) => args[0] === 'room:update').args;
    const mapUpate = roomWatcher.getCalls().find(({ args }) => args[0] === 'maps:update').args;
    expect(roomUpate).to.deep.equal(['room:update', RoomData1]);
    expect(mapUpate).to.deep.equal(['maps:update', TestMap1]);
  });

  it('should be able to update room title', async () => {
    const title = 'TestRoom1a';
    roomWatcher.resetHistory();
    await backend.updateRoom('title', title);
    RoomData1.title = title;
  });
  it('should receives updated room title', () => {
    expect(roomWatcher.calledWith('room:update', RoomData1)).to.be.true;
  });

  it('should be able to update room characterAttributes', async () => {
    const characterAttributes = ['HP', 'MP'];
    roomWatcher.resetHistory();
    await backend.updateRoom('characterAttributes', characterAttributes);
    RoomData1.characterAttributes = characterAttributes;
  });
  it('should receives updated room characterAttributes', () => {
    expect(roomWatcher.calledWith('room:update', RoomData1)).to.be.true;
  });

  it('should be able to update room password', async () => {
    roomWatcher.resetHistory();
    await backend.updateRoomPassword('pass');

    RoomData1.isLocked = true;
    expect(roomWatcher.calledWith('room:update', RoomData1)).to.be.true;
  });

  it('should be able to login without password', async () => {
    await backend.leaveRoom();
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).to.deep.equal({
      result: JoinResult.OK,
    });
  });
  it('should be able to remove user from members', async () => {
    await backend.leaveRoomHard();
  });
  it('should requires password to login room', async () => {
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).to.deep.equal({
      title: RoomData1.title,
      result: JoinResult.PasswordRequired,
    });
  });
  it('should checks password when logging in room', async () => {
    const result = await backend.joinRoom(roomId1, '1234', roomWatcher);
    expect(result).to.deep.equal({
      title: RoomData1.title,
      result: JoinResult.IncorrectPassword,
    });
  });
  it('should be able to login with password', async () => {
    const result = await backend.joinRoom(roomId1, 'pass', roomWatcher);
    expect(result).to.deep.equal({
      result: JoinResult.OK,
    });
  });

  it('should be able to clear password', async () => {
    roomWatcher.resetHistory();
    await backend.clearRoomPassword(roomId1);
  });
  it('should receives cleared room password', () => {
    RoomData1.isLocked = false;
    expect(roomWatcher.calledWith('room:update', RoomData1)).to.be.true;
  });

  it('should be able to update map', async () => {
    roomWatcher.resetHistory();
    const width = 25;
    await backend.updateMap('width', width);
    TestMap1.width = width;
  });
  it('should receives updated map', async () => {
    expect(roomWatcher.calledWith('maps:update', TestMap1)).to.be.true;
  });

  it('should be able to upload map background image', async () => {
    roomWatcher.resetHistory();
    await backend.updateMapBackgroundImage(new File([], 'image.png'));
  });
  it('should receives updated map', async () => {
    const [event, value] = roomWatcher.getCall(0).args;
    expect(event).to.equal('maps:update');
    expect(value.backgroundImage).to.exist;
  });

  it('should be able to clear map background image', async () => {
    roomWatcher.resetHistory();
    await backend.clearMapBackgroundImage();
  });
  it('should receives updated map', async () => {
    const [event, value] = roomWatcher.getCall(0).args;
    expect(event).to.equal('maps:update');
    expect(value.backgroundImage).to.not.exist;
  });

  const Message1 = {
    body: [
      { type: 'text', text: 'Test Message' },
    ],
    name: 'tester',
  };
  it('should be able to send message', async () => {
    roomWatcher.resetHistory();
    Message1.id = await backend.sendMessage(Message1);
    expect(Message1.id).to.exist;
  });
  it('should receives sent message', () => {
    expect(roomWatcher.calledWith('messages:add', Message1)).to.be.true;
  });

  const Character1 = {
    name: 'char1',
    initiative: 0,
    attributes: ['10', '2'],
  };
  it('should be able to create character', async () => {
    roomWatcher.resetHistory();
    Character1.id = await backend.createCharacter(Character1);
    expect(Character1.id).to.exist;
  });
  it('should receives created character', () => {
    expect(roomWatcher.calledWith('characters:add', Character1)).to.be.true;
  });

  it('should be able to update character', async () => {
    roomWatcher.resetHistory();
    const name = 'char1a';
    await backend.updateCharacter(Character1.id, 'name', name);
    Character1.name = name;
  });
  it('should receives updated character', () => {
    expect(roomWatcher.calledWith('characters:change', Character1)).to.be.true;
  });

  it('should be able to move character', async () => {
    roomWatcher.resetHistory();
    await backend.moveCharacter(Character1.id, 1, 2, 3);
    Character1.x = 1;
    Character1.y = 2;
    Character1.z = 3;
  });
  it('should receives moved character', () => {
    expect(roomWatcher.calledWith('characters:change', Character1)).to.be.true;
  });

  it('should be able to upload character icon', async () => {
    roomWatcher.resetHistory();
    await backend.updateCharacterIcon(Character1.id, new File([], 'image.png'));
  });
  it('should receives updated character icon', () => {
    const [event, value] = roomWatcher.getCall(0).args;
    expect(event).to.equal('characters:change');
    expect(value.icon).to.exist;
  });

  it('should be able to clear character icon', async () => {
    roomWatcher.resetHistory();
    await backend.clearCharacterIcon(Character1.id);
  });
  it('should receives updated character icon', () => {
    const [event, value] = roomWatcher.getCall(0).args;
    expect(event).to.equal('characters:change');
    expect(value.icon).to.not.exist;
  });

  it('should be able to upload character portrait', async () => {
    roomWatcher.resetHistory();
    await backend.updateCharacterPortrait(Character1.id, 'default', new File([], 'image.png'));
  });
  it('should receives updated character portrait', () => {
    const [event, value] = roomWatcher.getCall(0).args;
    expect(event).to.equal('characters:change');
    expect(value.portrait.default.url).to.exist;
  });

  it('should be able to upload character portrait', async () => {
    roomWatcher.resetHistory();
    await backend.clearCharacterPortrait(Character1.id, 'default');
  });
  it('should receives updated character portrait', () => {
    const [event, value] = roomWatcher.getCall(0).args;
    expect(event).to.equal('characters:change');
    expect(value.portrait && value.portrait.default && value.portrait.default.url).to.not.exist;
  });

  it('should be able to remove character', async () => {
    roomWatcher.resetHistory();
    await backend.removeCharacter(Character1.id);
  });
  it('should receives character removal', () => {
    const call = roomWatcher.getCalls().find(({ args }) => args[0] === 'characters:remove').args;
    expect(call).to.exist;
    expect(call[1].id).to.equal(Character1.id);
  });

  const Shape1 = {
    type: 'circle',
    x: 0,
    y: 1,
    radius: 10,
  };
  it('should be able to create shape', async () => {
    roomWatcher.resetHistory();
    Shape1.id = await backend.createShape(Shape1);
    expect(Shape1.id).to.exist;
  });

  it('should receives created shape', () => {
    expect(roomWatcher.calledWith('shapes:add', Shape1)).to.be.true;
  });

  it('should be able to update shape', async () => {
    roomWatcher.resetHistory();
    await backend.moveShape(Shape1.id, 1, 2, 3);
    Shape1.x = 1;
    Shape1.y = 2;
    Shape1.z = 3;
  });

  it('should receives updated shape', () => {
    expect(roomWatcher.calledWith('shapes:change', Shape1)).to.be.true;
  });

  it('should be able to remove shape', async () => {
    roomWatcher.resetHistory();
    await backend.removeShape(Shape1.id);
  });

  it('should receives shape removal', () => {
    const call = roomWatcher.getCalls().find(({ args }) => args[0] === 'shapes:remove').args;
    expect(call).to.exist;
    expect(call[1].id).to.equal(Shape1.id);
  });

  it('should be able to leaveRoom', async () => {
    await backend.leaveRoom();
  });

  it('should be able to remove room', async () => {
    await backend.joinRoom(roomId1, null, roomWatcher);
    await backend.removeRoom({}, []);
  });

  it('should respond NotFound when joined to unexists room', async () => {
    const result = await backend.joinRoom(roomId1, null, roomWatcher);
    expect(result).to.deep.equal({
      result: JoinResult.NotFound,
    });
  });
}

describe('Backend', () => {
  const Backend = require('@/browser/backend/Backend').default;
  const BackendStrategy = require('@/browser/backend/BackendStrategy').default;

  it('should reject abstract strategy', () => {
    const strategy = new BackendStrategy({ backend: { type: 'abstract' } });
    expect(() => new Backend(strategy)).to.throw();
  });
  it('should reject non strategy object', () => {
    expect(() => new Backend({})).to.throw();
  });
});
