<template lang="pug">
  .neko-room-container(v-if="room")
    room-app-bar(:messages="messages" :room="room")
    main
      chat-tab(:members="members" :messages="messages" :room="room" v-show="roomTab === '0'")
      memo-list(v-show="roomTab === '1'")
      character-tab(
        :characters="characters"
        :room="room"
        v-show="roomTab === '2'"
      )
      map-tab(:characters="characters" :room="room" v-show="roomTab === '3'")
      dice-panel(:messages="messages")
      v-bottom-nav(
        color="white"
        :active.sync="roomTab"
        :class="{ 'no-shadow': roomTab !== '1' || roomTab !== '2' }"
        :fixed="true"
        :value="true"
      )
        v-btn(flat color="primary" value="0")
          span チャット
          v-icon mdi-forum
        v-btn(flat color="primary" value="1")
          span 共有メモ
          v-icon mdi-note-multiple
        v-btn(flat color="primary" value="2")
          span キャラクター
          v-icon mdi-account-multiple
        v-btn(flat color="primary" value="3")
          span マップ
          v-icon mdi-map-marker-radius
  loading(v-else)
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as Routes from '../routes';
import { IntervalTimer } from '../utilities/timer';
import { mapGetters } from 'vuex';
import CharacterTab from '@/browser/moleculers/CharacterTab.vue';
import ChatTab from '@/browser/moleculers/ChatTab.vue';
import DicePanel from '@/browser/moleculers/DicePanel.vue';
import Loading from '@/browser/atoms/Loading.vue';
import MapTab from '@/browser/moleculers/MapTab.vue';
import MemoList from '@/browser/components/MemoList.vue';
import NotFoundError from '@/browser/backend/NotFoundError';
import RoomAppBar from '@/browser/moleculers/RoomAppBar.vue';
import UnauthorizedError from '@/browser/backend/UnauthorizedError';
import config from '../config';
import debounce from 'lodash/debounce';
import run from '@/browser/utilities/task';
import sessionStorage from '@/browser/wrappers/sessionStorage';
import { BindAsList, BindAsObject } from '@/browser/decorators/dao';
import memberDAO from '@/browser/dao/memberDAO';
import Member from '@/models/Member';
import Room from '@/models/Room';
import Message from '@/models/Message';
import Character from '@/models/Character';
import messageDAO from '@/browser/dao/messageDAO';
import roomDAO from '@/browser/dao/roomDAO';
import ChatName from '@/models/ChatName';
import chatNameDAO from '@/browser/dao/chatNameDAO';
import characterDAO from '@/browser/dao/characterDAO';
import store from '@/browser/store';

const saveRoomTab = debounce((roomId, roomTab) => {
  sessionStorage.setItem(`nekotaku:${roomId}:roomTab`, roomTab);
}, 1000);

@Component({
  components: {
    CharacterTab,
    ChatTab,
    DicePanel,
    Loading,
    MapTab,
    MemoList,
    RoomAppBar,
  },
})
export default class RoomPage extends Vue {
  @BindAsList(characterDAO) characters!: Character[];
  @BindAsList(chatNameDAO) chatNames!: ChatName[];
  @BindAsList(memberDAO) members!: Member[];
  @BindAsList(messageDAO) messages!: Message[];
  @BindAsObject(roomDAO) room!: Room | null;

  drawer: boolean = false;
  roomTab: string = '0';
  prevRoomTab:string = '0';
  timer: IntervalTimer | null = null;
  notFound: boolean = false;

  get title() {
    return this.room ? `${this.room.title} - ${config.title}` : config.title;
  }

  async updateMember() {
    const chatName = this.chatNames.find(item => item.id === store.state.chatNameId) || {
      name: 'ななしさん',
      color: '#000000',
    };
    await memberDAO.update(chatName);
  }

  @Watch('room')
  watchRoom(room: Room | null) {
    if (!room) return;
    document.title = this.title;

    const roomTab = sessionStorage.getItem(`nekotaku:${room.id}:roomTab`);
    if (roomTab) this.roomTab = roomTab;
  }

  @Watch('roomTab')
  watchRoomTab(roomTab: string, oldValue: string) {
    this.prevRoomTab = oldValue;

    saveRoomTab(this.$route.params.roomId, roomTab);
  }

  created() {
    this.timer = new IntervalTimer(() => this.updateMember(), 10 * 1000);
  }

  destroyed() {
    if (this.timer) this.timer.stop();
  }
}
</script>
