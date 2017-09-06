<template lang="pug">
  .chat
    .chat-flex(data-scrollable)
      v-container.pt-2.chat-container
        message-list
    portrait-panel
    chat-control
</template>

<script>
import ChatControl from './ChatControl.vue';
import MessageList from './MessageList.vue';
import PortraitPanel from './PortraitPanel.vue';

export default {
  components: {
    ChatControl,
    MessageList,
    PortraitPanel,
  },
};
</script>

<style lang="stylus" scoped>
.chat
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  > *
    flex: 0 0 auto;

  .chat-flex
    flex: 1 1 0;
    overflow: auto;

    .chat-container
      padding-bottom: 50%;
</style>
