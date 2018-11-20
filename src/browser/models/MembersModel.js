import ObjectModel from '@/browser/models/ObjectModel';

export default class MembersModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'members');
  }

  async update(roomId: string, data: Object): Promise<void> {
    const uid = await this.backend.getUID();
    await super.update(roomId, { [uid]: data });
  }
}
