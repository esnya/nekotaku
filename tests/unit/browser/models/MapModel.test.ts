import { spy } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import * as ObjectEvent from '@/constants/ObjectEvent';
import { forEachBackend, sleep, withRoom } from './utilities';
import Backend from '@/browser/backend/Backend';
import MapModel from '@/browser/models/MapModel';

chai.use(sinonChai);

describe('MapModel', () => {
  forEachBackend((backend: Backend) => {
    let roomId: string;
    before(async () => {
      roomId = await withRoom(backend);
    });

    let model: MapModel;
    it('should be able to instantiate', () => {
      model = new MapModel(backend);
    });

    const callback = spy();
    it('should be able to subscribe', async () => {
      await model.subscribe(roomId, callback);
      await sleep();
    });

    let map: any;
    it('should calls callback with value event', () => {
      expect(callback).to.have.called;

      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ObjectEvent.Value);
      expect(typeof data.width).to.equal('number');
      expect(typeof data.height).to.equal('number');

      map = data;
    });

    let newWidth: number;
    it('should be able to update', async () => {
      newWidth = map.width + 1;
      await model.update(roomId, {
        width: newWidth,
      });
      await sleep();
    });

    it('should calls callback with value event', () => {
      expect(callback).to.have.called;

      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ObjectEvent.Value);
      expect(data.width).to.equal(newWidth);
    });

    it('should be able to remove', async () => {
      await model.remove(roomId);
    });
  });
});
