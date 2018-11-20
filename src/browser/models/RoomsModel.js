import _ from 'lodash';
import Model from '@/browser/models/Model';
import { ListEvent } from '@/browser/models/ListModel';

export default class RoomsModel extends Model {
  constructor(backend) {
    super(backend, 'rooms');
  }

  async subscribe(callback: (string, Object) => void): Promise<() => Promise<void>> {
    const unsubscribers = await Promise.all(_(ListEvent).map(event => this.backend.subscribe(
      this.name,
      event,
      data => callback(event, data),
    )));

    return () => Promise.all(unsubscribers.map(async (unsubscriber) => {
      await unsubscriber();
    }));
  }

  async push(data: Object): Promise<string> {
    const id = await this.backend.push(this.name, data);
    return id;
  }
}
