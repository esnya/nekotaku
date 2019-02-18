<template lang="pug">
  v-card
    v-card-title(primary-title)
      v-layout(row)
        v-avatar(size="30px" v-if="room.isLocked")
          v-icon lock
        .headline {{room.title}}
    v-card-text.pa-0
      room-info-list(:room="room")
    v-card-actions
      v-spacer
      join-button(@click="join")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import JoinButton from '@/browser/atoms/JoinButton.vue';
import RoomInfoList from '@/browser/moleculers/RoomInfoList.vue';
import * as RouteNames from '../constants/route';
import Room from '@/types/data/Room';

@Component({
  components: {
    RoomInfoList,
    JoinButton,
  },
})
export default class RoomListItem extends Vue {
  @Prop({ required: true }) private room!: Room;

  private join(): void {
    this.$router.push({ name: RouteNames.Room, params: { roomId: this.room.id } });
  }
}
</script>
