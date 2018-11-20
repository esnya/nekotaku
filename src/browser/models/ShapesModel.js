import ListModel from '@/browser/models/ListModel';

export default class ShapesModel extends ListModel {
  constructor(backend) {
    super(backend, 'shapes');
  }
}
