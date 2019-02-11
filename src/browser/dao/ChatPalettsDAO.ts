import PrivateDataDAO from './PrivateDataDAO';
import { DataType } from './DAO';

interface ChatPalette {
  title: string;
  items: string[];
}

interface ChatPaletts {
  paletts: ChatPalette[]
}

export default class ChatPalettsDAO extends PrivateDataDAO<ChatPaletts, ChatPaletts> {
  getName(): string {
    return 'chat-paletts';
  }

  reader(data: DataType): ChatPaletts {
    return {
      ...data,
      paletts: [],
    };
  }
}
