<template lang="pug">
  .neko-chat-tab
    v-layout(justify-center)
      room-info-list(:members="members" :room="room")
    chat-channel-tabs(:messages="messages" :room="room")
    portrait-panel
    chat-control(:members="members" :room="room")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ChatChannelTabs from '@/browser/moleculers/ChatChannelTabs.vue';
import ChatControl from '@/browser/moleculers/ChatControl.vue';
import PortraitPanel from '@/browser/components/PortraitPanel.vue';
import RoomInfoList from '@/browser/moleculers/RoomInfoList.vue';
import Member from '@/models/Member';
import Message from '@/models/Message';
import Room from '@/models/Room';

@Component({
  components: {
    ChatChannelTabs,
    ChatControl,
    PortraitPanel,
    RoomInfoList,
  },
})
export default class ChatTab extends Vue {
  @Prop({ required: true }) members!: Member[];
  @Prop({ required: true }) messages!: Message[];
  @Prop({ required: true }) room!: Room;
}
</script>
