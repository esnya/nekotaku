<template lang="pug">
  .room(v-if="room")
    v-navigation-drawer(
      absolute
      light
      overflow
      temporary
      v-model="navOpen"
    )
      v-toolbar.transparent(flat)
        v-list.pa-0
          v-list-tile
            v-list-tile-action
              img(src="/img/nekokoro32.png")
            v-list-tile-content
              v-list-tile-title ねこたく
      v-list.pt-0
        v-divider
        v-list-tile(v-for="item in navItems", :key="item.title", @click="item.onClick && item.onClick()")
          v-list-tile-action
            v-icon {{item.icon}}
          v-list-tile-content
            v-list-tile-title {{item.title}}
    v-toolbar.primary.app-bar(dark)
      v-toolbar-side-icon(@click.stop="navOpen = !navOpen")
      v-toolbar-title {{room.title}}
    room-info-list.room-info-list(:room="room")
    .room-flex
      transition(name="slide")
        div.chat-container(v-if="roomTab === 'chat'")
          chat-tab
      transition(name="slide")
        character-list(v-if="roomTab === 'character'")
      transition(name="slide")
        map-tab(v-if="roomTab === 'map'")
    .room-bottom-nav
      v-card
        v-bottom-nav.transparent(:active.sync="roomTab")
          v-btn.teal--text(flat, value="chat")
            span チャット
            v-icon mdi-forum
          v-btn.teal--text(flat, value="character")
            span キャラクター
            v-icon mdi-account-multiple
          v-btn.teal--text(flat, value="map")
            span マップ
            v-icon mdi-map-marker-radius
    room-edit-dialog(v-model="redOpen", :onRequestChangeState="newValue => { redOpen = newValue; }")
  loading(v-else)
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ChatTab from './ChatTab.vue';
import CharacterList from './CharacterList.vue';
import Loading from './Loading.vue';
import MapTab from './MapTab.vue';
import RoomEditDialog from './RoomEditDialog.vue';
import RoomInfoList from './RoomInfoList.vue';

export default {
  components: {
    ChatTab,
    CharacterList,
    Loading,
    MapTab,
    RoomEditDialog,
    RoomInfoList,
  },
  data() {
    return {
      navOpen: false,
      navItems: [
        {
          icon: 'mdi-settings',
          title: '卓設定',
          onClick: () => {
            this.navOpen = false;
            setTimeout(() => {
              this.redOpen = true;
            });
          },
        },
        {
          icon: 'mdi-logout',
          title: 'ログアウト',
          onClick: () => this.$router.push({ name: 'lobby' }),
        },
      ],
      redOpen: false,
      roomTab: 'chat',
    };
  },
  computed: mapState([
    'room',
  ]),
  methods: mapActions([
    'joinRoom',
    'leaveRoom',
  ]),
  mounted() {
    const {
      id,
    } = this.$route.params;

    this.joinRoom({ id, router: this.$router });
  },
  beforeDestroy() {
    this.leaveRoom();
  },
};
</script>

<style lang="stylus" scoped>
.room
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .room-info-list
    position: relative;
    height: 0;
    z-index: 1;

  > *
    flex: 0 0 auto;

  .room-flex
    flex: 1 1 0;
    position: relative;

  .room-bottom-nav
    z-index: 1;
    height: 56px;
    background-color: white;

    .bottom-nav
      box-shadow: none;
      transform: none;

  .chat-container
    height: 100%;
    width: 100%;
</style>
