import UserDataModel from '@/browser/models/UserDataModel';

export default class MembersModel extends UserDataModel {
  constructor(backend) {
    super(backend, 'members');
  }
}
