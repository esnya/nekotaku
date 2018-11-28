export default class Model {
  constructor(backend, name) {
    if (!backend || !name) throw new Error('Invalid argument(s)');
    this.backend = backend;
    this.name = name;
  }

  getPath(roomId: string): string {
    return `${this.name}/${roomId}`;
  }
}
