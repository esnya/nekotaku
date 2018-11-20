import ListModel from '@/browser/models/ListModel';

export default class MessagesModel extends ListModel {
  constructor(backend) {
    super(backend, 'messages');
  }
}
