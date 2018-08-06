<template lang="pug">
  v-container.pt-5
    loading(v-if="messagesLoading")
    message-list-item(
      :key="message.id"
      :message="message"
      v-for="message in messages",
      v-else
    )
</template>

<script>
import { mapState } from 'vuex';
import Loading from './Loading.vue';
import MessageListItem from './MessageListItem.vue';

export default {
  components: {
    Loading,
    MessageListItem,
  },
  computed: mapState([
    'messages',
    'messagesLoading',
  ]),
};
</script>

<style lang="stylus" scoped>
.container
  padding-bottom 50vh
</style>
