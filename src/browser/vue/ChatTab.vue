<template lang="pug">
  v-layout(column)
    v-flex.scroll(v-scroll="'y'")
      message-list.message-list
    dice-panel
    portrait-panel
    chat-control.controll
</template>

<script>
import ChatControl from './ChatControl.vue';
import DicePanel from './DicePanel.vue';
import MessageList from './MessageList.vue';
import PortraitPanel from './PortraitPanel.vue';

export default {
  components: {
    ChatControl,
    DicePanel,
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
