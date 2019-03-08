<template lang="pug">
  v-toolbar.neko-room-app-bar(dark fixed color="primary")
    img(src="/img/nekokoro32.png")
    v-toolbar-title
      v-layout(row)
        v-avatar.mr-1(v-if="isLocked" size="24px")
          v-icon(dark) lock_outline
        div {{title}}
    v-spacer
    room-menu.mr-0(v-if="room")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RoomMenu from '@/browser/components/RoomMenu.vue';
import { BindAsObject } from '@/browser/decorators/dao';
import RoomDAO from '@/browser/dao/RoomDAO';
import Room from '@/models/Room';

@Component({
  components: {
    RoomMenu: RoomMenu as any,
  },
})
export default class RoomAppBar extends Vue {
  @BindAsObject(new RoomDAO()) room!: Room | null;

  get title(): string {
    return this.room ? this.room.title : 'ねこ卓';
  }

  get isLocked(): boolean {
    return (this.room && this.room.isLocked) || false;
  }
}
</script>
