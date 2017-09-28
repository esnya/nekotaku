<template lang="pug">
  v-menu(offset-y v-if="room")
    v-btn(icon slot="activator")
      v-icon more_vert
    v-list.pt-0
      v-list-tile(@click="redOpen = true")
        v-list-tile-action
          v-icon mdi-settings
        v-list-tile-content
          v-list-tile-title 卓設定
      v-list-tile(@click="rpedOpen = true")
        v-list-tile-action
          v-icon lock
        v-list-tile-content
          v-list-tile-title パスワード設定
      v-list-tile(:disabled="!room.isLocked", @click="() => { if (room.isLocked) { rpcdOpen = true; } }")
        v-list-tile-action
          v-icon lock_open
        v-list-tile-content
          v-list-tile-title パスワード解除
      v-list-tile(@click="rrdOpen = true")
        v-list-tile-action
          v-icon mdi-settings
        v-list-tile-content
          v-list-tile-title 卓削除
      v-divider
      v-list-tile(@click="logout")
        v-list-tile-action
          v-icon title
        v-list-tile-content
          v-list-tile-title ログアウト
    room-edit-dialog(v-model="redOpen")
    room-password-clear-dialog(v-model="rpcdOpen")
    room-password-edit-dialog(v-model="rpedOpen")
    room-remove-dialog(v-model="rrdOpen")
</template>

<script>
import { mapState } from 'vuex';
import * as RouteNames from '../constants/route';
import RoomEditDialog from './RoomEditDialog.vue';
import RoomPasswordClearDialog from './RoomPasswordClearDialog.vue';
import RoomPasswordEditDialog from './RoomPasswordEditDialog.vue';
import RoomRemoveDialog from './RoomRemoveDialog.vue';

export default {
  components: {
    RoomEditDialog,
    RoomPasswordClearDialog,
    RoomPasswordEditDialog,
    RoomRemoveDialog,
  },
  computed: mapState([
    'room',
  ]),
  data() {
    return {
      redOpen: false,
      rpedOpen: false,
      rpcdOpen: false,
      rrdOpen: false,
    };
  },
  methods: {
    logout() {
      this.$router.push({ name: RouteNames.Lobby });
    },
  },
  props: ['value'],
};
</script>

<style lang="stylus" scoped>
.neko-title
  align-items center
</style>
