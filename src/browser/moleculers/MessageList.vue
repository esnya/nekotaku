<template lang="pug">
  v-container.neko-message-list.neko-chat-scroll
    message-list-item(
      :key="message.id"
      :message="message"
      v-for="message in messages.slice(-(messagesLimit || 100))",
    )
</template>

<script>
import { mapGetters } from 'vuex';
import MessageListItem from '@/browser/components/MessageListItem.vue';

export default {
  components: {
    MessageListItem,
  },
  computed: {
    ...mapGetters([
      'messagesLimit',
    ]),
  },
  props: {
    messages: {
      required: true,
      type: Array,
    },
  },
};
</script>

<style lang="stylus" scoped>
.neko-message-list
  padding-bottom 50vh
  max-height calc(100vh - 56px - 32px - 48px - 56px - 60px)
  overflow-y auto
  -webkit-overflow-scrolling touch
</style>
