<template lang="pug">
  v-container.pt-5
    loading(v-if="messagesLoading && false")
    message-list-item(
      :key="message.id"
      :message="message"
      v-for="message in messages.slice(-(messagesLimit || 100))",
      v-else
    )
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Loading from '@/browser/components/Loading.vue';
import MessageListItem from '@/browser/components/MessageListItem.vue';

export default {
  components: {
    Loading,
    MessageListItem,
  },
  computed: {
    ...mapGetters([
      'messagesLimit',
    ]),
    ...mapState([
      'messages',
      'messagesLoading',
    ]),
  },
};
</script>

<style lang="stylus" scoped>
.container
  padding-bottom 50vh
</style>
