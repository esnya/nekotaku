<template lang="pug">
  .app
    v-toolbar.primary(dark fixed)
      img(src="/img/nekokoro32.png")
      v-toolbar-title ねこ卓
      v-spacer
      v-menu.mr-0(offset-y)
        v-btn(icon slot="activator")
          v-icon more_vert
        v-list.pt-0
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
</template>

<script>
import { mapActions } from 'vuex';
import ChangelogDialog from './ChangelogDialog.vue';
import RoomCreateDialog from './RoomCreateDialog.vue';
import RoomList from './RoomList.vue';

export default {
  components: {
    ChangelogDialog,
    RoomCreateDialog,
    RoomList,
  },
  data() {
    return {
      cdOpen: false,
    };
  },
  methods: mapActions([
    'joinLobby',
    'leaveLobby',
  ]),
  mounted() {
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
