import { Store } from 'vuex';
import CreateControllerStrategy from './CreateControllerStrategy';
import EraseControllerStrategy from './EraseControllerStrategy';
import MoveControllerStrategy from './MoveControllerStrategy';
import ControllerStrategy from './ControllerStrategy';
import ListModel from '../models/ListModel';
import Entity from './Entity';

function on(event: string, callback: (e: MouseEvent | TouchEvent) => void) {
  const wrappedCallback = (e: Event) => {
    if (!(e instanceof MouseEvent || e instanceof TouchEvent)) {
      throw new Error('Invalid event type');
    }
    callback(e);
  }

  window.addEventListener(event, wrappedCallback);
  return () => window.removeEventListener(event, wrappedCallback);
}

function getEventLocation(event: MouseEvent | TouchEvent): { clientX: number, clientY: number } {
  if (event instanceof TouchEvent) {
    const [touch] = event.touches;
    return touch;
  }
  return event;
}

export default class MapController {
  private store: Store<any>;
  private container: HTMLElement;
  private controllerStrategies: { [key: string]: ControllerStrategy };
  private unsubscribers: (() => void)[];

  constructor(
    store: Store<any>,
    models: { [key: string]: ListModel },
    roomId: string,
    container: HTMLElement,
  ) {
    this.store = store;
    this.container = container;
    this.controllerStrategies = {
      create: new CreateControllerStrategy(store, models, roomId),
      erase: new EraseControllerStrategy(store, models, roomId),
      move: new MoveControllerStrategy(store, models, roomId),
    };

    this.unsubscribers = [
      on('mousemove', event => this.controllerStrategy.onMove(this.getLocation(event))),
      on('touchmove', event => this.controllerStrategy.onMove(this.getLocation(event))),
      on('mouseup', event => this.controllerStrategy.onStop()),
      on('touchend', event => this.controllerStrategy.onStop()),
    ];
  }

  destroy() {
    this.unsubscribers.forEach(u => u());
  }

  getLocation(event: MouseEvent | TouchEvent): { x: number, y: number } {
    const { clientX, clientY } = getEventLocation(event);
    const { container } = this;
    const parent = container.parentElement;
    if (!parent) throw new Error('Failed to get parent element');

    const size = 50 * (2 ** this.store.state.mapControl.zoom);
    return {
      x: (clientX - container.offsetLeft + parent.scrollLeft) / size,
      y: (clientY - container.offsetTop + parent.scrollTop) / size,
    };
  }

  get controllerStrategy(): ControllerStrategy {
    const { mode } = this.store.state.mapControl;
    const controllerStrategy = this.controllerStrategies[mode];
    if (!controllerStrategy) throw new Error(`Invalid map editing mode: ${mode}`);
    return controllerStrategy;
  }

  onTouchMap(event: MouseEvent | TouchEvent) {
    this.controllerStrategy.onTouchMap(this.getLocation(event), event);
  }

  onTouchCharacter(event: MouseEvent | TouchEvent, character: Entity) {
    event.preventDefault();
    this.controllerStrategy.onTouchCharacter(this.getLocation(event), character);
  }

  onTouchShape(event: MouseEvent | TouchEvent, shape: Entity) {
    event.preventDefault();
    this.controllerStrategy.onTouchShape(this.getLocation(event), shape);
  }
}
