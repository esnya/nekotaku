import alignEntity from '../utilities/alignEntity';
import backend from '../backend';
import listStore from './listStore';

export default {
  ...listStore('shapes'),
  actions: {
    async alignShape({ state }, id) {
      const shape = state.shapes.find(s => s.id === id);
      if (!shape) return;

      const { x, y } = shape;
      await backend.moveShape(id, alignEntity(x), alignEntity(y), Date.now());
    },
    async moveShape(context, { id, x, y }) {
      await backend.moveShape(id, x, y, Date.now());
    },
  },
};
