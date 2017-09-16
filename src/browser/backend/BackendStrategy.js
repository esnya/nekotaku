/* eslint no-unused-vars: off */

export type Handler = (event: string, data: Object | string) => void;

export default class BackendStrategy {
  constructor(config: Object) {
    this.type = config.type;
  }

  async watchLobby(handler: Handler): Promise<void> {
    throw new Error('Abstract method called');
  }
  async unwatchLobby(): Promise<void> {
    throw new Error('Abstract method called');
  }
  async watchRoom(roomId: string, handler: Handler): Promise<void> {
    throw new Error('Abstract method called');
  }
  async unwatchRoom(roomId: string) {
    throw new Error('Abstract method called');
  }
  async watchObject(type: string, roomId: string, handler: Handler): Promise<void> {
    throw new Error('Abstract method called');
  }
  async unwatchObject(type: string, roomId: string): Promise<void> {
    throw new Error('Abstract method called');
  }
  async watchList(type: string, roomId: string, handler: Handler): Promise<void> {
    throw new Error('Abstract method called');
  }
  async unwatchList(type: string, roomId: string): Promise<void> {
    throw new Error('Abstract method called');
  }

  async update(type: string, roomId: string, value: Object): Promise<void> {
    throw new Error('Abstract method called');
  }
  async remove(type: string, roomId: string): Promise<void> {
    throw new Error('Abstract method called');
  }
  async addChild(type: string, roomId: string, value: Object): Promise<string> {
    throw new Error('Abstract method called');
  }
  async changeChild(type: string, roomId: string, childId: string, value: Object): Promise<void> {
    throw new Error('Abstract method called');
  }
  async changeChildValue(
    type: string,
    roomId: string,
    childId: string,
    key: string,
    value: any,
  ): Promise<void> {
    throw new Error('Abstract method called');
  }
  async removeChild(type: string, roomId: string, chlidId: string): Promise<void> {
    throw new Error('Abstract method called');
  }

  async uploadFile(roomId: string, path: string, file: File): Promise<string> {
    throw new Error('Abstract method called');
  }
  async deleteFile(roomId: string, path: string) {
    throw new Error('Abstract method called');
  }

  async createRoom(room: Object): Promise<string> {
    throw new Error('Abstract method called');
  }
  async getRoom(roomId: string): Promise<?Object> {
    throw new Error('Abstract method called');
  }
  async updateRoom(roomId: string, value: Object): Promise<void> {
    throw new Error('Abstract method called');
  }
  async loginRoom(roomId: string, password: ?string): Promise<boolean> {
    throw new Error('Abstract method called');
  }
  async removeRoom(roomId: string): Promise<void> {
    throw new Error('Abstract method called');
  }

  async removeMe(roomId: string): Promise<void> {
    throw new Error('Abstract method called');
  }
}
