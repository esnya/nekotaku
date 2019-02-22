import CreateControllerStrategy from './CreateControllerStrategy';
import EraseControllerStrategy from './EraseControllerStrategy';
import MoveControllerStrategy from './MoveControllerStrategy';
import ControllerStrategy from './ControllerStrategy';
import Entity from './Entity';
import store from '../store';

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
  private container: HTMLElement;
  private controllerStrategies: { [key: string]: ControllerStrategy };
  private unsubscribers: (() => void)[];

  constructor(
    container: HTMLElement,
  ) {
    this.container = container;
    this.controllerStrategies = {
      create: new CreateControllerStrategy(),
      erase: new EraseControllerStrategy(),
      move: new MoveControllerStrategy(),
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

    const size = 50 * (2 ** store.state.mapZoom);
    return {
      x: (clientX - container.offsetLeft + parent.scrollLeft) / size,
      y: (clientY - container.offsetTop + parent.scrollTop) / size,
    };
  }

  get controllerStrategy(): ControllerStrategy {
    const mode = store.state.mapMode;
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
