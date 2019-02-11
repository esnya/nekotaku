import ListDAO, { ListItemDataType } from '@/browser/dao/ListDAO';

interface BodyNode {
  type: string;
  text: string;
}

interface Message extends ListItemDataType {
  body: BodyNode[];
  channel: string;
  color: string;
  face: string;
  name: string;
  to?: string[] | null;
}

interface AddData {
}

interface UpdateData {
}

type ItemKey = string;

export default class MessagesDAO extends ListDAO<Message, AddData, UpdateData, ItemKey> {
  getName(): string {
    return 'messages';
  }

  keyToString(key: ItemKey): string {
    return key;
  }

  reader(data: { id: string }): Message {
    return {
      body: [],
      channel: 'メイン',
      color: '#000000',
      face: 'default',
      name: 'ななしさん',
      ...ListDAO.reader(data),
    };
  }
}
