<template lang="pug">
  .app
    room-drawer(v-if="room" v-model="drawer")
    v-toolbar.primary.app-bar(dark, fixed)
      v-toolbar-side-icon(@click.stop="drawer = !drawer")
      v-toolbar-title(:class="{ 'ml-0': room && room.isLocked }")
        v-layout(row)
          v-avatar.mr-1(v-if="room && room.isLocked" size="24px")
            v-icon(dark) lock_outline
          div {{room && room.title}}
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
            v-btn(primary, @click="joinRoom({ id, route: $route })") 参加
            v-btn(@click="leave") やめる
            v-spacer
      main(v-else-if="room && !room.locked")
        v-layout(column)
          .floating
            room-info-list.room-info-list(:room="room")
          v-flex.slider
            div(:style="slideStyle")
              chat-tab
              character-list
              map-tab
          v-bottom-nav.white(
            :active.sync="roomTab"
            :class="{ 'no-shadow': roomTab !== '1' }"
            :value="true"
          )
            v-btn(flat, primary, value="0")
              span チャット
              v-icon mdi-forum
            v-btn(flat, primary, value="1")
              span キャラクター
              v-icon mdi-account-multiple
            v-btn(flat, primary, value="2")
              span マップ
              v-icon mdi-map-marker-radius
      loading(v-else)
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import * as RouteNames from '../constants/route';
import ChatTab from './ChatTab.vue';
import CharacterList from './CharacterList.vue';
import Loading from './Loading.vue';
import MapTab from './MapTab.vue';
import RoomInfoList from './RoomInfoList.vue';
import RoomDrawer from './RoomDrawer.vue';

export default {
  components: {
    ChatTab,
    CharacterList,
    Loading,
    MapTab,
    RoomInfoList,
    RoomDrawer,
    RouteNames,
  },
  data() {
    return {
      drawer: false,
      roomTab: '0',
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
    slideStyle() {
      return {
        transform: `translate(-${this.roomTab}00%, 0)`,
      };
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
.slider
  overflow hidden

  > *
    transition transform 0.4s ease-in-out
    width 100%
    height 100%
    overflow visible
    display flex

    > *
      flex 0 0 100vw
      width 100vw
      overflow hidden

.slide
  height 100%
  transition transform 0.4s ease-in-out

  > *
    flex 0 0 auto
    overflow hidden

main
  height 100%

  > .layout
    height 100%

.bottom-nav
  position static
  flex 0 0 auto
</style>
