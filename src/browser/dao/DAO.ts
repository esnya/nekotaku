export interface DataWithId {
  id: string;
}
export interface DataType extends DataWithId {
  createdAt: number;
  updatedAt: number;
}

export default interface DAO {
  getName(): string;
}
