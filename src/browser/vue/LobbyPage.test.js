xdescribe('LobbyPage', () => {
  window.requestAnimationFrame = jest.fn();

  jest.setMock('../config', { backend: { type: 'stub' } });
  jest.mock('moment');

  jest.mock('moment');
  const moment = require('moment');
  moment.mockReturnValue({
    fromNow: jest.fn().mockReturnValue('数秒前'),
    format: jest.fn().mockReturnValue('2017年9月23日 15:00'),
  });

  const joinLobby = jest.fn();
  const leaveLobby = jest.fn();
  const state = require('../constants/StubData').default;
  jest.setMock('vuex', {
    mapActions: jest.fn().mockReturnValue({
      joinLobby,
      leaveLobby,
    }),
    mapMutations: jest.fn(),
    mapState: jest.fn().mockReturnValue({
      rooms: () => state.rooms,
    }),
  });

  const Vue = require('vue');

  Vue.component('router-link', { render: h => h('a') });

  const Vuetify = require('vuetify').default;
  Vue.use(Vuetify);

  let LobbyPage;
  it('should be valid module', () => {
    LobbyPage = require('./LobbyPage.vue');
  });

  let vm;
  it('should be LobbyPage', () => {
    vm = new Vue({
      components: { LobbyPage },
      render: createElement => createElement(LobbyPage),
    }).$mount();
    expect(vm.$el).toMatchSnapshot();
  });

  it('should calls actions', () => {
    expect(joinLobby).toBeCalled();
    vm.$destroy();
    expect(leaveLobby).toBeCalled();
  });
});
