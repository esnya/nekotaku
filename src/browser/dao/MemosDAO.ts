import ListDAO from '@/browser/dao/ListDAO';
import ListItemDataType from '@/models/ListItemDataType';

export interface Memo extends ListItemDataType {
  back?: string | null;
  tfront?: string | null;
  title?: string | null;
}

interface AddData {
  back?: string | null;
  tfront?: string | null;
  title?: string | null;
}

interface UpdateData {
  back?: string | null;
  tfront?: string | null;
  title?: string | null;
}

type ItemKey = string;

export default class MemosDAO extends ListDAO<Memo, AddData, UpdateData, ItemKey> {
  getName(): string {
    return 'memos';
  }

  keyToString(key: ItemKey): string {
    return key;
  }

  reader(data: { id: string }): Memo {
    return ListDAO.reader(data);
  }
}
