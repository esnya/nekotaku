import RoomPrivateChildDAO from './RoomPrivateChildDAO';
import ChatName, { ChatNameAdd, ChatNameUpdate } from '@/models/ChatName';
import Model from '@/models/Model';
import backend from '../backend';

export class ChatNameDAO
  extends RoomPrivateChildDAO<ChatNameAdd, ChatNameUpdate, ChatName> {
  getCollectionName(): string {
    return 'chat-names';
  }

  read(value: Model): ChatName {
    return {
      name: 'ななしさん',
      color: '#000000',
      ...value,
    };
  }
}
export default new ChatNameDAO(backend);
