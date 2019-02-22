import DataWithId from './DataWithId';

export default interface DataType extends DataWithId {
  createdAt: number;
  updatedAt: number;
}
