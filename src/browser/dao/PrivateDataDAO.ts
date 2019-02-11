import ObjectDAO from './ObjectDAO';
import backend from '../backend';

export default abstract class PrivateDataDAO<Data, UpdateData> extends ObjectDAO<Data, UpdateData> {
  async getPath(): Promise<string> {
    const uid = backend.getUID();
    return `${this.getName()}/${this.roomId}/${uid}`;
  }
}
