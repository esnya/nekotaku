import RoomPrivateChildDAO from './RoomPrivateChildDAO';
import ChatName, { ChatNameAdd, ChatNameUpdate } from '@/models/ChatName';
import Model from '@/models/Model';

export class ChatNameDAO
  extends RoomPrivateChildDAO<ChatNameAdd, ChatNameUpdate, ChatName> {
  getCollectionName(): string {
    return 'chat-name';
  }

  read(value: Model): ChatName {
    return {
      name: 'ななしさん',
      color: '#000000',
      ...value,
    };
  }
}
export default new ChatNameDAO();
