/* eslint no-param-reassign: off, no-useless-computed-key: off */

export default function listStore(key: string, reverse: boolean = false) {
  const loadingKey = `${key}Loading`;
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
        state[loadingKey] = false;
      } : function add(state, item) {
        state[key] = [
          ...state[key],
          item,
        ];
        state[loadingKey] = false;
      },
      [`${key}:change`]: function change(state, item) {
        state[key] = state[key].map(a => (a.id === item.id ? item : a));
      },
      [`${key}:remove`]: function remove(state, { id }) {
        state[key] = state[key].filter(a => a.id !== id);
      },
    },
    state: {
      [key]: [],
      [loadingKey]: true,
    },
  };
}
