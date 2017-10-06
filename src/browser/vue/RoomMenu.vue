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
      v-list-tile(@click="exportLog")
        v-list-tile-action
          v-icon mdi-file-export
        v-list-tile-content
          v-list-tile-title ログ保存
      v-divider
      v-list-tile(@click="logout")
        v-list-tile-action
          v-icon mdi-logout
        v-list-tile-content
          v-list-tile-title 卓から出る
      v-divider
      v-list-tile(@click="cdOpen = true")
        v-list-tile-action
          v-icon mdi-update
        v-list-tile-content
          v-list-tile-title 更新履歴
    room-edit-dialog(v-model="redOpen")
    room-password-clear-dialog(v-model="rpcdOpen")
    room-password-edit-dialog(v-model="rpedOpen")
    room-remove-dialog(v-model="rrdOpen")
    changelog-dialog(v-model="cdOpen")
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import * as RouteNames from '../constants/route';
import ChangelogDialog from './ChangelogDialog.vue';
import RoomEditDialog from './RoomEditDialog.vue';
import RoomPasswordClearDialog from './RoomPasswordClearDialog.vue';
import RoomPasswordEditDialog from './RoomPasswordEditDialog.vue';
import RoomRemoveDialog from './RoomRemoveDialog.vue';

export default {
  components: {
    ChangelogDialog,
    RoomEditDialog,
    RoomPasswordClearDialog,
    RoomPasswordEditDialog,
    RoomRemoveDialog,
  },
  computed: mapState([
    'room',
    'messages',
  ]),
  data() {
    return {
      redOpen: false,
      rpedOpen: false,
      rpcdOpen: false,
      rrdOpen: false,
      cdOpen: false,
    };
  },
  methods: {
    logout() {
      this.$router.push({ name: RouteNames.Lobby });
    },
    exportLog() {
      const { title } = this.room;
      const filename = `${title}.html`;

      const html = new Blob([
        '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>',
        title,
        '</title><style>td { vertical-align: top; }</style></head><body>',
        '<h1>', title, '</h1>',
        '<table><tbody>',
        this.messages.map(m => `<tr style="color: ${m.color};"><td>${m.name}</td><td>${m.body.map(b => b.text).join('<br>')}</td><td>${moment(m.createdAt).format('lll')}</td><tr/>`).join(''),
        '</tbody></table></body></html>',
      ], { type: 'text/html', name: filename });
      const url = URL.createObjectURL(html);

      const a = document.createElement('a');
      a.href = url;
      // a.target = '_blank';
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    },
  },
  props: ['value'],
};
</script>

<style lang="stylus" scoped>
.neko-title
  align-items center
</style>
