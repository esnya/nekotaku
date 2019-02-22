import store from '@/browser/store';
import Entity from './Entity';
import Point from './Point';
import characterDAO from '../dao/characterDAO';
import shapeDAO from '../dao/shapeDAO';

export default class ControllerStrategy {
  get selected() {
    return store.state.mapSelected;
  }

  get selectedId(): string | null {
    return this.selected && this.selected.id;
  }

  get selectedType(): string | null {
    return this.selected && this.selected.type;
  }

  get offset(): Point {
    return this.selected ? this.selected.offset : { x: 0, y: 0 };
  }

  select(type: string, entity: Entity, location: Point): void {
    store.commit('selectEntity', {
      type,
      id: entity.id,
      offset: location,
    });
  }

  deselect(): void {
    store.commit('deselectEntity');
  }

  updateSelected(data: {}): void {
    if (!this.selectedId) return;
    const model = this.selectedType === 'character' ? characterDAO : shapeDAO;
    model.update(data, this.selectedId);
  }

  onMove(location: Point): void {}
  onStop(): void {}
  onTouchMap(location: Point, event: Event): void {}
  onTouchCharacter(location: Point, character: Entity): void {}
  onTouchShape(location: Point, shape: Entity): void {}
}
