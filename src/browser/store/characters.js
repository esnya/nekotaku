import alignEntity from '../utilities/alignEntity';
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
        x: 0,
        y: 0,
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
      await backend.moveCharacter(id, alignEntity(x), alignEntity(y), Date.now());
    },
    async moveCharacter(context, { id, x, y }) {
      await backend.moveCharacter(id, x, y, Date.now());
    },
  },
};
