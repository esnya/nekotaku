<template lang="pug">
  v-container
    message-list-item(
      v-for="message in messages",
      :key="message.id"
      :message="message"
    )
</template>

<script>
import { mapState } from 'vuex';
import MessageListItem from './MessageListItem.vue';

export default {
  components: {
    MessageListItem,
  },
  computed: mapState({
    messages: 'messages',
  }),
};
</script>

<style lang="stylus" scoped>
.container
  padding-top 42px
  padding-bottom 50vh
</style>
