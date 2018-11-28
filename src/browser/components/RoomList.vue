<template lang="pug">
  v-data-iterator.mb-5(
    row
    wrap
    content-tag="v-layout"
    :items="results"
    :pagination.sync="pagination"
  )
    v-text-field(
      append-icon="search"
      label="検索"
      slot="header"
      v-model="search"
    )
    v-flex(
      sm12
      md6
      slot="item"
      slot-scope="props"
    )
      room-list-item(:room="props.item")
</template>

<script>
import RoomListItem from '@/browser/components/RoomListItem.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [
    bindAsList('rooms', true),
  ],
  components: {
    RoomListItem,
  },
  computed: {
    results() {
      const {
        search,
        rooms,
      } = this;

      return search ? rooms.filter(r => r.title.match(search)) : rooms;
    },
  },
  data: () => ({
    search: null,
    pagination: {
      page: 0,
      rowsPerPage: 25,
    },
  }),
};
</script>
