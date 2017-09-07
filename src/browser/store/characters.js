import { align, limit } from '../utilities/entity';
import backend from '../backend';
import listStore from './listStore';

export default {
  ...listStore('characters'),
  actions: {
    async createCharacter(context, character) {
      await backend.createCharacter({
        icon: null,
        portrait: {
          default: null,
        },
        x: 0.5,
        y: 0.5,
        z: Date.now(),
        ...character,
      });
    },
    async updateCharacter(context, { id, key, value }) {
      await backend.updateCharacter(id, key, value);
    },
    async removeCharacter(context, id) {
      await backend.removeCharacter(id);
    },
    async alignCharacter({ state }, id) {
      const characters = state.characters.find(s => s.id === id);
      if (!characters) return;

      const { x, y } = characters;
      await backend.moveCharacter(
        id,
        align(x),
        align(y),
        Date.now(),
      );
    },
    async moveCharacter({ state }, { id, x, y }) {
      const { width, height } = state.map;
      await backend.moveCharacter(id, limit(x, width), limit(y, height), Date.now());
    },
  },
};
