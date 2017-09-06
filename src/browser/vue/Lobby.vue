<template lang="pug">
  div.neko-flex-container
    v-toolbar.primary(dark)
      img(src="/img/nekokoro32.png")
      v-toolbar-title ねこたく
    .neko-flex
        room-list
    room-create-dialog.neko-fab
</template>

<script>
import { mapActions } from 'vuex';
import RoomCreateDialog from './RoomCreateDialog.vue';
import RoomList from './RoomList.vue';

export default {
  components: {
    RoomCreateDialog,
    RoomList,
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
