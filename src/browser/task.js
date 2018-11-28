import store from '@/browser/store';

export default async function run(task: void => Promise<void>) {
  store.commit('setLoading', true);

  try {
    await task();
  } catch (e) {
    console.error(e);
  }

  store.commit('setLoading', false);
}
