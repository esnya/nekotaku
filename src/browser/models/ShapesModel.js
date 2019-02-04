import ListModel from '@/browser/models/ListModel';

export default class ShapesModel extends ListModel {
  constructor(backend) {
    super(backend, 'shapes');
  }

  // eslint-disable-next-line class-methods-use-this
  getDefault() {
    return {
      x: 0,
      y: 0,
      z: Date.now(),
    };
  }
}
