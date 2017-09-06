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
