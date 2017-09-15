<template lang="pug">
  v-card
    v-card-title(primary-title)
      v-layout(row)
        v-avatar(v-if="room.isLocked", size="30px")
          v-icon lock
        .headline {{room.title}}
    v-card-text.pa-0
      room-info-list(:room="room")
    v-card-actions
      v-spacer
      v-btn(primary, :to="{ name: RouteNames.Room, params: { id: room.id } }") 参加
      //- v-btn(secondary) 見学
</template>

<script>
import * as RouteNames from '../constants/route';
import RoomInfoList from './RoomInfoList.vue';

export default {
  components: {
    RoomInfoList,
  },
  data() {
    return {
      RouteNames,
    };
  },
  props: [
    'room',
  ],
};
</script>
