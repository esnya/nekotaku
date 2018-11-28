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
      v-btn(color="primary" @click="join") 参加
</template>

<script>
import * as RouteNames from '../constants/route';
import RoomInfoList from '@/browser/components/RoomInfoList.vue';

export default {
  components: {
    RoomInfoList,
  },
  methods: {
    join() {
      this.$router.push({ name: RouteNames.Room, params: { roomId: this.room.id } });
    },
  },
  props: {
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
