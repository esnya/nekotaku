import defaultsDeep from 'lodash/defaultsDeep';
import Model, { filter } from '@/browser/models/Model';
import * as ObjectEvent from '@/constants/ObjectEvent';

export default class ObjectModel extends Model {
  async subscribe(
    roomId: string | null,
    callback: (event: string, data: { id: string }) => void,
  ): Promise<() => Promise<void>> {
    const unsubscribe = await this.backend.subscribe(
      this.getPath(roomId),
      ObjectEvent.Value,
      value => callback(ObjectEvent.Value, defaultsDeep(value, this.getDefault())),
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
