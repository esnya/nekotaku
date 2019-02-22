import ListDAO from '@/browser/dao/ListDAO';
import ListItemDataType from '@/models/ListItemDataType';

export interface BodyNode {
  type: string;
  text: string;
}

export interface Message extends ListItemDataType {
  body: BodyNode[];
  channel: string;
  color: string;
  face: string;
  name: string;
  to?: string[] | null;
}

interface AddData {
  body: BodyNode[];
  channel: string;
  color: string;
  face: string;
  name: string;
  to?: string[] | null;
}

export type ItemKey = string;

export default class MessagesDAO extends ListDAO<Message, AddData, void, ItemKey> {
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
