import ObjectModel from '@/browser/models/ObjectModel';

export default class RoomModel extends ObjectModel {
  constructor(backend) {
    super(backend, 'rooms');
  }
}
