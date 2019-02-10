import UserDataModel from '@/browser/models/UserDataModel';

export default class PasswordsModel extends UserDataModel {
  constructor(backend) {
    super(backend, 'passwords');
  }

  async update(roomId: string, password: string): Promise<void> {
    await super.update(roomId, { password });
  }
}
