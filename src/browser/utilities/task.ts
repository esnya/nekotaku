import store from '@/browser/store';

export default async function run(task: () => Promise<void>) {
  store.commit('setLoading', true);

  try {
    await task();
  } catch (e) {
    store.commit('pushMessage', {
      title: 'error',
      body: e.stack ? e.stack.toString() : e.toString(),
    });
  }

  store.commit('setLoading', false);
}
