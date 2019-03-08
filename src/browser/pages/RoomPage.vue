<template lang="pug">
  .room-page.app(v-if="room && members && !notFound")
    room-app-bar
    main
      router-view(:room="room")
      dice-panel
    room-bottom-nav
  not-found(v-else-if="notFound")
  loading(v-else)
</template>

<script>
import * as Routes from '../routes';
import { IntervalTimer } from '../utilities/timer';
import { bindAsObject } from '@/browser/models';
import { mapGetters } from 'vuex';
import RoomAppBar from '@/browser/moleculers/RoomAppBar.vue';
import DicePanel from '@/browser/moleculers/DicePanel.vue';
import Loading from '@/browser/atoms/Loading.vue';
import NotFound from '@/browser/moleculers/NotFound.vue';
import NotFoundError from '@/browser/backend/NotFoundError';
import RoomMenu from '@/browser/components/RoomMenu.vue';
import RoomBottomNav from '@/browser/moleculers/RoomBottomNav.vue';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import config from '../config';
import debounce from 'lodash/debounce';
import run from '@/browser/utilities/task';
import sessionStorage from '@/browser/wrappers/sessionStorage';

const saveRoomTab = debounce((roomId, roomTab) => {
  sessionStorage.setItem(`nekotaku:${roomId}:roomTab`, roomTab);
}, 1000);

export default {
  mixins: [
    bindAsObject('members', false),
    bindAsObject('room', false),
  ],
  components: {
    DicePanel,
    Loading,
    NotFound,
    RoomAppBar,
    RoomBottomNav,
    RoomMenu,
  },
  data() {
    return {
      drawer: false,
      roomTab: '0',
      prevRoomTab: '0',
      timer: null,
      notFound: false,
    };
  },
  computed: {
    ...mapGetters([
      'chatControl',
    ]),
    title() {
      return this.room ? `${this.room.title} - ${config.title}` : config.title;
    },
  },
  methods: {
    async updateMember() {
      const {
        name,
        color,
      } = this.chatControl;
      await this.$models.members.update(this.roomId, { name, color });
    },
  },
  watch: {
    room({ id }) {
      document.title = this.title;

      const roomTab = sessionStorage.getItem(`nekotaku:${id}:roomTab`);
      if (roomTab) this.roomTab = roomTab;
    },
    roomTab(roomTab, oldValue) {
      this.prevRoomTab = oldValue;

      saveRoomTab(this.roomId, roomTab);
    },
  },
  created() {
    run(async () => {
      try {
        await this.updateMember();
        await this.bindModels();
        this.width = window.innerWidth;
        this.timer = new IntervalTimer(() => this.updateMember(), 5 * 1000);
      } catch (e) {
        if (e instanceof UnauthorizedError) this.$router.push({ name: Routes.RoomPassword.name });
        else if (e instanceof NotFoundError) this.notFound = true;
        else {
          console.error(e);
          this.$router.push({ name: Routes.Lobby.name });
        }
      }
    });
  },
  destroyed() {
    if (this.timer) this.timer.stop();
  },
};
</script>
