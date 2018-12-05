import Model from '@/browser/models/Model';
import * as ObjectEvent from '@/constants/ObjectEvent';

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
    await this.backend.update(this.getPath(roomId), data);
  }

  async remove(roomId: string): Promise<void> {
    await this.backend.remove(this.getPath(roomId));
  }
}
