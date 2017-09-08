<template lang="pug">
  div
    v-toolbar.primary.app-bar(dark)
      v-toolbar-side-icon(@click.stop="navOpen = !navOpen")
      v-toolbar-title.neko-flex-row.neko-title(:class="{ 'ml-0': room.isLocked }")
        v-avatar.mr-1(v-if="room.isLocked" size="24px")
          v-icon(dark) lock_outline
        div {{room.title}}
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
        v-list-tile(@click.stop="openRoomEditDialog")
          v-list-tile-action
            v-icon mdi-settings
          v-list-tile-content
            v-list-tile-title 卓設定
        v-list-tile(@click="logout")
          v-list-tile-action
            v-icon mdi-logout
          v-list-tile-content
            v-list-tile-title ログアウト
    room-edit-dialog(v-model="redOpen", :onRequestChangeState="newValue => { redOpen = newValue; }")
</template>

<script>
import { mapState } from 'vuex';
import * as RouteNames from '../constants/route';
import RoomEditDialog from './RoomEditDialog.vue';

export default {
  components: {
    RoomEditDialog,
  },
  computed: mapState([
    'room',
  ]),
  data() {
    return {
      navOpen: false,
      redOpen: false,
    };
  },
  methods: {
    logout() {
      this.$router.push({ name: RouteNames.Lobby });
    },
    openRoomEditDialog() {
      this.navOpen = false;
      this.redOpen = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-title
  align-items center
</style>
