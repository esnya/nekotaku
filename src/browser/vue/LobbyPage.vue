<template lang="pug">
  v-app(v-scroll="'y'")
    v-toolbar.primary(dark fixed)
      img(src="/img/nekokoro32.png")
      v-toolbar-title ねこたく
    main
      v-container(fluid, :grid-list-md="true")
        room-list
      room-create-dialog
</template>

<script>
import { mapActions } from 'vuex';
import RoomCreateDialog from './RoomCreateDialog.vue';
import WelcomeMessage from './WelcomeMessage.vue';
import RoomList from './RoomList.vue';

export default {
  components: {
    RoomCreateDialog,
    RoomList,
    WelcomeMessage,
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
