import PathElement from './PathElement';

export default interface CollectionPath {
  parentPath: PathElement[];
  collection: string;
}
