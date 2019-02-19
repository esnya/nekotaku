import CreateControllerStrategy from './CreateControllerStrategy';
import EraseControllerStrategy from './EraseControllerStrategy';
import MoveControllerStrategy from './MoveControllerStrategy';

function on(event, callback) {
  window.addEventListener(event, callback);
  return () => window.removeEventListener(event, callback);
}

function getEventLocation(event: Event): { clientX: number, clientY: number } {
  if (event.touches) {
    const [touch] = event.touches;
    return touch;
  }
  return event;
}

export default class MapController {
  constructor(store: Object, models: Object, roomId: string, container: HTMLElement) {
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
      on('mouseup', event => this.controllerStrategy.onStop(event)),
      on('touchend', event => this.controllerStrategy.onStop(event)),
    ];
  }

  destroy() {
    this.unsubscribers.forEach(u => u());
  }

  getLocation(event: Event): { x: number, y: number } {
    const { clientX, clientY } = getEventLocation(event);
    const { container } = this;
    const parent = container.parentElement;
    const size = 50 * (2 ** this.store.state.mapControl.zoom);
    return {
      x: (clientX - container.offsetLeft + parent.scrollLeft) / size,
      y: (clientY - container.offsetTop + parent.scrollTop) / size,
    };
  }

  get controllerStrategy() {
    const { mode } = this.store.state.mapControl;
    const controllerStrategy = this.controllerStrategies[mode];
    if (!controllerStrategy) throw new Error(`Invalid map editing mode: ${mode}`);
    return controllerStrategy;
  }

  onTouchMap(event) {
    this.controllerStrategy.onTouchMap(this.getLocation(event), event);
  }

  onTouchCharacter(event, character) {
    event.preventDefault();
    this.controllerStrategy.onTouchCharacter(this.getLocation(event), character);
  }

  onTouchShape(event, shape) {
    event.preventDefault();
    this.controllerStrategy.onTouchShape(this.getLocation(event), shape);
  }
}
