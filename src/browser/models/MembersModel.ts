import Backend from '@/browser/backend/Backend';
import UserDataModel from '@/browser/models/UserDataModel';

export default class MembersModel extends UserDataModel {
  constructor(backend: Backend) {
    super(backend, 'members');
  }

  // eslint-disable-next-line class-methods-use-this
  getDefault() {
    return {
      name: 'ななしさん',
      timestamp: Date.now(),
    };
  }
}
