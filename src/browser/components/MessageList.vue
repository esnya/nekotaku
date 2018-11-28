<template lang="pug">
  v-container.pt-5
    message-list-item(
      :key="message.id"
      :message="message"
      v-for="message in messages.slice(-(messagesLimit || 100))",
    )
</template>

<script>
import { mapGetters } from 'vuex';
import MessageListItem from '@/browser/components/MessageListItem.vue';
import { bindAsList } from '@/browser/models';

export default {
  mixins: [
    bindAsList('messages'),
  ],
  components: {
    MessageListItem,
  },
  computed: {
    ...mapGetters([
      'messagesLimit',
    ]),
  },
};
</script>

<style lang="stylus" scoped>
.container
  padding-bottom 50vh
</style>
