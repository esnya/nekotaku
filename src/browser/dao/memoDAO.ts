import Memo, { MemoAdd, MemoUpdate } from '@/models/Memo';
import Model from '@/models/Model';
import RoomChildDAO from './RoomChildDAO';

export class MemoDAO extends RoomChildDAO<MemoAdd, MemoUpdate, Memo> {
  getCollectionName(): string {
    return 'memos';
  }

  read(value: Model): Memo {
    return value;
  }
}
export default new MemoDAO();
