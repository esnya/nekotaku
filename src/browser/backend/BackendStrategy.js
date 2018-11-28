/* eslint no-unused-vars: off, class-methods-use-this: off */

export type Handler = (event: string, data: Object | string) => void;

export default class BackendStrategy {
  constructor(config: Object) {
    this.type = config.type;
  }

  /* new API */
  async getUID(): Promise<string> {
    throw new Error('Abstract method called');
  }

  async subscribe(
    path: string,
    event: string,
    callback: Object => void,
  ): Promise<() => Promise<void>> {
    throw new Error('Abstract method called');
  }

  async push(
    path: string,
    data: string,
  ): Promise<string> {
    throw new Error('Abstract method called');
  }

  async update(
    path: string,
    data: Object,
  ): Promise<string> {
    throw new Error('Abstract method called');
  }

  async remove(
    path: string,
  ): Promise<string> {
    throw new Error('Abstract method called');
  }

  async pushFile(
    path: string,
    file: File,
  ): Promise<string> {
    throw new Error('Abstract method called');
  }

  async removeFile(
    path: string,
  ): Promise<void> {
    throw new Error('Abstract method called');
  }

  async removeFiles(
    path: string,
  ): Promise<void> {
    throw new Error('Abstract method called');
  }
}
