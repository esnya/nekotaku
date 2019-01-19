import _ from 'lodash';

export function filter<T>(data: T): T {
  if (typeof data === 'object') {
    return _.mapValues(data, value => (value === '' ? null : value));
  }
  return data;
}

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
