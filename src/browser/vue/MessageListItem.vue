<template lang="pug">
  v-card.elevation-1.my-2(:style="styles.container", ref="root")
    v-card-title.px-2.pt-2.pb-1
      div {{message.name}}
      v-spacer
      from-now.caption(:time="message.createdAt")
    v-divider
    v-card-text.pa-2
      message-body(:nodes="message.body")
</template>

<script>
import FromNow from './FromNow.vue';
import MessageBody from './MessageBody.vue';

export default {
  components: {
    FromNow,
    MessageBody,
  },
  computed: {
    styles() {
      return {
        container: {
          color: this.message.color,
        },
      };
    },
  },
  props: [
    'message',
  ],
  mounted() {
    const item = this.$refs.root;
    const scrollable = item.closest('[data-scrollable]');
    scrollable.scrollTop += item.offsetHeight + 8;
  },
};
</script>
