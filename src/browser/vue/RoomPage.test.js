describe('RoomPage', () => {
  jest.setMock('../config', { backend: { type: 'stub' } });

  jest.mock('moment');
  const moment = require('moment');
  moment.mockReturnValue({
    fromNow: jest.fn().mockReturnValue('数秒前'),
    format: jest.fn().mockReturnValue('2017年9月23日 15:00'),
  });

  const joinRoom = jest.fn();
  const leaveRoom = jest.fn();
  const state = require('../constants/StubData').default;

  const _ = require('lodash');
  function mapState(selector: Array | Object) {
    if (Array.isArray(selector)) return mapState(_(selector).map(a => [a, a]).fromPairs().value());

    return _(selector)
      .mapValues((key) => {
        switch (key) {
          case 'room':
            return state.rooms[0];
          case 'chatControl':
            return require('../store/modules/chatControl').default.state;
          case 'mapControl':
            return require('../store/modules/mapControl').default.state;
          case 'roomJoinInfo':
            return {};
          default:
            return state[key];
        }
      })
      .mapValues(value => () => value)
      .value();
  }

  jest.setMock('vuex', {
    mapActions: jest.fn().mockReturnValue({
      joinRoom,
      leaveRoom,
      updateMapStyle: jest.fn(),
      updateMapBackgroundImage: jest.fn(),
      clearMapBackgroundImage: jest.fn(),
      setChatName: jest.fn(),
      setChatColor: jest.fn(),
    }),
    mapMutations: jest.fn().mockReturnValue({
      addMapZoom: jest.fn(),
      resetMapZoom: jest.fn(),
      setMapMode: jest.fn(),
      togglePerspective: jest.fn(),
    }),
    mapState,
  });

  class Node {
    connect() {}
  }
  class AudioContext {
    createGain() {
      return new Node();
    }
  }
  window.AudioContext = AudioContext;

  const router = jest.fn();

  const Vue = require('vue');

  Vue.component('router-link', { render: h => h('a') });

  const Vuetify = require('vuetify').default;
  Vue.use(Vuetify);

  Vue.directive('tooltip', () => {});

  let RoomPage;
  it('should be valid module', () => {
    RoomPage = require('./RoomPage.vue');
    RoomPage.computed = {
      ...RoomPage.computed,
      $route() {
        return { params: { id: '-room1' } };
      },
      $router() {
        return router;
      },
    };
  });

  let vm;
  it('should be RoomPage', () => {
    vm = new Vue({
      components: { RoomPage, RouterLink: { template: '<a></a>' } },
      render: createElement => createElement(RoomPage),
    }).$mount();
    expect(vm.$el).toMatchSnapshot();
  });

  it('should calls actions', () => {
    expect(joinRoom).toBeCalledWith({ id: '-room1', router });
    vm.$destroy();
    expect(leaveRoom).toBeCalledWith();
  });
});
