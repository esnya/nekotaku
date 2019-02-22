import Password, { PasswordUpdate } from '@/models/Password';
import Model from '@/models/Model';
import UserDataDAO from './UserDataDAO';

export class PasswordDAO extends UserDataDAO<PasswordUpdate, Password> {
  getCollectionName(): string {
    return 'passwords';
  }

  read(value: Model): Password {
    return value;
  }
}
export default new PasswordDAO();
