import create from './MapCreateModeStrategy';
import erase from './MapEraseModeStrategy';
import move from './MapMoveModeStrategy';

const Constructors = {
  create,
  erase,
  move,
};

export default function getMapModeStrategy(c) {
  const mode = c.mapControl.mode;

  const Constructor = Constructors[mode];
  if (!Constructor) throw new TypeError(`Invalid map edit mode: ${mode}`);

  return new Constructor(c);
}
