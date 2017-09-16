import BackendStrategy, { Handler } from './BackendStrategy';
import * as JoinResult from './JoinResult';

const Lists = [
  'characters',
  'messages',
  'shapes',
];
const Objects = [
  'maps',
  'members',
];

function checkStrategy(strategy: BackendStrategy) {
  if (!(strategy instanceof BackendStrategy)) {
    throw new TypeError('strategy is not BackendStrategy');
  }

  (Object.getOwnPropertyNames(BackendStrategy.prototype))
    .filter(key => key !== 'constructor')
    .forEach((key) => {
      const method = BackendStrategy.prototype[key];
      if (strategy[key] === method) {
        throw new TypeError(`Abstract method "${key}" is not implemented`);
      }
    });
}

const DataKeys = {
  characters: 'characters',
  characterPortraitKey(key: string) {
    return `portrait/${key}/url`;
  },
  rooms: 'rooms',
  maps: 'maps',
  messages: 'messages',
};
const FileKeys = {
  mapBackgroundImage: 'map/background',
  characterIcon(id: string) {
    return `characters/${id}/icon`;
  },
  characterPortrait(id: string, face: string) {
    return `characters/${id}/portrait/${face}`;
  },
};

export default class Backend {
  constructor(strategy: BackendStrategy) {
    checkStrategy(strategy);
    this.strategy = strategy;
  }

  /* Utilities */
  enforceInRoom(): void {
    const { roomId } = this;

    if (!roomId) {
      throw new Error('Not joined room');
    }

    return roomId;
  }

