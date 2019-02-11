import PrivateDataDAO from './PrivateDataDAO';
import { DataType } from './DAO';

interface Password {
  password?: string | null;
}

export default class PasswordDAO extends PrivateDataDAO<Password, Password> {
  getName(): string {
    return 'passwords';
  }

  reader(data: DataType): Password {
    return {
      password: null,
      ...data,
    };
  }
}
