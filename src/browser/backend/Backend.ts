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
}
