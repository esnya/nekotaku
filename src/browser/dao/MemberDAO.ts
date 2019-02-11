import mapValues from 'lodash/mapValues';
import ObjectDAO from './ObjectDAO';
import backend from '../backend';
import { DataType } from './DAO';

interface Member {
  name: string;
  color: string;
  timestamp: number;
}
type Members = { [uid: string]: Member };

export default class MemberDAO extends ObjectDAO<Members, Member> {
  getName() {
    return 'members';
  }

  async getPath(): Promise<string> {
    const uid = backend.getUID();
    return `${this.getName()}/${this.roomId}/${uid}`;
  }

  async getSubscribePath(): Promise<string> {
    return `${this.getName()}/${this.roomId}`;
  }

  reader(data: DataType): Members {
    return mapValues(data, (member: {}) => ({
      name: 'ななしさん',
      color: '#000000',
      timestamp: 0,
      ...member,
    }));
  }
}
