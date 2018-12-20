import ListModel from '@/browser/models/ListModel';
import MapModel from '@/browser/models/MapModel';
import MembersModel from '@/browser/models/MembersModel';
import PasswordsModel from '@/browser/models/PasswordsModel';

export default class RoomsModel extends ListModel {
  constructor(backend) {
    super(backend, 'rooms');
  }

  getPath(): string {
    return this.name;
  }

  async push(data: Object): Promise<string> {
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
