import ObjectModel from '@/browser/models/ObjectModel';

export default class MapModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'maps');
  }

  async update(roomId: string, data: Object): Promise<void> {
    await super.update(roomId, {
      width: 10,
      height: 10,
      ...data,
    });
  }
}
