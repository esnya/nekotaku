<template lang="pug">
  .neko-flex-container
    .neko-flex
      .neko-scroll
        message-list.message-list
    portrait-panel
    chat-control.control
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
  .message-list
    padding-top: 42px;
    padding-bottom: 50vw;

  .control
    z-index 5
</style>
