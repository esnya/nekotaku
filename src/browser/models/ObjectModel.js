import _ from 'lodash';
import Model, { filter } from '@/browser/models/Model';
import * as ObjectEvent from '@/constants/ObjectEvent';

export default class ObjectModel extends Model {
  async subscribe(
    roomId: string,
    callback: (string, Object) => void,
  ): Promise<() => Promise<void>> {
    const unsubscribe = await this.backend.subscribe(
      this.getPath(roomId),
      ObjectEvent.Value,
      value => callback(ObjectEvent.Value, _.defaultsDeep(value, this.getDefault())),
    );

    return unsubscribe;
  }

  async update(roomId: string, data: {}): Promise<void> {
    await this.backend.update(this.getPath(roomId), filter({
      ...data,
      updatedAt: Date.now(),
    }));
  }

  async remove(roomId: string): Promise<void> {
    await this.backend.remove(this.getPath(roomId));
  }
}
