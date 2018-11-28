import UserDataModel from '@/browser/models/UserDataModel';

export default class MembersModel extends UserDataModel {
  constructor(backend) {
    super(backend, 'members');
  }

  async update(roomId: string, data: Object): Promise<void> {
    await super.update(roomId, {
      name: 'ななしさん',
      timestamp: Date.now(),
      ...data,
    });
  }
}
