/* eslint no-param-reassign: off, no-useless-computed-key: off */

export default function objectStore(type: string, storeKey: ?string) {
  const key = storeKey || type;

  return {
    mutations: {
      [`${type}:clear`]: function clear(state) {
        state[key] = null;
      },
      [`${type}:update`]: function update(state, value) {
        state[key] = value;
      },
    },
    state: {
      [key]: null,
    },
  };
}
