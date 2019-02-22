import Member, { MemberUpdate } from '@/models/Member';
import Model from '@/models/Model';
import UserDataDAO from './UserDataDAO';
import backend from '../backend';

export class MemberDAO extends UserDataDAO<MemberUpdate, Member> {
  getCollectionName(): string {
    return 'members';
  }

  read(value: Model): Member {
    return {
      name: 'ななしさん',
      color: '#000000',
      ...value,
    };
  }
}
export default new MemberDAO(backend);
