<template lang="pug">
    v-toolbar(app dark fixed color="primary")
      nekokoro(:size="32")
      v-toolbar-title
        v-layout(row)
          v-avatar.mr-1(v-if="room.isLocked" size="24px")
            v-icon(dark) lock_outline
          div {{room.title}}
      v-spacer
      room-menu.mr-0(:messages="messages" :room="room")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Nekokoro from '@/browser/atoms/Nekokoro.vue';
import RoomMenu from '@/browser/moleculers/RoomMenu.vue';
import Message from '@/models/Message';
import Room from '@/models/Room';

@Component({
  components: {
    Nekokoro,
    RoomMenu,
  },
})
export default class RoomAppBar extends Vue {
  @Prop({ required: true }) messages!: Message[];
  @Prop({ required: true }) room!: Room;
}
</script>
