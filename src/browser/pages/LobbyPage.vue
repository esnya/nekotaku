<template lang="pug">
  .app
    v-toolbar.primary(dark fixed)
      img(src="/img/nekokoro32.png")
      v-toolbar-title {{title}}
      v-spacer
      v-menu.mr-0(offset-y bottom left)
        v-btn(icon slot="activator")
          v-icon more_vert
        v-list.pt-0
          v-list-tile(@click="fdOpen = true")
            v-list-tile-action
              v-icon star
            v-list-tile-content
              v-list-tile-title フィードバック
          v-list-tile(@click="cdOpen = true")
            v-list-tile-action
              v-icon mdi-update
            v-list-tile-content
              v-list-tile-title 更新履歴
    main
      v-container(fluid :grid-list-md="true")
        room-list(:rooms="rooms")
        add-fab(@click="rcOpen = true")
    room-create-dialog(v-model="rcOpen")
    changelog-dialog(v-model="cdOpen")
    feedback-dialog(v-model="fdOpen")
</template>

<script lang="ts">
import * as Routes from '@/browser/routes';
import { BindAsList } from '../decorators/dao';
import { Component, Prop, Vue } from 'vue-property-decorator';
import AddFab from '@/browser/atoms/AddFab.vue';
import ChangelogDialog from '@/browser/moleculers/ChangelogDialog.vue';
import FeedbackDialog from '@/browser/moleculers/FeedbackDialog.vue';
import Room, { RoomAdd } from '@/models/Room';
import RoomCreateDialog from '@/browser/moleculers/RoomCreateDialog.vue';
import RoomList from '@/browser/moleculers/RoomList.vue';
import roomDAO from '../dao/roomDAO';
import config from '../config';

@Component({
  components: {
    AddFab,
    ChangelogDialog,
    FeedbackDialog,
    RoomCreateDialog,
    RoomList,
  },
})
export default class LobbyPage extends Vue {
  @BindAsList(roomDAO, { reverse: true }) rooms!: Room[];

  cdOpen: boolean = false;
  fdOpen: boolean = false;
  rcOpen: boolean = false;

  get title() {
    return config.title;
  }

  async createRoom(room: RoomAdd) {
    const roomId = await roomDAO.add(room);
    this.$router.push({ name: Routes.Room.name, params: { roomId } });
  }

  created() {
    document.title = this.title;
  }
}
</script>

<style lang="stylus" scoped>
.lobby
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  > *
    flex: 0 0 auto;

  .lobby-flex
    flex: 1 1 0;
    overflow: auto;
</style>
