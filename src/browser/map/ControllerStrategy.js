
import { Store } from 'vuex';

export default class ControllerStrategy {
  constructor(store: Store, models: Object, roomId: string) {
    this.store = store;
    this.models = models;
    this.roomId = roomId;
  }

  get selected() {
    return this.store.state.mapControl.selected;
  }

  get selectedId() {
    return this.selected && this.selected.id;
  }

  get selectedType() {
    return this.selected && this.selected.type;
  }

  get offset() {
    return this.selected && this.selected.offset;
  }

  select(type: string, entity: Object, location: Object) {
    this.store.commit('selectEntity', {
      type,
      id: entity.id,
      offset: location,
    });
  }

  deselect() {
    this.store.commit('deselectEntity');
  }

  updateSelected(data: {}) {
    if (!this.selected) return;
    const model = this.selectedType === 'character' ? this.models.characters : this.models.shapes;
    model.update(this.roomId, this.selectedId, data);
  }

  onMove() {}

  onStop() {}

  onTouchMap() {}

  onTouchCharacter() {}

  onTouchShape() {}
}
