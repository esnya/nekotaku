import map from 'lodash/map';
import defaultsDeep from 'lodash/defaultsDeep';
import Model, { filter } from '@/browser/models/Model';
import * as ListEvent from '@/constants/ListEvent';

export default class ListModel extends Model {
  getChildPath(roomId: string, childId: string) {
    return `${this.getPath(roomId)}/${childId}`;
  }

  async subscribe(
    roomId: string | null,
    callback: (event: string, data: { id: string }) => void,
  ): Promise<() => Promise<void>> {
    const unsubscribers = await Promise.all(map(ListEvent, event => this.backend.subscribe(
      this.getPath(roomId),
      event,
      data => callback(event, defaultsDeep(data, this.getDefault())),
    )));

    return async () => {
      await Promise.all(unsubscribers.map(async (unsubscriber) => {
        await unsubscriber();
      }));
    };
  }

  async push(roomId: string | null, data: {}): Promise<string> {
    const id = await this.backend.push(
      this.getPath(roomId),
      defaultsDeep(filter(data), this.getDefault()),
    );
    return id;
  }

  async update(roomId: string, childId: string, data: {} | null): Promise<void> {
    await this.backend.update(
      this.getChildPath(roomId, childId),
      filter(data),
    );
  }

  async remove(roomId: string, childId: string): Promise<void> {
    await this.backend.remove(this.getChildPath(roomId, childId));
  }

  async removeAll(roomId: string): Promise<void> {
    await this.backend.remove(this.getPath(roomId));
  }
}
