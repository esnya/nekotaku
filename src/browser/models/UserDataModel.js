import ObjectModel from '@/browser/models/ObjectModel';

export default class UserDataModel extends ObjectModel {
  async update(roomId: string, data: Object): Promise<void> {
    const uid = await this.backend.getUID();
    await super.update(`${roomId}/${uid}`, data);
  }
}
