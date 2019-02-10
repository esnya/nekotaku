import Backend from '@/browser/backend/Backend';
import ListModel from '@/browser/models/ListModel';

export default class MemosModel extends ListModel {
  constructor(backend: Backend) {
    super(backend, 'memos');
  }
}
