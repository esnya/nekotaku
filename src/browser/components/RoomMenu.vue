<template lang="pug">
  v-menu(offset-y v-if="room")
    v-btn(icon slot="activator")
      v-icon more_vert
    v-list.pt-0
      v-list-tile(@click="openInNew")
        v-list-tile-action
          v-icon mdi-open-in-new
        v-list-tile-content
          v-list-tile-title 新しいウィンドウ
      v-divider
      v-list-tile(@click="vdOpen = true")
        v-list-tile-action
          v-icon mdi-settings
        v-list-tile-content
          v-list-tile-title 表示設定
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
      v-list-tile(
        :disabled="!room.isLocked"
        @click="() => { if (room.isLocked) { rpcdOpen = true; } }"
      )
        v-list-tile-action
          v-icon lock_open
        v-list-tile-content
          v-list-tile-title パスワード解除
      v-list-tile(@click="taspdOpen = true")
        v-list-tile-action
          v-icon music_note
        v-list-tile-content
          v-list-tile-title TabletopAudio連携
      v-divider
      v-list-tile(@click="rrdOpen = true")
        v-list-tile-action
          v-icon mdi-settings
        v-list-tile-content
          v-list-tile-title 卓削除
      v-divider
      v-list-tile(@click="ledOpen = true")
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
      v-list-tile(@click="fdOpen = true")
        v-list-tile-action
          v-icon star
        v-list-tile-content
          v-list-tile-title フィードバック
      v-list-tile(@click="cdOpen = true")
        v-list-tile-action
          v-icon mdi-update
        v-list-tile-content
          v-list-tile-title 更新履歴
    room-edit-dialog(v-model="redOpen" :room="room")
    room-password-clear-dialog(v-model="rpcdOpen")
    room-password-edit-dialog(v-model="rpedOpen")
    room-remove-dialog(v-model="rrdOpen")
    changelog-dialog(v-model="cdOpen")
    feedback-dialog(v-model="fdOpen")
    tabletop-audio-sound-pad-dialog(:room="room" v-model="taspdOpen")
    chat-view-dialog(v-model="vdOpen")
    log-export-dialog(:messages="messages" :room="room" v-model="ledOpen")
</template>

<script>
import * as RouteNames from '../constants/route';
import ChangelogDialog from '@/browser/components/ChangelogDialog.vue';
import ChatViewDialog from '@/browser/components/ChatViewDialog.vue';
import FeedbackDialog from '@/browser/components/FeedbackDialog.vue';
import LogExportDialog from '@/browser/components/LogExportDialog.vue';
import RoomEditDialog from '@/browser/components/RoomEditDialog.vue';
import RoomPasswordClearDialog from '@/browser/components/RoomPasswordClearDialog.vue';
import RoomPasswordEditDialog from '@/browser/components/RoomPasswordEditDialog.vue';
import RoomRemoveDialog from '@/browser/components/RoomRemoveDialog.vue';
import TabletopAudioSoundPadDialog from '@/browser/components/TabletopAudioSoundPadDialog.vue';
import { bindAsList, bindAsObject } from '@/browser/models';

export default {
  mixins: [
    bindAsList('messages'),
    bindAsObject('room'),
  ],
  components: {
    ChangelogDialog,
    ChatViewDialog,
    LogExportDialog,
    FeedbackDialog,
    RoomEditDialog,
    RoomPasswordClearDialog,
    RoomPasswordEditDialog,
    RoomRemoveDialog,
    TabletopAudioSoundPadDialog,
  },
  data() {
    return {
      cdOpen: false,
      fdOpen: false,
      ledOpen: false,
      redOpen: false,
      rpcdOpen: false,
      rpedOpen: false,
      rrdOpen: false,
      taspdOpen: false,
      vdOpen: false,
    };
  },
  methods: {
    logout() {
      this.$router.push({ name: RouteNames.Lobby });
    },
    openInNew() {
      window.open(
        window.location.href,
        `${Date.now()}${Math.random()}`,
        'location=no,resizable=yes,scrollbars=yes,status=no,toolbar=no',
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-title
  align-items center
</style>
