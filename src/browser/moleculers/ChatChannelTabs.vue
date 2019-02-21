<template lang="pug">
  v-tabs.neko-channel-tabs(:value="tab" @change="onSelectTab")
    v-tab(
      :channel="channel"
      :key="`t${i}`"
      v-for="(channel, i) in room.channels"
    ) {{channel}}
    v-tab-item.neko-channel-tab-item(:key="`i${i}`" v-for="(channel, i) in room.channels")
      message-list(:messages="messages.filter(m => m.channel === channel)")
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import MessageList from '@/browser/moleculers/MessageList.vue';

export default {
  components: {
    MessageList,
  },
  computed: {
    ...mapState(['chatControl']),
    tab() {
      const {
        chatControl,
        room,
      } = this;
      return Math.max(room.channels.indexOf(chatControl.channel), 0);
    },
  },
  methods: {
    ...mapMutations(['selectChannel']),
    onSelectTab(i) {
      this.selectChannel(this.room.channels[i] || 'メイン');
    },
  },
  props: {
    messages: {
      required: true,
      type: Array,
    },
    room: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-channel-tab-item
  max-height calc(100vh - 56px - 32px - 48px - 56px - 60px)
  overflow hidden
</style>
