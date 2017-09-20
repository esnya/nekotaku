<template lang="pug">
  v-navigation-drawer(
    absolute
    light
    overflow
    temporary
    :value="value"
    @input="v => $emit('input', v)"
  )
    v-toolbar.transparent(flat)
      v-list.pa-0
        v-list-tile
          v-list-tile-action
            img(src="/img/nekokoro32.png")
          v-list-tile-content
            v-list-tile-title ねこ卓
    v-list.pt-0
      v-divider
      v-list-tile(@click.stop="() => { close(); redOpen = true; }")
        v-list-tile-action
          v-icon mdi-settings
        v-list-tile-content
          v-list-tile-title 卓設定
      v-list-tile(@click.stop="() => { close(); rpedOpen = true; }")
        v-list-tile-action
          v-icon lock
        v-list-tile-content
          v-list-tile-title パスワード設定
      v-list-tile(:disabled="!room.isLocked", @click.stop="() => { if (room.isLocked) { close(); rpcdOpen = true; } }")
        v-list-tile-action
          v-icon lock_open
        v-list-tile-content
          v-list-tile-title パスワード解除
      v-list-tile(@click.stop="() => { close(); rrdOpen = true; }")
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
    close() {
      this.$emit('input', false);
    },
  },
  props: ['value'],
};
</script>

<style lang="stylus" scoped>
.neko-title
  align-items center
</style>
