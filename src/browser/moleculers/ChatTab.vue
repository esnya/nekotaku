<template lang="pug">
  .neko-chat-tab
    v-layout(justify-center)
      room-info-list(:room="room" :members="members")
    chat-channel-tabs(:messages="messages" :room="room")
    portrait-panel
    chat-control(:members="members" :room="room")
</template>

<script>
import PortraitPanel from '@/browser/components/PortraitPanel.vue';
import ChatChannelTabs from '@/browser/moleculers/ChatChannelTabs.vue';
import RoomInfoList from '@/browser/moleculers/RoomInfoList.vue';
import ChatControl from '@/browser/moleculers/ChatControl.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [
    bindAsList('messages'),
  ],
  components: {
    ChatChannelTabs,
    ChatControl,
    PortraitPanel,
    RoomInfoList,
  },
  props: {
    members: {
      required: true,
      type: Object,
    },
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
