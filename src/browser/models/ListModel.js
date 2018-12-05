import _ from 'lodash';
import Model from '@/browser/models/Model';

export const ListEvent = {
  ChildAdded: 'child_added',
  ChildChanged: 'child_changed',
  ChildRemoved: 'child_removed',
};

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
      data => callback(event, data),
    )));

    return () => Promise.all(unsubscribers.map(async (unsubscriber) => {
      await unsubscriber();
    }));
  }

  async push(roomId: string, data: Object): Promise<string> {
    const id = await this.backend.push(this.getPath(roomId), data);
    return id;
  }

  async update(roomId: string, childId: string, data: Object): Promise<void> {
    await this.backend.update(this.getChildPath(roomId, childId), data);
  }

  async remove(roomId: string, childId: string): Promise<void> {
    await this.backend.remove(this.getChildPath(roomId, childId));
  }

  async removeAll(roomId: string): Promise<void> {
    await this.backend.remove(this.getPath(roomId));
  }
}
