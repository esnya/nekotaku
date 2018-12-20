import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import MapModel from '@/browser/models/MapModel';
import * as ObjectEvent from '@/constants/ObjectEvent';
import { forEachBackend, withRoom, sleep } from './utilities';

chai.use(sinonChai);

describe('MapModel', () => {
  forEachBackend((backend) => {
    let roomId;
    before(async () => {
      roomId = await withRoom(backend);
    });

    let model;
    it('should be able to instantiate', () => {
      model = new MapModel(backend);
    });

    const callback = spy();
    it('should be able to subscribe', async () => {
      await model.subscribe(roomId, callback);
      await sleep();
    });

    let map;
    it('should calls callback with value event', () => {
      expect(callback).to.have.called;

      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ObjectEvent.Value);
      expect(typeof data.width).to.equal('number');
      expect(typeof data.height).to.equal('number');

      map = data;
    });

    let newWidth;
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
