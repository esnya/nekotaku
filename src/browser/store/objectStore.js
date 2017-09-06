/* eslint no-param-reassign: off, no-useless-computed-key: off */

export default function objectStore(key: string) {
  return {
    mutations: {
      [`${key}:clear`]: function clear(state) {
        state[key] = null;
      },
      [`${key}:update`]: function update(state, value) {
        state[key] = value;
      },
    },
    state: {
      [key]: null,
    },
  };
}
