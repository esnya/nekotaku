import ListModel from '@/browser/models/ListModel';

export default class MemosModel extends ListModel {
  constructor(backend) {
    super(backend, 'memos');
  }
}
