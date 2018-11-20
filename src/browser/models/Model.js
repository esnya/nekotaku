export default class Model {
  constructor(backend, name) {
    this.backend = backend.strategy;
    this.name = name;
  }
}
