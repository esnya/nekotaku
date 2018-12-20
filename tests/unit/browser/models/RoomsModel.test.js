import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import RoomsModel from '@/browser/models/RoomsModel';
import * as ListEvent from '@/constants/ListEvent';
import { forEachBackend, removeRoom } from './utilities';

chai.use(sinonChai);

describe('RoomsModel', () => {
  forEachBackend((backend) => {
    let roomsModel;
    it('should be able to instantiate', () => {
      roomsModel = new RoomsModel(backend);
    });

    const callback = spy();
    it('should be able to subscribe', async () => {
      await roomsModel.subscribe(null, callback);
    });

    const now = Date.now();
    const title = `TestRoom-${now}`;
    let roomId;
    it('should be able to create new room without password', async () => {
      roomId = await roomsModel.push({
        title,
        dice: 'SwordWord',
        characterAttirbutes: ['HP', 'MP'],
      });

      expect(typeof roomId).to.equal('string');
    });

    it('shoud calls callback with ChildAdded', () => {
      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ListEvent.ChildAdded);
      expect(data.id).to.equal(roomId);
      expect(data.title).to.equal(title);
    });

    after(() => {
      removeRoom(backend, roomId);
    });
  });
});