  async update(type: string, value: Object): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.update(type, roomId, value);
  }
  async remove(type: string): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.remove(type, roomId);
  }
  async addChild(type: string, value: Object): Promise<string> {
    const roomId = this.enforceInRoom();
    const childId = await this.strategy.addChild(type, roomId, value);
    return childId;
  }
  async changeChild(type: string, childId: string, value: Object): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.changeChild(type, roomId, childId, value);
  }
  async changeChildValue(type: string, childId: string, key: string, value: any): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.changeChildValue(type, roomId, childId, key, value);
  }
  async removeChild(type: string, childId: string): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.removeChild(type, roomId, childId);
  }

  async uploadFile(path: string, file: File): Promise<string> {
    const roomId = this.enforceInRoom();
    const url = await this.strategy.uploadFile(roomId, path, file);
    return url;
  }
  async deleteFile(path: string): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.deleteFile(roomId, path);
  }

  async clearCharacterFiles(id: string): Promise<void> {
    await Promise.all([
      this.clearCharacterIcon(id),
      this.clearCharacterPortrait(id, 'default'),
    ]);
  }

  /* API Adapters */
  async joinLobby(handler: Handler): Promise<void> {
    await this.strategy.watchLobby(handler);
  }
  async leaveLobby(): Promise<void> {
    await this.strategy.unwatchLobby();
  }

  async joinRoom(
    roomId: string,
    password: ?string,
    handler: Handler,
  ): Promise<{ title: ?string, result: string }> {
    const roomData = await this.strategy.getRoom(roomId);
    if (!roomData) {
      return {
        result: JoinResult.NotFound,
      };
    }

    const loginResult = await this.strategy.loginRoom(roomId);
    if (!loginResult) {
      const {
        isLocked,
        title,
      } = roomData;
      if (isLocked && !password) {
        return {
          result: JoinResult.PasswordRequired,
          title,
        };
      }

      const passwordLoginResult = await this.strategy.loginRoom(roomId, password);
      if (!passwordLoginResult) {
        return {
          result: JoinResult.IncorrectPassword,
          title,
        };
      }
    }

    this.roomId = roomId;

    await this.strategy.watchRoom(roomId, handler);
    await Promise.all(Objects.map(type => this.strategy.watchObject(type, roomId, handler)));
    await Promise.all(Lists.map(type => this.strategy.watchList(type, roomId, handler)));

    return {
      result: JoinResult.OK,
    };
  }
  async leaveRoom(): Promise<void> {
    const roomId = this.enforceInRoom();

    Objects.forEach(type => this.strategy.unwatchObject(type, roomId));
    Lists.forEach(type => this.strategy.unwatchList(type, roomId));
    this.strategy.unwatchRoom(roomId);

    this.roomId = null;
  }
  async leaveRoomHard(): Promise<void> {
    const roomId = this.enforceInRoom();
    await this.strategy.removeMe(roomId);
    await this.leaveRoom();
  }

  async createRoom(room, map): Promise<string> {
    const roomId = await this.strategy.createRoom(room);

    await this.strategy.loginRoom(roomId, room.password);
    await this.strategy.update(DataKeys.maps, roomId, map);

    return roomId;
  }
  async removeRoom(map: { backgroundImage: ?string }, characters: { id: string }[]): Promise<void> {
    const roomId = await this.enforceInRoom();

    await Promise.all([
      this.deleteFile(FileKeys.mapBackgroundImage),
      Promise.all(characters.map(({ id }) => this.clearCharacterFiles(id))),
    ]);

    await Promise.all(
      [
        ...Lists,
        ...Objects,
      ].filter(type => type !== 'members').map(type => this.remove(type)),
    );

    await this.strategy.removeRoom(roomId);
  }
  async updateRoom(key, value): Promise<void> {
    const roomId = await this.enforceInRoom();
    await this.strategy.updateRoom(roomId, { [key]: value });
  }
  async clearRoomPassword(): Promise<void> {
    await this.updateRoomPassword(null);
  }
  async updateRoomPassword(password): Promise<void> {
    await this.updateRoom('password', password);
  }

  async updateMap(key, value): Promise<void> {
    await this.update(DataKeys.maps, { [key]: value });
  }
  async clearMapBackgroundImage(): Promise<void> {
    this.deleteFile(FileKeys.mapBackgroundImage);
    await this.update(DataKeys.maps, { backgroundImage: null });
  }
  async updateMapBackgroundImage(file): Promise<void> {
    const url = await this.uploadFile(FileKeys.mapBackgroundImage, file);
    await this.update(DataKeys.maps, { backgroundImage: url });
  }

  async sendMessage(message): Promise<string> {
    const id = await this.addChild(DataKeys.messages, message);
    return id;
  }

  async createCharacter(character): Promise<string> {
    const id = await this.addChild(DataKeys.characters, character);
    return id;
  }
  async updateCharacter(id, key, value): Promise<string> {
    await this.changeChild(DataKeys.characters, id, { [key]: value });
  }
  async removeCharacter(id): Promise<void> {
    await this.clearCharacterFiles(id);
    await this.removeChild(DataKeys.characters, id);
  }
  async moveCharacter(id, x, y, z): Promise<void> {
    await this.changeChild(DataKeys.characters, id, { x, y, z });
  }
  async clearCharacterIcon(id): Promise<void> {
    await this.deleteFile(FileKeys.characterIcon(id));
    await this.updateCharacter(id, 'icon', null);
  }
  async clearCharacterPortrait(id, key): Promise<void> {
    await this.deleteFile(FileKeys.characterPortrait(id, 'default'));
    await this.changeChildValue(DataKeys.characters, id, DataKeys.characterPortraitKey(key), null);
  }
  async updateCharacterIcon(id, file) {
    const url = await this.uploadFile(FileKeys.characterIcon(id), file);
    await this.updateCharacter(id, 'icon', url);
  }
  async updateCharacterPortrait(id, key, file) {
    const url = await this.uploadFile(FileKeys.characterPortrait(id, key), file);
    await this.changeChildValue(DataKeys.characters, id, DataKeys.characterPortraitKey(key), url);
  }

  async createShape(data) {
    const id = await this.addChild('shapes', data);
    return id;
  }
  async updateShape(id, data) {
    await this.changeChild('shapes', id, data);
  }
  async removeShape(id) {
    await this.removeChild('shapes', id);
  }
  async moveShape(id, x, y, z) {
    await this.updateShape(id, { x, y, z });
  }
}
