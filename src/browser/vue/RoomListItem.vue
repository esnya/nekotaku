<template lang="pug">
  v-card
    v-card-title(primary-title)
      div
        .headline.mb-0 {{ room.title }}
        room-info-list(:room="room")
    v-card-actions
      v-spacer
      router-link(:to="{ name: 'room', params: { id: room.id }}")
        v-btn(primary) 参加
      v-btn(secondary) 見学
</template>

<script>
import RoomInfoList from './RoomInfoList.vue';

export default {
  components: {
    RoomInfoList,
  },
  props: [
    'room',
  ],
};
</script>
