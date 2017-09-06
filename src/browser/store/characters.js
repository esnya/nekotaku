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
  },
};
