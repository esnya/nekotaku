<template lang="pug">
  div.pt-4
    div(v-for="message in messages", :key="message.id")
      message-list-item(:message="message")
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
