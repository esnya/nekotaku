<template lang="pug">
  div
    v-toolbar.primary.app-bar(dark)
      v-toolbar-side-icon(@click.stop="navOpen = !navOpen")
      v-toolbar-title {{room.title}}
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
      this.$router.push({ name: 'lobby' });
    },
    openRoomEditDialog() {
      this.navOpen = false;
      this.redOpen = true;
    },
  },
};
</script>
