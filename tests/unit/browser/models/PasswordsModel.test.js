import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import MembersModel from '@/browser/models/MembersModel';
import RoomModel from '@/browser/models/RoomModel';
import PasswordsModel from '@/browser/models/PasswordsModel';
import * as ObjectEvent from '@/constants/ObjectEvent';
import { forEachBackend, withRoom, sleep } from './utilities';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('PasswordsModel', () => {
  forEachBackend((backend) => {
    let roomId;
    before(async () => {
      roomId = await withRoom(backend);
    });

    let membersModel;
    let passwordsModel;
    let roomModel;
    it('should be able to instantiate', () => {
      membersModel = new MembersModel(backend);
      passwordsModel = new PasswordsModel(backend);
      roomModel = new RoomModel(backend);
    });

    it('should be able to update password', async () => {
      await roomModel.update(roomId, { password: 'pass' });
      await membersModel.remove(roomId);
    });

    if (backend.getType() !== 'firebase') { // ToDo
      it('should not be able to join without password', async () => {
        await assert.isRejected((async () => {
          await membersModel.update(roomId, {});
        })());
      });
    }

    it('should be able to update', async () => {
      await passwordsModel.update(roomId, 'incorrect');
    });

    if (backend.getType() !== 'firebase') { // ToDo
      it('should not be able to join with incorrect password', async () => {
        await assert.isRejected((async () => {
          await membersModel.update(roomId, {});
        })());
      });
    }

    it('should be able to update', async () => {
      await passwordsModel.update(roomId, 'pass');
      await sleep();
    });

    const callback = spy();
    it('should be able to join', async () => {
      await membersModel.update(roomId, {});
      await roomModel.subscribe(roomId, callback);
      await roomModel.update(roomId, { title: 'updated' });
      await sleep();

      const [event, data] = callback.lastCall.args;

      expect(event).to.equal(ObjectEvent.Value);
      expect(data.id).to.equal(roomId);
      expect(data.title).to.equal('updated');

      expect(data.password).to.equal(undefined);
      expect(data.isLocked).to.equal(true);
    });
  });
});
