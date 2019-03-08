import mapValues from 'lodash/mapValues';
import ObjectDAO from './ObjectDAO';
import backend from '../backend';
import DataWithId from '@/models/DataWithId';
import Members from '@/models/Members';
import { MemberUpdate } from '@/models/Member';

export default class MemberDAO extends ObjectDAO<Members, MemberUpdate> {
  getName() {
    return 'members';
  }

  async getPath(): Promise<string> {
    const uid = await backend.getUID();
    return `${this.getName()}/${this.roomId}/${uid}`;
  }

  async getSubscribePath(): Promise<string> {
    return `${this.getName()}/${this.roomId}`;
  }

  reader(data: any): Members {
    return mapValues(data as { [uid: string]: DataWithId }, (member: {}) => ({
      name: 'ななしさん',
      color: '#000000',
      updatedAt: 0,
      ...member,
    }));
  }
}
