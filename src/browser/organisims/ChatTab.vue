<template lang="pug">
  .neko-chat-tab.pt-5
    message-list(:messages="messages")
    portrait-panel
    chat-control(:members="members" :room="room")
</template>

<script>
import MessageList from '@/browser/components/MessageList.vue';
import PortraitPanel from '@/browser/components/PortraitPanel.vue';
import ChatControl from '@/browser/organisims/ChatControl.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [bindAsList('messages')],
  components: {
    ChatControl,
    MessageList,
    PortraitPanel,
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

<style lang="stylus" scoped>
.neko-chat-tab
  width 100vw
  height 100vh
  overflow-x hidden
  overflow-y auto
  -webkit-overflow-scrolling touch
</style>
