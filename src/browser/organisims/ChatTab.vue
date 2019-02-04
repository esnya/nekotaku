<template lang="pug">
  div
    message-list(:messages="messages")
    chat-control(:members="members" :room="room")
</template>

<script>
import MessageList from '@/browser/components/MessageList.vue';
import ChatControl from '@/browser/organisims/ChatControl.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [bindAsList('messages')],
  components: {
    ChatControl,
    MessageList,
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
