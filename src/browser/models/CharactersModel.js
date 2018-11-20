import ListModel from '@/browser/models/ListModel';

export default class CharactersModel extends ListModel {
  constructor(backend) {
    super(backend, 'characters');
  }
}
