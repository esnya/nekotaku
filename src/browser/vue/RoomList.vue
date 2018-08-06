<template lang="pug">
  v-layout.row.wrap.pb-5
    v-flex.px-2.pb-4(xs12)
      v-text-field(
        single-line
        hide-details
        label="検索"
        v-model="search"
        append-icon="search"
      )
    v-flex(sm12, md6, v-for="room in results", :key="room.id")
      room-list-item(:room="room")
</template>

<script>
import { mapState } from 'vuex';
import RoomListItem from './RoomListItem.vue';

export default {
  components: {
    RoomListItem,
  },
  computed: {
    ...mapState([
      'rooms',
    ]),
    results() {
      const {
        search,
        rooms,
      } = this;

      return search ? rooms.filter(r => r.title.match(search)) : rooms;
    },
  },
  data() {
    return {
      search: null,
    };
  },
};
</script>
