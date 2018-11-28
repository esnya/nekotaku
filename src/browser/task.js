import store from '@/browser/store';

export default async function run(task: void => Promise<void>) {
  store.commit('setLoading', true);

  try {
    await task();
  } catch (e) {
    store.commit('pushMessage', { title: 'エラー', text: e.toString() });
  }

  store.commit('setLoading', false);
}
