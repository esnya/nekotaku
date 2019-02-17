import defaultsDeep from 'lodash/defaultsDeep';
import UserDataModel from '@/browser/models/UserDataModel';
import Backend from '../backend/Backend';

export default class ChatPaletts extends UserDataModel {
  constructor(backend: Backend) {
    super(backend, 'chat-paletts');
  }

  // eslint-disable-next-line class-methods-use-this
  getItemDefault() {
    return {
      name: 'チャットパレット',
      items: [],
    };
  }

  async subscribe(
    roomId: string | null,
    callback: (event: string, data: { id: string, paletts: {}[] }) => void,
  ): Promise<() => Promise<void>> {
    const uid = await this.backend.getUID();
    const unsubscribe = await super.subscribe(
      roomId,
      (event: string, data: {}) => {
        const castedData = data as { [uid: string]: { paletts: [] } } | null;
        const paletts = (castedData && castedData[uid] && Array.isArray(castedData[uid].paletts))
          ? castedData[uid].paletts
          : [];
        callback(
          event,
          {
            id: uid,
            paletts: paletts.map(palette => defaultsDeep(palette, this.getItemDefault())),
          },
        );
      },
    );
    return unsubscribe;
  }
}
