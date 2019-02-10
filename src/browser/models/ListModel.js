import _ from 'lodash';
import Model, { filter } from '@/browser/models/Model';
import * as ListEvent from '@/constants/ListEvent';

export default class ListModel extends Model {
  getChildPath(roomId: string, childId: string) {
    return `${this.getPath(roomId)}/${childId}`;
  }

  async subscribe(
    roomId: string,
    callback: (string, Object) => void,
  ): Promise<() => Promise<void>> {
    const unsubscribers = await Promise.all(_(ListEvent).map(event => this.backend.subscribe(
      this.getPath(roomId),
      event,
      data => callback(event, _.defaultsDeep(data, this.getDefault())),
    )));

    return () => Promise.all(unsubscribers.map(async (unsubscriber) => {
      await unsubscriber();
    }));
  }

  async push(roomId: string, data: {}): Promise<string> {
    const id = await this.backend.push(
      this.getPath(roomId),
      _.defaultsDeep(filter(data), this.getDefault()),
    );
    return id;
  }

  async update(roomId: string, childId: string, data: {}): Promise<void> {
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
