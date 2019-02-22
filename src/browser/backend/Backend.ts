import PathElement from './PathElement';
import CollectionPath from './CollectionPath';
import Model from '@/models/Model';
import Unsubscribe from './Unsubscribe';
import Timestamp from '@/models/Timestamp';

export default interface Backend {
  /* Abstract Methods */
  getType(): string;

  getUID(): Promise<string>;

  subscribe(
    path: string,
    event: string,
    callback: (data: {}) => void,
  ): Promise<() => Promise<void>>;

  push(
    path: string,
    data: {},
  ): Promise<string>;

  update(
    path: string,
    data: any,
  ): Promise<void>;

  remove(
    path: string,
  ): Promise<void>;

  pushFile(
    roomId: string,
    path: string,
    file: File,
  ): Promise<string>;

  removeFile(
    roomId: string,
    path: string,
  ): Promise<void>;

  removeFiles(
    roomId: string,
  ): Promise<void>;

  v2getUserId(): Promise<string>;

  v2add<T extends Timestamp>(path: CollectionPath, value: T): Promise<string>;
  v2update<T extends { updatedAt: Date }>(path: PathElement[], value: T): Promise<void>;
  v2remove(path: PathElement[]): Promise<void>;

  v2subscribeChild(
    path: CollectionPath,
    onAdded: (value: Model) => void,
    onChanged: (value: Model) => void,
    onRemoved: (id: string) => void,
  ): Promise<Unsubscribe>;

  v2subscribeValue(
    path: PathElement[], onValue: (value: Model | null) => void,
  ): Promise<Unsubscribe>;
}
