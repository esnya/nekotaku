<template lang="pug">
  div
    v-toolbar.primary(dark)
      img(src="/img/nekokoro32.png")
      v-toolbar-title ねこたく
    room-list
    room-create-dialog
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
