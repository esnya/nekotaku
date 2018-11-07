<template lang="pug">
  .app
    v-toolbar.primary(dark fixed)
      img(src="/img/nekokoro32.png")
      v-toolbar-title {{title}}
      v-spacer
      v-menu.mr-0(offset-y)
        v-btn(icon slot="activator")
          v-icon more_vert
        v-list.pt-0
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
    main
      v-container(fluid :grid-list-md="true")
        room-list
      room-create-dialog
    changelog-dialog(v-model="cdOpen")
    feedback-dialog(v-model="fdOpen")
</template>

<script>
import { mapActions } from 'vuex';
import config from '../config';
import ChangelogDialog from './ChangelogDialog.vue';
import FeedbackDialog from './FeedbackDialog.vue';
import RoomCreateDialog from './RoomCreateDialog.vue';
import RoomList from './RoomList.vue';

export default {
  components: {
    ChangelogDialog,
    FeedbackDialog,
    RoomCreateDialog,
    RoomList,
  },
  computed: {
    title: () => config.title,
  },
  data() {
    return {
      cdOpen: false,
      fdOpen: false,
    };
  },
  methods: mapActions([
    'joinLobby',
    'leaveLobby',
  ]),
  mounted() {
    document.title = this.title;
    this.joinLobby();
  },
  beforeDestroy() {
    this.leaveLobby();
  },
};
</script>

<style lang="stylus" scoped>
.lobby
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  > *
    flex: 0 0 auto;

  .lobby-flex
    flex: 1 1 0;
    overflow: auto;
</style>
