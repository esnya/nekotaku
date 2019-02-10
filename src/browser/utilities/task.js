import store from '@/browser/store';

export default async function run(task: () => Promise<void>) {
  store.commit('setLoading', true);

  try {
    await task();
  } catch (e) {
    console.error(e);
  }

  store.commit('setLoading', false);
}
