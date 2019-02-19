import Backend from '@/browser/backend/Backend';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';

export function filter<T>(data: T): T {
  if (typeof data === 'object') {
    const noEmptyStrings = mapValues(data as any, value => (value === '' ? null : value));
    const noUndefined = pickBy(noEmptyStrings, value => value !== undefined);
    return noUndefined as any;
  }
  return data;
}

export default class Model {
  backend: Backend;
  name: string;

  constructor(backend: Backend, name: string) {
    this.backend = backend;
    this.name = name;
  }

  getPath(roomId: string | null): string {
    return `${this.name}/${roomId}`;
  }

  getDefault(): {} {
    return {};
  }
}
