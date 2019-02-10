import Backend from '@/browser/backend/Backend';
import UserDataModel from '@/browser/models/UserDataModel';

export default class PasswordsModel extends UserDataModel {
  constructor(backend: Backend) {
    super(backend, 'passwords');
  }

  async update(roomId: string, password: string): Promise<void> {
    await super.update(roomId, { password });
  }
}
