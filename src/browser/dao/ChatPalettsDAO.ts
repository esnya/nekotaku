import { DataWithId } from './DAO';
import ObjectDAO from './ObjectDAO';
import PrivateDataDAO from './PrivateDataDAO';

export interface ChatPalette {
  title: string;
  items: string[];
}

export interface ChatPaletts {
  paletts: ChatPalette[]
}

export default class ChatPalettsDAO extends PrivateDataDAO<ChatPaletts, ChatPaletts> {
  getName(): string {
    return 'chat-paletts';
  }

  reader(data: DataWithId): ChatPaletts {
    const castedData: {
      paletts?: any,
    } = data as any;
    return {
      ...ObjectDAO.reader(data),
      ...data,
      paletts: castedData.paletts && Array.isArray(castedData.paletts)
        ? castedData.paletts.map(palette => ({
          title: 'チャットパレット',
          items: [],
          ...palette,
        }))
        : [],
    };
  }
}
