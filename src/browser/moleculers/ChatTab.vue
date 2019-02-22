<template lang="pug">
  .neko-chat-tab
    v-layout(justify-center)
      room-info-list(:room="room" :members="members")
    chat-channel-tabs(:messages="messages" :room="room")
    portrait-panel
    chat-control(:members="members" :room="room")
</template>

<script>
import ChatChannelTabs from '@/browser/moleculers/ChatChannelTabs.vue';
import ChatControl from '@/browser/moleculers/ChatControl.vue';
import PortraitPanel from '@/browser/components/PortraitPanel.vue';
import RoomInfoList from '@/browser/moleculers/RoomInfoList.vue';

export default {
  components: {
    ChatChannelTabs,
    ChatControl,
    PortraitPanel,
    RoomInfoList,
  },
  props: {
    messages: {
      required: true,
      type: Array,
    },
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
