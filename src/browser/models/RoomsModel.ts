import Backend from '@/browser/backend/Backend';
import ListModel from '@/browser/models/ListModel';
import MapModel from '@/browser/models/MapModel';
import MembersModel from '@/browser/models/MembersModel';
import PasswordsModel from '@/browser/models/PasswordsModel';

interface RoomPushData {
  title: string;
  dice: string;
  characterAttirbutes: string[];
  password?: string | null;
}

export default class RoomsModel extends ListModel {
  constructor(backend: Backend) {
    super(backend, 'rooms');
  }

  // eslint-disable-next-line class-methods-use-this
  getDefault() {
    return {
      title: null,
      dice: null,
      createdAt: Date.now(),
    };
  }

  getPath(): string {
    return this.name;
  }

  async push(roomId: null, data: RoomPushData): Promise<string> {
    const {
      password,
    } = data;

    const id = await super.push(null, data);

    if (password) {
      const passwordsModel = new PasswordsModel(this.backend);
      await passwordsModel.update(id, password);
    }

    const membersModel = new MembersModel(this.backend);
    await membersModel.update(id, {});

    const mapModel = new MapModel(this.backend);
    await mapModel.update(id, {});

    return id;
  }
}
