/* eslint no-unused-vars: off, class-methods-use-this: off */

export default class Backend {
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
  ): Promise<void> {
    throw new Error('Abstract method called');
  }

  async remove(
    path: string,
  ): Promise<void> {
    throw new Error('Abstract method called');
  }

  async pushFile(
    roomId: string,
    path: string,
    file: File,
  ): Promise<string> {
    throw new Error('Abstract method called');
  }

  async removeFile(
    roomId: string,
    path: string,
  ): Promise<void> {
    throw new Error('Abstract method called');
  }

  async removeFiles(
    roomId: string,
  ): Promise<void> {
    throw new Error('Abstract method called');
  }
}

export class NotFoundError extends Error {}
export class UnauthorizedError extends Error {}
