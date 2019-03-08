<template lang="pug">
  v-bottom-nav.neko-room-bottom-nav(
    color="white"
    :fixed="true"
    :value="true"
  )
    v-btn(flat color="primary" :to="chat")
      span チャット
      v-icon mdi-forum
    v-btn(flat color="primary" :to="memos")
      span 共有メモ
      v-icon mdi-note-multiple
    v-btn(flat color="primary" :to="characters")
      span キャラクター
      v-icon mdi-account-multiple
    v-btn(flat color="primary" :to="map")
      span マップ
      v-icon mdi-map-marker-radius
</template>

<script lang="ts">
import { RouteConfig } from 'vue-router';
import { Component, Vue } from 'vue-property-decorator';
import {
  Chat,
  Memos,
  Characters,
  Map,
} from '@/browser/routes';

@Component
export default class RoomBottomNav extends Vue {
  get chat(): RouteConfig {
    return Chat;
  }

  get memos(): RouteConfig {
    return Memos;
  }

  get characters(): RouteConfig {
    return Characters;
  }

  get map(): RouteConfig {
    return Map;
  }
}
</script>
