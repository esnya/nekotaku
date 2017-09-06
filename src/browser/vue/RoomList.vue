<template lang="pug">
  .neko-scroll
    v-container(fluid, :grid-list-md="true")
      v-layout.row.wrap.pb-5
        v-flex(xs12, sm6, md4, v-for="room in rooms", :key="room.id")
          room-list-item(:room="room")
</template>

<script>
import { mapState } from 'vuex';
import RoomListItem from './RoomListItem.vue';

export default {
  components: {
    RoomListItem,
  },
  computed: mapState([
    'rooms',
  ]),
};
</script>
