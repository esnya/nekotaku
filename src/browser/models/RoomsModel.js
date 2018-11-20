import ListModel from '@/browser/models/ListModel';

export default class RoomsModel extends ListModel {
  constructor(backend) {
    super(backend, 'rooms');
  }

  getPath(): string {
    return this.name;
  }

  async push(data: Object): Promise<string> {
    const id = await super.push(null, data);
    return id;
  }
}
