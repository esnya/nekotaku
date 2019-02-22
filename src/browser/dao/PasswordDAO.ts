import PrivateDataDAO from './PrivateDataDAO';
import DataWithId from '@/types/data/DataWithId';

export interface Password {
  password?: string | null;
}

export default class PasswordDAO extends PrivateDataDAO<Password, Password> {
  getName(): string {
    return 'passwords';
  }

  reader(data: DataWithId): Password {
    return {
      password: null,
      ...data,
    };
  }
}
