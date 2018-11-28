import UserDataModel from '@/browser/models/UserDataModel';

export default class PasswordsModel extends UserDataModel {
  constructor(backend) {
    super(backend, 'passwords');
  }
}
