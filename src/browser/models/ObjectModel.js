import Model from '@/browser/models/Model';

export const ObjectEvent = {
  Value: 'value',
};

export default class ObjectModel extends Model {
  async subscribe(
    roomId: string,
    callback: (string, Object) => void,
  ): Promise<() => Promise<void>> {
    const unsubscribe = await this.backend.subscribe(
      this.getPath(roomId),
      ObjectEvent.Value,
      value => callback(ObjectEvent.Value, value),
    );

    return unsubscribe;
  }

  async update(roomId: string, data: Object): Promise<void> {
    await this.backend.update2(this.getPath(roomId), data);
  }
}
