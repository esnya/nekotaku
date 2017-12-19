<template lang="pug">
  v-card.elevation-1.my-3(:style="styles.container", ref="root")
    v-card-title.px-2.pt-2.pb-1
      div {{message.name}}
      v-spacer
      from-now.caption(:time="message.createdAt")
    v-divider
    v-card-text.pa-2
      message-body(:nodes="message.body")
</template>

<script>
import { inOutSign } from 'ease-component';
import scroll from 'scroll';
import playNoticeSound from '../utilities/noticeSound';
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
    const item = this.$refs.root.$el;
    if (!item.closest) return;

    const scrollable = item.closest('.scroll');
    const prev = item.previousElementSibling;

    const isNewMessage = Date.now() - this.message.createdAt < 1000;
    if (isNewMessage) playNoticeSound();

    const margin = 56 + 50 + 16;

    const scrollableHeight = scrollable.offsetHeight - margin;
    if (prev && prev.offsetTop < scrollable.scrollTop + scrollableHeight) {
      const scrollTo = (item.offsetTop + item.offsetHeight + 8) - scrollableHeight;

      if (scrollTo > scrollable.scrollTop) {
        if (isNewMessage) {
          scroll.top(scrollable, scrollTo, { duration: 400, ease: inOutSign });
        } else {
          scrollable.scrollTop = scrollTo;
        }
      }
    }
  },
};
</script>
