import { spy } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import * as ObjectEvent from '@/constants/ObjectEvent';
import { forEachBackend, sleep, withRoom } from './utilities';
import Backend from '@/browser/backend/Backend';
import RoomModel from '@/browser/models/RoomModel';

chai.use(sinonChai);

describe('RoomModel', () => {
  forEachBackend((backend: Backend) => {
    let roomId: string;
    before(async () => {
      roomId = await withRoom(backend);
    });

    let roomModel: RoomModel;
    it('should be able to instantiate', () => {
      roomModel = new RoomModel(backend);
    });

    const callback = spy();
    it('should be able to subscribe', async () => {
      await roomModel.subscribe(roomId, callback);
      await sleep();
    });

    let room: any;
    it('should calls callback with value event', () => {
      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ObjectEvent.Value);
      expect(data.id).to.equal(roomId);

      room = data;
    });

    let newTitle: string;
    it('should be able to update', async () => {
      newTitle = `${room.title}-1`;
      await roomModel.update(roomId, {
        title: newTitle,
      });
      await sleep();
    });

    it('should calls callback with value event', () => {
      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ObjectEvent.Value);
      expect(data.id).to.equal(roomId);
      expect(data.title).to.equal(newTitle);
    });

    it('should be able to remove', async () => {
      await roomModel.remove(roomId);
    });
  });
});
