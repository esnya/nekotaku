import { expect } from 'chai';
import { spy } from 'sinon';
import { RoomDAO } from '@/browser/dao/roomDAO';
import StubBackend from '@/browser/backend/StubBackend';
import Unsubscribe from '@/browser/backend/Unsubscribe';

describe('RoomDAO', () => {
  let roomDAO: RoomDAO;
  it('should instantiates', () => {
    const backend = new StubBackend();
    roomDAO = new RoomDAO(backend);
  });

  const onAdded = spy();
  const onChanged = spy();
  const onRemoved = spy();
  let unsubscribe: Unsubscribe;
  it('should subscribes chlidren', async () => {
    unsubscribe = await roomDAO.subscribeChild(onAdded, onChanged, onRemoved);
  });

  it('should calls onAdded', () => {
    expect(onAdded).to.have.been.called;
  });
});
