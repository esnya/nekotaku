/* eslint no-param-reassign: off, no-useless-computed-key: off */

export default function listStore(key: string, reverse: boolean = false) {
  return {
    mutations: {
      [`${key}:clear`]: function clear(state) {
        state[key] = [];
      },
      [`${key}:add`]: reverse ? function addReverse(state, item) {
        state[key] = [
          item,
          ...state[key],
        ];
      } : function add(state, item) {
        state[key] = [
          ...state[key],
          item,
        ];
      },
      [`${key}:change`]: function change(state, item) {
        state[key] = state[key].map(a => (a.id === item.id ? item : a));
      },
      [`${key}:remove`]: function remove(state, id) {
        state[key] = state[key].filter(a => a.id !== id);
      },
    },
    state: {
      [key]: [],
    },
  };
}
