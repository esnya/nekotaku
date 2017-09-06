import { align, limit } from '../utilities/entity';
import backend from '../backend';
import listStore from './listStore';

export default {
  ...listStore('shapes'),
  actions: {
    async alignShape({ state }, id) {
      const shape = state.shapes.find(s => s.id === id);
      if (!shape) return;

      const { x, y } = shape;
      await backend.moveShape(
        id,
        align(x),
        align(y),
        Date.now(),
      );
    },
    async moveShape({ state }, { id, x, y }) {
      const { width, height } = state.map;
      await backend.moveShape(id, limit(x, width), limit(y, height), Date.now());
    },
    async createShape({ commit }, shape) {
      const id = await backend.createShape(shape);

      commit('selectEntity', {
        id,
        type: 'entity',
      });
    },
    async updateShape(context, { id, ...data }) {
      await backend.updateShape(id, data);
    },
  },
};
