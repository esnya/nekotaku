<template lang="pug">
  .app
    v-toolbar.primary.app-bar(dark, fixed)
      img(src="/img/nekokoro32.png")
      v-toolbar-title
        v-layout(row)
          v-avatar.mr-1(v-if="room && room.isLocked" size="24px")
            v-icon(dark) lock_outline
          div {{room && room.title}}
      v-spacer
      room-menu.mr-0
    transition(name="neko-slide")
      main(v-if="room && room.locked")
        v-container
          v-text-field(
            required
            label="パスワード"
            type="password"
            :rules="[passwordRule]"
            :value="password"
            @input="password => setJoinRoomPassword({ id, password })"
          )
          v-layout(row)
            v-spacer
            v-btn(color="primary" @click="joinRoom({ id, route: $route })") 参加
            v-btn(@click="leave") やめる
            v-spacer
      main(v-else-if="room && !room.locked")
        .floating.fixed
          room-info-list.room-info-list(:room="room")
        transition(
          :name="roomTab > prevRoomTab ? 'slide-rl' : 'slide-lr'"
          @enter="restoreScroll"
        )
          message-list.slide-absolute(v-if="roomTab === '0'")
          character-list.slide-absolute(v-else-if="roomTab === '1'")
          map-view.slide-absolute(v-else-if="roomTab === '2'")
        transition(name="neko-slide-right")
          portrait-panel(v-if="roomTab === '0'")
        transition(name="neko-fade")
          dice-panel(v-if="roomTab === '0'")
        transition(name="neko-slide-bottom")
          chat-control(v-if="roomTab === '0'")
          map-control(v-else-if="roomTab === '2'")
        v-bottom-nav(
          color="white"
          :active.sync="roomTab"
          :class="{ 'no-shadow': roomTab !== '1' }"
          :fixed="true"
          :value="true"
        )
          v-btn(flat color="primary" value="0")
            span チャット
            v-icon mdi-forum
          v-btn(flat color="primary" value="1")
            span キャラクター
            v-icon mdi-account-multiple
          v-btn(flat color="primary" value="2")
            span マップ
            v-icon mdi-map-marker-radius
      loading(v-else)
</template>

<script>
import _ from 'lodash';
import { inOutSign } from 'ease-component';
import scroll from 'scroll';
import { mapActions, mapMutations, mapState } from 'vuex';
import * as RouteNames from '../constants/route';
import sessionStorage from '../utilities/sessionStorage';
import ChatControl from './ChatControl.vue';
import CharacterList from './CharacterList.vue';
import DicePanel from './DicePanel.vue';
import Loading from './Loading.vue';
import MapControl from './MapControl.vue';
import MapView from './MapView.vue';
import MessageList from './MessageList.vue';
import PortraitPanel from './PortraitPanel.vue';
import RoomInfoList from './RoomInfoList.vue';
import RoomMenu from './RoomMenu.vue';

const saveRoomTab = _.debounce((roomId, roomTab) => {
  sessionStorage.setItem(`nekotaku:${roomId}:roomTab`, roomTab);
}, 1000);

export default {
  components: {
    ChatControl,
    CharacterList,
    DicePanel,
    Loading,
    MapControl,
    MapView,
    MessageList,
    RoomInfoList,
    RoomMenu,
    RouteNames,
    PortraitPanel,
  },
  data() {
    return {
      drawer: false,
      roomTab: '0',
      prevRoomTab: '0',
      scrollTop: {},
    };
  },
  computed: {
    ...mapState([
      'room',
      'roomJoinInfo',
    ]),
    id() {
      return this.$route.params.id;
    },
    joinInfo() {
      return this.roomJoinInfo && this.roomJoinInfo[this.id];
    },
    password() {
      return this.roomJoinInfo && this.roomJoinInfo[this.id] && this.roomJoinInfo[this.id].password;
    },
  },
  methods: {
    ...mapActions([
      'joinRoom',
      'leaveRoom',
    ]),
    ...mapMutations([
      'setJoinRoomPassword',
    ]),
    passwordRule() {
      if (!this.room) return true;

      return this.room.passwordIncorrect ? 'パスワードが間違っています。' : true;
    },
    leave() {
      this.leaveRoom();
      this.$router.push({ name: RouteNames.Lobby });
    },
    restoreScroll() {
      const scrollable = document.body;
      setTimeout(() => {
        scroll.top(
          scrollable,
          this.scrollTop[this.roomTab] || 0,
          { duration: 400, ease: inOutSign },
        );
      });
    },
  },
  watch: {
    room({ id }) {
      const roomTab = sessionStorage.getItem(`nekotaku:${id}:roomTab`);
      if (roomTab) this.roomTab = roomTab;
    },
    roomTab(roomTab, oldValue) {
      this.prevRoomTab = oldValue;

      const scrollable = document.body;
      this.scrollTop[oldValue] = scrollable.scrollTop;
      scrollable.scrollTop = 0;

      saveRoomTab(this.room.id, roomTab);
    },
  },
  created() {
    const {
      id,
    } = this.$route.params;

    this.joinRoom({ id, router: this.$router });

    this.width = window.innerWidth;
  },
  beforeDestroy() {
    this.leaveRoom();
  },
};
</script>

<style lang="stylus" scoped>
main
  padding-top 64px

.slide-absolute
  top 64px
</style>
