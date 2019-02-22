import Message, { MessageAdd } from '@/models/Message';
import Model from '@/models/Model';
import RoomChildDAO from './RoomChildDAO';
import backend from '../backend';

export class MessageDAO extends RoomChildDAO<MessageAdd, void, Message> {
  getCollectionName(): string {
    return 'messages';
  }

  read(value: Model): Message {
    return {
      body: [],
      channel: 'メイン',
      color: '#000000',
      name: 'ななしさん',
      ...value,
    };
  }
}
export default new MessageDAO(backend);
