export default class Model {
  constructor(backend, name) {
    if (!backend || !name) throw new Error('Invalid argument(s)');
    this.backend = backend;
    this.name = name;
  }

  getPath(roomId: string): string {
    return `${this.name}/${roomId}`;
  }

  async pushFile(roomId: string, file: File): Promise<string> {
    const url = await this.backend.pushFile(roomId, file);
    return url;
  }
}
