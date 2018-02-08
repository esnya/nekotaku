import backend from '../backend';
import listStore from './listStore';

export default {
  ...listStore('memos'),
  actions: {
    async addMemo(context, data) {
      await backend.createMemo(data);
    },
    async updateMemo(context, { id, data }) {
      await backend.updateMemo(id, data);
    },
    async removeMemo(context, id) {
      await backend.removeMemo(id);
    },
  },
};
