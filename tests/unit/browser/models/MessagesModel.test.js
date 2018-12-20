import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import MessagesModel from '@/browser/models/MessagesModel';
import * as ListEvent from '@/constants/ListEvent';
import { forEachBackend, withRoom, sleep } from './utilities';

chai.use(sinonChai);

describe('MessagesModel', () => {
  forEachBackend((backend) => {
    let roomId;
    before(async () => {
      roomId = await withRoom(backend);
    });

    let model;
    it('should be able to instantiate', () => {
      model = new MessagesModel(backend);
    });

    const callback = spy();
    it('should be able to subscribe', async () => {
      await model.subscribe(roomId, callback);
    });

    it('should be able to push', async () => {
      await model.push(roomId, {
        name: 'Test-Name',
        body: '2d6\ntest',
      });
      await sleep();
    });

    it('should calls callback with child added event', () => {
      expect(callback).to.have.called;

      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ListEvent.ChildAdded);
      expect(Array.isArray(data.body)).to.be.true;
      expect(data.body[0]).to.deep.equal({ type: 'text', text: '2d6' });
      expect(data.body[1]).to.deep.equal({ type: 'text', text: 'test' });
      expect(typeof data.createdAt).to.equal('number');
    });
  });
});
