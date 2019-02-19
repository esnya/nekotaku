<template lang="pug">
  v-data-iterator(
    row
    wrap
    content-tag="v-layout"
    :items="searchResults"
    :pagination.sync="pagination"
  )
    room-search-input(slot="header" v-model="searchText")
    v-flex(
      sm12
      md6
      slot="item"
      slot-scope="props"
    )
      room-list-item(:room="props.item")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Room from '@/types/data/Room';
import RoomListItem from '@/browser/moleculers/RoomListItem.vue';
import RoomSearchInput from '@/browser/atoms/RoomSearchInput.vue';

@Component({
  components: {
    RoomListItem,
    RoomSearchInput,
  },
})
export default class RoomList extends Vue {
  @Prop({ required: true }) private rooms!: Room[];

  pagination = {
    page: 0,
    rowsPerPage: 25,
  };
  searchText: string | null = null;

  get searchResults(): Room[] {
    const {
      rooms,
      searchText,
    } = this;

    if (!searchText) return rooms;
    return rooms.filter(room => room.title.match(searchText));
  }
}
</script>
