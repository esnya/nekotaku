<template lang="pug">
  .neko-chat-tab(v-if="room")
    v-layout(justify-center)
      room-info-list(:room="room" :members="members || {}")
    chat-channel-tabs(:messages="messages" :room="room")
    portrait-panel
    chat-control(:members="members || {}" :room="room")
</template>

<script>
import { bindAsList, bindAsObject } from '@/browser/models';
import ChatChannelTabs from '@/browser/moleculers/ChatChannelTabs.vue';
import ChatControl from '@/browser/moleculers/ChatControl.vue';
import PortraitPanel from '@/browser/components/PortraitPanel.vue';
import RoomInfoList from '@/browser/moleculers/RoomInfoList.vue';

export default {
  mixins: [
    bindAsList('messages'),
    bindAsObject('members'),
  ],
  components: {
    ChatChannelTabs,
    ChatControl,
    PortraitPanel,
    RoomInfoList,
  },
  props: {
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>
