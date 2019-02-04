import _ from 'lodash';
import UserDataModel from '@/browser/models/UserDataModel';

export default class ChatPaletts extends UserDataModel {
  constructor(backend) {
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
    roomId: string,
    callback: (string, Object) => void,
  ): Promise<() => Promise<void>> {
    const uid = await this.backend.getUID();
    const unsubscribe = await super.subscribe(
      roomId,
      (event: string, value: Object) => callback(
        event,
        ((value && value[uid] && Array.isArray(value[uid].paletts)) ? value[uid].paletts : [])
          .map(i => _.defaultsDeep(i, this.getItemDefault())),
      ),
    );
    return unsubscribe;
  }

  async update(roomId: string, data: Array): Promise<void> {
    await super.update(roomId, {
      paletts: data,
    });
  }
}
